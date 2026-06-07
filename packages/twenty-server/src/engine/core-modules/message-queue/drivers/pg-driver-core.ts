// Dependency-free core for the Postgres message-queue driver.
//
// This file intentionally imports NOTHING (no NestJS, no Sentry, no path aliases,
// no npm packages) so the exact SQL that ships can be exercised standalone by the
// deno-spike harness. The NestJS-facing `pg.driver.ts` wraps this with metrics,
// Sentry, logging and the real MESSAGE_QUEUE_PRIORITY / QUEUE_RETENTION values.
//
// Replaces BullMQ semantics with Postgres:
//  - add()        -> INSERT a job row (with waiting-job dedup on opt_id)
//  - claim/drain  -> UPDATE ... FOR UPDATE SKIP LOCKED (no always-on worker)
//  - addCron()    -> UPSERT a job_schedules row (Deno.cron tick evaluates it)

// A minimal SQL executor both TypeORM (DataSource) and node-postgres (Pool) can
// satisfy via a thin adapter. `query` returns rows as plain objects.
export interface SqlExecutor {
  query(sql: string, params?: unknown[]): Promise<Record<string, unknown>[]>;
  // Required for the claim + schedule-eval paths: FOR UPDATE locks must live on a
  // single connection/transaction. TypeORM: dataSource.transaction; pg: a client + BEGIN/COMMIT.
  withTransaction<T>(fn: (tx: SqlExecutor) => Promise<T>): Promise<T>;
}

export type PgDriverTables = {
  // Schema is trusted config (never user input). Default differs per environment:
  // 'core' in the server, 'public' in the spike.
  schema: string;
  jobTable: string;
  scheduleTable: string;
};

export const DEFAULT_TABLES: PgDriverTables = {
  schema: 'core',
  jobTable: 'messageQueueJob',
  scheduleTable: 'messageQueueJobSchedule',
};

export type EnqueueParams = {
  queue: string;
  name: string;
  data: unknown;
  optId?: string; // QueueJobOptions.id — dedup of WAITING jobs
  priority: number; // lower = higher priority (BullMQ convention)
  maxAttempts: number; // 1 + retryLimit
  delayMs?: number;
};

export type ClaimedJob = {
  id: string;
  name: string;
  data: Record<string, unknown>;
  attempts: number;
  maxAttempts: number;
};

export type ScheduleParams = {
  jobKey: string; // getJobKey({ jobName, jobId })
  queue: string;
  name: string;
  data: unknown;
  pattern?: string; // cron expression (repeat.pattern)
  everyMs?: number; // repeat.every
  repeatLimit?: number; // repeat.limit
  priority?: number;
};

export type RetentionConfig = {
  completedMaxAgeSeconds: number;
  failedMaxAgeSeconds: number;
};

// Compute the next fire time for a cron `pattern`. Injected by the wrapper
// (server uses cron-parser) so this core stays dependency-free. `everyMs`
// schedules are handled natively and don't need this.
export type CronNextRun = (pattern: string, from: Date) => Date;

const ident = (name: string) => `"${name.replace(/"/g, '""')}"`;

export class PgMessageQueueCore {
  private readonly job: string;
  private readonly schedule: string;

  constructor(
    private readonly sql: SqlExecutor,
    tables: PgDriverTables = DEFAULT_TABLES,
  ) {
    this.job = `${ident(tables.schema)}.${ident(tables.jobTable)}`;
    this.schedule = `${ident(tables.schema)}.${ident(tables.scheduleTable)}`;
  }

  // DDL. Single source of truth for the schema — reused by the spike and by the
  // server instance-command migration. gen_random_uuid() is Postgres core (no
  // uuid-ossp), which a managed Prisma Postgres may not let us install.
  buildSchemaSql(): string {
    return `
      CREATE TABLE IF NOT EXISTS ${this.job} (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        queue varchar NOT NULL,
        name varchar NOT NULL,
        data jsonb NOT NULL DEFAULT '{}'::jsonb,
        opt_id varchar,
        priority int NOT NULL DEFAULT 0,
        attempts int NOT NULL DEFAULT 0,
        max_attempts int NOT NULL DEFAULT 1,
        status varchar NOT NULL DEFAULT 'pending',
        run_at timestamptz NOT NULL DEFAULT now(),
        locked_until timestamptz,
        last_error text,
        created_at timestamptz NOT NULL DEFAULT now(),
        completed_at timestamptz
      );
      CREATE INDEX IF NOT EXISTS message_queue_job_claim_idx
        ON ${this.job} (queue, status, priority, run_at);
      -- Enforces BullMQ's "only one WAITING job per options.id".
      CREATE UNIQUE INDEX IF NOT EXISTS message_queue_job_dedup_idx
        ON ${this.job} (queue, opt_id)
        WHERE status = 'pending' AND opt_id IS NOT NULL;

      CREATE TABLE IF NOT EXISTS ${this.schedule} (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        job_key varchar NOT NULL,
        queue varchar NOT NULL,
        name varchar NOT NULL,
        data jsonb NOT NULL DEFAULT '{}'::jsonb,
        pattern varchar,
        every_ms bigint,
        repeat_limit int,
        priority int,
        run_count int NOT NULL DEFAULT 0,
        next_run_at timestamptz NOT NULL,
        last_enqueued_at timestamptz,
        created_at timestamptz NOT NULL DEFAULT now()
      );
      CREATE UNIQUE INDEX IF NOT EXISTS message_queue_job_schedule_key_idx
        ON ${this.schedule} (queue, job_key);
    `;
  }

