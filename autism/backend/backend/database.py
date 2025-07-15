import sqlite3
import os
from fastapi import Depends

# Use environment variable for database URL, fallback to local path
DATABASE_URL = os.getenv("DATABASE_URL", "./autism_db.db")

def get_db():
    db = sqlite3.connect(DATABASE_URL, check_same_thread=False)
    db.row_factory = sqlite3.Row  # So you can access rows like dicts: row["column"]
    try:
        yield db
    finally:
        db.close()
