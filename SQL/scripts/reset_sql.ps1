$ErrorActionPreference = "Stop"

$SqlRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$ComposeFile = Join-Path $SqlRoot "docker-compose.yml"

& (Join-Path $PSScriptRoot "start_sql.ps1")
docker compose -f $ComposeFile exec -T postgres psql -U learner -d sql_mastery_lab -v ON_ERROR_STOP=1 -f /docker-entrypoint-initdb.d/01_create_schema.sql
if ($LASTEXITCODE -ne 0) {
    throw "Schema reset failed."
}

docker compose -f $ComposeFile exec -T postgres psql -U learner -d sql_mastery_lab -v ON_ERROR_STOP=1 -f /docker-entrypoint-initdb.d/02_seed_data.sql
if ($LASTEXITCODE -ne 0) {
    throw "Seed data load failed."
}

Write-Host "sql_mastery schema reset and seed data loaded."
