from fastapi import (
    APIRouter, 
    Depends, 
    status,
    HTTPException
)

from app.config import get_settings
from app.schemas import GenerateCVRequestSchema, GenerateCVResponseSchema
from app.services import (
    LoadInfoToFileService,
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
        # Carregar as informações para um arquivo docx
        load_info_to_file = LoadInfoToFileService()
        # Dicinários com as informações do RichText para 'RESUME'
        payload = load_info_to_file.payload_from_rich(text=request.info)

        # Inicializar o arquivo, com base nas especicações do template, assim como
        # incluir a classe DocxTemplate e o nome do arquivo, sem a extensão
        file_docx = FileDocxService(template=request.cv, data=payload)
        file_pdf = FilePDFService()

        # Salva arquivo docx
        file_docx.save()

        # Mimetype e filename para docx
        mimetype = file_docx.mimetype
        filepath = file_docx.path / file_docx.filename

        if request.pdf:
            file_pdf.save()

            # Mimetype e filename para pdf
            mimetype = file_pdf.mimetype
            filepath = file_pdf.path_from_pdf / file_pdf.filename
           

        # Realizar upload na nuvem do Google Drive
        drive_upload = DriveUploadService(settings)
        response = drive_upload.upload(filepath=filepath, mimetype=mimetype)
        
        if request.pdf:
            file_pdf.delete()

        file_docx.delete()
        return response
    
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=exc
        )