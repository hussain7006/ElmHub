from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import StreamingResponse
from collections import defaultdict, deque
from typing import Dict, Set
import asyncio
import time
from fastapi.responses import HTMLResponse
router = APIRouter()

frame_buffers: Dict[str, deque] = defaultdict(lambda: deque(maxlen=60))
last_frame_time: Dict[str, float] = {}  # Optional for debugging
active_websockets: Set[str] = set()  # Track active WebSocket connections

### Web Socket (To handle the connection b/w Child & Server)

@router.websocket("/ws/stream/{session_id}")
async def stream_from_student(websocket: WebSocket, session_id: str):
    await websocket.accept()
    print(f"[WebSocket] Student Connected - Session: {session_id}")
    active_websockets.add(session_id)
    
    # Initialize buffer for this session if it doesn't exist
    if session_id not in frame_buffers:
        frame_buffers[session_id] = deque(maxlen=60)
        print(f"[WebSocket] Created new buffer for session: {session_id}")

    try:
        frame_count = 0
        while True:
            frame = await websocket.receive_bytes()
            frame_count += 1
            
            # Add frame to buffer
            frame_buffers[session_id].append(frame)
            last_frame_time[session_id] = time.time()
            
    except WebSocketDisconnect:
        print(f"[WebSocket] Student Disconnected - Session: {session_id}")
        active_websockets.discard(session_id)
    except Exception as e:
        print(f"[WebSocket] Error in session {session_id}: {str(e)}")
        active_websockets.discard(session_id)
        raise

@router.get("/stream")
async def stream_to_specialist_adaptive(session_id: str):
    async def frame_generator():
        boundary = "--frame"
        buffer = frame_buffers[session_id]
        default_delay = 0.1  # 10 fps
        last_frame = None

        # Wait until buffer has a minimum to prevent jitter start
        while len(buffer) < 10:
            await asyncio.sleep(0.05)

        while True:
            if buffer:
                frame = buffer.popleft()
                last_frame = frame
            elif last_frame:
                frame = last_frame
            else:
                await asyncio.sleep(default_delay)
                continue

            yield (
                f"{boundary}\r\n"
                f"Content-Type: image/jpeg\r\n"
                f"Content-Length: {len(frame)}\r\n\r\n"
            ).encode() + frame + b"\r\n"

            # Adjust delay based on how full the buffer is (try to smooth playback)
            fill_ratio = len(buffer) / buffer.maxlen
            dynamic_delay = default_delay * (1 - fill_ratio * 0.5)  # Slightly reduce delay if buffer is full
            await asyncio.sleep(dynamic_delay)

    return StreamingResponse(
        frame_generator(),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )

@router.get("/student", response_class=HTMLResponse)
def read_main():
    html_content = """
   <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <title>Webcam Stream Sender</title>
        </head>
        <body>
          <h2>Live Webcam Stream</h2>
          <video id="video" autoplay playsinline width="500" height="500"></video>
          <br />
          <button id="start-btn">Start Streaming</button>
          <p id="status">Status: Not connected</p>

          <script>
            const sessionId = "abc123";
            const WS_URL = `ws://${location.host}/ws/stream/${sessionId}`;
            let ws = null;
            let intervalId = null;

            const video = document.getElementById("video");

            document.getElementById("start-btn").onclick = async () => {
              if (ws && ws.readyState === WebSocket.OPEN) return;

              // Request webcam access
              try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                video.srcObject = stream;
                document.getElementById("status").innerText = "Webcam started. Connecting to server...";

                ws = new WebSocket(WS_URL);

                ws.onopen = () => {
                  document.getElementById("status").innerText = "Connected. Streaming webcam frames...";
                  startSendingFrames();
                };

                ws.onclose = () => {
                  clearInterval(intervalId);
                  document.getElementById("status").innerText = "Disconnected.";
                };

                ws.onerror = (err) => {
                  console.error("WebSocket error:", err);
                  clearInterval(intervalId);
                  document.getElementById("status").innerText = "Error. See console.";
                };
              } catch (err) {
                console.error("Failed to access webcam:", err);
                document.getElementById("status").innerText = "Failed to access webcam.";
              }
            };

            function startSendingFrames() {
              const canvas = document.createElement("canvas");
              canvas.width = 500;
              canvas.height = 500;
              const ctx = canvas.getContext("2d");

              intervalId = setInterval(() => {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                canvas.toBlob((blob) => {
                  if (ws.readyState === WebSocket.OPEN) {
                    blob.arrayBuffer().then(buffer => {
                      ws.send(buffer);
                      console.log("Sent webcam frame | Size:", buffer.byteLength);
                    });
                  }
                }, "image/jpeg");
              }, 33); // ~30 FPS (1000ms / 30 ≈ 33ms)
            }
          </script>
        </body>
        </html>


    """
    return HTMLResponse(content=html_content)



