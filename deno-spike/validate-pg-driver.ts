// Validates the REAL shipping SQL core (packages/twenty-server/.../pg-driver-core.ts)
// against Postgres, via a node-postgres SqlExecutor adapter. No NestJS needed —
// this exercises the dependency-free core directly.
//
//   deno run -A validate-pg-driver.ts
//   DATABASE_URL=... deno run -A validate-pg-driver.ts

import pg from "npm:pg@8.12.0";
import {
  type CronNextRun,
  type SqlExecutor,
  PgMessageQueueCore,
} from "../packages/twenty-server/src/engine/core-modules/message-queue/drivers/pg-driver-core.ts";

const DATABASE_URL = Deno.env.get("DATABASE_URL") ??
  "postgres://postgres:postgres@localhost:5432/deno_spike";

const pool = new pg.Pool({ connectionString: DATABASE_URL });

const executor: SqlExecutor = {
  async query(sql, params) {
    const result = await pool.query(sql, params as unknown[]);
    return result.rows as Record<string, unknown>[];
  },
  async withTransaction(fn) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const tx: SqlExecutor = {
        query: async (sql, params) =>
          (await client.query(sql, params as unknown[])).rows as Record<string, unknown>[],
        withTransaction: (nested) => nested(tx),
      };
      const out = await fn(tx);
      await client.query("COMMIT");
      return out;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },
};

// Spike DB has no `core` schema → use public.
const core = new PgMessageQueueCore(executor, {
  schema: "public",
  jobTable: "messageQueueJob",
  scheduleTable: "messageQueueJobSchedule",
});

const cronNextRun: CronNextRun = (_pattern, from) =>
  new Date(from.getTime() + 60_000); // stub: "1 minute later"

let passed = 0;
let failed = 0;
function check(label: string, condition: boolean, detail?: unknown) {
  if (condition) {
    console.log(`  ✅ ${label}`);
    passed++;
  } else {
    console.log(`  ❌ ${label}${detail !== undefined ? ` — ${JSON.stringify(detail)}` : ""}`);
    failed++;
  }
}

const pendingCount = async (queue: string, optId?: string) => {
  const rows = await executor.query(
    `SELECT count(*)::int c FROM "messageQueueJob"
     WHERE queue=$1 AND status='pending'${optId ? " AND opt_id=$2" : ""}`,
    optId ? [queue, optId] : [queue],
  );
  return Number(rows[0].c);
};

