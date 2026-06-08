# Twenty → Pure Deno Deploy (PG-only) — Migration Plan

> **Status:** Phase 1 ✅. Phase 2 ✅. Phase 3 ✅ locally (entrypoint + vite-built frontend served by Deno + DB migrated + Chrome E2E auth flow + jest 5601/5610). **Production Deno Deploy is plan-blocked** (slices 3.14–3.16): the 3541-package npm graph exceeds the free-tier deployment-phase materialization (~1100 modules), and the esbuild-bundle workaround hits a NestJS DI reflection wall before reaching HTTP serving. Local stack remains fully functional.
> **Last updated:** 2026-06-08
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
| **Server build strategy** | **PURE DENO — the server is NOT pre-built/transpiled/bundled. Deno runs the TS source directly.** No Node build step for the backend. Consequence: source-level Deno-incompat (lingui macros, type-only-value imports, bare node builtins, extensionless deep-subpath imports) must be solved at runtime — via import-map shims/aliases or minimal source edits — NOT by building first. | **user directive** |
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
3. **TypeORM yarn `patch:`** (`typeorm@0.3.20`) + **`@nestjs/graphql` patch** — no Yarn means these must be vendored/upstreamed. **UPDATE (slice 3.1):** inspected all three patches — they are **GraphQL-schema-generation / type-level only**, NOT a boot blocker (see §8 slice 3.1 findings). Still must be vendored before the GraphQL schema builds, but the data/queue layer boots fine on stock deps.
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

Queue driver wiring (slice 3) — ✅ DONE:
- [x] Added `MessageQueueDriverType.Pg` + `PgDriverFactoryOptions` ({ type: Pg; sql: SqlExecutor; options: PgDriverOptions }) to the `MessageQueueModuleOptions` union.
- [x] `message-queue-core.module.ts` `createDriver` Pg case → `new PgDriver(config.sql, config.options)`.
- [x] `drivers/typeorm-sql-executor.ts` — TypeORM-backed `SqlExecutor` from the core DataSource (`query` → `dataSource.query`; `withTransaction` → `dataSource.transaction(em => fn(executorFromManager(em)))`, reusing one EntityManager for nested calls so `FOR UPDATE` locks stay on one connection).
- [x] Config var **`MESSAGE_QUEUE_DRIVER_TYPE`** (enum, default `bull-mq`) in `twenty-config/config-variables.ts`, group `SERVER_CONFIG`. NOTE: intentionally **no** `@CastToUpperSnakeCase` — unlike the other driver enums, `MessageQueueDriverType` values are lowercase-hyphen (`bull-mq`/`sync`/`pg`), so upper-snake casting would mangle the value and it would never match the enum (the existing `app.module.ts` compares this enum against a raw lowercase env value too).
- [x] `message-queue.module-factory.ts` branches on the config var; Pg returns the Pg factory options with the SqlExecutor + PgDriverOptions (`metricsService`, `cronNextRun`). Added `getDataSourceToken()` to the factory inject array in `core-engine.module.ts`.
- [x] `cron-parser` (already a twenty-server dep, `5.1.1`) wired as `CronNextRun` in the factory via `CronExpressionParser.parse(pattern, { currentDate: from }).next().toDate()`.
- [x] Instance-command migration (core, fast) **`CreatePgMessageQueueTablesFastInstanceCommand`** (`2-9/2-9-instance-command-fast-1799000040000-create-pg-message-queue-tables.ts`, registered in `instance-commands.constant.ts`) runs `new PgMessageQueueCore(executor, DEFAULT_TABLES).buildSchemaStatements()` (per-statement — see finding below) to create `core.messageQueueJob` + `core.messageQueueJobSchedule` (down: DROP both).
- Gates: `deno run -A deno-spike/validate-pg-driver.ts` → still **18/18**. Server typecheck via `deno check` (server compiler flags: strictNullChecks + noImplicitAny) on the new driver files `pg.driver.ts` + `typeorm-sql-executor.ts` → clean (no `MessageQueueDriver` signature drift). Full `nx typecheck`/`nx lint` need Yarn (unavailable in the Deno-only env); the novel type relationships (union narrowing, MetricsService→MetricsLike, factory `satisfies`) were verified with isolated `deno check` harnesses.

Real-driver Deno boot spike (slice 3.1) — ✅ DONE & GREEN (`deno-spike/boot-real-driver.ts`, **6/6**):
Booted the REAL wired `PgDriver` + REAL `typeorm-sql-executor.ts` against a REAL TypeORM `DataSource`, under Deno, on **stock (un-patched) typeorm** — enqueue/claim/drain, opt-id dedup, and the cron path through a real `dataSource.transaction()` (`FOR UPDATE SKIP LOCKED`). This was the first time the actual server source (not a spike copy) drove Postgres on Deno, and the first exercise of the TypeORM-backed executor (validate-pg-driver.ts uses node-postgres directly). Findings:
- **The Yarn patches are NOT a boot blocker.** All three (`typeorm`, `@nestjs/graphql`, `@ptc-org/nestjs-query-graphql`) only affect **GraphQL schema generation** (`@nestjs/graphql` patch is entirely in `dist/schema-builder/**`: a `resolverSchemaScope` core/metadata/admin split + reachable-types opt) and TypeScript types. The one runtime delta anywhere is typeorm initialising `DeleteResult.generatedMaps = []`. They only matter at the GraphQL-schema-build milestone, not for the NestJS DI + TypeORM data/queue boot. **De-risks §7.3.**
- **BUG #1 (fixed): multi-statement DDL.** `buildSchemaSql()` is multi-statement; node-postgres' simple protocol runs all of it, but TypeORM `query()`/`queryRunner.query()` use the extended (parameterised) protocol, which executes **only the first statement** and silently drops the rest — so the migration would have created `messageQueueJob` with **no indexes** (incl. the dedup partial-unique). Fix: added `PgMessageQueueCore.buildSchemaStatements()`; `ensureSchema()` and the migration now run one statement at a time. (Index names in the DDL are schema-global constants, not per-table — fine in prod with a single `core` job table; the spike just uses an isolated schema.)
- **BUG #2 (fixed): `UPDATE … RETURNING` result shape.** TypeORM `query()` returns a flat rows array for SELECT but a `[rows, affectedCount]` tuple for INSERT/UPDATE/DELETE … RETURNING (node-postgres returns plain rows for both). `claimBatch` relies on `UPDATE … RETURNING`, so jobs came back with `id === "undefined"`. Fix: `typeorm-sql-executor.ts` now unwraps the write-result tuple (`toRows`) to honour the `SqlExecutor` "returns rows" contract.
- **Deno resolution learnings for the eventual full-AppModule boot:** (a) a full `deno install` over the Yarn workspace is **blocked** by a malformed transitive version spec (`linkifyjs: "==4.3.3"` via `linkify-react`, a *frontend* dep) — so use explicit `npm:pkg@ver` import-map specifiers with on-demand fetch (as the spike/typecheck do) and boot small real slices, not the whole graph at once; (b) the real server's extensionless imports need `--sloppy-imports` + an import map mapping `src/` → `packages/twenty-server/src/`; (c) `twenty-shared` resolves only via `dist/` (must be built) or by mapping its subpaths (`twenty-shared/utils`, …) to `packages/twenty-shared/src/*` source.

