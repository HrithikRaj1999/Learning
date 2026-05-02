"""
==============================================================================
  TASK 61: Async Endpoints & Background Tasks
==============================================================================

REAL-WORLD CONTEXT:
Some work shouldn't block the response:
  - User signs up → respond "Success!" immediately → send welcome email in background
  - Dashboard request → fetch 5 microservices concurrently (not sequentially)

Async endpoints handle I/O without blocking other requests.
BackgroundTasks run AFTER the response is sent.

SCENARIO:
  GET /profiles?ids=1,2,3 → fetch all 3 profiles CONCURRENTLY (not 1-by-1)
  POST /signup {email} → respond immediately + schedule welcome email in background

WHAT'S WRONG (sync approach):
  Fetch profile 1 (200ms) → fetch profile 2 (200ms) → fetch profile 3 (200ms) = 600ms
  With async: all 3 run simultaneously = 200ms total

EXPECTED BEHAVIOR:
  GET /profiles?ids=1,2,3 → 200 [{"id":1,...},{"id":2,...},{"id":3,...}] (fast!)
  POST /signup → 200 {"status": "registered"} (email sent in background after response)
"""

import asyncio
import time

from fastapi import BackgroundTasks, FastAPI

app = FastAPI()
SENT_EMAILS: list[str] = []

async def fetch_profile(user_id: int) -> dict[str, int | str]:
    await asyncio.sleep(0.2)
    return {"id": user_id, "name": f"user-{user_id}"}

@app.get("/profiles")
async def profiles(ids: str) -> list[dict[str, int | str]]:
    """Fetch comma-separated ids concurrently."""
    pass

def send_email(address: str, subject: str) -> None:
    time.sleep(0.1)
    SENT_EMAILS.append(f"{address}:{subject}")

@app.post("/signup")
def signup(email: str, background_tasks: BackgroundTasks) -> dict[str, str]:
    """Schedule a welcome email after the response is returned."""
    pass
