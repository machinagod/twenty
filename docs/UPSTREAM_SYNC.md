# Upstream sync runbook (fork ← twentyhq/twenty)

This fork (`origin` = `git@github.com:machinagod/twenty.git`) tracks upstream
`twentyhq/twenty` (`upstream`) plus a small set of custom commits. We re-sync
**regularly**. This is the procedure — keep it current each time.

## Mental model

The fork is **the latest stable upstream release tag + N custom commits**, nothing
more. We track **release tags** (`twenty/vX.Y.Z`), NOT `main` — releases are
tested with predictable migrations; `main` is bleeding-edge. We never merge
upstream into a long-lived fork branch (that accumulates noise and hides the
custom surface). Instead we **replay our custom commits on top of a fresh release
tag** each sync, so `git log <tag>..main` shows exactly — and only — what we add.

Find the latest stable (non-prerelease) tag:
`gh api repos/twentyhq/twenty/releases/latest --jq .tag_name`.

## The custom surface (what makes this fork the fork)

As of the 2026-10-09 sync (release tag **`twenty/v2.45.0`** @ `7e1431c84a`):

| Theme | Commits | Notes |
|-------|---------|-------|
| **record-scoping** | spike (filter builder) + feat (ORM-chokepoint enforcement) + settings UI + integration tests | The conflict risk. Since v2.4x upstream runs its own SQL builders instead of TypeORM's, and every read/write passes through `WorkspaceRepository.applyRowLevelPermissionPredicateForAlias()` (`twenty-orm/repository/workspace-repository.ts`, AGPL). Our hook is one call there (`applyRecordScopingForAlias`), plus the `recordScopingRulesByRoleId` cache key read in `workspace-orm.manager.ts` → `ORMWorkspaceContext` → `WorkspaceDataSourceService.buildInternalContext` → `WorkspaceInternalContext`. Rules live in `core.recordScopingRule` (`metadata-modules/record-scoping-rule/`, registered in `metadata-engine.module.ts`, its cache module in `twenty-orm.module.ts`, the entity in `all-workspace-cache-entity-by-name.constant.ts` and the key in `workspace-cache-key.type.ts`). Front: our `record-scoping/` section replaces the Enterprise one in `SettingsRolePermissionsObjectLevelObjectForm.tsx`; on a sync, re-apply that swap if upstream edits the form. 2.45 adds two fork commands (`add-record-scoping-rule` instance, `import-record-scoping-rules-from-env` workspace). See `packages/twenty-server/docs/RECORD_SCOPING.md`. |
| **deploy/telemetry** | Railway deploy config + telemetry-off (via env, not code default) | Disables telemetry through environment, keeps Railway config. |
| **deploy/fail-closed upgrade** | fix (entrypoint) | `packages/twenty-docker/twenty/entrypoint.sh`: a failed boot `upgrade` exits non-zero (override `UPGRADE_CONTINUE_ON_ERROR=true`), and init/upgrade run with `UPGRADE_PG_DATABASE_TIMEOUT_MS` (default 600000) instead of the 10s runtime timeout. Fixes the v2.20.0 prod incident. Upstream closed our PR #23013 unmerged, so we carry it. |
| **CI / image build** | GHCR production-image workflow + APP_VERSION semver fix + `railway-deploy.sh` | Builds `ghcr.io/machinagod/twenty:main`; bakes a valid semver `APP_VERSION`. The `deploy` job runs `.github/scripts/railway-deploy.sh` in `routine` or `upgrade` mode through the Railway public API (needs `RAILWAY_TOKEN`); tested by `CI Railway deploy script`. |
| **record-scoping CI** | `ci-record-scoping.yaml` | Dedicated gate — runs the record-scoping unit + integration tests (Postgres 18/Redis/ClickHouse services) on PRs touching `twenty-orm` and on push to `main`. Catches a silent ORM-chokepoint regression. |

