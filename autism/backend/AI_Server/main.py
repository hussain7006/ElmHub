from collections import defaultdict
import io
import math
from flask import Flask, jsonify, request
from flask_cors import CORS
import os, json
import cv2
import mediapipe as mp
import numpy as np
import av
import json
from PIL import Image

# Act as a Gaze Behavior Analysis Doctor
# Write Cognitive and Behavioral Observations about student behaviour

app = Flask(__name__)
CORS(app)

UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
user_object_data = {}
user_gaze_data = {}

calibration_points = defaultdict(list)

mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(
    min_detection_confidence=0.5, min_tracking_confidence=0.5, refine_landmarks=True
)


# For Web to BE stream
@app.route("/upload", methods=["POST"])
def upload_chunk():
    user_id = request.form.get("user_id")
    session_id = request.form.get("session_id")
    activity_id = request.form.get("activity_id")
    screen_width = request.form.get("screen_width")
    screen_height = request.form.get("screen_height")

    chunk = request.files.get("chunk")
    object_meta = request.form.get("object_meta")
    counter = request.form.get("counter")
    if not user_id or not chunk:
        return {"error": "Missing data"}, 400
    video_buffer = io.BytesIO(chunk.read())
    data_list = json.loads(object_meta)

    results = match_gaze(
        video_buffer,
        data_list,
        user_id=user_id,
        width=screen_width,
        height=screen_height,
        chunkCounter=counter,
        session_id=session_id,
        activity_id=activity_id,
    )

    return {"status": results}


# When Activity will be finished
@app.route("/finish_activity", methods=["POST"])
def finish_activity():
    try:
        user_id = request.form.get("user_id")
        game = request.form.get("game")
        score = request.form.get("score")
        total_time = request.form.get("total_time")
        session_id = request.form.get("session_id")
        activity_id = request.form.get("activity_id")
        correctselection = request.form.get("correctselection")
        wrongselection = request.form.get("wrongselection")
        output_filename = f"data_{user_id}_{session_id}_{activity_id}.json"
        existing_data = {}
        with open(output_filename, "r") as f:
            existing_data = json.load(f)

        # Update metadata
        existing_data["game"] = game
        existing_data["score"] = score
        existing_data["total_time"] = total_time
        existing_data["correctselection"] = correctselection
        existing_data["wrongselection"] = wrongselection

        # Merge gaze and object data
        temp_gaze = existing_data.get("temp_gaze_data", [])
        object_data = existing_data.get("object_data", [])
        merged_data = merge_gaze_object_data(temp_gaze, object_data)

        existing_data["merged_gaze_object"] = merged_data

        existing_data.pop("temp_gaze_data")
        existing_data.pop("object_data")
        existing_data.pop("object_data_count")
        existing_data.pop("temp_gaze_data_count")
        existing_data.pop("chunk")

        with open(output_filename, "w") as json_file:
            json.dump(existing_data, json_file, indent=4)
    except:
        return {"status": "Failed"}

    return {"status": "OK"}


# When Activity will be finished
@app.route("/get_activity_info", methods=["POST"])
def get_activity_info():
    try:
        data = request.get_json()
        user_id = data.get("user_id")
        session_id = data.get("session_id")
        activity_ids = data.get("activity_ids")

        print("User ID:", user_id)
        print("Session ID:", session_id)
        # print("Activity IDs:", activity_ids)

        totalData = {}

        for activity in activity_ids:
            activity_id = activity["id"]
            output_filename = f"data_{user_id}_{session_id}_{activity_id}.json"
            if os.path.exists(output_filename):
                with open(output_filename, "r") as f:
                    existing_data = json.load(f)
                    totalData[activity_id] = existing_data

        return {"status": "OK", "data": totalData}

    except Exception as e:
        print("Error:", e)
        return {"status": "Failed"}


