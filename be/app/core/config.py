from typing import List
import json
import os

from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables.

    Uses pydantic-settings for type-safe configuration. Values can be supplied
    via a .env file or environment variables.
    """

    model_config = SettingsConfigDict(env_file='.env.development', env_file_encoding='utf-8', case_sensitive=False)

    app_env: str = os.getenv('APP_ENV', 'development')
    api_v1_str: str = os.getenv('API_V1_STR', '/api/v1')
    project_name: str = os.getenv('PROJECT_NAME', 'Travel Content Hub API')

    openai_api_key: str
    openai_model: str = os.getenv('OPENAI_MODEL', 'gpt-4o-mini')

    backend_cors_origins: List[AnyHttpUrl] | List[str] = []

    @field_validator('backend_cors_origins', mode='before')
    @classmethod
    def assemble_cors_origins(cls, v):
        """Support JSON list or comma-separated string for CORS origins."""
        if not v:
            return []
        if isinstance(v, list):
            return v
        if isinstance(v, str):
            try:
                # Try JSON first
                parsed = json.loads(v)
                if isinstance(parsed, list):
                    return parsed
            except json.JSONDecodeError:
                pass
            # Fallback to comma-separated
            return [origin.strip() for origin in v.split(',') if origin.strip()]
        return v


settings = Settings()


