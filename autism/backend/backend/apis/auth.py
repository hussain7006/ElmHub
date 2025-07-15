from typing import Annotated, Literal, Union
from fastapi import APIRouter, Body, Depends, HTTPException, Request, Response
from pydantic import BaseModel, Field
from middleware import get_current_user
from utils.token import create_access_token
from database import get_db
import hashlib
import sqlite3

router = APIRouter(prefix="/auth", tags=["Auth"])


class LoginInput(BaseModel):
    email: str | None = None
    username: str | None = None
    password: str


class ChildCreate(BaseModel):
    parent_id: int
    username: str
    password: str
    first_name: str
    last_name: str
    phone_num: str
    language: str


class BaseSignup(BaseModel):
    email: str
    username: str | None = None
    password: str
    first_name: str
    last_name: str
    phone_num: str
    language: str
    type: str  # This field will act as the discriminator


class ParentSignup(BaseSignup):
    type: Literal["parent"] = Field("parent", frozen=True)


class SpecialistSignup(BaseSignup):
    type: Literal["specialist"] = Field("specialist", frozen=True)
    bio: str
    specialization: str


class ChildCreate(BaseModel):
    parent_id: int
    email: str
    password: str
    first_name: str
    last_name: str
    phone_num: str
    language: str


def user_exists(email: str, db):
    cursor = db.cursor()
    cursor.execute(
        "SELECT 1 FROM users WHERE email = ? OR username = ?", (email, email)
    )
    return cursor.fetchone() is not None


@router.post("/signup")
async def signup_parent(
    request: Request,
    db: sqlite3.Connection = Depends(get_db),
):
    body = await request.json()
    user_type = body.get("type")
    if (
        not body.get("first_name")
        or not body.get("last_name")
        or not body.get("phone_num")
        or not body.get("language")
    ):
        raise HTTPException(
            status_code=400,
            detail="Missing required fields for parent: first_name, last_name, phone_num, language",
        )
    if user_type == "parent":
        try:
            data = ParentSignup(**body)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid parent data: {e}")
    elif user_type == "specialist":
        if not body.get("bio") or not body.get("specialization"):
            raise HTTPException(
                status_code=400,
                detail="Missing required fields for specialist:  bio, specialization",
            )
        try:

            data = SpecialistSignup(**body)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid specialist data: {e}")
    else:
        raise HTTPException(
            status_code=400,
            detail="Invalid type. Must be 'parent' or 'specialist'",
        )

    if user_exists(data.email, db):
        raise HTTPException(status_code=400, detail="Email already exists")

    cursor = db.cursor()
    cursor.execute(
        """
        INSERT INTO users (email, username, password, role)
        VALUES (?, ?, ?, ?)
        """,
        (data.email, data.username, data.password, data.type),
    )
    user_id = cursor.lastrowid

    if isinstance(data, ParentSignup):
        cursor.execute(
            """
            INSERT INTO parent_profiles (user_id, first_name, last_name, phone_num, language)
            VALUES (?, ?, ?, ?, ?)
            """,
            (user_id, data.first_name, data.last_name, data.phone_num, data.language),
        )
    else:  # SpecialistSignup
        cursor.execute(
            """
            INSERT INTO spec_profiles (user_id, bio, specialization, first_name, last_name, phone_num, language)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                user_id,
                data.bio,
                data.specialization,
                data.first_name,
                data.last_name,
                data.phone_num,
                data.language,
            ),
        )
    db.commit()
    return {"message": "Registered successfully"}


@router.post("/child_register")
async def create_child(
    request: Request,
    db: sqlite3.Connection = Depends(get_db),
    user=Depends(get_current_user),
):
    if user["role"] != "parent":
        raise HTTPException(
            status_code=403, detail="Only parents can create child accounts."
        )

    body = await request.json()
    body["parent_id"] = user["sub"]

    required_fields = [
        "parent_id",
        "first_name",
        "last_name",
        "username",
        "password",
        "phone_num",
        "language",
    ]
    missing_fields = [field for field in required_fields if not body.get(field)]

    if missing_fields:
        raise HTTPException(
            status_code=400,
            detail=f"Missing required fields: {', '.join(missing_fields)}",
        )
    cursor = db.cursor()
    # data = ChildCreate(**body)
    cursor.execute("SELECT 1 FROM users WHERE username = ?", (body.get("username"),))
    if cursor.fetchone():
        raise HTTPException(status_code=400, detail="Username already exists")

    # Insert into users table (email will be NULL for children)
    cursor.execute(
        """
        INSERT INTO users (email, username, password, role)
        VALUES (?, ?, ?, 'child')
    """,
        (None, body.get("username"), body.get("password")),
    )
    user_id = cursor.lastrowid

    # Insert into child_profiles
    cursor.execute(
        """
        INSERT INTO child_profiles (user_id, parent_id, first_name, last_name, phone_num, language)
        VALUES (?, ?, ?, ?, ?, ?)
    """,
        (
            user_id,
            body.get("parent_id"),
            body.get("first_name"),
            body.get("last_name"),
            body.get("phone_num"),
            body.get("language"),
        ),
    )

    db.commit()
    return {"message": "Child created successfully"}


@router.post("/login")
def login(
    data: LoginInput, response: Response, db: sqlite3.Connection = Depends(get_db)
):
    cursor = db.cursor()

    # Determine if it's a child login or parent/spec
    cursor.execute(
        "SELECT * FROM users WHERE username = ? OR email = ?",
        (
            data.email,
            data.email,
        ),
    )

    user = cursor.fetchone()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Assuming password is hashed
    if not data.password == user["password"]:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    # Fetch profile based on role
    profile = {}
    if user["role"] == "parent":
        cursor.execute("SELECT * FROM parent_profiles WHERE user_id = ?", (user["id"],))
        profile = cursor.fetchone()
    elif user["role"] == "specialist":
        cursor.execute("SELECT * FROM spec_profiles WHERE user_id = ?", (user["id"],))
        profile = cursor.fetchone()
    elif user["role"] == "child":
        cursor.execute("SELECT * FROM child_profiles WHERE user_id = ?", (user["id"],))
        profile = cursor.fetchone()
    profile = dict(profile)
    token = create_access_token(
        data={"sub": str(user["id"]), "role": user["role"], "profile": profile}
    )

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        max_age=36000,
        samesite="Lax",
        secure=False,
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "role": user["role"],
        "profile": profile,
    }


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie("access_token")
    return {"message": "Logged out successfully"}
