"""
==============================================================================
  TASK 62: Error Handling & Observability
==============================================================================

REAL-WORLD CONTEXT:
Production APIs need:
  - Consistent error responses (every error has code, message, request_id)
  - Request tracking (request_id for debugging across microservices)
  - Domain errors mapped to proper HTTP status codes
  - No stack traces in responses (security!)

SCENARIO: Build production error handling:
  - X-Request-ID header propagated through all responses (for support tickets)
  - DomainError exceptions mapped to structured JSON responses
  - Unexpected errors caught by global handler (500 with request_id, no trace)
  - Middleware adds request_id to every response

WHAT'S WRONG (without this):
  Exception → 500 with Python traceback visible to users (security risk!)
  No request_id → user reports error → you can't find it in logs

EXPECTED BEHAVIOR:
  GET /explode → 400 {"code": "BOOM", "message": "Something broke", "request_id": "abc-123"}
  Any response has X-Request-ID header (for correlation)
"""

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel

app = FastAPI()

class ErrorResponse(BaseModel):
    code: str
    message: str
    request_id: str | None = None

class DomainError(Exception):
    def __init__(self, code: str, message: str) -> None:
        self.code = code
        self.message = message
        super().__init__(message)

@app.middleware("http")
async def add_request_id(request: Request, call_next):
    """Read X-Request-ID or generate one, then attach it to the response."""
    pass

@app.exception_handler(DomainError)
async def domain_error_handler(request: Request, exc: DomainError):
    return JSONResponse(
        status_code=400,
        content=ErrorResponse(code=exc.code, message=exc.message).model_dump(),
    )

@app.get("/explode")
def explode() -> None:
    raise DomainError("demo_error", "This is a controlled domain error")
