#!/usr/bin/env node
// Bundle twenty-server's Deno-mode entrypoint (boot-serve.ts) into a single
// .mjs that Deno Deploy can ship without materializing the full 3541-package
// npm graph. The bundle inlines NestJS, TypeORM, GraphQL Yoga, twenty-shared/
// emails/client-sdk dists, etc. Anything that genuinely can't be bundled
// (Node builtins, native bindings, files Twenty resolves dynamically) goes in
// the `external` list and is expected to be on the platform at runtime.
//
//   node deno-spike/bundle-server.mjs
//
// Output: packages/twenty-server/dist/boot-serve.bundle.mjs
//
// The decorator-metadata-preserving transform comes from esbuild's tsconfigRaw
// (experimentalDecorators + emitDecoratorMetadata). NestJS DI + TypeORM type
// inference rely on this metadata at runtime, so it MUST survive bundling.
//
// Deno Deploy injects DATABASE_URL when a Prisma DB is assigned to the app;
// the bundled boot-serve.ts bridges it to PG_DATABASE_URL at module top.
//
// NOTE: this is a deploy-time bundle, not a dev-iteration aid. Local dev still
// runs the source via `deno task serve`. Production / Deploy uses the bundle.

import esbuild from 'esbuild';
import * as swc from '@swc/core';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '..');
const entry = path.join(repoRoot, 'packages/twenty-server/boot-serve.ts');
const outfile = path.join(repoRoot, 'packages/twenty-server/dist/boot-serve.bundle.mjs');

// External modules: anything that breaks under bundling and must be resolved
// at runtime instead. Native bindings, dynamic-require packages, and the
// Deno-only `Deno.cron` API which esbuild leaves alone.
// "External" here actually means "stubbed at bundle time" — see stubAliases
// below. None of these get imported at runtime; they're either optional peers,
// type-only references, native bindings not used in deno-mode, or platform
// extras (macOS fsevents).
const external = [
  // Native bindings — never executed in deno-mode
  'pg-native',
  'better-sqlite3',
  'sqlite3',
  '@grpc/grpc-js',
  'sharp',
  'canvas',
  'cpu-features',
  'fsevents',
  // Optional/peer deps Twenty doesn't use but transitive trees reference
  'mongodb',
  'mysql',
  'mysql2',
  'oracledb',
  'tedious',
  '@sap/hana-client',
  'hdb-pool',
  'sql.js',
  'pg-query-stream',
  'typeorm-aurora-data-api-driver',
  // NestJS optional adapters Twenty doesn't enable
  '@nestjs/microservices',
  '@nestjs/microservices/microservices-module',
  '@nestjs/websockets/socket-module',
  '@nestjs/mongoose',
  '@nestjs/sequelize/dist/common/sequelize.utils',
  // GraphQL Apollo federation extras (not used)
  '@apollo/subgraph',
  '@apollo/subgraph/dist/directives',
  '@apollo/subgraph/package.json',
  // Other unused TypeORM/NestJS adapter peers
  '@mikro-orm/core',
  '@fastify/static',
  'class-transformer/storage',
  // BullMQ peer (we use the PG queue driver in deno mode) — leave it external
  // so the union-type import resolves without dragging the whole package in.
  'bullmq',
  'ioredis',
  // jsdom is pulled in by a util module's transitive but never actually used
  // by the server at runtime; bundling it triggers a dynamic require.resolve
  // of an internal worker file esbuild can't follow.
  'jsdom',
  // CLI-only packages dragged in by transitive trees. Twenty's running server
  // never invokes these (they're for command/script paths only).
  'listr',
  'any-observable',
  '@samverschueren/stream-to-observable',
  // GraphQL/codegen CLIs — drag in self-referential require.resolve()s.
  '@genql/cli',
  '@graphql-codegen/cli',
  '@graphql-codegen/typescript',
  '@graphql-codegen/typescript-operations',
  '@graphql-codegen/typed-document-node',
];

// Lingui macros: the "pure-Deno" runtime shim implements msg/t/defineMessage as
// real functions over @lingui/core's i18n. It's NOT a stub — these get called
// from Twenty source paths that DO execute (error messages, validation copy).
// Alias both macro entry points to the same runtime shim file.
const macroShim = path.join(here, 'shims/lingui-macro.ts');

// Redirect every external to a self-contained stub instead of leaving runtime
// `import "external-pkg"` statements in the bundle. On Deno Deploy any unresolved
// npm: specifier triggers a project-wide npm install, which dies on transitive
// packages with malformed manifests (e.g. @electron/rebuild's git: dep spec).
// The stub lives in deno-spike/shims/ and throws if any code actually calls it.
const stubAliases = Object.fromEntries(
  external.map((name) => [name, path.join(here, 'shims/external-stub.cjs')]),
);