Real-MODULE boot probe (slice 3.1b) — diagnostic only (not committed):
Tried booting the real `MessageQueueModule` under a real NestJS DI container (Pg selected). Finding: it is **not independently bootable** — its transitive graph reaches most of core-modules:
- `MessageQueueModule → MetricsModule → MetricsCacheService → TwentyConfigService → config-variables` drags in the **entire config system** (+ `@nestjs/graphql`, `twenty-shared` barrels, every driver enum).
- `cache-storage.service.ts` **hard-imports `cache-manager-redis-yet` + `redis` at module-load time** (pulled in because `metrics.service` references `CacheStorageService` as a value for `emitDecoratorMetadata`) → confirms the queue module transitively needs Redis. Removing this is exactly the **cache slice**.
- `message-queue.module.ts` has a top-level `import { MessageQueueExplorer }` (for `registerExplorer`) that **eager-loads even when unused**, dragging in `exception-handler → graphql`. Booting `MessageQueueCoreModule` directly avoids it.
- `twenty-shared/utils` is a **barrel of 187 files pulling browser libs** (`react-router-dom`, `handlebars`, `temporal-polyfill`, …); the Deno server bundle must vite-build twenty-shared (tree-shaken), not import the source barrel.
- Conclusion: hand-built import maps don't scale past leaf modules; a real-module/AppModule boot needs a proper npm-resolution strategy (populate `node_modules`, or build twenty-shared) **and** the cache slice. The bounded leaf (driver) is green (slice 3.1).

GraphQL head-on (slice 3.2) — ✅ DONE & GREEN (`deno-spike/graphql-schema-build.ts` + `apply-patches.sh`):
Confronted the GraphQL layer directly (the scariest Phase-3 unknown). Two results:
- **`@nestjs/graphql` code-first schema building WORKS under Deno node-compat** — decorators + `emitDecoratorMetadata` + reflection produce correct SDL (`@ObjectType`/`@Field`/`@Resolver`/`@Query` → `GraphQLSchemaFactory.create()`). Twenty is 100% code-first, so this green-lights the whole GraphQL layer.
- **The Yarn `patch:` patches can be applied on Deno via a build step** (`deno-spike/apply-patches.sh`): Yarn's `patch:` protocol doesn't exist on Deno and Deno Deploy reinstalls fresh, so the script applies the three `.patch` files in-place to the Deno-resolved `node_modules` packages (idempotent: reverse dry-run detects already-applied). Verified Deno then **runs the patched code** (`computeReachableTypes` present; schema still builds). Keeping packages as `npm:` specifiers (vs vendoring local CJS) preserves Deno's CJS→ESM named-export interop + automatic transitive-dep resolution — vendoring a local CJS file loses the named exports (`does not provide an export named 'Field'`).
- For Deno Deploy: run `apply-patches.sh` as the build step after install. (Open: confirm Deploy persists a patched `node_modules` from the build step; if not, fall back to vendoring patched packages + import-map — needs the CJS-interop wrinkle solved.)

