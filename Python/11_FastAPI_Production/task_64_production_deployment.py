"""
================================================================
   TASK 64: Production Deployment Checklist          ****
================================================================

Create deployment files for a FastAPI service.

Deliverables:
- Dockerfile
- docker-compose.yml with app + Postgres + Redis
- .env.example
- health endpoint
- GitHub Actions workflow
- README with local and production commands

Dockerfile checklist:
- Use python slim image.
- Set PYTHONDONTWRITEBYTECODE=1 and PYTHONUNBUFFERED=1.
- Install dependencies before copying app code.
- Run as a non-root user.
- Use `fastapi run` or `uvicorn app.main:app`.

Runtime checklist:
- Secrets come from environment variables.
- CORS is explicit.
- Logs are structured.
- Migrations run as a release step.
- Health checks verify app and database.
- Timeouts and worker counts are documented.

Interview prompts:
- How many Uvicorn workers would you use and why?
- What is the difference between readiness and liveness?
- How do you roll back a bad migration?
- How do you handle graceful shutdown?
"""


if __name__ == "__main__":
    print("This task is file-based. Create deployment files next to your FastAPI capstone.")

