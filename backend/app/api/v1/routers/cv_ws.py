from fastapi import (
    APIRouter, 
    WebSocket,
    WebSocketDisconnect,
    Depends
)
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession 
from typing import AsyncGenerator, Optional

from app.config import (
    Settings,
    PostgresAsyncDB,
    get_settings
)
from app.models import (
    CVModel,
    ExperienceModel,
    ProjectModel,
    EducationModel,
    CertificationModel
)
from app.schemas import (
    WSRequestSchema,
    WSResponseSchema,
    ExperienceSchema,
    EducationSchema,
    CertificationSchema,
    ProjectSchema,
    ExperienceResponseSchema,
    EducationResponseSchema,
    CertificationResponseSchema,
    ProjectResponseSchema
)


async def get_session(
    settings: Settings = Depends(get_settings),
) -> AsyncGenerator[AsyncSession, None]:
    postgres_db = PostgresAsyncDB(settings.DB_URL)
    async with postgres_db.get_session() as session:
        yield session

router = APIRouter()

_ENTITY_MAP: dict[str, tuple[type, type]] = {
    "experience":       (ExperienceModel, ExperienceSchema, ExperienceResponseSchema),
    "education":        (EducationModel, EducationSchema, EducationResponseSchema),
    "project":          (ProjectModel, ProjectSchema, ProjectResponseSchema),
    "certification":    (CertificationModel, CertificationSchema, CertificationResponseSchema)
}

_CV_FIELDS = set(CVModel.__table__.columns.keys())

@router.websocket("/{cv_id}")
async def cv_editor(
    websocket: WebSocket,
    cv_id: str,
    session: AsyncSession = Depends(get_session)
):
    await websocket.accept()
    try:
        while True:
            raw = await websocket.receive_json()
            response = await _dispatch(raw, cv_id, session)
            await websocket.send_text(response.model_dump_json())
    except WebSocketDisconnect:
        pass

async def _dispatch(
    raw: dict,
    cv_id: str,
    session: AsyncSession
) -> WSResponseSchema:
    try:
        request = WSRequestSchema(**raw)
    except ValidationError as exc:
        return WSResponseSchema(
            action=raw.get("action", "unknown"),
            status="error",
            error=str(exc)
        )
    
    try: 
        return await _route(request, cv_id, session)
    except Exception as exc:
        return WSResponseSchema(
            action=request.action, status="error", error=str(exc)
        )
    
async def _route(request: WSRequestSchema, cv_id: str, session: AsyncSession):
    if request.action == "update_personal":
        return await _update_personal_top(session, cv_id, request)
    
    operation, _, entity = request.action.partition("_")

    if entity not in _ENTITY_MAP:
        return WSResponseSchema(
            action=request.action,
            status="error",
            error=f"Ação desconhecida: {request.action}"
        )
    
    model_cls, schema_cls, response_schema_cls = _ENTITY_MAP[entity]
    match operation:
        case "add":
            return await _add(session, cv_id, model_cls, schema_cls, response_schema_cls, request)
        case "update":
            return await _update(session, cv_id, model_cls, schema_cls, response_schema_cls, request)
        case "delete":
            return await _delete(session, cv_id, model_cls, request)
        case _:
            return WSResponseSchema(
                action=request.action, status="error",
                error=f"Operação desconhecida: {operation}"
            )
        
async def _get_cv(
    session: AsyncSession,
    cv_id: str
) -> Optional[CVModel]:
    return await session.get(CVModel, cv_id)


async def _add(
    session: AsyncSession,
    cv_id: str,
    model_cls, schema_cls, 
    response_schema_cls, request: WSRequestSchema
) -> WSResponseSchema:
    cv = await _get_cv(session, cv_id)
    if cv is None:
        return WSResponseSchema(
            action=request.action, status="error",
            error=f"CV '{cv_id}' não encontrado."
        )

    validated = schema_cls(**request.data)
    entity = model_cls.from_schema(validated)
    entity.cv_id = cv_id
    session.add(entity)
    await session.commit()

    response = response_schema_cls.model_validate(entity)

    return WSResponseSchema(
        action=request.action, status="success",
        data=response.model_dump()
    )

async def _update(
    session: AsyncSession, cv_id: str,
    model_cls, schema_cls, 
    response_schema_cls, request: WSRequestSchema
) -> WSResponseSchema:
    if not request.entity_id:
        return WSResponseSchema(
            action=request.action, status="error",
            error="entity_id obrigatório."
        )
    cv = await _get_cv(session, cv_id)

    if cv is None:
        return WSResponseSchema(
            action=request.action, status="error",
            error=f"CV '{cv_id}' não encontrado."
        )
    
    entity = await session.get(model_cls, request.entity_id)
    if entity is None or entity.cv_id != cv_id:
        return WSResponseSchema(
            action=request.action, status="error",
            error="Entidade não encontrada neste CV."
        )
    validated = schema_cls(**request.data)
    for field, value in validated.model_dump(exclude_unset=True).items():
        setattr(entity, field, value)

    await session.commit()
    
    response = response_schema_cls.model_validate(entity)

    return WSResponseSchema(
        action=request.action, status="success",
        data=response.model_dump()
    )

async def _delete(
    session: AsyncSession, cv_id: str,
    model_cls, request: WSRequestSchema  
) -> WSResponseSchema:
    if not request.entity_id:
        return WSResponseSchema(
            action=request.action, status="error",
            error=f"CV '{cv_id}' não encontrado."
        )
    
    cv = await _get_cv(session, cv_id)

    if cv is None:
        return WSResponseSchema(
            action=request.action, status="error",
            error=f"CV '{cv_id}' não encontrado."
        )
    entity = await session.get(model_cls, request.entity_id)
    if entity is None or entity.cv_id != cv_id:
        return WSResponseSchema(
            action=request.action, status="error",
            error="Entidade não encontrada neste CV."
        )
    
    await session.delete(entity)
    await session.commit()

    return WSResponseSchema(
        action=request.action, status="success",
        data=None
    )

async def _update_personal_top(
    session: AsyncSession, cv_id: str, 
    request: WSRequestSchema
) -> WSResponseSchema:
    cv = await _get_cv(session, cv_id)

    if cv is None:
        return WSResponseSchema(
            action=request.action, status="error",
            error=f"CV '{cv_id}' não encontrado."
        )
    
    data = {k: v for k, v in request.data.items() if k in _CV_FIELDS}
    if not data:
        return WSResponseSchema(
            action="update_personal", status="error",
            error=f"CV '{cv_id}' não encontrado."
        )

    for field, value in data.items():
        setattr(cv, field, value)

    await session.commit()
    return WSResponseSchema(
        action="update_personal", status="success",
        data=data
    ) 

