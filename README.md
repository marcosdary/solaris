# Auto CV

API full-stack para criação e geração automática de currículos em PDF e DOCX.

A aplicação permite cadastrar currículos estruturados (dados pessoais, experiências, formações, projetos e certificações), armazená-los em banco de dados PostgreSQL, gerar PDFs a partir de templates HTML (Jinja2 + WeasyPrint) e fazer upload dos arquivos para o Google Drive.

## Stack

**Backend**

| Tecnologia | Finalidade |
|---|---|
| Python 3.12+ | Linguagem principal |
| FastAPI | Framework web assíncrono |
| Uvicorn | Servidor ASGI |
| Pydantic / pydantic-settings | Validação de dados e configuração |
| SQLAlchemy (async) | ORM para PostgreSQL |
| asyncpg | Driver async para PostgreSQL |
| psycopg2-binary | Driver sync (testes) |
| docxtpl | Renderização de templates Word (legado) |
| WeasyPrint | Conversão HTML → PDF |
| Jinja2 | Renderização de templates HTML |
| Redis | Cache e pub-sub |
| requests | Upload para Google Drive |
| ruff | Linter e formatador |
| mypy | Checagem estática de tipos |
| pytest / pytest-asyncio | Testes |

**Frontend**

| Tecnologia | Finalidade |
|---|---|
| React 19 | Biblioteca de interfaces |
| Vite 8 | Build e dev server |
| TypeScript 6 | Tipagem estática |
| TailwindCSS 4 | CSS utilitário |
| react-router-dom 7 | Roteamento |
| lucide-react | Ícones |

## Estrutura do Projeto

```text
auto_cv/
├── db/
│   ├── db.sql                 # Schema do banco de produção
│   └── db_test.sql            # Schema do banco de testes
├── backend/
│   ├── pyproject.toml         # Dependências e configurações Python
│   ├── Dockerfile             # Build multi-stage (uv + Debian slim)
│   ├── app/
│   │   ├── __init__.py        # Aplicação FastAPI, CORS, exception handlers
│   │   ├── config/            # Constantes, settings (.env), conexão DB
│   │   ├── models/            # Modelos SQLAlchemy (curriculum, experiences, etc.)
│   │   ├── schemas/           # Schemas Pydantic (entrada e resposta)
│   │   ├── services/          # Regras de negócio (PDF, DOCX, upload, edição)
│   │   └── api/v1/routers/    # Endpoints REST e WebSocket
│   ├── templates/             # Templates HTML e DOCX
│   ├── data/uploads/          # Arquivos gerados (pdf/, docx/)
│   └── tests/                 # Testes unitários
└── frontend/
    ├── package.json           # Dependências Node
    ├── vite.config.ts         # Configuração do Vite
    └── src/
        ├── config/            # Constantes e settings
        ├── types/             # Interfaces TypeScript
        ├── services/          # Cliente HTTP (API)
        ├── hooks/             # Hooks React (formulários, status)
        ├── components/        # Componentes reutilizáveis
        ├── pages/             # Páginas da aplicação
        └── utils/             # Utilitários
```

## Banco de Dados

O banco relacional (PostgreSQL) é composto por 8 tabelas principais:

| Tabela | Descrição |
|---|---|
| `curriculum` | Registro principal do currículo (idioma, categoria, dados pessoais) |
| `experiences` | Experiências profissionais |
| `experience_activities` | Atividades dentro de cada experiência |
| `educations` | Formação acadêmica |
| `projects` | Projetos |
| `project_descriptions` | Descrições de cada projeto |
| `project_technologies` | Tecnologias usadas nos projetos |
| `certifications` | Certificações |

Enums disponíveis:
- **Idioma**: `portuguese`, `english`, `spanish`
- **Categoria**: 70+ categorias profissionais (tecnologia, administração, vendas, saúde, engenharia, etc.)

Os scripts de criação do schema estão em `db/db.sql` (produção) e `db/db_test.sql` (testes).

## Pré-requisitos

- Python 3.12 ou superior
- Node.js 20 ou superior
- PostgreSQL 15+
- Redis 7+
- uv (gerenciador de pacotes Python)
- LibreOffice (opcional, para conversão DOCX legada)
- Conta Google Cloud com Google Apps Script configurado (para upload no Drive)

## Configuração Local

### Backend

```bash
cd backend

# Instalar dependências
uv sync
```

Crie um arquivo `.env` em `backend/`:

```env
DB_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/postgres
DB_TEST_URL=postgresql+psycopg2://postgres:1234@localhost:5432/test_autocv
REDIS_URL=redis://localhost:6379
API_KEY=<sua-api-key>
APP_SCRIPT_KEY=<sua-app-script-key>
```

### Frontend

```bash
cd frontend

# Instalar dependências
npm install
```

Crie um arquivo `.env` em `frontend/`:

```env
VITE_API_URL=http://localhost:8000
VITE_WS=ws://localhost:8000
```

## Executando

### Backend

```bash
cd backend
uv run uvicorn app:app --reload
```

A API estará disponível em `http://localhost:8000`. A documentação Swagger pode ser acessada em `/docs`.

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

## Endpoints da API

Prefixo: `/api/v1`

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/` | Status da API e versão |
| `POST` | `/api/v1/cv` | Criar currículo |
| `GET` | `/api/v1/cv` | Listar currículos (`?category=` `&language=`) |
| `GET` | `/api/v1/cv/{id}` | Buscar currículo por ID |
| `PUT` | `/api/v1/cv/{id}` | Editar currículo |
| `DELETE` | `/api/v1/cv/{id}` | Excluir currículo |
| `POST` | `/api/v1/cv/pdf/{id}` | Gerar PDF e enviar ao Google Drive (`?template=standard|modern`) |
| `WS` | `/api/v1/ws/health` | WebSocket de health check (ping/pong) |

Documentação interativa: `http://localhost:8000/docs`

## Testes

### Backend

```bash
cd backend

# Rodar todos os testes
uv run pytest

# Rodar testes de uma pasta ou arquivo específico
uv run pytest tests/unit/services
uv run pytest tests/unit/services/test_file.py
```

### Lint e typecheck

```bash
cd backend

# Linter e formatador
uv run ruff check app
uv run ruff format --check app

# Checagem de tipos
uv run mypy app
# Caso haja conflito de módulos:
# uv run mypy --explicit-package-bases app
```

### Frontend

```bash
cd frontend

# Linter
npm run lint

# Build (inclui checagem do TypeScript)
npm run build
```

## Deploy

A aplicação está preparada para deploy em qualquer plataforma de containers (Docker). O `Dockerfile` localizado em `backend/` utiliza build multi-stage com `uv` e imagem final `debian:trieixie-slim`, rodando como usuário não-root.

Variáveis de ambiente obrigatórias para produção:
- `DB_URL`
- `REDIS_URL`
- `API_KEY`
- `APP_SCRIPT_KEY`
- `PORT` (usado pelo CMD do Uvicorn)

## Licença

Este projeto é privado. Consulte o mantenedor para informações sobre licenciamento.
