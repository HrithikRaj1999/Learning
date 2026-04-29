param(
    [Parameter(Mandatory = $true)]
    [string]$Path
)

$ErrorActionPreference = "Stop"

$SqlRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$ComposeFile = Join-Path $SqlRoot "docker-compose.yml"
$TaskPath = Resolve-Path $Path

& (Join-Path $PSScriptRoot "start_sql.ps1")
Get-Content -LiteralPath $TaskPath | docker compose -f $ComposeFile exec -T postgres psql -U learner -d sql_mastery_lab -v ON_ERROR_STOP=1
if ($LASTEXITCODE -ne 0) {
    throw "Task file failed: $TaskPath"
}
