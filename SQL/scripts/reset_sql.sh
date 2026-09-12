#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SQL_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
COMPOSE_FILE="$SQL_ROOT/docker-compose.yml"

"$SCRIPT_DIR/start_sql.sh"

docker compose -f "$COMPOSE_FILE" exec -T postgres psql -U learner -d sql_mastery_lab -v ON_ERROR_STOP=1 -f /docker-entrypoint-initdb.d/01_create_schema.sql
docker compose -f "$COMPOSE_FILE" exec -T postgres psql -U learner -d sql_mastery_lab -v ON_ERROR_STOP=1 -f /docker-entrypoint-initdb.d/02_seed_data.sql

echo "sql_mastery_lab schema reset and seed data loaded."
