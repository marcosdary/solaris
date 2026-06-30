from uuid import uuid4
from fastapi import (
    APIRouter, 
    Depends, 
    status,
    HTTPException
)

from app.config import (
    get_settings,
    DirPaths
)
from app.schemas import (
    GenerateCVRequestSchema, 
    GenerateCVResponseSchema,
    StructuredCVRequestSchema
)
from app.services import (
    LoadInfoToFileService,
    LoadInfoToFilePDFService,
    DriveUploadService,
    FilePDFService,
    FileDocxService
)

router = APIRouter()

@router.post(
    "", 
    status_code=status.HTTP_201_CREATED, 
    response_model=GenerateCVResponseSchema
)
async def cv(
    request: GenerateCVRequestSchema,
    settings = Depends(get_settings)
) -> GenerateCVResponseSchema: 
    try:
        _basename = f"cv_{uuid4()}"

        # Carregar as informações para um arquivo docx
        load_info_to_file = LoadInfoToFileService()
        # Dicinários com as informações do RichText para 'RESUME'
        payload = load_info_to_file.payload_from_rich(text=request.info)

        # Inicializar o arquivo, com base nas especicações do template, assim como
        # incluir a classe DocxTemplate e o nome do arquivo, sem a extensão
        file_docx = FileDocxService(
            template=request.cv, 
            data=payload,
            basename=_basename
        )
        file_pdf = FilePDFService(basename=_basename)

        # Salva arquivo docx
        file_docx.save()

        # Mimetype e filename para docx
        mimetype = file_docx.mimetype
        filepath = file_docx.path / file_docx.filename

        if request.pdf:
            file_pdf.save(filepath=filepath)

            # Mimetype e filename para pdf
            mimetype = file_pdf.mimetype
            filepath = file_pdf.path / file_pdf.filename

        # Realizar upload na nuvem do Google Drive
        drive_upload = DriveUploadService(settings)
        response = drive_upload.upload(filepath=filepath, mimetype=mimetype)
        
        if request.pdf:
            file_pdf.delete()

        file_docx.delete()
        return response
    
    except FileNotFoundError as exc:
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
    "/pdf", 
    status_code=status.HTTP_201_CREATED, 
    response_model=GenerateCVResponseSchema
)
async def generate_cv_to_pdf(
    request: StructuredCVRequestSchema,
    settings = Depends(get_settings)
) -> GenerateCVResponseSchema: 
    try:
        _basename = f"pdf_{uuid4()}"
        dirs_path = DirPaths

        # Carregar as informações para um arquivo docx
        load_info_to_file = LoadInfoToFilePDFService(dirs_path.DIR_TEMPLATES.value)

        file_pdf = FilePDFService(basename=_basename)

        text = load_info_to_file.load_info("resume.html", request.model_dump())
        file_pdf.save_from_html(text=text)

        # Mimetype e filename para pdf
        mimetype = file_pdf.mimetype
        filepath = file_pdf.path / file_pdf.filename

        # Realizar upload na nuvem do Google Drive
        drive_upload = DriveUploadService(settings)
        response = drive_upload.upload(filepath=filepath, mimetype=mimetype)
        
        file_pdf.delete()

        return response
    
    except FileNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=exc
        )

    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=exc
        )