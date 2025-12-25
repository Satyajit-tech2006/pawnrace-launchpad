import React, { useState, useEffect, useRef } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { useNavigate } from "react-router-dom";
import VideoCall from "../components/VideoCall";

export default function Classroom() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("moves");
  const [boardWidth, setBoardWidth] = useState(550);
  const [game, setGame] = useState(new Chess());
  const [moves, setMoves] = useState([]);
  const [allowIllegal, setAllowIllegal] = useState(false);
  const [showCoords, setShowCoords] = useState(true);

  const engineRef = useRef(null);

  // ================= LOAD STOCKFISH SAFELY =================
  useEffect(() => {
    try {
      engineRef.current = new Worker("/stockfish/stockfish.js");
      engineRef.current.postMessage("uci");
    } catch (e) {
      console.warn(
        "Stockfish not found yet. Add /public/stockfish/stockfish.js later."
      );
    }
    return () => engineRef.current?.terminate();
  }, []);

  // ================= ENGINE MOVE =================
  function playEngineMove() {
    const engine = engineRef.current;
    if (!engine) {
      alert("⚠ Stockfish engine missing!\nAdd file: /public/stockfish/stockfish.js");
      return;
    }

    engine.postMessage(`position fen ${game.fen()}`);
    engine.postMessage("go depth 10");

    engine.onmessage = (e) => {
      if (typeof e.data === "string" && e.data.includes("bestmove")) {
        const best = e.data.split("bestmove ")[1].split(" ")[0];
        const from = best.slice(0, 2);
        const to = best.slice(2, 4);

        const newGame = new Chess(game.fen());
        const mv = newGame.move({ from, to, promotion: "q" });
        if (mv) {
          setGame(newGame);
          setMoves((prev) => [...prev, `Engine: ${mv.san}`]);
        }
      }
    };
  }

  // ================= RESET BOARD =================
  function resetBoard() {
    const fresh = new Chess();
    setGame(fresh);
    setMoves([]);
  }

  // ================= EXIT CLASSROOM =================
  const handleExit = () => {
    const role = localStorage.getItem("role");
    if (role === "coach") navigate("/coach-dashboard/classes");
    else navigate("/student-dashboard/classes");
  };

  // ================= RESPONSIVE BOARD =================
  useEffect(() => {
    const resizeBoard = () => {
      const w = window.innerWidth;
      if (w < 500) setBoardWidth(w - 40);
      else if (w < 900) setBoardWidth(400);
      else setBoardWidth(550);
    };
    resizeBoard();
    window.addEventListener("resize", resizeBoard);
    return () => window.removeEventListener("resize", resizeBoard);
  }, []);

  // ================= CHESS HANDLER =================
  function onDrop(source, target) {
    if (allowIllegal) {
      const newGame = new Chess(game.fen());
      const piece = newGame.get(source);
      if (!piece) return false;

      newGame.remove(source);
      newGame.put(piece, target);
      setGame(newGame);
      setMoves((prev) => [...prev, `ILLEGAL: ${source}-${target}`]);
      return true;
    }

    const newGame = new Chess(game.fen());
    const mv = newGame.move({ from: source, to: target, promotion: "q" });
    if (!mv) return false;

    setGame(newGame);
    setMoves((prev) => [...prev, mv.san]);
    return true;
  }

  return (
    <div className="w-full h-screen flex flex-col bg-[#0D1628] text-white">
      {/* HEADER */}
      <div className="w-full flex items-center justify-between px-6 py-5 border-b border-gray-700">
        <h2 className="text-2xl font-semibold">Classroom</h2>
        <button
          onClick={handleExit}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg"
        >
          Exit Classroom
        </button>
      </div>

      {/* MAIN */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* LEFT SIDE */}
        <div className="w-full md:w-[70%] flex flex-col items-center p-4 border-r border-gray-700">
          {/* BUTTONS ABOVE BOARD */}
          <div className="flex gap-3 mb-4 flex-wrap justify-center">
            <button
              onClick={playEngineMove}
              className="px-4 py-2 rounded-xl font-semibold bg-green-400 hover:bg-green-500 text-black"
            >
              Play Engine Move
            </button>

            <button
              onClick={() => setAllowIllegal((p) => !p)}
              className={`px-4 py-2 rounded-xl font-semibold ${
                allowIllegal ? "bg-red-600 text-white" : "bg-yellow-400 text-black"
              }`}
            >
              {allowIllegal ? "Illegal Moves: ON" : "Illegal Moves: OFF"}
            </button>

            <button
              onClick={() => setShowCoords((p) => !p)}
              className="px-4 py-2 rounded-xl font-semibold bg-blue-500 hover:bg-blue-600 text-white"
            >
              {showCoords ? "Hide Coordinates" : "Show Coordinates"}
            </button>

            {/* NEW: Reset Board */}
            <button
              onClick={resetBoard}
              className="px-4 py-2 rounded-xl font-semibold bg-gray-300 hover:bg-gray-400 text-black"
              title="Reset to starting position and clear moves"
            >
              Reset Board
            </button>
          </div>

          {/* BOARD + COORDS */}
          <div className="relative" style={{ width: boardWidth }}>
            <Chessboard
              position={game.fen()}
              onPieceDrop={onDrop}
              boardWidth={boardWidth}
            />

            {showCoords && (
              <>
                {/* Left Ranks */}
                {["8", "7", "6", "5", "4", "3", "2", "1"].map((r, i) => (
                  <span
                    key={r}
                    style={{
                      position: "absolute",
                      left: -20,
                      top: (boardWidth / 8) * i + 10,
                      color: "white",
                      fontSize: 14,
                      fontWeight: "bold",
                    }}
                  >
                    {r}
                  </span>
                ))}

                {/* Bottom Files */}
                {["a", "b", "c", "d", "e", "f", "g", "h"].map((f, i) => (
                  <span
                    key={f}
                    style={{
                      position: "absolute",
                      top: boardWidth + 5,
                      left: (boardWidth / 8) * i + boardWidth / 16,
                      transform: "translateX(-50%)",
                      color: "white",
                      fontSize: 14,
                      fontWeight: "bold",
                    }}
                  >
                    {f}
                  </span>
                ))}
              </>
            )}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full md:w-[30%] p-4 flex flex-col">
          <VideoCall roomId="bwdfjbh" />

          <div className="mt-6 flex-1">
            <div className="flex border-b border-gray-600">
              <button
                onClick={() => setActiveTab("moves")}
                className={`px-4 py-2 ${
                  activeTab === "moves"
                    ? "border-b-2 border-yellow-400"
                    : "text-gray-400"
                }`}
              >
                Moves
              </button>

              <button
                onClick={() => setActiveTab("chat")}
                className={`px-4 py-2 ml-4 ${
                  activeTab === "chat"
                    ? "border-b-2 border-yellow-400"
                    : "text-gray-400"
                }`}
              >
                Chat
              </button>
            </div>

            {activeTab === "moves" && (
              <div className="h-[55vh] overflow-y-auto border p-3 rounded mt-3">
                {moves.length ? (
                  moves.map((m, i) => (
                    <p key={i} className="text-yellow-300">
                      {i + 1}. {m}
                    </p>
                  ))
                ) : (
                  <p className="text-gray-400">Moves will appear here...</p>
                )}
              </div>
            )}

            {activeTab === "chat" && (
              <div className="flex flex-col h-[55vh] mt-3">
                <div className="flex-1 border p-3 rounded overflow-y-auto">
                  <p className="text-gray-400">Chat messages...</p>
                </div>

                <div className="flex mt-2">
                  <input
                    className="w-full border bg-[#0F1A2F] text-white px-3 py-2 rounded"
                    placeholder="Type a message..."
                  />
                  <button className="ml-2 px-4 py-2 rounded bg-yellow-400 text-black">
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
