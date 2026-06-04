from fastapi import (
    APIRouter, 
    Depends, 
    status
)

from src.config import MimeTypes, get_settings, get_drive_service
from src.schemas import PayloadSchema, ResponseSchema
from src.services import (
    FileService, 
    LoadingInfoService,
    DriveActionsService,
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
    creds = Depends(get_drive_service),
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
    
    paths = list() 

    dist_path = file_service.full_file_path
    mimetype = MimeTypes.docx.value
    filename = f"{schema.filename}.docx"
    parents = [settings.ID_DIR_PORTUGUESE_DOCX,]

    paths.append(dist_path)

    if schema.pdf:
        file_service.save_from_pdf()
        filename = f"{schema.filename}.pdf"
        dist_path = f"{file_service.path_from_pdf}/{filename}" 
        mimetype = MimeTypes.pdf.value
        
        paths.append(dist_path)

        parents = [settings.ID_DIR_PORTUGUESE_PDF,]
    
    drive_actions_service = DriveActionsService(creds=creds)

    upload = drive_actions_service.upload(
        filepath=dist_path,
        filename=filename,
        mimetype=mimetype,
        parents=parents
    )
    
    delete_files(paths=paths)

    return upload