# Record-level scoping (clean-room) — design

Status: **design + spike**. This document specifies a record-level (row-level)
permission capability that lives entirely on our branch/deployment, built
**clean-room** so it does not depend on Twenty's `/* @license Enterprise */`
code.

It is the output of a research pass into Twenty's enterprise row-level
permissioning, plus a runnable proof-of-concept (see "Spike" below).

---

## 1. Why clean-room (licensing)

Twenty's root `LICENSE` is AGPLv3 **except** files carrying a
`/* @license Enterprise */` header, which are under Twenty's **commercial**
license. Twenty already ships a complete row-level permission feature, but
**every file of it is Enterprise-licensed**, including:

- `engine/metadata-modules/row-level-permission-predicate/**` (data model + management)
- `engine/twenty-orm/utils/apply-row-level-permission-predicates.util.ts` (query injection)
- `engine/twenty-orm/utils/build-row-level-permission-record-filter.util.ts` (filter build)

We must not copy, modify, or run those files outside a paid enterprise license —
even on a private deployment. So this design **reuses only AGPL / `twenty-shared`
building blocks** and adds our own code under the default AGPL terms.

What we *may* reuse (verified AGPL, no enterprise header):

- The workspace ORM query builders — `engine/twenty-orm/repository/workspace-*-query-builder.ts`
  (these are the enforcement chokepoint; they merely *call* the enterprise util).
- `twenty-shared` filter types and helpers, notably
  `RecordGqlOperationFilter` and `computeRecordGqlOperationFilter`.
- The standard GraphQL filter parser (`GraphqlQueryFilterParser`) that already
  translates a `RecordGqlOperationFilter` into TypeORM `WHERE` clauses for the
  normal API path.

---

## 2. How Twenty's enterprise feature works (reference)

Useful as a blueprint; we re-implement the parts we keep.

- **Data model** (`core` schema): `rowLevelPermissionPredicate` and
  `rowLevelPermissionPredicateGroup`, scoped by `(roleId, objectMetadataId,
  fieldMetadataId)`. A predicate compares a field to a static value or to a value
  read from the current workspace member (e.g. `assignee.id == me`). Groups form a
  nestable AND/OR tree.
- **Enforcement** is **application-level WHERE injection**, not Postgres-native
  RLS (the `addRLS` migration only creates the predicate tables — no
  `CREATE POLICY`). On every read/write the workspace query builders call
  `applyRowLevelPermissionPredicates()`, which builds a `RecordGqlOperationFilter`
  for the caller's role and ANDs it onto the query:
  - `workspace-select-query-builder.ts` → `validatePermissions()` → `applyRowLevelPermissionPredicates()`
  - same hook in `workspace-update/delete/soft-delete-query-builder.ts`
  - `group-by-with-records.service.ts` for aggregates.
- **Gating**: the *management* API is gated by
  `enterprisePlanService.isValid() && billingService.hasEntitlement(RLS)`
  (`row-level-permission-predicate.service.ts`). Notably the **runtime
  enforcement util is NOT gated** — it simply applies whatever predicate rows are
  cached. The lock is on the configuration door, not the engine.
- **License validation**: `ENTERPRISE_KEY` is a JWT signed by Twenty's private
  key, verified locally against a hardcoded RSA public key. A short-lived
  validity token is refreshed by `POST {ENTERPRISE_API_URL}/validate` to
  `https://twenty.com/api/enterprise` (default), which also reports seat counts.
  Self-hosted instances additionally emit signup telemetry to
  `https://twenty-telemetry.com` unless `TELEMETRY_ENABLED=false`.

---

## 3. Our design

### 3.1 Rule model

A **record-scoping rule** is one `(roleId, objectNameSingular)` pair plus an
ordered list of conditions combined with `AND`/`OR`. Each condition compares a
field on the object to either a static value or the current workspace member's
field value.

Spike types: `engine/twenty-orm/record-scoping/types/record-scoping-rule.type.ts`.

```ts
type RecordScopingCondition = {
  fieldPath: string;                       // 'stage' | 'assigneeId' | 'createdBy.workspaceMemberId'
  operator: 'eq' | 'neq' | 'in';
  staticValue?: string | number | boolean | (string | number)[];
  currentWorkspaceMemberField?: string;    // e.g. 'id' for "owner = me"
};
type RecordScopingRule = {
  roleId: string;
  objectNameSingular: string;
  logicalOperator: 'AND' | 'OR';
  conditions: RecordScopingCondition[];
};
```

Storage options (pick one when promoting the spike):

- **(a) DB-backed (recommended for production):** a new AGPL `core` table
  `recordScopingRule` (+ `recordScopingCondition`), scoped by `workspaceId,
  roleId, objectMetadataId`. Generate a fast instance command
  (`database:migrate:generate --type fast`). Managed via a small NestJS module +
  GraphQL resolver, cached per workspace like roles are.
