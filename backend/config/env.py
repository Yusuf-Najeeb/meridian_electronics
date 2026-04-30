# config/env.py
from pathlib import Path

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

_BACKEND_DIR = Path(__file__).resolve().parent.parent
_REPO_ROOT = _BACKEND_DIR.parent

# Prefer backend/.env, then repo-root .env (uvicorn cwd is often backend/)
_ENV_FILES = tuple(
    str(p)
    for p in (_BACKEND_DIR / ".env", _REPO_ROOT / ".env")
    if p.is_file()
)


class Settings(BaseSettings):
    app_name: str = "meridian-backend"
    debug: bool = False
    log_level: str = "INFO"
    environment: str = "development"
    base_url: str = "https://openrouter.ai/api/v1"
    # OpenRouter model id (e.g. openai/gpt-4o-mini, anthropic/claude-3.5-sonnet)
    agent_model: str = "openai/gpt-4o-mini"

    # API Keys
    anthropic_api_key: str = ""
    openrouter_api_key: str = ""

    model_config = SettingsConfigDict(
        env_file=_ENV_FILES or (".env",),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @field_validator("openrouter_api_key")
    @classmethod
    def strip_api_key(cls, v: str) -> str:
        return v.strip() if isinstance(v, str) else v


settings = Settings()
