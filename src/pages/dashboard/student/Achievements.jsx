import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../../contexts/AuthContext.jsx";
import DashboardNavbar from "../../../components/Dashbordnavbar";
import { 
  Trophy, Brain, Target, Star, Shield, Zap, 
  Medal, Flame, Crown, BookOpen, CheckCircle 
} from "lucide-react";
import { Card, CardContent } from "../../../components/ui/card"; 
import { ENDPOINTS } from "../../../lib/endpoints.js";
import apiClient from "../../../lib/api.js";

// --- PAWNRACE RANKS ---
const getRankDetails = (rating) => {
  if (rating < 1200) return { title: "Novice", min: 0, max: 1200, color: "text-gray-400", from: "from-gray-500", to: "to-gray-700", bg: "bg-gray-400/10", icon: Shield };
  if (rating < 1400) return { title: "Knight", min: 1200, max: 1400, color: "text-green-400", from: "from-green-400", to: "to-emerald-600", bg: "bg-green-400/10", icon: Target };
  if (rating < 1600) return { title: "Bishop", min: 1400, max: 1600, color: "text-blue-400", from: "from-blue-400", to: "to-cyan-600", bg: "bg-blue-400/10", icon: Zap };
  if (rating < 1800) return { title: "Rook", min: 1600, max: 1800, color: "text-purple-400", from: "from-purple-400", to: "to-indigo-600", bg: "bg-purple-400/10", icon: Star };
  if (rating < 2000) return { title: "Queen", min: 1800, max: 2000, color: "text-pink-400", from: "from-pink-400", to: "to-rose-600", bg: "bg-pink-400/10", icon: Crown };
  return { title: "Grandmaster", min: 2000, max: 3000, color: "text-yellow-400", from: "from-yellow-300", to: "to-amber-600", bg: "bg-yellow-400/10", icon: Trophy };
};

