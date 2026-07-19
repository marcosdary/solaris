# AGENTS.md — Auto CV / Solaris

## Project overview

Full-stack CV generation app (PDF via WeasyPrint, DOCX legacy). Backend FastAPI + frontend React/Vite. PostgreSQL + Redis + Supabase storage.

## Commands

All backend commands run from `backend/`, all frontend from `frontend/`.

### Backend (Python)
```bash
uv sync                      # install deps
uv run uvicorn app:app --reload  # dev server
uv run pytest                 # all tests
uv run pytest tests/unit/services/test_file.py  # single test
uv run ruff check app         # lint
uv run ruff format --check app  # format check
uv run mypy app               # typecheck (add --explicit-package-bases if module conflicts)
```

### Frontend (Node)
```bash
npm install
npm run dev       # dev server
npm run build     # typecheck + build (tsc -b && vite build)
npm run lint      # ESLint
```

## Architecture

- **FastAPI app object** is in `backend/app/__init__.py` — entrypoint is `uvicorn app:app`, not a separate `main.py`.
- **Dependency injection**: services are `Annotated[Type, Depends(...)]` (e.g., `CurriculumServiceDep`). Routers use these typed dependencies directly.
- **Data flow**: routers → services (business logic) → repos (SQLAlchemy queries). Repos are the only layer touching models/SQL.
- **`initialize_directories()`** runs at import time in `app/__init__.py` — creates `data/uploads/pdf/` and `data/uploads/docx/`.
- **pyproject.toml** project name is `"solaris"`, not the repo name.
- **Docker build** uses `python:3.14-slim`, multi-stage, non-root user. Runtime image is `debian:trixie-slim`.

## Key quirks

- **Test DB is sync**: `DB_TEST_URL` uses `psycopg2://` — `PostgresAsyncDB.__init__` auto-converts to `asyncpg://` via string replace. Tests use both `async_session` (async) and `session` (sync) fixtures from `conftest.py`.
- **WeasyPrint needs system deps**: `libcairo2`, `libpango-1.0-0`, `libpangocairo-1.0-0`, `libgdk-pixbuf-2.0-0`, `libharfbuzz0b`, `libfontconfig1`, `shared-mime-info`, `fonts-dejavu-core`. PDF generation fails without them.
- **mypy ignores**: `docxtpl`, `google_auth_oauthlib.*`, `googleapiclient.*` have `ignore_missing_imports = true`.
- **Ruff** targets `py310` even though `requires-python` is `>=3.12`.
- **TypeScript rules**: `verbatimModuleSyntax` (use `import type` for type-only imports), `erasableSyntaxOnly` (no enums/namespaces), `noUnusedLocals` and `noUnusedParameters` are enforced.
- **TailwindCSS 4** is loaded as a Vite plugin (`@tailwindcss/vite`), not via PostCSS.

## Database

Schema in `db/db.sql` (prod) and `db/db_test.sql` (test). 8 tables: `curriculum` (root), `experiences` → `experience_activities`, `educations`, `projects` → `project_descriptions` + `project_technologies`, `certifications`. Language enum: `portuguese`, `english`, `spanish`. 70+ category enums.

## Environment

Uses `python-dotenv` via `pydantic-settings`. Required vars (see `backend/app/config/settings.py`):
- `DB_URL` (asyncpg), `API_KEY`, `JWT_SECRET`, `APP_SCRIPT_KEY`, `SUPABASE_URL`, `SUPABASE_KEY`, `ACCESS_TOKEN_EXPIRE_MINUTES`, `SUPABASE_BUCKET_NAME`, `SUPABASE_FOLDER_PUBLIC`
- Frontend: `VITE_API_URL`, `VITE_WS`
