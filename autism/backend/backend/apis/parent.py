import os
from typing import Annotated, Literal, Union
from fastapi import APIRouter, Body, Depends, HTTPException, Request, Response
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field
from middleware import get_current_user
from utils.token import create_access_token
from database import get_db
import hashlib
import sqlite3
import json
from datetime import datetime

router = APIRouter(prefix="/parent", tags=["parent"])


@router.get("/activities")
def get_activities(db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()

    cursor.execute("SELECT * FROM activities")
    profile = cursor.fetchall()

    # profile = dict(profile)

    return {
        "list": profile,
    }


@router.get("/profile")
def get_profile(
    db: sqlite3.Connection = Depends(get_db),
    user=Depends(get_current_user),
):
    cursor = db.cursor()

    profile = {}

    if user["role"] == "parent":
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
INNER JOIN parent_profiles sp ON u.id = sp.user_id
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

        if user["role"] != "parent":
            raise HTTPException(
                status_code=403, detail="Only parent can update his profile."
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
       UPDATE parent_profiles
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


@router.get("/child_profile")
def get_profile(
    db: sqlite3.Connection = Depends(get_db),
    user=Depends(get_current_user),
):
    cursor = db.cursor()

    # profile = {}

    if user["role"] == "parent":
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
FROM child_profiles sp
INNER JOIN users u ON u.id = sp.user_id
WHERE sp.parent_id = ?""",
            (user["sub"],),
        )
        profile = cursor.fetchall()

    return {
        "childs": profile,
    }


def activity_exists(id: str, db):
    cursor = db.cursor()
    cursor.execute("SELECT 1 FROM activities WHERE id = ?", (id,))  # Fixed tuple
    return cursor.fetchone() is not None


@router.get("/service")
def get_services(
    db: sqlite3.Connection = Depends(get_db), user=Depends(get_current_user)
):
    try:
        if user["role"] != "parent":
            raise HTTPException(
                status_code=403, detail="Only parent can get a service."
            )

    except Exception as e:
        print(f"Request Error: {e}")
        raise HTTPException(status_code=400, detail="Body format not correct.")
    cursor = db.cursor()

    cursor.execute(
        """
SELECT 
    s.id AS service_id,
    s.spec_id AS specialist_id,
    u.email AS specialist_email,
    sp.first_name AS specialist_first_name,
    sp.last_name AS specialist_last_name,
    s.title AS service_title,
    s.description AS service_description,
    a.id AS activity_id,
    a.title AS activity_title,
    a.description AS activity_description,
    sa.is_required,
    sa.activity_order
FROM services s
INNER JOIN users u ON s.spec_id = u.id
INNER JOIN spec_profiles sp ON s.spec_id = sp.user_id
INNER JOIN service_activities sa ON s.id = sa.service_id
INNER JOIN activities a ON sa.activity_id = a.id
WHERE s.del = 0
ORDER BY s.id, sa.activity_order;
"""
    )
    rows = cursor.fetchall()
    services = {}
    for row in rows:
        (
            service_id,
            spec_id,
            spec_email,
            spec_fname,
            spec_lname,
            s_title,
            s_desc,
            a_id,
            a_title,
            a_desc,
            is_required,
            order,
        ) = row
        if service_id not in services:
            services[service_id] = {
                "service_id": service_id,
                "specialist_id": spec_id,
                "specialist_email": spec_email,
                "specialist_fname": spec_fname,
                "specialist_lname": spec_lname,
                "title": s_title,
                "description": s_desc,
                "activities": [],
            }
        services[service_id]["activities"].append(
            {
                "activity_id": a_id,
                "title": a_title,
                "description": a_desc,
            }
        )
    nested_services = list(services.values())

    return {"services": nested_services}


@router.post("/sessions")
async def create_sessions(
    request: Request,
    db: sqlite3.Connection = Depends(get_db),
    user=Depends(get_current_user),
):
    try:
        if user["role"] != "parent":
            raise HTTPException(
                status_code=403, detail="Only parent can create a sessions."
            )

        body = await request.json()
        body["user_id"] = user["sub"]
    except Exception as e:
        print(f"Request Error: {e}")
        raise HTTPException(status_code=400, detail="Body format not correct.")

    required_fields = [
        "service_id",
        "child_id",
        "specialist_id",
        "description",
        "date_of_session",
        "activity",
    ]
    missing_fields = [field for field in required_fields if not body.get(field)]

    if missing_fields:
        raise HTTPException(
            status_code=400,
            detail=f"Missing required fields: {', '.join(missing_fields)}",
        )

    cursor = db.cursor()
    date_of_session = datetime.fromtimestamp((body["date_of_session"]) / 1000)
    cursor.execute(
        """
        INSERT INTO sessions (service_id, created_by, spec_id, child_id, parent_id, description, status, date_of_session)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            body["service_id"],
            body["user_id"],
            body["specialist_id"],
            body["child_id"],
            body["user_id"],
            body["description"],
            "upcoming",
            date_of_session,
        ),
    )

    session_id = cursor.lastrowid

    unknown_activities = []
    for activity_id in body["activity"]:
        if activity_exists(activity_id, db):
            cursor.execute(
                """
                INSERT INTO session_booked_activities (session_id, activity_id)
                VALUES (?, ?)
                """,
                (session_id, activity_id),
            )
        else:
            unknown_activities.append(activity_id)

    db.commit()

    return {
        "message": "Service Created",
        "unknown_activities": unknown_activities or None,
    }


