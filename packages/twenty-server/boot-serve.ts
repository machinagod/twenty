// Unified Deno entrypoint: real AppModule via NestFactory.create + Express
// (Node-compat) + Deno.cron heartbeats (queue drain + schedule eval + retention
// cleanup). Replaces main.ts + queue-worker.ts in the "deno mode" target.
//
// Lazy-loading every heavy module via dynamic `await import(…)` inside
// `bootstrap()` keeps Deno Deploy's warmup phase short. The previous eager-
// imports version had Deploy evaluating ~1100 npm packages during the
// `deploying` step before silently aborting; with dynamic imports the
// deploying step does ~5 log lines (pre-deploy + entrypoint module ready)
// and the heavy materialization runs after the platform considers the
// entrypoint warm.
//
// Used dynamic `import()` rather than TC39 `import defer` because Deploy's
// runtime (Deno 2.7.x as of this writing) doesn't yet parse the `import
// defer` syntax — locally on Deno 2.8 it worked; on Deploy it produced an
// `EVENT_ITERATOR_VALIDATION_FAILED` internal error with no useful log.
//
// Local:
//   env NODE_ENV=development APP_SECRET=… PG_DATABASE_URL=… \
//     MESSAGE_QUEUE_DRIVER_TYPE=pg CACHE_STORAGE_TYPE=memory \
//     SESSION_STORAGE_TYPE=memory PUB_SUB_DRIVER_TYPE=postgres \
//     NODE_PORT=3000 \
//     deno run -A --unstable-cron --sloppy-imports boot-serve.ts

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

import type { NestExpressApplication } from '@nestjs/platform-express';

const bootstrap = async (): Promise<NestExpressApplication> => {
  // Resolve every heavy dep dynamically. The promise list runs in parallel so
  // module download + parse latency stacks, not sums. Each await blocks only
  // on its own subtree.
  const [
    nestCoreNs,
    classValidatorNs,
    expressSessionNs,
    nodePath,
    nodeFs,
    nodeUrl,
    appModuleNs,
    loggerNs,
    queueConstantsNs,
    queueOptionsNs,
    pgDriverNs,
    sessionFactoryNs,
    configServiceNs,
    configTransformersNs,
    filterNs,
  ] = await Promise.all([
    import('@nestjs/core'),
    import('class-validator'),
    import('express-session'),
    import('node:path'),
    import('node:fs'),
    import('node:url'),
    import('src/app.module'),
    import('src/engine/core-modules/logger/logger.service'),
    import('src/engine/core-modules/message-queue/message-queue.constants'),
    import('src/engine/core-modules/message-queue/interfaces/message-queue-module-options.interface'),
    import('src/engine/core-modules/message-queue/drivers/pg.driver'),
    import('src/engine/core-modules/session-storage/session-storage.module-factory'),
    import('src/engine/core-modules/twenty-config/twenty-config.service'),
    import('src/engine/core-modules/twenty-config/utils/config-transformers.util'),
    import('src/filters/unhandled-exception.filter'),
  ]);

  const { NestFactory } = nestCoreNs;
  const { useContainer } = classValidatorNs;
  const session = (expressSessionNs as { default: typeof import('express-session') }).default;
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
  const dir = nodePath.resolve(
    nodePath.dirname(nodeUrl.fileURLToPath(import.meta.url)),
    'src/front',
  );
  const idx = nodePath.join(dir, 'index.html');
  if (nodeFs.existsSync(idx)) {
    const body = nodeFs.readFileSync(idx, 'utf8');
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

// Top-level-await keeps the entrypoint alive while NestJS's express listener
// binds the port. import-defer / dynamic-import only delays evaluation — it
// doesn't change what bootstrap() ultimately materializes.
await bootstrap();
