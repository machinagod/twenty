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

As of the 2026-07-15 sync (release tag **`twenty/v2.20.0`** @ `056d09fcaf`):

| Theme | Commits | Notes |
|-------|---------|-------|
| **record-scoping** | spike (filter builder) + feat (ORM-chokepoint enforcement) | The conflict risk. Hooks into `twenty-orm` query builders (`workspace-{select,update,delete,soft-delete}-query-builder.ts`), `workspace-entity-manager.ts`, `global-workspace-orm.manager.ts`, `orm-workspace-context.storage.ts`, `config-variables.ts`. Mostly self-contained new files under `record-scoping/`. At the v2.20.0 sync these hook files had **zero upstream drift** since v2.14.0, so the chokepoint patches applied clean; the only conflicts were two additive field insertions (`recordScopingRulesByRoleId` next to upstream's new `apiKeyRoleMap` in the interface + entity-manager). See `packages/twenty-server/docs/RECORD_SCOPING.md`. |
| **deploy/telemetry** | Railway deploy config + telemetry-off (via env, not code default) | Disables telemetry through environment, keeps Railway config. |
| **CI / image build** | GHCR production-image workflow + APP_VERSION semver fix | Builds `ghcr.io/machinagod/twenty:main`; bakes a valid semver `APP_VERSION`. The `deploy` job redeploys the Railway services (needs `RAILWAY_TOKEN`). |
| **record-scoping CI** | `ci-record-scoping.yaml` | Dedicated gate — runs the record-scoping unit + integration tests (Postgres/Redis/ClickHouse services) on PRs touching `twenty-orm` and on push to `main`. Catches a silent ORM-chokepoint regression. |
| **front-component decrypt** | fix (decrypt non-secret application variables before sending to the client) | Adds `SecretEncryptionModule` to `front-component.module.ts` and decrypts non-secret app vars in `strip-secret-from-application-variables.ts`. At v2.20.0 upstream renamed the decrypt API `decryptVersioned` → `decryptVersionedOrThrow` (same `(value, {workspaceId})` signature); the fix was adapted accordingly. |
| **EventRow CSS fix** | fix (invalid quoted `height: 'auto'` → `auto`) | 1-line correctness fix in `EventRow.tsx`, salvaged from the reverted content-visibility experiments. Upstream still ships the quoted-string bug at v2.20.0. |

**Dropped commits get pruned, not carried.** The i18n message-compiler fix was a
custom commit until upstream shipped the same fix; at the 2026-06-24 sync it
cherry-picked to an empty diff and we `--skip`ped it. At the 2026-07-15 (v2.20.0)
sync the **content-visibility perf experiments** (fork PRs #6/#7, reverted by #8 as
"measured inert") were dropped entirely — an add+revert pair nets to nothing and is
pure conflict risk across a major upstream refactor. Only the 1-line `EventRow` CSS
fix that survived the revert was salvaged and carried as its own commit. When
upstream supersedes one of ours, drop it and delete its row here.

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
git push -u origin chore/upstream-update
```

## Record-scoping integration test

`record-scoping.integration-spec.ts` proves the clean-room scoping feature is
wired into the workspace ORM (filters SELECTs/UPDATEs for a scoped role; admin
still sees all). It's the regression net that catches an upstream refactor
silently dropping the `applyRecordScoping()` call. It's driven by the
`RECORD_SCOPING_RULES` entry in `.env.test` (rules scoped to a custom role
label, inert for every other suite) and covers both value sources: static-value
(company / employees) and member-relative (opportunity / `ownerId = me`).

### Prod config (as of 2026-06-24)

Record scoping is **live in prod**. `RECORD_SCOPING_RULES` on the **Twenty**
(server) Railway service scopes the `Member` role on `opportunity` to
`ownerId = me` (members see/edit only opportunities they own). The test's
member-relative case mirrors this exact shape, so a wiring regression is caught
before deploy.

It is **deliberately NOT set on the Twenty Worker** service: worker jobs run in a
system context (`shouldBypassPermissionChecks = true`), so scoping is bypassed
there regardless and the var would be inert. This is by design, not config drift
— don't "fix" it by copying the var to the worker. (If a worker path ever starts
running user-context queries, revisit.)

Local run (services + seeded `test` DB required — mirrors CI's `with-db-reset`):

```bash
# Services (CI uses postgres:18 / redis / clickhouse:25.8.8). Postgres is usually
# already local; Redis + ClickHouse via Docker:
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
NODE_ENV=test corepack yarn jest --config ./jest-integration.config.ts \
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
then **redeploys the `Twenty` + `Twenty Worker` Railway services** (which apply the
migrations on boot). It needs repo secret `RAILWAY_TOKEN` (a Railway *project
token* scoped to twenty-crm/production); without it the build still runs and the
redeploy is skipped with a warning.

Redeploying runs **every upstream migration since the last sync** against the live
prod DB. Treat it as a maintenance operation:

1. **DB backup + restore-test first.** 427 commits' worth of migrations is not
   reversible by wishing. (`pg_dump -Fc` of the `postgres` DB via the public proxy.)
2. Maintenance window.
3. Merge the sync PR to `main` (does not deploy), then **dispatch `Build Railway
   image`** (Actions tab → Run workflow, ref `main`). That builds + pushes +
   redeploys server & worker. Watch the run; verify the live image digest matches
   the freshly-pushed `:main`.
4. Smoke-test record-scoping (it gates every workspace query) and re-profile the
   front-end perf scenarios.

First-run check: confirm `railway redeploy` actually pulled the new `:main` digest
(compare the running deployment's image digest to the just-pushed one). If Railway
ever reuses a stale digest, switch the deploy step to point the service at the
immutable `:<sha>` tag via the Railway API instead of redeploying `:main`.

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
- **Keep this file and the custom-surface table updated every sync** — it is the
  source of truth for what we replay.
