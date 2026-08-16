"""Configuration loaded from environment variables."""
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # LLM provider
    ai_api_key: str = ""
    ai_base_url: str = ""
    ai_model: str = "gpt-4o"

    # Shared key for authenticating the Go API caller
    ai_service_shared_key: str = ""

    # Safety
    max_prompt_tokens: int = 4000

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8", "extra": "ignore"}


settings = Settings()
