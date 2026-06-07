// Boots the REAL wired PgDriver + the REAL typeorm-sql-executor.ts against a REAL
// TypeORM DataSource, under Deno, on stock (un-patched) typeorm. This is the first
// time the actual server source (not a spike copy) drives Postgres on Deno, and the
// first exercise of the TypeORM-backed SqlExecutor — validate-pg-driver.ts uses
// node-postgres directly, so dataSource.transaction()/FOR UPDATE were untested here.
//
//   deno run -A --sloppy-imports --config deno-spike/boot-real-driver.json deno-spike/boot-real-driver.ts
//
// Surfaces the things the "boot the real AppModule" milestone needs to know:
//  - Does Deno resolve the real `src/` graph (extensionless imports) for the driver?
//  - Do the real @nestjs/common + @sentry/node + typeorm imports load on Deno?
//  - Does stock typeorm (NO Yarn patch) drive the queue correctly?

import 'reflect-metadata';
import { DataSource } from 'typeorm';

import { PgDriver } from 'src/engine/core-modules/message-queue/drivers/pg.driver';
import { createTypeormSqlExecutor } from 'src/engine/core-modules/message-queue/drivers/typeorm-sql-executor';

const DATABASE_URL = Deno.env.get('DATABASE_URL') ??
  'postgres://postgres:postgres@127.0.0.1:5432/deno_spike';

let passed = 0;
let failed = 0;
const check = (label: string, ok: boolean) => {
  if (ok) {
    passed++;
    console.log(`  ✅ ${label}`);
  } else {
    failed++;
    console.log(`  ❌ ${label}`);
  }
};

const dataSource = new DataSource({
  type: 'postgres',
  url: DATABASE_URL,
  synchronize: false,
  logging: false,
});

await dataSource.initialize();
console.log('[boot] real TypeORM DataSource initialized on Deno (stock typeorm)\n');

const executor = createTypeormSqlExecutor(dataSource);

// Dedicated schema so we never collide with validate-pg-driver.ts. buildSchemaSql()
// uses fixed (schema-global) index names, so a second job table in a shared schema
// would hit CREATE INDEX IF NOT EXISTS <name> on an already-taken name and skip it.
const SCHEMA = 'boot_real';

await dataSource.query(`DROP SCHEMA IF EXISTS "${SCHEMA}" CASCADE`);
await dataSource.query(`CREATE SCHEMA "${SCHEMA}"`);

const driver = new PgDriver(executor, {
  tables: {
    schema: SCHEMA,
    jobTable: 'messageQueueJob',
    scheduleTable: 'messageQueueJobSchedule',
  },
});

await driver.ensureSchema();

console.log('[1] enqueue + drain through the real driver');
const handled: string[] = [];

driver.register('test-queue');
driver.work('test-queue', (job) => {
  handled.push(String((job.data as { tag?: string }).tag));
});
await driver.add('test-queue', 'my-job', { tag: 'hello' });
const drained = await driver.drainAll();

check('drainAll claimed + ran exactly one job', drained === 1);
check('handler received the job payload', handled.length === 1 && handled[0] === 'hello');

console.log('\n[2] dedup — second waiting enqueue with same opt.id is dropped');
await driver.add('test-queue', 'my-job', { tag: 'a' }, { id: 'dedupe-key' });
await driver.add('test-queue', 'my-job', { tag: 'b' }, { id: 'dedupe-key' });
const waiting = await dataSource.query(
  `SELECT count(*)::int AS c FROM "boot_real"."messageQueueJob" WHERE status = 'pending'`,
);
check('only one waiting job for the opt.id', Number(waiting[0].c) === 1);

console.log('\n[3] cron schedule via real dataSource.transaction() (FOR UPDATE)');
// runDueSchedules() runs inside executor.withTransaction → dataSource.transaction.
// This is the path that needs one EntityManager across the SKIP LOCKED claim.
await driver.addCron({
  queueName: 'test-queue',
  jobName: 'cron-job',
  data: { tag: 'tick' },
  options: { repeat: { every: 60_000 } },
});
const firedNone = await driver.runDueSchedules();
check('schedule not due yet (next_run_at in the future)', firedNone === 0);

// Force it due, then re-run inside the transaction.
await dataSource.query(
  `UPDATE "boot_real"."messageQueueJobSchedule" SET next_run_at = now() - interval '1 second'`,
);
const fired = await driver.runDueSchedules();
check('runDueSchedules fired one due schedule (in a TypeORM tx)', fired === 1);

const enqueuedByCron = await dataSource.query(
  `SELECT count(*)::int AS c FROM "boot_real"."messageQueueJob" WHERE name = 'cron-job'`,
);
check('cron schedule enqueued a job', Number(enqueuedByCron[0].c) === 1);

await dataSource.query('DROP SCHEMA IF EXISTS "boot_real" CASCADE');
await dataSource.destroy();

console.log(`\n==== ${passed} passed, ${failed} failed ====`);
if (failed > 0) Deno.exit(1);
