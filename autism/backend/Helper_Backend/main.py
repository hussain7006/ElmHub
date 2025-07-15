# =======================================
# ✅ VERSION 1 — FIXED FPS PLAYBACK (RECOMMENDED)
# Student sends ~25 fps
# Specialist receives exactly 20 fps (smooth, no skipping)
# =======================================
from fastapi import APIRouter, HTTPException, Depends, Request

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import StreamingResponse
from collections import defaultdict, deque
from typing import Dict
import asyncio
import time
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from fastapi.responses import HTMLResponse

##APIs Imports
from apis.webcam_stream_handler import router as webcam_stream_handler_router



app = FastAPI()


app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


app.include_router(webcam_stream_handler_router, prefix="", tags=["session"])

    
  




# =======================================
# 🔁 VERSION 2 — ADAPTIVE DELAY (EARLIER IDEA)
# Slight dynamic delay based on buffer fill ratio
# May adjust viewer's playback speed a little
# =======================================

# @app.get("/stream-adaptive")
# async def stream_to_specialist_adaptive(session_id: str):
#     async def frame_generator():
#         boundary = "--frame"
#         buffer = frame_buffers[session_id]
#         default_delay = 0.1  # 10 fps
#         last_frame = None

#         # Wait until buffer has a minimum to prevent jitter start
#         while len(buffer) < 10:
#             await asyncio.sleep(0.05)

#         while True:
#             if buffer:
#                 frame = buffer.popleft()
#                 last_frame = frame
#             elif last_frame:
#                 frame = last_frame
#             else:
#                 await asyncio.sleep(default_delay)
#                 continue

#             yield (
#                 f"{boundary}\r\n"
#                 f"Content-Type: image/jpeg\r\n"
#                 f"Content-Length: {len(frame)}\r\n\r\n"
#             ).encode() + frame + b"\r\n"

#             # Adjust delay based on how full the buffer is (try to smooth playback)
#             fill_ratio = len(buffer) / buffer.maxlen
#             dynamic_delay = default_delay * (1 - fill_ratio * 0.5)  # Slightly reduce delay if buffer is full
#             await asyncio.sleep(dynamic_delay)

#     return StreamingResponse(
#         frame_generator(),
#         media_type="multipart/x-mixed-replace; boundary=frame"
#     )
