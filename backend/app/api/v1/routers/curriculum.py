from uuid import uuid4
from fastapi import (
    APIRouter, 
    Depends, 
    status,
    Request,
    BackgroundTasks,
    HTTPException
)
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from typing import AsyncGenerator

from app.models import CurriculumModel
from app.config import (
    get_settings,
    DirPaths,
    TemplateFile,
    CurriculumCategory,
    Language
)
from app.schemas import (
    GenerateCurriculumToFileSchema,
    StructuredCurriculumSchema,
    StructuredCurriculumResponseSchema,
    StructuredCurriculumEditSchema,
    ListStructuredCurriculumResponse,
    StructuredCurriculumSummarySchema
)
from app.services import (
    LoadInfoToFilePDFService,
    DriveUploadService,
    FilePDFService,
    EditCurriculum,
)

async def get_session(
    request: Request,
) -> AsyncGenerator[AsyncSession, None]:
    postgres_db = request.state.postgres_db
    async with postgres_db.get_session() as session:
        yield session

async def get_drive_upload_service(
    settings = Depends(get_settings),
) -> DriveUploadService:
    return DriveUploadService(settings)

# 1. Criamos uma função separada para a tarefa pesada em segundo plano
# Nota: Esta função NÃO deve injetar dependências via Depends(). Passamos os objetos já resolvidos.
def process_pdf_and_upload(
    curriculum_data_dict: dict,
    template_value: str,
    drive_upload,
    load_info_to_file
):
    try:
        _basename = f"pdf_{uuid4()}"
        template_dir = DirPaths.DIR_TEMPLATES.value
        
        # Gera o HTML/Dados (Processo CPU-Bound)
        data = load_info_to_file.load_info(
            template=template_value, 
            template_dir=template_dir, 
            context=curriculum_data_dict
        )
        
        # Salva o PDF localmente
        file_pdf = FilePDFService(basename=_basename, data=data)
        file_pdf.save_from_html()

        mimetype = file_pdf.mimetype
        filepath = file_pdf.path / file_pdf.filename

        # Faz o Upload para o Drive (Processo I/O-Bound lento)
        drive_upload.upload(filepath=filepath, mimetype=mimetype)
            
        # Remove o arquivo temporário local
        file_pdf.delete()
        print(f"PDF {_basename} gerado e enviado com sucesso!")
        
        # DICA DE PRODUÇÃO: Aqui você poderia salvar no banco de dados 
        # que o status do PDF agora é "CONCLUÍDO" e salvar a URL do Drive.

    except Exception as exc:
        # Como está em segundo plano, erros aqui não quebram a requisição HTTP do usuário.
        # É vital ter logs aqui para você saber se falhou.
        print(f"Erro ao processar PDF em segundo plano: {exc}")

router = APIRouter()

@router.post(
    "", 
    status_code=status.HTTP_201_CREATED, 
    response_model=StructuredCurriculumSummarySchema
)
async def curriculum(
    schema: StructuredCurriculumSchema,
    session = Depends(get_session)
) -> StructuredCurriculumSummarySchema: 
    try:
        cv = CurriculumModel.from_schema(schema)
        session.add(cv)
        await session.commit()
        await session.refresh(cv)
        return cv
    
    except IntegrityError as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Erro de integridade: {exc}"
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Erro de desconhecido: {exc}"
        )
    
@router.get(
    "", 
    status_code=status.HTTP_200_OK, 
    response_model=ListStructuredCurriculumResponse
)
async def get_curriculum_all(
    session = Depends(get_session),
    category: CurriculumCategory = None,
    language: Language = None
) -> ListStructuredCurriculumResponse: 
    try:

        filters = []

        if category:
            filters.append(CurriculumModel.category == category)
        
        if language:
            filters.append(CurriculumModel.language == language)
        
        stmt = select(CurriculumModel).filter(*filters)


        data = await session.scalars(stmt)

        if not data : 
            raise ValueError("Conteúdo não encontrado. Tente novamente.")
        
        return data
    
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=exc
        )
    
@router.get(
    "/{id}", 
    status_code=status.HTTP_200_OK, 
    response_model=StructuredCurriculumResponseSchema
)
async def get_curriculum(
    id: str,
    session = Depends(get_session)
) -> StructuredCurriculumResponseSchema: 
    try:
        stmt = select(CurriculumModel).filter(CurriculumModel.id == id)
        data = await session.scalar(stmt)

        if not data : 
            raise ValueError("Conteúdo não encontrado. Tente novamente.")
        
        return data
    
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=exc
        )
    
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=exc
        )


@router.post(
    "/pdf/{id}", 
    status_code=status.HTTP_202_ACCEPTED, # 202 significa "Aceito para processamento"
    response_model=GenerateCurriculumToFileSchema
)
async def generate_curriculum_to_pdf(
    id: str,
    background_tasks: BackgroundTasks, # Injetamos a ferramenta de background do FastAPI
    drive_upload = Depends(get_drive_upload_service),
    template: TemplateFile = TemplateFile.standard,
    session: AsyncSession = Depends(get_session),
    load_info_to_file = Depends(LoadInfoToFilePDFService)
) -> GenerateCurriculumToFileSchema: 
    
    # Buscamos os dados no banco de dados rapidamente
    stmt = select(CurriculumModel).filter(CurriculumModel.id == id)
    curriculum_model = await session.scalar(stmt)

    if not curriculum_model: 
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conteúdo não encontrado. Tente novamente."
        )

    # Validamos os dados com o Pydantic antes de mandar para o background
    context = StructuredCurriculumSchema.model_validate(curriculum_model)
    
    # Geramos um nome prévio ou ID para o cliente rastrear, se necessário
    _basename = f"pdf_{uuid4()}"

    # Agendamos a tarefa pesada para rodar assim que a resposta HTTP for enviada
    background_tasks.add_task(
        process_pdf_and_upload,
        curriculum_data_dict=context.model_dump(),
        template_value=template.value,
        drive_upload=drive_upload,
        load_info_to_file=load_info_to_file
    )

    # Retorna IMEDIATAMENTE (Tempo de resposta cai de 4-5 segundos para milissegundos)
    return {
        "name": f"{_basename}.pdf"
    }

@router.delete(
    "/{id}", 
    status_code=status.HTTP_200_OK, 
    response_model=None
)
async def delete_curriculum(
    id: str,
    session = Depends(get_session)
) -> None: 
    try:
        stmt = select(CurriculumModel).filter(CurriculumModel.id == id)
        data = await session.scalar(stmt)

        if not data : 
            raise ValueError("Conteúdo não encontrado. Tente novamente.")
        
        await session.delete(data)
        await session.commit()
        
        return 
    
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=exc
        )
    
@router.put(
    "/{id}",
    status_code=status.HTTP_200_OK,
    response_model=StructuredCurriculumResponseSchema
)
async def edit_curriculum(
    id: str,
    schema: StructuredCurriculumEditSchema,
    session: AsyncSession = Depends(get_session)
) -> StructuredCurriculumResponseSchema:
    try:
        stmt = select(CurriculumModel).filter(CurriculumModel.id == id)
        curriculum = await session.scalar(stmt)

        if not curriculum:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Currículo não encontrado."
            )

        editor = EditCurriculum(model=curriculum, schema=schema)
        await editor.apply(session)

        return curriculum

    except HTTPException:
        raise

    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc)
        )

__all__ = ["router"]