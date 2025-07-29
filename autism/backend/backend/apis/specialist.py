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
from report_generator.report2 import generate_pdf_from_named_data
import httpx
from openai import OpenAI

router = APIRouter(prefix="/specialist", tags=["specialist"])


@router.post("/activities")
async def post_activities(
    request: Request,
    db: sqlite3.Connection = Depends(get_db),
    user=Depends(get_current_user),
):

    if user["role"] != "specialist":
        raise HTTPException(
            status_code=403, detail="Only specialist can create activites."
        )

    body = await request.json()

    required_fields = ["title", "description"]
    missing_fields = [field for field in required_fields if not body.get(field)]

    if missing_fields:
        raise HTTPException(
            status_code=400,
            detail=f"Missing required fields: {', '.join(missing_fields)}",
        )
    cursor = db.cursor()

    cursor.execute(
        """
        INSERT INTO activities (title, description)
        VALUES (?, ?)
    """,
        (body.get("title"), body.get("description")),
    )

    db.commit()
    return {"message": "Activity created successfully"}


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

    if user["role"] == "specialist":
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
    sp.language,
    sp.bio,
    sp.specialization
FROM users u
INNER JOIN spec_profiles sp ON u.id = sp.user_id
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

        if user["role"] != "specialist":
            raise HTTPException(
                status_code=403, detail="Only specialist can update his profile."
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
        "bio",
        "specialization",
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
       UPDATE spec_profiles
        SET 
            first_name = ?,
            last_name = ?,
            phone_num = ?,
            language = ?,
            bio = ?,
            specialization = ?
        WHERE user_id = ?;
    """,
        (
            body.get("first_name"),
            body.get("last_name"),
            body.get("phone_num"),
            body.get("language"),
            body.get("bio"),
            body.get("specialization"),
            body.get("user_id"),
        ),
    )

    db.commit()
    if cursor.rowcount == 0:
        raise HTTPException(
            status_code=404, detail="Profile not found for this specialist."
        )
    return {"message": "Profile Updated"}


def activity_exists(id: str, db):
    cursor = db.cursor()
    cursor.execute("SELECT 1 FROM activities WHERE id = ?", (id,))  # Fixed tuple
    return cursor.fetchone() is not None


@router.post("/service")
async def create_service(
    request: Request,
    db: sqlite3.Connection = Depends(get_db),
    user=Depends(get_current_user),
):
    try:
        if user["role"] != "specialist":
            raise HTTPException(
                status_code=403, detail="Only specialists can create a service."
            )

        body = await request.json()
        body["user_id"] = user["sub"]
    except Exception as e:
        print(f"Request Error: {e}")
        raise HTTPException(status_code=400, detail="Body format not correct.")

    required_fields = ["title", "description", "activity"]
    missing_fields = [field for field in required_fields if not body.get(field)]

    if missing_fields:
        raise HTTPException(
            status_code=400,
            detail=f"Missing required fields: {', '.join(missing_fields)}",
        )

    cursor = db.cursor()

    cursor.execute(
        """
        INSERT INTO services (spec_id, title, description)
        VALUES (?, ?, ?)
        """,
        (body["user_id"], body["title"], body["description"]),
    )

    service_id = cursor.lastrowid

    unknown_activities = []
    for activity_id in body["activity"]:
        if activity_exists(activity_id, db):
            cursor.execute(
                """
                INSERT INTO service_activities (service_id, activity_id)
                VALUES (?, ?)
                """,
                (service_id, activity_id),
            )
        else:
            unknown_activities.append(activity_id)

    db.commit()

    return {
        "message": "Service Created",
        "unknown_activities": unknown_activities or None,
    }


@router.get("/service")
def get_services(
    db: sqlite3.Connection = Depends(get_db), user=Depends(get_current_user)
):
    try:
        if user["role"] != "specialist":
            raise HTTPException(
                status_code=403, detail="Only specialists can create a service."
            )

    except Exception as e:
        print(f"Request Error: {e}")
        raise HTTPException(status_code=400, detail="Body format not correct.")
    cursor = db.cursor()

    cursor.execute(
        """
SELECT 
    s.id AS service_id,
    s.title AS service_title,
    s.description AS service_description,
    a.id AS activity_id,
    a.title AS activity_title,
    a.description AS activity_description,
    sa.is_required,
    sa.activity_order
FROM services s
INNER JOIN service_activities sa ON s.id = sa.service_id
INNER JOIN activities a ON sa.activity_id = a.id
WHERE s.spec_id = ? AND s.del = 0
ORDER BY s.id, sa.activity_order;
""",
        (user["sub"]),
    )
    rows = cursor.fetchall()
    services = {}
    for row in rows:
        service_id, s_title, s_desc, a_id, a_title, a_desc, is_required, order = row
        if service_id not in services:
            services[service_id] = {
                "service_id": service_id,
                "title": s_title,
                "description": s_desc,
                "activities": [],
            }
        services[service_id]["activities"].append(
            {
                "id": a_id,
                "title": a_title,
                "description": a_desc,
            }
        )
    nested_services = list(services.values())

    return {"services": nested_services}


@router.put("/service/{service_id}")
async def update_service(
    service_id: int,
    # title: str,
    # description: str,
    request: Request,
    db: sqlite3.Connection = Depends(get_db),
    user=Depends(get_current_user),
):
    try:
        try:
            if user["role"] != "specialist":
                raise HTTPException(
                    status_code=403, detail="Only specialists can PUT a service."
                )

            body = await request.json()
            body["user_id"] = user["sub"]
        except Exception as e:
            print(f"Request Error: {e}")
            raise HTTPException(status_code=400, detail="Body format not correct.")

        required_fields = ["title", "description"]
        missing_fields = [field for field in required_fields if not body.get(field)]

        if missing_fields:
            raise HTTPException(
                status_code=400,
                detail=f"Missing required fields: {', '.join(missing_fields)}",
            )

        cursor = db.cursor()
        cursor.execute(
            """
            UPDATE services
            SET title = ?, description = ?
            WHERE id = ? AND spec_id = ?
            """,
            (body["title"], body["description"], service_id, user["sub"]),
        )
        db.commit()

        if cursor.rowcount == 0:
            raise HTTPException(
                status_code=404, detail="Service not found or unauthorized."
            )

        return {"message": "Service updated successfully."}

    except Exception as e:
        print(f"Request Error: {e}")
        raise HTTPException(status_code=400, detail="Failed to update service.")


@router.delete("/service/{service_id}")
async def del_service(
    service_id: int,
    # title: str,
    # description: str,
    request: Request,
    db: sqlite3.Connection = Depends(get_db),
    user=Depends(get_current_user),
):
    try:
        try:
            if user["role"] != "specialist":
                raise HTTPException(
                    status_code=403, detail="Only specialists can DEL a service."
                )

            body = await request.json()
            body["user_id"] = user["sub"]
        except Exception as e:
            print(f"Request Error: {e}")
            raise HTTPException(status_code=400, detail="Body format not correct.")

        cursor = db.cursor()
        cursor.execute(
            """
            UPDATE services
            SET del = 1
            WHERE id = ? AND spec_id = ?
            """,
            (service_id, user["sub"]),
        )
        db.commit()

        if cursor.rowcount == 0:
            raise HTTPException(
                status_code=404, detail="Service not found or unauthorized."
            )

        return {"message": "Service deleted successfully."}

    except Exception as e:
        print(f"Request Error: {e}")
        raise HTTPException(status_code=400, detail="Failed to del service.")


@router.post("/service/{service_id}/activities")
async def add_activities_to_service(
    service_id: int,
    # activities: list,  # List of activity dicts [{activity_id, is_required, activity_order}, ...]
    request: Request,
    db: sqlite3.Connection = Depends(get_db),
    user=Depends(get_current_user),
):
    try:
        try:
            if user["role"] != "specialist":
                raise HTTPException(
                    status_code=403, detail="Only specialists can PUT a service."
                )

            body = await request.json()
            body["user_id"] = user["sub"]
        except Exception as e:
            print(f"Request Error: {e}")
            raise HTTPException(status_code=400, detail="Body format not correct.")

        required_fields = ["activities"]
        missing_fields = [field for field in required_fields if not body.get(field)]

        if missing_fields:
            raise HTTPException(
                status_code=400,
                detail=f"Missing required fields: {', '.join(missing_fields)}",
            )

        cursor = db.cursor()
        unknown_activities = []
        for activity in body["activities"]:
            if activity_exists(activity, db):
                cursor.execute(
                    """
                    INSERT INTO service_activities (service_id, activity_id)
                    VALUES (?, ?)
                    """,
                    (service_id, activity),
                )
            else:
                unknown_activities.append(activity)

        db.commit()
        return {
            "message": "Activities added successfully.",
            "unknown_activities": unknown_activities,
        }

    except Exception as e:
        print(f"Request Error: {e}")
        raise HTTPException(status_code=400, detail="Failed to add activities.")


@router.delete("/service/{service_id}/activities")
async def del_activities_to_service(
    service_id: int,
    # activities: list,  # List of activity dicts [{activity_id, is_required, activity_order}, ...]
    request: Request,
    db: sqlite3.Connection = Depends(get_db),
    user=Depends(get_current_user),
):
    try:
        try:
            if user["role"] != "specialist":
                raise HTTPException(
                    status_code=403, detail="Only specialists can PUT a service."
                )

            body = await request.json()
            body["user_id"] = user["sub"]
        except Exception as e:
            print(f"Request Error: {e}")
            raise HTTPException(status_code=400, detail="Body format not correct.")

        required_fields = ["activities"]
        missing_fields = [field for field in required_fields if not body.get(field)]

        if missing_fields:
            raise HTTPException(
                status_code=400,
                detail=f"Missing required fields: {', '.join(missing_fields)}",
            )

        cursor = db.cursor()
        for activity in body["activities"]:

            cursor.execute(
                """
                DELETE FROM service_activities
                WHERE service_id = ? AND activity_id = ?
                """,
                (service_id, activity),
            )

        db.commit()
        return {
            "message": "Activities deleted successfully.",
        }

    except Exception as e:
        print(f"Request Error: {e}")
        raise HTTPException(status_code=400, detail="Failed to del activities.")


# Sessions Start #
@router.get("/sessions/get_parent")
def get_parents_details(
    email: str = None,
    db: sqlite3.Connection = Depends(get_db),
    user=Depends(get_current_user),
):
    cursor = db.cursor()

    if user["role"] == "specialist":
        cursor.execute(
            """SELECT 
    p.user_id AS parent_id,
    u.email AS parent_email,
    p.first_name AS parent_first_name,
    p.last_name AS parent_last_name,
    p.phone_num AS parent_phone,
    p.language AS parent_language,
    
    c.user_id AS child_id,
    c.first_name AS child_first_name,
    c.last_name AS child_last_name,
    c.phone_num AS child_phone,
    c.language AS child_language
FROM parent_profiles p
INNER JOIN users u ON p.user_id = u.id
LEFT JOIN child_profiles c ON p.user_id = c.parent_id
WHERE u.email = ?;""",
            (email,),
        )
        # profile = cursor.fetchall()
        rows = cursor.fetchall()
        services = {}
        for row in rows:
            (
                parent_id,
                parent_email,
                parent_first_name,
                parent_last_name,
                parent_phone,
                parent_language,
                child_id,
                child_first_name,
                child_last_name,
                child_phone,
                child_language,
            ) = row
            if parent_id not in services:
                services[parent_id] = {
                    "parent_id": parent_id,
                    "parent_email": parent_email,
                    "parent_first_name": parent_first_name,
                    "parent_last_name": parent_last_name,
                    "parent_phone": parent_phone,
                    "parent_language": parent_language,
                    "childs": [],
                }
            services[parent_id]["childs"].append(
                {
                    "child_id": child_id,
                    "child_first_name": child_first_name,
                    "child_last_name": child_last_name,
                }
            )
        nested_services = list(services.values())

    return {
        "parents": nested_services,
    }


@router.post("/sessions")
async def create_sessions(
    request: Request,
    db: sqlite3.Connection = Depends(get_db),
    user=Depends(get_current_user),
):
    try:
        if user["role"] != "specialist":
            raise HTTPException(
                status_code=403, detail="Only specialists can create a sessions."
            )

        body = await request.json()
        body["user_id"] = user["sub"]
    except Exception as e:
        print(f"Request Error: {e}")
        raise HTTPException(status_code=400, detail="Body format not correct.")

    required_fields = [
        "service_id",
        "child_id",
        "parent_id",
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
            body["user_id"],
            body["child_id"],
            body["parent_id"],
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
        if user["role"] != "specialist":
            raise HTTPException(
                status_code=403, detail="Only specialists can get a sessions."
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
          se.id AS service_id,
        se.title AS service_title,
        se.description AS service_description,
        up.user_id AS parent_id,
        up.first_name AS parent_first_name,
        up.last_name AS parent_last_name,
        up.phone_num AS parent_phone,

        cp.user_id AS child_id,
        cp.first_name AS child_first_name,
        cp.last_name AS child_last_name,
        cp.phone_num AS child_phone,

        a.id AS activity_id,
        a.title AS activity_title,
        a.description AS activity_description,
        sba.is_completed

    FROM sessions s
    LEFT JOIN services se ON s.service_id = se.id
    
    LEFT JOIN parent_profiles up ON s.parent_id = up.user_id
    LEFT JOIN child_profiles cp ON s.child_id = cp.user_id
    LEFT JOIN session_booked_activities sba ON s.id = sba.session_id
    LEFT JOIN activities a ON sba.activity_id = a.id
    LEFT JOIN child_profiles c ON s.child_id = c.user_id
    WHERE s.spec_id = ?
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
                "service": {
                    "id": row["service_id"],
                    "title": row["service_title"],
                    "description": row["service_description"],
                },
                "parent": {
                    "id": row["parent_id"],
                    "first_name": row["parent_first_name"],
                    "last_name": row["parent_last_name"],
                    "phone": row["parent_phone"],
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


@router.patch("/sessions/{session_id}")
async def update_session(
    session_id: int,
    db: sqlite3.Connection = Depends(get_db),
    user=Depends(get_current_user),
):
    try:

        if user["role"] != "specialist":
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


@router.get("/sessions/{session_id}/alerts")
def get_session_alerts(session_id: int, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()

    cursor.execute(
        "SELECT * FROM session_activities_record where session_id=?  ORDER BY booked_activity_id DESC",
        (session_id,),
    )
    profile = cursor.fetchall()

    # profile = dict(profile)

    return {
        "alerts": profile,
    }


@router.post("/sessions/{session_id}/alerts")
async def post_session_alert(
    session_id: int,
    request: Request,
    db: sqlite3.Connection = Depends(get_db),
    user=Depends(get_current_user),
):

    body = await request.json()

    required_fields = ["alert_type", "title", "message", "intensity", "accuracy"]
    missing_fields = [field for field in required_fields if not body.get(field)]

    if missing_fields:
        raise HTTPException(
            status_code=400,
            detail=f"Missing required fields: {', '.join(missing_fields)}",
        )
    cursor = db.cursor()

    cursor.execute(
        """
        INSERT INTO session_activities_record (session_id, alert_type, title,message, intensity,accuracy )
        VALUES (?, ?,?, ?,?, ?)
    """,
        (
            session_id,
            body.get("alert_type"),
            body.get("title"),
            body.get("message"),
            body.get("intensity"),
            body.get("accuracy"),
        ),
    )

    db.commit()
    return {"message": "Alert created successfully"}


input_data = {
    "cover": {
        "top_label": "منصة مركز التميز للتوحد",
        "heading": "تقرير جلسة تقييم الذكاء الاصطناعي",
        "platform_label": "المنصة: مركز التميز للتوحد - Elm",
        "intro": (
            "يستعرض هذا التقرير مراجعة دقيقة لجلسة التقييم بناءً على البيانات التي تم جمعها باستخدام "
            "تقنيات الذكاء الاصطناعي. يتضمن التحليل تتبع التفاعلات، وقياس معدل التركيز والاستجابة، ورصد "
            "الحركات والسلوكيات الطبيعية، مما يساهم في فهم نمط استجابة الطفل. كما يوفر التقرير توصيات "
            "تهدف إلى تحسين تجربة الطفل وتطوير استراتيجيات الدعم المناسبة بهدف تحقيق بيئة تعليمية "
            "وإدراكية أكثر فعالية."
        ),
    },
    "session": {
        "top_label": "منصة مركز التميز للتوحد",
        "title": "ملخص الجلسة",
        "child_info": {
            "child_name": "خالد عبدالعزيز محمد",
            "age": "7 سنوات",
            "gender": "ذكر",
            "severity": "توحد متوسطة",
            "speech": "توحد متوسط",
            "date": "21/02/2025",
            "time": "10:10 A.M.",
            "duration": "30 دقيقة",
        },
        "behavior_observed": "يظهر سلوكيات البكاء والاستلقاء على الأرض عند رفض طلب أو إجباره على المشي",
        "session_summary_heading": "ملخص الجلسة",
        "session_summary_text": (
            """تمت مراقبة سلوكيات الطفل خلال الجلسة باستخدام الذكاء الاصطناعي وتحليل الحركات المرصودة 
وتفاعل الطفل مع الأنشطة المختلفة. أظهرت الجلسة بعض التحديات في إدارة المشاعر، حيث تم 
تسجيل تعبيرات سلبية مثل الصراخ والبكاء، مع تكرار حركات الهروب والضرب، مما يشير إلى حاجة 
لدعم إضافي في إدارة الانفعالات. تمت ملاحظة سلوكيات الطفل خلال الجلسة باستخدام الذكاء 
الاصطناعي وتحليل الحركات المرصودة وتفاعل الطفل مع الأنشطة المختلفة. أظهرت الجلسة بعض 
التحديات في إدارة المشاعر، حيث تم تسجيل تعبيرات سلبية مثل الصراخ والبكاء، مع تكرار حركات 
الهروب والضرب، مما يشير إلى حاجة لدعم إضافي في إدارة الانفعالات. لدعم إضافي في إدارة الانفعالات.

تمت مراقبة سلوكيات الطفل خلال الجلسة باستخدام الذكاء الاصطناعي وتحليل الحركات المرصودة 
وتفاعل الطفل مع الأنشطة المختلفة. أظهرت الجلسة بعض التحديات في إدارة المشاعر، حيث تم 
تسجيل تعبيرات سلبية مثل الصراخ والبكاء، مع تكرار حركات الهروب والضرب، تسجيل تعبيرات سلبية 
مثل الصراخ والبكاء، مع تكرار حركات الهروب والضرب.
"""
        ),
        "analysis_heading": "النتائج التحليلية",
        "analysis_items": [
            "عدد الأنشطة المكتملة: 12 من أصل 20",
            "زمن التكرار السلوكي: 240.34 ثانية",
            "زمن التركيز والانتباه: 3 دقائق",
            "أكثر حركة متكررة: تحريك اليدين",
        ],
    },
    "observations": {"heading": "تحليل السلوكيات والملاحظات"},
    "recommendations": {"heading": "التوصيات والملاحظات النهائية"},
}


def get_session_id(session_id, db):

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
        se.description AS service_description,
        up.user_id AS parent_id,
        up.first_name AS parent_first_name,
        up.last_name AS parent_last_name,
        up.phone_num AS parent_phone,

        cp.user_id AS child_id,
        cp.first_name AS child_first_name,
        cp.last_name AS child_last_name,
        cp.phone_num AS child_phone,

        a.id AS activity_id,
        a.title AS activity_title,
        a.description AS activity_description,
        sba.is_completed

    FROM sessions s
    LEFT JOIN services se ON s.service_id = se.id
    
    LEFT JOIN parent_profiles up ON s.parent_id = up.user_id
    LEFT JOIN child_profiles cp ON s.child_id = cp.user_id
    LEFT JOIN session_booked_activities sba ON s.id = sba.session_id
    LEFT JOIN activities a ON sba.activity_id = a.id
    LEFT JOIN child_profiles c ON s.child_id = c.user_id
    WHERE s.id = ?
""",
        (session_id,),
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
                "service": {
                    "id": row["service_id"],
                    "title": row["service_title"],
                    "description": row["service_description"],
                },
                "parent": {
                    "id": row["parent_id"],
                    "first_name": row["parent_first_name"],
                    "last_name": row["parent_last_name"],
                    "phone": row["parent_phone"],
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

    return nested_services[0]


async def fetch_activity_info(session_id: int, activity_ids: list, user_id: int):
    print("in fetch_activity_info")
    url = os.getenv("AUTISM_AI_SERVER", "http://autism-ai-server:8002/get_activity_info")
    print("--------------------------------")
    print("fetch_activity_info")
    print("url:", url)
    print("--------------------------------")
    data = {"user_id": user_id, "session_id": session_id, "activity_ids": activity_ids}

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, json=data, timeout=30.0)
            print('response:', response)
            response.raise_for_status()  # Raises exception for HTTP errors (4xx, 5xx)
            result = response.json()
            print('gaze_data structure:', json.dumps(result, indent=2))
            return result
        except httpx.HTTPStatusError as exc:
            print(f"Error response {exc.response.status_code}: {exc.response.text}")
            return None
        except httpx.RequestError as exc:
            print(f"Request error: {exc}")
            return None


client = OpenAI(
    # This is the default and can be omitted
    api_key=os.getenv("OPENAI_API_KEY")
)

# Debug: Check if API key is loaded
api_key = os.getenv("OPENAI_API_KEY")
if api_key:
    print(f"OpenAI API key loaded: {api_key[:20]}...{api_key[-10:] if len(api_key) > 30 else 'short'}")
else:
    print("OpenAI API key not found!")

# Define the system and user messages
system_prompt = "You are a Gaze Behavior Analysis Doctor who specializes in cognitive psychology and human-computer interaction. You analyze student performance in digital games using eye-tracking data and behavioral metrics. Your role is to produce expert-level notes and feedback about the student’s attention, decision-making, focus, and behavioral patterns, based on the provided structured JSON data. Respond in Arabic language."

system_prompt_arb = "أنت طبيب تحليل سلوك النظر متخصص في علم النفس المعرفي وتفاعل الإنسان مع الكمبيوتر. تحلل أداء الطلاب في الألعاب الرقمية باستخدام بيانات تتبع العينات والمقاييس السلوكية. دورك هو إنتاج ملاحظات وتغذية راجعة على مستوى الخبراء حول انتباه الطالب، واتخاذ القرارات، والتركيز، وأنماط السلوك، بناءً على بيانات JSON المنظمة المقدمة. استجب باللغة العربية."


@router.post("/complete_session/{session_id}")
async def close_sessions(
    session_id: int,
    request: Request,
    db: sqlite3.Connection = Depends(get_db),
    user=Depends(get_current_user),
):

    if user["role"] != "specialist":
        raise HTTPException(
            status_code=403, detail="Only specialists can close a sessions."
        )
    body = await request.json()
    body["user_id"] = user["sub"]
    required_fields = ["comments"]
    missing_fields = [field for field in required_fields if not body.get(field)]

    if missing_fields:
        raise HTTPException(
            status_code=400,
            detail=f"Missing required fields: {', '.join(missing_fields)}",
        )

    temp = get_session_id(session_id, db)
    input_temp = input_data
    input_temp["session"]["title"] = temp["service"]["title"]
    input_temp["session"]["child_info"]["child_name"] = (
        temp["child"]["first_name"] + " " + temp["child"]["last_name"]
    )
    input_temp["session"]["child_info"]["age"] = "7 year"
    input_temp["session"]["child_info"]["gender"] = "Male"
    try:
        dt = datetime.strptime(temp["date_of_session"], "%Y-%m-%d %H:%M:%S.%f")
    except ValueError:
        dt = datetime.strptime(temp["date_of_session"], "%Y-%m-%d %H:%M:%S")
    input_temp["session"]["child_info"]["date"] = dt.date()
    input_temp["session"]["child_info"]["time"] = dt.strftime("%H:%M")
    input_temp["session"]["behavior_observed"] = body.get("comments")
    gaze_data = await fetch_activity_info(session_id, temp["activities"], 1)
    
    # Debug: Print activity information
    print(f"Session ID: {session_id}")
    print(f"Activities: {temp['activities']}")
    print(f"Gaze data received: {gaze_data is not None}")
    
    # Handle case when AI server is not available
    if gaze_data is None:
        report = "Unable to generate report: AI server is not available. Please try again later."
        print("AI server not available, using fallback report")
    else:
        # Check if the expected data structure exists
        if "data" not in gaze_data:
            report = "Unable to generate report: Invalid data structure received from AI server."
            print("Invalid data structure - no 'data' key found in gaze_data")
        elif not gaze_data["data"]:
            report = "Unable to generate report: No activity data available from AI server."
            print("No activity data available in gaze_data['data']")
        else:
            # Get the first available activity data
            available_activity_ids = list(gaze_data["data"].keys())
            first_activity_id = available_activity_ids[0] if available_activity_ids else None
            
            if first_activity_id is None:
                report = "Unable to generate report: No valid activity data found."
                print("No valid activity ID found in gaze_data['data']")
            else:
                print(f"Using activity data for ID: {first_activity_id}")
                user_prompt = f"""
                Analyze the following JSON data and provide behavioral and cognitive observations in a report format.

                ```json
                {json.dumps(gaze_data["data"][first_activity_id], indent=2)}
                """
                try:
                    # Try with gpt-4o first
                    try:
                        response = client.responses.create(
                            model="gpt-4o",
                            instructions=system_prompt,
                            input=user_prompt,
                        )
                        report = response.output_text
                    except Exception as e1:
                        print(f"GPT-4o failed: {e1}")
                        # Fallback to gpt-3.5-turbo with chat completions
                        response = client.chat.completions.create(
                            model="gpt-3.5-turbo",
                            messages=[
                                {"role": "system", "content": system_prompt},
                                {"role": "user", "content": user_prompt}
                            ],
                            max_tokens=1500,
                            temperature=0.3
                        )
                        report = response.choices[0].message.content
                    
                    print(report)
                except Exception as e:
                    print(f"OpenAI API error: {e}")
                    report = f"Unable to generate AI report due to API error: {str(e)}. Please check your OpenAI API key and try again."
    input_temp["session"]["session_summary_text"] = report
    pdf_path = await generate_pdf_from_named_data(session_id, input_temp)
    # print(temp)

    cursor = db.cursor()
    cursor.execute(
        """
        UPDATE sessions
        SET status = 'completed', end_time = CURRENT_TIMESTAMP, comments = ?, report_path = ?
        WHERE id = ?
        """,
        (
            body.get("comments"),
            pdf_path,
            session_id,
        ),
    )
    db.commit()

    if cursor.rowcount == 0:
        raise HTTPException(
            status_code=404, detail="Session not found or unauthorized."
        )
    return {"message": "Session complete"}


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
