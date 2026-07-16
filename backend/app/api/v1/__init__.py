from fastapi import APIRouter

from app.api.v1.routers import (
    cv_router,
    ws_router,
    user_router,
    curriculum_files_router,
    auth_router,
)
router = APIRouter()

router.include_router(cv_router, prefix="/curriculums")
router.include_router(ws_router, prefix="/ws")
router.include_router(user_router, prefix="/users")
router.include_router(curriculum_files_router, prefix="/curriculum-files")
router.include_router(auth_router, prefix="/auth")





