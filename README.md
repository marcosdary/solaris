# Auto CV

API em FastAPI para gerar curriculos em `.docx` a partir de templates do Word.

O projeto recebe as informacoes do curriculo por HTTP, renderiza o campo `RESUME` nos modelos `.docx` usando `docxtpl` e salva o arquivo final no diretorio configurado.

## Stack

- Python 3.12+
- FastAPI
- Uvicorn
- Pydantic / pydantic-settings
- docxtpl
- uv
- LibreOffice, opcional para conversao em PDF

## Arquitetura

```text
src/
├── api/
│   └── v1/
│       └── __init__.py        # Endpoint POST /api/v1
├── config/
│   ├── constants.py           # Enums de templates e diretorios
│   └── settings.py            # Variaveis de ambiente
├── schemas/
│   ├── payload.py             # Entrada da API
│   ├── response.py            # Resposta da API
│   └── index.py               # Resposta do endpoint /
├── services/
│   ├── file.py                # Renderizacao, salvamento e PDF
│   └── loading_info.py        # Montagem do RichText para o template
└── __init__.py                    # Aplicacao FastAPI
```

## Requisitos

- Python 3.12 ou superior
- uv instalado
- LibreOffice instalado, apenas se usar `pdf: true`
- Projeto no Google Cloud para google drive

## Configuracao Local

Instale as dependencias:

```bash
uv sync
```

Crie um arquivo `.env` na raiz do projeto:

```env
DIST_PATH=/caminho/para/salvar/google/drive
```

Exemplo:

```env
DIST_PATH=/1aOsYKIC6YYCzwWCtZVTknA1f9ClDk9zD
```

Os templates base ficam em:

```text
data/portuguese.docx
data/english.docx
```

Os templates devem conter a variavel `{{r RESUME}}`, pois o projeto envia um `RichText` do `docxtpl`.

## Executando a API

```bash
uv run uvicorn app:app --reload
```

URLs principais:

```text
GET  /
POST /api/v1
GET  /docs
```

## Gerar Curriculo

Endpoint:

```http
POST /api/v1
```

Payload:

```json
{
  "cv": "portuguese.docx",
  "info": "**Desenvolvedor Python** com experiencia em FastAPI, automacao e integracoes.",
  "pdf": false
}
```

Campos:

| Campo | Tipo | Obrigatorio | Valores |
| --- | --- | --- | --- |
| `cv` | string | sim | `portuguese.docx`, `english.docx` |
| `dirname` | string | sim | `portuguese`, `english` |
| `info` | string | sim | Texto que sera aplicado ao campo `RESUME` |
| `pdf` | boolean | nao | `true` para converter tambem para PDF |

Exemplo com `curl`:

```bash
curl -X POST http://127.0.0.1:8000/api/v1 \
  -H "Content-Type: application/json" \
  -d '{
    "cv": "portuguese.docx",
    "info": "**Desenvolvedor Python** com experiencia em automacao de documentos.",
    "pdf": false
  }'
```

Resposta esperada:

```json
{
  "name": "nome_do_arquivo.extensao",
  "mimetype": "tipo/arquivo"
}
```

## Saída dos Arquivos

O arquivo `.docx` e salvo em:

```text
{DIST_PATH}/docx/{filename}.docx
```

Quando `pdf` for `true`, a conversao usa LibreOffice em modo headless e salva o PDF em:

```text
{DIST_PATH}/pdf/{filename}.pdf
```

## Formatação do Texto

Trechos entre `**` sao renderizados em negrito no documento:

```text
Texto normal com **trecho em negrito**.
```

O `LoadingInfoService` transforma esse texto em `RichText` e monta o contexto:

```python
{
    "RESUME": rt
}
```

## Validação

Rodar os testes:

```bash
uv run pytest
```

Rodar apenas uma pasta ou arquivo de teste:

```bash
uv run pytest tests/unit/services
uv run pytest tests/unit/services/test_file.py
```

Rodar checagem de tipos:

```bash
uv run mypy app
```

Se o mypy reclamar que um arquivo foi encontrado com dois nomes de modulo, execute com bases explicitas:

```bash
uv run mypy --explicit-package-bases app
```
