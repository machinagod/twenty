// Stub for esbuild externals when the bundle ships standalone on Deno Deploy.
// Twenty's code does NOT touch any of these at runtime in deno-mode (PG
// queue driver, memory cache, memory sessions, postgres pub/sub). They're
// referenced by type-only imports, optional-peer adapters, or platform-
// specific paths that never execute.
//
// If any of these actually gets called the throw will surface a clear
// "stubbed via bundle-server.mjs externals" message rather than a cryptic
// `undefined is not a function`.
const stub = new Proxy(function () {}, {
  get(_t, prop) {
    if (prop === Symbol.toPrimitive) return () => '<external-stub>';
    if (prop === '__esModule') return true;
    if (prop === 'default') return stub;
    return stub;
  },
  apply() {
    throw new Error(
      '[bundle-stub] external module method called at runtime — ' +
      'add the real package to bundle-server.mjs externals or remove the call',
    );
  },
  construct() {
    throw new Error(
      '[bundle-stub] external module constructor called at runtime — ' +
      'add the real package to bundle-server.mjs externals or remove the call',
    );
  },
});

export default stub;
export const __esModule = true;
