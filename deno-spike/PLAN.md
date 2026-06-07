# Twenty → Pure Deno Deploy (PG-only) — Migration Plan

> **Status:** Phase 1 complete (✅ go). Phase 2 not started.
> **Last updated:** 2026-06-07
> **Scope owner:** Ricardo A
> **Home of this initiative:** `deno-spike/` (spike + this plan). The real port
> will eventually live in the main packages; this folder is the scratch/proof + planning hub.

This document is the **single source of truth** for picking the work back up in a
later session. Read it top-to-bottom before touching code.

---

## 1. Goal & hard constraints (decided with the user)

Run Twenty as a **pure Deno Deploy v2 application**:

| Constraint | Decision | Source |
|---|---|---|
| Build tooling | **Deno only. No Yarn.** Deno resolves npm deps & transpiles. | user, this session |
| Frontend bundling | **Vite is allowed** (one-time build → static), served by Deno static mode | user |
| State backend | **PostgreSQL ONLY.** No Redis. **No Deno KV.** | user |
| Target database | **Managed Prisma Postgres** on Deno Deploy (`deno deploy database provision --kind prisma`). Standard Postgres-wire (`DATABASE_URL` + `PG*` injected); use `npm:pg`/TypeORM directly. | user + Deploy docs |
| Background execution | **`Deno.cron`** is the heartbeat (Deploy v2 has it; local needs `--unstable-cron`). | user correction |
| Scheduling primitive avail. | KV `enqueue`/`listenQueue` are OFF the table (no KV). Cron is the ONLY native wake-up. | derived |

### Non-negotiable consequences of "PG-only + request/response runtime"
- The Deploy app only runs code on an **inbound request** or a **`Deno.cron` tick**. There is no always-on worker process.
- Therefore **all** of Twenty's Redis usage must move to Postgres, and the
  3-process model (api / worker / command) collapses into Deno entrypoints.

---

## 2. Phase 1 result — boot spike (✅ GO)

Spike lives in this folder. Run: `deno task start` (see `README.md`). All gating
risks cleared against local Postgres:

- NestJS boots under Deno node-compat; routes mapped; DI resolves.
- **`emitDecoratorMetadata` works** (constructor injection) — the scariest unknown.
- TypeORM connects + `synchronize` builds schema; CRUD round-trips.
- **Deno alone** resolved/built the NestJS + TypeORM npm trees (no Yarn).
- **`Deno.cron` fired** at the minute boundary and drained a PG job queue.
- PG-as-queue (`FOR UPDATE SKIP LOCKED`) enqueue→drain→done verified.
- UUIDs via **`gen_random_uuid()`** (core, no `uuid-ossp` — Prisma-safe).

Cold-start cache probe (`GET /metadata-timing`): ~0.12 ms/query local. Re-measure
against the real Prisma DB before deciding cache strategy (§6, deferred decision).

### Watch items surfaced in Phase 1
- TypeORM `@PrimaryGeneratedColumn("uuid")` assumes `uuid-ossp` → use `gen_random_uuid()` default instead.
- Deno warns `experimentalDecorators` is deprecated (works today; long-term risk).
- Managed Postgres + many isolates → **connection-cap risk**: keep TypeORM pool small per isolate or front with a pooler. Load-test early.
- Assume **no `CREATE EXTENSION` rights** on Prisma DB. Audit `twenty-orm` for `uuid-ossp` / `pgcrypto` / `pg_trgm` assumptions.

---

## 3. Target architecture

```
Deno Deploy app  (single entrypoint, Deno-built)
├── Deno.serve → NestJS (platform-express via node-compat)        [API]
├── Deno.cron("drain-*", "* * * * *") → drain PG job tables        [job execution]
└── Deno.cron("schedule", "* * * * *") → eval job_schedules table  [cron/repeatable]

Prisma Postgres (the ONLY stateful service)
  ├── application data (TypeORM + twenty-orm, dynamic per-workspace schemas)
  ├── job queue            (replaces BullMQ)
  ├── job_schedules        (replaces BullMQ repeatable / upsertJobScheduler)
  ├── cache                (replaces Redis cache) — or per-isolate memory; see §6
  ├── sessions             (replaces connect-redis) — or go JWT-stateless
  └── pub/sub via LISTEN/NOTIFY (replaces Redis pub/sub for GraphQL subscriptions)

S3 → file storage (@aws-sdk/client-s3, already supported; FS is ephemeral)
ClickHouse → external, unchanged
Frontend → vite build → static assets → separate Deno static-mode app (--single-page-app)
```

