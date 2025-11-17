// src/pages/LiveGamePage.jsx
import React, { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ChessGame from "../components/ChessGame.tsx";

const LiveGamePage = () => {
  const { roomId } = useParams();
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  // Measure header height
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const compute = () =>
      setHeaderHeight(el.getBoundingClientRect().height || 0);

    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);

    window.addEventListener("resize", compute);
    window.addEventListener("orientationchange", compute);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", compute);
      window.removeEventListener("orientationchange", compute);
    };
  }, []);

  const copyRoomId = async () => {
    if (!roomId) return;
    try {
      await navigator.clipboard.writeText(roomId);
      alert("Room ID copied");
    } catch {}
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center"
      style={{
        background:
          "linear-gradient(180deg, #0f213f 0%, #111a34 40%, #0b1730 100%)",
      }}
    >
      {/* Header */}
      <header
        ref={headerRef}
        className="w-full max-w-5xl px-4 sm:px-6 lg:px-8 pt-4 pb-2"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h2 className="text-[#FFD832] text-base sm:text-lg md:text-xl font-semibold">
              Game Room
            </h2>

            <div className="inline-flex items-center gap-2 border border-[#FFD832] text-[#FFD832] px-3 py-1 rounded-full">
              <span className="font-mono text-xs sm:text-sm md:text-base tracking-wide">
                {roomId || "—"}
              </span>
            </div>
          </div>

          <button
            onClick={copyRoomId}
            className="px-3 py-1.5 rounded-md border border-[#FFD832] text-[#FFD832] hover:bg-[#FFD83220] transition text-sm"
          >
            Copy
          </button>
        </div>
      </header>

      {/* Info Card */}
      <div className="w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <div
          className="rounded-xl p-3 border border-[#FFD83260] text-[#FFD832] mb-3"
          style={{
            maxHeight: 96,
            overflow: "hidden",
          }}
        >
          <div className="leading-tight">
            <div>
              Room ID: <span className="font-mono">{roomId}</span>
            </div>
            <div className="text-xs mt-1">
              Your Color: <span className="font-medium">Waiting...</span>
            </div>
            <div className="text-xs">
              Move: <span className="font-medium">White</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chess Game Container */}
      <main className="flex-1 w-full flex items-start justify-center px-3 pb-6">
        <div className="w-full max-w-5xl px-4 sm:px-6">
          <ChessGame
            roomId={roomId}
            serverUrl={import.meta.env.VITE_SOCKET_URL}
            headerHeight={headerHeight}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-5xl px-4 pb-6 text-center">
        <p className="text-xs text-[#FFD83290]">
          Tip: rotate to landscape for a larger board on mobile.
        </p>
      </footer>
    </div>
  );
};

export default LiveGamePage;
