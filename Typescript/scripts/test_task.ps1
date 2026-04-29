param(
    [Parameter(Mandatory = $true)]
    [string]$Path
)

$ErrorActionPreference = "Stop"

$TypeScriptRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$TestPath = Resolve-Path $Path

Push-Location $TypeScriptRoot
try {
    npm exec vitest -- --run $TestPath
}
finally {
    Pop-Location
}
