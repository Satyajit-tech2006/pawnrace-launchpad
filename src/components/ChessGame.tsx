// src/components/ChessGame.tsx
import React, { useEffect, useRef, useState } from "react";
import Chessboard from "chessboardjsx";
import { Chess } from "chess.js";
import { io, Socket } from "socket.io-client";
import { useLocation } from "react-router-dom"; // NEW IMPORT

type Props = {
  roomId: string;
  // 'role' prop has been removed
  serverUrl?: string;
  startFEN?: string;
};

export default function ChessGame({
  roomId,
  serverUrl = "import.meta.env.VITE_SOCKET_URL",
  startFEN,
}: Props) {
  // create one chess instance
  const [game] = useState(() => new Chess(startFEN));
  const [fen, setFen] = useState<string>(game.fen());
  const socketRef = useRef<Socket | null>(null);

  // NEW CHANGES: 'myColor' state instead of 'role'
  const location = useLocation(); // To get state from React Router
  const [myColor, setMyColor] = useState<'w' | 'b' | null>(null);

  // Board orientation depends on 'myColor'
  const orientation = myColor === "b" ? "black" : "white";
  // Is it your turn?
  const isMyTurn = game.turn() === myColor;

  useEffect(() => {
    const socket = io(serverUrl, { transports: ["websocket", "polling"] });
    socketRef.current = socket;

    // NEW CHANGE: Read 'playerColor' state from lobby (only creator will have it)
    const creatorColor = location.state?.playerColor; // 'w', 'b', or undefined

    // NEW CHANGE: Send 'playerColor' instead of 'role'
    socket.emit("joinRoom", {
      roomId,
      playerColor: creatorColor // For joiner this will be undefined, which is fine
    });

    // NEW LISTENER: Receive assigned color from server
    socket.on("colorAssigned", ({ color }: { color: 'w' | 'b' }) => {
      setMyColor(color);
      console.log(`Assigned color: ${color === 'w' ? 'White' : 'Black'}`);
    });

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

    // NEW EVENTS (Optional, but useful)
    socket.on("gameStart", () => {
      console.log("Both players have joined, game started!");
      // You can update some UI element here
    });

    socket.on("peer_left", () => {
      console.log("Opponent has left...");
      alert("Opponent disconnected.");
      // You can send user back to lobby here
    });

    socket.on("error", ({ message }: { message: string }) => {
      console.error("Error from server:", message);
      alert(`Error: ${message}`);
      // Send user to lobby here
    });

    return () => {
      socket.emit("leaveRoom", { roomId });
      socket.disconnect();
    };

    // NEW CHANGE: Updated dependency array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, serverUrl, location.state]);

  // chessboardjsx onDrop signature: ({ sourceSquare, targetSquare, piece, ...})
  function onDrop(e: { sourceSquare: string; targetSquare: string }) {
    // NEW CHANGE: Do not allow move if it's not your turn
    if (!isMyTurn) {
      console.log("It's not your turn!");
      setFen(game.fen()); // Restore board to previous state
      return;
    }

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
      setFen(game.fen());
      return;
    }

    if (move === null) {
      // illegal move
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
    // Only 'White' (or creator) can reset the board (Optional logic)
    if (myColor !== 'w') {
      alert("Only White can reset the board.");
      return;
    }

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
        {/* NEW CHANGE: UI update */}
        <strong>Room ID:</strong> {roomId}
        <br />
        <strong>Your Color:</strong> {myColor === 'w' ? "White" : myColor === 'b' ? "Black" : "Waiting..."}
        <br />
        <strong>Move:</strong> {game.turn() === "w" ? "White" : "Black"}
        {isMyTurn && myColor && " (Your Turn)"}
      </div>

      <Chessboard
        width={480}
        position={fen}
        orientation={orientation}
        onDrop={onDrop}
        // NEW CHANGE: Allow drag only on your turn
        draggable={isMyTurn}
      />

      <div style={{ marginTop: 8 }}>
        <button
          onClick={resetBoard}
          style={{ padding: "6px 10px", borderRadius: 6 }}
        >
          Reset Game
        </button>
        <div style={{ marginTop: 6 }}>
          <code>FEN:</code> <span style={{ fontSize: 12 }}>{fen}</span>
        </div>
      </div>
    </div>
  );
}