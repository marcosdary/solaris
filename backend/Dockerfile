# ==========================
# STAGE 1 - Builder
# ==========================
FROM python:3.14-slim AS builder

ENV UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy \
    UV_PROJECT_ENVIRONMENT=/opt/venv

COPY --from=ghcr.io/astral-sh/uv:0.9.17 /uv /usr/local/bin/uv

WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        build-essential && \
    rm -rf /var/lib/apt/lists/*

COPY pyproject.toml uv.lock ./

RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen --no-install-project

COPY . .

RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen

# ==========================
# STAGE 2 - Runtime
# ==========================
FROM python:3.14-slim

ENV PYTHONUNBUFFERED=1 \
    PATH="/opt/venv/bin:$PATH"

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        libcairo2 \
        libcairo-gobject2 \
        libglib2.0-0 \
        libgdk-pixbuf-2.0-0 \
        libpango-1.0-0 \
        libpangocairo-1.0-0 \
        libharfbuzz0b \
        libfontconfig1 \
        shared-mime-info \
        fonts-dejavu-core && \
    rm -rf /var/lib/apt/lists/*

RUN groupadd -g 1000 python && \
    useradd -m -u 1000 -g python python

COPY --from=builder --chown=python:python /opt/venv /opt/venv
COPY --from=builder --chown=python:python /app/app app/app
COPY --from=builder --chown=python:python /app/templates app/templates

WORKDIR /app

USER python

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]