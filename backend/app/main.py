from fastapi import FastAPI
from app.api.v1.endpoints import applications

app = FastAPI()
app.include_router(applications.router, prefix="/api/v1")
