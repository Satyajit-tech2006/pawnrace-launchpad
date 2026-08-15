import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import apiClient from "../../../lib/api.js";
import { ENDPOINTS } from "../../../lib/endpoints.js";
import { useAuth } from "../../../contexts/AuthContext.jsx";
import { Trophy, Medal, User, Loader2, Sparkles, TrendingUp } from "lucide-react";

const Leaderboard = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [myStats, setMyStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get(ENDPOINTS.USERS.GET_LEADERBOARD);
        setLeaderboard(res.data.data.leaderboard);
        setMyStats(res.data.data.myStats);
      } catch (error) {
        console.error("Failed to load leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center text-white">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  // Separate Top 3 for the Podium
  const topThree = leaderboard.slice(0, 3);
  const restOfBoard = leaderboard.slice(3);

  // Podium positioning logic (2nd, 1st, 3rd)
  const podiumOrder = [
    topThree[1] || null, // Silver
    topThree[0] || null, // Gold
    topThree[2] || null  // Bronze
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] p-4 md:p-8 text-white font-sans selection:bg-blue-500/30">
      <div className="max-w-4xl mx-auto space-y-10 relative pb-24">
        
        {/* Header */}
        <header className="text-center space-y-3 mb-12">
          <motion.div 
            initial={{ scale: 0 }} animate={{ scale: 1 }} 
            className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto"
          >
            <Trophy className="w-8 h-8 text-yellow-500" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
            Global Rankings
          </h1>
          <p className="text-gray-400">Compete, solve, and climb to the top of the academy.</p>
        </header>

        {/* --- THE PODIUM --- */}
        {topThree.length > 0 && (
          <div className="flex justify-center items-end gap-2 md:gap-6 h-64 mb-16 px-2">
            {podiumOrder.map((student, index) => {
              if (!student) return <div key={index} className="flex-1 max-w-[120px]" />; // Spacer

              // Mapping styles based on array index (0=Silver, 1=Gold, 2=Bronze)
              const isGold = index === 1;
              const isSilver = index === 0;
              
              const heights = ['h-32', 'h-48', 'h-24'];
              const colors = [
                'from-gray-300 to-gray-500', // Silver
                'from-yellow-300 to-yellow-600', // Gold
                'from-amber-600 to-amber-800' // Bronze
              ];
              const glow = [
                'shadow-gray-400/20',
                'shadow-yellow-500/40',
                'shadow-amber-700/20'
              ];

              return (
                <motion.div 
                  key={student._id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="flex-1 flex flex-col items-center max-w-[140px]"
                >
                  {/* Avatar & Name */}
                  <div className="flex flex-col items-center mb-3 text-center">
                    <div className="relative mb-2">
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#131825] border-2 border-white/10 flex items-center justify-center overflow-hidden z-10 relative">
                        {student.profilePicture ? (
                          <img src={student.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      {isGold && <Sparkles className="absolute -top-3 -right-3 w-6 h-6 text-yellow-400 animate-pulse z-20" />}
                    </div>
                    <span className="font-bold text-sm md:text-base line-clamp-1">{student.username}</span>
                    <span className="text-xs font-mono text-blue-400">{student.totalPoints} Pts</span>
                  </div>

                  {/* Pedestal */}
                  <div className={`w-full ${heights[index]} bg-gradient-to-t ${colors[index]} rounded-t-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] ${glow[index]} border-t border-white/30 flex justify-center pt-4 relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity"></div>
                    <span className="text-4xl font-black text-white/40 mix-blend-overlay">
                      {isGold ? '1' : isSilver ? '2' : '3'}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* --- THE LIST (4th to 10th) --- */}
        <div className="space-y-3 max-w-2xl mx-auto">
          {restOfBoard.map((student, index) => {
            const actualRank = index + 4;
            const isMe = student._id === user?._id;

            return (
              <motion.div
                key={student._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + (index * 0.1) }}
                className={`flex items-center justify-between p-4 rounded-xl border ${
                  isMe ? 'bg-blue-900/20 border-blue-500/50' : 'bg-[#131825] border-white/5 hover:bg-white/5'
                } transition-colors`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 font-mono text-gray-500 font-bold text-right">#{actualRank}</div>
                  <div className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center overflow-hidden">
                    {student.profilePicture ? (
                       <img src={student.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                       <User className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h3 className={`font-bold ${isMe ? 'text-blue-400' : 'text-gray-200'}`}>
                      {student.username} {isMe && <span className="text-[10px] ml-2 uppercase bg-blue-500/20 px-2 py-0.5 rounded">You</span>}
                    </h3>
                  </div>
                </div>
                <div className="font-mono font-bold text-yellow-500">
                  {student.totalPoints} <span className="text-xs text-gray-500 font-sans">Pts</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        {leaderboard.length === 0 && (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl bg-[#131825]/50">
            <TrendingUp className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">The leaderboard is empty. Be the first to score points!</p>
          </div>
        )}

      </div>

      {/* --- STICKY BOTTOM BAR (My Stats) --- */}
      {myStats && (
        <motion.div 
          initial={{ y: 100 }} animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 bg-[#0a0e17] border-t border-white/10 p-4 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]"
        >
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500/20 border border-blue-500/50 rounded-full flex items-center justify-center">
                <span className="font-black text-blue-400 text-lg">#{myStats.rank}</span>
              </div>
              <div>
                <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Your Global Rank</div>
                <div className="font-bold text-white">Keep pushing to climb higher!</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-yellow-400">{myStats.totalPoints}</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Total Pts</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Leaderboard;