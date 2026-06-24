# Upstream sync runbook (fork ← twentyhq/twenty)

This fork (`origin` = `git@github.com:machinagod/twenty.git`) tracks upstream
`twentyhq/twenty` (`upstream`) plus a small set of custom commits. We re-sync
**regularly**. This is the procedure — keep it current each time.

## Mental model

The fork is **`upstream/main` + N custom commits**, nothing more. We never merge
upstream into a long-lived fork branch (that accumulates noise and makes the
custom surface impossible to read). Instead we **replay our custom commits on top
of a fresh `upstream/main`** each sync, so `git log upstream/main..main` always
shows exactly — and only — what we add.

## The custom surface (what makes this fork the fork)

As of the 2026-06-24 sync (`upstream/main` @ `269c8ef400`, 427 commits replayed):

| Theme | Commits | Notes |
|-------|---------|-------|
| **record-scoping** | spike (filter builder) + feat (ORM-chokepoint enforcement) | The conflict risk. Hooks into `twenty-orm` query builders (`workspace-{select,update,delete,soft-delete}-query-builder.ts`), `workspace-entity-manager.ts`, `global-workspace-orm.manager.ts`, `orm-workspace-context.storage.ts`, `config-variables.ts`. Mostly self-contained new files under `record-scoping/`. See `packages/twenty-server/docs/RECORD_SCOPING.md`. |
| **deploy/telemetry** | Railway deploy config + telemetry-off (via env, not code default) | Disables telemetry through environment, keeps Railway config. |
| **CI / image build** | GHCR production-image workflow + APP_VERSION semver fix | Builds `ghcr.io/machinagod/twenty:main`; bakes a valid semver `APP_VERSION`. |
| **Claude workflows** | `claude.yml` (replaces upstream's 208-line version with the standard 50-line Claude Code action) + `claude-code-review.yml` (new) | Fork's own Claude GitHub integration (orig. PR #1). Re-apply by `git checkout <fork-main> -- .github/workflows/claude.yml .github/workflows/claude-code-review.yml` after each sync (upstream overwrites `claude.yml`). Needs `ANTHROPIC_API_KEY`/Claude app on the fork. |

**Dropped commits get pruned, not carried.** The i18n message-compiler fix was a
custom commit until upstream shipped the same fix; at the 2026-06-24 sync it
cherry-picked to an empty diff and we `--skip`ped it. When upstream supersedes one
of ours, drop it and delete its row here.

## Procedure

```bash
# 0. From the worktree, clean tree. Fetch both remotes.
git fetch upstream --tags
git fetch origin

# 1. Record the current custom surface BEFORE rebasing (SHAs change after).
git log --oneline upstream/main..origin/main   # <- the commits to replay

# 2. New branch off fresh upstream.
git switch -c chore/upstream-update upstream/main

# 3. Replay our custom commits (cherry-pick the range, oldest-first).
#    Use the SHAs from step 1. Resolve conflicts (record-scoping is the one
#    that can drift — verify its ORM hook points still exist upstream).
git cherry-pick <oldest>^..<newest>

#    If a commit is now redundant (upstream shipped it): resolve to upstream's
#    version, then `git cherry-pick --skip` (an empty cherry-pick won't commit).
#    Delete that commit's row from the table above.

# 4. Verify the surface is exactly our custom commits, nothing else.
git log --oneline upstream/main..HEAD

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
  the hook lines reference.
- **Keep this file and the custom-surface table updated every sync** — it is the
  source of truth for what we replay.
