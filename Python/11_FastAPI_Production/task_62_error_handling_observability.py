"""
================================================================
   TASK 62: Error Handling, Logging, Observability   ****
================================================================

Goal:
- Return stable error shapes.
- Add request ids.
- Use structured logs.
- Avoid leaking secrets.
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
    pass  # YOUR CODE HERE


@app.exception_handler(DomainError)
async def domain_error_handler(request: Request, exc: DomainError):
    return JSONResponse(
        status_code=400,
        content=ErrorResponse(code=exc.code, message=exc.message).model_dump(),
    )


@app.get("/explode")
def explode() -> None:
    raise DomainError("demo_error", "This is a controlled domain error")


# Challenge:
# - Add structured logging for method, path, status, latency_ms, request_id.
# - Add an unhandled exception handler that hides internal details.
# - Add tests for the error contract.