  async ensureSchema(): Promise<void> {
    await this.sql.query(this.buildSchemaSql());
  }

  // === producer side (driver.add) ===
  async enqueue(params: EnqueueParams): Promise<void> {
    const runAt = new Date(Date.now() + (params.delayMs ?? 0)).toISOString();

    // ON CONFLICT targets the partial unique index. When opt_id is NULL the row
    // is outside the index predicate, so the clause is a harmless no-op and the
    // insert always proceeds.
    await this.sql.query(
      `INSERT INTO ${this.job}
         (queue, name, data, opt_id, priority, max_attempts, run_at)
       VALUES ($1, $2, $3::jsonb, $4, $5, $6, $7)
       ON CONFLICT (queue, opt_id)
         WHERE status = 'pending' AND opt_id IS NOT NULL
       DO NOTHING`,
      [
        params.queue,
        params.name,
        JSON.stringify(params.data ?? {}),
        params.optId ?? null,
        params.priority,
        params.maxAttempts,
        runAt,
      ],
    );
  }

  // === consumer side (called by the Deno.cron tick, NOT by the interface) ===
  // Atomically claims a batch: pending+due jobs, plus active jobs whose lock
  // expired (crash/eviction recovery). Increments attempts and sets a visibility
  // timeout so a second tick won't double-process.
  async claimBatch(
    queue: string,
    batchSize: number,
    lockSeconds: number,
  ): Promise<ClaimedJob[]> {
    const rows = await this.sql.query(
      `UPDATE ${this.job} AS j
       SET status = 'active',
           attempts = attempts + 1,
           locked_until = now() + make_interval(secs => $3)
       FROM (
         SELECT id FROM ${this.job}
         WHERE queue = $1
           AND (
             (status = 'pending' AND run_at <= now())
             OR (status = 'active' AND locked_until < now())
           )
         ORDER BY priority ASC, run_at ASC
         LIMIT $2
         FOR UPDATE SKIP LOCKED
       ) AS picked
       WHERE j.id = picked.id
       RETURNING j.id, j.name, j.data, j.attempts, j.max_attempts`,
      [queue, batchSize, lockSeconds],
    );

    return rows.map((r) => ({
      id: String(r.id),
      name: String(r.name),
      data: (r.data ?? {}) as Record<string, unknown>,
      attempts: Number(r.attempts),
      maxAttempts: Number(r.max_attempts),
    }));
  }

  async markCompleted(jobId: string): Promise<void> {
    await this.sql.query(
      `UPDATE ${this.job}
       SET status = 'completed', completed_at = now(), locked_until = NULL
       WHERE id = $1`,
      [jobId],
    );
  }

  // Retry with backoff while attempts remain; otherwise mark failed.
  async markFailed(
    jobId: string,
    errorMessage: string,
    backoffSeconds: number,
  ): Promise<void> {
    await this.sql.query(
      `UPDATE ${this.job}
       SET status = CASE WHEN attempts < max_attempts THEN 'pending' ELSE 'failed' END,
           run_at = CASE WHEN attempts < max_attempts
                         THEN now() + make_interval(secs => $2)
                         ELSE run_at END,
           locked_until = NULL,
           last_error = $3,
           completed_at = CASE WHEN attempts >= max_attempts THEN now() ELSE NULL END
       WHERE id = $1`,
      [jobId, backoffSeconds, errorMessage.slice(0, 4000)],
    );
  }

