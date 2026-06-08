// Unified Deno entrypoint: real AppModule via NestFactory + Express
// (Node-compat) + Deno.cron heartbeats.
//
// Optimised for Deno Deploy's warmup phase: top-level evaluation does NOTHING
// heavy. It registers Deno.serve with a fast handler and returns. Deploy sees
// the port bound, marks the app warm, and accepts the deployment. The first
// request triggers a lazy `bootstrap()` that runs the full NestJS init
// (TypeORM, GraphQL schema, all 3541 packages). Subsequent requests reuse
// the warm Express handler.
//
// Bridge between Deno's Web Request and NestJS's Express handler is inline
// at the bottom — Express is just a `(req, res, next)` function; we
// synthesize Node-style req/res from Web Request and read the response back.
//
// Local (no DENO_DEPLOYMENT_ID): same path, kicks bootstrap inline and
// awaits it so Ctrl-C semantics work. NestJS binds NODE_PORT directly via
// app.listen(); Deno.serve still binds an extra port for parity with Deploy
// behavior. To run NestJS-only locally, omit the DENO_BOOT_LAZY=1 env (off
// by default — local boot stays direct via app.listen).

// Deno Deploy's Prisma integration injects DATABASE_URL; Twenty reads
// PG_DATABASE_URL. Bridge before ANYTHING else loads — datasource modules
// read env eagerly at module-load time.
if (!process.env.PG_DATABASE_URL && process.env.DATABASE_URL) {
  process.env.PG_DATABASE_URL = process.env.DATABASE_URL;
}

import 'reflect-metadata';

import { Buffer } from 'node:buffer';
import { Readable } from 'node:stream';

// Web-Request → Express bridge. Express handlers are `(req, res, next) => …`
// where req/res are Node IncomingMessage/ServerResponse. We synthesize just
// enough surface for Express + NestJS exception filters + the session/SPA
// middlewares we use.
type ExpressApp = (req: unknown, res: unknown, next?: (e?: unknown) => void) => void;

const bridgeRequest = async (expressApp: ExpressApp, req: Request): Promise<Response> => {
  const url = new URL(req.url);
  const bodyBytes = req.body ? new Uint8Array(await req.arrayBuffer()) : null;
  const bodyBuffer = bodyBytes ? Buffer.from(bodyBytes) : Buffer.alloc(0);

  const nodeReq = Object.assign(Readable.from(bodyBuffer.length ? [bodyBuffer] : []), {
    url: url.pathname + url.search,
    method: req.method,
    headers: Object.fromEntries(req.headers),
    httpVersion: '1.1',
    httpVersionMajor: 1,
    httpVersionMinor: 1,
    socket: { remoteAddress: req.headers.get('x-forwarded-for') ?? '127.0.0.1', destroy() {} },
    connection: { remoteAddress: req.headers.get('x-forwarded-for') ?? '127.0.0.1' },
    complete: true,
  });

  return new Promise<Response>((resolve) => {
    const headers = new Headers();
    const chunks: Buffer[] = [];
    let statusCode = 200;
    let statusMessage = 'OK';
    let ended = false;

    const setHeader = (name: string, value: string | string[] | number) => {
      const v = Array.isArray(value) ? value : [String(value)];
      headers.delete(name);
      for (const item of v) headers.append(name, item);
    };
    const getHeader = (name: string) => headers.get(name) ?? undefined;

    const nodeRes = {
      statusCode,
      statusMessage,
      headersSent: false,
      writableEnded: false,
      setHeader(name: string, value: string | string[] | number) { setHeader(name, value); },
      getHeader,
      getHeaders() { return Object.fromEntries(headers.entries()); },
      removeHeader(name: string) { headers.delete(name); },
      hasHeader(name: string) { return headers.has(name); },
      writeHead(status: number, msgOrHeaders?: string | Record<string, string>, maybeHeaders?: Record<string, string>) {
        nodeRes.statusCode = status;
        const h = typeof msgOrHeaders === 'string' ? (maybeHeaders ?? {}) : (msgOrHeaders ?? {});
        if (typeof msgOrHeaders === 'string') nodeRes.statusMessage = msgOrHeaders;
        for (const [k, v] of Object.entries(h)) setHeader(k, v as string);
        return nodeRes;
      },
      write(chunk: Buffer | string | Uint8Array) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : Buffer.from(chunk));
        return true;
      },
      end(chunk?: Buffer | string | Uint8Array) {
        if (ended) return;
        ended = true;
        if (chunk != null) {
          chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : Buffer.from(chunk));
        }
        nodeRes.writableEnded = true;
        resolve(new Response(Buffer.concat(chunks), { status: nodeRes.statusCode, statusText: nodeRes.statusMessage, headers }));
      },
      flushHeaders() {},
      on() { return nodeRes; },
      once() { return nodeRes; },
      emit() { return true; },
      // express-session writes a Set-Cookie via res.setHeader('Set-Cookie', [...])
      // and Set-Cookie is special-cased: Headers can hold multiple values.
    };

    try {
      expressApp(nodeReq, nodeRes, (err: unknown) => {
        if (err && !ended) {
          ended = true;
          resolve(new Response(`Internal error: ${(err as Error)?.message ?? err}`, { status: 500 }));
        }
      });
    } catch (err) {
      if (!ended) {
        ended = true;
        resolve(new Response(`Bootstrap error: ${(err as Error)?.message ?? err}`, { status: 500 }));
      }
    }
  });
};