Cache slice (slice 3.3) — ✅ DONE & GREEN (`deno-spike/cache-memory-check.ts`, **3/3**):
Un-hardcoded Redis in `cache-storage.module-factory.ts` (it had `const cacheStorageType = CacheStorageType.Redis` with the Memory branch commented out, and threw if `REDIS_URL` was unset).
- [x] Added config var **`CACHE_STORAGE_TYPE`** (enum `CacheStorageType`, default `redis`), same pattern as `MESSAGE_QUEUE_DRIVER_TYPE` — no `@CastToUpperSnakeCase` (lowercase enum values `redis`/`memory`).
- [x] Factory now reads `CACHE_STORAGE_TYPE` and wires the `memory` branch (no `store` → cache-manager's default per-instance in-memory cache; Redis-free, each cold isolate rebuilds from Postgres on demand). Redis stays the default so nothing breaks.
- [x] Verified on Deno: real factory + `memory` builds a working cache, set/get round-trips, no `REDIS_URL`, `store.name !== 'redis'`. `CacheStorageModule.onModuleDestroy` already guards `store.name === 'redis'`, so memory mode skips the quit cleanly.
- Follow-up (noted): the factory still STATICALLY imports `redis` + `cache-manager-redis-yet` at top level, so memory mode loads them (idle, no connection) — mirrors the queue slice keeping `bullmq` imported. Make these dynamic `import()` inside the Redis branch when trimming the Deno bundle.
- This removes the cache Redis hard-dependency that blocked the real-module boot (slice 3.1b: MetricsModule → cache). PG-backed shared cache (vs per-isolate memory) is still the deferred §6 decision — gate on real Prisma-DB RTT.

Sessions slice (slice 3.4) — ✅ DONE & GREEN (`deno-spike/session-memory-check.ts`, **3/3**):
Un-hardcoded Redis in `session-storage.module-factory.ts` (same hardcoded `CacheStorageType.Redis` + commented Memory branch as the cache).
- **Who actually uses `express-session`** (answers §6's open question): only **OIDC SSO**. `main.ts` installs the middleware but NO code reads/writes `req.session` except the OIDC passport strategy (`usePKCE: true` + `passReqToCallback` + `sessionKey` → `openid-client` stores the PKCE verifier/state in the session across redirect→callback). Normal auth is JWT. The "billing session" hits are Stripe, not express-session.
- [x] Added config var **`SESSION_STORAGE_TYPE`** (enum `CacheStorageType`, default `redis`), no `@CastToUpperSnakeCase`.
- [x] Factory reads it and wires the `memory` branch (express-session's default per-instance `MemoryStore`, Redis-free). Default stays redis.
- [x] Verified on Deno: `memory` returns a valid session config (no store, no `REDIS_URL`, no throw), cookie opts preserved.
- **Limitation (documented + warned at runtime):** per-instance `MemoryStore` breaks **OIDC SSO across multiple isolates** (the PKCE verifier won't be on the isolate that handles the callback). A **shared PG-backed session store** (connect-pg-simple over a `core` session table) is the follow-up to make SSO work Redis-free on Deno Deploy. Deployments not using OIDC SSO are unaffected.

Pub/sub slice (slice 3.5) — ✅ DONE & GREEN (`deno-spike/pubsub-pg-check.ts`, **3/3**):
Replaced the Redis-only GraphQL-subscriptions transport with a config-gated Postgres `LISTEN/NOTIFY` one.
- [x] `engine/subscriptions/drivers/postgres-pub-sub.driver.ts` — `PostgresPubSub extends PubSubEngine` (graphql-subscriptions), so `asyncIterator()` comes for free. A dedicated `pg.Client` LISTENs; publish via `pg_notify`. **Channel hashing**: Twenty's channels (`EVENT_STREAM_CHANNEL:<uuid>:<id>`) exceed Postgres's 63-byte channel limit, so each logical trigger is hashed to `tw_<sha1>` and the real trigger is carried in the body + filtered on (no cross-delivery on hash collision).
- [x] Config var **`PUB_SUB_DRIVER_TYPE`** (enum `PubSubDriverType` {redis, postgres}, default redis).
- [x] `SubscriptionService` now resolves the engine via `getPubSubEngine()` (lazy, config-gated) instead of hardcoding `redisClient.getPubSubClient()`; both RedisPubSub and PostgresPubSub are `PubSubEngine`. Added `onModuleDestroy` to close the PG client.
- [x] Verified on Deno against real Postgres: subscribe/publish round-trip, >63-char channel hashing, cross-channel filtering, and the `asyncIterator` path all work (3/3).
- **Deno/Node interop fix:** `import pg from 'pg'; const { Client } = pg;` (not `import { Client } from 'pg'`) — pg does `module.exports = {...}`, which Deno's CJS named-export lexer can't split. Same pattern needed wherever the Deno path imports a CJS-default package (e.g. ioredis).
- **Follow-ups (documented in the driver, per §7):** NOTIFY's ~8000-byte payload cap → store large payloads in a table + NOTIFY the id (§7.5); robust reconnection/re-LISTEN under Deploy idle-shutdown (§7.2, basic drop-and-reconnect is in).

npm resolution for the real boot (slice 3.6) — ✅ MECHANISM PROVEN (`deno-spike/prepare-deno-deps.sh`):
The earlier blocker — hand-built import maps don't scale to the full AppModule — is solved: **`deno install` can resolve twenty-server's entire npm graph** (2504 pkgs incl. nx, tsc, jest, @nestjs/*, typeorm, graphql), so a real boot only needs an `src/` (+ `twenty-shared`) mapping, not per-dep enumeration. Two transforms were required (both in `prepare-deno-deps.sh`):
- **Scope `workspaces`** to the server-needed set (`twenty-server`, `twenty-shared`, `twenty-emails`, `twenty-client-sdk`). Deno walks every workspace member and twenty-front pulls `linkify-react@4.3.3`, whose published manifest has a malformed requirement (`linkifyjs: "==4.3.3"`) that Deno's semver parser rejects — aborting the whole install. (npm `overrides` don't help: Deno parses the manifest before applying them. A root `deno.json` `workspace` field doesn't help either: Deno still reads package.json `workspaces`.)
- **De-patch** the Yarn `patch:NAME@VER#file` specs → exact `VER`. Deno can't parse `patch:` and otherwise resolves the wrong versions (got typeorm@0.3.30 / @nestjs/graphql@12.2.2 instead of the patched 0.3.20 / 12.1.1). After install, `apply-patches.sh` re-applies the patches (needs the exact versions).
- **Caveat (documented):** Deno ignores yarn.lock, so `^x-dev` ranges drift — `@typescript/native-preview` (tsgo) resolves a newer build that rejects `esModuleInterop=false`/`moduleResolution=node10`, breaking the **nx BUILD toolchain** (twenty-shared's `vite build` → `nx typecheck`). This only affects nx-based typecheck/test under Deno, NOT running the app. A clean nx run needs exact-pinning the drifting tools (a yarn.lock→deno.lock equivalent) — deferred.
- My slice changes don't break existing tests: the only spec touching a changed unit is `object-record-event-publisher.spec.ts`, which **mocks** `SubscriptionService` (`provide/useValue`, no `new`); the config-var/factory changes are additive + config-gated with no dedicated specs.

Deno ESM compat note (ongoing): `typescript/consistent-type-imports` is **off** in twenty-server's `.oxlintrc.json`, so a few files import a TS-only symbol as a value (`import { MessageQueueDriver }` instead of `import { type … }`). tsc erases these; Deno (per-file transpile) keeps them → runtime `does not provide an export named …`. They're rare (the boot loaded many files before hitting one) — fix outliers to `import type` as the boot surfaces them (fixed: `message-queue.service.ts`). A mass `import type` pass isn't needed.

Real-module boot on Deno (slice 3.7) — ✅ MILESTONE, GREEN (`deno-spike/boot-mq-module.ts`, **2/2**):
The hand-import-map ceiling is gone: with the prepared node_modules, the **real `MessageQueueCoreModule` boots under a real NestJS DI container on Deno** with `MESSAGE_QUEUE_DRIVER_TYPE=pg`. The whole module graph (typeorm, @sentry, @nestjs/*, bullmq, twenty-shared, metrics, cache, redis-client) resolves from node_modules; the PG driver is selected; a job added through a real `MessageQueueService` drains through it. Setup pieces (all generated by `prepare-deno-deps.sh` now):
- **Root `deno.json`** with `nodeModulesDir: "auto"` + the scoped `workspace` list — required to link workspace members (twenty-shared resolves to its built `dist/`). `nodeModulesDir` must be in the ROOT deno.json (Deno warns otherwise).
- **Member `packages/twenty-server/deno.json`** with the `src/` → `./src/` path alias (Deno doesn't read tsconfig paths) + **node-builtin specifiers mapped to `node:`** (the server imports `crypto`/`fs`/`path`/… bare — 139 files — which Deno won't resolve as builtins; the import-map alias fixes it source-free).
- **Resolution-scope rule learned:** the entrypoint must run from the workspace-member scope (auto-discovered member `deno.json`, NOT `--config`). `--config` detaches the run from the member's package.json, so its npm deps stop resolving. So the harness runs from `packages/twenty-server/`.
- **Road to the full AppModule boot (recon done — bounded, sequential Deno-compat steps):**
  1. ✅ JSON imports need `with { type: 'json' }` (only 2 in the server: `ai-providers.json` import in `default-ai-catalog.service.ts` + its spec — fixed; standard attribute works on Node 20+/TS 5.3+/Deno).
  2. ✅ Build the remaining workspace packages' `dist` — `twenty-emails` resolves only via `dist/index.mjs`. Two parts (both now in `prepare-deno-deps.sh`): (a) create Node-style `node_modules/<pkg>` symlinks — Deno's layout doesn't, and Node build tools (vite) need them, else `Cannot find module 'twenty-shared/translations'`; (b) `vite build` each dist-only package (twenty-shared, twenty-emails). Runtime `.mjs` builds fine; the `tsgo` `.d.ts` step is types-only.
  3. ✅ **Workspace-package transitive deps** (`react`, `@lingui/message-utils/compileMessage` from `twenty-emails/dist`) and **undeclared deps** (`esbuild`, `@tiptap/core`, `p-limit`, `qs` — imported but not in package.json, relying on Yarn hoisting). Mapped in the ROOT deno.json import map (the scope that covers built workspace packages).
  4. ✅ **Deep npm-subpath imports without extensions** (`graphql/language`, `graphql/validation/.../NoSchemaIntrospectionCustomRule`, ~20 `typeorm/*` internals, `@nestjs/common/constants`, …): Deno doesn't extension-resolve npm internals. Solved with an **auto-mapper** (scan src for `pkg/<subpath>`, find the concrete `.mjs/.js`/`/index.*` file in node_modules, emit an import-map entry) — 36 generated automatically.
  5. ✅ type-only-value-import outliers fixed as hit (`aws-lambda` `import { type SESMessage }` → `import type`).

Full-AppModule import on Deno (slice 3.8) — ✅ MILESTONE: **the entire real `AppModule` source graph imports on Deno** (`import { AppModule } from 'src/app.module'` → `function`, no stubs). Every controller/service/entity/resolver/integration + the real config system loads. Run via `prepare-deno-deps.sh` (+ `apply-patches.sh`) then `cd packages/twenty-server && deno run -A --sloppy-imports <entry>`. Blockers cleared (all source changes were minimal + principled — "extension", no logic forked):
- **`@lingui/core/macro` (389 files)** — compile-time macros (`module.exports = require("@lingui/babel-plugin-lingui-macro/macro")`, throws at runtime). Per the PURE-DENO directive (no build), solved with a **runtime shim** (`deno-spike/shims/lingui-macro.ts`) mapped at `@lingui/core/macro` + `@lingui/react/macro` — implements `msg`/`t` as real functions over `@lingui/core`'s i18n. No source change.
- **`emitDecoratorMetadata` type-imports (TS1272)** — Deno *always* uses `isolatedModules`, and with `emitDecoratorMetadata` (required by Nest/TypeORM) a decorated member's type annotation is retained as runtime metadata → ESM throws on the type-only export. No build escapes this (per-file swc *and* tsc transpile both retain it; only a full type-checked tsc *program* erases, which the directive forbids). **`deno check` enumerates the exact set (TS1272)** — 237 across 105 files — fixed to `import type` (132 specifiers). These are correct TS and harmless to the existing swc-CJS build (CJS forgives a missing named import; it only bites ESM). Recommend turning the `consistent-type-imports` lint rule on to keep it correct.
- **CJS globals `__dirname` / `require`** (16 files) — don't exist in ESM, and `import.meta` is illegal under tsc (module: commonjs). Added a **cross-runtime helper** `src/utils/get-module-dirname.ts` (`getModuleDirname`/`getModuleRequire`) that resolves the caller's location from the V8 stack — works in Node-CJS (jest/swc) AND Deno-ESM AND passes tsc (verified both runtimes). Per the user's "keep both" choice.
- **Tiny runtime fixes**: `aws-lambda` `import { type X }` → top-level `import type` (Deno elides it — it's never used at runtime); `pluralize` named import → default-import+destructure (CJS named-export interop, same as `pg`).
- **Import map** (`gen-import-map.py`, run by prepare): node-builtins → `node:`, auto-resolved extensionless deep npm subpaths (typeorm/graphql/@nestjs internals), the lingui shim, and undeclared/externalized deps (react, esbuild, p-limit, qs, …).

Booting the AppModule (slice 3.9) — ✅ DONE. `NestFactory.createApplicationContext(AppModule)` in deno mode against local Postgres now **fully boots clean** (no DB errors, no GraphQL dup, all 3 schemas — core/metadata/admin — built). Blockers cleared:
- **Peer-dependency package variants** — Deno installs `@nestjs+core@11.1.16` AND `@nestjs+core@11.1.16_1` (peer-context variants) as *separate instances*; singleton state (reflect-metadata registry, Nest/TypeORM/ptc-org metadata storages) splits → "Nest can't resolve ModuleRef" / "No metadata for X". Fixed by **`deno-spike/dedup-packages.py`** (merges every same-version variant to one instance; run by prepare).
- **Entity glob path** — `core.datasource.ts` globs `dist/**/*.entity.js`; running source there is no dist. Made the `isJest` source-toggle Deno-aware (`typeof Deno !== 'undefined'`) so it globs `src/` — 1-line, cross-runtime-safe. Entities then load + the DB connects.
- **graphql-type-json default import** — Deno's CJS interop returns `module.exports` (object) as the default import where Node's esModuleInterop returns `exports.default` (the scalar), so `import GraphQLJSON from 'graphql-type-json'` broke `() => GraphQLJSON`. Fixed with an import-map **shim** (`deno-spike/shims/graphql-type-json.ts`) re-exporting the real default — no source change (39 files left untouched).
- **GraphQL duplicate `@ObjectType` — RESOLVED.** The earlier dup ("Schema must contain uniquely named types but contains multiple types named RowLevelPermissionPredicateGroup") was eliminated by `gen-import-map.py`'s deep-npm-subpath fix (mapping subpaths to the node_modules file path instead of `npm:` so the single `@nestjs/graphql` instance is shared). Verified by instrumenting `TypeMetadataStorage` + `GraphQLModule.onModuleInit` (instrumentation reverted): the storage module loads **exactly once**; the dup `addObjectTypeMetadata` calls per `@ObjectType` decorator (1× eager + 1× via `LazyMetadataStorage.load(NO_TARGET_METADATA)`) are the normal `@nestjs/graphql` pattern and don't fail on Node OR Deno once the singleton split is fixed; the patched `resolverSchemaScope` IS taking effect (scope= metadata/admin/core observed); all 3 schemas build clean.
- **DB migrated under Deno (slice 3.10) — ✅ DONE.** Wrote two Deno entrypoints in `packages/twenty-server/`: `boot-setup-db.ts` (runs the real `src/database/scripts/setup-db.ts` → CREATE SCHEMA public/core + CREATE EXTENSION uuid-ossp/unaccent + unaccent_immutable wrapper) and `boot-migrate.ts` (CommandFactory over `CommandModule`, runs `run-instance-commands --force --include-slow`). All legacy TypeORM migrations + 50+ instance commands (1.x→2.9, incl. our own `CreatePgMessageQueueTablesFastInstanceCommand`) executed successfully on a real `core` schema in `deno_spike`. Post-migration `boot-app.ts` is silent (no `relation … does not exist`, no GraphQL errors).
- Source change to land this: `clean-suspended-workspaces.command.ts` had a `type CleanSuspendedWorkspacesOperation` imported as a runtime value (same TS1272 family — caught by Deno's per-file transpile when CommandModule loads the command discovery graph; tsc/swc CJS forgives it on Node). One-character fix → `import type`.

HTTP + heartbeats (slice 3.11) — ✅ MILESTONE. `packages/twenty-server/boot-serve.ts` boots the real `AppModule` via `NestFactory.create<NestExpressApplication>` on Deno node-compat, applies the same middleware stack as `main.ts` (session, body parsers, class-validator container, unhandled-exception filter, trust proxy), calls `app.listen()`, and — when `MESSAGE_QUEUE_DRIVER_TYPE=pg` — registers **three `Deno.cron` heartbeats** against the real `QUEUE_DRIVER` (`PgDriver`): `twenty-drain` (`drainAll`, every minute), `twenty-schedule` (`runDueSchedules`, every minute), `twenty-cleanup` (retention sweep, hourly). Verified end-to-end: server logs `Listening on http://localhost:3000`, `GET /healthz` → `200 {"status":"ok"…}`, `POST /graphql` with `{ __schema { queryType { name } } }` → `{"data":{"__schema":{"queryType":{"name":"Query"}}}}`. Routes mapped: `/healthz`, REST/batch, `/mcp`, `/graphql`, `/metadata`, `/admin-panel`, auth, etc. **This is the unified Deno entrypoint** — folds `main.ts` (API) + `queue-worker.ts` (worker) into one isolate, replacing the 3-process Node model per §3. `command.ts` is unchanged on Deno via `boot-migrate.ts` for ad-hoc command runs.

SPA fallback (slice 3.11b) — added to `boot-serve.ts`. `GET` requests outside an allowlisted set of API/asset prefixes return a cached `src/front/index.html` (pre-read at boot; `res.sendFile` is flaky under Deno's node-compat). Allowlist: `/graphql`, `/metadata`, `/admin-panel`, `/rest`, `/mcp`, `/auth`, `/oauth`, `/api`, `/webhooks`, `/healthz`, `/client-config`, `/.well-known`, `/app`, `/apps`, `/s`, `/files`, `/images`, `/assets`, `/manifest`, `/mockServiceWorker`. Registered BEFORE `app.listen()` so it sits ahead of Nest's catch-all NotFoundException.

End-to-end Chrome validation (slice 3.12) — ✅ DONE. Built `twenty-front` via `yarn nx build twenty-front` (one-time vite build over a restored Yarn workspace, then re-applied `prepare-deno-deps.sh`), copied `packages/twenty-front/build/` → `packages/twenty-server/src/front/` where `AppModule.getConditionalModules()` picks it up via `ServeStaticModule`. Loaded `http://127.0.0.1:3000/` in Chrome via the Playwright MCP: the full CRM UI renders (Companies/People/Opportunities/Tasks/Notes/Dashboards/Workflows nav, 599 demo companies in the table), the welcome modal's "Continue with Email" flow with prefilled `tim@apple.dev` reaches the Sign up button, click navigates to `/create/workspace`. So: HTTP → static SPA → REST + GraphQL + auth flow + JWT issuance all working through the Deno isolate.

Jest suite (slice 3.13) — ✅ GREEN. `npx jest --config=jest.config.mjs` from `packages/twenty-server/`:
```
Test Suites: 2 skipped, 656 passed, 656 of 658 total
Tests:       9 skipped, 5601 passed, 5610 total
Snapshots:   301 passed, 301 total
Time:        ~32s
```
Two surgical fixes (both committable to main; neither is Deno-specific bug-by-bug):
1. `transformIgnorePatterns` in `jest.config.mjs` — added `\\.deno` to the negative-lookahead alongside `file-type` etc. Reason: when `node_modules` is in Deno's nested layout (`node_modules/.deno/pkg@ver/node_modules/pkg/…`), the regex matches the FIRST `/node_modules/` segment, sees `.deno/` next, and bails — so the deep `file-type` ESM file was never SWC-transformed and Jest crashed on `import {…} from 'node:stream/web'`. Allowing `.deno` falls through to the package-name check at the second `/node_modules/` segment.
2. `setupTests.ts` — activate `i18n` with an empty `en` catalog. Many server util specs call functions containing `t\`…\`` lingui macros (`validate-file-extension.util`, `format-dimension-value.util`, etc.); the lingui-swc-plugin emits a runtime `i18n._()` call that throws "Attempted to call a translation function without setting a locale" when no locale is active. With an empty catalog, `i18n._()` returns the message id — correct for tests that don't assert translated copy. Pre-existing latent test bug (reproduced on `main` without my Deno changes), surfaced only because the suite now runs without the env that previously masked it.

Still TODO: integration suite (`nx run twenty-server:test:integration:with-db-reset`) — runs against a real DB and depends on `database:reset` which invokes Node-build artifacts; can be redirected to `boot-migrate.ts` + `boot-setup-db.ts`, not done in this slice.

Next: `deno deploy create` config + Prisma Postgres provisioning, then Phase 4 hardening (subscription reconnect, conn-pool load test, dynamic crons).

Deno Deploy attempt (slice 3.14) — ⚠️ BLOCKED by free-plan limits, not a Deno-compat issue. App created: `machinagod-sandbox/twenty-deno` (https://console.deno.com/machinagod-sandbox/twenty-deno). Findings:
- **Build timeout cap = 5 min** on this plan. Twenty's full install (deno install + dedup + flat-hoist + workspace symlinks + vite build of twenty-shared/emails/client-sdk + apply-patches) takes ~3-4 min locally; the additional twenty-ui + twenty-front vite builds push total well past 5 min. Build-on-Deploy is therefore tight even for the minimum chain.
- **Upload caps:** repeatedly dies at ~4636/24055 files / ~80 MB into the upload with `http2 error: stream error sent by user`. Verified it's payload-specific, not connectivity: a 1-file `Deno.serve` hello-world over the same network succeeds (`Successfully uploaded your application!`). Free-plan upload limit isn't documented in the CLI surface but is somewhere in that range.
- **App-count cap = 5** on this plan. The first create succeeded; subsequent create attempts (while iterating on flags) hit it.
- Built config used (recorded for the next attempt): `--source local --runtime-mode dynamic --entrypoint packages/twenty-server/boot-serve.ts --install-command "bash deno-spike/prepare-deno-deps.sh && bash deno-spike/apply-patches.sh ./ node_modules" --build-command ":" --pre-deploy-command ":" --do-not-use-detected-build-config --no-wait`, with `node_modules` and unused workspace packages (twenty-website/docs/zapier/companion/e2e-testing/sdk/new-ui/cli/apps/utils, .yarn/.git/.nx/.playwright-mcp, the unused frontend `src/`/`public`/`__mocks__` dirs since we ship the pre-built `packages/twenty-server/src/front/`) `--ignore`d.

Paths forward (any one unblocks):
1. **Plan upgrade** — 30-min build timeout + larger upload limit. The minimum viable for Twenty on this CLI flow.
2. **`--source github`** — push the prepared branch, let Deploy clone server-side; bypasses the local-upload cap (build cap still applies, so plan upgrade likely still needed).
3. **Server bundle** — esbuild/deno_emit twenty-server into one file (drops file count to ~10) AND pre-build everything locally → Deploy needs only ~50 MB and a `:` install/build. Violates the "PURE DENO — Deno runs the TS source directly" §1 constraint, so only as a last resort.

GitHub-source deploy (slice 3.15) — ✅ ATTEMPTED. New org `machinagod` (free token from higitotal/.env), app `twenty-deno` (id `a91de349-87da-49ba-951f-f166350abfa0`), `--source github --owner machinagod --repo twenty`. Deploy follows the repo's default branch — pushed our spike commits to `main` (fast-forward from `186d5b8faa`). API for log inspection: `GET /v2/apps/<id>/revisions` + `GET /v2/revisions/<id>/build_logs` + `.../progress` with `Authorization: Bearer ddo_…`. Iteratively fixed:
- `tsc --noCheck` on twenty-shared `.d.ts` emit — Deploy's tsc env hit a `number|null|undefined` narrowing case (class-validator's `isDefined` has no type predicate) that locally narrowed correctly.
- Order bug in `build-frontend.sh` — the vite/tsc-binary check ran BEFORE the pre-built-bundle short-circuit, so it errored on Deploy where dev-deps aren't installed.
- Stripped devDependencies before `deno install` (no `--prod` flag on Deploy's Deno version): jest, eslint, swc/cli, lingui/cli, etc. drop their transitive trees. Cuts install + `deploying`-phase enumeration substantially.
- Committed `twenty-shared/dist`, `twenty-emails/dist`, `twenty-client-sdk/dist`, and the **pre-built `packages/twenty-server/src/front/`** to the deploy branch (overrode each package's `dist`-only `.gitignore`). With dev-deps stripped, vite isn't available on Deploy — these dists are what twenty-server imports at runtime.
- Added `unstable: ["sloppy-imports", "cron"]` to the ROOT `deno.json` (member-level is rejected with a warning) so the bare `from 'src/app.module'` imports resolve.
- Added the **DATABASE_URL → PG_DATABASE_URL bridge** at the top of `boot-serve.ts` (Deploy's Prisma assignment injects `DATABASE_URL`; Twenty reads `PG_DATABASE_URL`).
- Provisioned + assigned a Prisma Postgres database (`twenty-pg`) to the app. Env vars set: `MESSAGE_QUEUE_DRIVER_TYPE=pg`, `CACHE_STORAGE_TYPE=memory`, `SESSION_STORAGE_TYPE=memory`, `PUB_SUB_DRIVER_TYPE=postgres`, `NODE_ENV=production`, plus `APP_SECRET` (secret).

Result: install + build cleared every blocker we hit. `deploying` step then materializes the resolved npm graph — and **fails silently around module ~1100 of 3541** (every Twenty deploy attempt died at this same point; a 1-file `Deno.serve` hello-world over the same setup uploads + serves cleanly, confirming it's payload-specific). Free Deploy plan's per-deployment dependency-graph budget is the hard wall.

Server bundle attempt (slice 3.16) — ⚠️ HIT NESTJS DI WALL. `deno-spike/bundle-server.mjs` (esbuild) collapses 3541 packages → one 103.5 MB `.mjs`. Bundle loads through `AppModule dependencies initialized` and fails on `Nest can't resolve dependencies of the ResolversExplorerService (MetadataScanner at index [1])`. Bundle-level fixes that DID land:
- `@swc/core` plugin with `legacyDecorator: true` + `decoratorMetadata: true` (esbuild's built-in TS transform drops the type info before the decorator-metadata pass; TypeORM's `ColumnTypeUndefinedError` is the classic symptom).
- Node-builtins-as-`node:` plugin (Deno rejects bare `import 'buffer'` with `Import "buffer" not a dependency`).
- `globalThis.require = createRequire(import.meta.url)` + `__dirname` / `__filename` ESM bridges in the banner so dynamic `require("node:stream")` calls in bundled CJS (NestJS, TypeORM) work.
- `@lingui/{core,react}/macro` rewritten to the runtime shim (esbuild's `alias` field is bypassed when a package's `exports` field redirects the subpath — caught both bare specifier and resolved file path via `onResolve`).
- Deep extension-less npm subpaths (`typeorm/error/EntityNotFoundError`, `graphql/lang/…`) resolved by walking `node_modules` manually.
- `bcrypt` → `bcryptjs` alias (native `.node` binding can't be bundled).
- `sdk-client-package-dirname` shimmed to a static built-mode constant (dev branch uses `require.resolve('twenty-client-sdk/core')` which fails in the bundle's runtime).
- `jsdom`, `listr`/`any-observable`/`@samverschueren/stream-to-observable`, `@genql/cli`, `@graphql-codegen/*`, `bullmq`, `ioredis`, optional NestJS adapters (`@nestjs/microservices`/`websockets`/`mongoose`), `@apollo/subgraph`, `@mikro-orm/core`, `@fastify/static` stubbed via a non-throwing Proxy (deno-mode doesn't execute them, but the throwing variant broke DI which constructs them anyway).

Remaining bundle blocker is the standard esbuild + NestJS reflection split — DiscoveryModule's `MetadataScanner` provider isn't reachable from `@nestjs/graphql`'s `ResolversExplorerService` after bundling. Likely class-identity divergence between two `@nestjs/core` paths in the bundle, or a missing dynamic provider. Bounded fix, not attempted in this slice.

Honest landing zone for the next session:
1. **Plan upgrade** clears slice 3.15's wall directly and keeps the §1 "pure-Deno-source" architecture.
2. **Resume the bundle** with a focused MetadataScanner identity dump (instrument `@nestjs/core/discovery/discovery.module` + grep the bundle for duplicate class definitions) — 1-3 hours.
3. **Local + GitHub-source ↔ Yarn workflow** continues to work unchanged.

Deno 2.8 `import defer` experiment (slice 3.17) — ✅ TECHNIQUE PROVED, BLOCKED BY DEPLOY RUNTIME. Per the Deno 2.8 release notes (`https://deno.com/blog/v2.8#import-defer`), the TC39 import defer proposal lets a module parse into the static graph but skip top-level evaluation until something touches its namespace. Hypothesis: Deploy's deploying-phase materialization should also honor it.

Measured on `machinagod/twenty-deno`:

| Approach | `deploying` log lines | Outcome |
|---|---|---|
| Eager `import { ... } from ...` (original) | ~1102 `Initialize <pkg>` | Silent abort around module 1100 — the wall |
| `import defer * as ns from ...` (TC39 syntax) | **5** | Deploy's graph walker honors defer (wall vanishes). Revision still failed with `EVENT_ITERATOR_VALIDATION_FAILED` because Deploy's runtime is pre-2.8 and can't parse the syntax. |
| `await import(...)` with literal specifier | ~1082 | No help — Deno resolves literal-string dynamic imports statically; same wall |

So `import defer` is exactly the right hammer for this nail. The only thing left is Deploy's runtime shipping Deno 2.8. Per https://docs.deno.com/deploy/reference/runtime/ Deploy is on 2.5.0 (one recent build showed 2.7.8, so docs may lag; either way pre-2.8). No CLI/`deno.json` flag exposes a runtime version pin.

`boot-serve.ts` currently uses dynamic `await import()` inside an awaited `bootstrap()`. That's a no-op on Deploy's graph walker but is a one-line swap to `import defer` the moment Deploy's runtime catches up — keep the structure as-is so the upgrade is trivial. Local boot (Deno 2.8.2) runs cleanly either way.

`deno pack` (slice 3.18) — DEFERRED. Replacing the `tsc --noCheck` + `vite build` chain for the workspace dists with `deno pack` would require a layout change: `pack` emits a `.tgz` (npm-publishable), the dists are read from `packages/<pkg>/dist/` trees. Worth it once we're past the materialization wall and can iterate. The committed dists on the deploy branch already work as-is.

Split-entrypoint trick (slice 3.19) — ✅ DEPLOYING-PHASE WALL CLEARED. Insight: Deno Deploy's deploying phase pre-compiles every module statically reachable from the entrypoint, but it can only follow LITERAL-STRING dynamic-import specifiers. Move all heavy NestJS / TypeORM / GraphQL imports into a separate `boot-handler.ts`, and load it from `boot-serve.ts` via a runtime-computed specifier:
```ts
// boot-serve.ts (statically tiny — only node:buffer/stream + the Express bridge)
const HANDLER_PATH = (() => {
  const parts = [Deno.env.get('TWENTY_HANDLER_PREFIX') ?? './boot-', 'handler', '.ts'];
  return parts.join('');
})();
let bootPromise: Promise<{ express: ExpressApp }> | null = null;
const ensureBoot = () => bootPromise ??= (async () => {
  const mod = await import(HANDLER_PATH);
  return mod.bootHandler();
})();
Deno.serve(async (req) => bridgeRequest((await ensureBoot()).express, req));
```
The deploy-phase graph walker can't statically resolve `parts.join('')`, so the entire NestJS subtree is invisible to it. First HTTP request triggers the dynamic import + NestJS bootstrap + Express handler bridge through `Deno.serve`. The Web Request → Express handler bridge is inline at the bottom of `boot-serve.ts` (Express is just a `(req, res, next)` function; we synthesize node http req/res from the Web Request).

Result: `https://twenty-deno.machinagod.deno.net/` resolves. Build succeeded (rev `3f745jh9kmzx`). Deno.serve is bound at top level so warmup completes immediately — exactly the optimization the user pointed at.

**New wall: runtime isolate memory.** Once Deno.serve receives a request and dynamically loads `boot-handler.ts`, NestJS DI starts walking its 952-package graph. The isolate dies with `Isolate terminated: memory limit exceeded` part-way through. Twenty's hot graph genuinely exceeds the free-tier isolate memory cap (~512MB). The fix is a plan upgrade — `paid` tiers raise the memory limit. No CLI/`deno.json` flag exposes a per-app memory override on free.

So the structural-mismatch picture is now precise:
- ✅ Module count / deployment-phase materialization: solved via split entrypoint + runtime-computed import path (slice 3.19).
- ✅ Build-timeout cap (5 min): solved via committed pre-built dists + dev-deps stripped (slice 3.15).
- ⚠️ Runtime isolate memory (~512 MB free tier): blocking. Twenty's eager DI graph at module-init time exceeds it. Plan upgrade is the unblock.

For the next session: the deploy app, all build infra, and the live URL are all wired. A higher-tier paid Deploy plan should turn this green end-to-end.

### Reproduce the boot (local session handoff)
1. Install Deno; clone the branch `claude/wire-pg-driver-twenty-nj6xy`.
2. `bash deno-spike/prepare-deno-deps.sh` (scopes workspaces, de-patches, deno install, dedups variants, builds twenty-shared/emails/client-sdk, generates deno.json). NOTE: this MUTATES root + twenty-server package.json (revert with `git checkout` to return to Yarn mode).
3. `bash deno-spike/apply-patches.sh ./ node_modules` (applies the 3 Yarn patches; the `./ node_modules` args point at the root `node_modules`, not the legacy `deno-spike/node_modules` default).
4. Postgres reachable as `PG_DATABASE_URL`; user must own the DB so `setup-db` can `CREATE EXTENSION unaccent` (in the local repro: `psql -U <owner> -d <db>`).
5. From `packages/twenty-server/`:
   - `PG_DATABASE_URL=… deno run -A --sloppy-imports boot-setup-db.ts` — creates schemas + extensions.
   - `env NODE_ENV=development APP_SECRET=… PG_DATABASE_URL=… MESSAGE_QUEUE_DRIVER_TYPE=pg CACHE_STORAGE_TYPE=memory SESSION_STORAGE_TYPE=memory PUB_SUB_DRIVER_TYPE=postgres deno run -A --sloppy-imports boot-migrate.ts` — runs legacy TypeORM migrations + all instance commands.
   - Same env vars: `deno run -A --sloppy-imports boot-app.ts` — boots the full AppModule.

**Boot env (deno mode):** `MESSAGE_QUEUE_DRIVER_TYPE=pg CACHE_STORAGE_TYPE=memory SESSION_STORAGE_TYPE=memory PUB_SUB_DRIVER_TYPE=postgres APP_SECRET=… PG_DATABASE_URL=… NODE_ENV=development`.
  The MQ boot stubs `TwentyConfigService` to stay focused; the full AppModule boot is the next milestone and clears these in order.
- twenty-shared is already built (`dist/*.mjs`) — its vite build succeeded; only the `tsgo` `.d.ts` step failed (types only, irrelevant at runtime).

### Configurable "deno mode" vs "redis mode" (per the user's requirement)
Every Redis concern is an independent config var, each defaulting to the Redis/BullMQ behaviour, so nothing changes unless explicitly flipped. To run Redis-free ("deno mode") set:
```
MESSAGE_QUEUE_DRIVER_TYPE=pg
CACHE_STORAGE_TYPE=memory
SESSION_STORAGE_TYPE=memory      # or a future PG store for OIDC SSO
PUB_SUB_DRIVER_TYPE=postgres
```
Unset (or the defaults `bull-mq`/`redis`/`redis`/`redis`) = "redis mode". They can be mixed (e.g. PG queue + Redis cache) as needed.

Still TODO in Phase 2:
- [ ] PG-backed shared session store (connect-pg-simple) for OIDC SSO on Deno (memory mode covers non-SSO).
- [ ] Retire `redis-client.service.ts`; update admin-panel health indicators (only needed once "redis mode" is dropped — keep for now since it's config-selectable).

New files (this initiative):
- `packages/twenty-server/src/engine/core-modules/message-queue/drivers/pg-driver-core.ts`
- `packages/twenty-server/src/engine/core-modules/message-queue/drivers/pg.driver.ts`
- `packages/twenty-server/src/engine/core-modules/message-queue/drivers/typeorm-sql-executor.ts` (slice 3)
- `packages/twenty-server/src/database/commands/upgrade-version-command/2-9/2-9-instance-command-fast-1799000040000-create-pg-message-queue-tables.ts` (slice 3)
- `deno-spike/validate-pg-driver.ts`
- `deno-spike/boot-real-driver.ts` + `deno-spike/boot-real-driver.json` (slice 3.1 — real driver on real TypeORM under Deno; run with `--sloppy-imports`)
- `deno-spike/graphql-schema-build.ts` + `deno-spike/graphql-schema-build.json` (slice 3.2 — code-first GraphQL schema builds on Deno + patch verification)
- `deno-spike/apply-patches.sh` (slice 3.2 — Deno-native replacement for Yarn `patch:`; build step that patches the resolved node_modules)
- `deno-spike/prepare-deno-deps.sh` (slice 3.6/3.7 — scope workspaces + de-patch + generate the root/member `deno.json` so `deno install` + a real boot work)
- `deno-spike/boot-mq-module.ts` (slice 3.7 — real MessageQueueCoreModule boots on Deno; run from `packages/twenty-server/`, see header)
- `deno-spike/cache-memory-check.ts` + `.json` (+ `shims/twenty-config-service.ts`) (slice 3.3 — Redis-free memory cache via the real factory on Deno)
- `deno-spike/session-memory-check.ts` + `.json` (+ `shims/resolve-session-cookie-secrets.ts`) (slice 3.4 — Redis-free memory session config via the real factory on Deno)
- `deno-spike/pubsub-pg-check.ts` + `.json` (slice 3.5 — PG LISTEN/NOTIFY pub/sub round-trip on Deno). Server: `engine/subscriptions/drivers/postgres-pub-sub.driver.ts` + `enums/pub-sub-driver-type.enum.ts`.

### Phase 3 — Deno entrypoint + frontend
- [x] Single Deno entrypoint: real `AppModule` via `NestFactory.create<NestExpressApplication>` (Node-compat http) + static `Deno.cron` heartbeats (drain + schedule + cleanup). `boot-serve.ts` folds the `queue-worker` ApplicationContext into the same isolate (cron handlers call the QUEUE_DRIVER directly). Verified `Listening on :3000`, `/healthz`, `/graphql` end-to-end (slice 3.11).
- [x] Resolve TypeORM / `@nestjs/graphql` / nestjs-query-graphql patches without Yarn — **`deno-spike/apply-patches.sh`** patches the Deno-resolved node_modules in place as a build step (idempotent). Verified Deno runs the patched code (slice 3.2). Open: confirm Deno Deploy persists this from its build step; else vendor + import-map.
- [x] Confirm code-first `@nestjs/graphql` schema generation works under Deno (slice 3.2 — it does; slice 3.9/3.11 confirms all 3 schemas — core/metadata/admin — build at runtime).
- [x] DB migration on Deno (`boot-setup-db.ts` + `boot-migrate.ts`, slice 3.10). Runs the real `setup-db.ts` + `run-instance-commands --force --include-slow` over the prepared node_modules.
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
