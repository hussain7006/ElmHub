from typing import Annotated, Literal, Union
from fastapi import APIRouter, Body, Depends, HTTPException, Request, Response
from pydantic import BaseModel, Field
from middleware import get_current_user
from utils.token import create_access_token
from database import get_db
import hashlib
import sqlite3
import json
from datetime import datetime

router = APIRouter(prefix="/child", tags=["child"])


@router.get("/profile")
def get_profile(
    db: sqlite3.Connection = Depends(get_db),
    user=Depends(get_current_user),
):
    cursor = db.cursor()

    profile = {}

    if user["role"] == "child":
        cursor.execute(
            """SELECT 
    u.id,
    u.email,
    u.username,
    u.role,
    u.created_at,
    sp.first_name,
    sp.last_name,
    sp.phone_num,
    sp.language
FROM users u
INNER JOIN child_profiles sp ON u.id = sp.user_id
WHERE u.id = ?""",
            (user["sub"],),
        )
        profile = cursor.fetchone()

    return {
        "profile": profile,
    }


@router.post("/profile")
async def update_profile(
    request: Request,
    db: sqlite3.Connection = Depends(get_db),
    user=Depends(get_current_user),
):
    body = {}
    try:

        if user["role"] != "child":
            raise HTTPException(
                status_code=403, detail="Only child can update his profile."
            )

        body = await request.json()

        body["user_id"] = user["sub"]
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail="Body format not correct.")
    required_fields = [
        "user_id",
        "first_name",
        "last_name",
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

    cursor.execute(
        """
       UPDATE child_profiles
        SET 
            first_name = ?,
            last_name = ?,
            phone_num = ?,
            language = ?
        WHERE user_id = ?;
    """,
        (
            body.get("first_name"),
            body.get("last_name"),
            body.get("phone_num"),
            body.get("language"),
            body.get("user_id"),
        ),
    )

    db.commit()
    if cursor.rowcount == 0:
        raise HTTPException(
            status_code=404, detail="Profile not found for this specialist."
        )
    return {"message": "Profile Updated"}


@router.get("/sessions")
def get_sessions(
    db: sqlite3.Connection = Depends(get_db), user=Depends(get_current_user)
):
    try:
        if user["role"] != "child":
            raise HTTPException(
                status_code=403, detail="Only parent can get a sessions."
            )

    except Exception as e:
        print(f"Request Error: {e}")
        raise HTTPException(status_code=400, detail="Body format not correct.")
    cursor = db.cursor()

    cursor.execute(
        """
 SELECT 
        s.id AS session_id,
        s.description AS session_description,
        s.date_of_session,
        s.start_time,
        s.end_time,
        s.status,
        se.id AS service_id,
        se.title AS service_title,
        sp.user_id AS spec_id,
        sp.first_name AS spec_first_name,
        sp.last_name AS spec_last_name,
        sp.phone_num AS spec_phone,



        a.id AS activity_id,
        a.title AS activity_title,
        a.description AS activity_description,
        sba.is_completed

    FROM sessions s
    INNER JOIN services se ON s.service_id = se.id
   INNER JOIN spec_profiles sp ON s.spec_id = sp.user_id
    INNER JOIN session_booked_activities sba ON s.id = sba.session_id
    INNER JOIN activities a ON sba.activity_id = a.id
    WHERE s.child_id = ? ORDER BY s.id DESC
""",
        (user["sub"]),
    )
    rows = cursor.fetchall()
    sessions = {}
    for row in rows:
        sid = row["session_id"]
        if sid not in sessions:
            sessions[sid] = {
                "id": sid,
                "description": row["session_description"],
                "date_of_session": row["date_of_session"],
                "start_time": row["start_time"],
                "end_time": row["end_time"],
                "status": row["status"],
                "service_title": row["service_title"],
                "specialist": {
                    "id": row["spec_id"],
                    "first_name": row["spec_first_name"],
                    "last_name": row["spec_last_name"],
                    "phone": row["spec_phone"],
                },
                "activities": [],
            }

        if row["activity_id"]:
            sessions[sid]["activities"].append(
                {
                    "id": row["activity_id"],
                    "title": row["activity_title"],
                    "description": row["activity_description"],
                    "is_completed": bool(row["is_completed"]),
                }
            )
    nested_services = list(sessions.values())

    return {"sessions": nested_services}


@router.patch("/sessions/{session_id}")
async def update_session(
    session_id: int,
    db: sqlite3.Connection = Depends(get_db),
    user=Depends(get_current_user),
):
    try:

        if user["role"] != "child":
            raise HTTPException(
                status_code=403, detail="Only specialists can PUT a session."
            )

        cursor = db.cursor()
        cursor.execute(
            """
            UPDATE sessions
            SET status = 'ongoing', start_time = CURRENT_TIMESTAMP
            WHERE id = ?
            """,
            (session_id,),
        )
        db.commit()

        if cursor.rowcount == 0:
            raise HTTPException(
                status_code=404, detail="Session not found or unauthorized."
            )

        return {"message": "Session updated successfully."}

    except Exception as e:
        print(f"Request Error: {e}")
        raise HTTPException(status_code=400, detail="Failed to update Session.")


@router.patch("/complete_activity/{session_id}/{activity_id}")
async def complete_activity(
    session_id: int,
    activity_id: int,
    db: sqlite3.Connection = Depends(get_db),
    user=Depends(get_current_user),
):
    try:

        if user["role"] != "child":
            raise HTTPException(status_code=403, detail="Only chils can PUT a session.")

        cursor = db.cursor()
        cursor.execute(
            """
            UPDATE session_booked_activities
            SET is_completed = 1
            WHERE activity_id = ? AND session_id = ?
            """,
            (
                activity_id,
                session_id,
            ),
        )
        db.commit()

        if cursor.rowcount == 0:
            raise HTTPException(
                status_code=404, detail="Session not found or unauthorized."
            )

        return {"message": "Activity updated successfully."}

    except Exception as e:
        print(f"Request Error: {e}")
        raise HTTPException(status_code=400, detail="Failed to update Session.")


# Sessions End #
