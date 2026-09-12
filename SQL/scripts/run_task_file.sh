#!/usr/bin/env bash
set -euo pipefail

if [ $# -eq 0 ]; then
    echo "Usage: $0 <sql-file>"
    exit 1
fi

TASK_FILE="$1"

if [ ! -f "$TASK_FILE" ]; then
    echo "ERROR: File not found: $TASK_FILE"
    exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SQL_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
COMPOSE_FILE="$SQL_ROOT/docker-compose.yml"

"$SCRIPT_DIR/start_sql.sh"
cat "$TASK_FILE" | docker compose -f "$COMPOSE_FILE" exec -T postgres psql -U learner -d sql_mastery_lab -v ON_ERROR_STOP=1
