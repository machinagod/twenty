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

# 6. Push. NO prod touch yet — review before any deploy/migration.
git push -u origin chore/upstream-update
```

## Deploy (separate, gated step — never bundled with the rebase)

Redeploying runs **every upstream migration since the last sync** against the live
prod DB. Treat it as a maintenance operation:

1. **DB backup + restore-test first.** 427 commits' worth of migrations is not
   reversible by wishing.
2. Maintenance window.
3. Merge `chore/upstream-update` → `main`; CD rebuilds the GHCR image and Railway
   redeploys (server + worker on `ghcr.io/machinagod/twenty:main`).
4. Smoke-test record-scoping (it gates every workspace query) and re-profile the
   front-end perf scenarios.

## Watch-items

- **record-scoping is load-bearing** — it filters every workspace ORM query. A
  silent break = data leak or empty lists. It must compile *and* its tests pass
  before deploy; smoke-test after.
- **Cherry-pick "applied clean" ≠ "compiles."** Context matching only means the
  surrounding lines matched. Always typecheck — upstream may have renamed symbols
  the hook lines reference.
- **Keep this file and the custom-surface table updated every sync** — it is the
  source of truth for what we replay.
