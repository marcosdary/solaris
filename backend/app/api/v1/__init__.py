from fastapi import APIRouter

from app.api.v1.routers import router_cv, router_ws, router_jobs

router = APIRouter()

router.include_router(router_cv, prefix="/cv")
router.include_router(router_ws, prefix="/ws")
router.include_router(router_jobs, prefix="/jobs")