@router.get("/sessions")
def get_sessions(
    db: sqlite3.Connection = Depends(get_db), user=Depends(get_current_user)
):
    try:
        if user["role"] != "parent":
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
        
        sp.user_id AS spec_id,
        sp.first_name AS spec_first_name,
        sp.last_name AS spec_last_name,
        sp.phone_num AS spec_phone,

        cp.user_id AS child_id,
        cp.first_name AS child_first_name,
        cp.last_name AS child_last_name,
        cp.phone_num AS child_phone,

        a.id AS activity_id,
        a.title AS activity_title,
        a.description AS activity_description,
        sba.is_completed,

        ser.title as service_title,
        ser.id as service_id

    FROM sessions s
    INNER JOIN services ser ON s.service_id = ser.id
   INNER JOIN spec_profiles sp ON s.spec_id = sp.user_id
    INNER JOIN child_profiles cp ON s.child_id = cp.user_id
    INNER JOIN session_booked_activities sba ON s.id = sba.session_id
    INNER JOIN activities a ON sba.activity_id = a.id
    WHERE s.parent_id = ?
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
                "service_id":row["service_id"],
                "service_title":row["service_title"],

                "specialist": {
                    "id": row["spec_id"],
                    "first_name": row["spec_first_name"],
                    "last_name": row["spec_last_name"],
                    "phone": row["spec_phone"],
                },
                "child": {
                    "id": row["child_id"],
                    "first_name": row["child_first_name"],
                    "last_name": row["child_last_name"],
                    "phone": row["child_phone"],
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


@router.get("/completed_sessions")
def get_completed_sessions(
    db: sqlite3.Connection = Depends(get_db), user=Depends(get_current_user)
):
    try:
        if user["role"] != "parent":
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
        s.report_path,
        s.comments,

        
        sp.user_id AS spec_id,
        sp.first_name AS spec_first_name,
        sp.last_name AS spec_last_name,
        sp.phone_num AS spec_phone,

        cp.user_id AS child_id,
        cp.first_name AS child_first_name,
        cp.last_name AS child_last_name,
        cp.phone_num AS child_phone,

        a.id AS activity_id,
        a.title AS activity_title,
        a.description AS activity_description,
        sba.is_completed,

        ser.title as service_title,
        ser.id as service_id


    FROM sessions s

    INNER JOIN services ser ON s.service_id = ser.id
    INNER JOIN spec_profiles sp ON s.spec_id = sp.user_id
    INNER JOIN child_profiles cp ON s.child_id = cp.user_id
    INNER JOIN session_booked_activities sba ON s.id = sba.session_id
    INNER JOIN activities a ON sba.activity_id = a.id
    WHERE s.parent_id = ? AND s.status = 'completed' ORDER BY s.id DESC
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
                "report_path": row["report_path"],
                "comments": row["comments"],
                 "service_id":row["service_id"],
                "service_title":row["service_title"],
                "specialist": {
                    "id": row["spec_id"],
                    "first_name": row["spec_first_name"],
                    "last_name": row["spec_last_name"],
                    "phone": row["spec_phone"],
                },
                "child": {
                    "id": row["child_id"],
                    "first_name": row["child_first_name"],
                    "last_name": row["child_last_name"],
                    "phone": row["child_phone"],
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


@router.post("/download-report")
async def download_report(request: Request, user=Depends(get_current_user)):
    # report_path = request_data.report_path
    body = await request.json()
    if not os.path.exists(body["report_path"]):
        raise HTTPException(status_code=404, detail="Report not found")

    filename = os.path.basename(body["report_path"])
    return FileResponse(
        path=body["report_path"],
        filename=filename,
        media_type="application/octet-stream",
    )


# Sessions End #
