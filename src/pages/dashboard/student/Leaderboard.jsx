import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import apiClient from "../../../lib/api.js";
import { ENDPOINTS } from "../../../lib/endpoints.js";
import { useAuth } from "../../../contexts/AuthContext.jsx";
import { Trophy, User, Loader2, Sparkles, TrendingUp, Crown, Flame, Star } from "lucide-react";

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
      <div className="min-h-screen bg-[#05070C] flex items-center justify-center text-white">
        <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full animate-pulse"></div>
            <Loader2 className="w-14 h-14 animate-spin text-blue-500 relative z-10" />
        </div>
      </div>
    );
  }

  // Separate Top 3 for the Podium
  const topThree = leaderboard.slice(0, 3);
  const restOfBoard = leaderboard.slice(3);

  // Podium positioning logic (2nd, 1st, 3rd)
  const podiumOrder = [
    topThree[1] ? { ...topThree[1], rank: 2 } : null, // Silver
    topThree[0] ? { ...topThree[0], rank: 1 } : null, // Gold
    topThree[2] ? { ...topThree[2], rank: 3 } : null  // Bronze
  ];

  return (
    <div className="min-h-screen bg-[#05070C] text-white font-sans selection:bg-blue-500/30 relative overflow-hidden flex flex-col">
      
      {/* --- AMBIENT BACKGROUND FX (Optimized) --- */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-violet-900/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed bottom-[10%] right-[-10%] w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed top-[20%] left-[50%] -translate-x-1/2 w-[800px] h-[300px] bg-yellow-900/10 rounded-full blur-3xl pointer-events-none"></div>
      
      {/* Subtle Grid Texture (Optimized: Removed mix-blend-overlay) */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 pt-16 pb-40 relative z-10 w-full flex-1">
        
        {/* --- HEADER --- */}
        <header className="text-center space-y-5 mb-16">
          <motion.div 
            initial={{ scale: 0, rotate: -180 }} 
            animate={{ scale: 1, rotate: 0 }} 
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-24 h-24 bg-gradient-to-br from-yellow-400/20 to-yellow-600/5 border border-yellow-500/30 rounded-3xl flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(234,179,8,0.2)] shadow-yellow-500/20 rotate-3"
          >
            <Trophy className="w-12 h-12 text-yellow-400 drop-shadow-[0_0_15px_rgba(234,179,8,0.8)]" />
          </motion.div>
          <div className="space-y-2">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-blue-100 to-blue-500 drop-shadow-sm">
              Hall of Fame
            </h1>
            <p className="text-gray-400 text-base md:text-lg max-w-xl mx-auto font-medium leading-relaxed">
              The most tactical minds in the academy. Solve assignments and pass exams to etch your name in history.
            </p>
          </div>
        </header>

        {/* --- THE PODIUM --- */}
        {topThree.length > 0 && (
          // Fixed Overlap: Removed fixed height, added mt-24 to push it cleanly below the header text
          <div className="flex justify-center items-end gap-3 md:gap-6 lg:gap-8 mt-24 mb-32 px-2">
            {podiumOrder.map((student, index) => {
              if (!student) return <div key={index} className="flex-1 max-w-[160px]" />; // Spacer

              const isGold = student.rank === 1;
              const isSilver = student.rank === 2;
              const isBronze = student.rank === 3;
              const isMe = student._id === user?._id;
              
              const heights = isGold ? 'h-48 md:h-56' : isSilver ? 'h-36 md:h-44' : 'h-28 md:h-36';
              const avatarSize = isGold ? 'w-24 h-24 md:w-28 md:h-28' : 'w-16 h-16 md:w-20 md:h-20';
              const gradients = isGold 
                ? 'from-yellow-900/90 via-yellow-600/40 to-yellow-400/10 border-yellow-400/50' 
                : isSilver 
                ? 'from-slate-700/90 via-slate-500/30 to-slate-300/10 border-slate-300/40' 
                : 'from-amber-900/90 via-amber-700/40 to-amber-500/10 border-amber-500/40';
              
              const glowColor = isGold ? 'shadow-[0_0_40px_rgba(234,179,8,0.2)]' : isSilver ? 'shadow-[0_0_30px_rgba(148,163,184,0.1)]' : 'shadow-[0_0_30px_rgba(217,119,6,0.1)]';
              const textColor = isGold ? 'text-yellow-400' : isSilver ? 'text-slate-300' : 'text-amber-500';

              return (
                <motion.div 
                  key={student._id}
                  initial={{ opacity: 0, y: 120 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 90, damping: 18, delay: isGold ? 0.3 : isSilver ? 0.1 : 0.5 }}
                  className={`flex-1 flex flex-col items-center max-w-[180px] relative ${isGold ? 'z-20' : 'z-10'}`}
                >
                  {/* Floating Crown for 1st Place */}
                  {isGold && (
                    <motion.div 
                        animate={{ y: [-6, 6, -6] }} 
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        className="absolute -top-16 z-30"
                    >
                        <Crown className="w-12 h-12 text-yellow-400 fill-yellow-500/60 drop-shadow-[0_0_15px_rgba(234,179,8,0.8)]" />
                    </motion.div>
                  )}

                  {/* Avatar & Info */}
                  <div className="flex flex-col items-center mb-6 text-center w-full">
                    <div className="relative mb-4">
                      <div className={`${avatarSize} rounded-full bg-[#0a0e17] border-[4px] ${isGold ? 'border-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.3)]' : isSilver ? 'border-slate-300' : 'border-amber-600'} flex items-center justify-center overflow-hidden z-10 relative transition-transform hover:scale-105 duration-300`}>
                        {student.profilePicture ? (
                          <img src={student.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-1/2 h-1/2 text-gray-500" />
                        )}
                      </div>
                      {isGold && <Sparkles className="absolute -bottom-1 -right-3 w-8 h-8 text-yellow-300 animate-pulse z-20" />}
                    </div>
                    
                    <span className={`font-black text-base md:text-lg tracking-wide line-clamp-1 truncate w-full px-2 ${isMe ? 'text-white' : 'text-gray-100'}`}>
                        {student.username}
                    </span>
                    <div className={`text-sm md:text-base font-black tracking-widest mt-1.5 flex items-center justify-center gap-1.5 bg-black/40 px-3 py-1 rounded-full border border-white/5 ${textColor}`}>
                        {student.totalPoints} <span className="text-[10px] opacity-70 mt-0.5">PTS</span>
                    </div>
                  </div>

                  {/* 3D Glass Pedestal */}
                  <div className={`w-full ${heights} bg-gradient-to-t ${gradients} rounded-t-3xl ${glowColor} border-t-2 border-l border-r border-white/10 flex justify-center pt-6 md:pt-8 relative overflow-hidden group`}>
                    {/* Optimized Glass Shine using Transform */}
                    <div className="absolute top-0 inset-0 -translate-x-full w-[60%] bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[20deg] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out pointer-events-none"></div>
                    <span className={`text-6xl md:text-8xl font-black opacity-20 mix-blend-overlay drop-shadow-md`}>
                      {student.rank}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* --- THE LIST (4th to 10th) --- */}
        <div className="space-y-4 max-w-3xl mx-auto relative z-10">
          {restOfBoard.map((student, index) => {
            const actualRank = index + 4;
            const isMe = student._id === user?._id;

            return (
              <motion.div
                key={student._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + (index * 0.05), type: "spring", stiffness: 100 }}
                whileHover={{ scale: 1.01, x: 8 }}
                // Optimized: Removed heavy backdrop-blur-md from repeating list items
                className={`group flex items-center justify-between p-4 md:p-6 rounded-2xl border shadow-md ${
                  isMe 
                    ? 'bg-blue-900/30 border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.15)]' 
                    : 'bg-[#111726] border-white/5 hover:bg-[#151c2e] hover:border-white/10 hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]'
                } transition-all duration-300 ease-out`}
              >
                <div className="flex items-center gap-5 md:gap-8">
                  {/* Rank Number */}
                  <div className="w-10 font-black text-xl md:text-2xl text-gray-600 group-hover:text-gray-400 transition-colors text-right">
                      #{actualRank}
                  </div>
                  
                  {/* Avatar */}
                  <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center overflow-hidden border-2 ${isMe ? 'border-blue-400/50' : 'border-white/10 group-hover:border-white/30'} transition-colors bg-black/50`}>
                    {student.profilePicture ? (
                       <img src={student.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                       <User className="w-6 h-6 text-gray-500" />
                    )}
                  </div>
                  
                  {/* Name & Badge */}
                  <div className="flex flex-col">
                    <h3 className={`font-bold text-base md:text-lg tracking-wide flex items-center gap-3 ${isMe ? 'text-blue-300' : 'text-gray-200 group-hover:text-white transition-colors'}`}>
                      {student.username} 
                      {isMe && (
                          <span className="text-[10px] uppercase bg-gradient-to-r from-blue-600 to-blue-400 text-white px-2.5 py-1 rounded-md font-black tracking-widest shadow-lg shadow-blue-500/30">
                              You
                          </span>
                      )}
                    </h3>
                  </div>
                </div>

                {/* Score */}
                <div className="flex items-center gap-2.5 bg-black/40 px-4 py-2 rounded-xl border border-white/5 group-hover:border-yellow-500/20 transition-colors">
                    <Star className={`w-4 h-4 md:w-5 md:h-5 ${isMe ? 'text-blue-400 fill-blue-500/20' : 'text-yellow-600/50 group-hover:text-yellow-500 group-hover:fill-yellow-500/20'} transition-all`} />
                    <div className={`font-black text-xl md:text-2xl font-mono ${isMe ? 'text-white' : 'text-yellow-500'}`}>
                        {student.totalPoints} <span className="text-xs md:text-sm text-gray-500 font-sans font-bold ml-1">Pts</span>
                    </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        {leaderboard.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-32 border border-dashed border-white/10 rounded-3xl bg-[#0f1423]/50 max-w-2xl mx-auto shadow-xl"
          >
            <TrendingUp className="w-20 h-20 text-gray-700 mx-auto mb-6" />
            <h3 className="text-2xl font-black text-gray-300 mb-3 tracking-tight">No Rankings Yet</h3>
            <p className="text-gray-500 max-w-md mx-auto text-lg">The leaderboard is currently empty. Complete assignments and pass exams to become the first champion!</p>
          </motion.div>
        )}

      </div>

      {/* --- STICKY BOTTOM BAR (My Stats) --- */}
      {myStats && (
        <motion.div 
          initial={{ y: 120 }} animate={{ y: 0 }} transition={{ type: "spring", damping: 20, delay: 1 }}
          className="fixed bottom-0 left-0 right-0 bg-[#06080F]/90 backdrop-blur-xl border-t border-white/10 p-5 md:p-6 z-50 shadow-[0_-20px_50px_rgba(0,0,0,0.8)]"
        >
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 blur-md rounded-full"></div>
                <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-[#131825] to-[#0a0e17] border-2 border-blue-500/50 rounded-full flex items-center justify-center relative z-10 shadow-[inset_0_0_15px_rgba(0,0,0,0.8)]">
                    <span className="font-black text-blue-400 text-xl md:text-2xl">#{myStats.rank}</span>
                </div>
              </div>
              <div>
                <div className="text-[10px] md:text-xs text-blue-400/90 font-black uppercase tracking-widest mb-1 drop-shadow-md">Your Global Rank</div>
                <div className="font-bold text-white text-sm md:text-lg tracking-wide">{myStats.rank === 1 ? 'You are the undisputed champion!' : 'Keep pushing to climb higher!'}</div>
              </div>
            </div>
            
            <div className="text-right flex items-center gap-4 bg-gradient-to-r from-white/5 to-transparent border border-white/10 px-6 py-3 rounded-2xl shadow-inner">
              <div>
                <div className="text-[10px] md:text-xs text-gray-400 uppercase tracking-widest font-black mb-1">Total Score</div>
                <div className="text-2xl md:text-3xl font-black text-yellow-400 leading-none drop-shadow-[0_0_10px_rgba(234,179,8,0.4)]">{myStats.totalPoints}</div>
              </div>
              <div className="h-10 w-px bg-white/10 mx-2"></div>
              <Flame className="w-8 h-8 text-yellow-500/70" />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Leaderboard;