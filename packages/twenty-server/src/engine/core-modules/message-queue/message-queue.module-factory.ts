import { CronExpressionParser } from 'cron-parser';
import { type DataSource } from 'typeorm';

import { type CronNextRun } from 'src/engine/core-modules/message-queue/drivers/pg-driver-core';
import { createTypeormSqlExecutor } from 'src/engine/core-modules/message-queue/drivers/typeorm-sql-executor';
import {
  type BullMQDriverFactoryOptions,
  MessageQueueDriverType,
  type MessageQueueModuleOptions,
  type PgDriverFactoryOptions,
} from 'src/engine/core-modules/message-queue/interfaces';
import { type MetricsService } from 'src/engine/core-modules/metrics/metrics.service';
import { type RedisClientService } from 'src/engine/core-modules/redis-client/redis-client.service';
import { type TwentyConfigService } from 'src/engine/core-modules/twenty-config/twenty-config.service';

// Next fire time for a cron pattern, backed by cron-parser. Injected into the PG
// driver so the dependency-free core stays free of npm packages.
const cronNextRun: CronNextRun = (pattern, from) =>
  CronExpressionParser.parse(pattern, { currentDate: from }).next().toDate();

/**
 * MessageQueue Module factory
 * @returns MessageQueueModuleOptions
 * @param twentyConfigService
 * @param redisClientService
 * @param metricsService
 * @param dataSource
 */
export const messageQueueModuleFactory = async (
  twentyConfigService: TwentyConfigService,
  redisClientService: RedisClientService,
  metricsService: MetricsService,
  dataSource: DataSource,
): Promise<MessageQueueModuleOptions> => {
  const driverType = twentyConfigService.get('MESSAGE_QUEUE_DRIVER_TYPE');

  switch (driverType) {
    case MessageQueueDriverType.Pg: {
      return {
        type: MessageQueueDriverType.Pg,
        sql: createTypeormSqlExecutor(dataSource),
        options: {
          metricsService,
          cronNextRun,
        },
      } satisfies PgDriverFactoryOptions;
    }
    case MessageQueueDriverType.BullMQ: {
      return {
        type: MessageQueueDriverType.BullMQ,
        options: {
          connection: redisClientService.getQueueClient(),
        },
        metricsService,
      } satisfies BullMQDriverFactoryOptions;
    }
    default:
      throw new Error(
        `Invalid message queue driver type (${driverType}), check your .env file`,
      );
  }
};
