"""
================================================================
   TASK 59: JWT Auth, RBAC, and API Security         *****
================================================================

Goal:
- Hash passwords.
- Issue JWT access tokens.
- Inject current_user.
- Add role-based authorization.

Setup:
  pip install python-jose passlib[bcrypt] python-multipart
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
    pass  # YOUR CODE HERE


def verify_password(password: str, password_hash: str) -> bool:
    pass  # YOUR CODE HERE


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
    pass  # YOUR CODE HERE


@app.post("/auth/token", response_model=Token)
def login(form: Annotated[OAuth2PasswordRequestForm, Depends()]) -> Token:
    raise HTTPException(status_code=401, detail="Not implemented")


@app.get("/admin")
def admin_only(user: Annotated[User, Depends(require_role("admin"))]) -> dict[str, str]:
    return {"message": f"Welcome {user.username}"}


# Security checklist:
# - Move SECRET_KEY to environment.
# - Add password length rules.
# - Add rate limiting for login.
# - Never log passwords or tokens.

