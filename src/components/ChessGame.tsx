// src/components/ChessGame.tsx
import React, { useEffect, useRef, useState } from "react";
import Chessboard from "chessboardjsx";
import { Chess } from "chess.js";
import { io, Socket } from "socket.io-client";
import { useLocation } from "react-router-dom";

type Props = {
  roomId: string;
  // 'role' prop removed
  serverUrl?: string;
  startFEN?: string;
  headerHeight?: number; // optional: measured header height from parent to compute available space
};

export default function ChessGame({
  roomId,
  serverUrl = import.meta.env.VITE_SOCKET_URL,
  startFEN,
  headerHeight = 0,
}: Props) {
  // chess instance & FEN state
  const [game] = useState(() => new Chess(startFEN));
  const [fen, setFen] = useState<string>(game.fen());

  // socket ref
  const socketRef = useRef<Socket | null>(null);

  // color assignment (w or b)
  const location = useLocation();
  const [myColor, setMyColor] = useState<"w" | "b" | null>(null);

  // responsive sizing
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [boardSize, setBoardSize] = useState<number>(480); // fallback

  // winner / toast state
  const [winner, setWinner] = useState<"w" | "b" | "draw" | null>(null);
  const [showToast, setShowToast] = useState(false);

  // orientation for chessboardjsx expects 'white' | 'black'
  const orientation = myColor === "b" ? "black" : "white";

  // is it the player's turn? (game.turn() returns 'w' or 'b')
  const isMyTurn = myColor !== null && game.turn() === myColor;

  /* -------------------------
     Palette (from screenshot)
     ------------------------- */
  const palette = {
    whiteWinBg: "#f6a800", // warm yellow/orange
    whiteWinText: "#0b1230",
    blackWinBg: "#0f2646", // dark navy
    blackWinText: "#ffffff",
    toastShadow: "rgba(2,6,23,0.45)",
  };

  /* -------------------------
     Helper: show winner toast
     ------------------------- */
  const announceWinner = (result: "w" | "b" | "draw") => {
    setWinner(result);
    setShowToast(true);
    // auto-hide after 6s
    setTimeout(() => {
      setShowToast(false);
    }, 6000);
  };

  /* -------------------------
     Check game-over after moves
     ------------------------- */
  const checkGameOverAndAnnounce = () => {
    if (game.game_over()) {
      if (game.in_checkmate()) {
        // winner is the side that is NOT to move
        const winnerSide = game.turn() === "w" ? "b" : "w";
        announceWinner(winnerSide);
      } else {
        // draw/stalemate/other
        announceWinner("draw");
      }
    }
  };

  /* -------------------------
     Socket & server listeners
     ------------------------- */
  useEffect(() => {
    const socket = io(serverUrl, { transports: ["websocket", "polling"] });
    socketRef.current = socket;

    // creator may pass initial color via location.state.playerColor
    const creatorColor = location.state?.playerColor; // 'w' | 'b' | undefined

    socket.emit("joinRoom", {
      roomId,
      playerColor: creatorColor,
    });

    socket.on("colorAssigned", ({ color }: { color: "w" | "b" }) => {
      setMyColor(color);
      console.log(`Assigned color: ${color === "w" ? "White" : "Black"}`);
    });

    socket.on("opponentMove", ({ fen: newFen }: { fen?: string }) => {
      if (newFen) {
        try {
          game.load(newFen);
          setFen(game.fen());
          // after we load opponent move, check for game over
          checkGameOverAndAnnounce();
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
          checkGameOverAndAnnounce();
        } catch (e) {
          console.error("Failed to sync state:", e);
        }
      }
    });

    socket.on("gameStart", () => {
      console.log("Both players have joined, game started!");
    });

    socket.on("peer_left", () => {
      console.log("Opponent has left...");
      alert("Opponent disconnected.");
    });

    socket.on("error", ({ message }: { message: string }) => {
      console.error("Error from server:", message);
      alert(`Error: ${message}`);
    });

    return () => {
      socket.emit("leaveRoom", { roomId });
      socket.disconnect();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, serverUrl, location.state]);

  /* -------------------------
     Responsive board sizing
     ------------------------- */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const computeSize = () => {
      const rect = el.getBoundingClientRect();
      const availableWidth = rect.width; // container width
      const viewportHeight = window.innerHeight;

      // approximate reserved vertical space:
      // headerHeight from parent + some footer/margin safe buffer
      const footerBuffer = 110; // adjust if your page has larger footer controls
      const availableHeight = Math.max(
        160,
        viewportHeight - (headerHeight || 0) - footerBuffer
      );

      // choose the largest square that fits both width and availableHeight
      const size = Math.floor(Math.min(availableWidth, availableHeight, 900)); // cap if desired
      setBoardSize(Math.max(size, 200)); // minimum size
    };

    computeSize();

    const ro = new ResizeObserver(() => computeSize());
    ro.observe(el);

    window.addEventListener("resize", computeSize);
    window.addEventListener("orientationchange", computeSize);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", computeSize);
      window.removeEventListener("orientationchange", computeSize);
    };
  }, [headerHeight]);

  /* -------------------------
     Make move handler
     ------------------------- */
  function onDrop(e: { sourceSquare: string; targetSquare: string; piece?: string }) {
    // block moves if color not yet assigned or not player's turn
    if (!myColor) {
      console.log("Color not assigned yet.");
      setFen(game.fen());
      return;
    }
    if (!isMyTurn) {
      console.log("It's not your turn!");
      setFen(game.fen());
      return;
    }

    const { sourceSquare, targetSquare } = e;

    let move = null;
    try {
      move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
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

    // legal move: update local FEN and emit
    setFen(game.fen());
    socketRef.current?.emit("makeMove", {
      roomId,
      move,
      fen: game.fen(),
      pgn: game.pgn(),
    });

    // after making our move, check for game over locally
    checkGameOverAndAnnounce();
  }

  /* -------------------------
     Reset board
     ------------------------- */
  function resetBoard() {
    // optional: restrict reset to White or creator — adjust as needed
    if (myColor !== "w") {
      alert("Only White can reset the board.");
      return;
    }
    game.reset();
    setFen(game.fen());
    setWinner(null);
    setShowToast(false);
    socketRef.current?.emit("syncState", {
      roomId,
      fen: game.fen(),
      pgn: game.pgn(),
    });
  }

  /* -------------------------
     Keep FEN updated if something else changes local game
     ------------------------- */
  useEffect(() => {
    setFen(game.fen());
    // no dependency on game (stable ref in state)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* -------------------------
     Toast styles (inline for simplicity)
     ------------------------- */
  const toastStyles: React.CSSProperties = {
    position: "fixed",
    right: 20,
    top: 20,
    zIndex: 9999,
    minWidth: 220,
    padding: "12px 16px",
    borderRadius: 12,
    boxShadow: `0 8px 24px ${palette.toastShadow}`,
    display: showToast ? "flex" : "none",
    alignItems: "center",
    gap: 12,
    color: "#fff",
    fontWeight: 600,
  };

  const getToastTheme = () => {
    if (winner === "w") {
      return {
        background: palette.whiteWinBg,
        color: palette.whiteWinText,
      };
    }
    if (winner === "b") {
      return {
        background: palette.blackWinBg,
        color: palette.blackWinText,
      };
    }
    // draw
    return {
      background: "#6b7280",
      color: "#fff",
    };
  };

  return (
    <>
      {/* toast */}
      <div
        style={{
          ...toastStyles,
          ...(getToastTheme() as React.CSSProperties),
        }}
        role="status"
        aria-live="polite"
      >
        <div style={{ flex: 1 }}>
          {winner === "w" && <div>🏆 White wins</div>}
          {winner === "b" && <div>🏆 Black wins</div>}
          {winner === "draw" && <div>🤝 Draw / Stalemate</div>}
          <div style={{ fontWeight: 500, fontSize: 12, opacity: 0.95, marginTop: 6 }}>
            {winner === "w" && `White (Light) wins the game.`}
            {winner === "b" && `Black (Dark) wins the game.`}
            {winner === "draw" && `No winners — the game ended in a draw.`}
          </div>
        </div>

        <button
          onClick={() => {
            setShowToast(false);
          }}
          style={{
            border: "none",
            background: "transparent",
            color: "inherit",
            cursor: "pointer",
            fontSize: 14,
            padding: 6,
            borderRadius: 8,
            opacity: 0.95,
          }}
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>

      {/* main board */}
      <div
        ref={containerRef}
        style={{ width: "100%", display: "flex", justifyContent: "center" }}
      >
        <div style={{ width: boardSize, maxWidth: "100%" }}>
          <div style={{ marginBottom: 8, color: "#fff", fontSize: 13 }}>
            <div>
              <strong>Room ID:</strong> {roomId}
            </div>
            <div>
              <strong>Your Color:</strong>{" "}
              {myColor === "w" ? "White" : myColor === "b" ? "Black" : "Waiting..."}
            </div>
            <div>
              <strong>Move:</strong> {game.turn() === "w" ? "White" : "Black"}
              {isMyTurn && myColor ? " (Your Turn)" : ""}
            </div>
          </div>

          <div style={{ background: "#d6b98a", borderRadius: 8, overflow: "hidden" }}>
            <Chessboard
              width={boardSize}
              position={fen}
              orientation={orientation}
              onDrop={onDrop}
              draggable={isMyTurn}
            />
          </div>

          <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
            <button
              onClick={resetBoard}
              style={{
                padding: "8px 12px",
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
              }}
            >
              Reset Game
            </button>

            <div style={{ marginTop: 6 }}>
              <code style={{ color: "#ddd", fontSize: 12 }}>FEN:</code>{" "}
              <span style={{ fontSize: 12, color: "#ddd" }}>{fen}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
