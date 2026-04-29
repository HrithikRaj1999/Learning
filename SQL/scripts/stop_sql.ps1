$ErrorActionPreference = "Stop"

$SqlRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$ComposeFile = Join-Path $SqlRoot "docker-compose.yml"

docker compose -f $ComposeFile down
