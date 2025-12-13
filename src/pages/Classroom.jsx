import React, { useState, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import VideoCall from "../components/VideoCall";

export default function Classroom() {
  const [activeTab, setActiveTab] = useState("moves");
  const [boardWidth, setBoardWidth] = useState(550);

  const [game, setGame] = useState(new Chess());
  const [moves, setMoves] = useState([]);

  const [allowIllegal, setAllowIllegal] = useState(false); // ⭐ Toggle State

  // Auto resize chessboard (debounced)
  useEffect(() => {
    const resizeBoard = () => {
      const width = window.innerWidth;

      if (width < 500) return setBoardWidth(width - 40);
      if (width < 900) return setBoardWidth(400);
      return setBoardWidth(550);
    };

    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resizeBoard, 150);
    };

    resizeBoard();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ⭐ CHESS MOVE HANDLER (With Illegal Toggle)
  function onDrop(sourceSquare, targetSquare) {
    // ---------- ILLEGAL MOVE MODE ----------
    if (allowIllegal) {
      const newGame = new Chess(game.fen());

      const piece = newGame.get(sourceSquare);
      if (!piece) return false;

      // Remove piece from old square
      newGame.remove(sourceSquare);

      // Place piece in ANY target square (illegal allowed)
      newGame.put(piece, targetSquare);

      setGame(newGame);
      setMoves((prev) => [
        ...prev,
        `ILLEGAL: ${sourceSquare}-${targetSquare}`,
      ]);

      return true;
    }

    // ---------- NORMAL LEGAL CHESS MODE ----------
    const newGame = new Chess(game.fen());
    const move = newGame.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });

    if (move === null) return false; // illegal attempt

    setGame(newGame);
    setMoves((prev) => [...prev, move.san]);
    return true;
  }

  return (
    <div className="w-full h-screen flex flex-col bg-[#0D1628]">

      {/* Header */}
      <div className="w-full bg-[#0D1628] shadow flex items-center justify-between px-6 py-5 border-b border-gray-700">
        <h2 className="text-2xl font-semibold text-white">Classroom</h2>

        <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg">
          Exit Classroom
        </button>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">

        {/* LEFT — Chessboard */}
        <div className="flex justify-center items-start w-full md:w-[70%] bg-[#0D1628] border-r border-gray-700">
          <div className="p-4 md:p-6 w-full flex justify-center">
            <Chessboard
              position={game.fen()}
              onPieceDrop={onDrop}
              boardWidth={boardWidth}
            />
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-full md:w-[30%] bg-[#0D1628] p-4 flex flex-col">

          {/* Start Video Call Button */}
          <div className="flex justify-center mb-4">
            <button
              className="w-full md:w-auto text-black font-semibold px-5 py-3 rounded-xl 
              bg-gradient-to-b from-[#FFD84F] via-[#FFC72C] to-[#A8791D]
              shadow-[0_4px_12px_rgba(0,0,0,0.5)] hover:brightness-110"
            >
              Start Video Call
            </button>
          </div>

          {/* ⭐ ILLEGAL MOVE TOGGLE BUTTON */}
          <button
            onClick={() => setAllowIllegal(!allowIllegal)}
            className={`w-full md:w-auto px-5 py-3 rounded-xl font-semibold mt-2
              ${
                allowIllegal
                  ? "bg-red-600 text-white shadow-lg"
                  : "bg-gradient-to-b from-[#FFD84F] via-[#FFC72C] to-[#A8791D] text-black shadow-lg"
              }`}
          >
            {allowIllegal ? "Illegal Moves: ON" : "Illegal Moves: OFF"}
          </button>

          {/* Video Call Component */}
          <VideoCall roomId="bwdfjbh" />

          {/* Tabs */}
          <div className="mt-6 flex-1">

            {/* Tab Buttons */}
            <div className="flex border-b border-gray-600 text-white text-sm md:text-base">
              <button
                onClick={() => setActiveTab("moves")}
                className={`px-4 py-2 ${
                  activeTab === "moves"
                    ? "border-b-2 border-[#FFD84F] font-semibold"
                    : "text-gray-400"
                }`}
              >
                Moves
              </button>

              <button
                onClick={() => setActiveTab("chat")}
                className={`px-4 py-2 ml-4 ${
                  activeTab === "chat"
                    ? "border-b-2 border-[#FFD84F] font-semibold"
                    : "text-gray-400"
                }`}
              >
                Chat
              </button>
            </div>

            {/* Moves Panel */}
            {activeTab === "moves" && (
              <div className="h-[40vh] md:h-[55vh] overflow-y-auto 
                  p-3 border border-gray-700 rounded mt-3 text-white text-sm md:text-base">
                {moves.length === 0 ? (
                  <p className="text-gray-400">Moves will appear here...</p>
                ) : (
                  moves.map((m, i) => (
                    <p key={i} className="text-yellow-300">
                      {i + 1}. {m}
                    </p>
                  ))
                )}
              </div>
            )}

            {/* Chat Panel */}
            {activeTab === "chat" && (
              <div className="flex flex-col h-[40vh] md:h-[55vh] mt-3 text-white">

                <div className="flex-1 overflow-y-auto border border-gray-700 p-3 rounded">
                  <p className="text-gray-400">Chat messages...</p>
                </div>

                <div className="flex mt-2">
                  <input
                    className="w-full border border-gray-600 bg-[#0F1A2F] text-white px-3 py-2 rounded outline-none"
                    placeholder="Type a message..."
                  />
                  <button
                    className="ml-2 px-4 py-2 rounded 
                    bg-gradient-to-b from-[#FFD84F] via-[#FFC72C] to-[#A8791D] 
                    text-black font-semibold shadow hover:brightness-110"
                  >
                    Send
                  </button>
                </div>

              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
