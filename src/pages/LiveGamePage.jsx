// src/pages/LiveGamePage.jsx
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import ChessGame from "../components/ChessGame.tsx"; // ChessGame component

const LiveGamePage = () => {
  const { roomId } = useParams();
  
  // Hum user ka role yahan 'state' mein store karenge.
  // Shuru mein yeh 'null' hoga.
  const [userRole, setUserRole] = useState(null);

  // Agar user ne abhi tak role select nahi kiya hai (userRole null hai)
  if (!userRole) {
    return (
      // Role selection screen - bina Layout ke, full screen
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4">Join Game Room</h1>
          <p className="text-gray-400 mb-6">Aap kaise join karna chahte hain?</p>
          
          <div className="flex flex-col gap-4">
            <button
              // Coach (White) banne ke liye
              onClick={() => setUserRole("coach")}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold text-lg"
            >
              Join as Coach (Play as White)
            </button>
            <button
              // Student (Black) banne ke liye
              onClick={() => setUserRole("student")}
              className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold text-lg"
            >
              Join as Student (Play as Black)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Jab user role select kar lega (coach ya student), toh ChessGame component dikhao
  return (
    // Game screen - bina Layout ke, full screen
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h2 className="text-2xl font-bold text-center text-white mb-4">
        Game Room: {roomId}
      </h2>
      
      <ChessGame
        roomId={roomId}
        role={userRole} // Jo role user ne select kiya
        serverUrl="http://localhost:4000" // Aapka backend URL
      />
    </div>
  );
};

export default LiveGamePage;