**Dropped commits get pruned, not carried.** The i18n message-compiler fix was a
custom commit until upstream shipped the same fix; at the 2026-06-24 sync it
cherry-picked to an empty diff and we `--skip`ped it. At the 2026-07-15 (v2.20.0)
sync the **content-visibility perf experiments** (fork PRs #6/#7, reverted by #8 as
"measured inert") were dropped entirely — an add+revert pair nets to nothing and is
pure conflict risk across a major upstream refactor. Only the 1-line `EventRow` CSS
fix that survived the revert was salvaged and carried as its own commit. When
upstream supersedes one of ours, drop it and delete its row here.

At the 2026-10-09 (v2.45.0) sync three more were dropped because upstream shipped
them: the **front-component decrypt** fix (upstream #23494, `getPublicEnvVariables`),
the **EventRow** `height: 'auto'` fix, and the **local logic-function IPC flush**
fix + its regression test (our upstream PR #22920, merged).

**History note (2026-07-15):** the 2026-06-24 v2.14.0 sync was landed as a **merge**
(`merge: roll fork main back to stable release twenty/v2.14.0`), not the clean
rebase-replay this runbook prescribes — so `twenty/v2.14.0..origin/main` was polluted
with ~12,900 old-lineage commits and the custom surface was hidden. The v2.20.0 sync
restored the clean model: the real custom surface (16 commits) was recovered from the
merge's first parent (`chore/sync-v2.14.0` tip), replayed onto a fresh `twenty/v2.20.0`,
and the fork branch was **reset** to that clean line (recovery tag `pre-2.20-sync-recovery`).
Keep future syncs rebase-only; never merge a release tag into `main`.

## Procedure

```bash
# 0. Clean tree. Fetch upstream tags + origin.
git fetch upstream --tags && git fetch origin

# 1. Resolve the latest stable release tag, and PREV_TAG = the tag current main
#    was built on (from this doc's "as of" line).
TAG=$(gh api repos/twentyhq/twenty/releases/latest --jq .tag_name)   # e.g. twenty/v2.14.0
echo "$TAG"

# 2. Record the current custom surface BEFORE rebasing (SHAs change after).
git log --oneline <PREV_TAG>..origin/main   # <- the commits to replay

# 3. Branch off the new tag and replay our customs onto it (rebase the existing
#    custom range). Resolve conflicts (record-scoping can drift — verify its ORM
#    hook points still exist). Drop any commit upstream has since shipped, and
#    `git rm` upstream's claude.yml if the new tag reintroduces it.
git switch -c chore/sync-$TAG "$TAG"
git rebase --onto "$TAG" <PREV_TAG> <custom-tip>

# 4. Verify the surface is exactly our custom commits, nothing else.
git log --oneline "$TAG"..HEAD

# 5. Green it on the branch (deps drift hard — yarn.lock is usually rewritten).
corepack yarn install
npx nx typecheck twenty-server && npx nx typecheck twenty-front
npx nx test twenty-server      # at least the record-scoping suites
npx nx build twenty-server && npx nx build twenty-front

#    CRITICAL: run the record-scoping integration test. It's the only thing that
#    proves the ORM chokepoint still APPLIES scoping after the rebase (unit tests
#    only cover the pure logic against a mock). Needs Postgres + Redis + ClickHouse
#    up and a seeded `test` DB — see "Record-scoping integration test" below.
#    test/integration/graphql/suites/record-scoping.integration-spec.ts

# 6. Push. NO prod touch yet — review before any deploy/migration.
git push -u origin chore/sync-$TAG
```

## Record-scoping integration test

`record-scoping.integration-spec.ts` proves the clean-room scoping feature is
wired into the workspace ORM (filters SELECTs/UPDATEs for a scoped role; admin
still sees all). It's the regression net that catches an upstream refactor
silently dropping the `applyRecordScoping()` call. It creates its rules through
the metadata API on a custom role (inert for every other suite), covers both
value sources, static-value (company / employees) and member-relative
(opportunity / `ownerId = me`), and checks the Roles permission, validation and
that deleting a rule lifts the scope without a restart.

### Prod config

Record scoping is **live in prod**. Since 2026-10 the rules are edited in
Settings > Roles and stored in `core.recordScopingRule`; the 2.45 upgrade
imported the old `RECORD_SCOPING_RULES` value (the `Member` role on
`opportunity`, `ownerId = me`). The env var is no longer read; remove it from
the Twenty service once the import is confirmed. The test's member-relative case
mirrors that rule, so a wiring regression is caught before deploy.

Worker jobs run in a system context (`shouldBypassPermissionChecks = true`), so
scoping never applies there. (If a worker path ever starts running user-context
queries, revisit.)

Local run (services + seeded `test` DB required — mirrors CI's `with-db-reset`):

```bash
# Services (CI uses postgres:18 / redis / clickhouse:25.8.8). Postgres must be
# >= 15 (2.34 upgrade uses NULLS NOT DISTINCT). If the local server is older, run
# 18 on a side port and point .env.test at it for the run (it is loaded with
# override: true, so an env var can't redirect it). Don't commit that edit.
docker run -d --name twenty-test-pg18 -e POSTGRES_PASSWORD=postgres -p 5433:5432 postgres:18
docker exec twenty-test-pg18 psql -U postgres -c 'create database test'
# Redis is required; ClickHouse is optional (ECONNREFUSED :8123 is audit noise).
docker run -d --name twenty-test-redis -p 6379:6379 redis
docker run -d --name twenty-test-clickhouse -e CLICKHOUSE_PASSWORD=clickhousePassword \
  -p 8123:8123 -p 9000:9000 clickhouse/clickhouse-server:25.8.8

# The app connects as PG role `postgres`; it must be superuser locally:
#   ALTER ROLE postgres WITH SUPERUSER CREATEDB CREATEROLE;
# Create + seed the test DB (also a good full-migration smoke test):
cd packages/twenty-server
NODE_ENV=test NODE_OPTIONS="--import tsx/esm" npx nx database:reset

# Run just this spec. NOTE: `nx jest` drops --config; call jest via yarn instead.
# (ClickHouse 'twenty' DB-missing errors in the log are unrelated audit noise.)
# Needs a bigger heap than the default or jest OOMs before any test runs.
NODE_ENV=test NODE_OPTIONS="--max-old-space-size=8192" corepack yarn jest \
  --config ./jest-integration.config.ts \
  test/integration/graphql/suites/record-scoping.integration-spec.ts
```

Gotcha: must run under Node 24 (see Watch-items). `nx jest --config …` silently
ignores `--config` — invoke the jest binary through `yarn`, not the nx target.

## Fork CI / workflows (upstream automation that can't run here)

Upstream ships GitHub Actions that dispatch to `twentyhq/ci-privileged` and mint a
`twentyhq`-scoped app token (`TWENTY_WORKFLOW_DISPATCHER_*`). On this fork those
secrets don't exist, so the workflows fail (red checks) and can never work. They
are **disabled at the Actions level** (`gh workflow disable …`) rather than in
code — a disabled workflow is keyed by path, so the disable survives upstream
syncs without a per-sync code edit.

Disabled on the fork (2026-06-24) — all target twentyhq infra/secrets the fork
lacks: **Preview Environment Dispatch, PR Review Dispatch, CD deploy main, CD
deploy tag, App Prod-Parity E2E Dispatch, Visual Regression Dispatch, Website
Preview Dispatch, Post CI Comments, Auto-Draft External PRs, all six Crowdin
translation syncs, Release: create, AI Catalog Sync, Blocked Contributors Check.**
After each sync, re-check `gh workflow list` and disable any newly-(re)enabled
upstream-only workflow that shows red.

Also disabled: **Claude Code Review** (auto PR review). Kept ENABLED: **Build
Railway image** (the fork's deploy), **Claude Code** (the `@claude` assistant,
member-gated), and the CI validation suite (**CI Server/Front/Shared/UI/SDK/…**). **CI Utils / danger-js** stays enabled (useful PR-hygiene) but
*times out* (5-min cap) on a huge sync PR — that red is a one-off, non-blocking
(`main` is unprotected), and clears on normal PRs.

### PR previews — none for now (deliberate)

There is **no PR-preview environment** on the fork, by decision (2026-06-24).

Railway's native PR Environments need a **GitHub-repo-connected service** to watch
for PRs. Every service in `twenty-crm` is image/plugin-based (`Twenty` and `Twenty
Worker` deploy `ghcr.io/machinagod/twenty:main`; Postgres/Redis are plugins) with
`source.repo = null`, so native PR envs have nothing to watch and won't trigger.

If a preview is ever wanted, the two real options are:
- **Per-PR image preview** — a workflow that builds `ghcr.io/machinagod/twenty:pr-<N>`
  on PR, deploys it to a reusable Railway `preview` env, runs migrations, comments
  the URL. Previews real PR code; moderate build + ongoing cost.
- **Connect the service to the repo** — point the Railway `Twenty` service at the
  GitHub repo (Railway builds the Dockerfile) so native PR envs work. Enables
  native previews but changes the prod deploy model away from the GHCR image.

For the upstream-sync PR specifically, the preview need is covered by the gated
deploy + re-profile, not a preview env.

## Deploy (separate, gated step — never bundled with the rebase)

Merging to `main` does **not** deploy — it only updates the branch. The prod
deploy is a **separate, manual** step (the gate): the `Build Railway image`
workflow (`build-railway-image.yaml`) runs on `workflow_dispatch` only. One
dispatch builds the `twenty` image, pushes `ghcr.io/machinagod/twenty:{main,<sha>}`,
then runs `.github/scripts/railway-deploy.sh` with the `mode` input. It needs repo
secret `RAILWAY_TOKEN` (a Railway *project token* scoped to twenty-crm/production);
without it the build still runs and the deploy is skipped with a warning.

- **`routine`** (default): a fresh deployment of the server, then the worker.
- **`upgrade`** (every upstream sync): raises the server's Railway health-check
  timeout to 3600s, stops the worker, deploys the server and waits (up to 70
  min) for its boot upgrade, **always** puts the timeout back to 300s, then
  deploys the worker. If the server deployment fails the worker stays stopped
  and the run fails.

The script drives Railway's public GraphQL API rather than the CLI on purpose:
`railway redeploy` reuses the previous deployment's settings snapshot (a changed
health-check timeout would be ignored), `railway environment edit` silently
ignores `deploy.*` settings, and `railway scale <region>=0` with one region
**moved** the worker to another region instead of stopping it. The script is
tested against a stub API (`.github/scripts/railway-deploy.test.sh`, run by
`CI Railway deploy script`).

An upgrade deploy runs **every upstream migration since the last sync** against
the live prod DB. Treat it as a maintenance operation:

1. **DB backup + restore-test first.** `pg_dump -Fc --no-owner --no-privileges` of
   the prod DB via `DATABASE_PUBLIC_URL` (from `railway variables -s Postgres --json`).
   Local `pg_dump` must be >= the server's major version (prod is PG 16); the
   `postgres:18` test container's `pg_dump` works. Note the current prod image tag
   (GHCR `:<sha>` of the running digest) as the rollback target.
2. **Rehearse the upgrade on a restored copy** the day before: restore into a local
   PG 18 DB, then run `node <server>/dist/command/command upgrade` from a directory
   holding its own `.env` (pointing at the copy, throwaway `APP_SECRET`) and a `dist`
   symlink to the server build (entity globs resolve relative to the cwd), then
   `upgrade:status --failed-only`. This finds failing steps and the heavy ones, but
   **its timings don't transfer**: prod disk is far slower. v2.20.0 → v2.45.0 took
   531s locally; on prod the `timelineActivity.searchVector` rebuild alone took 2000s
   (31s locally).
3. Maintenance window: budget at least an hour for a sync with big DDL.
4. Reset `main` to the sync branch tip (see the history note: not a GitHub merge
   button).
5. **Dispatch `Build Railway image`** (Actions tab → Run workflow, ref `main`,
   **mode `upgrade`**). Watch the run and the server logs (`railway logs -s Twenty`)
   for `Successfully migrated DB!`.
6. Verify: `railway ssh -s Twenty -- sh -c 'cd /app/packages/twenty-server && yarn command:prod upgrade:status --failed-only'`
   must show 0 failed; `/healthz` 200; the server logs
   `Record scoping enabled: N rule(s) loaded` on first request; the worker processes
   jobs.
7. Smoke-test record-scoping as a scoped user (it gates every workspace query) and
   re-profile the front-end perf scenarios.

### When an upgrade deploy fails

The entrypoint fails closed: a failed upgrade exits instead of serving on a
half-migrated DB, and the upgrade resumes where it stopped on the next attempt
(batched backfills commit per batch). Before retrying:

- **Look for orphaned upgrade queries.** The node-postgres query timeout is
  client-side: when an upgrade attempt dies or times out, its statement keeps
  running in Postgres, holding locks that make every retry wait and then fail
  (`lock timeout`, or a 5000-row batch stuck for the whole timeout). Check
  `pg_stat_activity` for long-running `ALTER TABLE` / `WITH rows_to_update`
  statements from a dead container and `pg_terminate_backend()` them — their work
  rolls back anyway.
- If a single statement legitimately needs longer than the migration timeout
  (`UPGRADE_PG_DATABASE_TIMEOUT_MS`, default 1h), raise it on the `Twenty` service;
  the variable change itself triggers a fresh deployment. Keep the health-check
  timeout at least as long (the `upgrade` mode sets 3600s).
- Then re-dispatch with mode `upgrade`.

## Watch-items

- **record-scoping is load-bearing** — it filters every workspace ORM query. A
  silent break = data leak or empty lists. It must compile *and* its tests pass
  before deploy; smoke-test after.
- **Cherry-pick "applied clean" ≠ "compiles."** Context matching only means the
  surrounding lines matched. Always typecheck — upstream may have renamed symbols
  the hook lines reference. *Example (v2.20.0 sync):* the front-component fix
  cherry-picked without conflict, but typecheck caught that upstream had renamed
  `SecretEncryptionService.decryptVersioned` → `decryptVersionedOrThrow`. The
  ORM-chokepoint patches applied *and* compiled only because those files had zero
  upstream drift — don't assume that holds next sync; typecheck is the gate.
- **Never merge a release tag into `main`; rebase-replay only.** The 2026-06-24
  sync merged `twenty/v2.14.0` in, which buried the custom surface under ~12,900
  old-lineage commits and broke `git log <tag>..main`. Recovering the real surface
  meant reading the merge's first parent. Always `git switch -c chore/sync-$TAG $TAG`
  then replay — the fork branch should be `$TAG` + N custom commits, first-parent-linear.
- **Upstream can rewrite the hook site outright.** v2.45.0 deleted every file the
  record-scoping hook lived in (TypeORM query builders, entity manager, datasource
  module) and moved row access into `WorkspaceRepository`. When the hook files show
  as `DU` (deleted upstream), don't resurrect them: take upstream's version, find
  where upstream applies its own row-level predicates, and hook in next to it.
- **The integration test is proven to catch a missing hook.** At v2.45.0, removing
  the `applyRecordScopingForAlias` call made 3 of its 6 cases fail (the scoped
  ones); the admin/in-scope cases keep passing, as they should.
- **Prod Postgres must be >= 15** from v2.34 on (`NULLS NOT DISTINCT`). Check the
  Railway Postgres version before deploying a sync that crosses 2.34.
- **Stale `tsgo` build info can crash typecheck** with a Go `stack overflow` in
  `affectedfileshandler.go` after a big jump. Delete
  `packages/twenty-server/dist/packages/twenty-server/tsconfig.tsbuildinfo` and rerun.
  Also rebuild `twenty-emails` if typecheck reports missing `renderEmail` exports.
- **Keep this file and the custom-surface table updated every sync** — it is the
  source of truth for what we replay.
