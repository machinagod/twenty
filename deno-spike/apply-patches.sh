#!/usr/bin/env bash
# Applies Twenty's three Yarn `patch:` patches to the npm packages Deno has resolved
# into node_modules, so Deno (which has no Yarn `patch:` protocol) runs the patched
# code. Keep this as a BUILD STEP: run it after Deno has populated node_modules
# (`deno install`, or the first `deno run` with --node-modules-dir) and before the
# real run / deploy. Idempotent — re-running is a no-op once patched.
#
#   bash deno-spike/apply-patches.sh [--node-modules-dir <dir>]
#
# Why in-place over vendoring: keeping the packages as `npm:` specifiers preserves
# Deno's CJS→ESM named-export interop and automatic transitive-dep resolution.
# Importing a vendored local CJS file loses both. We only overwrite the patched files.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PATCHES="$ROOT/packages/twenty-server/patches"
NM="${2:-$ROOT/deno-spike/node_modules}/.deno"

apply_one() {
  local path_glob="$1" patch="$2"
  local pkgdir
  pkgdir="$(find "$NM" -maxdepth 4 -type d -path "$path_glob" 2>/dev/null | head -1)"
  if [ -z "$pkgdir" ]; then
    echo "SKIP (not resolved yet): $path_glob"
    return 0
  fi
  # Reverse dry-run succeeds only if the patch is already applied -> no-op.
  if patch -p1 -R -s -f --dry-run -d "$pkgdir" < "$patch" >/dev/null 2>&1; then
    echo "already patched: ${pkgdir#$NM/}"
    return 0
  fi
  patch -p1 -s -d "$pkgdir" < "$patch"
  echo "patched:         ${pkgdir#$NM/}"
}

apply_one "*@nestjs+graphql@*/node_modules/@nestjs/graphql" \
  "$PATCHES/@nestjs+graphql+12.1.1.patch"
apply_one "*@ptc-org+nestjs-query-graphql@*/node_modules/@ptc-org/nestjs-query-graphql" \
  "$PATCHES/@ptc-org+nestjs-query-graphql+4.2.0.patch"
apply_one "*typeorm@*/node_modules/typeorm" \
  "$PATCHES/typeorm+0.3.20.patch"

echo "done"
