// All the heavy NestJS / TypeORM / GraphQL imports live in this file. Loaded
// dynamically by boot-serve.ts via a runtime-computed specifier so Deno Deploy's
// deploying-phase static graph walker doesn't pre-compile this subtree at deploy
// time. The first incoming HTTP request triggers the import.
//
// Exports a single `loadHandler(): Promise<{ express, init }>` factory.

import 'reflect-metadata';

import type { NestExpressApplication } from '@nestjs/platform-express';

import { NestFactory } from '@nestjs/core';
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

import * as nodePath from 'node:path';
import * as nodeFs from 'node:fs';
import * as nodeUrl from 'node:url';

export type ExpressApp = (req: unknown, res: unknown, next?: (e?: unknown) => void) => void;

export const bootHandler = async (): Promise<{
  express: ExpressApp;
  nest: NestExpressApplication;
}> => {
  const app = (await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: { exposedHeaders: ['WWW-Authenticate'] },
    rawBody: true,
  }));

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
  // of Nest's catch-all NotFoundException.
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

  // Deno.cron heartbeats (PG driver only).
  const driverType = config.get('MESSAGE_QUEUE_DRIVER_TYPE');
  if (driverType === MessageQueueDriverType.Pg && typeof Deno?.cron === 'function') {
    const driver = app.get(QUEUE_DRIVER) as InstanceType<typeof PgDriver>;
    Deno.cron('twenty-drain', '* * * * *', async () => {
      try { const n = await driver.drainAll(); if (n > 0) logger.log(`[cron] drained ${n}`, 'DenoCron'); }
      catch (err) { logger.error(`[cron] drain failed: ${(err as Error).message}`, undefined, 'DenoCron'); }
    });
    Deno.cron('twenty-schedule', '* * * * *', async () => {
      try { const n = await driver.runDueSchedules(); if (n > 0) logger.log(`[cron] enqueued ${n}`, 'DenoCron'); }
      catch (err) { logger.error(`[cron] schedule failed: ${(err as Error).message}`, undefined, 'DenoCron'); }
    });
    Deno.cron('twenty-cleanup', '0 * * * *', async () => {
      try { const n = await driver.cleanup(); if (n > 0) logger.log(`[cron] retention ${n}`, 'DenoCron'); }
      catch (err) { logger.error(`[cron] cleanup failed: ${(err as Error).message}`, undefined, 'DenoCron'); }
    });
    logger.log('PG driver + Deno.cron heartbeats registered', 'Bootstrap');
  }

  if (process.env.DENO_DEPLOYMENT_ID) {
    await app.init();
    logger.log('NestJS initialized (Deno.serve owns the port)', 'Bootstrap');
  } else {
    const port = Number(process.env.PORT ?? config.get('NODE_PORT') ?? 3000);
    await app.listen(port);
    logger.log(`Listening on http://localhost:${port}`, 'Bootstrap');
  }

  return { express: app.getHttpAdapter().getInstance() as ExpressApp, nest: app };
};
