import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function GameLobby() {
  const [roomIdInput, setRoomIdInput] = useState('');
  const navigate = useNavigate();

  // Function: Ek random room ID banata hai aur redirect karta hai
  const createRoom = () => {
    // 6 digit ki random ID
    const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // User ko naye game URL par bhej do
    navigate(`/play/${newRoomId}`);
  };

  // Function: Input field se ID lekar redirect karta hai
  const joinRoom = () => {
    if (roomIdInput.trim()) {
      navigate(`/play/${roomIdInput.trim().toUpperCase()}`);
    } else {
      alert('Please ek valid Room ID daalein.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md text-center">
        
        {/* === Coach ke liye === */}
        <h2 className="text-2xl font-bold mb-4">Create Game</h2>
        <p className="mb-4 text-gray-400">Ek naya game shuru karein aur ID share karein.</p>
        <button
          onClick={createRoom}
          className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold text-lg"
        >
          Create New Game
        </button>

        <div className="my-8 border-t border-gray-700"></div>

        {/* === Student ke liye === */}
        <h2 className="text-2xl font-bold mb-4">Join Game (Student)</h2>
        <p className="mb-4 text-gray-400">Coach se mili Room ID yahan daalein.</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={roomIdInput}
            onChange={(e) => setRoomIdInput(e.target.value)}
            placeholder="Enter Room ID"
            className="flex-grow px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={joinRoom}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold"
          >
            Join
          </button>
        </div>
        
      </div>
    </div>
  );
}