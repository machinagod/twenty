# deno-spike — Phase 1 boot spike (go/no-go)

Throwaway scratch app. Proves the risky parts of running Twenty as a **pure
Deno-built, PG-only, Deno Deploy v2** app — **no Yarn, no Vite for this part, no
KV, no Redis**. Deno resolves the npm trees and transpiles the decorators itself.

## What it proves

| Risk | Result |
|------|--------|
| NestJS boots under Deno (node-compat) | ✅ |
| `emitDecoratorMetadata` DI works (constructor injection resolves) | ✅ |
| TypeORM connects to Postgres + `synchronize` builds schema | ✅ |
| npm deps resolved & built by **Deno only** (no Yarn) | ✅ |
| `Deno.cron` heartbeat fires and drains a PG job queue | ✅ |
| PG-as-queue: enqueue → `FOR UPDATE SKIP LOCKED` drain → done | ✅ |
| UUIDs without extensions (`gen_random_uuid()`, Prisma-safe) | ✅ |

## Run

```bash
# needs Postgres; default DATABASE_URL = postgres://postgres:postgres@localhost:5432/deno_spike
deno task start
```

`Deno.cron` requires `--unstable-cron` locally (already in the task); on Deno
Deploy v2 it is enabled automatically.

## Endpoints

- `GET  /`                — health
- `GET/POST /widgets`     — TypeORM read/write (proves decorator metadata)
- `POST /jobs`            — enqueue into the PG queue
- `POST /drain`           — manually run one drain batch
- `GET  /jobs`            — recent jobs + status
- `GET  /metadata-timing` — N sequential round-trips ≈ cold-start metadata-rebuild cost

## Notes for the real port

- **DB**: target is a managed **Prisma Postgres** on Deno Deploy. It is
  Postgres-wire-compatible, so `npm:pg` + TypeORM connect via the injected
  `DATABASE_URL` — config swap only. Keep UUIDs on `gen_random_uuid()` (core);
  do **not** rely on `uuid-ossp`/`pgcrypto` extensions.
- **Jobs**: this `JobsService` is the stand-in for `MessageQueueDriver`. The real
  port implements the existing 5-method interface (`add`/`work`/`addCron`/
  `removeCron`/`register`) over these same tables. Static `Deno.cron` is the
  heartbeat; runtime-defined schedules live in a `job_schedules` table the tick
  evaluates (Deno.cron is declared statically at load).
- **Cache**: `/metadata-timing` is the probe for the deferred cache decision.