const result = await esbuild.build({
  entryPoints: [entry],
  outfile,
  bundle: true,
  platform: 'node', // Deno Deploy supports node-compat
  format: 'esm',
  target: 'node22',
  minify: false,            // keep stack traces useful while iterating
  sourcemap: 'external',
  keepNames: true,          // NestJS reads class.name for DI tokens
  legalComments: 'none',
  logLevel: 'info',
  metafile: true,
  alias: stubAliases,
  // Re-export the source-level TS config so decorators survive.
  tsconfigRaw: {
    compilerOptions: {
      experimentalDecorators: true,
      emitDecoratorMetadata: true,
      target: 'es2022',
      useDefineForClassFields: false,
    },
  },
  // Empty banner that ensures Deno's ESM loader treats it as a module + adds
  // the DATABASE_URL → PG_DATABASE_URL bridge as the absolute first thing.
  banner: {
    js: [
      '// Deploy bundle of packages/twenty-server/boot-serve.ts',
      '// Built with deno-spike/bundle-server.mjs',
      // esbuild emits a `__require` helper that checks `typeof require`. Define
      // a working `require` on globalThis so dynamic `require("node:stream")`
      // calls embedded in bundled CJS code (NestJS, TypeORM) resolve.
      "import { createRequire as __nodeCreateRequire } from 'node:module';",
      "import { fileURLToPath as __nodeFileURLToPath } from 'node:url';",
      "import { dirname as __nodeDirname } from 'node:path';",
      "if (typeof globalThis.require === 'undefined') globalThis.require = __nodeCreateRequire(import.meta.url);",
      "if (typeof globalThis.__filename === 'undefined') globalThis.__filename = __nodeFileURLToPath(import.meta.url);",
      "if (typeof globalThis.__dirname === 'undefined') globalThis.__dirname = __nodeDirname(globalThis.__filename);",
      "if (!process.env.PG_DATABASE_URL && process.env.DATABASE_URL) process.env.PG_DATABASE_URL = process.env.DATABASE_URL;",
    ].join('\n'),
  },
  // Resolve `src/...` (twenty-server's tsconfig path alias) to the package src,
  // and resolve extensionless deep npm subpaths (typeorm/error/X, graphql/lang)
  // by walking node_modules manually — esbuild's npm resolver respects the
  // `exports` field, which Deno's import map sidesteps; Twenty's source relies
  // on the latter.
  plugins: [{
    // esbuild's built-in TS transform DROPS the type info before the decorator
    // metadata pass, so NestJS DI / TypeORM column-type inference (both rely on
    // `Reflect.getMetadata("design:type", target, key)`) blow up at runtime
    // with `ColumnTypeUndefinedError` / `Cannot resolve provider`. Run @swc/core
    // over `.ts` files instead — it does emit decorator metadata when configured.
    name: 'swc-ts-with-decorator-metadata',
    setup(build) {
      build.onLoad({ filter: /\.tsx?$/ }, async (args) => {
        // Skip declaration files and anything inside node_modules — those are
        // already JS / don't need re-transformation.
        if (args.path.endsWith('.d.ts') || args.path.includes('/node_modules/')) {
          return null;
        }
        const source = await fs.promises.readFile(args.path, 'utf8');
        const isTsx = args.path.endsWith('.tsx');
        const result = await swc.transform(source, {
          filename: args.path,
          jsc: {
            parser: { syntax: 'typescript', tsx: isTsx, decorators: true },
            transform: { legacyDecorator: true, decoratorMetadata: true },
            target: 'es2022',
            keepClassNames: true,
          },
          module: { type: 'es6' },
          sourceMaps: false,
        });
        return { contents: result.code, loader: 'js' };
      });
    },
  }, {
    name: 'lingui-macro-runtime-shim',
    setup(build) {
      // Replace @lingui/{core,react}/macro with the runtime shim — esbuild's
      // `alias` is bypassed when a package's `exports` redirects the subpath,
      // which is exactly what @lingui/core/macro does (→ ./macro/index.js,
      // which re-exports babel-plugin-lingui-macro that throws at runtime).
      // An onResolve filter catches BOTH the bare specifier AND the resolved
      // file path so the babel macro never makes it into the bundle.
      const ours = path.join(here, 'shims/lingui-macro.ts');
      build.onResolve({ filter: /^@lingui\/(core|react)\/macro$/ }, () => ({ path: ours }));
      build.onResolve({ filter: /@lingui[\/+](core|react)[\/+]?[^@]*[\/+]macro([\/+]index)?\.(js|cjs|mjs)$/ }, () => ({ path: ours }));
      build.onResolve({ filter: /babel-plugin-lingui-macro\/dist\/macro\.cjs$/ }, () => ({ path: ours }));
    },
  }, {
    name: 'node-builtins-as-external',
    setup(build) {
      // Mark all Node builtins as external WITH the `node:` prefix so the
      // emitted ESM is `import { … } from 'node:buffer'`. Deno's runtime
      // requires the prefix; bare `import 'buffer'` errors with
      // `Import "buffer" not a dependency`.
      const builtins = [
        'assert','assert/strict','async_hooks','buffer','child_process','cluster',
        'console','constants','crypto','dgram','diagnostics_channel','dns','dns/promises',
        'domain','events','fs','fs/promises','http','http2','https','inspector',
        'inspector/promises','module','net','os','path','path/posix','path/win32',
        'perf_hooks','process','punycode','querystring','readline','readline/promises',
        'repl','stream','stream/consumers','stream/promises','stream/web','string_decoder',
        'sys','timers','timers/promises','tls','trace_events','tty','url','util',
        'util/types','v8','vm','wasi','worker_threads','zlib',
      ];
      const re = new RegExp('^(?:' + builtins.map((b) => b.replace('/', '\\/')).join('|') + ')$');
      build.onResolve({ filter: re }, (args) => ({ path: 'node:' + args.path, external: true }));
    },
  }, {
    name: 'source-shim-overrides',
    setup(build) {
      // Sdk-client-package-dirname.ts uses `require.resolve('twenty-client-sdk/core')`
      // in dev mode and depends on a /dist/ path in built mode. Neither survives
      // bundling (no node_modules at runtime, getModuleDirname returns the bundle
      // dirname). Replace it with a constant that mirrors built-mode resolution.
      const sdkShim = path.join(here, 'shims/sdk-client-package-dirname.ts');
      build.onResolve({ filter: /sdk-client-package-dirname(\.ts)?$/ }, () => ({ path: sdkShim }));

      // bcrypt loads a native .node binding via node-pre-gyp at module init.
      // The binding can't be bundled and isn't on Deploy's runtime image.
      // bcryptjs has the same API but is pure JS — alias `bcrypt` to it.
      build.onResolve({ filter: /^bcrypt(\/.*)?$/ }, () => ({ path: 'bcryptjs', external: false, namespace: 'bcrypt-alias' }));
      build.onLoad({ filter: /.*/, namespace: 'bcrypt-alias' }, () => ({
        contents: "export * from 'bcryptjs'; import b from 'bcryptjs'; export default b;",
        loader: 'js',
        resolveDir: repoRoot,
      }));
    },
  }, {
    name: 'twenty-server-resolvers',
    setup(build) {
      const srcRoot = path.join(repoRoot, 'packages/twenty-server/src');
      const dotDeno = path.join(repoRoot, 'node_modules/.deno');

      build.onResolve({ filter: /^src\// }, async (args) => {
        const rel = args.path.slice('src/'.length);
        for (const ext of ['.ts', '.tsx', '/index.ts', '/index.tsx', '.mjs', '.cjs', '.js', '']) {
          const candidate = path.join(srcRoot, rel + ext);
          try {
            await fs.promises.access(candidate);
            return { path: candidate };
          } catch {}
        }
        return { errors: [{ text: `Could not resolve "${args.path}" under twenty-server/src/` }] };
      });

      // Deep extensionless npm subpaths (e.g. typeorm/error/EntityNotFoundError).
      // esbuild's default resolver respects package.json `exports`, which TypeORM
      // doesn't declare for every internal file. Walk node_modules to find them.
      build.onResolve({ filter: /^[a-z@]/ }, async (args) => {
        // Only handle paths with a slash AND no extension (deep subpaths).
        if (!args.path.includes('/') || /\.[a-z]+$/.test(args.path)) return null;
        if (args.path.startsWith('@') && args.path.split('/').length <= 2) return null;
        if (args.path.startsWith('src/') || args.path.startsWith('.') || args.path.startsWith('node:')) return null;

        const parts = args.path.split('/');
        const pkgName = args.path.startsWith('@') ? `${parts[0]}/${parts[1]}` : parts[0];
        const subpath = args.path.slice(pkgName.length + 1);
        if (!subpath) return null;

        // Look up the pkg in node_modules (top-level first, then .deno/).
        const candidates = [
          path.join(repoRoot, 'node_modules', pkgName),
          ...(await fs.promises.readdir(dotDeno).catch(() => []))
            .filter((d) => d.startsWith(pkgName.replace('/', '+') + '@'))
            .map((d) => path.join(dotDeno, d, 'node_modules', pkgName)),
        ];
        for (const pkgDir of candidates) {
          for (const ext of ['.mjs', '.js', '.cjs', '/index.mjs', '/index.js', '/index.cjs']) {
            const candidate = path.join(pkgDir, subpath + ext);
            try {
              await fs.promises.access(candidate);
              return { path: candidate };
            } catch {}
          }
        }
        return null; // fall through to esbuild's default
      });
    },
  }],
  // node_modules lives at the workspace root; let esbuild walk up to find it.
  resolveExtensions: ['.ts', '.tsx', '.mjs', '.cjs', '.js', '.json'],
  absWorkingDir: repoRoot,
});

const summary = path.join(repoRoot, 'packages/twenty-server/dist/boot-serve.bundle.meta.json');
fs.mkdirSync(path.dirname(summary), { recursive: true });
fs.writeFileSync(summary, JSON.stringify(result.metafile, null, 2));

const outBytes = fs.statSync(outfile).size;
console.log(`bundle written: ${outfile} (${(outBytes / 1024 / 1024).toFixed(1)} MB)`);
console.log(`metafile:       ${summary}`);