---

## 4. The Redis surface to remove (4 concerns, ~31 files)

`grep -rli redis packages/twenty-server/src` → 31 files. They fall into **four**
distinct concerns — do NOT treat this as one swap:

1. **Job queue (BullMQ)** — the big one. See §5.
   - `engine/core-modules/message-queue/**` (driver, service, explorer, factory)
   - `modules/workflow/.../workflow-run-enqueue.workspace-service.ts`
2. **Cache** — `engine/core-modules/cache-storage/**`, `engine/core-entity-cache/**`,
   `engine/workspace-cache/**`, `jwt/.../signing-key-verify-counter.service.ts`.
3. **Sessions** — `engine/core-modules/session-storage/session-storage.module-factory.ts`
   (uses `connect-redis` + `express-session`).
4. **Pub/Sub for GraphQL subscriptions** — `engine/subscriptions/**`,
   `engine/metadata-modules/ai/ai-chat/**` (event publisher / cancel subscriber / resolver).
   → Replace with **Postgres LISTEN/NOTIFY**. NOTE: Deploy idle-shutdown/eviction
   drops long-lived connections → clients must reconnect (Phase 4 + §7 risk).

Central client to retire last: `engine/core-modules/redis-client/redis-client.service.ts`.
Health checks referencing redis/worker: `engine/core-modules/admin-panel/indicators/{redis,worker}.health.ts`.

---

## 5. The job system — exact contract to replicate (Phase 2 core)

### The interface (already abstracted — this is why the port is bounded)
`MessageQueueDriver` (`message-queue/drivers/interfaces/message-queue-driver.interface.ts`):
`add`, `work`, `addCron`, `removeCron`, `register?`. Two impls today:
`bullmq.driver.ts`, `sync.driver.ts`. **Driver is hardcoded** to BullMQ in
`message-queue.module-factory.ts` (switch on `MessageQueueDriverType`). Add a
`Pg` type + `pg.driver.ts`.

### 17 queues (`message-queue.constants.ts` → `enum MessageQueue`)
task-assigned, messaging, webhook, cron, email, calendar, contact-creation,
billing, workspace, entity-events-to-db, workflow, delayed-jobs, delete-cascade,
logic-function, trigger, ai, ai-stream.

### Options to honor (`drivers/interfaces/job-options.interface.ts`)
- `QueueJobOptions`: `id?`, `priority?`, `retryLimit?`, `delay?`
- `QueueCronJobOptions extends QueueJobOptions`: `repeat: { every?, pattern?, limit? }`

### BullMQ semantics the PG driver MUST reproduce (read `bullmq.driver.ts`)
- **`add`**: dedup — "only one *waiting* job per `options.id`" (BullMQ checks waiting jobs; replicate as a partial-unique / `WHERE status='pending'` guard). `attempts = 1 + retryLimit`. Default priority from `MESSAGE_QUEUE_PRIORITY[queue]`. `delay` → `run_at = now()+delay`. Retention via `QUEUE_RETENTION` (age/count) → a cleanup cron.
- **`work`**: explorer calls it **once per queue** with a single fan-out handler (see below). Store `handler` keyed by queue. Honor `options.concurrency` (`QUEUE_WORKER_OPTIONS[queue]`). Wrap each job in `Sentry.withIsolationScope` + `applyWorkspaceSentryContextFromJobData` + record metrics (`MetricsService`: latency histogram, completed/failed counters, waiting gauge).
- **`addCron`/`removeCron`**: BullMQ uses `upsertJobScheduler`/`removeJobScheduler` keyed by `getJobKey({jobName, jobId})`. PG model: upsert/delete a row in `job_schedules` (store `repeat.pattern`/`every`/`limit`). A static `Deno.cron("* * * * *")` evaluates due schedules and enqueues into the job table. **Why a table, not `Deno.cron` directly:** `Deno.cron` must be declared at module load — it cannot express *runtime-defined* schedules (workflow cron triggers, custom-domain checks, key rotation, event-log cleanup, etc.). The static tick + table is how dynamic schedules survive.
- **`register`**: BullMQ creates a `Queue` object. PG driver: no-op (or ensure indexes). Called by `MessageQueueService` ctor per queue.

