# Auto CV

Full-stack API for automated resume/CV generation in PDF and DOCX formats.

The application allows users to create structured resumes (personal info, professional experiences, education, projects, and certifications), store them in a PostgreSQL database, generate PDFs from HTML templates (Jinja2 + WeasyPrint), and upload the generated files to Google Drive.

## Stack

**Backend**

| Technology | Purpose |
|---|---|
| Python 3.12+ | Primary language |
| FastAPI | Async web framework |
| Uvicorn | ASGI server |
| Pydantic / pydantic-settings | Data validation and configuration |
| SQLAlchemy (async) | ORM for PostgreSQL |
| asyncpg | Async PostgreSQL driver |
| psycopg2-binary | Sync driver (tests) |
| docxtpl | Word template rendering (legacy) |
| WeasyPrint | HTML → PDF conversion |
| Jinja2 | HTML template rendering |
| Redis | Caching and pub-sub |
| requests | Google Drive upload |
| ruff | Linter and formatter |
| mypy | Static type checking |
| pytest / pytest-asyncio | Testing framework |

**Frontend**

| Technology | Purpose |
|---|---|
| React 19 | UI library |
| Vite 8 | Build tool and dev server |
| TypeScript 6 | Static typing |
| TailwindCSS 4 | Utility-first CSS |
| react-router-dom 7 | Client-side routing |
| lucide-react | Icon library |

## Project Structure

```text
auto_cv/
├── db/
│   ├── db.sql                 # Production database schema
│   └── db_test.sql            # Test database schema
├── backend/
│   ├── pyproject.toml         # Python dependencies and configuration
│   ├── Dockerfile             # Multi-stage build (uv + Debian slim)
│   ├── app/
│   │   ├── __init__.py        # FastAPI app, CORS, exception handlers
│   │   ├── config/            # Constants, settings (.env), DB connection
│   │   ├── models/            # SQLAlchemy models (curriculum, experiences, etc.)
│   │   ├── schemas/           # Pydantic schemas (input and response)
│   │   ├── services/          # Business logic (PDF, DOCX, upload, editing)
│   │   └── api/v1/routers/    # REST and WebSocket endpoints
│   ├── templates/             # HTML and DOCX templates
│   ├── data/uploads/          # Generated files (pdf/, docx/)
│   └── tests/                 # Unit tests
└── frontend/
    ├── package.json           # Node dependencies
    ├── vite.config.ts         # Vite configuration
    └── src/
        ├── config/            # Constants and settings
        ├── types/             # TypeScript interfaces
        ├── services/          # HTTP client (API)
        ├── hooks/             # React hooks (forms, status)
        ├── components/        # Reusable components
        ├── pages/             # Application pages
        └── utils/             # Utilities
```

## Database

The relational database (PostgreSQL) consists of 8 main tables:

| Table | Description |
|---|---|
| `curriculum` | Main resume record (language, category, personal info) |
| `experiences` | Professional experiences |
| `experience_activities` | Activities within each experience |
| `educations` | Academic education |
| `projects` | Projects |
| `project_descriptions` | Project descriptions |
| `project_technologies` | Technologies used in projects |
| `certifications` | Certifications |

Available enums:
- **Language**: `portuguese`, `english`, `spanish`
- **Category**: 70+ professional categories (technology, administration, sales, healthcare, engineering, etc.)

Schema creation scripts are located at `db/db.sql` (production) and `db/db_test.sql` (tests).

## Prerequisites

- Python 3.12 or higher
- Node.js 20 or higher
- PostgreSQL 15+
- Redis 7+
- uv (Python package manager)
- LibreOffice (optional, for legacy DOCX conversion)
- Google Cloud account with Google Apps Script configured (for Drive upload)

## Local Setup

### Backend

```bash
cd backend

# Install dependencies
uv sync
```

Create a `.env` file in `backend/`:

```env
DB_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/postgres
DB_TEST_URL=postgresql+psycopg2://postgres:1234@localhost:5432/test_autocv
REDIS_URL=redis://localhost:6379
API_KEY=<your-api-key>
APP_SCRIPT_KEY=<your-app-script-key>
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install
```

Create a `.env` file in `frontend/`:

```env
VITE_API_URL=http://localhost:8000
VITE_WS=ws://localhost:8000
```

## Running

### Backend

```bash
cd backend
uv run uvicorn app:app --reload
```

The API will be available at `http://localhost:8000`. Swagger documentation can be accessed at `/docs`.

### Frontend

```bash
cd frontend
npm run dev
```

### Docker

```bash
cd backend
docker build -t autocv .
docker run -p 8000:8000 -e PORT=8000 autocv
```

## API Endpoints

Base prefix: `/api/v1`

| Method | Path | Description |
|---|---|---|
| `GET` | `/` | API status and version |
| `POST` | `/api/v1/cv` | Create a curriculum |
| `GET` | `/api/v1/cv` | List curricula (`?category=` `&language=`) |
| `GET` | `/api/v1/cv/{id}` | Get curriculum by ID |
| `PUT` | `/api/v1/cv/{id}` | Edit curriculum |
| `DELETE` | `/api/v1/cv/{id}` | Delete curriculum |
| `POST` | `/api/v1/cv/pdf/{id}` | Generate PDF and upload to Google Drive (`?template=standard|modern`) |
| `WS` | `/api/v1/ws/health` | WebSocket health check (ping/pong) |

Interactive docs: `http://localhost:8000/docs`

## Testing

### Backend

```bash
cd backend

# Run all tests
uv run pytest

# Run specific folder or file
uv run pytest tests/unit/services
uv run pytest tests/unit/services/test_file.py
```

### Lint and Type Check

```bash
cd backend

# Linter and formatter
uv run ruff check app
uv run ruff format --check app

# Type checking
uv run mypy app
# If mypy complains about duplicate module names:
# uv run mypy --explicit-package-bases app
```

### Frontend

```bash
cd frontend

# Linter
npm run lint

# Build (includes TypeScript checking)
npm run build
```

## Deployment

The application is ready for deployment on any container platform. The `Dockerfile` located in `backend/` uses a multi-stage build with `uv` and a final `debian:trieixie-slim` image, running as a non-root user.

Required environment variables for production:
- `DB_URL`
- `REDIS_URL`
- `API_KEY`
- `APP_SCRIPT_KEY`
- `PORT` (used by Uvicorn CMD)

## License

This project is private. Contact the maintainer for licensing information.