try {
  await core.ensureSchema();
  await executor.query(`TRUNCATE "messageQueueJob", "messageQueueJobSchedule"`);

  console.log("\n[1] enqueue → claim → complete");
  {
    const q = "q-basic";
    core.work; // no-op ref
    await core.enqueue({ queue: q, name: "demo", data: { a: 1 }, priority: 2, maxAttempts: 1 });
    const claimed = await core.claimBatch(q, 10, 600);
    check("one job claimed", claimed.length === 1, claimed.length);
    check("payload round-trips", claimed[0]?.data?.a === 1, claimed[0]?.data);
    check("attempts incremented to 1", claimed[0]?.attempts === 1, claimed[0]?.attempts);
    await core.markCompleted(claimed[0].id);
    const reclaim = await core.claimBatch(q, 10, 600);
    check("completed job not re-claimed", reclaim.length === 0, reclaim.length);
  }

  console.log("\n[2] dedup — only one WAITING job per opt_id");
  {
    const q = "q-dedup";
    await core.enqueue({ queue: q, name: "demo", data: {}, optId: "dup-1", priority: 0, maxAttempts: 1 });
    await core.enqueue({ queue: q, name: "demo", data: {}, optId: "dup-1", priority: 0, maxAttempts: 1 });
    check("second enqueue deduped", (await pendingCount(q, "dup-1")) === 1);
    // After claiming (→ active), a new waiting job with same id is allowed again.
    const claimed = await core.claimBatch(q, 10, 600);
    await core.enqueue({ queue: q, name: "demo", data: {}, optId: "dup-1", priority: 0, maxAttempts: 1 });
    check("new waiting allowed while prior is active", (await pendingCount(q, "dup-1")) === 1, { claimed: claimed.length });
  }

  console.log("\n[3] delay — future jobs are not claimed yet");
  {
    const q = "q-delay";
    await core.enqueue({ queue: q, name: "later", data: {}, priority: 0, maxAttempts: 1, delayMs: 60_000 });
    check("delayed job not claimed", (await core.claimBatch(q, 10, 600)).length === 0);
    check("delayed job is pending", (await pendingCount(q)) === 1);
  }

  console.log("\n[4] retry — failed job with attempts left returns to pending");
  {
    const q = "q-retry";
    await core.enqueue({ queue: q, name: "flaky", data: {}, priority: 0, maxAttempts: 2 });
    const c1 = await core.claimBatch(q, 10, 600);
    await core.markFailed(c1[0].id, "boom", 0); // 0s backoff → immediately due
    const c2 = await core.claimBatch(q, 10, 600);
    check("job re-claimed after retryable failure", c2.length === 1, c2.length);
    check("attempts now 2", c2[0]?.attempts === 2, c2[0]?.attempts);
    await core.markFailed(c2[0].id, "boom again", 0); // attempts(2) >= max(2) → failed
    check("no retry past max_attempts", (await core.claimBatch(q, 10, 600)).length === 0);
  }

  console.log("\n[5] cron schedule — due schedule enqueues a job + advances");
  {
    const q = "q-cron";
    await core.upsertSchedule(
      { jobKey: "nightly", queue: q, name: "nightly", data: { x: 1 }, everyMs: 5000 },
      new Date(),
      cronNextRun,
    );
    // force it due
    await executor.query(`UPDATE "messageQueueJobSchedule" SET next_run_at = now() - interval '1 second' WHERE queue=$1`, [q]);
    const fired = await core.runDueSchedules((p) => core.enqueue(p), new Date(), cronNextRun);
    check("one schedule fired", fired === 1, fired);
    check("schedule enqueued a job", (await pendingCount(q)) === 1);
    const sched = await executor.query(`SELECT run_count, next_run_at FROM "messageQueueJobSchedule" WHERE queue=$1`, [q]);
    check("run_count advanced to 1", Number(sched[0]?.run_count) === 1, sched[0]?.run_count);
    check("next_run_at moved to future", new Date(String(sched[0]?.next_run_at)) > new Date(), sched[0]?.next_run_at);
  }

  console.log("\n[6] cron repeat.limit — schedule removed after limit");
  {
    const q = "q-cron-limit";
    await core.upsertSchedule(
      { jobKey: "once", queue: q, name: "once", data: {}, everyMs: 5000, repeatLimit: 1 },
      new Date(),
      cronNextRun,
    );
    await executor.query(`UPDATE "messageQueueJobSchedule" SET next_run_at = now() - interval '1 second' WHERE queue=$1`, [q]);
    await core.runDueSchedules((p) => core.enqueue(p), new Date(), cronNextRun);
    const remaining = await executor.query(`SELECT count(*)::int c FROM "messageQueueJobSchedule" WHERE queue=$1`, [q]);
    check("schedule deleted after reaching limit", Number(remaining[0].c) === 0, remaining[0].c);
    check("but the job was still enqueued", (await pendingCount(q)) === 1);
  }

  console.log("\n[7] removeCron — schedule deleted");
  {
    const q = "q-cron-remove";
    await core.upsertSchedule({ jobKey: "k", queue: q, name: "k", data: {}, everyMs: 1000 }, new Date(), cronNextRun);
    await core.removeSchedule(q, "k");
    const rows = await executor.query(`SELECT count(*)::int c FROM "messageQueueJobSchedule" WHERE queue=$1`, [q]);
    check("schedule removed", Number(rows[0].c) === 0);
  }

  console.log(`\n==== ${passed} passed, ${failed} failed ====`);
} catch (error) {
  console.error("FATAL", error);
  failed++;
} finally {
  await pool.end();
  Deno.exit(failed === 0 ? 0 : 1);
}
