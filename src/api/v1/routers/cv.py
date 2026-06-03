from fastapi import (
    APIRouter, 
    Depends, 
    status
)

from src.config import MimeTypes, get_settings
from src.schemas import PayloadSchema, ResponseSchema
from src.services import (
    FileService, 
    LoadingInfoService,
    drive
)

router = APIRouter()

@router.post(
    "", 
    status_code=status.HTTP_201_CREATED, 
    response_model=ResponseSchema
)
async def cv(
    schema: PayloadSchema,
    creds = Depends(drive.get_drive_service),
    settings = Depends(get_settings)
) -> ResponseSchema: 
    file_service = FileService(
        cv=schema.cv.value,
        dirname=schema.dirname.value,
        filename=schema.filename
    )

    loading_info_service = LoadingInfoService()
    
    rt = loading_info_service.add_text_file(schema.info)
    data = loading_info_service.info(rt=rt)
    
    file_service.save_file(data)
    
    dist_path = file_service.full_file_path
    mimetype = MimeTypes.docx.value
    filename = f"{schema.filename}.docx"
    parents = [settings.ID_DIR_PORTUGUESE_DOCX,]

    if schema.pdf:
        file_service.save_from_pdf()
        dist_path = f"{file_service.path_from_pdf}/{schema.filename}.pdf" 
        mimetype = MimeTypes.pdf.value
        filename = f"{schema.filename}.pdf"
        parents = [settings.ID_DIR_PORTUGUESE_PDF,]

    drive_actions_service = drive.DriveActionsService(creds=creds)
    
    id_google_drive = drive_actions_service.upload(
        filepath=file_service.full_file_path,
        filename=filename,
        mimetype=mimetype,
        parents=parents
    )

    return ResponseSchema(
        dist_path=dist_path,
        id_google_drive=id_google_drive
    )
