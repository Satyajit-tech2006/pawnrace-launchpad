import React, { useEffect, useState } from "react";
import DashboardNavbar from "../../../components/Dashbordnavbar";

const CoachTournament = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newTournament, setNewTournament] = useState({
    name: "",
    date: "",
    link: "",
  });

  // --- CONFIGURATION ---
  // Replace these strings with the actual _id strings from your MongoDB Users collection
  const ALLOWED_COACH_IDS = ["68b9ea4597d09c8a268e8d38"];

  // Get current user from LocalStorage
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const currentUserId = currentUser?._id;
  const isAllowedCoach = ALLOWED_COACH_IDS.includes(currentUserId);

  const API_URL = "http://localhost:5000/api/tournaments";

  // Fetch Data
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
  }, []);

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAllowedCoach) return;

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTournament),
      });

      if (res.ok) {
        const data = await res.json();
        setTournaments([...tournaments, data]);
        setNewTournament({ name: "", date: "", link: "" });
        alert("Tournament Created Successfully!");
      }
    } catch (error) {
      console.error("Error adding tournament:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans selection:bg-purple-500 selection:text-white">
      <DashboardNavbar />
      
      <div className="max-w-6xl mx-auto pt-28 px-6 pb-12">
        
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Tournament Arena
          </h1>
          <p className="text-gray-400 mt-2">
            Join competitive programming battles or organize your own.
          </p>
        </div>

        {/* --- SECTION 1: ACTION AREA --- */}
        <div className="mb-12">
          {isAllowedCoach ? (
            /* COACH VIEW: Create Form */
            <div className="bg-gray-900/80 backdrop-blur-md border border-gray-700 p-8 rounded-2xl shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-8 bg-green-500 rounded-full"></div>
                <h2 className="text-2xl font-bold text-white">Create New Tournament</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                <div className="md:col-span-4">
                  <label className="block text-gray-400 text-sm font-medium mb-2">Tournament Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Grand Coding Prix"
                    value={newTournament.name}
                    onChange={(e) => setNewTournament({ ...newTournament, name: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                    required
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-gray-400 text-sm font-medium mb-2">Date & Time</label>
                  <input
                    type="datetime-local"
                    value={newTournament.date}
                    onChange={(e) => setNewTournament({ ...newTournament, date: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition text-gray-300"
                    required
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-gray-400 text-sm font-medium mb-2">Platform Link</label>
                  <input
                    type="url"
                    placeholder="https://hackerrank.com/..."
                    value={newTournament.link}
                    onChange={(e) => setNewTournament({ ...newTournament, link: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    + Publish
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* STUDENT VIEW: Not Authorized Message */
            <div className="bg-red-900/20 border border-red-500/30 p-6 rounded-xl flex items-center justify-center text-center backdrop-blur-sm">
              <div>
                <h3 className="text-red-400 font-bold text-lg">⚠️ Admin Access Restricted</h3>
                <p className="text-red-200/70 text-sm mt-1">
                  You are not authorized to create tournaments. You can only view and join active events below.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* --- SECTION 2: TOURNAMENT FEED --- */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-300 border-l-4 border-blue-500 pl-3">
            Active Tournaments
          </h3>

          {loading ? (
             <div className="text-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
             </div>
          ) : tournaments.length === 0 ? (
             <div className="bg-gray-800/50 rounded-xl p-8 text-center border border-gray-700 border-dashed">
                <p className="text-gray-500">No active tournaments scheduled at the moment.</p>
             </div>
          ) : (
            <div className="grid gap-5">
              {tournaments.map((t) => (
                <div 
                  key={t._id} 
                  className="group bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-blue-500/50 rounded-xl p-6 transition-all duration-300 shadow-lg relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 group-hover:bg-purple-500 transition-colors"></div>
                  
                  <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-white group-hover:text-blue-300 transition-colors">
                        {t.name}
                      </h2>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                        <span className="flex items-center gap-1 bg-gray-900 px-3 py-1 rounded-full border border-gray-700">
                          📅 {new Date(t.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-1 bg-gray-900 px-3 py-1 rounded-full border border-gray-700 text-green-400 font-mono">
                          ⏰ {new Date(t.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>

                    <a
                      href={t.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full md:w-auto text-center bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-lg font-bold shadow-lg shadow-blue-900/30 transition-all transform hover:scale-105"
                    >
                      Join Battle ⚔️
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default CoachTournament;