#!/usr/bin/env bash
# Builds twenty-front (+ its workspace deps) into static assets ready to be
# served by the Deno backend. Assumes `prepare-deno-deps.sh` + `apply-patches.sh`
# have already run (so `node_modules/` is populated, flat-hoisted, and patched).
#
# Pure-Deno-build chain (no yarn, no nx):
#   1. twenty-shared `.d.ts`        — tsc declaration-only (the .mjs/.cjs are
#                                      already produced by prepare-deno-deps.sh).
#   2. twenty-ui bundle (.mjs+.css) — vite, with the override that drops the
#                                      type-checking plugins that nx caching hides.
#   3. twenty-front bundle          — vite. Needs --max-old-space-size=8192 to
#                                      avoid V8 OOM on the production bundle
#                                      (mirrors the original npm `build` script).
#   4. copy build → server/src/front — AppModule's ServeStaticModule picks it up
#                                       when the directory exists.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VITE="$ROOT/node_modules/.bin/vite"
TSC="$ROOT/node_modules/.bin/tsc"

if [ ! -x "$VITE" ] || [ ! -x "$TSC" ]; then
  echo "node_modules/.bin/{vite,tsc} missing — run bash deno-spike/prepare-deno-deps.sh first" >&2
  exit 1
fi

echo "==> twenty-shared .d.ts (tsc declaration-only)"
( cd "$ROOT/packages/twenty-shared" && \
  "$TSC" -p tsconfig.lib.json --declaration --emitDeclarationOnly \
         --noEmit false --outDir dist --rootDir src )

echo "==> twenty-ui (vite with checker/dts stripped)"
mkdir -p "$ROOT/packages/twenty-ui/dist"
( cd "$ROOT/packages/twenty-ui" && \
  "$VITE" build -c "$ROOT/deno-spike/vite-ui-override.mjs" )

echo "==> twenty-front (vite, --max-old-space-size=8192)"
rm -rf "$ROOT/packages/twenty-front/build"
( cd "$ROOT/packages/twenty-front" && \
  NODE_OPTIONS="--max-old-space-size=8192" "$VITE" build )

echo "==> copy build → packages/twenty-server/src/front"
rm -rf "$ROOT/packages/twenty-server/src/front"
cp -r "$ROOT/packages/twenty-front/build" "$ROOT/packages/twenty-server/src/front"

echo "done."
