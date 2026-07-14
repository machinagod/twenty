# Schema drift: prevention, detection, and normalization

This fork hit a painful class of bug: a **live database whose schema no longer
matches the migrations on disk**, in a way that migrations could never fix. This
doc explains what happened, the guardrails that now prevent it, and how to
normalize a drifted database.

## The three kinds of drift (and what catches each)

| Drift | Example | Guard |
| --- | --- | --- |
| **Entity ↔ migration** — an entity changed but no migration was generated | add a column to `ObjectMetadataEntity`, forget the migration | **Existing CI**: `ci-server.yaml` → _Check for Pending Migrations_ (`database:migrate:generate`). Fails if generating a migration produces anything. |
| **Edited an applied migration** — a committed migration file is modified in place | `setupMetadataTables` edited to add `isCustom` → any DB that already ran it never gets the column | **`scripts/check-migration-immutability.sh`** — locks a sha256 of every timestamped migration; fails if one is edited/removed. Migrations are append-only. |
| **Deployed DB ↔ migrations** — a running database drifted from what the migrations produce | prod set up from a diverged branch; local `twenty_prof` hand-patched | **`scripts/check-schema-drift.sh`** — diffs a live DB's `core` schema against `src/database/reference-schema.manifest.txt`. |

## The root cause we hit

`isCustom` was added to `objectMetadata`/`fieldMetadata` by **editing the
foundational `1700140427984-setupMetadataTables` migration** rather than adding a
new one. TypeORM records that migration as applied, so it never re-runs — every
database created before the edit is permanently missing the column, and
`database:migrate` reports "No pending migrations." No migration can back-fill
it. This is why the immutability guard exists: **never edit an applied migration.**

## The current divergence (2026-07-13 snapshot)

Prod (`ghcr.io/machinagod/twenty:main`, an older `main` image) and the local
`deno-deploy-pg-migration` branch have drifted **in both directions** — they are
different points in the fork's history, not simply one behind the other. Running
`check-schema-drift.sh` against a clone of prod reports:

- **Missing in prod, present on disk (3):** `objectMetadata.isCustom`,
  `fieldMetadata.isCustom`, `emailingDomain.driver`.
- **Present in prod, missing on disk (27 cols + 2 tables):** `isUIEditable` /
  `isUICreatable`, `commandMenuItem.overrides`, `view.overrides`,
  `connectedAccount.archivedAt`, the `messageSuppression` and `unsubscribeTopic`
  tables, `emailingDomain.unsubscribeHostname*`.

Because the drift is bidirectional, **"normalize prod down to the on-disk
migrations" would DELETE live prod features** (`messageSuppression`, `isUIEditable`, …)
— do not do that. The correct convergence is:

1. **Align the checked-out branch with the `main` prod actually runs** — update
   the fork from upstream (`docs/UPSTREAM_SYNC.md`), so the on-disk migrations
   include `isUIEditable`, `messageSuppression`, etc.
2. **Reconcile the fork's own additions** (`isCustom`, `emailingDomain.driver`)
   as proper, new, append-only migrations on top of that main.
3. Only then does a fresh local DB match both `main` and prod, and
   `check-schema-drift.sh` passes against prod.

The only change that is safe to apply to prod *before* that alignment is the
**forward-only additive** one — add the 3 columns prod is missing so the current
code can run there — never dropping prod's extra columns. See
`src/database/normalize-prod-additive.sql` (idempotent `ADD COLUMN IF NOT EXISTS`,
review before running against production).

## Regenerating the reference

Both references are derived from a **freshly-migrated** database (never a live one):

```bash
# 1. build a clean reference DB from the migrations on disk
createdb twenty_ref
PG_DATABASE_URL=postgres://postgres@localhost:5432/twenty_ref \
  npx nx run twenty-server:database:reset

# 2. refresh the committed schema manifest
packages/twenty-server/scripts/check-schema-drift.sh --update \
  postgres://postgres@localhost:5432/twenty_ref

# 3. re-lock migrations after adding a NEW migration
packages/twenty-server/scripts/check-migration-immutability.sh --update
```

Commit `reference-schema.manifest.txt` and `migrations.lock` alongside the
migration that changed them, so review sees the schema delta.

## Running the checks

```bash
# fail if any committed migration was edited (root-cause guard)
packages/twenty-server/scripts/check-migration-immutability.sh

# fail if a target DB has drifted from the migrations (defaults to $PG_DATABASE_URL)
packages/twenty-server/scripts/check-schema-drift.sh [db-url]
```

Both run in `ci-server.yaml`. The drift check can also be pointed at a
production replica on a schedule to catch environment drift early.
