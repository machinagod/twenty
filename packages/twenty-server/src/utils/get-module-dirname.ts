import { createRequire } from 'node:module';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Cross-runtime replacements for the CommonJS `__dirname` and `require` globals. The
// server runs as CommonJS under Node (swc/jest) and as ESM under Deno; those globals
// only exist in the former, and `import.meta` is rejected by tsc (module: commonjs).
// Resolving the caller's location from the V8 stack works in both runtimes and stays
// tsc-safe. `new Error().stack` is captured inside each helper, so frame [2] is the
// caller.
const callerLocation = (stack: string | undefined): string => {
  const stackLine = (stack ?? '').split('\n')[2] ?? '';
  const match = stackLine.match(
    /\(?((?:file:\/\/)?(?:\/|[A-Za-z]:\\)[^()]*?):\d+:\d+\)?\s*$/,
  );
  let location = match?.[1] ?? '';

  if (location.startsWith('file://')) {
    location = fileURLToPath(location);
  }

  return location;
};

export const getModuleDirname = (): string =>
  dirname(callerLocation(new Error().stack));

export const getModuleRequire = (): ReturnType<typeof createRequire> =>
  createRequire(callerLocation(new Error().stack));
