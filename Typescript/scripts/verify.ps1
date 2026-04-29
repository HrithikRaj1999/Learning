$ErrorActionPreference = "Stop"

$TypeScriptRoot = Resolve-Path (Join-Path $PSScriptRoot "..")

Push-Location $TypeScriptRoot
try {
    npm run typecheck
    npm test
}
finally {
    Pop-Location
}