  // Replaces BullMQ removeOnComplete/removeOnFail (age-based). Count-based trim is
  // a TODO — age covers the common case.
  async cleanup(retention: RetentionConfig): Promise<number> {
    const completed = await this.sql.query(
      `DELETE FROM ${this.job}
       WHERE status = 'completed'
         AND completed_at < now() - make_interval(secs => $1)`,
      [retention.completedMaxAgeSeconds],
    );
    const failed = await this.sql.query(
      `DELETE FROM ${this.job}
       WHERE status = 'failed'
         AND completed_at < now() - make_interval(secs => $1)`,
      [retention.failedMaxAgeSeconds],
    );

    return (completed.length ?? 0) + (failed.length ?? 0);
  }

  async waitingCount(): Promise<number> {
    const rows = await this.sql.query(
      `SELECT count(*)::int AS c FROM ${this.job}
       WHERE status = 'pending' AND run_at <= now()`,
    );

    return Number(rows[0]?.c ?? 0);
  }

  // === cron side (driver.addCron / removeCron) ===
  async upsertSchedule(params: ScheduleParams, from: Date, cronNextRun?: CronNextRun): Promise<void> {
    const nextRunAt = this.computeNextRun(params, from, cronNextRun).toISOString();

    await this.sql.query(
      `INSERT INTO ${this.schedule}
         (job_key, queue, name, data, pattern, every_ms, repeat_limit, priority, next_run_at)
       VALUES ($1, $2, $3, $4::jsonb, $5, $6, $7, $8, $9)
       ON CONFLICT (queue, job_key) DO UPDATE SET
         name = EXCLUDED.name,
         data = EXCLUDED.data,
         pattern = EXCLUDED.pattern,
         every_ms = EXCLUDED.every_ms,
         repeat_limit = EXCLUDED.repeat_limit,
         priority = EXCLUDED.priority,
         next_run_at = EXCLUDED.next_run_at`,
      [
        params.jobKey,
        params.queue,
        params.name,
        JSON.stringify(params.data ?? {}),
        params.pattern ?? null,
        params.everyMs ?? null,
        params.repeatLimit ?? null,
        params.priority ?? null,
        nextRunAt,
      ],
    );
  }

  async removeSchedule(queue: string, jobKey: string): Promise<void> {
    await this.sql.query(
      `DELETE FROM ${this.schedule} WHERE queue = $1 AND job_key = $2`,
      [queue, jobKey],
    );
  }

  // Claims due schedules, enqueues a job for each, advances next_run_at, and drops
  // schedules that hit repeat.limit. Runs in one transaction so overlapping ticks
  // never double-enqueue (FOR UPDATE SKIP LOCKED on the schedule rows).
  async runDueSchedules(
    enqueue: (params: EnqueueParams) => Promise<void>,
    from: Date,
    cronNextRun?: CronNextRun,
  ): Promise<number> {
    return this.sql.withTransaction(async (tx) => {
      const due = await tx.query(
        `SELECT * FROM ${this.schedule}
         WHERE next_run_at <= now()
         FOR UPDATE SKIP LOCKED`,
      );

      for (const row of due) {
        const params: ScheduleParams = {
          jobKey: String(row.job_key),
          queue: String(row.queue),
          name: String(row.name),
          data: row.data ?? {},
          pattern: (row.pattern as string) ?? undefined,
          everyMs: row.every_ms != null ? Number(row.every_ms) : undefined,
          repeatLimit: row.repeat_limit != null ? Number(row.repeat_limit) : undefined,
          priority: row.priority != null ? Number(row.priority) : undefined,
        };

        await enqueue({
          queue: params.queue,
          name: params.name,
          data: params.data,
          priority: params.priority ?? 0,
          maxAttempts: 1,
        });

        const nextRunCount = Number(row.run_count) + 1;
        const reachedLimit =
          params.repeatLimit != null && nextRunCount >= params.repeatLimit;

        if (reachedLimit) {
          await tx.query(`DELETE FROM ${this.schedule} WHERE id = $1`, [row.id]);
        } else {
          const nextRunAt = this.computeNextRun(params, from, cronNextRun).toISOString();

          await tx.query(
            `UPDATE ${this.schedule}
             SET run_count = $2, last_enqueued_at = now(), next_run_at = $3
             WHERE id = $1`,
            [row.id, nextRunCount, nextRunAt],
          );
        }
      }

      return due.length;
    });
  }

  private computeNextRun(
    params: ScheduleParams,
    from: Date,
    cronNextRun?: CronNextRun,
  ): Date {
    if (params.everyMs != null) {
      return new Date(from.getTime() + params.everyMs);
    }
    if (params.pattern != null) {
      if (!cronNextRun) {
        throw new Error(
          'pg-driver: cron pattern scheduling requires a CronNextRun implementation (inject cron-parser in the wrapper)',
        );
      }

      return cronNextRun(params.pattern, from);
    }
    throw new Error('pg-driver: schedule has neither pattern nor every');
  }
}
