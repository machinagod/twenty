// Replacement vite config for twenty-ui's bundle. Same shape as
// packages/twenty-ui/vite.config.ts, minus two plugins:
//   - vite-plugin-checker: runs a strict tsc pass and fails on missing
//     `@linaria/core` types (twenty-ui omits it from package.json — yarn
//     hoisting normally satisfies the runtime import) plus JotaiProvider
//     React-type drift. nx orchestration normally caches around these.
//   - vite-plugin-dts: same root cause; only matters for downstream `.d.ts`
//     consumers, not the runtime bundle twenty-front needs.
// Also marks `@linaria/core` external so Rollup doesn't try to bundle it
// (it ships as a runtime import emitted by the linaria swc plugin).
//
// Authored as a flat config rather than re-importing twenty-ui's vite.config.ts
// because that file does `import packageJson from './package.json'`, which
// Node 25 rejects under dynamic-import without `with { type: 'json' }`.
//
// Load with: `vite build -c deno-spike/vite-ui-override.mjs`.

import react from '@vitejs/plugin-react-swc';
import wyw from '@wyw-in-js/vite';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

const uiRoot = path.resolve(new URL('.', import.meta.url).pathname, '../packages/twenty-ui');
const packageJson = JSON.parse(fs.readFileSync(path.join(uiRoot, 'package.json'), 'utf8'));

const entries = Object.keys(packageJson.exports)
  .filter((el) => !el.endsWith('.css'))
  .map((module) => `src/${module}/index.ts`);

const entryFileNames = (chunk, extension) => {
  const splitFaceModuleId = chunk.facadeModuleId?.split('/');
  const moduleDirectory = splitFaceModuleId[splitFaceModuleId.length - 2];
  return moduleDirectory === 'src'
    ? `${chunk.name}.${extension}`
    : `${moduleDirectory}.${extension}`;
};

const BUNDLED_DEPS = ['@tabler/icons-react'];
const externalDeps = [
  ...Object.keys(packageJson.dependencies || {}).filter((dep) => !BUNDLED_DEPS.includes(dep)),
  '@linaria/core',
];

export default defineConfig({
  resolve: {
    alias: {
      '@ui/': path.join(uiRoot, 'src') + '/',
      '@assets/': path.join(uiRoot, 'src/assets') + '/',
      '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
    },
  },
  css: { modules: { localsConvention: 'camelCaseOnly' } },
  root: uiRoot,
  cacheDir: '../../node_modules/.vite/packages/twenty-ui',
  assetsInclude: ['src/**/*.svg'],
  plugins: [
    react(),
    tsconfigPaths({ root: uiRoot, projects: ['tsconfig.json'] }),
    svgr(),
    wyw({
      include: [path.join(uiRoot, 'src') + '/**/*.{ts,tsx}'],
      babelOptions: {
        presets: ['@babel/preset-typescript', '@babel/preset-react'],
      },
    }),
    {
      name: 'copy-theme-css',
      closeBundle() {
        for (const file of ['theme-light.css', 'theme-dark.css']) {
          fs.copyFileSync(
            path.join(uiRoot, 'src/theme-constants', file),
            path.join(uiRoot, 'dist', file),
          );
        }
      },
    },
  ],
  build: {
    cssCodeSplit: false,
    minify: 'esbuild',
    sourcemap: false,
    emptyOutDir: false,
    outDir: path.join(uiRoot, 'dist'),
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
      interopDefault: true,
      defaultIsModuleExports: true,
      requireReturnsDefault: 'auto',
    },
    lib: { entry: ['src/index.ts', ...entries], name: 'twenty-ui' },
    rollupOptions: {
      external: (id) => externalDeps.some((dep) => id === dep || id.startsWith(dep + '/')),
      output: [
        {
          assetFileNames: 'style.css',
          globals: { react: 'React', 'react-dom': 'ReactDOM' },
          format: 'es',
          entryFileNames: (chunk) => entryFileNames(chunk, 'mjs'),
        },
        {
          assetFileNames: 'style.css',
          format: 'cjs',
          globals: { react: 'React', 'react-dom': 'ReactDOM' },
          interop: 'auto',
          esModule: true,
          exports: 'named',
          entryFileNames: (chunk) => entryFileNames(chunk, 'cjs'),
        },
      ],
    },
  },
  logLevel: 'error',
});
