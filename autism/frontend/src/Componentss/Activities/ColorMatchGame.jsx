import { useState, useEffect, useRef } from "react";
import useStreamRecorder from "./_component/useStreamRecorder";
import { completeActivity } from "../../services/child/sessions";
import Peer from "peerjs";
const ColorMatchGame = ({ session_id, activity_id }) => {
  const colors = ["red", "blue", "green", "yellow", "purple", "orange"];
  const [targetColor, setTargetColor] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(11);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const callRef = useRef(null);
  const [peerId, setPeerId] = useState("");
  const peerInstance = useRef(null);

  const [isGameStarted, setIsGameStarted] = useState(false);
  const movingDivRef = useRef(null);
  const GameScoresRef = useRef({
    wrongselection: 0,
    correctselection: 0,
    score: 0,
    session_id: "",
    activity_id: "",
    game: "",
    time: "11min",
  });
  const { videoRef, onCompleteActivity } = useStreamRecorder(
    isGameStarted,
    movingDivRef,
    session_id,
    activity_id
  );
  const stopPeerStream = () => {
    // 1. Close the call if exists
    if (callRef.current) {
      callRef.current.close();
      callRef.current = null;
    }

    // 2. Stop local video tracks
    const localStream = localVideoRef.current?.srcObject;
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      localVideoRef.current.srcObject = null;
    }

    // 3. Stop remote video tracks
    const remoteStream = remoteVideoRef.current?.srcObject;
    if (remoteStream) {
      remoteStream.getTracks().forEach((track) => track.stop());
      remoteVideoRef.current.srcObject = null;
    }

    // 4. Optional: Disconnect the peer
    if (peerInstance.current) {
      peerInstance.current.disconnect();
    }
  };
  useEffect(() => {
    const peer = new Peer("saad"); // by default connects to peerjs.com server
    peerInstance.current = peer;

    peer.on("open", (id) => {
      setPeerId(id);
    });

    peer.on("call", (call) => {
      callRef.current = call;
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((stream) => {
          localVideoRef.current.srcObject = stream;
          call.answer(stream);
          call.on("stream", (remoteStream) => {
            remoteVideoRef.current.srcObject = remoteStream;
          });
        });
    });
    setIsGameStarted(true);
    return () => stopPeerStream();
  }, []);
  const onComplete = async () => {
    GameScoresRef.current.score = score;
    GameScoresRef.current.time = "11min";
    GameScoresRef.current.session_id = session_id;
    GameScoresRef.current.activity_id = activity_id;
    GameScoresRef.current.game = "Color Match Game";
    stopPeerStream();
    await onCompleteActivity(GameScoresRef.current);
    await completeActivity(session_id, activity_id);
  };
  useEffect(() => {
    if (!gameOver && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setGameOver(true);
      onComplete();
    }
  }, [timeLeft]);

  useEffect(() => {
    generateNewColor();
  }, []);

  const generateNewColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length);
    setTargetColor(colors[randomIndex]);
  };

  const handleColorClick = (color) => {
    if (gameOver) return;

    if (color === targetColor) {
      setScore((prev) => prev + 10);
      setMessage("Great job!");
      (GameScoresRef.current.correctselection += 1),
        setTimeout(() => setMessage(""), 1000);
      generateNewColor();
    } else {
      setMessage("Try again!");
      GameScoresRef.current.wrongselection += 1;
      setTimeout(() => setMessage(""), 1000);
    }
  };

  const resetGame = () => {
    setScore(0);
    setTimeLeft(11);
    setGameOver(false);
    generateNewColor();
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <video ref={videoRef} autoPlay style={{ display: "none" }} />
      <video
        ref={localVideoRef}
        autoPlay
        muted
        width="300"
        style={{ display: "none" }}
      />
      <video
        ref={remoteVideoRef}
        autoPlay
        width="300"
        muted
        style={{ display: "none" }}
      />
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Color Match Game</h2>
        <p className="text-lg">Match the target color!</p>
        <div className="mt-2">
          <span className="font-semibold">Score: {score}</span>
          <span className="mx-4">|</span>
          <span className="font-semibold">Time: {timeLeft}s</span>
        </div>
      </div>

      <div className="mb-6">
        <div className="text-xl font-bold mb-2">Target Color:</div>
        <div
          className="w-32 h-32 rounded-lg shadow-lg mx-auto"
          style={{ backgroundColor: targetColor }}
          ref={movingDivRef}
        />
      </div>

      <div className="grid grid-cols-3 gap-10 mb-6">
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => handleColorClick(color)}
            className="w-25 h-25 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            style={{ backgroundColor: color }}
            disabled={gameOver}
          />
        ))}
      </div>

      {message && (
        <div className="text-xl font-semibold mb-4 text-blue-600">
          {message}
        </div>
      )}

      {gameOver && (
        <div className="text-center">
          <p className="text-xl font-bold mb-4">Game Over!</p>
          <p className="text-lg mb-4">Your final score: {score}</p>
          {/* <button
            onClick={resetGame}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Play Again
          </button> */}
        </div>
      )}
    </div>
  );
};

export default ColorMatchGame;
