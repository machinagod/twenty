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
            # Map to the node_modules FILE PATH (same package instance as the bare
            # `import 'pkg'`), NOT an `npm:` specifier — npm: spins up a SEPARATE
            # instance, splitting singleton state (TypeMetadataStorage, typeorm/Nest
            # metadata storages) and causing duplicate GraphQL types / lost metadata.
            deep_map[spec] = f'./{pdir}/{c}'; break

imports = {
  'react': 'npm:react@18.3.1',
  'react/jsx-runtime': 'npm:react@18.3.1/jsx-runtime',
  '@lingui/message-utils/compileMessage': 'npm:@lingui/message-utils@5.9.5/compileMessage',
  '@lingui/core': 'npm:@lingui/core@5.9.5',
  '@lingui/core/macro': './deno-spike/shims/lingui-macro.ts',
  '@lingui/react/macro': './deno-spike/shims/lingui-macro.ts',
  'esbuild': 'npm:esbuild@0.25.12',
  'graphql-type-json': './deno-spike/shims/graphql-type-json.ts',
  '@tiptap/core': 'npm:@tiptap/core@3.26.0',
  'p-limit': 'npm:p-limit@2.3.0',
  'qs': 'npm:qs@6.14.2',
}
imports = {**deep_map, **imports}  # manual mappings win (e.g. lingui macro shim)
# Tasks define the end-to-end Deno-only workflow. Each shells out to either an
# in-repo script or a node-tool binary from node_modules/.bin — no yarn, no nx.
tasks = {
  'prepare': 'bash deno-spike/prepare-deno-deps.sh',
  'apply-patches': 'bash deno-spike/apply-patches.sh ./ node_modules',
  'build:front': 'bash deno-spike/build-frontend.sh',
  # Full one-shot bootstrap: install + scaffold + patch + build the frontend.
  # Named `build:all` (not `build`) to avoid being shadowed by twenty-front's
  # own `build` script in its package.json, which Deno auto-exposes as a task.
  'build:all': 'deno task prepare && deno task apply-patches && deno task build:front',
  # DB setup + migrations (read PG_DATABASE_URL etc. from the environment).
  'db:setup': 'cd packages/twenty-server && deno run -A --sloppy-imports boot-setup-db.ts',
  'db:migrate': 'cd packages/twenty-server && deno run -A --sloppy-imports boot-migrate.ts',
  # The unified API + Deno.cron entrypoint.
  'serve': 'cd packages/twenty-server && deno run -A --unstable-cron --sloppy-imports boot-serve.ts',
}
root = {
  'nodeModulesDir': 'auto',
  'workspace': ['./packages/twenty-server', './packages/twenty-shared',
                './packages/twenty-emails', './packages/twenty-client-sdk',
                './packages/twenty-front', './packages/twenty-ui',
                './packages/twenty-front-component-renderer'],
  # sloppy-imports applies to every entrypoint Deno resolves under this project.
  # Member deno.json may only narrow flags, not introduce ones the root rejects,
  # so the runtime needs them declared here too.
  'unstable': ['sloppy-imports', 'cron'],
  'tasks': tasks,
  'imports': imports,
}
json.dump(root, open('deno.json', 'w'), indent=2)

builtins = ['assert','assert/strict','buffer','child_process','cluster','console','constants','crypto','dgram','diagnostics_channel','dns','dns/promises','domain','events','fs','fs/promises','http','http2','https','inspector','inspector/promises','module','net','os','path','path/posix','path/win32','perf_hooks','process','punycode','querystring','readline','readline/promises','repl','stream','stream/consumers','stream/promises','stream/web','string_decoder','sys','timers','timers/promises','tls','trace_events','tty','url','util','util/types','v8','vm','wasi','worker_threads','zlib','async_hooks']
member = {'compilerOptions': {'experimentalDecorators': True, 'emitDecoratorMetadata': True},
          # sloppy-imports: twenty-server's source uses extensionless ts imports
          # like `from 'src/app.module'` everywhere; on the local CLI we pass
          # --sloppy-imports, but Deno Deploy runs the entrypoint without it.
          # Declaring it here applies it to every run of the member workspace.
          # cron: required by Deno.cron in boot-serve.ts under local dev
          # (Deploy v2 has cron stable, but declaring it is harmless).
          'unstable': ['sloppy-imports', 'cron'],
          'imports': {'src/': './src/', **{b: f'node:{b}' for b in builtins}}}
json.dump(member, open('packages/twenty-server/deno.json', 'w'), indent=2)
print(f"wrote deno.json (root: {len(imports)} imports incl {len(deep_map)} deep) + member")
