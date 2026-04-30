# Meridian backend — FastAPI + uvicorn
#
# Build (from repo root):
#   docker build -f backend/Dockerfile -t meridian-backend:latest backend
#
# Run locally:
#   docker run --rm -p 8000:8000 \
#     -e OPENROUTER_API_KEY=sk-or-... \
#     meridian-backend:latest
#
# AWS (typical ECS/Fargate): push image to ECR, set task env/secrets:
#   OPENROUTER_API_KEY   — Secrets Manager → container secret
#   BASE_URL             — OpenRouter API base (default https://openrouter.ai/api/v1)
#   ENVIRONMENT          — e.g. production
#   PORT                 — listen port (default 8000; ALB target group must match)

FROM python:3.13-slim-bookworm AS base

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

WORKDIR /app

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PATH="/app/.venv/bin:$PATH" \
    UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy

# Dependency layer (cached when only application code changes)
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-install-project --no-dev

COPY . .
RUN uv sync --frozen --no-dev

RUN useradd --create-home --uid 10001 appuser \
    && mkdir -p /data \
    && chown -R appuser:appuser /app /data

USER appuser

EXPOSE 8000

ENV PORT=8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=50s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8000/api/v1/health/', timeout=5)"

CMD ["sh", "-c", "exec uvicorn main:app --host 0.0.0.0 --port \"${PORT:-8000}\""]
