#!/usr/bin/env python3
# Deno installs peer-dependency VARIANTS of a package (e.g. @nestjs+core@11.1.16 and
# @nestjs+core@11.1.16_1) as separate module instances. For packages that keep global
# singleton state (reflect-metadata, typeorm/@nestjs/@ptc-org metadata storages), two
# instances split the registry -> "No metadata for X" / unresolved DI. This merges every
# same-version variant's package dir to one canonical instance. Run after deno install.
import os, re

DENO = 'node_modules/.deno'
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
    # canonical = first variant whose package dir is a real directory (not a symlink)
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
        os.system(f'rm -rf "{p}"')
        os.symlink(rel, p)
        merged += 1

print(f"deduped {merged} package variant(s)")
