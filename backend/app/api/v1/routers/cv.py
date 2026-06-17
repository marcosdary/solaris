from fastapi import (
    APIRouter, 
    Depends, 
    status,
    HTTPException
)

from app.config import MimeTypes, get_settings
from app.schemas import PayloadSchema, ResponseSchema
from app.services import (
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
    settings = Depends(get_settings)
) -> ResponseSchema: 
    try:
        file_service = FileService(
            cv=schema.cv.value,
            filename=schema.filename
        )

        loading_info_service = LoadingInfoService()
        
        rt = loading_info_service.add_text_file(schema.info)
        data = loading_info_service.info(rt=rt)
        
        file_service.save_file(data)
        
        paths = list() 

        dist_path = file_service.full_file_path
        filename = f"{schema.filename}.docx"
        mimetype = MimeTypes.docx.value

        paths.append(dist_path)

        if schema.pdf:
            file_service.save_from_pdf()
            filename = f"{schema.filename}.pdf"
            mimetype = MimeTypes.pdf.value
            dist_path = file_service.path_from_pdf / filename
            
            paths.append(dist_path)
        
        drive_actions_service = DriveActionsService(
            settings=settings
        )

        upload = drive_actions_service.upload(
            filepath=dist_path,
            mimetype=mimetype
        )

        delete_files(paths=paths)
        return upload
    
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=exc
        )