"""
==============================================================================
  TASK 46: Docker (Containerization)
==============================================================================

REAL-WORLD CONTEXT:
"Works on my machine" is the #1 deployment problem. Docker solves it:
  - Package your app + ALL dependencies into one container
  - Runs identically on: your laptop, CI server, production server
  - No "install Python 3.11, then pip install..." on every server

SCENARIO:
  46.1 — Dockerize Flask: Create Dockerfile, build image, run container.
  46.2 — Docker Compose: Flask + PostgreSQL + Redis in one command.
  46.3 — Multi-stage Build: Smaller production images (no dev dependencies).

WHY EVERY COMPANY USES DOCKER:
  - Consistent environments (dev = staging = production)
  - Easy scaling (run 10 copies of your container)
  - Isolation (one app can't break another)
  - Fast deployment (push image, pull image, done)

EXPECTED BEHAVIOR:
  docker-compose up → Flask app + PostgreSQL + Redis all running
  curl localhost:5000/health → {"status": "ok", "db": "connected"}
"""

# CHALLENGE 46.1 -- Dockerize a Flask App
Create a Dockerfile:

  FROM python:3.11-slim
  WORKDIR /app
  COPY requirements.txt .
  RUN pip install --no-cache-dir -r requirements.txt
  COPY . .
  EXPOSE 5000
  CMD ["python", "app.py"]

Build & run:
  docker build -t my-flask-app .
  docker run -p 5000:5000 my-flask-app

CHALLENGE 46.2 -- Docker Compose with Database
Create docker-compose.yml for Flask + PostgreSQL:

  version: '3.8'
  services:
    web:
      build: .
      ports:
        - "5000:5000"
      environment:
        - DATABASE_URL=postgresql://user:pass@db:5432/myapp
      depends_on:
        - db
    db:
      image: postgres:15
      environment:
        - POSTGRES_USER=user
        - POSTGRES_PASSWORD=pass
        - POSTGRES_DB=myapp
      volumes:
        - pgdata:/var/lib/postgresql/data

  volumes:
    pgdata:

CHALLENGE 46.3 -- Multi-Service Stack
Add Redis and Celery worker to the compose file:
  - Flask web app
  - PostgreSQL database
  - Redis (message broker)
  - Celery worker
  - Celery beat (scheduler)

CHALLENGE 46.4 -- Production Docker Setup
- Use multi-stage builds to reduce image size
- Use gunicorn as WSGI server (not Flask's dev server)
- Add health checks
- Use .dockerignore to exclude unnecessary files
- Set proper security (non-root user, read-only filesystem)
"""

"""
[ ] Flask app runs in Docker
[ ] docker-compose up starts app + database
[ ] Data persists in volumes
[ ] Multi-service stack works
[ ] Production Dockerfile uses best practices
"""
