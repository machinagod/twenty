import { Logger } from '@nestjs/common';

import * as Sentry from '@sentry/node';

import {
  type QueueCronJobOptions,
  type QueueJobOptions,
} from 'src/engine/core-modules/message-queue/drivers/interfaces/job-options.interface';
import { type MessageQueueDriver } from 'src/engine/core-modules/message-queue/drivers/interfaces/message-queue-driver.interface';
import {
  type CronNextRun,
  type PgDriverTables,
  type RetentionConfig,
  type SqlExecutor,
  DEFAULT_TABLES,
  PgMessageQueueCore,
} from 'src/engine/core-modules/message-queue/drivers/pg-driver-core';
import { type MessageQueueJob } from 'src/engine/core-modules/message-queue/interfaces/message-queue-job.interface';
import { type MessageQueueWorkerOptions } from 'src/engine/core-modules/message-queue/interfaces/message-queue-worker-options.interface';

import { QUEUE_RETENTION } from 'src/engine/core-modules/message-queue/constants/queue-retention.constants';
import { MESSAGE_QUEUE_PRIORITY } from 'src/engine/core-modules/message-queue/message-queue-priority.constant';
import { getJobKey } from 'src/engine/core-modules/message-queue/utils/get-job-key.util';

// Subset of MetricsService the driver needs — kept structural so the driver does
// not hard-depend on the full service (and stays unit-testable).
export interface MetricsLike {
  recordHistogram(args: {
    key: string;
    value: number;
    unit?: string;
    attributes?: Record<string, unknown>;
  }): void;
  incrementCounterForEvent(args: {
    key: string;
    attributes?: Record<string, unknown>;
    shouldStoreInCache?: boolean;
  }): void | Promise<void>;
}

type RegisteredWorker = {
  handler: (job: MessageQueueJob) => Promise<void> | void;
  concurrency: number;
};

export type PgDriverOptions = {
  tables?: PgDriverTables;
  retention?: RetentionConfig;
  metricsService?: MetricsLike;
  // Visibility timeout: how long a claimed job stays 'active' before a later tick
  // may reclaim it (crash/eviction recovery). Should exceed the longest job.
  lockSeconds?: number;
  defaultBatchSize?: number;
  // Provided by the module factory using cron-parser; only needed for repeat.pattern.
  cronNextRun?: CronNextRun;
};

const DEFAULT_LOCK_SECONDS = 600; // 10 min
const DEFAULT_BATCH_SIZE = 20;
const MAX_BACKOFF_SECONDS = 300;

// PG-only replacement for BullMQDriver. No always-on worker: producers call add(),
// and a Deno.cron tick calls drainAll()/runDueSchedules(). Implements the same
// MessageQueueDriver contract so processors and the explorer are unchanged.
export class PgDriver implements MessageQueueDriver {
  private readonly logger = new Logger(PgDriver.name);
  private readonly core: PgMessageQueueCore;
  private readonly workers = new Map<string, RegisteredWorker>();
  private readonly retention: RetentionConfig;
  private readonly metricsService?: MetricsLike;
  private readonly lockSeconds: number;
  private readonly defaultBatchSize: number;
  private readonly cronNextRun?: CronNextRun;

  constructor(sql: SqlExecutor, options: PgDriverOptions = {}) {
    this.core = new PgMessageQueueCore(sql, options.tables ?? DEFAULT_TABLES);
    this.retention = options.retention ?? {
      completedMaxAgeSeconds: QUEUE_RETENTION.completedMaxAge,
      failedMaxAgeSeconds: QUEUE_RETENTION.failedMaxAge,
    };
    this.metricsService = options.metricsService;
    this.lockSeconds = options.lockSeconds ?? DEFAULT_LOCK_SECONDS;
    this.defaultBatchSize = options.defaultBatchSize ?? DEFAULT_BATCH_SIZE;
    this.cronNextRun = options.cronNextRun;
  }

  // Create the queue tables. The server runs this via an instance-command
  // migration; exposed here for the spike/local bootstrap.
  ensureSchema(): Promise<void> {
    return this.core.ensureSchema();
  }

  register(_queueName: string): void {
    // No Queue object to create (BullMQ needed one). Tables are shared.
  }

