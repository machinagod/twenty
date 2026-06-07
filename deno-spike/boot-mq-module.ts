// MILESTONE: boots the REAL MessageQueueCoreModule under a real NestJS DI container on
// Deno with MESSAGE_QUEUE_DRIVER_TYPE='pg' — the whole module graph (typeorm, @sentry,
// @nestjs/*, bullmq, twenty-shared, metrics, cache, redis-client) resolves from the
// prepared node_modules, the PG driver is selected, and a job added through a real
// MessageQueueService drains through it. This is the module-level boot the hand-built
// import-map approach couldn't reach.
//
// Reproduce:
//   bash deno-spike/prepare-deno-deps.sh        # scope workspaces, de-patch, deno install, write deno.json files
//   bash deno-spike/apply-patches.sh
//   # the focused boot stubs TwentyConfigService (the real one pulls the full
//   # config->graphql graph, a later AppModule-boot concern), so map the shim:
//   python3 -c "import json;p='packages/twenty-server/deno.json';d=json.load(open(p));d['imports']['src/engine/core-modules/twenty-config/twenty-config.service']='../../deno-spike/shims/twenty-config-service.ts';json.dump(d,open(p,'w'),indent=2)"
//   cp deno-spike/boot-mq-module.ts packages/twenty-server/boot-mq-module.ts
//   cd packages/twenty-server && DATABASE_URL=postgres://postgres:postgres@127.0.0.1:5432/deno_spike \
//     deno run -A --sloppy-imports boot-mq-module.ts     # must run from the member scope
//
// Result observed: "2 passed, 0 failed".

import 'reflect-metadata';
import { Global, Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';

import { PgDriver } from 'src/engine/core-modules/message-queue/drivers/pg.driver';
import { MessageQueueCoreModule } from 'src/engine/core-modules/message-queue/message-queue-core.module';
import { messageQueueModuleFactory } from 'src/engine/core-modules/message-queue/message-queue.module-factory';
import { MessageQueue, QUEUE_DRIVER } from 'src/engine/core-modules/message-queue/message-queue.constants';
import { getQueueToken } from 'src/engine/core-modules/message-queue/utils/get-queue-token.util';
import { type MessageQueueService } from 'src/engine/core-modules/message-queue/services/message-queue.service';
import { TwentyConfigService } from 'src/engine/core-modules/twenty-config/twenty-config.service';

const DATABASE_URL = Deno.env.get('DATABASE_URL') ??
  'postgres://postgres:postgres@127.0.0.1:5432/deno_spike';

const CONFIG = Symbol('config');
const REDIS = Symbol('redis');
const METRICS = Symbol('metrics');
const DATA_SOURCE = Symbol('dataSource');

const dataSource = new DataSource({ type: 'postgres', url: DATABASE_URL, synchronize: false, logging: false });
await dataSource.initialize();
await dataSource.query('CREATE SCHEMA IF NOT EXISTS core');

const metricsStub = { recordHistogram: () => {}, incrementCounterForEvent: () => {}, createObservableGauge: () => {} };

@Global()
@Module({
  providers: [
    { provide: CONFIG, useValue: { get: (k: string) => (k === 'MESSAGE_QUEUE_DRIVER_TYPE' ? 'pg' : undefined) } },
    { provide: REDIS, useValue: {} },
    { provide: METRICS, useValue: metricsStub },
    { provide: DATA_SOURCE, useValue: dataSource },
    { provide: 'engine:health', useValue: {} },
    { provide: 'engine:metrics', useValue: {} },
    { provide: TwentyConfigService, useValue: new TwentyConfigService() },
  ],
  exports: [CONFIG, REDIS, METRICS, DATA_SOURCE, 'engine:health', 'engine:metrics', TwentyConfigService],
})
class StubModule {}

@Module({
  imports: [
    StubModule,
    MessageQueueCoreModule.registerAsync({ useFactory: messageQueueModuleFactory, inject: [CONFIG, REDIS, METRICS, DATA_SOURCE] }),
  ],
})
class BootModule {}

let passed = 0, failed = 0;
const check = (l: string, ok: boolean) => { ok ? passed++ : failed++; console.log(`  ${ok ? '✅' : '❌'} ${l}`); };

const app = await NestFactory.createApplicationContext(BootModule, { logger: ['error'] });
console.log('[boot] real NestJS DI container created on Deno');
const driver = app.get(QUEUE_DRIVER);
check('QUEUE_DRIVER resolved to a PgDriver (config selected pg)', driver instanceof PgDriver);

await dataSource.query('DROP TABLE IF EXISTS "core"."messageQueueJob"');
await dataSource.query('DROP TABLE IF EXISTS "core"."messageQueueJobSchedule"');
await (driver as PgDriver).ensureSchema();

const service = app.get<MessageQueueService>(getQueueToken(MessageQueue.emailQueue));
const handled: string[] = [];
(driver as PgDriver).work(MessageQueue.emailQueue, (job) => { handled.push(String((job.data as { tag?: string }).tag)); });
await service.add('email-job', { tag: 'wired' });
const drained = await (driver as PgDriver).drainAll();
check('job added via real MessageQueueService drained through the PG driver', drained === 1 && handled[0] === 'wired');

await dataSource.query('DROP SCHEMA IF EXISTS core CASCADE');
await app.close();
await dataSource.destroy();
console.log(`\n==== ${passed} passed, ${failed} failed ====`);
if (failed > 0) Deno.exit(1);