def merge_gaze_object_data(temp_gaze, object_data, tolerance=200):
    merged_data = []
    used_object_indices = set()

    for gaze_entry in temp_gaze:
        gaze_ts = gaze_entry["timestamp"]
        closest_obj = None
        min_diff = tolerance + 1
        closest_index = -1

        for idx, obj in enumerate(object_data):
            if idx in used_object_indices:
                continue
            diff = abs(gaze_ts - obj["timestamp"])
            if diff <= tolerance and diff < min_diff:
                min_diff = diff
                closest_obj = obj
                closest_index = idx

        if closest_obj:
            merged_data.append(
                {
                    "timestamp": gaze_ts,
                    "gaze": gaze_entry["gaze"],
                    "yaw": gaze_entry["yaw"],
                    "pitch": gaze_entry["pitch"],
                    "roll": gaze_entry["roll"],
                    "object": {
                        "x": closest_obj["x"],
                        "y": closest_obj["y"],
                        "width": closest_obj["width"],
                        "height": closest_obj["height"],
                        "timestamp": closest_obj["timestamp"],
                    },
                }
            )
            used_object_indices.add(closest_index)

    return merged_data


# When Configure frame will be sent
@app.route("/capture", methods=["POST"])
def capture():
    global calibration_points

    user_id = request.form.get("user_id")
    image_file = request.files.get("image")
    calibration_targets = request.form.get("calibrationTargets")
    width = request.form.get("width")
    height = request.form.get("height")

    if not image_file or not calibration_targets or not width or not height:
        return jsonify({"error": "Missing required data"}), 400

    # Convert inputs
    try:
        width, height = int(width), int(height)
        target_x, target_y = map(float, calibration_targets.split(","))
    except Exception as e:
        return jsonify({"error": f"Invalid input format: {str(e)}"}), 400

    # Read image
    npimg = np.frombuffer(image_file.read(), np.uint8)
    frame = cv2.imdecode(npimg, cv2.IMREAD_COLOR)
    if frame is None:
        return jsonify({"error": "Invalid image format"}), 400

    # Process image
    frame = cv2.flip(frame, 1)
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = face_mesh.process(rgb_frame)
    print("width", width, "height", height)
    print("framex", frame.shape[0], "framey", frame.shape[1])

    if results.multi_face_landmarks:
        for face_landmarks in results.multi_face_landmarks:
            left_iris = face_landmarks.landmark[468]
            right_iris = face_landmarks.landmark[473]

            iris_center = (
                (left_iris.x + right_iris.x) / 2 * frame.shape[1],
                (left_iris.y + right_iris.y) / 2 * frame.shape[0],
            )

            target_px = (int(target_x * frame.shape[1]), int(target_y * frame.shape[0]))

            calibration_points[user_id].append((iris_center, target_px))
    print("calibration_points", calibration_points)
    return jsonify(
        {
            "status": "success",
            "points_collected": len(calibration_points[user_id]),
            "last_point": {
                "iris_center": iris_center if results.multi_face_landmarks else None,
                "target_pixel": target_px if results.multi_face_landmarks else None,
            },
        }
    )


# When Reset the configure for user
@app.route("/reset", methods=["GET"])
def reset():
    user_id = request.args.get("userid", default=1)  # Optional param with default

    global calibration_points

    calibration_points[user_id] = []
    return jsonify(
        {
            "status": "success",
        }
    )


def map_gaze_to_screen(iris_center, screen_width, screen_height, user_id):
    points = calibration_points[user_id]
    if not points:
        return int(iris_center[0]), int(iris_center[1])

    min_eye_x = min(p[0][0] for p in points)
    max_eye_x = max(p[0][0] for p in points)
    min_eye_y = min(p[0][1] for p in points)
    max_eye_y = max(p[0][1] for p in points)

    range_x = max_eye_x - min_eye_x or 1e-6
    range_y = max_eye_y - min_eye_y or 1e-6

    norm_x = (iris_center[0] - min_eye_x) / range_x
    norm_y = (iris_center[1] - min_eye_y) / range_y

    screen_x = int(norm_x * screen_width)
    screen_y = int(norm_y * screen_height)

    return screen_x, screen_y


# When Check the Frame after Config
@app.route("/health", methods=["GET"])
def health_check():
    """Simple health check endpoint for Docker"""
    return jsonify({"status": "healthy", "service": "ai-server"}), 200

