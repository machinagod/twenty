#!/usr/bin/env bash
# Prepares the repo so `deno install` can resolve twenty-server's full npm dependency
# graph (the foundation for booting the real server on Deno). Two transforms are
# needed because Deno doesn't speak Yarn's dialect:
#
#   1. Scope `workspaces` to the server-needed packages. Deno walks every workspace
#      member, and twenty-front pulls `linkify-react@4.3.3`, whose published manifest
#      has a malformed requirement (`linkifyjs: "==4.3.3"`) that Deno's semver parser
#      rejects, aborting the whole install. The server doesn't use twenty-front.
#   2. Rewrite Yarn `patch:NAME@VER#file` specs to the exact `VER`. Deno can't parse
#      the `patch:` protocol; left as-is it resolves the wrong versions. After install
#      we re-apply the patches with apply-patches.sh (which needs the exact versions).
#
# This MUTATES package.json + packages/twenty-server/package.json (backed up to
# /tmp). It intentionally leaves them transformed so `deno run`/deploy also resolve
# the scoped graph — that is "deno build mode". Revert with:
#   git checkout package.json packages/twenty-server/package.json
#
# Known limitation: Deno ignores yarn.lock, so `^x-dev` ranges drift (e.g.
# @typescript/native-preview / tsgo resolves newer and breaks the nx BUILD toolchain).
# That only affects nx-based typecheck/test, not running the app — pin exact versions
# if you need the nx toolchain under Deno.
#
#   bash deno-spike/prepare-deno-deps.sh && bash deno-spike/apply-patches.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

cp package.json /tmp/twenty-root-package.json.deno-bak
cp packages/twenty-server/package.json /tmp/twenty-server-package.json.deno-bak
echo "backed up package.json files to /tmp/*.deno-bak"

python3 - <<'PY'
import json, re

SERVER_WORKSPACES = [
    'packages/twenty-server',
    'packages/twenty-shared',
    'packages/twenty-emails',
    'packages/twenty-client-sdk',
]

def depatch(deps):
    for name, spec in list(deps.items()):
        if isinstance(spec, str) and spec.startswith('patch:'):
            match = re.search(r'@([0-9][^@#]*)#', spec)
            if match:
                deps[name] = match.group(1)
                print(f'  de-patched {name}: -> {match.group(1)}')

root = json.load(open('package.json'))
root['workspaces'] = {'packages': SERVER_WORKSPACES}
for section in ('dependencies', 'devDependencies'):
    depatch(root.get(section, {}))
json.dump(root, open('package.json', 'w'), indent=2)
print('scoped workspaces ->', SERVER_WORKSPACES)

server = json.load(open('packages/twenty-server/package.json'))
for section in ('dependencies', 'devDependencies'):
    depatch(server.get(section, {}))
json.dump(server, open('packages/twenty-server/package.json', 'w'), indent=2)
PY

echo "running deno install ..."
deno install

echo "done. Next: bash deno-spike/apply-patches.sh"
