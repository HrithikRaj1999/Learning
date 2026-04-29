"""
================================================================
   TASK 45: Celery -- Background Tasks             ****    
================================================================

SETUP: pip install celery redis
       (Also need Redis running: download from redis.io or use Docker)
CONCEPTS: task queues, workers, periodic tasks, result backends

INSTRUCTIONS:
Long-running tasks (sending emails, processing images, generating reports)
should run in the background. Celery is the industry standard.
"""

# =========== CHALLENGES ===========

"""
CHALLENGE 45.1 -- Basic Celery Setup
Create a celery app and define tasks:

  # celery_app.py
  from celery import Celery

  app = Celery('tasks', broker='redis://localhost:6379/0', backend='redis://localhost:6379/0')

  @app.task
  def add(x, y):
      return x + y

  @app.task
  def send_email(to, subject, body):
      import time
      time.sleep(3)  # Simulate sending
      return f"Email sent to {to}"

Run worker: celery -A celery_app worker --loglevel=info
Test: result = add.delay(4, 6); result.get(timeout=10)


CHALLENGE 45.2 -- Integrate with Flask
Create a Flask app that offloads work to Celery:
- POST /api/reports -> starts a report generation task
- GET /api/reports/<task_id> -> check task status
- Return: {"task_id": "abc", "status": "PENDING|SUCCESS|FAILURE", "result": ...}


CHALLENGE 45.3 -- Periodic Tasks
Set up Celery Beat for scheduled tasks:
- Clean up expired sessions every hour
- Send daily email digest
- Generate weekly analytics report

  app.conf.beat_schedule = {
      'cleanup-every-hour': {
          'task': 'tasks.cleanup_sessions',
          'schedule': 3600.0,
      },
  }


CHALLENGE 45.4 -- Error Handling & Retries
Configure tasks to:
- Retry on failure (max 3 times, with exponential backoff)
- Send alert on final failure
- Log all task results

  @app.task(bind=True, max_retries=3)
  def fetch_data(self, url):
      try:
          response = requests.get(url)
          return response.json()
      except requests.RequestException as exc:
          raise self.retry(exc=exc, countdown=2**self.request.retries)
"""
