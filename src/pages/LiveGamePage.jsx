// src/pages/LiveGamePage.jsx
import React from "react"; // 'useState' hata diya gaya hai
import { useParams } from "react-router-dom";
import ChessGame from "../components/ChessGame.tsx"; // ChessGame component

const LiveGamePage = () => {
  const { roomId } = useParams();

  // 'userRole' state aur role selection logic poori tarah hata diya gaya hai.

  // Ab hum seedha ChessGame component render karenge.
  // 'ChessGame' component ab khud 'useLocation' se state padhega (creator ke liye)
  // aur server se apna color assign karwayega (joiner ke liye).
  return (
    // Game screen - bina Layout ke, full screen
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h2 className="text-2xl font-bold text-center text-white mb-4">
        Game Room: {roomId}
      </h2>

      <ChessGame
        roomId={roomId}
        // 'role' prop yahan se hata diya gaya hai
        serverUrl={import.meta.env.VITE_SOCKET_URL} // my backend URL
      />
    </div>
  );
};

export default LiveGamePage;
