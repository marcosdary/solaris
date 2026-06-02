from fastapi import (
    APIRouter, 
    Depends, 
    status
)

from src.config import get_settings, Settings, DIR_DATA
from src.schemas import PayloadSchema, ResponseSchema
from src.services import (
    FileService, 
    LoadingInfoService
)

router = APIRouter()

@router.post(
    "", 
    status_code=status.HTTP_201_CREATED, 
    response_model=ResponseSchema
)
async def cv(
    schema: PayloadSchema, 
    settings: Settings = Depends(get_settings)
) -> ResponseSchema: 
    file_service = FileService(
        cv=schema.cv.value,
        filename=schema.filename,
        dirname=DIR_DATA,
        dist_path=f"{settings.DIST_PATH}/{schema.dirname.value}"
    )

    loading_info_service = LoadingInfoService()
    
    rt = loading_info_service.add_text_file(schema.info)
    data = loading_info_service.info(rt=rt)
    
    file_service.save_file(data)
    
    dist_path = file_service.full_file_path

    if schema.pdf:
        file_service.save_from_pdf()
        dist_path = f"{file_service.path_from_pdf}/{schema.filename}.pdf" 

    return ResponseSchema(
        dist_path=dist_path
    )