@app.route("/status", methods=["GET"])
def status():
    """Status endpoint for debugging"""
    return jsonify({
        "status": "running",
        "service": "ai-server",
        "port": 8003,
        "endpoints": [
            "/health (GET) - Health check",
            "/check (POST) - Gaze analysis",
            "/upload (POST) - Upload video chunk",
            "/capture (POST) - Capture frame",
            "/finish_activity (POST) - Finish activity",
            "/get_activity_info (POST) - Get activity info",
            "/reset (GET) - Reset calibration"
        ]
    }), 200

@app.route("/check", methods=["POST"])
def check():
    global calibration_points

    user_id = request.form.get("user_id")
    image_file = request.files.get("image")
    width = request.form.get("width")
    height = request.form.get("height")

    try:
        width = int(width)
        height = int(height)
    except Exception:
        return jsonify({"error": "Invalid width or height"}), 400

    if not image_file:
        return jsonify({"error": "Image is required"}), 400

    # Read image
    npimg = np.frombuffer(image_file.read(), np.uint8)
    frame = cv2.imdecode(npimg, cv2.IMREAD_COLOR)
    print("width", width, "height", height)
    print("framex", frame.shape[0], "framey", frame.shape[1])
    if frame is None:
        return jsonify({"error": "Invalid image format"}), 400

    # Process image
    frame = cv2.flip(frame, 1)
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = face_mesh.process(rgb_frame)

    if results.multi_face_landmarks:
        for face_landmarks in results.multi_face_landmarks:
            left_iris = face_landmarks.landmark[468]
            right_iris = face_landmarks.landmark[473]

            iris_center = (
                (left_iris.x + right_iris.x) / 2 * frame.shape[1],
                (left_iris.y + right_iris.y) / 2 * frame.shape[0],
            )
            print("iris_center", iris_center)
            screen_x, screen_y = map_gaze_to_screen(iris_center, width, height, user_id)
            print("screen_x, screen_y", screen_x, screen_y)

            # Map screen point to actual display coordinates (scaled back to image space)
            display_x = int(screen_x * frame.shape[1] / width)
            display_y = int(screen_y * frame.shape[0] / height)
            print("display_x, display_y", display_x, display_y)

            return jsonify(
                {
                    "status": "success",
                    "point_x": display_x,
                    "point_y": display_y,
                }
            )

    return jsonify({"status": "no_face_detected"}), 200


def get_angle(p1, p2):
    return math.degrees(math.atan2(p2[1] - p1[1], p2[0] - p1[0]))


def get_gaze_point(pil_image, user_id, width, height):
    try:
        width = int(width)
        height = int(height)
    except Exception:
        return {"status": False, "error": "Invalid width or height"}

    if pil_image is None:
        return {"status": False, "error": "Image is required"}

    frame = cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)
    frame = cv2.flip(frame, 1)
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = face_mesh.process(rgb_frame)
    if results.multi_face_landmarks:
        for face_landmarks in results.multi_face_landmarks:
            left_iris = face_landmarks.landmark[468]
            right_iris = face_landmarks.landmark[473]

            iris_center = (
                (left_iris.x + right_iris.x) / 2 * frame.shape[1],
                (left_iris.y + right_iris.y) / 2 * frame.shape[0],
            )

            screen_x, screen_y = map_gaze_to_screen(iris_center, width, height, user_id)

            display_x = int(screen_x * frame.shape[1] / width)
            display_y = int(screen_y * frame.shape[0] / height)
            # Get points for pose estimation
            left_eye_outer = face_landmarks.landmark[33]
            right_eye_outer = face_landmarks.landmark[263]
            # For the blink
            nose_tip = face_landmarks.landmark[1]
            chin = face_landmarks.landmark[152]

            # Convert normalized points to image coordinates
            def lm_to_pt(lm):
                return np.array([lm.x * frame.shape[1], lm.y * frame.shape[0]])

            eye_left = lm_to_pt(left_eye_outer)
            eye_right = lm_to_pt(right_eye_outer)
            nose = lm_to_pt(nose_tip)
            chin = lm_to_pt(chin)

            # Calculate angles
            roll = get_angle(eye_left, eye_right)  # left-right tilt
            yaw = get_angle(nose, (eye_left + eye_right) / 2)  # horizontal rotation
            pitch = get_angle(nose, chin)  # vertical tilt

            return {
                "status": True,
                "point_x": display_x,
                "point_y": display_y,
                "yaw": yaw,
                "pitch": pitch,
                "roll": roll,
            }

    return {"status": False}


