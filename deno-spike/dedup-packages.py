#!/usr/bin/env python3
# Deno installs peer-dependency VARIANTS of a package (e.g. @nestjs+core@11.1.16 and
# @nestjs+core@11.1.16_1) as separate module instances. For packages that keep global
# singleton state (reflect-metadata, typeorm/@nestjs/@ptc-org metadata storages), two
# instances split the registry -> "No metadata for X" / unresolved DI. This merges every
# same-version variant's package dir to one canonical instance. Run after deno install.
#
# We ALSO merge a small set of packages across DIFFERENT versions when those packages
# enforce same-realm checks at runtime (e.g. graphql's `instanceOf` throws
# "Cannot use GraphQLScalarType X from another module or realm"). For these,
# every version gets symlinked to the version twenty-server pins.
import os, re, shutil

# Paths only come from `os.listdir(DENO)` (a directory we own) and a static
# whitelist below — no untrusted input — but shutil.rmtree is the cleaner
# pattern for deleting a directory than shelling out to `rm -rf`.

DENO = 'node_modules/.deno'

# Packages that must be a single realm across the whole workspace, with the
# canonical version to keep. Add entries as new realm-check failures surface.
CROSS_VERSION_SINGLETONS = {
    'graphql': '16.8.1',  # twenty-server pin; twenty-front transitives drift to 16.14.1
}

groups = {}
for d in sorted(os.listdir(DENO)):
    if '@' not in d or not os.path.isdir(f'{DENO}/{d}'):
        continue
    base = re.sub(r'_\d+$', '', d)  # strip Deno's peer-variant suffix
    groups.setdefault(base, []).append(d)

merged = 0
for base, variants in groups.items():
    if len(variants) < 2:
        continue
    m = re.match(r'(.+)@[^@]+$', base)
    if not m:
        continue
    pkg = m.group(1).replace('+', '/')
    canonical = None
    for v in sorted(variants):
        p = f'{DENO}/{v}/node_modules/{pkg}'
        if os.path.isdir(p) and not os.path.islink(p):
            canonical = v
            break
    if not canonical:
        continue
    for v in variants:
        if v == canonical:
            continue
        p = f'{DENO}/{v}/node_modules/{pkg}'
        if not os.path.lexists(p):
            continue
        target = f'{DENO}/{canonical}/node_modules/{pkg}'
        rel = os.path.relpath(target, os.path.dirname(p))
        if os.path.islink(p):
            os.unlink(p)
        else:
            shutil.rmtree(p)
        os.symlink(rel, p)
        merged += 1

# Cross-version merge for known realm-sensitive packages.
cross_merged = 0
for pkg, want_ver in CROSS_VERSION_SINGLETONS.items():
    pkg_dir_name = pkg.replace('/', '+')
    canonical_dir = f'{DENO}/{pkg_dir_name}@{want_ver}'
    canonical_pkg = f'{canonical_dir}/node_modules/{pkg}'
    if not os.path.isdir(canonical_pkg):
        print(f'  skip {pkg}: canonical {want_ver} not installed')
        continue
    pattern = re.compile(rf'^{re.escape(pkg_dir_name)}@(?!{re.escape(want_ver)}(?:_\d+)?$)[^@]+$')
    for d in sorted(os.listdir(DENO)):
        if not pattern.match(d):
            continue
        p = f'{DENO}/{d}/node_modules/{pkg}'
        if not os.path.lexists(p):
            continue
        rel = os.path.relpath(canonical_pkg, os.path.dirname(p))
        if os.path.islink(p):
            os.unlink(p)
        else:
            shutil.rmtree(p)
        os.symlink(rel, p)
        cross_merged += 1
        print(f'  cross-merged {d}/node_modules/{pkg} -> {want_ver}')

print(f"deduped {merged} same-version variant(s) + {cross_merged} cross-version singleton(s)")
