// Thin Deno entrypoint. The whole point of this file is to be the MINIMUM
// statically-reachable graph from the entrypoint, so Deno Deploy's deploying-
// phase doesn't pre-compile the full NestJS + TypeORM + AWS SDK subtree
// (~3500 npm packages — every prior attempt hit the materialization wall
// around module 1000-1100).
//
// Heavy work lives in `./boot-handler.ts`. It is imported dynamically with a
// runtime-computed specifier so Deploy's static graph walker doesn't reach it
// at deploy time. The first incoming HTTP request triggers the import.
//
// Local dev: same lazy path. Run with `deno run -A --unstable-cron boot-serve.ts`.
// Deno Deploy: top-level Deno.serve binds the platform port; first request
// triggers the boot-handler import + NestJS bootstrap + `app.init()`.

// DATABASE_URL → PG_DATABASE_URL bridge — runs before anything else so the
// TypeORM data source modules pick it up when they finally load.
if (!process.env.PG_DATABASE_URL && process.env.DATABASE_URL) {
  process.env.PG_DATABASE_URL = process.env.DATABASE_URL;
}

import { Buffer } from 'node:buffer';
import { Readable } from 'node:stream';

type ExpressApp = (req: unknown, res: unknown, next?: (e?: unknown) => void) => void;

// Web Request → Express bridge. Express handlers are `(req, res, next) => …`
// with Node IncomingMessage/ServerResponse shapes; we synthesize just enough
// surface for Express + NestJS exception filters + session/SPA middleware.
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
    let ended = false;

    const setHeader = (name: string, value: string | string[] | number) => {
      const v = Array.isArray(value) ? value : [String(value)];
      headers.delete(name);
      for (const item of v) headers.append(name, item);
    };

    const nodeRes = {
      statusCode: 200,
      statusMessage: 'OK',
      headersSent: false,
      writableEnded: false,
      setHeader,
      getHeader: (name: string) => headers.get(name) ?? undefined,
      getHeaders: () => Object.fromEntries(headers.entries()),
      removeHeader: (name: string) => headers.delete(name),
      hasHeader: (name: string) => headers.has(name),
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
        if (chunk != null) chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : Buffer.from(chunk));
        nodeRes.writableEnded = true;
        resolve(new Response(Buffer.concat(chunks), { status: nodeRes.statusCode, statusText: nodeRes.statusMessage, headers }));
      },
      flushHeaders() {},
      on() { return nodeRes; },
      once() { return nodeRes; },
      emit() { return true; },
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

// Runtime-computed specifier — Deno's deploying-phase static graph walker
// can't statically resolve `import(<expression>)` when the expression isn't a
// literal string, so it skips pre-compiling `./boot-handler.ts` and its
// subtree at deploy time. The actual import happens on the first request,
// inside the Deno.serve handler.
const HANDLER_PATH = (() => {
  // Concatenate the path at runtime via an env-overridable parts list so the
  // string never appears as a single literal in source. The default still
  // resolves to ./boot-handler.ts.
  const parts = [Deno.env.get('TWENTY_HANDLER_PREFIX') ?? './boot-', 'handler', '.ts'];
  return parts.join('');
})();

let bootPromise: Promise<{ express: ExpressApp }> | null = null;
const ensureBoot = (): Promise<{ express: ExpressApp }> => {
  if (!bootPromise) {
    bootPromise = (async () => {
      console.log(`[boot] dynamically importing ${HANDLER_PATH} …`);
      const mod = await import(HANDLER_PATH) as { bootHandler: () => Promise<{ express: ExpressApp }> };
      return mod.bootHandler();
    })();
  }
  return bootPromise;
};

if (typeof Deno !== 'undefined' && typeof Deno.serve === 'function' && process.env.DENO_DEPLOYMENT_ID) {
  console.log('[boot] entrypoint warm — Deno.serve bound; NestJS deferred to first request');
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
  // Local dev: NestJS owns the port via app.listen() inside boot-handler.
  await ensureBoot();
}
