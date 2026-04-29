"""
================================================================
   TASK 46: Docker for Python Apps                ****    
================================================================

SETUP: Install Docker Desktop from docker.com
CONCEPTS: Dockerfile, docker-compose, images, containers, volumes, networks

INSTRUCTIONS:
Docker = your app runs the same everywhere. Essential for deployment.
"""

# =========== CHALLENGES ===========

"""
CHALLENGE 46.1 -- Dockerize a Flask App
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

# =========== VERIFICATION CHECKLIST ===========
"""
[ ] Flask app runs in Docker
[ ] docker-compose up starts app + database
[ ] Data persists in volumes
[ ] Multi-service stack works
[ ] Production Dockerfile uses best practices
"""
