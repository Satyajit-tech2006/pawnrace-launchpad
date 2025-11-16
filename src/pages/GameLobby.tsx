// src/pages/GameLobby.tsx
import React, { useState } from 'react'; // 'useState' import kiya
import { useNavigate } from 'react-router-dom';

export default function GameLobby() {
  const [roomIdInput, setRoomIdInput] = useState('');
  const [showColorChoice, setShowColorChoice] = useState(false); // YEH HAI NAYA STATE
  const navigate = useNavigate();

  // Function: User ko color select karne ka option dikhata hai
  const handleCreateClick = () => {
    setShowColorChoice(true); // Bas state update karo
  };

  // Function: Naya room banata hai aur chune gaye color ke saath navigate karta hai
  const createRoomAndNavigate = (color) => {
    // 6 digit ki random ID
    const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // User ko naye game URL par bhej do, 'state' mein color ke saath
    // Aapko apne 'ChessGame.tsx' (ya /play/:roomId) component mein yeh state receive karna hoga
    navigate(`/play/${newRoomId}`, { state: { playerColor: color } });
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
        
        {/* === Game Banane ke liye === */}
        <h2 className="text-2xl font-bold mb-4">Create Game</h2>
        <p className="mb-4 text-gray-400">Ek naya game shuru karein aur ID share karein.</p>
        
        {/* YEH HAI NAYA LOGIC: Jab tak color na chuna ho, tab tak yeh button dikhao */}
        {!showColorChoice && (
          <button
            onClick={handleCreateClick}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold text-lg"
          >
            Create New Game
          </button>
        )}

        {/* YEH HAI NAYA LOGIC: Jab 'Create New Game' click ho jaaye, toh yeh options dikhao */}
        {showColorChoice && (
          <div className="mt-4">
            <p className="text-lg mb-4">Aap kaunsa color lenge?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => createRoomAndNavigate('w')} // 'w' for White
                className="flex-1 px-6 py-3 bg-gray-200 text-black font-bold rounded-lg hover:bg-white text-lg"
              >
                White (Safed)
              </button>
              <button
                onClick={() => createRoomAndNavigate('b')} // 'b' for Black
                className="flex-1 px-6 py-3 bg-gray-700 border border-gray-500 text-white font-bold rounded-lg hover:bg-black text-lg"
              >
                Black (Kaala)
              </button>
            </div>
          </div>
        )}

        <div className="my-8 border-t border-gray-700"></div>

        {/* === Game Join karne ke liye === */}
        <h2 className="text-2xl font-bold mb-4">Join Game</h2>
        {/* YEH HAI NAYA CHANGE: Text badal diya gaya hai */}
        <p className="mb-4 text-gray-400">Dost se mili Room ID yahan daalein.</p>
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