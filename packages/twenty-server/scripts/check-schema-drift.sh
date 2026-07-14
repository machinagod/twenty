#!/usr/bin/env bash
# Detects when a live database's `core` schema has drifted from what the on-disk
# migrations produce (the committed reference manifest).
#
# This catches a class of drift the existing CI "pending migration" check does
# NOT: a DEPLOYED database whose schema no longer matches the migrations —
# because it was set up from an older/diverged branch, or hand-patched, or an
# already-applied migration was edited so the column never landed.
#
# Reference of truth: src/database/reference-schema.manifest.txt — a sorted
# "table|column|data_type" listing of the `core` schema, regenerated from a
# freshly-migrated database. Keep it current with:
#   scripts/check-schema-drift.sh --update <freshly-migrated-db-url>
#
# Usage:
#   scripts/check-schema-drift.sh [TARGET_DB_URL]      # defaults to $PG_DATABASE_URL
#   scripts/check-schema-drift.sh --update [DB_URL]    # rewrite the reference manifest
#
# Exit code: 0 = in sync, 1 = drift detected, 2 = usage/connection error.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MANIFEST="$SCRIPT_DIR/../src/database/reference-schema.manifest.txt"
SCHEMA="core"

query='select table_name, column_name, data_type from information_schema.columns'
query+=" where table_schema='$SCHEMA' order by 1,2;"

dump_manifest() { psql "$1" -tAF'|' -c "$query" 2>/dev/null | sed 's/ *$//'; }

if [[ "${1:-}" == "--update" ]]; then
  DB_URL="${2:-${PG_DATABASE_URL:-}}"
  [[ -z "$DB_URL" ]] && { echo "usage: $0 --update <db-url>"; exit 2; }
  dump_manifest "$DB_URL" > "$MANIFEST"
  echo "Updated reference manifest ($(wc -l < "$MANIFEST" | tr -d ' ') columns) from a migrated DB."
  exit 0
fi

DB_URL="${1:-${PG_DATABASE_URL:-}}"
[[ -z "$DB_URL" ]] && { echo "usage: $0 [target-db-url]  (or set PG_DATABASE_URL)"; exit 2; }
[[ -f "$MANIFEST" ]] || { echo "reference manifest missing: $MANIFEST"; exit 2; }

TARGET="$(mktemp)"; trap 'rm -f "$TARGET"' EXIT
dump_manifest "$DB_URL" > "$TARGET"
[[ -s "$TARGET" ]] || { echo "Could not read schema '$SCHEMA' from target DB (connection/permission?)."; exit 2; }

missing="$(comm -23 <(sort -u "$MANIFEST") <(sort -u "$TARGET") || true)"  # in reference, not in DB
extra="$(comm -13 <(sort -u "$MANIFEST") <(sort -u "$TARGET") || true)"    # in DB, not in reference

if [[ -z "$missing" && -z "$extra" ]]; then
  echo "✓ No schema drift: target '$SCHEMA' matches the migrations reference."
  exit 0
fi

echo "✗ Schema drift detected in '$SCHEMA':"
if [[ -n "$missing" ]]; then
  echo ""
  echo "  MISSING in target (migrations produce these, DB lacks them → DB is behind/broken):"
  echo "$missing" | sed 's/^/    - /'
fi
if [[ -n "$extra" ]]; then
  echo ""
  echo "  EXTRA in target (DB has these, migrations do not → DB is ahead/diverged):"
  echo "$extra" | sed 's/^/    + /'
fi
echo ""
echo "  If the DB is behind: apply the pending migrations. If diverged: the DB and the"
echo "  checked-out branch are different Twenty versions — align them (see docs/SCHEMA_DRIFT.md)."
exit 1
