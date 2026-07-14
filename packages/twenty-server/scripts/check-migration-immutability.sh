#!/usr/bin/env bash
# Guards against EDITING or DELETING an already-committed migration.
#
# Editing a migration that has already run somewhere is the root cause of the
# worst kind of schema drift: the file is marked applied, so no database ever
# re-runs it, and every existing DB is permanently missing whatever the edit
# added. (This is exactly how `setupMetadataTables` diverged.) Migrations must
# be append-only: to change the schema, add a NEW migration.
#
# This locks a sha256 of every timestamped migration file. Adding new migration
# files is allowed; changing or removing an existing one fails.
#
# Usage:
#   scripts/check-migration-immutability.sh            # verify (CI)
#   scripts/check-migration-immutability.sh --update   # re-lock after adding NEW migrations
#
# Exit code: 0 = ok, 1 = an existing migration was modified/removed.
set -euo pipefail

SERVER_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOCK="$SERVER_DIR/src/database/migrations.lock"

# Timestamped migration files only (e.g. 1700140427984-setupMetadataTables.ts);
# non-timestamped helpers under */utils are mutable and excluded.
list_migrations() {
  find "$SERVER_DIR/src/database" -type f -name '*.ts' \
    -path '*/migrations/*' \
    | grep -E '/[0-9]{10,}-[^/]+\.ts$' \
    | sed "s#^$SERVER_DIR/##" \
    | sort
}

hash_all() {
  while IFS= read -r rel; do
    printf '%s  %s\n' "$(shasum -a 256 "$SERVER_DIR/$rel" | awk '{print $1}')" "$rel"
  done < <(list_migrations)
}

if [[ "${1:-}" == "--update" ]]; then
  hash_all > "$LOCK"
  echo "Re-locked $(wc -l < "$LOCK" | tr -d ' ') migrations → $LOCK"
  exit 0
fi

[[ -f "$LOCK" ]] || { echo "migration lock missing: $LOCK (run: $0 --update)"; exit 1; }

CURRENT="$(mktemp)"; trap 'rm -f "$CURRENT"' EXIT
hash_all > "$CURRENT"

# A locked file whose (hash, path) pair is no longer present = edited or removed.
violations="$(comm -23 <(sort "$LOCK") <(sort "$CURRENT") || true)"
# New files present but not locked yet (informational — allowed).
added="$(comm -13 <(awk '{print $2}' "$LOCK" | sort) <(awk '{print $2}' "$CURRENT" | sort) || true)"

status=0
if [[ -n "$violations" ]]; then
  status=1
  echo "✗ An already-committed migration was MODIFIED or REMOVED:"
  echo "$violations" | awk '{print "    "$2}' | sort -u | sed 's#^#  #'
  echo ""
  echo "  Migrations are append-only. Revert the edit and add a NEW migration for the change."
  echo "  (If this file was legitimately never applied anywhere, re-lock: $0 --update)"
fi
if [[ -n "$added" ]]; then
  echo "ℹ New migrations detected (allowed): $(echo "$added" | wc -l | tr -d ' '). Re-lock with: $0 --update"
fi
[[ $status -eq 0 && -z "$added" ]] && echo "✓ All committed migrations are unchanged."
exit $status
