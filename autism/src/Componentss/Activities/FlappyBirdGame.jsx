import { useEffect, useState, useRef } from "react";
import Bird from "./_component/Bird.jsx";
import Pipe from "./_component/Pipe.jsx";
import { BIRD_INTERVAL, BIRD_X } from "../../config/activityConstants.js";
import { sendActivityData } from "../../services/child/sessions.js";

const DEFAULT_GAME_HEIGHT = 600;
const DEFAULT_GAME_WIDTH = 800;
const PIPE_GAP = 200;
const GRAVITY = 3.5;
const JUMP = 80;

export default function FlappyBirdGame({ session_id, activity_id, handleCloseActivity }) {
    const [gameWidth, setGameWidth] = useState(DEFAULT_GAME_WIDTH);
    const [gameHeight, setGameHeight] = useState(DEFAULT_GAME_HEIGHT);
    const [birdPos, setBirdPos] = useState(DEFAULT_GAME_HEIGHT / 2);
    const [gameStarted, setGameStarted] = useState(false);
    const [pipeLeft, setPipeLeft] = useState(DEFAULT_GAME_WIDTH);
    const [pipeHeight, setPipeHeight] = useState(250);
    const [score, setScore] = useState(0);
    const gameAreaRef = useRef(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [timer, setTimer] = useState(0);
    const timerRef = useRef(null);
    // Bird position history
    const birdHistoryRef = useRef([]);
    const birdHistoryIntervalRef = useRef(null);
    //   useEffect(() => {
    //     console.log("session_id", session_id);
    //   }, [session_id]);
    useEffect(() => {
        let gravityInterval;
        if (gameStarted && birdPos < gameHeight - 40) {
            gravityInterval = setInterval(() => {
                setBirdPos((prev) => prev + GRAVITY);
            }, 24);
        }
        return () => clearInterval(gravityInterval);
    }, [gameStarted, birdPos, gameHeight]);

    useEffect(() => {
        let pipeInterval;
        if (gameStarted && pipeLeft > -60) {
            pipeInterval = setInterval(() => {
                setPipeLeft((prev) => prev - 3);
            }, 24);
        } else if (gameStarted) {
            setPipeLeft(gameWidth);
            const newHeight = Math.floor(Math.random() * (gameHeight - PIPE_GAP));
            setPipeHeight(newHeight);
            setScore((s) => s + 1);
        }
        return () => clearInterval(pipeInterval);
    }, [gameStarted, pipeLeft, gameWidth, gameHeight]);

    useEffect(() => {
        const topPipeBottom = pipeHeight;
        const bottomPipeTop = pipeHeight + PIPE_GAP;
        if (
            pipeLeft < 80 &&
            pipeLeft > 40 &&
            (birdPos < topPipeBottom || birdPos > bottomPipeTop)
        ) {
            alert("Game Over! Score: " + score);

            showBirdHistory()
            setGameStarted(false);
            setBirdPos(gameHeight / 2);
            setPipeLeft(gameWidth);
            setScore(0);
            setIsFullscreen(false);
            handleCloseActivity()
        }
    }, [pipeLeft, birdPos, pipeHeight, gameHeight, gameWidth, score]);

    const handleJump = () => {
        if (!gameStarted) setGameStarted(true);
        setBirdPos((prev) => {
            const newY = Math.max(prev - JUMP, 0);
            // const birdX = 60; // fixed x position in game area
            // if (gameAreaRef.current) {
            //     const rect = gameAreaRef.current.getBoundingClientRect();
            //     const screenX = rect.left + birdX;
            //     const screenY = rect.top + newY;
            //     console.log("Bird screen coordinates on jump:", { x: screenX, y: screenY });
            // }
            return newY;
        });
    };

    const handleFullscreen = () => {
        if (gameAreaRef.current) {
            if (gameAreaRef.current.requestFullscreen) {
                gameAreaRef.current.requestFullscreen();
            } else if (gameAreaRef.current.webkitRequestFullscreen) {
                gameAreaRef.current.webkitRequestFullscreen();
            } else if (gameAreaRef.current.mozRequestFullScreen) {
                gameAreaRef.current.mozRequestFullScreen();
            } else if (gameAreaRef.current.msRequestFullscreen) {
                gameAreaRef.current.msRequestFullscreen();
            }
        }
    };

    useEffect(() => {
        const onFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener("fullscreenchange", onFullscreenChange);
        return () => {
            document.removeEventListener("fullscreenchange", onFullscreenChange);
        };
    }, []);

    // Auto-request fullscreen on mount
    useEffect(() => {
        if (gameAreaRef.current) {
            if (gameAreaRef.current.requestFullscreen) {
                gameAreaRef.current.requestFullscreen();
            } else if (gameAreaRef.current.webkitRequestFullscreen) {
                gameAreaRef.current.webkitRequestFullscreen();
            } else if (gameAreaRef.current.mozRequestFullScreen) {
                gameAreaRef.current.mozRequestFullScreen();
            } else if (gameAreaRef.current.msRequestFullscreen) {
                gameAreaRef.current.msRequestFullscreen();
            }
        }
    }, []);

    // Update game size on fullscreen or resize
    useEffect(() => {
        function updateSize() {
            if (isFullscreen) {
                setGameWidth(window.innerWidth);
                setGameHeight(window.innerHeight);
            } else {
                setGameWidth(DEFAULT_GAME_WIDTH);
                setGameHeight(DEFAULT_GAME_HEIGHT);
            }
        }
        updateSize();
        window.addEventListener('resize', updateSize);
        document.addEventListener('fullscreenchange', updateSize);
        return () => {
            window.removeEventListener('resize', updateSize);
            document.removeEventListener('fullscreenchange', updateSize);
        };
    }, [isFullscreen]);

    // Timer logic
    useEffect(() => {
        if (gameStarted) {
            timerRef.current = setInterval(() => {
                setTimer((prev) => prev + 1);
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [gameStarted]);

    // Reset timer on game start
    useEffect(() => {
        if (gameStarted) setTimer(0);
    }, [gameStarted]);

    // Start/stop bird position tracking
    useEffect(() => {
        if (gameStarted) {
            birdHistoryRef.current = [];
            birdHistoryIntervalRef.current = setInterval(() => {
                birdHistoryRef.current.push({
                    time: Date.now(),
                    birdPos: { x: BIRD_X, y: birdPos },
                    score,
                });
            }, BIRD_INTERVAL);
        } else {
            clearInterval(birdHistoryIntervalRef.current);
        }
        return () => clearInterval(birdHistoryIntervalRef.current);
    }, [gameStarted]);

    // Print bird history on game over
    // useEffect(() => {
    //     if (!gameStarted && birdHistoryRef.current.length > 0) {
    //         console.log('Bird position history:', birdHistoryRef.current);
    //     }
    // }, [gameStarted]);

    // Print bird history on close
    const handleCloseFullscreen = () => {
        showBirdHistory()
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
    };

    const showBirdHistory = async () => {
        if (birdHistoryRef.current.length > 0) {
            console.log("session_id", session_id);
            console.log("activity_id", activity_id);
            console.log('Bird position history:', birdHistoryRef.current);
            // const res = await sendActivityData(session_id, activity_id, birdHistoryRef.current);
            // console.log("res", res);
        }
    }

    return (
        <div className={`w-full h-[640px] max-h-[640px] mx-auto p-4${isFullscreen ? ' fixed inset-0 z-50 bg-black p-0' : ''}`}
            style={isFullscreen ? { width: '100vw', height: '100vh', maxWidth: '100vw', maxHeight: '100vh' } : {}}>
            <div
                ref={gameAreaRef}
                className={`relative w-full h-full bg-sky-300 overflow-hidden rounded-lg border-4 border-black cursor-pointer${isFullscreen ? ' rounded-none border-0' : ''}`}
                style={isFullscreen ? { width: '100vw', height: '100vh' } : { width: gameWidth, height: gameHeight }}
                onClick={handleJump}
            >
                {/* Close (X) button in fullscreen */}
                {isFullscreen && (
                    <button
                        type="button"
                        onClick={() => {
                            handleCloseFullscreen()
                            handleCloseActivity()
                        }}
                        className="absolute top-2 right-2 z-30 bg-white bg-opacity-80 cursor-pointer rounded-full w-10 h-10 flex items-center justify-center text-2xl font-bold text-black shadow hover:bg-opacity-100 transition"
                        aria-label="Close"
                    >
                        ×
                    </button>
                )}
                {/* Fullscreen button (hidden in fullscreen) */}
                <button
                    type="button"
                    onClick={handleFullscreen}
                    className="absolute top-2 right-2 z-20 bg-white bg-opacity-80 rounded px-3 py-1 text-black font-semibold shadow hover:bg-opacity-100 transition"
                    style={{ display: isFullscreen ? 'none' : 'block' }}
                >
                    Fullscreen
                </button>
                {/* Timer display */}
                <div className="absolute top-2 left-2 z-20 bg-black bg-opacity-50 text-white px-4 py-1 rounded text-lg font-mono">
                    Time: {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
                </div>
                <div className="absolute text-xl font-bold text-white p-2 z-10">
                    Score: {score}
                </div>
                <Bird position={birdPos} />
                <Pipe height={pipeHeight} left={pipeLeft} gap={PIPE_GAP} gameHeight={gameHeight} gameWidth={gameWidth} />
            </div>
        </div>
    );

}