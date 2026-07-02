from fastapi import APIRouter

from app.api.v1.routers import cv_router, ws_router, jobs_router

router = APIRouter()

router.include_router(cv_router, prefix="/cv")
router.include_router(ws_router, prefix="/ws")
router.include_router(jobs_router, prefix="/jobs")



