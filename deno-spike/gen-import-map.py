#!/usr/bin/env python3
# Generates the root + member deno.json for running twenty-server's source on Deno.
# Run AFTER prepare-deno-deps.sh (needs node_modules to auto-resolve deep subpaths).
#
# Root deno.json: workspace + nodeModulesDir + import map for (a) deps the source
# imports but Deno can't resolve from a package scope (react/esbuild/... — undeclared
# or externalized-from-built-workspace-packages), (b) the lingui macro runtime shim
# (pure-Deno replacement for the build-time macro), (c) auto-discovered deep npm
# subpaths that lack a file extension (typeorm/graphql/@nestjs internals).
# Member deno.json: the `src/` path alias + node-builtin specifiers mapped to `node:`.
import json, re, glob, os

NM = 'node_modules/.deno'

def find_pkg_dir(pkg):
    hits = sorted(glob.glob(f'{NM}/{pkg.replace("/", "+")}@*/node_modules/{pkg}'))
    if not hits: return None, None
    d = hits[0]
    m = re.search(rf'{re.escape(pkg.replace("/", "+"))}@([^/]+)/', d)
    return d, (m.group(1) if m else None)

def pkgname(spec):
    p = spec.split('/'); return '/'.join(p[:2]) if spec.startswith('@') else p[0]

deep = set()
for f in glob.glob('packages/twenty-server/src/**/*.ts', recursive=True):
    if f.endswith('.spec.ts') or '__tests__' in f: continue
    try: txt = open(f).read()
    except: continue
    for m in re.finditer(r"""from\s*['"]([^'".][^'"]*)['"]""", txt):
        s = m.group(1)
        if s.startswith('node:') or s.startswith('src/') or s.startswith('twenty-'): continue
        if '/' in s and not (s.startswith('@') and s.count('/') == 1):
            deep.add(s)

deep_map = {}
for spec in sorted(deep):
    name = pkgname(spec); pdir, ver = find_pkg_dir(name)
    if not pdir or not ver: continue
    rel = spec[len(name)+1:]
    for c in (f'{rel}.mjs', f'{rel}.js', f'{rel}/index.mjs', f'{rel}/index.js'):
        if os.path.isfile(f'{pdir}/{c}'):
            deep_map[spec] = f'npm:{name}@{ver}/{c}'; break

imports = {
  'react': 'npm:react@18.3.1',
  'react/jsx-runtime': 'npm:react@18.3.1/jsx-runtime',
  '@lingui/message-utils/compileMessage': 'npm:@lingui/message-utils@5.9.5/compileMessage',
  '@lingui/core': 'npm:@lingui/core@5.9.5',
  '@lingui/core/macro': './deno-spike/shims/lingui-macro.ts',
  '@lingui/react/macro': './deno-spike/shims/lingui-macro.ts',
  'esbuild': 'npm:esbuild@0.25.12',
  '@tiptap/core': 'npm:@tiptap/core@3.26.0',
  'p-limit': 'npm:p-limit@2.3.0',
  'qs': 'npm:qs@6.14.2',
}
imports = {**deep_map, **imports}  # manual mappings win (e.g. lingui macro shim)
root = {
  'nodeModulesDir': 'auto',
  'workspace': ['./packages/twenty-server', './packages/twenty-shared',
                './packages/twenty-emails', './packages/twenty-client-sdk'],
  'imports': imports,
}
json.dump(root, open('deno.json', 'w'), indent=2)

builtins = ['assert','assert/strict','buffer','child_process','cluster','console','constants','crypto','dgram','diagnostics_channel','dns','dns/promises','domain','events','fs','fs/promises','http','http2','https','inspector','inspector/promises','module','net','os','path','path/posix','path/win32','perf_hooks','process','punycode','querystring','readline','readline/promises','repl','stream','stream/consumers','stream/promises','stream/web','string_decoder','sys','timers','timers/promises','tls','trace_events','tty','url','util','util/types','v8','vm','wasi','worker_threads','zlib','async_hooks']
member = {'compilerOptions': {'experimentalDecorators': True, 'emitDecoratorMetadata': True},
          'imports': {'src/': './src/', **{b: f'node:{b}' for b in builtins}}}
json.dump(member, open('packages/twenty-server/deno.json', 'w'), indent=2)
print(f"wrote deno.json (root: {len(imports)} imports incl {len(deep_map)} deep) + member")
