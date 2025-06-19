from pydantic import BaseModel

class DataItem(BaseModel):
    id: str
    name: str
