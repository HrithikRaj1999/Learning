$ErrorActionPreference = "Stop"

$SqlRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$ComposeFile = Join-Path $SqlRoot "docker-compose.yml"

& (Join-Path $PSScriptRoot "start_sql.ps1")
docker compose -f $ComposeFile exec postgres psql -U learner -d sql_mastery_lab
