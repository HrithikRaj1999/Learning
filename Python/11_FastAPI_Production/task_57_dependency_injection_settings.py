"""
================================================================
   TASK 57: Dependency Injection and Settings        ****
================================================================

Goal:
- Load config using pydantic-settings.
- Use Depends for reusable services.
- Override dependencies in tests.
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


# ----- Challenge 57.1 -----
# Create a ClockService with now_iso().
# Inject it into /time using Depends.


# YOUR CODE HERE


# ----- Challenge 57.2 -----
# Write tests that override get_settings and ClockService.
# Interview question: why is dependency override better than monkeypatching globals?

