#!/usr/bin/env bash
set -euo pipefail

# Apply SQL migrations in supabase/migrations in sorted order using psql
# Requires: SUPABASE_DB_URL environment variable (Postgres connection string)
# Example: export SUPABASE_DB_URL="postgres://user:pass@host:5432/dbname"

if [ -z "${SUPABASE_DB_URL:-}" ]; then
  echo "SUPABASE_DB_URL not set. Aborting."
  exit 2
fi

MIGRATIONS_DIR="$(pwd)/supabase/migrations"
if [ ! -d "$MIGRATIONS_DIR" ]; then
  echo "Migrations dir not found: $MIGRATIONS_DIR"
  exit 1
fi

for f in $(ls "$MIGRATIONS_DIR"/*.sql | sort); do
  echo "Applying migration: $f"
  PGPASSWORD="$(echo $SUPABASE_DB_URL | sed -n 's#.*:\/\/[^:]*:\([^@]*\)@.*#\1#p')" \
    psql "$SUPABASE_DB_URL" -f "$f"
done

echo "All migrations applied." 
