import av
import json
from PIL import Image
import random

TOLERANCE = 0.1  # 10%


def get_gaze_point(img):
    return random.randint(800, 1000), random.randint(400, 650)


def match_gaze(video_path, object_data):
    container = av.open(video_path)
    video_stream = container.streams.video[0]
    matches = []
    counterA = 0
    counterB = 0
    counterC = 0
    FrameFocus = 0
    NotFrameFocus = 0

    for frame in container.decode(video=0):
        counterA += 1

        if frame.pts is None:
            continue

        frame_time = float(frame.pts * video_stream.time_base * 1000)  # in ms
        for obj in object_data:
            counterB += 1

            obj_time = float(obj["timestamp"])

            if abs(frame_time - obj_time) <= 50:  # ±50ms match
                counterC += 1
                img = frame.to_image()
                gx, gy = get_gaze_point(img)

                # Check if gaze is within ±10%
                screen_w, screen_h = obj["screen_width"], obj["screen_height"]
                tolerance_x = screen_w * TOLERANCE
                tolerance_y = screen_h * TOLERANCE

                if (
                    abs(gx - obj["x"]) <= tolerance_x
                    and abs(gy - obj["y"]) <= tolerance_y
                ):
                    FrameFocus += 1
                    matches.append(
                        {
                            "object_time": obj_time,
                            "frame_time": frame_time,
                            "gaze": (gx, gy),
                            "object": (obj["x"], obj["y"]),
                            "match": True,
                        }
                    )
                else:
                    NotFrameFocus += 1
                    matches.append(
                        {
                            "object_time": obj_time,
                            "frame_time": frame_time,
                            "gaze": (gx, gy),
                            "object": (obj["x"], obj["y"]),
                            "match": False,
                        }
                    )
    print(
        "counterA",
        counterA,
        "counterB",
        counterB,
        "counterC",
        counterC,
        "object_data",
        len(object_data),
    )
    print(
        "Num Focus",
        FrameFocus,
        "NotFrameFocus",
        NotFrameFocus,
    )
    return matches
