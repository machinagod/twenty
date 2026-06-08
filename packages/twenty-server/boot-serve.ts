// Unified Deno entrypoint: real AppModule via NestFactory.create + Express
// (Node-compat) + Deno.cron heartbeats (queue drain + schedule eval + retention
// cleanup). Replaces main.ts + queue-worker.ts in the "deno mode" target.
//
// Run from packages/twenty-server/:
//   env NODE_ENV=development APP_SECRET=… PG_DATABASE_URL=… \
//     MESSAGE_QUEUE_DRIVER_TYPE=pg CACHE_STORAGE_TYPE=memory \
//     SESSION_STORAGE_TYPE=memory PUB_SUB_DRIVER_TYPE=postgres \
//     NODE_PORT=3000 \
//     deno run -A --unstable-cron --sloppy-imports boot-serve.ts
//
// `--unstable-cron` is only needed for local Deno; Deploy v2 has Deno.cron
// built in.

// Deno Deploy's Prisma database integration injects DATABASE_URL (the
// connection string) + PG_* env vars at runtime. Twenty's TypeORM
// datasources + TwentyConfigService read PG_DATABASE_URL specifically.
// Bridge before anything else loads — datasource modules read env eagerly.
if (!process.env.PG_DATABASE_URL && process.env.DATABASE_URL) {
  process.env.PG_DATABASE_URL = process.env.DATABASE_URL;
}

import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';
import { type NestExpressApplication } from '@nestjs/platform-express';
import { useContainer } from 'class-validator';
import session from 'express-session';

import { AppModule } from 'src/app.module';
import { LoggerService } from 'src/engine/core-modules/logger/logger.service';
import { QUEUE_DRIVER } from 'src/engine/core-modules/message-queue/message-queue.constants';
import { MessageQueueDriverType } from 'src/engine/core-modules/message-queue/interfaces/message-queue-module-options.interface';
import { PgDriver } from 'src/engine/core-modules/message-queue/drivers/pg.driver';
import { getSessionStorageOptions } from 'src/engine/core-modules/session-storage/session-storage.module-factory';
import { TwentyConfigService } from 'src/engine/core-modules/twenty-config/twenty-config.service';
import { configTransformers } from 'src/engine/core-modules/twenty-config/utils/config-transformers.util';
import { UnhandledExceptionFilter } from 'src/filters/unhandled-exception.filter';

const app = await NestFactory.create<NestExpressApplication>(AppModule, {
  cors: { exposedHeaders: ['WWW-Authenticate'] },
  rawBody: true,
});

const logger = app.get(LoggerService);
const config = app.get(TwentyConfigService);

const trustProxyRaw = config.get('TRUST_PROXY');
const trustProxy = /^\d+$/.test(trustProxyRaw)
  ? Number(trustProxyRaw)
  : (configTransformers.boolean(trustProxyRaw) ?? trustProxyRaw);
app.set('trust proxy', trustProxy);

app.use(session(getSessionStorageOptions(config)));
useContainer(app.select(AppModule), { fallbackOnErrors: true });
app.useLogger(logger);
app.useGlobalFilters(new UnhandledExceptionFilter());
app.useBodyParser('json', { limit: '20mb' });
app.useBodyParser('urlencoded', { limit: '20mb', extended: true });
app.useBodyParser('text', { type: 'text/plain', limit: '1024kb' });

// --- Deno.cron heartbeats (PG driver only) ---------------------------------
const driverType = config.get('MESSAGE_QUEUE_DRIVER_TYPE');
if (driverType === MessageQueueDriverType.Pg && typeof Deno?.cron === 'function') {
  const driver = app.get(QUEUE_DRIVER) as PgDriver;

  Deno.cron('twenty-drain', '* * * * *', async () => {
    try {
      const n = await driver.drainAll();
      if (n > 0) logger.log(`[cron] drained ${n} job(s)`, 'DenoCron');
    } catch (err) {
      logger.error(`[cron] drain failed: ${(err as Error).message}`, undefined, 'DenoCron');
    }
  });

  Deno.cron('twenty-schedule', '* * * * *', async () => {
    try {
      const n = await driver.runDueSchedules();
      if (n > 0) logger.log(`[cron] enqueued ${n} scheduled job(s)`, 'DenoCron');
    } catch (err) {
      logger.error(`[cron] schedule failed: ${(err as Error).message}`, undefined, 'DenoCron');
    }
  });

  // Hourly retention sweep keeps the table bounded.
  Deno.cron('twenty-cleanup', '0 * * * *', async () => {
    try {
      const n = await driver.cleanup();
      if (n > 0) logger.log(`[cron] retention removed ${n} job(s)`, 'DenoCron');
    } catch (err) {
      logger.error(`[cron] cleanup failed: ${(err as Error).message}`, undefined, 'DenoCron');
    }
  });

  logger.log('PG driver + Deno.cron heartbeats registered (drain/schedule/cleanup)', 'Bootstrap');
}

// SPA fallback — register Express middleware BEFORE listen so it sits ahead of
// Nest's catch-all NotFoundException. sendFile() can be flaky under Deno's
// node-compat (path resolution, callback shape), so read the file once at
// boot and send the bytes directly. Static assets under /assets, /images, /etc
// are still served by ServeStaticModule which Nest mounts during init.
{
  const nodePath = await import('node:path');
  const fs = await import('node:fs');
  const url = await import('node:url');
  const frontDir = nodePath.resolve(
    nodePath.dirname(url.fileURLToPath(import.meta.url)),
    'src/front',
  );
  const frontIndex = nodePath.join(frontDir, 'index.html');
  if (fs.existsSync(frontIndex)) {
    const html = fs.readFileSync(frontIndex, 'utf8');
    // Anything under these prefixes is API/asset territory — pass to Nest.
    // Everything else is an SPA route → serve index.html.
    const apiPrefixes = [
      '/graphql', '/metadata', '/admin-panel',
      '/rest', '/mcp', '/auth', '/oauth', '/api', '/webhooks',
      '/healthz', '/client-config', '/.well-known',
      '/app', '/apps', '/s',
      '/files', '/images', '/assets', '/manifest', '/mockServiceWorker',
    ];
    app.use(((req: { method: string; path: string }, res: { setHeader: (k: string, v: string) => void; status: (n: number) => unknown; send: (body: string) => void }, next: () => void) => {
      if (
        req.method !== 'GET' ||
        req.path.includes('.') ||
        apiPrefixes.some((p) => req.path === p || req.path.startsWith(p + '/'))
      ) {
        return next();
      }
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.status(200);
      res.send(html);
    }) as never);
    logger.log(`SPA fallback wired (serving ${frontIndex}, ${html.length} bytes)`, 'Bootstrap');
  }
}

const port = config.get('NODE_PORT') ?? 3000;
await app.listen(port);
logger.log(`Listening on http://localhost:${port}`, 'Bootstrap');
