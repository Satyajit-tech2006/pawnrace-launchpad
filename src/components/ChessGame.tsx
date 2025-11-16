// src/components/ChessGame.tsx
import React, { useEffect, useRef, useState } from "react";
import Chessboard from "chessboardjsx";
import { Chess } from "chess.js";
import { io, Socket } from "socket.io-client";

type Props = {
  roomId: string;
  role: "coach" | "student";
  serverUrl?: string;
  startFEN?: string;
};

export default function ChessGame({
  roomId,
  role,
  serverUrl = "http://localhost:4000",
  startFEN,
}: Props) {
  // create one chess instance
  const [game] = useState(() => new Chess(startFEN));
  const [fen, setFen] = useState<string>(game.fen());
  const socketRef = useRef<Socket | null>(null);
  const orientation = role === "coach" ? "white" : "black";

  useEffect(() => {
    const socket = io(serverUrl, { transports: ["websocket", "polling"] });
    socketRef.current = socket;

    socket.emit("joinRoom", { roomId, role });

    socket.on("opponentMove", ({ fen: newFen }: { fen?: string }) => {
      if (newFen) {
        try {
          game.load(newFen);
          setFen(game.fen());
        } catch (e) {
          console.error("Failed to load FEN from opponent:", e);
        }
      }
    });

    socket.on("syncState", ({ fen: newFen }: { fen?: string }) => {
      if (newFen) {
        try {
          game.load(newFen);
          setFen(game.fen());
        } catch (e) {
          console.error("Failed to sync state:", e);
        }
      }
    });

    return () => {
      socket.emit("leaveRoom", { roomId });
      socket.disconnect();
    };
    // we intentionally do not include `game` in deps because it is created once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, role, serverUrl]);

  // chessboardjsx onDrop signature: ({ sourceSquare, targetSquare, piece, ...})
  function onDrop(e: { sourceSquare: string; targetSquare: string }) {
    const { sourceSquare, targetSquare } = e;

    // try to make the move on the chess.js game instance
    let move = null;
    try {
      move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q", // auto-promote to queen
      });
    } catch (err) {
      console.error("Error making move:", err);
      // reset board to authoritative FEN if something unexpected happened
      setFen(game.fen());
      return;
    }

    if (move === null) {
      // illegal move: force the board to display the authoritative FEN again
      setFen(game.fen());
      return;
    }

    // legal move: update local FEN and send to server
    setFen(game.fen());
    socketRef.current?.emit("makeMove", {
      roomId,
      move,
      fen: game.fen(),
      pgn: game.pgn(),
    });
  }

  function resetBoard() {
    game.reset();
    setFen(game.fen());
    socketRef.current?.emit("syncState", {
      roomId,
      fen: game.fen(),
      pgn: game.pgn(),
    });
  }

  return (
    <div style={{ maxWidth: 520, margin: "0 auto" }}>
      <div style={{ marginBottom: 8 }}>
        <strong>Role:</strong> {role} — <strong>Turn:</strong>{" "}
        {game.turn() === "w" ? "White" : "Black"}
      </div>

      <Chessboard
        width={480}
        position={fen}
        orientation={orientation}
        onDrop={onDrop}
        draggable={true}
      />

      <div style={{ marginTop: 8 }}>
        <button
          onClick={resetBoard}
          style={{ padding: "6px 10px", borderRadius: 6 }}
        >
          Reset
        </button>
        <div style={{ marginTop: 6 }}>
          <code>FEN:</code> <span style={{ fontSize: 12 }}>{fen}</span>
        </div>
      </div>
    </div>
  );
}
