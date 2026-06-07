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

# If the pre-built frontend bundle is already committed (deploy branches do this
# to fit under Deno Deploy's 5-min build cap), skip the entire vite chain.
# Override with FORCE_FRONTEND_REBUILD=1 to rebuild anyway.
if [ -f "$ROOT/packages/twenty-server/src/front/index.html" ] && [ "${FORCE_FRONTEND_REBUILD:-0}" != "1" ]; then
  echo "==> twenty-server/src/front already populated — skipping frontend rebuild"
  echo "    (set FORCE_FRONTEND_REBUILD=1 to rebuild)"
  exit 0
fi

echo "==> twenty-shared .d.ts (tsc declaration-only, --noCheck)"
# --noCheck emits .d.ts without re-running type checks against the source.
# Twenty's CI typechecks twenty-shared separately; we only need the declaration
# files so twenty-ui's vite-plugin-dts can resolve types at its build time.
# Avoids transient narrowing differences across TS minor versions (e.g.
# Deno Deploy's build env resolves class-validator typings without a type
# predicate on `isDefined`, which made tsc 2026-vintage flag two real
# `number | null | undefined` callsites in resolveRelativeDateFilter).
( cd "$ROOT/packages/twenty-shared" && \
  "$TSC" -p tsconfig.lib.json --declaration --emitDeclarationOnly --noCheck \
         --noEmit false --outDir dist --rootDir src )

echo "==> twenty-front-component-renderer (vite + tsc --noCheck for .d.ts)"
# Workspace package twenty-front depends on at build time. nx-cached locally
# (so this used to be a no-op), but the Deno Deploy clone starts without any
# dist/ so the symlink in node_modules has no entry to resolve.
( cd "$ROOT/packages/twenty-front-component-renderer" && \
  "$VITE" build -c vite.config.ts && \
  "$TSC" -p tsconfig.lib.json --declaration --emitDeclarationOnly --noCheck \
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