@router.get("/specialist", response_class=HTMLResponse)
def read_main():
    html_content = """
   <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <title>Live Stream Viewer</title>
        </head>
        <body>
          <h2>Specialist View: MJPEG Stream</h2>
          <p>Streaming from session <b>abc123</b></p>
          <img id="stream" src="/stream?session_id=abc123" width="500" height="500" alt="Live stream loading..." />
        </body>
        </html>
    """
    return HTMLResponse(content=html_content)

@router.get("/video")
async def stream_to_frontend(session_id: str):
    """
    Stream video to frontend with proper CORS headers and MJPEG format
    """
    print(f"[Video Stream] Request received for session: {session_id}")
    
    # Check if there's an active WebSocket connection for this session
    if session_id not in active_websockets:
        print(f"[Video Stream] No active WebSocket connection for session: {session_id}")
        raise HTTPException(status_code=404, detail="No active stream connection")
    
    if session_id not in frame_buffers:
        print(f"[Video Stream] No buffer found for session: {session_id}")
        raise HTTPException(status_code=404, detail="Session not found")
    
    print(f"[Video Stream] Buffer size: {len(frame_buffers[session_id])}")
    
    async def frame_generator():
        try:
            buffer = frame_buffers[session_id]
            default_delay = 0.1  # 10 fps
            last_frame = None
            frame_count = 0

            # Wait until buffer has a minimum to prevent jitter start
            print(f"[Video Stream] Waiting for buffer to fill... Current size: {len(buffer)}")
            while len(buffer) < 10:
                await asyncio.sleep(0.05)
                if session_id not in active_websockets:
                    print(f"[Video Stream] WebSocket connection lost for session: {session_id}")
                    return

            print("[Video Stream] Starting frame generation")
            while True:
                try:
                    if session_id not in active_websockets:
                        print(f"[Video Stream] WebSocket connection lost for session: {session_id}")
                        return

                    if buffer:
                        frame = buffer.popleft()
                        last_frame = frame
                        frame_count += 1
                        if frame_count % 30 == 0:  # Log every 30 frames
                            print(f"[Video Stream] Sent {frame_count} frames")
                    elif last_frame:
                        frame = last_frame
                    else:
                        print("[Video Stream] No frames available, waiting...")
                        await asyncio.sleep(default_delay)
                        continue

                    yield (
                        f"--frame\r\n"
                        f"Content-Type: image/jpeg\r\n"
                        f"Content-Length: {len(frame)}\r\n\r\n"
                    ).encode() + frame + b"\r\n"

                    # Adjust delay based on buffer fullness
                    fill_ratio = len(buffer) / buffer.maxlen
                    dynamic_delay = default_delay * (1 - fill_ratio * 0.5)
                    await asyncio.sleep(dynamic_delay)
                except Exception as e:
                    print(f"[Video Stream] Error in frame generation: {str(e)}")
                    await asyncio.sleep(default_delay)
                    continue
        except Exception as e:
            print(f"[Video Stream] Fatal error in stream: {str(e)}")
            raise

    return StreamingResponse(
        frame_generator(),
        media_type="multipart/x-mixed-replace; boundary=frame",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Access-Control-Allow-Origin": "*",  # Allow CORS
            "Access-Control-Allow-Methods": "GET",
            "Access-Control-Allow-Headers": "Content-Type",
            "X-Accel-Buffering": "no",  # Disable proxy buffering
        }
    )