- **(b) Config-backed (fastest, no UI):** rules expressed as JSON in an env/config
  variable and loaded at boot. Good enough to ship a fixed policy
  ("every member sees only records they own").

### 3.2 Building the filter (clean-room core)

`buildRecordScopingGqlFilter({ rule, currentWorkspaceMember })` →
`RecordGqlOperationFilter | null` produces the exact filter shape the GraphQL API
already understands. Spike impl:
`engine/twenty-orm/record-scoping/utils/build-record-scoping-gql-filter.util.ts`.

Design decisions:

- **Fail-closed.** If a member-relative condition cannot resolve (no member, or
  missing field) we return a sentinel `MATCH_NOTHING` filter rather than dropping
  the condition. This is stricter than the enterprise builder, which silently
  skips unresolved member values (fail-open for that condition).
- **Dot-paths** build nested leaves for relation/composite fields, e.g.
  `createdBy.workspaceMemberId` → `{ createdBy: { workspaceMemberId: { eq } } }`.
- Returns `null` when there is nothing to scope, so callers can cheaply skip.

### 3.3 Enforcement wiring (the chokepoint)

We mirror the enterprise hook but call **our** AGPL code. Add a private
`applyRecordScoping()` to each workspace query builder and invoke it from the same
place the enterprise hook runs:

- `workspace-select-query-builder.ts` — in `validatePermissions()`, before
  `validateQueryIsPermittedOrThrow(...)`.
- `workspace-update/delete/soft-delete-query-builder.ts` — same `execute()` points
  that already call `applyRowLevelPermissionPredicates()`.
- `group-by-with-records.service.ts` — for aggregates.

`applyRecordScoping()` should:

1. Resolve the caller's `roleId` from
   `internalContext.userWorkspaceRoleMap[authContext.userWorkspaceId]` (exactly
   how the enterprise hook does it).
2. Look up the rule(s) for `(roleId, objectNameSingular)` from a cached
   `recordScopingRuleMap` we add to `WorkspaceInternalContext` (alongside the
   existing flat maps).
3. Call `buildRecordScopingGqlFilter(...)`.
4. Apply the resulting filter by reusing the **existing AGPL**
   `GraphqlQueryFilterParser` (the same component the normal API uses to turn the
   user `filter` into `WHERE`), AND-ed onto the current query. This avoids
   re-implementing the enterprise `Brackets`/`parseKeyFilter` applier.
5. Respect `shouldBypassPermissionChecks` and skip subqueries (no entity
   metadata), matching the enterprise hook's guards.

Because every workspace data access goes through these builders, a single hook
covers REST, GraphQL, internal services, and background jobs.

### 3.4 Edge cases to handle when promoting

- **Writes:** update/delete builders use a direct table reference rather than the
  select alias — preserve that distinction (the enterprise applier exposes a
  `useDirectTableReference` flag for exactly this).
- **Relations & nested reads:** scoping is applied per main entity; relation
  resolvers run their own builders, so scoping composes automatically. Verify
  to-many relation loads also pass through a scoped builder.
- **Aggregates / `groupBy`:** must apply the same filter (enterprise does, via
  `group-by-with-records.service.ts`).
- **Caching & invalidation:** rules join the workspace permissions cache; bust on
  rule change like `rolesPermissions` is busted today.
- **Bypass paths:** system/admin contexts already set
  `shouldBypassPermissionChecks`; keep honoring it so migrations and internal
  maintenance aren't accidentally scoped.

### 3.5 Optional gating

If we want our own on/off switch, gate **rule management** behind a plain feature
flag or env var (no license, no phone-home). The enforcement engine stays
ungated — if no rules exist for a role, nothing is injected.

---

## 4. Spike (what's implemented now)

- `record-scoping/types/record-scoping-rule.type.ts` — rule model.
- `record-scoping/utils/build-record-scoping-gql-filter.util.ts` — filter builder
  with fail-closed semantics.
- `record-scoping/utils/__tests__/build-record-scoping-gql-filter.util.spec.ts` —
  unit tests proving rule → filter translation for: owner = me, static value,
  AND, OR, nested composite path, fail-closed (missing member field / no member),
  and the no-op (empty rule) case.

This proves the security-critical core (rule → exact `RecordGqlOperationFilter`)
in isolation, with no DB. Because the output is the standard GraphQL filter shape,
applying it at the query chokepoint is delegation to existing AGPL code.

### Not yet done (next steps to a shippable feature)

1. Choose storage (3.1a DB-backed recommended) + migration + management module.
2. Add `recordScopingRuleMap` to `WorkspaceInternalContext` and populate from the
   workspace cache.
3. Add `applyRecordScoping()` to the four query builders + group-by, reusing
   `GraphqlQueryFilterParser`.
4. Integration test against Postgres (`test:integration:with-db-reset`):
   seed two members, create a rule "assigneeId = me", assert member A cannot read
   member B's records via find, update, and delete.

---

## 5. Verification

Run the spike unit test:

```bash
cd packages/twenty-server && npx jest build-record-scoping-gql-filter
```
