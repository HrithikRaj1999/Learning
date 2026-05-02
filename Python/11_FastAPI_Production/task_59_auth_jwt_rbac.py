"""
==============================================================================
  TASK 59: Authentication — JWT + RBAC (Role-Based Access Control)
==============================================================================

REAL-WORLD CONTEXT:
APIs need authentication (who are you?) and authorization (what can you do?).
JWT tokens are stateless auth — no server-side sessions needed:
  - User logs in → gets a signed JWT token
  - Token sent in every request header (Authorization: Bearer <token>)
  - Server verifies signature → knows who the user is
  - Roles in token determine permissions (admin, editor, viewer)

SCENARIO: Build a complete auth system:
  - POST /auth/register → create user with hashed password
  - POST /auth/token → verify password, return JWT
  - Protected endpoints require valid token
  - Admin-only endpoints check roles in token

SECURITY:
  - Passwords hashed with bcrypt (never stored plain)
  - JWT signed with secret key (tamper-proof)
  - Token expires after 30 minutes (limits damage if stolen)
  - Role checking prevents privilege escalation

EXPECTED BEHAVIOR:
  POST /auth/token {username, password} → 200 {"access_token": "eyJ..."}
  GET /users/me (with token) → 200 {"username": "alice", "roles": ["admin"]}
  GET /admin/users (viewer token) → 403 Forbidden
"""

from datetime import datetime, timedelta, timezone
from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel

SECRET_KEY = "replace-with-env-var"
ALGORITHM = "HS256"
ACCESS_TOKEN_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")
app = FastAPI()

class User(BaseModel):
    username: str
    password_hash: str
    roles: list[str] = []

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

USERS: dict[str, User] = {}

def hash_password(password: str) -> str:
    pass

def verify_password(password: str, password_hash: str) -> bool:
    pass

def create_access_token(subject: str, roles: list[str]) -> str:
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_MINUTES)
    payload = {"sub": subject, "roles": roles, "exp": expires_at}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]) -> User:
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not implemented")

def require_role(role: str):
    def dependency(user: Annotated[User, Depends(get_current_user)]) -> User:
        if role not in user.roles:
            raise HTTPException(status_code=403, detail="Forbidden")
        return user

    return dependency

@app.post("/auth/register", response_model=dict[str, str])
def register(username: str, password: str) -> dict[str, str]:
    pass

@app.post("/auth/token", response_model=Token)
def login(form: Annotated[OAuth2PasswordRequestForm, Depends()]) -> Token:
    raise HTTPException(status_code=401, detail="Not implemented")

@app.get("/admin")
def admin_only(user: Annotated[User, Depends(require_role("admin"))]) -> dict[str, str]:
    return {"message": f"Welcome {user.username}"}
