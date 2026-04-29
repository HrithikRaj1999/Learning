"""
================================================================
   TASK 60: Testing with TestClient and HTTPX        ****
================================================================

Goal:
- Test FastAPI endpoints without a live server.
- Override dependencies.
- Separate unit tests from integration tests.

Run:
  pytest task_60_testing_testclient_httpx.py -v
"""

from fastapi import Depends, FastAPI
from fastapi.testclient import TestClient


app = FastAPI()


class GreetingService:
    def greet(self, name: str) -> str:
        return f"Hello {name}"


def get_greeting_service() -> GreetingService:
    return GreetingService()


@app.get("/hello/{name}")
def hello(name: str, service: GreetingService = Depends(get_greeting_service)) -> dict[str, str]:
    return {"message": service.greet(name)}


client = TestClient(app)


def test_hello_real_service():
    response = client.get("/hello/Alice")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello Alice"}


# ----- Challenge 60.1 -----
# Write a FakeGreetingService and override get_greeting_service.


# YOUR TESTS HERE


# ----- Challenge 60.2 -----
# Add tests for:
# - 422 validation errors
# - auth failures
# - DB dependency override
# - async client with httpx.AsyncClient

