import React, { useEffect, useState } from "react";
import DashboardNavbar from "../../../components/Dashbordnavbar"; // Adjust path if needed
import { FaTrophy, FaGamepad } from "react-icons/fa";

const StudentTournament = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active");

  const API_URL = `${import.meta.env.VITE_API_URL}/tournaments`;

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setTournaments(data);
      } catch (error) {
        console.error("Error fetching tournaments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTournaments();
  }, [API_URL]);

  const activeList = tournaments.filter(t => t.status === "active" || !t.status);
  const completedList = tournaments.filter(t => t.status === "completed");

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans relative">
      <DashboardNavbar />
      
      <div className="max-w-6xl mx-auto pt-24 px-6 pb-12">
        <h1 className="text-3xl font-extrabold text-center mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Tournament Arena
        </h1>

        {/* --- TABS --- */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab("active")}
            className={`px-6 py-2 rounded-xl font-bold text-base transition-all duration-300 transform flex items-center gap-2 ${
              activeTab === "active" 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20 scale-105" 
                : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white border border-gray-700"
            }`}
          >
            <FaGamepad /> Active Battles
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`px-6 py-2 rounded-xl font-bold text-base transition-all duration-300 transform flex items-center gap-2 ${
              activeTab === "completed" 
                ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20 scale-105" 
                : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white border border-gray-700"
            }`}
          >
            <FaTrophy /> Hall of Fame
          </button>
        </div>

        {/* --- ACTIVE TAB --- */}
        {activeTab === "active" && (
          <div className="animate-fade-in-up grid gap-4">
              {activeList.length === 0 ? (
                 <div className="text-center py-12 bg-gray-800/30 rounded-2xl border border-gray-700 border-dashed">
                   <p className="text-gray-500 text-sm">No active tournaments scheduled.</p>
                 </div>
              ) : activeList.map((t) => (
                <div key={t._id} className="bg-gray-800/80 border border-gray-700 rounded-xl p-5 flex flex-col md:flex-row justify-between items-center gap-4 shadow-lg hover:border-blue-500/40 transition-all duration-300">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-white">{t.name}</h2>
                    <div className="flex flex-wrap gap-3 mt-2">
                      <span className="bg-gray-900 text-blue-400 px-3 py-1 rounded-md border border-gray-700 font-mono text-xs">
                        📅 {new Date(t.date).toLocaleDateString('en-GB')}
                      </span>
                      <span className="bg-gray-900 text-green-400 px-3 py-1 rounded-md border border-gray-700 font-mono text-xs">
                        ⏰ {new Date(t.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                  </div>

                  <a 
                    href={t.link} target="_blank" rel="noopener noreferrer" 
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-lg shadow-md transition transform hover:scale-105"
                  >
                    Join 🚀
                  </a>
                </div>
              ))}
          </div>
        )}

        {/* --- COMPLETED TAB --- */}
        {activeTab === "completed" && (
          <div className="space-y-4 animate-fade-in-up">
            {completedList.length === 0 ? <p className="text-center text-gray-500 text-sm mt-8">No past tournaments.</p> : completedList.map((t) => (
              <div key={t._id} className="bg-gray-800/40 border border-gray-700 rounded-xl p-5 shadow-sm hover:bg-gray-800/60 transition duration-300 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500"></div>
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-gray-200">{t.name}</h2>
                    <p className="text-gray-500 text-xs mt-1">Ended: {new Date(t.date).toLocaleDateString('en-GB')}</p>
                  </div>
                  
                  <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700 w-full md:w-auto md:min-w-[250px]">
                    <div className="flex items-center gap-2 text-yellow-400 font-bold text-sm mb-1 border-b border-gray-700 pb-1">
                      <FaTrophy /> 
                      <span>{t.winner}</span>
                    </div>
                    <p className="text-gray-300 text-xs italic">"{t.review}"</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentTournament;