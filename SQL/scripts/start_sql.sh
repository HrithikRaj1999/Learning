#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SQL_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
COMPOSE_FILE="$SQL_ROOT/docker-compose.yml"

check_docker_ready() {
    docker info &>/dev/null
}

if ! check_docker_ready; then
    echo "Docker engine is not running. Please start Docker and try again."
    exit 1
fi

docker compose -f "$COMPOSE_FILE" up -d --wait 2>/dev/null || {
    echo "Waiting for PostgreSQL to become healthy..."
    for i in $(seq 1 40); do
        status=$(docker inspect --format '{{.State.Health.Status}}' sql-mastery-postgres 2>/dev/null || echo "")
        if [ "$status" = "healthy" ]; then
            echo "PostgreSQL is ready."
            echo "Connection: host=localhost port=5433 db=sql_mastery_lab user=learner password=learner_pass"
            exit 0
        fi
        sleep 2
    done

    docker compose -f "$COMPOSE_FILE" ps
    echo "ERROR: PostgreSQL did not become healthy in time. Check logs with: docker logs sql-mastery-postgres"
    exit 1
}

echo "PostgreSQL is ready."
echo "Connection: host=localhost port=5433 db=sql_mastery_lab user=learner password=learner_pass"
