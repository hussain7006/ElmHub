from app.db.mongodb import db

async def get_data():
    data = []
    cursor = db["apps"].find({})
    async for doc in cursor:
        print(doc)
        doc["_id"] = str(doc["_id"])
        data.append(doc)
    return data