def match_gaze(
    video_buffer,
    object_data,
    user_id,
    width,
    height,
    chunkCounter,
    session_id,
    activity_id,
):
    container = av.open(video_buffer)
    video_stream = container.streams.video[0]
    matches = []
    counterA = 0
    temp_gaze_data = []
    for frame in container.decode(video=0):
        counterA += 1

        if frame.pts is None:
            continue

        frame_time_ms = float(frame.pts * video_stream.time_base * 1000)  # in ms
        img = frame.to_image()
        result = get_gaze_point(img, user_id=user_id, width=width, height=height)
        if not result["status"]:
            continue

        temp_gaze_data.append(
            {
                "timestamp": frame_time_ms + float(chunkCounter) * 5000,
                "gaze": [result["point_x"], result["point_y"]],
                "yaw": result["yaw"],
                "pitch": result["pitch"],
                "roll": result["roll"],
            }
        )
    for i in range(len(object_data)):
        object_data[i]["timestamp"] = (
            object_data[i]["timestamp"] + float(chunkCounter) * 5000
        )

    # output_data = {
    #     "user_id": user_id,
    #     "chunk": chunkCounter,
    #     "temp_gaze_data_count": len(temp_gaze_data),
    #     "object_data_count": len(object_data),
    #     "temp_gaze_data": temp_gaze_data,
    #     "object_data": object_data,
    # }

    # output_filename = f"data_{user_id}_{chunkCounter}.json"
    # with open(output_filename, "w") as json_file:
    #     json.dump(output_data, json_file, indent=4)
    save_merged_data(
        user_id,
        chunkCounter,
        temp_gaze_data,
        object_data,
        session_id,
        activity_id,
        width,
        height,
    )

    return matches


def save_merged_data(
    user_id,
    chunkCounter,
    temp_gaze_data,
    object_data,
    session_id,
    activity_id,
    width,
    height,
):

    output_filename = f"data_{user_id}_{session_id}_{activity_id}.json"

    if os.path.exists(output_filename) and int(chunkCounter) > 0:
        with open(output_filename, "r") as f:
            existing_data = json.load(f)

        # Merge existing data with new data
        merged_temp_gaze = existing_data.get("temp_gaze_data", []) + temp_gaze_data
        merged_object_data = existing_data.get("object_data", []) + object_data
        game = existing_data.get("game", "")
        score = existing_data.get("score", 0)
        total_time = existing_data.get("total_time", 0)
        correctselection = existing_data.get("correctselection", 0)
        wrongselection = existing_data.get("wrongselection", 0)
    else:
        # No file exists yet
        merged_temp_gaze = temp_gaze_data
        merged_object_data = object_data
        game = ""
        score = 0
        total_time = 0
        correctselection = 0
        wrongselection = 0

    output_data = {
        "user_id": user_id,
        "session_id": session_id,
        "activity_id": activity_id,
        "game": game,
        "score": score,
        "total_time": total_time,
        "correctselection": correctselection,
        "wrongselection": wrongselection,
        "chunk": chunkCounter,
        "screen_width": str(width) + "px",
        "screen_height": str(height) + "px",
        "temp_gaze_data_count": len(merged_temp_gaze),
        "object_data_count": len(merged_object_data),
        "temp_gaze_data": merged_temp_gaze,
        "object_data": merged_object_data,
    }

    with open(output_filename, "w") as json_file:
        json.dump(output_data, json_file, indent=4)

    return {"status": "merged", "file": output_filename}


if __name__ == "__main__":
    app.run(debug=False, host='0.0.0.0', port=8003, threaded=True)