### How `work()` is wired (read `message-queue.explorer.ts`)
On module init the explorer discovers `@Processor`/`@Process` providers, groups
them by queue, and calls `queue.work(combinedHandler, options)` **once per queue**.
`combinedHandler` fans out to each processor whose `@Process(jobName)` matches
`job.name`. Request-scoped processors get a per-job `contextId`. **This is
driver-agnostic** — our PG driver only needs to store the handler and invoke it
per claimed job. No processor code changes.

### Fidelity gaps to decide on (BullMQ → PG)
| BullMQ feature | PG approach | Note |
|---|---|---|
| per-queue `concurrency` | `LIMIT` + advisory locks / batch size | Deno.cron has **no overlap** per named cron → throughput = 1 batch/tick. Shard with multiple named crons per queue group if needed. |
| `priority` lanes | `ORDER BY priority, run_at` | straightforward |
| retry/backoff | `attempts` + `run_at` reschedule on failure | implement backoff in drain |
| latency floor | ≥1 min for cron-drained jobs | for "instant" jobs, also process inline in `add()` (hybrid) — keep `sync.driver` semantics available |
| interruption | drain in bounded idempotent batches; `locked_until` visibility timeout | "long tasks may be interrupted" on Deploy |
| retention cleanup | a cleanup cron deletes done/failed by age/count | replaces `removeOnComplete/Fail` |

---

## 6. Cache & sessions

- **Cache** (`cache-storage.module-factory.ts`) is hardcoded to Redis (`Memory`
  branch commented out). Options: (a) **PG cache table** (shared, survives cold
  start, adds DB read load); (b) **per-isolate in-memory** (simplest, but every
  cold isolate rebuilds the workspace-metadata graph from PG). **Deferred
  decision** — gate on real Prisma-DB RTT × #metadata reads (use `/metadata-timing`
  probe against the real DB).
  - Hot path: `engine/workspace-cache` + `engine/core-entity-cache` hold the
    dynamic-schema metadata. This is what makes the cache choice matter.
- **Sessions** (`session-storage.module-factory.ts`, `connect-redis`): either a
  **PG session store** (`connect-pg-simple` pattern) or move to **JWT-stateless**
  (Twenty already has `@nestjs/jwt`). Check what actually relies on server
  sessions vs JWT before choosing.

---

## 7. Open risks / unknowns (verify before/while building)
1. **Connection pooling** on managed Prisma Postgres vs many serverless isolates. Could be the real bottleneck. Load-test early.
2. **GraphQL subscriptions** over `LISTEN/NOTIFY` + Deploy idle-shutdown/eviction → need client reconnect + possibly polling fallback. AI chat streaming (`ai-stream-queue`, agent-chat pub/sub) is the most affected.
3. **TypeORM yarn `patch:`** (`typeorm@0.3.20`) + **`@nestjs/graphql` patch** — no Yarn means these must be vendored/upstreamed. Spike used stock typeorm; the real `twenty-orm` depends on the patch — inspect `packages/twenty-server/patches/`.
4. **`Deno.cron` limits on Deploy v2**: min 1-min granularity, no overlap per name, per-invocation wall-time. Confirm against real Deploy + design batch sizes around it.
5. **Long/large jobs**: KV-free + request/cron runtime → big payloads must live in PG/S3 with a reference passed in the job row.
6. `experimentalDecorators` deprecation in Deno/TS long-term.

---

## 8. Phased task list

### Phase 1 — Boot spike ✅ DONE
- [x] NestJS + TypeORM + Postgres on Deno, no Yarn
- [x] `Deno.cron` heartbeat draining a PG queue
- [x] Extension-free UUIDs; cache probe endpoint

### Phase 2 — PG drivers (replace Redis) — IN PROGRESS
Queue driver (slice 1+2) — ✅ DONE & validated:
- [x] `pg-driver-core.ts` — dependency-free SQL core (DDL + enqueue/claim/complete/fail/cleanup/schedules). Single source for the table DDL (`buildSchemaSql()`).
- [x] `pg.driver.ts` — NestJS wrapper implementing `MessageQueueDriver`; priority defaults (MESSAGE_QUEUE_PRIORITY), attempts/delay, retention, metrics(optional)+Sentry, `drain`/`drainAll`/`runDueSchedules`/`cleanup` for the cron tick.
- [x] Replicated `add` dedup (partial-unique on `(queue,opt_id) WHERE status='pending'`), priority, attempts, delay, backoff retry, retention cleanup.
- [x] Validated in spike: `deno run -A deno-spike/validate-pg-driver.ts` → **18/18** (imports the REAL core; runs against `deno_spike`).
- Tables = `messageQueueJob` + `messageQueueJobSchedule` (schema `core` in server, `public` in spike).

