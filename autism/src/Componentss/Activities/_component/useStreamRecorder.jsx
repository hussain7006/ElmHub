import { useEffect, useRef } from "react";
import { aiServer } from "../../../config/url";

const useStreamRecorder = (
  isGameActive,
  objectRef,
  session_id,
  activity_id
) => {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const objectMetaBuffer = useRef([]);
  const recordingTimestamp = useRef(null);
  const frameCounter = useRef(0);
  const chunkCounter = useRef(0);
  const intervalRef = useRef(null);
  const shouldRecord = useRef(false);
  const apiCalledCounter = useRef(0);

  useEffect(() => {
    const setupStreamAndRecorder = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: false,
      });
      videoRef.current.srcObject = stream;

      const startNewRecording = () => {
        if (!shouldRecord.current) return;
        objectMetaBuffer.current = [];
        frameCounter.current = 0;
        recordingTimestamp.current = Date.now();

        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: "video/webm",
        });
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = async (e) => {
          if (e.data.size > 0) {
            const formData = new FormData();
            formData.append("user_id", 1);
            formData.append("session_id", session_id);
            formData.append("activity_id", activity_id);
            formData.append("screen_width", window.innerWidth);
            formData.append("screen_height", window.innerHeight);

            formData.append("counter", chunkCounter.current);

            formData.append("chunk", e.data);
            formData.append(
              "object_meta",
              JSON.stringify(objectMetaBuffer.current)
            );

            (async () => {
              try {
                apiCalledCounter.current += 1;
                const controller = new AbortController();
                const timeout = setTimeout(() => controller.abort(), 8000);
                if (!shouldRecord.current) {
                  throw new Error("Expier");
                }

                await fetch(`${aiServer}/upload`, {
                  method: "POST",
                  body: formData,
                  signal: controller.signal,
                });
                clearTimeout(timeout);
              } catch (err) {
                console.error("Upload failed", err);
              } finally {
                apiCalledCounter.current -= 1;
              }
            })();

            // await fetch(
            //   `${aiServer}/final?userid=1&chunkCounter=${chunkCounter.current}`,
            //   { method: "GET" }
            // );

            chunkCounter.current += 1;
            mediaRecorderRef.current = null;
            if (shouldRecord.current) {
              setTimeout(startNewRecording, 200); // ✅ only restart if still allowed
            }
          }
        };

        mediaRecorder.start();
        setTimeout(() => {
          if (mediaRecorder.state === "recording") {
            mediaRecorder.stop();
          }
        }, 5000);
      };

      intervalRef.current = setInterval(() => {
        if (objectRef.current) {
          const rect = objectRef.current.getBoundingClientRect();
          objectMetaBuffer.current.push({
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
            // screen_width: window.innerWidth,
            // screen_height: window.innerHeight,
            timestamp: Date.now() - recordingTimestamp.current,
          });
        }
      }, 200);

      startNewRecording(); // start the first one
    };

    if (isGameActive) {
      shouldRecord.current = true;
      setupStreamAndRecorder();
    } else {
      shouldRecord.current = false;
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      clearInterval(intervalRef.current);
    }

    return () => {
      shouldRecord.current = false;
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      clearInterval(intervalRef.current);
    };
  }, [isGameActive]);
  const onCompleteActivity = async (GameScores) => {
    shouldRecord.current = false;
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    clearInterval(intervalRef.current);
    while (apiCalledCounter.current > 0) {
      await new Promise((res) => setTimeout(res, 1000));
    }
    const formData = new FormData();
    formData.append("user_id", 1);
    formData.append("score", GameScores.score);
    formData.append("total_time", GameScores.time);
    formData.append("session_id", GameScores.session_id);
    formData.append("activity_id", GameScores.activity_id);
    formData.append("game", GameScores.game);
    formData.append("correctselection", GameScores.correctselection);
    formData.append("wrongselection", GameScores.wrongselection);

    await fetch(`${aiServer}/finish_activity`, {
      method: "POST",
      body: formData,
    });
    return true;
  };
  return { videoRef, onCompleteActivity };
};

export default useStreamRecorder;
