"""Thin wrapper around the OpenAI-compatible chat completions API."""
from __future__ import annotations

import time
import logging
from openai import OpenAI
from .config import settings

log = logging.getLogger(__name__)

_client: OpenAI | None = None


def _get_client() -> OpenAI:
    global _client
    if _client is None:
        kwargs: dict = {"api_key": settings.ai_api_key or "sk-placeholder"}
        if settings.ai_base_url:
            kwargs["base_url"] = settings.ai_base_url
        _client = OpenAI(**kwargs)
    return _client


async def chat(
    system: str,
    user: str,
    *,
    temperature: float = 0.4,
    max_tokens: int = 1024,
) -> tuple[str, dict]:
    """Send a chat completion request. Returns (content, meta)."""
    client = _get_client()
    t0 = time.monotonic()
    try:
        resp = client.chat.completions.create(
            model=settings.ai_model,
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
            temperature=temperature,
            max_tokens=max_tokens,
        )
        content = resp.choices[0].message.content or ""
        meta = {
            "model": resp.model or settings.ai_model,
            "prompt_tokens": resp.usage.prompt_tokens if resp.usage else 0,
            "completion_tokens": resp.usage.completion_tokens if resp.usage else 0,
            "latency_ms": int((time.monotonic() - t0) * 1000),
        }
        return content, meta
    except Exception as exc:
        log.error("LLM request failed: %s", exc)
        raise


async def chat_json(
    system: str,
    user: str,
    *,
    temperature: float = 0.3,
    max_tokens: int = 1500,
) -> tuple[dict, dict]:
    """Request JSON output from the model. Returns (parsed_dict, meta)."""
    import json as _json

    client = _get_client()
    t0 = time.monotonic()
    try:
        resp = client.chat.completions.create(
            model=settings.ai_model,
            messages=[
                {"role": "system", "content": system + "\n\nYou MUST respond with valid JSON only — no markdown, no prose."},
                {"role": "user", "content": user},
            ],
            response_format={"type": "json_object"},
            temperature=temperature,
            max_tokens=max_tokens,
        )
        raw = resp.choices[0].message.content or "{}"
        parsed = _json.loads(raw)
        meta = {
            "model": resp.model or settings.ai_model,
            "prompt_tokens": resp.usage.prompt_tokens if resp.usage else 0,
            "completion_tokens": resp.usage.completion_tokens if resp.usage else 0,
            "latency_ms": int((time.monotonic() - t0) * 1000),
        }
        return parsed, meta
    except Exception as exc:
        log.error("LLM JSON request failed: %s", exc)
        raise
