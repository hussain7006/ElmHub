from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    MONGO_URI: str = "mongodb://localhost:27017"
    DB_NAME: str = "elmHub"

    class Config:
        env_file = ".env"

settings = Settings()
