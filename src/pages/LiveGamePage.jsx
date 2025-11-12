import React, { useState } from 'react'; // 1. useState ko import kiya
import { useParams } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext.jsx'; // 2. useAuth ko hata diya
import ChessGame from '../components/ChessGame.tsx'; // ChessGame component ka path check kar lena

/**
 * Yeh page '/play/:roomId' route par render hoga.
 * Ismein authentication nahi hai. User khud apna role choose karega.
 */
export default function LiveGamePage() {
  // 1. URL se 'roomId' nikaalna
  const { roomId } = useParams();
  
  // 2. User ka role store karne ke liye state banaya
  const [userRole, setUserRole] = useState(null); // Shuru mein role null hai

  // 3. Jab tak role select nahi hota, yeh UI dikhega
  if (!userRole) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
        <h2 className="text-2xl font-bold mb-6">Aap kaun hain?</h2>
        <div className="flex gap-4">
          <button
            onClick={() => setUserRole('coach')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold text-lg"
          >
            I am a Coach
          </button>
          <button
            onClick={() => setUserRole('student')}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold text-lg"
          >
            I am a Student
          </button>
        </div>
      </div>
    );
  }

  // 4. Jaise hi user role select karta hai, ChessGame component render hoga
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-black p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold text-white text-center mb-6">
        Live Chess Match (Room: {roomId})
      </h1>
      
      <ChessGame
        roomId={roomId}
        role={userRole} // 4. Yahan selected role (coach/student) pass kiya
        serverUrl={import.meta.env.VITE_API_URL} 
      />
    </div>
  );
}