// ---- Lazy bootstrap state ---------------------------------------------------
type Booted = { express: ExpressApp; nest: unknown };
let bootPromise: Promise<Booted> | null = null;
let bootError: Error | null = null;

const bootstrap = async (): Promise<Booted> => {
  console.log('[boot] starting NestJS bootstrap…');
  // Dynamic imports — none of these are touched until first request hits.
  const [
    nestCoreNs,
    classValidatorNs,
    expressSessionNs,
    nodePathNs,
    nodeFsNs,
    nodeUrlNs,
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

  // Cast to the platform-express NestApplication shape without statically
  // importing the type module (kept lazy).
  type NestExpressApplication = Awaited<ReturnType<typeof NestFactory.create>> & {
    set: (k: string, v: unknown) => void;
    use: (mw: unknown) => void;
    select: (m: unknown) => unknown;
    useLogger: (l: unknown) => void;
    useGlobalFilters: (f: unknown) => void;
    useBodyParser: (k: string, opts?: unknown) => void;
    listen: (port: number) => Promise<unknown>;
    init: () => Promise<void>;
    getHttpAdapter: () => { getInstance: () => ExpressApp };
  };

  const app = (await NestFactory.create(AppModule, {
    cors: { exposedHeaders: ['WWW-Authenticate'] },
    rawBody: true,
  })) as unknown as NestExpressApplication;

  const logger = (app as unknown as { get: (t: unknown) => unknown }).get(LoggerService) as {
    log: (m: string, ctx?: string) => void;
    error: (m: string, t?: unknown, ctx?: string) => void;
  };
  const config = (app as unknown as { get: (t: unknown) => unknown }).get(TwentyConfigService) as {
    get: (k: string) => string;
  };

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
  const dir = nodePathNs.resolve(
    nodePathNs.dirname(nodeUrlNs.fileURLToPath(import.meta.url)),
    'src/front',
  );
  const idx = nodePathNs.join(dir, 'index.html');
  if (nodeFsNs.existsSync(idx)) {
    const body = nodeFsNs.readFileSync(idx, 'utf8');
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
    const driver = (app as unknown as { get: (t: unknown) => unknown }).get(QUEUE_DRIVER) as InstanceType<typeof PgDriver>;
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

  // app.init() builds the DI graph + registers controllers without binding
  // a port (Deno.serve already owns the port on Deploy). On local dev we
  // still go through app.listen() so curl works against the usual port.
  if (process.env.DENO_DEPLOYMENT_ID) {
    await app.init();
    logger.log('NestJS initialized (Deno.serve owns the port)', 'Bootstrap');
  } else {
    const port = Number(process.env.PORT ?? config.get('NODE_PORT') ?? 3000);
    await app.listen(port);
    logger.log(`Listening on http://localhost:${port}`, 'Bootstrap');
  }

  return { express: app.getHttpAdapter().getInstance(), nest: app };
};

const ensureBoot = (): Promise<Booted> => {
  if (bootError) throw bootError;
  if (!bootPromise) {
    bootPromise = bootstrap().catch((err) => {
      bootError = err as Error;
      throw err;
    });
  }
  return bootPromise;
};

// Top-level on Deno Deploy: bind Deno.serve IMMEDIATELY with a fast handler.
// No heavy imports here, no NestJS, no module fanout — warmup completes in
// milliseconds. First HTTP request lazily kicks the full bootstrap.
// On Deno Deploy, the platform sets PORT; bind exactly that.
if (typeof Deno !== 'undefined' && typeof Deno.serve === 'function' && process.env.DENO_DEPLOYMENT_ID) {
  console.log('[boot] entrypoint warm — binding Deno.serve, deferring NestJS to first request');
  Deno.serve(async (req: Request) => {
    try {
      const { express } = await ensureBoot();
      return await bridgeRequest(express, req);
    } catch (err) {
      const msg = (err as Error)?.stack ?? (err as Error)?.message ?? String(err);
      console.error('[boot] handler error:', msg);
      return new Response(`Server initialization failed:\n${msg}`, { status: 500 });
    }
  });
} else {
  // Local dev: await bootstrap directly. NestJS owns the port via app.listen().
  await ensureBoot();
}
