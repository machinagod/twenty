# Record-level locking (clean-room)

A production, **clean-room** record-level ("row level") locking feature: it
restricts which records of an object a given role may read and write, enforced at
the workspace ORM query chokepoint. It is built entirely under the repository's
default AGPL terms and is **independent of Twenty's `/* @license Enterprise */`
row-level-permission code** — it shares none of those files.

## 1. Why clean-room (licensing)

The root `LICENSE` is AGPLv3 **except** files marked `/* @license Enterprise */`,
which are under Twenty's commercial license. Twenty ships a row-level permission
feature, but **every file of it is Enterprise-licensed** (the
`row-level-permission-predicate` module, the `apply-/build-row-level-permission-*`
ORM utils). Those must not be copied, modified, or run outside a paid license.

This feature therefore:

- reuses **only** AGPL building blocks — the workspace query builders (which have
  no Enterprise header) and `twenty-shared`;
- adds all new logic under the default AGPL terms;
- emits **no telemetry** and requires **no license key / phone-home** (unlike the
  enterprise feature, which is gated by `enterprisePlanService.isValid()` +
  `billingService.hasEntitlement(RLS)` and refreshes a validity token against
  `twenty.com`).

## 2. Configuration

Rules are deploy-time configuration (infra-as-code, reviewable, no migration),
set via the `RECORD_SCOPING_RULES` config variable as a JSON array. Empty disables
the feature.

```jsonc
[
  {
    "roleLabel": "Member",            // matched against the workspace role label
    "objectNameSingular": "opportunity",
    "logicalOperator": "AND",          // AND | OR between the conditions
    "conditions": [
      {
        "column": "assigneeId",        // physical column on the object's table
        "operator": "eq",              // eq | neq | in
        "currentWorkspaceMemberField": "id"  // value taken from the current member
      }
    ]
  },
  {
    "roleLabel": "Member",
    "objectNameSingular": "opportunity",
    "logicalOperator": "AND",
    "conditions": [
      { "column": "stage", "operator": "in", "staticValue": ["NEW", "WON"] }
    ]
  }
]
```

Each condition sets **exactly one** of `staticValue` or
`currentWorkspaceMemberField`. Multiple rules for the same `(role, object)` are
ANDed together. Conditions target **direct table columns** (no relation traversal),
which keeps the injected WHERE valid for SELECT, UPDATE and DELETE alike.

Malformed config does not crash boot: it is logged as an error and the feature is
treated as disabled until fixed (see `RecordScopingConfigService`).

## 3. Architecture

### Data flow

1. **Parse** — `RecordScopingConfigService` reads `RECORD_SCOPING_RULES` once and
   validates it (`config/parse-record-scoping-rules.util.ts`).
2. **Resolve roles** — when a workspace ORM context is loaded
   (`global-workspace-orm.manager.ts`), rule `roleLabel`s are resolved to the
   workspace's role IDs via the cached `flatRoleMaps`
   (`utils/resolve-record-scoping-rules-by-role-id.util.ts`). The result,
   `recordScopingRulesByRoleId`, is stored on the workspace context (optional field
   on `ORMWorkspaceContext` / `WorkspaceInternalContext`).
3. **Resolve values** — at query time, `utils/resolve-record-scoping.util.ts` turns
   the current role's rules + the current workspace member into concrete conditions.
4. **Apply** — `utils/apply-record-scoping.util.ts` ANDs a TypeORM `Brackets` onto
   the query, with columns alias-qualified for SELECT and bare for UPDATE/DELETE.

### Enforcement chokepoint

A private `applyRecordScoping()` is invoked alongside the existing permission checks
in each workspace query builder, so every read/write path is covered:

- `workspace-select-query-builder.ts` — in `validatePermissions()`
- `workspace-update-query-builder.ts` — both execute paths
- `workspace-delete-query-builder.ts` — in `execute()`
- `workspace-soft-delete-query-builder.ts` — in `execute()`

Because all workspace data access flows through these builders, scoping applies to
GraphQL, REST, and internal services that use the workspace ORM.

### Security model

- **Fail-closed.** If a member-relative value cannot resolve (no member, or missing
  field), the query is forced to match no rows (`1 = 0`) rather than dropping the
  condition. This is stricter than Twenty's enterprise builder, which silently skips
  unresolved member values.
- **Parameterised** values only (`:param` / `:...param`) — no string interpolation,
  no SQL injection surface.
- **Role-based.** Contexts without a user role (API keys, system contexts) are not
  scoped here and continue to rely on object/field permissions; the existing
  `shouldBypassPermissionChecks` bypass is honored.

### Known limitations / next steps

- Direct columns only (`eq`/`neq`/`in`). Relation-traversal predicates would need a
  join-aware applier (and are invalid in UPDATE/DELETE).
- Rules are process-level config (one set for the instance). A per-workspace,
  DB-backed management UI is a possible future iteration; the enforcement layer is
  unchanged by that choice.
- Contexts built outside the main ORM path (e.g. the event publisher's internal
  context) leave `recordScopingRulesByRoleId` unset and are not scoped.

## 4. Tests

Unit tests live next to each unit and run with no database:

```bash
cd packages/twenty-server && npx jest record-scoping
```

Coverage (28 tests):

- `config/__tests__/parse-record-scoping-rules.util.spec.ts` — valid/empty/invalid
  config, operator validation, exactly-one-value-source, defaults.
- `utils/__tests__/resolve-record-scoping.util.spec.ts` — owner=me, static, AND/OR,
  multi-rule AND, fail-closed (missing member / no member), no-op.
- `utils/__tests__/resolve-record-scoping-rules-by-role-id.util.spec.ts` — label→id
  mapping, grouping, unmatched labels.
- `utils/__tests__/apply-record-scoping.util.spec.ts` — exercises the **real**
  TypeORM `Brackets` and asserts the generated SQL + bound parameters: alias-qualified
  SELECT, unqualified UPDATE, `IN (:...)` arrays, and the fail-closed `1 = 0` path.

### End-to-end verification runbook

To verify against a live database:

1. Set `RECORD_SCOPING_RULES` to a rule scoping an object to `assigneeId = me`
   (using a real column on that object), then start the server.
2. As workspace member A (role `Member`), create records assigned to A and to B.
3. Confirm A's `findMany`/REST list returns only A's records, and that A's
   update/delete of B's record affects 0 rows. Repeat as B.
4. Confirm a role without a rule (e.g. `Admin`) sees everything.
