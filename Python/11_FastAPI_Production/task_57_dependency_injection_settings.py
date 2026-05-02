"""
==============================================================================
  TASK 57: Dependency Injection & Settings
==============================================================================

REAL-WORLD CONTEXT:
Hardcoding config (database URLs, API keys, rate limits) is a SECURITY RISK
and makes code impossible to test. Dependency Injection (DI) lets you:
  - Load settings from environment variables (different per environment)
  - Swap real services for fakes in tests
  - Share expensive resources (DB connections) across requests

SCENARIO: Your API needs different config in dev/staging/production:
  - Dev: debug=True, rate_limit=1000, database=sqlite
  - Production: debug=False, rate_limit=60, database=postgres
  Instead of if/else everywhere, load from .env file automatically.

FastAPI's Depends() is dependency injection:
  @app.get("/health")
  def health(settings: Settings = Depends(get_settings)):
      # settings loaded from env, cached, injectable, testable

EXPECTED BEHAVIOR:
  GET /health → {"app": "Interview API", "debug": false, "status": "ok"}
  In tests: override get_settings to inject test config
"""

from functools import lru_cache
from typing import Annotated

from fastapi import Depends, FastAPI
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    app_name: str = "Interview API"
    debug: bool = False
    rate_limit_per_minute: int = 60
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

@lru_cache
def get_settings() -> Settings:
    return Settings()

SettingsDep = Annotated[Settings, Depends(get_settings)]

app = FastAPI()

@app.get("/health")
def health(settings: SettingsDep) -> dict[str, str | bool]:
    return {"app": settings.app_name, "debug": settings.debug, "status": "ok"}
