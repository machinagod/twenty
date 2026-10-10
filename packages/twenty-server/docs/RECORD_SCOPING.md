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

- reuses **only** AGPL building blocks — the workspace repository and query
  builders (which have no Enterprise header) and `twenty-shared`;
- adds all new logic under the default AGPL terms;
- emits **no telemetry** and requires **no license key / phone-home** (unlike the
  enterprise feature, which is gated by `enterprisePlanService.isValid()` +
  `billingService.hasEntitlement(RLS)` and refreshes a validity token against
  `twenty.com`).

## 2. Configuration

Rules are edited per workspace in **Settings > Roles > (role) > object permissions >
Record-level**, the slot where upstream shows its locked Enterprise section. Each
rule belongs to one (role, object) pair and holds conditions combined with AND or
OR. Rules apply as soon as they are saved, with no restart.

Rules are stored in `core.recordScopingRule` (one row per role and object, deleted
with the role or object) and managed through the metadata GraphQL API, which needs
the **Roles** settings permission:

```graphql
query { recordScopingRules(roleId: "...") { id objectMetadataId logicalOperator conditions { column operator staticValue currentWorkspaceMemberField } } }
mutation { upsertRecordScopingRule(input: { roleId: "...", objectMetadataId: "...", logicalOperator: "AND",
  conditions: [{ column: "ownerId", operator: "eq", currentWorkspaceMemberField: "id" }] }) { id } }
mutation { deleteRecordScopingRule(input: { roleId: "...", objectMetadataId: "..." }) { id } }
```

A condition compares a **direct column** of the object to either a static value or
a field of the signed-in member:

| Column | Example | Values |
|---|---|---|
| many-to-one relation to a workspace member, or an actor's member | `ownerId`, `createdByWorkspaceMemberId` | `currentWorkspaceMemberField: "id"` |
| other many-to-one relation, `UUID` | `companyId` | UUID, or `in` a list |
| `TEXT` | `email` | text, `in` a list, or `currentWorkspaceMemberField: "userEmail"` |
| `NUMBER`, `NUMERIC` | `employees` | number, or `in` a list |
| `BOOLEAN` | `isClient` | `true` / `false` |
| `SELECT` | `stage` | one of the field's options |

Operators are `eq`, `neq` and `in`; a member value can't be used with `in`. The
server validates every condition against the object's metadata
(`record-scoping-rule/utils/validate-record-scoping-conditions.util.ts`), so a
stored rule can always be rendered to a valid WHERE.

Until 2026-10 the rules lived in the `RECORD_SCOPING_RULES` env var (authored by
role label and object name). The `upgrade:2-45:import-record-scoping-rules-from-env`
command copied them into the table on the first boot of that release; the env var
is no longer read and can be removed.

## 3. Architecture

### Data flow

1. **Store** — `RecordScopingRuleService` (`metadata-modules/record-scoping-rule/`)
   validates and upserts rules, then invalidates the workspace cache key
   `recordScopingRulesByRoleId`.
2. **Cache** — `WorkspaceRecordScopingRulesCacheService` groups the workspace's
   rows by role ID. `workspace-orm.manager.ts` reads that key with the other
   permission maps when a workspace ORM context is loaded, stores it on
   `ORMWorkspaceContext`, and `WorkspaceDataSourceService` copies it onto
   `WorkspaceInternalContext`. Lite contexts carry no roles and are not scoped.
3. **Resolve values** — at query time, `utils/resolve-record-scoping.util.ts` turns
   the current role's rules + the current workspace member into concrete conditions.
4. **Build** — `utils/build-record-scoping-condition.util.ts` renders them to one
   parameterised, alias-qualified `SqlCondition` (`"alias"."column" = :param`).

### Enforcement chokepoint

Since v2.4x upstream replaced TypeORM's query builders with its own SQL builders
(`query-builder/workspace-select-query-builder.ts`,
`query-builder/workspace-mutation-query-builder.ts`). Every read and write now
goes through `WorkspaceRepository.applyRowLevelPermissionPredicateForAlias()`
(`repository/workspace-repository.ts`, AGPL), which runs once per table alias
(main + every join) for SELECT, count, UPDATE, DELETE, soft-delete and restore,
including the record-id pre-checks used by writes. Record scoping hooks in there
via `applyRecordScopingForAlias()`:

- main alias → `addRowAccessCondition()`: kept outside the caller's WHERE, so an
  `orWhere` cannot bypass it, and carried onto mutations built from the select;
- joined aliases → added to the join's ON clause, so related records owned by
  someone else come back as null instead of leaking through relations.

`shouldBypassPermissionChecks` (system/worker contexts) skips it, as before.

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
- One rule per (role, object). Mixing AND and OR needs two rules on different
  objects, not nested groups.
- Lite workspace contexts (`executeInWorkspaceContext(..., { lite: true })`, used by
  calendar/messaging sync) carry no roles and are not scoped.

## 4. Tests

Unit tests live next to each unit and run with no database:

```bash
cd packages/twenty-server && npx jest record-scoping
```

Coverage:

- `utils/__tests__/resolve-record-scoping.util.spec.ts` — owner=me, static, AND/OR,
  multi-rule AND, list member values, fail-closed (missing member / no member /
  no value source), no-op.
- `utils/__tests__/build-record-scoping-condition.util.spec.ts` — role/auth gating,
  alias-qualified SQL + parameters, `neq`/`in`, OR within a rule, AND across rules,
  per-alias parameter names, fail-closed `1 = 0`.
- `utils/__tests__/record-scoping-sql.spec.ts` — drives the **real** workspace
  select/mutation builders: scoped SELECT (an `orWhere` cannot escape it), count,
  DELETE, and a joined relation scoped on its ON clause.
- `twenty-orm/__tests__/workspace-orm.manager.spec.ts` — cached rules exposed on a
  full context, not loaded for lite contexts.
- `metadata-modules/record-scoping-rule/**/__tests__` — scopable columns, condition
  validation, the cache provider, the service, the resolver and the error filter.
- `upgrade-version-command/2-45/utils/__tests__` — the env import (parsing,
  label/name resolution, merging, the command itself) and the table migration.
- Front: `settings/roles/role-permissions/object-level-permissions/record-scoping`
  — column options, draft conversion, the condition row and the section.

The integration spec
`test/integration/graphql/suites/record-scoping.integration-spec.ts` is the gate
that proves the repository actually calls the hook (see `docs/UPSTREAM_SYNC.md`).

### End-to-end verification runbook

To verify against a live database:

1. In Settings > Roles, open a non-admin role, pick an object, and add a
   record-level condition such as Owner is Me. Save the rule.
2. As workspace member A (role `Member`), create records assigned to A and to B.
3. Confirm A's `findMany`/REST list returns only A's records, and that A's
   update/delete of B's record affects 0 rows. Repeat as B.
4. Confirm a role without a rule (e.g. `Admin`) sees everything.
