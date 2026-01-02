import React, { useEffect, useState } from "react";
import DashboardNavbar from "../../../components/Dashbordnavbar";
import { FaTrophy, FaTrash, FaGamepad } from "react-icons/fa";

const CoachTournament = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active");

  const [newTournament, setNewTournament] = useState({ name: "", date: "", link: "" });
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedTournamentId, setSelectedTournamentId] = useState(null);
  const [completionData, setCompletionData] = useState({ winner: "", review: "" });

  // --- CONFIGURATION ---
  const ALLOWED_COACH_IDS = ["68b9ea4597d09c8a268e8d38","68c5cf8d0127081a51b8c064"]; 

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const currentUserId = currentUser?._id;
  const userRole = currentUser?.role || "student";
  
  const isAuthorizedCoach = userRole === "coach" && ALLOWED_COACH_IDS.includes(currentUserId);
  const isUnauthorizedCoach = userRole === "coach" && !ALLOWED_COACH_IDS.includes(currentUserId);

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

  // --- HANDLERS ---

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!isAuthorizedCoach) return;

    // Timezone Fix: Convert to UTC ISO before sending
    const payload = {
      ...newTournament,
      date: new Date(newTournament.date).toISOString() 
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        setTournaments([data, ...tournaments]);
        setNewTournament({ name: "", date: "", link: "" });
        alert("Tournament Created!");
      }
    } catch (error) { console.error(error); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this tournament?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (res.ok) {
        setTournaments(tournaments.filter((t) => t._id !== id));
      }
    } catch (error) { console.error(error); }
  };

  const openCompletionModal = (id) => {
    setSelectedTournamentId(id);
    setCompletionData({ winner: "", review: "" });
    setShowModal(true);
  };

  const handleCompleteSubmit = async () => {
    try {
      const res = await fetch(`${API_URL}/${selectedTournamentId}/complete`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(completionData),
      });

      if (res.ok) {
        const updatedTournament = await res.json();
        setTournaments(tournaments.map(t => t._id === selectedTournamentId ? updatedTournament : t));
        setShowModal(false);
      }
    } catch (error) { console.error(error); }
  };

  const activeList = tournaments.filter(t => t.status === "active" || !t.status);
  const completedList = tournaments.filter(t => t.status === "completed");

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans relative">
      <DashboardNavbar />
      
      <div className="max-w-6xl mx-auto pt-24 px-6 pb-12">
        <h1 className="text-3xl font-extrabold text-center mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Tournament Arena
        </h1>

        {isUnauthorizedCoach && (
          <div className="mb-6 bg-red-900/20 border border-red-500/50 p-4 rounded-xl text-center backdrop-blur-sm">
            <h3 className="text-red-400 font-bold text-lg">⚠️ Admin Access Restricted</h3>
            <p className="text-red-200/70 text-sm mt-1">Only Authorized Coaches can manage tournaments.</p>
          </div>
        )}

        {/* --- TABS (Compact) --- */}
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
          <div className="animate-fade-in-up space-y-6">
            
            {/* Create Form (Compact) */}
            {isAuthorizedCoach && (
              <div className="bg-gray-900/60 backdrop-blur-md border border-gray-700 p-6 rounded-2xl shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-green-500"></div>
                <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2">
                  <span className="text-green-400">✚</span> Create New Battle
                </h3>
                
                <form onSubmit={handleCreate} className="flex flex-col md:flex-row gap-3 items-end">
                  <div className="flex-grow w-full">
                    <label className="text-xs text-gray-400 mb-1 block ml-1">Tournament Name</label>
                    <input 
                      type="text" placeholder="e.g. Grand Prix" 
                      value={newTournament.name} onChange={(e) => setNewTournament({...newTournament, name: e.target.value})} 
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2.5 focus:border-green-500 outline-none text-sm transition" required 
                    />
                  </div>
                  <div className="w-full md:w-48">
                    <label className="text-xs text-gray-400 mb-1 block ml-1">Date & Time</label>
                    <input 
                      type="datetime-local" 
                      value={newTournament.date} onChange={(e) => setNewTournament({...newTournament, date: e.target.value})} 
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2.5 focus:border-green-500 outline-none text-gray-300 text-sm" required 
                    />
                  </div>
                  <div className="flex-grow w-full">
                    <label className="text-xs text-gray-400 mb-1 block ml-1">Platform Link</label>
                    <input 
                      type="url" placeholder="https://..." 
                      value={newTournament.link} onChange={(e) => setNewTournament({...newTournament, link: e.target.value})} 
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2.5 focus:border-green-500 outline-none text-sm transition" required 
                    />
                  </div>
                  <button type="submit" className="w-full md:w-auto px-6 py-2.5 bg-green-600 hover:bg-green-500 text-white font-bold text-sm rounded-lg shadow-md transition transform hover:scale-105">
                    Publish
                  </button>
                </form>
              </div>
            )}

            {/* Active List */}
            <div className="grid gap-4">
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
                        {/* DATE FORMAT CHANGE: en-GB gives dd/mm/yyyy */}
                        📅 {new Date(t.date).toLocaleDateString('en-GB')}
                      </span>
                      <span className="bg-gray-900 text-green-400 px-3 py-1 rounded-md border border-gray-700 font-mono text-xs">
                        ⏰ {new Date(t.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <a 
                      href={t.link} target="_blank" rel="noopener noreferrer" 
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-lg shadow-md transition transform hover:scale-105"
                    >
                      Join 🚀
                    </a>
                    
                    {isAuthorizedCoach && (
                      <div className="flex gap-2 bg-gray-900/50 p-1.5 rounded-lg border border-gray-700">
                        <button 
                          onClick={() => openCompletionModal(t._id)} 
                          className="px-3 py-1.5 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-md text-xs flex items-center gap-1 transition"
                          title="Declare Winner"
                        >
                          <FaTrophy /> End
                        </button>
                        <button 
                          onClick={() => handleDelete(t._id)} 
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-md text-xs transition"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
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
                    {/* DATE FORMAT CHANGE HERE TOO */}
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

      {/* --- MODAL (Compact) --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-600 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-scale-in">
            <h2 className="text-xl font-bold mb-6 text-white text-center">🏆 Declare Results</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-xs mb-1 font-bold uppercase tracking-wider">Winner Name</label>
                <input 
                  type="text" 
                  value={completionData.winner} 
                  onChange={(e) => setCompletionData({...completionData, winner: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 focus:border-purple-500 outline-none text-white text-sm transition"
                  placeholder="e.g. Alex"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-xs mb-1 font-bold uppercase tracking-wider">Coach's Review</label>
                <textarea 
                  value={completionData.review} 
                  onChange={(e) => setCompletionData({...completionData, review: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 focus:border-purple-500 outline-none text-white h-24 text-sm transition resize-none"
                  placeholder="Comment..."
                />
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={() => setShowModal(false)} className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold text-gray-300 text-sm transition">Cancel</button>
                <button onClick={handleCompleteSubmit} className="flex-1 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-bold text-sm shadow-lg transition">Confirm</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoachTournament;