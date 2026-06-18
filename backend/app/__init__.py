from fastapi import (
    FastAPI,
    Request,
    status
)
from fastapi.exceptions import (
    HTTPException,
    RequestValidationError
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
# API
from app.api import router 
from app.config import initialize_directories

# Services
from app.services import ValidationException


# Schemas
from app.schemas import IndexSchema

# Inicializa a aplicação FastAPI
app = FastAPI(
    title="Auto CV",
    version="0.1.0",
    description="""
API responsável pela integração para inserção de informações ao currículo
"""
)

# Configuração de CORS
#
# allow_origins:
#   Define quais origens podem acessar a API.
#
# allow_methods:
#   Métodos HTTP permitidos.
#
# allow_headers:
#   Headers permitidos nas requisições.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Registra as rotas REST da API v1
app.include_router(
    router,
    prefix="/api",
    tags=["API"]
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    request: Request,
    exc: RequestValidationError
):
    """
    Manipula erros de validação do FastAPI/Pydantic.

    Args:
        request:
            Requisição HTTP recebida.

        exc:
            Exceção de validação lançada pelo FastAPI.

    Returns:
        JSONResponse:
            Resposta padronizada contendo os erros.
    """

    validation_exception = ValidationException(exc)

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
        content=validation_exception.generate_dict_for_exc()
    )
 
@app.exception_handler(HTTPException)
async def http_exception_handler(
    request: Request,
    exc: HTTPException
):
    """
    Manipula exceções HTTP customizadas.

    Args:
        request:
            Requisição HTTP recebida.

        exc:
            Exceção HTTP lançada pela aplicação.

    Returns:
        JSONResponse:
            Resposta padronizada contendo detalhes do erro.
    """

    return JSONResponse(
        status_code=exc.status_code,
        content={
            "detail": [
                {
                    "msg": exc.detail
                }
            ],
        },
    )


@app.get(
    "/",
    tags=["Index"],
    response_model=IndexSchema,
    summary="Endpoint inicial da API",
    description="Retorna informações básicas da API, como versão e status de integração."
)
def index():
    """
    Endpoint inicial da aplicação.
    """

    return IndexSchema(
        version="1.0.0",
        message="Integração com Auto CV"
    )

initialize_directories()