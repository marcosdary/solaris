from fastapi import APIRouter

from app.api.v1.routers import router_cv, router_ws

router = APIRouter()

router.include_router(router_cv, prefix="/cv")
router.include_router(router_ws, prefix="/ws")



