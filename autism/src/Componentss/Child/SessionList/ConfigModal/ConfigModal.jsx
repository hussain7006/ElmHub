import React, { useEffect, useRef, useState } from "react";
import { aiServer } from "../../../../config/url";

function FullScreenGazeCalibrator({ isConfigCompleted, onComplete }) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [greenPoints, setGreenPoints] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const instructions = [
    "Look at the top-left dot.",
    "Look at the top-right dot.",
    "Look at the center dot.",
    "Look at the bottom-left dot.",
    "Look at the bottom-right dot.",
  ];

  const calibrationTargets = [
    [0.2, 0.2],
    [0.8, 0.2],
    [0.5, 0.5],
    [0.2, 0.8],
    [0.8, 0.8],
  ];
  const reset = async () => {
    const resp = await fetch(`${aiServer}/reset`, {
      method: "GET",
    });
  };
  useEffect(() => {
    if (isOpen) reset();
  }, [isOpen]);
  // Start camera and listen for key events
  useEffect(() => {
    if (!isOpen) return;

    const startCamera = async () => {
      console.log("startCamera");
      console.log("navigator.mediaDevices:", navigator.mediaDevices);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera error:", err);
      }
    };

    const handleKey = (e) => {
      if (e.code === "Space") captureAndSend();
      if (e.code === "Escape") exitFlow();
    };

    startCamera();
    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("keydown", handleKey);
      if (videoRef.current?.srcObject instanceof MediaStream) {
        videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
      }
    };
  }, [isOpen, step]);

  const captureAndSend = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(async (blob) => {
        if (!blob) return;

        const formData = new FormData();
        formData.append("image", blob, `step_${step + 1}.png`);
        formData.append("calibrationTargets", calibrationTargets[step]);
        formData.append("width", window.innerWidth);
        formData.append("height", window.innerHeight);
        formData.append("user_id", 1);

        try {
          if (step >= instructions.length) {
            const resp = await fetch(`${aiServer}/check`, {
              method: "POST",
              body: formData,
            });
            const data = await resp.json();
            if (data.status === "success") {
              const { point_x, point_y } = data;
              console.log(data);
              setGreenPoints([point_x, point_y]);
            } else {
              setGreenPoints(null);
              console.warn("No face detected.");
            }
          } else {
            await fetch(`${aiServer}/capture`, {
              method: "POST",
              body: formData,
            });
            setStep((prev) => prev + 1);
          }
        } catch (err) {
          console.error("Failed to send image to API:", err);
        }
      }, "image/png");
    }
  };

  const exitFlow = () => {
    if (step >= instructions.length) onComplete();
    setIsOpen(false);
    setStep(0);
  };

  const dotPos = (() => {
    const [x, y] = calibrationTargets[step] || [0.5, 0.5];
    return {
      left: `${x * 100}%`,
      top: `${y * 100}%`,
    };
  })();

  return (
    <div>
      {!isConfigCompleted && (
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Start Calibration
        </button>
      )}

      <div
        className="fixed inset-0 z-50 bg-black"
        style={{ display: !isOpen ? "none" : "" }}
      >
        {/* Video Feed */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover absolute inset-0"
        />

        {/* Overlay: Red Dot */}
        {step < calibrationTargets.length && (
          <div
            className="absolute w-5 h-5 bg-red-600 rounded-full shadow-lg pointer-events-none"
            style={{
              left: `calc(${dotPos.left} - 10px)`,
              top: `calc(${dotPos.top} - 10px)`,
            }}
          />
        )}
        {greenPoints != null && (
          <div
            className="absolute w-5 h-5 bg-green-600 rounded-full shadow-lg pointer-events-none"
            style={{
              left: `calc(${greenPoints[0]}px - 10px)`,
              top: `calc(${greenPoints[1]}px - 10px)`,
            }}
          />
        )}
        {/* Overlay: Instruction Text */}
        <div className="absolute bottom-10 w-full text-center text-white text-xl font-semibold">
          {step < instructions.length
            ? `Step ${step + 1}: ${instructions[step]}`
            : "Capture Complete! Press Esc to exit."}
          <p className="text-sm mt-2 text-gray-300">Press Space to capture</p>
        </div>

        {/* Hidden canvas for capturing frames */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}

export default FullScreenGazeCalibrator;
