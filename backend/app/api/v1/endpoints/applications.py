from fastapi import APIRouter
from app.crud.example_crud import get_data

router = APIRouter()

@router.get("/data")
async def fetch_data():
    print("fetching data")
    applications = await get_data()
    print(applications)
    return applications
