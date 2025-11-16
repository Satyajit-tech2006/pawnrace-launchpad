// src/components/ChessGame.tsx
import React, { useEffect, useRef, useState } from "react";
import Chessboard from "chessboardjsx";
import { Chess } from "chess.js";
import { io, Socket } from "socket.io-client";
import { useLocation } from "react-router-dom"; // YEH HAI NAYA IMPORT

type Props = {
  roomId: string;
  // 'role' prop hata diya gaya hai
  serverUrl?: string;
  startFEN?: string;
};

export default function ChessGame({
  roomId,
  serverUrl = "http://localhost:4000",
  startFEN,
}: Props) {
  // create one chess instance
  const [game] = useState(() => new Chess(startFEN));
  const [fen, setFen] = useState<string>(game.fen());
  const socketRef = useRef<Socket | null>(null);

  // YEH HAIN NAYE CHANGES: 'role' ki jagah 'myColor' state
  const location = useLocation(); // React Router se state lene ke liye
  const [myColor, setMyColor] = useState<'w' | 'b' | null>(null);
  
  // Board ka orientation 'myColor' par depend karega
  const orientation = myColor === "b" ? "black" : "white";
  // Aapki chaal hai ya nahi
  const isMyTurn = game.turn() === myColor;

  useEffect(() => {
    const socket = io(serverUrl, { transports: ["websocket", "polling"] });
    socketRef.current = socket;

    // YEH HAI NAYA CHANGE: Lobby se 'playerColor' state padho (sirf creator ke paas hoga)
    const creatorColor = location.state?.playerColor; // 'w', 'b', ya undefined

    // YEH HAI NAYA CHANGE: 'role' ki jagah 'playerColor' bhejo
    socket.emit("joinRoom", { 
      roomId, 
      playerColor: creatorColor // Joiner ke liye yeh undefined hoga, jo theek hai
    });

    // YEH HAI NAYA LISTENER: Server se apna assigned color receive karo
    socket.on("colorAssigned", ({ color }: { color: 'w' | 'b' }) => {
      setMyColor(color);
      console.log(`Mujhe color mila: ${color === 'w' ? 'White' : 'Black'}`);
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

    // YEH HAIN NAYE EVENTS (Optional, par achhe hain)
    socket.on("gameStart", () => {
      console.log("Dono khiladi aa gaye, game shuru!");
      // Yahan aap koi UI element update kar sakte hain
    });

    socket.on("peer_left", () => {
      console.log("Saamne wala khiladi chala gaya...");
      alert("Opponent disconnected.");
      // Yahan aap user ko lobby mein vapis bhej sakte hain
    });
    
    socket.on("error", ({ message }: { message: string }) => {
      console.error("Server se error:", message);
      alert(`Error: ${message}`);
      // Yahan user ko lobby bhej do
    });

    return () => {
      socket.emit("leaveRoom", { roomId });
      socket.disconnect();
    };
    
    // YEH HAI NAYA CHANGE: Dependency array update kiya
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, serverUrl, location.state]); 

  // chessboardjsx onDrop signature: ({ sourceSquare, targetSquare, piece, ...})
  function onDrop(e: { sourceSquare: string; targetSquare: string }) {
    // YEH HAI NAYA CHANGE: Agar aapki turn nahi toh move mat karne do
    if (!isMyTurn) {
      console.log("Aapki chaal nahi hai!");
      setFen(game.fen()); // Board ko vapis purani state par lao
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
    // Sirf 'White' (ya creator) hi reset kar paaye (Optional logic)
    if (myColor !== 'w') {
      alert("Sirf White hi board reset kar sakta hai.");
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
        {/* YEH HAI NAYA CHANGE: UI update */}
        <strong>Room ID:</strong> {roomId}
        <br />
        <strong>Aapka Color:</strong> {myColor === 'w' ? "White (Safed)" : myColor === 'b' ? "Black (Kaala)" : "Waiting..."}
        <br />
        <strong>Kiski Chaal:</strong> {game.turn() === "w" ? "White" : "Black"}
        {isMyTurn && myColor && " (Aapki Chaal)"}
      </div>

      <Chessboard
        width={480}
        position={fen}
        orientation={orientation}
        onDrop={onDrop}
        // YEH HAI NAYA CHANGE: Sirf apni turn par drag karne do
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