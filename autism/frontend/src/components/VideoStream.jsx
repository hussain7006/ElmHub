import React, { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import useAuthStore from "../store/authStore";

const VideoStream = ({ sessionId }) => {
  const { theme } = useAuthStore();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [peerId, setPeerId] = useState("");
  const [targetId, setTargetId] = useState("");
  const peerInstance = useRef(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const peer = new Peer(); // by default connects to peerjs.com server
    peerInstance.current = peer;

    peer.on("open", (id) => {
      setPeerId(id);
    });

    peer.on("call", (call) => {
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
  }, []);

  const callUser = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        localVideoRef.current.srcObject = stream;
        const call = peerInstance.current.call("saad", stream);
        call.on("stream", (remoteStream) => {
          remoteVideoRef.current.srcObject = remoteStream;
        });
      });
  };

  return (
    <>
      {/* <button onClick={callUser}>Stream</button> */}
      <div
        className={`aspect-video rounded-lg overflow-hidden ${
          theme === "dark" ? "bg-gray-700" : "bg-gray-100"
        }`}
        onClick={callUser}
      >
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
          muted
          className="w-full h-full object-cover"
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </>
  );
};

export default VideoStream;
