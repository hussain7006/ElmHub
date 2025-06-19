from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

print(settings.MONGO_URI)
print(settings.DB_NAME)
client = AsyncIOMotorClient(settings.MONGO_URI)
db = client[settings.DB_NAME]