Still TODO in Phase 2:
- [ ] Wire `MessageQueueDriverType.Pg` + `PgDriver` into `message-queue.module-factory.ts` behind config (keep BullMQ default). Inject DataSource adapter + cron-parser `CronNextRun` + MetricsService. **NOTE:** server typecheck of `pg.driver.ts` deferred to this step (uses `src/` aliases; mirrors `bullmq.driver.ts` patterns).
- [ ] Instance-command migration creating the two tables (reuse `core.buildSchemaSql()`); add `cron-parser` dep to twenty-server.
- [ ] PG (or memory) cache store in `cache-storage.module-factory.ts` (un-hardcode Redis).
- [ ] Session store: PG or JWT-stateless in `session-storage.module-factory.ts`.
- [ ] `LISTEN/NOTIFY` PubSub to replace `engine/subscriptions` Redis pub/sub.
- [ ] Retire `redis-client.service.ts`; update admin-panel health indicators.

New files (this slice):
- `packages/twenty-server/src/engine/core-modules/message-queue/drivers/pg-driver-core.ts`
- `packages/twenty-server/src/engine/core-modules/message-queue/drivers/pg.driver.ts`
- `deno-spike/validate-pg-driver.ts`

### Phase 3 — Deno entrypoint + frontend
- [ ] Single Deno entrypoint: real `AppModule` via `Deno.serve` + static `Deno.cron` heartbeats (drain + schedule eval). Fold the `queue-worker` ApplicationContext into the same isolate (it just registers `work()` handlers).
- [ ] Resolve TypeORM / `@nestjs/graphql` patches without Yarn (vendor).
- [ ] `vite build` (run via Deno) → static assets → Deno static-mode Deploy app (`--single-page-app`).
- [ ] `deno deploy create` config; provision + assign Prisma Postgres; env vars via `deno deploy env`.

### Phase 4 — Fidelity & hardening
- [ ] Migrate dynamic crons (workflow triggers, key rotation, custom-domain checks, event-log cleanup) onto `job_schedules`.
- [ ] Subscription reconnect handling under idle-shutdown/eviction.
- [ ] Connection-pool load test against Prisma DB; tune pool/pooler.
- [ ] Reconcile priority/concurrency fidelity; throughput test the cron drain.

---

## 9. Environment / how to run
- **Local Postgres**: running on `:5432`. Spike DB `deno_spike` created (peer auth as `rafonso`; `postgres/postgres` granted on `public`).
- **Spike**: `cd deno-spike && deno task start` (uses `--unstable-cron`). Override `DATABASE_URL` / `PORT` via env.
- **Deno**: 2.8.2 local; Deploy v2 runtime is Deno 2.5.0 (`--allow-all`, cron enabled, **no custom flags**).
- **Prisma DB connection**: `deno deploy database provision <n> --kind prisma --region <r>` then `... assign <n> --app <app>` injects `DATABASE_URL` + `PG*`.

## 10. Key files index (server)
- Queue: `engine/core-modules/message-queue/` — `drivers/{bullmq,sync}.driver.ts`, `drivers/interfaces/`, `message-queue.module-factory.ts`, `message-queue.explorer.ts`, `services/message-queue.service.ts`, `message-queue.constants.ts`, `message-queue-priority.constant.ts`, `message-queue-worker-options.constant.ts`, `constants/queue-retention.constants.ts`.
- Cache: `engine/core-modules/cache-storage/`, `engine/core-entity-cache/`, `engine/workspace-cache/`.
- Sessions: `engine/core-modules/session-storage/session-storage.module-factory.ts`.
- Pub/Sub: `engine/subscriptions/`, `engine/metadata-modules/ai/ai-chat/`.
- Redis client: `engine/core-modules/redis-client/`.
- Entrypoints: `src/main.ts` (API), `src/queue-worker/queue-worker.ts` (worker), `src/command/` (commands).
- Patches: `packages/twenty-server/patches/`.
