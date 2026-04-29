# Level 11: FastAPI Production

Goal: move from "I can write endpoints" to "I can design, test, secure, and deploy a production API."

## Setup

```bash
pip install "fastapi[standard]" pydantic-settings sqlalchemy alembic sqlmodel pytest httpx pytest-asyncio python-jose passlib[bcrypt] redis structlog
```

## Tasks

| # | Task | Difficulty | Status |
|---|------|------------|--------|
| 56 | FastAPI and Pydantic Basics | *** | [ ] |
| 57 | Dependency Injection and Settings | **** | [ ] |
| 58 | SQLModel/SQLAlchemy and Alembic | **** | [ ] |
| 59 | JWT Auth, RBAC, and API Security | ***** | [ ] |
| 60 | Testing with TestClient and HTTPX | **** | [ ] |
| 61 | Async Endpoints and Background Work | **** | [ ] |
| 62 | Error Handling, Logging, and Observability | **** | [ ] |
| 63 | Streaming Responses and WebSockets | **** | [ ] |
| 64 | Production Deployment Checklist | **** | [ ] |
| 65 | Capstone: Interview-Ready FastAPI Service | ***** | [ ] |

## Interview Bar

You are ready when you can:
- Explain sync vs async endpoints and when blocking code hurts.
- Use Pydantic models for request, response, and settings.
- Inject DB sessions, services, and current users with `Depends`.
- Write unit, integration, and API tests.
- Implement JWT auth, rate limits, CORS, and structured error handling.
- Discuss database indexes, migrations, transactions, and N+1 queries.

