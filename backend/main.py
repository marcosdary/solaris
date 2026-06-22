from app.tasks import save_jobs_in_db_task


save_jobs_in_db_task.delay()