  async add<T>(
    queueName: string,
    jobName: string,
    data: T,
    options?: QueueJobOptions,
  ): Promise<void> {
    await this.core.enqueue({
      queue: queueName,
      name: jobName,
      data,
      optId: options?.id,
      priority:
        options?.priority ??
        MESSAGE_QUEUE_PRIORITY[queueName as keyof typeof MESSAGE_QUEUE_PRIORITY] ??
        0,
      maxAttempts: 1 + (options?.retryLimit ?? 0),
      delayMs: options?.delay,
    });
  }

  work<T>(
    queueName: string,
    handler: (job: MessageQueueJob<T>) => Promise<void> | void,
    options?: MessageQueueWorkerOptions,
  ): void {
    this.workers.set(queueName, {
      handler: handler as (job: MessageQueueJob) => Promise<void> | void,
      concurrency: options?.concurrency ?? 1,
    });
  }

  async addCron<T>({
    queueName,
    jobName,
    data,
    options,
    jobId,
  }: {
    queueName: string;
    jobName: string;
    data: T;
    options: QueueCronJobOptions;
    jobId?: string;
  }): Promise<void> {
    await this.core.upsertSchedule(
      {
        jobKey: getJobKey({ jobName, jobId }),
        queue: queueName,
        name: jobName,
        data,
        pattern: options.repeat?.pattern,
        everyMs: options.repeat?.every,
        repeatLimit: options.repeat?.limit,
        priority: options.priority,
      },
      new Date(),
      this.cronNextRun,
    );
  }

  async removeCron({
    queueName,
    jobName,
    jobId,
  }: {
    queueName: string;
    jobName: string;
    jobId?: string;
  }): Promise<void> {
    await this.core.removeSchedule(queueName, getJobKey({ jobName, jobId }));
  }

  // === infra glue called by the Deno.cron heartbeat (not part of the interface) ===

  // Enqueue due repeatable schedules. Pair with a static Deno.cron("* * * * *").
  runDueSchedules(): Promise<number> {
    return this.core.runDueSchedules(
      (params) => this.core.enqueue(params),
      new Date(),
      this.cronNextRun,
    );
  }

  // Drain every registered queue once. Pair with a static Deno.cron tick.
  async drainAll(): Promise<number> {
    let total = 0;

    for (const queueName of this.workers.keys()) {
      total += await this.drain(queueName);
    }

    return total;
  }

  async drain(queueName: string, batchSize?: number): Promise<number> {
    const worker = this.workers.get(queueName);

    if (!worker) {
      return 0;
    }

    const claimed = await this.core.claimBatch(
      queueName,
      batchSize ?? this.defaultBatchSize,
      this.lockSeconds,
    );

    if (claimed.length === 0) {
      return 0;
    }

    // Honor per-queue concurrency by processing the claimed batch in chunks.
    for (let i = 0; i < claimed.length; i += worker.concurrency) {
      const chunk = claimed.slice(i, i + worker.concurrency);

      await Promise.all(
        chunk.map((job) => this.process(queueName, worker.handler, job)),
      );
    }

    return claimed.length;
  }

  async cleanup(): Promise<number> {
    return this.core.cleanup(this.retention);
  }

  private async process(
    queueName: string,
    handler: (job: MessageQueueJob) => Promise<void> | void,
    job: { id: string; name: string; data: Record<string, unknown>; attempts: number; maxAttempts: number },
  ): Promise<void> {
    const startedAt = performance.now();

    await Sentry.withIsolationScope(async () => {
      try {
        await handler({ id: job.id, name: job.name, data: job.data });
        await this.core.markCompleted(job.id);

        this.metricsService?.recordHistogram({
          key: 'job.latency.ms',
          value: performance.now() - startedAt,
          unit: 'ms',
          attributes: { queue: queueName, job_name: job.name },
        });
        void this.metricsService?.incrementCounterForEvent({
          key: 'job.completed',
          attributes: { queue: queueName, job_name: job.name },
          shouldStoreInCache: false,
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        const backoffSeconds = Math.min(
          2 ** job.attempts,
          MAX_BACKOFF_SECONDS,
        );

        await this.core.markFailed(job.id, message, backoffSeconds);

        const willRetry = job.attempts < job.maxAttempts;

        this.logger.error(
          `Job ${job.id} (${job.name}) on ${queueName} failed${willRetry ? `, retrying in ${backoffSeconds}s` : ' permanently'}: ${message}`,
        );
        void this.metricsService?.incrementCounterForEvent({
          key: 'job.failed',
          attributes: { queue: queueName, job_name: job.name },
          shouldStoreInCache: false,
        });
      }
    });
  }
}
