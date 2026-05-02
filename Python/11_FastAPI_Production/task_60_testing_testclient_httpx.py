"""
==============================================================================
  TASK 60: Testing FastAPI (TestClient + Dependency Override)
==============================================================================

REAL-WORLD CONTEXT:
FastAPI's TestClient lets you test endpoints WITHOUT running a real server.
Dependency overrides let you swap real services for fakes in tests:
  - Real DB → in-memory DB (fast, isolated)
  - Real email service → mock (don't send real emails in tests)
  - Real auth → fake user (test protected endpoints easily)

SCENARIO: Test the greeting endpoint:
  - Normal test: call endpoint, verify response
  - Override test: swap GreetingService for a custom one
  - Verify: your code uses the injected dependency correctly

WHY DEPENDENCY OVERRIDES MATTER:
  Without them: tests call real APIs, real databases, send real emails.
  With them: tests are fast, isolated, deterministic, free.

EXPECTED BEHAVIOR:
  test_hello_real_service: GET /hello/Alice → 200 {"message": "Hello Alice"}
  test_hello_custom_service: override with FormalGreeter → "Good day, Alice"
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
