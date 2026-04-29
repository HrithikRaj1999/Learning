$ErrorActionPreference = "Stop"

$SqlRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$ComposeFile = Join-Path $SqlRoot "docker-compose.yml"

function Test-DockerReady {
    docker info *> $null
    return $LASTEXITCODE -eq 0
}

if (-not (Test-DockerReady)) {
    $DockerDesktop = Join-Path $env:ProgramFiles "Docker\Docker\Docker Desktop.exe"
    if (Test-Path $DockerDesktop) {
        Write-Host "Docker engine is not running. Starting Docker Desktop..."
        Start-Process -FilePath $DockerDesktop -WindowStyle Hidden | Out-Null

        for ($i = 1; $i -le 90; $i++) {
            if (Test-DockerReady) {
                Write-Host "Docker engine is ready."
                break
            }
            Start-Sleep -Seconds 2
        }
    }
}

if (-not (Test-DockerReady)) {
    throw "Docker is installed, but the Docker engine is not running. Open Docker Desktop, wait until it says running, then run SQL/scripts/start_sql.ps1 again."
}

docker compose -f $ComposeFile up -d
if ($LASTEXITCODE -ne 0) {
    throw "Docker Compose failed to start PostgreSQL."
}

Write-Host "Waiting for PostgreSQL to become healthy..."
for ($i = 1; $i -le 40; $i++) {
    $status = docker inspect --format "{{.State.Health.Status}}" sql-mastery-postgres 2>$null
    if ($status -eq "healthy") {
        Write-Host "PostgreSQL is ready."
        Write-Host "Connection: host=localhost port=5433 db=sql_mastery_lab user=learner password=learner_pass"
        exit 0
    }
    Start-Sleep -Seconds 2
}

docker compose -f $ComposeFile ps
throw "PostgreSQL did not become healthy in time. Check logs with: docker logs sql-mastery-postgres"
