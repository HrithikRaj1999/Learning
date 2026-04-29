"""
================================================================
   TASK 61: Async Endpoints and Background Work      ****
================================================================

Goal:
- Know when to use async def.
- Avoid blocking the event loop.
- Use BackgroundTasks for small post-response work.
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
    pass  # YOUR CODE HERE


def send_email(address: str, subject: str) -> None:
    time.sleep(0.1)
    SENT_EMAILS.append(f"{address}:{subject}")


@app.post("/signup")
def signup(email: str, background_tasks: BackgroundTasks) -> dict[str, str]:
    """Schedule a welcome email after the response is returned."""
    pass  # YOUR CODE HERE


# Interview drills:
# - Why is time.sleep bad in async endpoints?
# - When should BackgroundTasks become Celery/RQ instead?
# - How would you limit concurrency for an external API?

