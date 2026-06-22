from celery import Celery
from datetime import timedelta

from app.config.settings import get_settings

settings = get_settings()

celery_app = Celery(
    "worker",
    broker=f"{settings.REDIS_URL}/0",
    backend=f"{settings.REDIS_URL}/1",
    include=[
        "app.tasks.save_jobs_in_db_task",
    ]
)

celery_app.conf.beat_schedule = {
    'save-jobs-in-db': {
        "task": "app.tasks.save_jobs_in_db_task",
        "schedule": timedelta(minutes=5),
        "args": ()
    }
}