const Achievements = () => {
  const { user } = useAuth();
  
  const [iqStats, setIqStats] = useState({ easy: 0, medium: 0, hard: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // Safely extract stats, retaining the fallback to totalPoints for legacy data
  const stats = {
    rating: user?.stats?.rating || 1200,
    shopPoints: user?.stats?.shopPoints || user?.totalPoints || 0
  };
  const completions = user?.completions || {};
  
  const assignmentsCount = completions.assignments?.length || 0;
  const testsCount = completions.tests?.length || 0;
  const totalIqPuzzles = iqStats.easy + iqStats.medium + iqStats.hard;

  const rank = getRankDetails(stats.rating);
  const RankIcon = rank.icon;

  // Calculate progress to next rank
  const rankProgress = Math.min(100, Math.max(0, ((stats.rating - rank.min) / (rank.max - rank.min)) * 100));

  useEffect(() => {
    const fetchLiveStats = async () => {
      try {
        const response = await apiClient.get(ENDPOINTS.IQ.GET_STATS);
        const statsData = response.data?.data || [];
        
        let easy = 0, medium = 0, hard = 0;
        statsData.forEach(stat => {
            if (stat.difficulty === 'easy') easy += stat.totalGamesPlayed;
            if (stat.difficulty === 'medium') medium += stat.totalGamesPlayed;
            if (stat.difficulty === 'hard') hard += stat.totalGamesPlayed;
        });
        setIqStats({ easy, medium, hard });
      } catch (error) {
        console.error("Failed to load achievement stats:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLiveStats();
  }, []);

  const badges = [
    { title: "First Blood", description: "Complete your first assignment.", icon: BookOpen, unlocked: assignmentsCount > 0, color: "from-blue-400 to-cyan-500" },
    { title: "Test Veteran", description: "Conquer 5 timed tests.", icon: Flame, unlocked: testsCount >= 5, color: "from-orange-400 to-red-600" },
    { title: "Brainiac", description: "Solve 10 Easy IQ Puzzles.", icon: Brain, unlocked: iqStats.easy >= 10, color: "from-green-400 to-emerald-600" },
    { title: "Tactician", description: "Solve 5 Medium IQ Puzzles.", icon: Target, unlocked: iqStats.medium >= 5, color: "from-purple-400 to-indigo-600" },
    { title: "Tactical Genius", description: "Solve a Hard IQ Puzzle.", icon: Zap, unlocked: iqStats.hard >= 1, color: "from-pink-400 to-rose-600" },
    { title: "Rising Star", description: "Reach a Pawn Rating of 1400+.", icon: Crown, unlocked: stats.rating >= 1400, color: "from-yellow-300 to-amber-600" }
  ];

  // Animation variants
  const containerVars = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVars = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white selection:bg-indigo-500/30 font-sans">
      <DashboardNavbar />
      
      <div className="max-w-7xl mx-auto pt-32 px-6 pb-16">
        
        {/* HERO RANKING CARD */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 mb-12 shadow-2xl overflow-hidden"
        >
          {/* Ambient Glow */}
          <div className={`absolute -right-32 -top-32 w-96 h-96 bg-gradient-to-br ${rank.from} ${rank.to} rounded-full blur-[100px] opacity-10 pointer-events-none`}></div>
          <div className="absolute -left-32 -bottom-32 w-96 h-96 bg-indigo-500 rounded-full blur-[120px] opacity-10 pointer-events-none"></div>
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 z-10 relative">
            
            {/* Rank Identity */}
            <div className="flex items-center gap-6 w-full lg:w-1/2">
              <div className={`p-6 rounded-2xl ${rank.bg} ${rank.color} shadow-lg ring-1 ring-white/5`}>
                <RankIcon size={56} strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <p className="text-gray-400 font-semibold uppercase tracking-widest text-xs mb-1.5">Current Standing</p>
                <h1 className={`text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r ${rank.from} ${rank.to} drop-shadow-sm mb-2`}>
                  {rank.title}
                </h1>
                
                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm font-medium mb-1.5">
                    <span className="text-gray-300 flex items-center gap-1.5">
                      <Trophy size={16} className={rank.color}/> {stats.rating} <span className="text-gray-500 hidden sm:inline">Pawn Rating</span>
                    </span>
                    <span className="text-gray-500">{rank.title === "Grandmaster" ? "MAX" : `Next: ${rank.max}`}</span>
                  </div>
                  <div className="h-2.5 w-full bg-gray-900/80 rounded-full overflow-hidden ring-1 ring-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${rankProgress}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className={`h-full bg-gradient-to-r ${rank.from} ${rank.to} shadow-[0_0_10px_rgba(255,255,255,0.2)]`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Shop Wallet */}
            <div className="bg-gray-900/60 backdrop-blur-md border border-gray-700/50 rounded-2xl p-6 min-w-[240px] text-center lg:text-right shadow-inner w-full lg:w-auto">
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-2">Available Points</p>
              <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500">
                {stats.shopPoints} <span className="text-lg text-amber-500/70 font-medium">pts</span>
              </h2>
            </div>

          </div>
        </motion.div>

        {/* OVERVIEW STATS */}
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white/90">
          <Target className="text-indigo-400" size={24}/> Training Overview
        </h3>
        
        <motion.div 
          variants={containerVars} initial="hidden" animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
            <motion.div variants={itemVars}>
              <Card className="bg-gray-800/30 backdrop-blur-sm border-gray-700/50 h-full hover:bg-gray-800/50 transition-colors duration-300">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-blue-500/10 rounded-xl ring-1 ring-blue-500/20"><BookOpen className="text-blue-400" /></div>
                    <span className="text-4xl font-black text-white/90">{assignmentsCount}</span>
                  </div>
                  <p className="text-gray-400 font-medium tracking-wide">Assignments Done</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVars}>
              <Card className="bg-gray-800/30 backdrop-blur-sm border-gray-700/50 h-full hover:bg-gray-800/50 transition-colors duration-300">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-red-500/10 rounded-xl ring-1 ring-red-500/20"><Flame className="text-red-400" /></div>
                    <span className="text-4xl font-black text-white/90">{testsCount}</span>
                  </div>
                  <p className="text-gray-400 font-medium tracking-wide">Tests Passed</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVars}>
              <Card className="bg-gray-800/30 backdrop-blur-sm border-gray-700/50 h-full hover:bg-gray-800/50 transition-colors duration-300">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-purple-500/10 rounded-xl ring-1 ring-purple-500/20"><Brain className="text-purple-400" /></div>
                    <span className="text-4xl font-black text-white/90">{isLoading ? "..." : totalIqPuzzles}</span>
                  </div>
                  <p className="text-gray-400 font-medium tracking-wide mb-4 border-b border-gray-700/50 pb-3">IQ Puzzles Solved</p>
                  <div className="space-y-2.5 text-sm font-medium">
                    <div className="flex justify-between items-center"><span className="text-emerald-400/80">Easy</span><span className="text-gray-300 bg-gray-900/50 px-2 py-0.5 rounded">{iqStats.easy}</span></div>
                    <div className="flex justify-between items-center"><span className="text-indigo-400/80">Medium</span><span className="text-gray-300 bg-gray-900/50 px-2 py-0.5 rounded">{iqStats.medium}</span></div>
                    <div className="flex justify-between items-center"><span className="text-rose-400/80">Hard</span><span className="text-gray-300 bg-gray-900/50 px-2 py-0.5 rounded">{iqStats.hard}</span></div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
        </motion.div>

        {/* BADGES GRID */}
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white/90">
          <Medal className="text-amber-400" size={24}/> Unlocked Badges
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {badges.map((badge, index) => {
            const BadgeIcon = badge.icon;
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.05 * index }}
                className={`relative overflow-hidden rounded-2xl border p-6 flex flex-col items-center text-center transition-all duration-300 group ${
                  badge.unlocked 
                    ? "bg-gray-800/40 border-gray-600/50 hover:bg-gray-800/60 hover:border-gray-500 hover:-translate-y-1 shadow-lg" 
                    : "bg-gray-900/30 border-gray-800/50 opacity-60 grayscale hover:grayscale-0 hover:opacity-100"
                }`}
              >
                {/* Internal Glow for Unlocked */}
                {badge.unlocked && (
                  <div className={`absolute top-0 inset-x-0 h-24 bg-gradient-to-b ${badge.color} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
                )}
                
                <div className={`p-4 rounded-full mb-5 z-10 ring-4 ${badge.unlocked ? `bg-gradient-to-br ${badge.color} text-white shadow-xl ring-white/5` : 'bg-gray-800 text-gray-500 ring-gray-800'}`}>
                  <BadgeIcon size={28} strokeWidth={2}/>
                </div>
                
                <h4 className={`text-lg font-bold mb-2 ${badge.unlocked ? 'text-white' : 'text-gray-400'}`}>
                  {badge.title}
                </h4>
                <p className="text-sm text-gray-400 leading-relaxed mb-6">{badge.description}</p>
                
                {badge.unlocked ? (
                  <div className="mt-auto inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-400/10 px-3.5 py-1.5 rounded-full border border-emerald-400/20">
                    <CheckCircle size={14} strokeWidth={2.5}/> Unlocked
                  </div>
                ) : (
                  <div className="mt-auto inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 bg-gray-900/80 px-3.5 py-1.5 rounded-full border border-gray-700/50">
                    Locked
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>

      </div>
    </div>
  );
};

export default Achievements;