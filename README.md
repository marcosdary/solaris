# Auto-Currículo

Script Python para automatizar a geração de currículos em `.docx` a partir de modelos do Word.

O projeto utiliza templates em português e inglês, recebe o texto por linha de comando e preenche o campo `RESUME` do documento final.

## Stack

- Python 3.12
- [uv](https://docs.astral.sh/uv/) para gerenciamento de dependências e ambiente virtual
- [docxtpl](https://docxtpl.readthedocs.io/) para renderização dos templates `.docx`
- pydantic-settings para leitura das variáveis de ambiente

## Requisitos

- Python 3.12 ou superior
- uv instalado

## Configuração Local

### 1. Instale as dependências

```bash
uv sync
```

### 2. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com o caminho onde os currículos gerados serão salvos:

```env
DIST_PATH=/caminho/para/salvar/curriculos
```

Exemplo:

```env
DIST_PATH=/home/usuario/Documentos/Curriculo
```

### 3. Confira os templates

Os modelos base ficam no diretório `data`:

- `data/portuguese.docx`
- `data/english.docx`

O texto enviado pela linha de comando será aplicado ao campo `RESUME` do template.

## Execução

### Gerar currículo em português

```bash
uv run python src/main.py \
  --cv portuguese.docx \
  --dir Portuguese \
  --info "Resumo profissional em português."
```

### Gerar currículo em inglês

```bash
uv run python src/main.py \
  --cv english.docx \
  --dir English \
  --info "Professional summary in English."
```

O arquivo final será salvo como:

```text
{DIST_PATH}/{Portuguese|English}/cv.docx
```

## Formatação do texto

Trechos entre `**` são renderizados em negrito no documento final.

Exemplo:

```bash
uv run python src/main.py \
  --cv portuguese.docx \
  --dir Portuguese \
  --info "**Desenvolvedor Python** com experiência em automação de documentos."
```
