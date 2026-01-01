import React, { useEffect, useRef } from "react";
import io from "socket.io-client";

export default function VideoCall({ roomId }) {
  const socket = useRef(null);
  const localVideo = useRef(null);
  const remoteVideo = useRef(null);
  const peer = useRef(null);

  useEffect(() => {
    socket.current = io("http://localhost:3001");
    socket.current.emit("join-room", roomId);

    startStream();

    socket.current.on("signal", async (data) => {
      if (data.type === "offer") {
        await peer.current.setRemoteDescription(data.offer);
        const answer = await peer.current.createAnswer();
        await peer.current.setLocalDescription(answer);

        socket.current.emit("signal", {
          roomId,
          type: "answer",
          answer
        });
      }

      if (data.type === "answer") {
        await peer.current.setRemoteDescription(data.answer);
      }

      if (data.type === "ice") {
        await peer.current.addIceCandidate(data.ice);
      }
    });
  }, []);

  async function startStream() {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });

    localVideo.current.srcObject = stream;

    createPeer(stream);
  }

  function createPeer(stream) {
    peer.current = new RTCPeerConnection();

    stream.getTracks().forEach(track => {
      peer.current.addTrack(track, stream);
    });

    peer.current.ontrack = (event) => {
      remoteVideo.current.srcObject = event.streams[0];
    };

    peer.current.onicecandidate = (e) => {
      if (e.candidate) {
        socket.current.emit("signal", {
          roomId,
          type: "ice",
          ice: e.candidate
        });
      }
    };
  }

  async function callUser() {
    const offer = await peer.current.createOffer();
    await peer.current.setLocalDescription(offer);

    socket.current.emit("signal", {
      roomId,
      type: "offer",
      offer
    });
  }

  return (
    <div className="w-full bg-gray-100 p-3 rounded border">
      <h3 className="font-semibold mb-2">Video Call</h3>

      <div className="flex gap-2">
        <video ref={localVideo} autoPlay muted className="w-32 h-24 bg-black rounded" />
        <video ref={remoteVideo} autoPlay className="w-32 h-24 bg-black rounded" />
      </div>

      <button
        onClick={callUser}
        className="mt-2 bg-green-600 text-white px-4 py-2 rounded w-full"
      >
        Connect
      </button>
    </div>
  );
}
