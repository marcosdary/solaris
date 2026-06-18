from fastapi import (
    APIRouter, 
    Depends, 
    status,
    HTTPException
)

from app.config import get_settings
from app.schemas import PayloadSchema, ResponseSchema
from app.services import (
    SaveFileService, 
    LoadInfoToFileService,
    DriveUploadService,
    FileService,
    delete_files
)

router = APIRouter()


@router.post(
    "", 
    status_code=status.HTTP_201_CREATED, 
    response_model=ResponseSchema
)
async def cv(
    schema: PayloadSchema,
    settings = Depends(get_settings)
) -> ResponseSchema: 
    try:
        # Carregar as informações para um arquivo docx
        load_info_to_file = LoadInfoToFileService()
        # Dicinários com as informações do RichText para 'RESUME'
        payload = load_info_to_file.payload_from_rich(text=schema.info)

        # Inicializar o arquivo, com base nas especicações do template, assim como
        # incluir a classe DocxTemplate e o nome do arquivo, sem a extensão
        file = FileService(template=schema.cv)

        # Salvar arquivo no caminho especificado
        file_save = SaveFileService(
            file=file
        )

        # Salva arquivo docx
        file_save.save_docx_file(payload)

        # Mimetype e filename para docx
        mimetype = file.mimetype_to_docx
        filepath = file_save.path_from_docx / file.docx_filename

        # Caminhos para apagar
        paths = [filepath,]

        if schema.pdf:
            file_save.save_pdf_file()

            # Mimetype e filename para pdf
            mimetype = file.mimetype_to_pdf
            filepath = file_save.path_from_pdf / file.pdf_filename
            paths.append(filepath)

        # Realizar upload na nuvem do Google Drive
        drive_upload = DriveUploadService(settings)
        response = drive_upload.upload(filepath=filepath, mimetype=mimetype)

        delete_files(paths=paths)
        return response
    
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=exc
        )