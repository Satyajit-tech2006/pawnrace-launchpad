import React, { useEffect, useState } from "react";
import DashboardNavbar from "../../../components/Dashbordnavbar";
// If you don't have react-icons, install them: npm install react-icons
// Or remove the icons from the code below if you prefer text only
import { FaTrophy, FaTrash, FaCheckCircle, FaTimes } from "react-icons/fa"; 

const CoachTournament = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active"); // Options: "active" or "completed"

  // Create Form State
  const [newTournament, setNewTournament] = useState({ name: "", date: "", link: "" });

  // Modal State (For "Set as Completed")
  const [showModal, setShowModal] = useState(false);
  const [selectedTournamentId, setSelectedTournamentId] = useState(null);
  const [completionData, setCompletionData] = useState({ winner: "", review: "" });

  // --- CONFIGURATION ---
  // 1. Add your Authorized Coach ID here
  const ALLOWED_COACH_IDS = ["68b9ea4597d09c8a268e8d38"]; 

  // 2. Auth Logic
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const currentUserId = currentUser?._id;
  const userRole = currentUser?.role || "student";
  
  const isAuthorizedCoach = userRole === "coach" && ALLOWED_COACH_IDS.includes(currentUserId);
  const isUnauthorizedCoach = userRole === "coach" && !ALLOWED_COACH_IDS.includes(currentUserId);

  const API_URL = `${import.meta.env.VITE_API_URL}/tournaments`;

  // --- FETCH DATA ---
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

  // 1. Create Tournament
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!isAuthorizedCoach) return;

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTournament),
      });

      if (res.ok) {
        const data = await res.json();
        setTournaments([data, ...tournaments]); // Add new item to top
        setNewTournament({ name: "", date: "", link: "" });
        alert("Tournament Created!");
      }
    } catch (error) { console.error(error); }
  };

  // 2. Delete Tournament
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this tournament?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (res.ok) {
        setTournaments(tournaments.filter((t) => t._id !== id));
      }
    } catch (error) { console.error(error); }
  };

  // 3. Open the "End Tournament" Modal
  const openCompletionModal = (id) => {
    setSelectedTournamentId(id);
    setCompletionData({ winner: "", review: "" }); // Reset form
    setShowModal(true);
  };

  // 4. Submit the Winner (Mark as Completed)
  const handleCompleteSubmit = async () => {
    try {
      // NOTE: Make sure your backend route is correct: /:id/complete
      const res = await fetch(`${API_URL}/${selectedTournamentId}/complete`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(completionData),
      });

      if (res.ok) {
        const updatedTournament = await res.json();
        // Update the list: Replace the old active one with the new completed one
        setTournaments(tournaments.map(t => t._id === selectedTournamentId ? updatedTournament : t));
        setShowModal(false);
      }
    } catch (error) { console.error(error); }
  };

  // --- FILTERING ---
  const activeList = tournaments.filter(t => t.status === "active" || !t.status); // Default to active if status missing
  const completedList = tournaments.filter(t => t.status === "completed");

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans selection:bg-purple-500 selection:text-white relative">
      <DashboardNavbar />
      
      <div className="max-w-6xl mx-auto pt-28 px-6 pb-12">
        <h1 className="text-4xl font-extrabold text-center mb-10 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Tournament Arena
        </h1>

        {/* WARNING FOR UNAUTHORIZED COACHES */}
        {isUnauthorizedCoach && (
          <div className="mb-8 bg-red-900/20 border border-red-500/30 p-4 rounded-xl text-center">
            <h3 className="text-red-400 font-bold">⚠️ Admin Access Restricted</h3>
            <p className="text-red-200/70 text-sm">Only Authorized Coaches can manage tournaments.</p>
          </div>
        )}

        {/* --- TAB BUTTONS (This is what you were missing!) --- */}
        <div className="flex justify-center gap-6 mb-8">
          <button
            onClick={() => setActiveTab("active")}
            className={`px-8 py-3 rounded-full font-bold text-lg transition-all duration-300 transform ${
              activeTab === "active" 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/40 scale-105" 
                : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
            }`}
          >
            🔥 Active Battles
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`px-8 py-3 rounded-full font-bold text-lg transition-all duration-300 transform ${
              activeTab === "completed" 
                ? "bg-purple-600 text-white shadow-lg shadow-purple-500/40 scale-105" 
                : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
            }`}
          >
            🏆 Hall of Fame
          </button>
        </div>

        {/* --- VIEW: ACTIVE TOURNAMENTS --- */}
        {activeTab === "active" && (
          <div className="animate-fade-in-up">
            
            {/* Create Form (Authorized Only) */}
            {isAuthorizedCoach && (
              <div className="bg-gray-900/50 border border-gray-700 p-6 rounded-xl mb-8">
                <h3 className="text-lg font-bold mb-4 text-green-400">Create New Battle</h3>
                <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <input 
                    type="text" placeholder="Tournament Name" 
                    value={newTournament.name} onChange={(e) => setNewTournament({...newTournament, name: e.target.value})} 
                    className="bg-gray-800 border border-gray-600 rounded p-2 focus:border-green-500 outline-none" required 
                  />
                  <input 
                    type="datetime-local" 
                    value={newTournament.date} onChange={(e) => setNewTournament({...newTournament, date: e.target.value})} 
                    className="bg-gray-800 border border-gray-600 rounded p-2 focus:border-green-500 outline-none text-gray-300" required 
                  />
                  <input 
                    type="url" placeholder="Link" 
                    value={newTournament.link} onChange={(e) => setNewTournament({...newTournament, link: e.target.value})} 
                    className="bg-gray-800 border border-gray-600 rounded p-2 focus:border-green-500 outline-none" required 
                  />
                  <button type="submit" className="bg-green-600 hover:bg-green-500 text-white font-bold rounded p-2 transition">+ Create</button>
                </form>
              </div>
            )}

            {/* List of Active Tournaments */}
            <div className="space-y-4">
              {activeList.length === 0 ? <p className="text-center text-gray-500">No active tournaments.</p> : activeList.map((t) => (
                <div key={t._id} className="bg-gray-800 border border-gray-700 rounded-xl p-5 flex flex-col md:flex-row justify-between items-center gap-4 shadow-lg hover:border-blue-500/30 transition">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-white">{t.name}</h2>
                    <p className="text-gray-400 text-sm mt-1">
                      📅 {new Date(t.date).toLocaleDateString()} • ⏰ {new Date(t.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Join Link (Everyone) */}
                    <a href={t.link} target="_blank" rel="noopener noreferrer" className="bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded-lg font-bold transition text-sm text-white">
                      Join 🚀
                    </a>
                    
                    {/* Buttons for Authorized Coach */}
                    {isAuthorizedCoach && (
                      <>
                        <button 
                          onClick={() => openCompletionModal(t._id)} 
                          className="bg-yellow-600 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg font-bold transition text-sm flex items-center gap-2"
                          title="End Tournament & Declare Winner"
                        >
                          <FaTrophy /> End
                        </button>
                        <button 
                          onClick={() => handleDelete(t._id)} 
                          className="bg-red-600 hover:bg-red-500 text-white p-2.5 rounded-lg transition" 
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- VIEW: COMPLETED TOURNAMENTS --- */}
        {activeTab === "completed" && (
          <div className="space-y-4 animate-fade-in-up">
            {completedList.length === 0 ? <p className="text-center text-gray-500">No past tournaments yet.</p> : completedList.map((t) => (
              <div key={t._id} className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-purple-500 group-hover:bg-purple-400 transition-colors"></div>
                
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-200">{t.name}</h2>
                    <p className="text-gray-500 text-sm">Ended: {new Date(t.date).toLocaleDateString()}</p>
                  </div>
                  
                  <div className="text-right flex flex-col items-end">
                    <div className="flex items-center gap-2 text-yellow-400 font-bold text-lg">
                      <FaTrophy /> <span>Winner: {t.winner}</span>
                    </div>
                    <p className="text-gray-400 text-sm italic mt-1 border-l-2 border-gray-600 pl-3">
                      "{t.review}"
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- POPUP MODAL (For Setting Winner) --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-600 rounded-xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-white text-center">🏆 Declare Results</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-1 font-semibold">Winner Name</label>
                <input 
                  type="text" 
                  value={completionData.winner} 
                  onChange={(e) => setCompletionData({...completionData, winner: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded p-3 focus:border-purple-500 outline-none text-white transition"
                  placeholder="e.g. Alex Grandmaster"
                />
              </div>
              
              <div>
                <label className="block text-gray-400 text-sm mb-1 font-semibold">Coach's Review</label>
                <textarea 
                  value={completionData.review} 
                  onChange={(e) => setCompletionData({...completionData, review: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded p-3 focus:border-purple-500 outline-none text-white h-24 transition"
                  placeholder="e.g. Great performance in the endgame!"
                />
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button 
                  onClick={() => setShowModal(false)} 
                  className="px-5 py-2 bg-gray-600 hover:bg-gray-500 rounded font-semibold transition text-white"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCompleteSubmit} 
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded font-bold transition shadow-lg shadow-purple-900/50"
                >
                  Confirm & Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CoachTournament;