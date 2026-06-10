# Deploying our Twenty branch on Railway

This is our fork's deployment (record-level locking + telemetry disabled via env).
It covers a production topology: **server + worker + managed Postgres + managed
Redis**.

## What's different from upstream on this branch

- **Telemetry disabled via configuration** — set `TELEMETRY_ENABLED=false` (the
  upstream default is `true`). With it off, no signup events go to
  `twenty-telemetry.com`. No license key, no phone-home. We keep this as env rather
  than a code default to avoid friction when syncing from upstream.
- **Record-level locking** via `RECORD_SCOPING_RULES`
  (see `packages/twenty-server/docs/RECORD_SCOPING.md`).

## Image / build

The Twenty image is built from `packages/twenty-docker/twenty/Dockerfile`, which
has several stages. The production stage we want is **`twenty`** (server +
frontend). Railway's Dockerfile builder builds the *last* stage and cannot select
a `--target`, and the last stage in that file is the dev all-in-one
(`twenty-app-dev`). So pick one of:

### Option A (recommended): build & push the image, deploy it on Railway

Build the production target in CI (or locally) and push to a registry (e.g. GHCR),
then point Railway services at that image. This is the clean production path and
avoids Railway's target limitation.

```bash
# server + frontend
docker build --target twenty \
  -f packages/twenty-docker/twenty/Dockerfile \
  -t ghcr.io/<org>/twenty:<branch> .
docker push ghcr.io/<org>/twenty:<branch>
```

On Railway, create the two services below from this image (Settings → Source →
Docker Image).

### Option B: let Railway build from the Dockerfile

Commit the root `railway.json` (already added) which sets the Dockerfile path.
Note Railway will build the **`twenty-app-dev`** all-in-one stage (bundled
Postgres + Redis, dev defaults). That is convenient for a quick single-service
trial but **not** recommended for production — override `NODE_ENV`, set a real
`APP_SECRET`, and attach a volume, or prefer Option A.

## Services

1. **Postgres** — Railway Postgres plugin. Twenty needs `PG_DATABASE_URL`
   (reference `${{Postgres.DATABASE_URL}}`).
2. **Redis** — Railway Redis plugin (reference `${{Redis.REDIS_URL}}`). Recommended
   `--maxmemory-policy noeviction`.
3. **twenty-server** — the image above.
   - Start command: default (the image entrypoint runs DB setup/migrations, then
     `node dist/main`).
   - Health check: `/healthz` (already in `railway.json`).
   - Variables: see `twenty.env.example` (core + server-only block).
4. **twenty-worker** — the same image.
   - Start command: `yarn worker:prod`
   - Variables: same as server **plus** `DISABLE_DB_MIGRATIONS=true` and
     `DISABLE_CRON_JOBS_REGISTRATION=true` (the server already runs them).

## Environment variables

Copy `twenty.env.example` into each service. The minimum required (shared between
server and worker): `PG_DATABASE_URL`, `REDIS_URL`, `SERVER_URL`, `APP_SECRET`,
`STORAGE_TYPE`. Set `TELEMETRY_ENABLED=false` to keep telemetry off (upstream
defaults it to `true`). Set `RECORD_SCOPING_RULES` to turn on the lock.

## First deploy

1. Provision Postgres + Redis plugins.
2. Deploy `twenty-server`; the entrypoint initializes the DB and runs migrations
   on first boot. Wait for `/healthz` to pass.
3. Deploy `twenty-worker`.
4. Open `SERVER_URL`, sign up the first workspace/admin.

## Enabling / verifying record-level locking

1. Create the role referenced by your rule (e.g. `Member`) and assign it to a
   non-admin user.
2. Set `RECORD_SCOPING_RULES` (see example) and redeploy both services (the rules
   are read at boot).
3. As that user, confirm they only see/can-modify records matching the rule
   (e.g. opportunities where `assigneeId` = their workspace member id). A role
   without a rule (e.g. admin) is unaffected.

Rule changes require a redeploy/restart, since the config is read once at startup.
