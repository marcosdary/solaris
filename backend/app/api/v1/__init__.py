from fastapi import APIRouter

from app.api.v1.routers import (
    cv_router,
    ws_router,
    user_router,
)
router = APIRouter()

router.include_router(cv_router, prefix="/curriculums")
router.include_router(ws_router, prefix="/ws")
router.include_router(user_router, prefix="/users")





