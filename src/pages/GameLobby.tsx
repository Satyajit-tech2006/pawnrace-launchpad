import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function GameLobby() {
  const [roomIdInput, setRoomIdInput] = useState("");
  const [showColorChoice, setShowColorChoice] = useState(false);
  const [error, setError] = useState("");
  const [createdRoom, setCreatedRoom] = useState(null);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const generateRoomId = () =>
    Math.random().toString(36).substring(2, 8).toUpperCase();

  const handleCreateClick = () => {
    setShowColorChoice(true);
    setError("");
  };

  const createRoomAndNavigate = (color) => {
    const newRoomId = generateRoomId();
    setCreatedRoom(newRoomId);
    navigate(`/play/${newRoomId}`, { state: { playerColor: color, createdBy: true } });
  };

  const joinRoom = () => {
    const cleaned = roomIdInput.trim().toUpperCase();
    if (!cleaned) {
      setError("Please enter a valid Room ID.");
      return;
    }
    if (!/^[A-Z0-9]{4,8}$/.test(cleaned)) {
      setError("Room ID should be 4–8 characters (letters and numbers).");
      return;
    }
    setError("");
    navigate(`/play/${cleaned}`);
  };

  const copyRoomId = async () => {
    if (!createdRoom) return;
    try {
      await navigator.clipboard.writeText(createdRoom);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch (e) {
      console.error("Copy failed", e);
    }
  };

  const container = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { staggerChildren: 0.06 } },
  };
  const item = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 28 } },
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(180deg,#071433 0%, #0b1630 50%, #04081a 100%)",
      }}
    >
      <motion.div
        initial="hidden"
        animate="show"
        variants={container}
        className="w-full max-w-4xl rounded-2xl shadow-2xl border border-[rgba(255,255,255,0.04)] overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(11,22,48,0.6), rgba(7,20,51,0.35))",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Left panel: Create (added subtle inner panel to improve contrast) */}
          <motion.div
            variants={item}
            className="p-8 md:p-12 lg:p-16"
            style={{
              // subtle translucent inner surface so text doesn't sink into background
              background: "linear-gradient(180deg, rgba(255,255,255,0.015), rgba(255,255,255,0.01))",
              borderRight: "1px solid rgba(255,255,255,0.02)",
            }}
          >
            {/* Heading now pure white + slight shadow for readability */}
            <h2
              className="text-3xl sm:text-4xl font-extrabold mb-2"
              style={{
                color: "#FFFFFF",
                textShadow: "0 1px 0 rgba(0,0,0,0.6), 0 6px 18px rgba(2,6,23,0.6)",
              }}
            >
              Create Game
            </h2>

            {/* Paragraph/body text brighter for readability */}
            <p className="mb-6" style={{ color: "#E6EEF8" }}>
              Start a new game and share the room ID with your opponent.
            </p>

            {!showColorChoice && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCreateClick}
                className="w-full md:w-auto px-6 py-3 rounded-lg text-white font-semibold text-lg shadow-xl"
                style={{
                  background: "linear-gradient(90deg,#3b82f6 0%, #6366f1 50%, #0f172a 100%)",
                }}
                aria-label="Create new game"
              >
                Create New Game
              </motion.button>
            )}

            {showColorChoice && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6">
                <p className="text-lg mb-4 font-semibold" style={{ color: "#FFD24D" }}>
                  Choose your color
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.button
                    onClick={() => createRoomAndNavigate("w")}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-6 py-3 rounded-lg font-semibold shadow-md border border-[rgba(255,255,255,0.06)]"
                    style={{ background: "white", color: "#0b1630" }}
                    aria-label="Create as White"
                  >
                    White
                  </motion.button>

                  <motion.button
                    onClick={() => createRoomAndNavigate("b")}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-6 py-3 rounded-lg font-semibold shadow-md border border-[rgba(255,255,255,0.06)]"
                    style={{ background: "linear-gradient(180deg,#0b1630,#071433)", color: "white" }}
                    aria-label="Create as Black"
                  >
                    Black
                  </motion.button>
                </div>

                {createdRoom && (
                  <div className="mt-4 flex items-center gap-3 text-sm">
                    <span style={{ color: "#E6EEF8" }}>Room ID:</span>
                    <code
                      className="px-2 py-1 rounded font-mono"
                      style={{
                        background: "rgba(255,255,255,0.02)",
                        color: "#FFD24D",
                        border: "1px solid rgba(255,255,255,0.04)",
                      }}
                    >
                      {createdRoom}
                    </code>
                    <button onClick={copyRoomId} className="ml-2 text-sm font-medium" style={{ color: "#F59E0B" }}>
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            <p className="text-xs mt-6" style={{ color: "#94A3B8" }}>
              Tip: Share the Room ID or link with your opponent so they can join quickly.
            </p>
          </motion.div>

          {/* Right panel: Join */}
          <motion.div
            variants={item}
            className="p-6 md:p-10 lg:p-14"
            style={{
              background: "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.01) 100%)",
            }}
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-2" style={{ color: "#FFD24D" }}>
              Join Game
            </h2>
            <p className="mb-6" style={{ color: "#E6EEF8" }}>
              Enter a Room ID to join an existing game.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 items-stretch">
              <input
                type="text"
                value={roomIdInput}
                onChange={(e) => setRoomIdInput(e.target.value)}
                placeholder="e.g. A1B2C3"
                className="flex-1 px-4 py-3 rounded-lg focus:outline-none text-lg placeholder-[#94a3b8]"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.04)",
                }}
                aria-label="Room ID"
                onKeyDown={(e) => {
                  if (e.key === "Enter") joinRoom();
                }}
              />

              <motion.button
                onClick={joinRoom}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-6 py-3 rounded-lg text-white font-semibold shadow-lg min-w-[120px]"
                style={{
                  background: "linear-gradient(90deg,#f59e0b 0%, #ffb84d 70%, #ffd24d 100%)",
                }}
                aria-label="Join room"
              >
                Join
              </motion.button>
            </div>

            {error && (
              <p className="mt-3 text-sm" style={{ color: "#FF7B7B" }}>
                {error}
              </p>
            )}

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setRoomIdInput(generateRoomId());
                  setError("");
                }}
                className="text-sm px-3 py-2 rounded-lg border"
                style={{
                  color: "#cbd5e1",
                  borderColor: "rgba(255,255,255,0.04)",
                  background: "transparent",
                  textAlign: "left",
                }}
              >
                Generate test Room ID
              </button>

              <button
                onClick={() => {
                  setRoomIdInput("");
                  setError("");
                }}
                className="text-sm px-3 py-2 rounded-lg border"
                style={{
                  color: "#cbd5e1",
                  borderColor: "rgba(255,255,255,0.04)",
                  background: "transparent",
                  textAlign: "left",
                }}
              >
                Clear
              </button>
            </div>

            <div className="mt-6 text-xs" style={{ color: "#94a3b8" }}>
              • Works on mobile, tablet and desktop. Buttons stack on narrow screens and sit side-by-side on wider screens.
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          className="px-6 py-3 border-t flex justify-between items-center"
          style={{ borderColor: "rgba(255,255,255,0.03)", color: "#94a3b8" }}
        >
          <div style={{ color: "#E6EEF8" }}>Made by team pawnrace — Good luck!</div>
          <div className="text-sm" style={{ color: "#FFD24D" }}>
            100+ • <span style={{ color: "#F59E0B" }}>98%</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
