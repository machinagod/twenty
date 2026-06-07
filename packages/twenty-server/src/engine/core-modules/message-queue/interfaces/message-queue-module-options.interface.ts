import { type BullMQDriverOptions } from 'src/engine/core-modules/message-queue/drivers/bullmq.driver';
import { type SqlExecutor } from 'src/engine/core-modules/message-queue/drivers/pg-driver-core';
import { type PgDriverOptions } from 'src/engine/core-modules/message-queue/drivers/pg.driver';
import { type MetricsService } from 'src/engine/core-modules/metrics/metrics.service';

export enum MessageQueueDriverType {
  BullMQ = 'bull-mq',
  Sync = 'sync',
  Pg = 'pg',
}

export interface BullMQDriverFactoryOptions {
  type: MessageQueueDriverType.BullMQ;
  options: BullMQDriverOptions;
  metricsService: MetricsService;
}

export interface SyncDriverFactoryOptions {
  type: MessageQueueDriverType.Sync;
  // oxlint-disable-next-line typescript/no-explicit-any
  options: Record<string, any>;
}

export interface PgDriverFactoryOptions {
  type: MessageQueueDriverType.Pg;
  sql: SqlExecutor;
  options: PgDriverOptions;
}

export type MessageQueueModuleOptions =
  | BullMQDriverFactoryOptions
  | SyncDriverFactoryOptions
  | PgDriverFactoryOptions;
