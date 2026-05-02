"""
==============================================================================
  TASK 64: Production Deployment
==============================================================================

REAL-WORLD CONTEXT:
Your FastAPI app works locally. Now deploy it so the world can use it.
Production deployment requires:
  - Dockerfile (containerized, consistent environment)
  - docker-compose.yml (app + database + redis in one command)
  - Gunicorn/Uvicorn config (multiple workers for handling load)
  - Health check endpoint (load balancer needs to know you're alive)
  - Environment variables (secrets NOT in code)
  - CORS configuration (frontend on different domain)

SCENARIO: Deploy your FastAPI capstone project:
  1. Create Dockerfile (multi-stage build for smaller image)
  2. Create docker-compose.yml (FastAPI + PostgreSQL + Redis)
  3. Configure Uvicorn workers (1 worker per CPU core)
  4. Add /health endpoint (checks DB and Redis connectivity)
  5. Set up CORS for your frontend domain
  6. Configure logging for production (JSON format, no debug)

EXPECTED BEHAVIOR:
  docker-compose up → app running on port 8000
  curl localhost:8000/health → {"status": "ok", "db": "connected", "redis": "connected"}
  curl localhost:8000/docs → Swagger UI (API documentation)
"""

# This task is file-based. Create deployment files next to your FastAPI capstone.
# Files to create: Dockerfile, docker-compose.yml, gunicorn.conf.py, .env.example
