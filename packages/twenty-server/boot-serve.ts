// Unified Deno entrypoint: real AppModule via NestFactory.create + Express
// (Node-compat) + Deno.cron heartbeats (queue drain + schedule eval + retention
// cleanup). Replaces main.ts + queue-worker.ts in the "deno mode" target.
//
// Deno 2.8 `import defer` (https://deno.com/blog/v2.8#import-defer):
// every heavy npm/source module is loaded with `import defer * as ns from …`.
// Deno parses each one into the static graph but skips top-level evaluation
// until something touches the namespace. The actual touches happen inside
// `bootstrap()`, which on Deno Deploy is kicked off asynchronously after the
// entrypoint's top-level code returns (so it runs past the warmup window),
// or awaited immediately when run from a local terminal.
//
// Local:
//   env NODE_ENV=development APP_SECRET=… PG_DATABASE_URL=… \
//     MESSAGE_QUEUE_DRIVER_TYPE=pg CACHE_STORAGE_TYPE=memory \
//     SESSION_STORAGE_TYPE=memory PUB_SUB_DRIVER_TYPE=postgres \
//     NODE_PORT=3000 \
//     deno run -A --unstable-cron --sloppy-imports boot-serve.ts
//
// Deno Deploy: detected via DENO_DEPLOYMENT_ID. NestJS owns its own listener
// via `app.listen(PORT)`; Deploy's platform wires the externally-bound port
// to that. We DO NOT call Deno.serve from here (it would race the Express
// listener).

// Deno Deploy's Prisma integration injects DATABASE_URL; Twenty reads
// PG_DATABASE_URL. Bridge before ANYTHING else loads — datasource modules
// read the env eagerly at module-load time.
if (!process.env.PG_DATABASE_URL && process.env.DATABASE_URL) {
  process.env.PG_DATABASE_URL = process.env.DATABASE_URL;
}

// reflect-metadata HAS to load eagerly — it installs `Reflect.metadata` and
// the related polyfills as a side-effect that every NestJS / TypeORM
// decorator under the AppModule tree expects to exist at decoration time.
import 'reflect-metadata';

// Deferred imports. None of these get evaluated until `bootstrap()` is called.
// Warmup walks past these without instantiating the NestJS DI container,
// TypeORM data sources, or the rest of the heavy dependency graph.
import defer * as nestCore from '@nestjs/core';
import defer * as classValidator from 'class-validator';
import defer * as expressSessionNs from 'express-session';
import defer * as nodePathDefer from 'node:path';
import defer * as nodeFsDefer from 'node:fs';
import defer * as nodeUrlDefer from 'node:url';

import defer * as appModuleNs from 'src/app.module';
import defer * as loggerNs from 'src/engine/core-modules/logger/logger.service';
import defer * as queueConstantsNs from 'src/engine/core-modules/message-queue/message-queue.constants';
import defer * as queueOptionsNs from 'src/engine/core-modules/message-queue/interfaces/message-queue-module-options.interface';
import defer * as pgDriverNs from 'src/engine/core-modules/message-queue/drivers/pg.driver';
import defer * as sessionFactoryNs from 'src/engine/core-modules/session-storage/session-storage.module-factory';
import defer * as configServiceNs from 'src/engine/core-modules/twenty-config/twenty-config.service';
import defer * as configTransformersNs from 'src/engine/core-modules/twenty-config/utils/config-transformers.util';
import defer * as filterNs from 'src/filters/unhandled-exception.filter';

import type { NestExpressApplication } from '@nestjs/platform-express';

const bootstrap = async (): Promise<NestExpressApplication> => {
  // Each `.X` access on a deferred namespace triggers evaluation of that
  // module + its dep subtree. Keeping the touches inside this function is
  // what keeps warmup quiet on Deno Deploy.
  const { NestFactory } = nestCore;
  const { useContainer } = classValidator;
  const session = expressSessionNs.default;
  const { AppModule } = appModuleNs;
  const { LoggerService } = loggerNs;
  const { QUEUE_DRIVER } = queueConstantsNs;
  const { MessageQueueDriverType } = queueOptionsNs;
  const { PgDriver } = pgDriverNs;
  const { getSessionStorageOptions } = sessionFactoryNs;
  const { TwentyConfigService } = configServiceNs;
  const { configTransformers } = configTransformersNs;
  const { UnhandledExceptionFilter } = filterNs;

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

  // SPA fallback — register Express middleware BEFORE listen so it sits ahead
  // of Nest's catch-all NotFoundException. Read the file once at boot and
  // send the bytes directly (Deno's node-compat res.sendFile is flaky).
  const dir = nodePathDefer.resolve(
    nodePathDefer.dirname(nodeUrlDefer.fileURLToPath(import.meta.url)),
    'src/front',
  );
  const idx = nodePathDefer.join(dir, 'index.html');
  if (nodeFsDefer.existsSync(idx)) {
    const body = nodeFsDefer.readFileSync(idx, 'utf8');
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
      res.send(body);
    }) as never);
    logger.log(`SPA fallback wired (serving ${idx}, ${body.length} bytes)`, 'Bootstrap');
  }

  // --- Deno.cron heartbeats (PG driver only) -------------------------------
  const driverType = config.get('MESSAGE_QUEUE_DRIVER_TYPE');
  if (driverType === MessageQueueDriverType.Pg && typeof Deno?.cron === 'function') {
    const driver = app.get(QUEUE_DRIVER) as InstanceType<typeof PgDriver>;

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

  const port = Number(process.env.PORT ?? config.get('NODE_PORT') ?? 3000);
  await app.listen(port);
  logger.log(`Listening on http://localhost:${port}`, 'Bootstrap');
  return app;
};

// Await bootstrap at top level. import defer still does its job during the
// pre-bootstrap module-eval phase — Deno's static graph parses every deferred
// module but skips top-level evaluation until `bootstrap()` runs. That gets us
// past Deploy's warmup module-init budget (previous deploy attempts emitted
// ~1100 `Initialize <pkg>` lines and silently aborted; with defer they drop
// to a handful). The actual materialization of the dep graph happens during
// `bootstrap()`, after Deploy considers the entrypoint warm.
//
// Top-level-await is REQUIRED on Deno Deploy — without it the entrypoint
// returns immediately and the runtime exits before NestJS's express listener
// binds the port, which Deploy reports as "failed (error)".
await bootstrap();
