import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "../../../components/Dashbordnavbar";
import {
  Users, Calendar, ClipboardCheck, FileBarChart, Trophy,
  MessageSquare, Settings, Database, Gamepad, Gamepad2, Brain,
  ChevronUp, ChevronDown, Play, User, Zap, Medal
} from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import apiClient from "../../../lib/api"; 
import { ENDPOINTS } from "../../../lib/endpoints.js";

/* ========================================================================== */
/* 1. COACH MENU CONFIGURATION                                                */
/* ========================================================================== */

const coachMenuItems = [
  { name: "My Students", path: "my-students", icon: Users, accent: "#3B82F6", gradient: "from-blue-500 to-indigo-600", desc: "Monitor student progress, analyze games, and track performance metrics." },
  { name: "Classes", path: "classes", icon: Calendar, accent: "#10B981", gradient: "from-emerald-400 to-green-600", desc: "Schedule and manage your live 1-on-1 Grandmaster training sessions." },
  { name: "Assignments", path: "assignments", icon: ClipboardCheck, accent: "#06B6D4", gradient: "from-cyan-400 to-blue-500", desc: "Create, review, and grade tactical homework and opening drills." },
  { name: "Test", path: "test", icon: FileBarChart, accent: "#14B8A6", gradient: "from-teal-400 to-emerald-500", desc: "Design and evaluate standardized exams to track Elo improvements." },
  { name: "Tournaments", path: "tournaments", icon: Trophy, accent: "#FACC15", gradient: "from-yellow-400 to-amber-600", desc: "Organize and officiate internal academy tournaments and arenas." },
  { name: "Chats", path: "chats", icon: MessageSquare, accent: "#6366F1", gradient: "from-violet-500 to-purple-600", desc: "Communicate directly with your assigned students and mentees." },
  { name: "Database", path: "database", icon: Database, accent: "#8B5CF6", gradient: "from-purple-500 to-indigo-600", desc: "Access the academy's central opening book and endgame tablebases." },
  { name: "Settings", path: "settings", icon: Settings, accent: "#6B7280", gradient: "from-gray-500 to-gray-700", desc: "Manage your coaching profile, availability, and system preferences." },
  { name: "Play Game", path: "play", icon: Gamepad, accent: "#F97316", gradient: "from-orange-500 to-red-600", desc: "Enter the global matchmaking arena. Show the students how it's done." },
  { name: "Training Sessions", path: "training-sessions", icon: Gamepad2, accent: "#F43F5E", gradient: "from-rose-500 to-pink-600", desc: "Host interactive engine analysis and game review sessions." },
  { name: "Leaderboard", path: "leaderboard", icon: Medal, accent: "#F59E0B", gradient: "from-amber-400 to-orange-500", desc: "View global academy rankings and track top-performing students." },
];

/* ========================================================================== */
/* 2. MAIN DASHBOARD                                                          */
/* ========================================================================== */

export default function CoachDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [activeIndex, setActiveIndex] = useState(0);
  const [userName, setUserName] = useState("COACH ZERO");
  const [userPoints, setUserPoints] = useState(0);

  const total = coachMenuItems.length;

  // --- AGGRESSIVE BACKEND DATA SYNC ---
  useEffect(() => {
    if (user) {
      // Safely extract name
      const fullName = user.username || user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || "Coach";
      setUserName(fullName);

      // Fetch fresh points from Leaderboard/Profile
      const fetchLivePoints = async () => {
        try {
          const contextPoints = user.globalScore || user.points || user.totalPoints || user.score || user.elo;
          if (contextPoints) {
            setUserPoints(contextPoints);
          }

          const endpoint = ENDPOINTS?.LEADERBOARD?.GET || ENDPOINTS?.USER?.LEADERBOARD || '/api/leaderboard';
          const res = await apiClient.get(endpoint); 
          const players = res.data?.data || res.data?.leaderboard || res.data || [];
          const myStats = players.find(p => p._id === user._id || p.userId === user._id || p.username === user.username);
          
          if (myStats) {
            const livePoints = myStats.globalScore || myStats.points || myStats.totalPoints || myStats.score || myStats.elo || 0;
            setUserPoints(livePoints);
          }
        } catch (error) {
          console.error("Data sync failed. Falling back to context data:", error);
        }
      };

      fetchLivePoints();
    }
  }, [user]);

  // --- SCROLL CONTROLS ---
  const handleNext = () => setActiveIndex((prev) => (prev + 1) % total);
  const handlePrev = () => setActiveIndex((prev) => (prev - 1 + total) % total);

  const handleWheel = (e) => {
    if (e.deltaY > 30) handleNext();
    else if (e.deltaY < -30) handlePrev();
  };

  const handleLaunch = () => {
    const activeItem = coachMenuItems[activeIndex];
    if (activeItem.path === "play") {
      navigate(`/play`);
    } else {
      navigate(`/coach-dashboard/${activeItem.path}`);
    }
  };

  // Calculates smooth vertical distance from center
  const getOffset = (index) => {
    let diff = (index - activeIndex + total) % total;
    if (diff > total / 2) diff -= total;
    return diff;
  };

  const activeData = coachMenuItems[activeIndex];

  return (
    <div 
      className="min-h-screen w-full bg-[#070B14] text-white font-sans flex flex-col relative overflow-hidden"
      onWheel={handleWheel}
      style={{ backgroundColor: "#070B14" }}
    >
      
      {/* Dynamic Ambient Background */}
      <div className="absolute inset-0 pointer-events-none z-0 transition-colors duration-700 opacity-30">
        <div 
          className="absolute top-[10%] left-[5%] w-[600px] h-[600px] rounded-full blur-[200px] transition-all duration-700"
          style={{ backgroundColor: activeData.accent, opacity: 0.25 }}
        />
        <div 
          className="absolute bottom-[5%] right-[5%] w-[500px] h-[500px] rounded-full blur-[150px] transition-all duration-700"
          style={{ backgroundColor: activeData.accent, opacity: 0.15 }}
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <DashboardNavbar />

        {/* BULLETPROOF GRID LAYOUT */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* ================================================================= */}
          {/* LEFT COLUMN: HUD & INFO (Strictly constrained bounds)             */}
          {/* ================================================================= */}
          <div className="flex flex-col justify-center space-y-10 w-full max-w-lg mx-auto lg:mx-0">
            
            {/* User Profile Card */}
            <div className="bg-[#111726]/80 backdrop-blur-md border border-white/10 rounded-2xl p-5 flex items-center gap-5 shadow-lg">
              <div className="w-14 h-14 bg-slate-800 rounded-full border border-slate-600 flex items-center justify-center shrink-0">
                <User className="w-7 h-7 text-slate-400" />
              </div>
              <div className="overflow-hidden">
                <h2 className="text-xl font-black text-white uppercase tracking-tight truncate">
                  {userName}
                </h2>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-widest rounded border border-emerald-500/20">
                    Active Coach
                  </span>
                  <span className="text-sm font-bold text-slate-400 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-yellow-400" /> {userPoints} RATING
                  </span>
                </div>
              </div>
            </div>

            {/* Target Display Panel */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="w-full"
              >
                <div className="text-slate-500 font-mono text-xs tracking-widest uppercase mb-4 flex items-center gap-3">
                  <div className="h-[2px] w-8 bg-slate-700"></div>
                  Module // {String(activeIndex + 1).padStart(2, '0')}
                </div>
                
                <h1 className="text-5xl lg:text-6xl font-black uppercase tracking-tighter text-white mb-5 leading-none">
                  {activeData.name}
                </h1>
                
                <p className="text-slate-400 text-base md:text-lg font-medium leading-relaxed max-w-md">
                  {activeData.desc}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Launch Button */}
            <motion.button
              onClick={handleLaunch}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-lg flex items-center justify-center gap-3 bg-gradient-to-r ${activeData.gradient} text-white shadow-xl transition-all border border-white/20`}
              style={{ boxShadow: `0 10px 40px -10px ${activeData.accent}` }}
            >
              <Play className="w-6 h-6 fill-white" /> Access Module
            </motion.button>
          </div>

          {/* ================================================================= */}
          {/* RIGHT COLUMN: VERTICAL ROTARY MENU (Fixed Box constraints)        */}
          {/* ================================================================= */}
          <div className="relative w-full h-[550px] flex items-center justify-center pointer-events-auto">
            
            {/* Scroll Capture Overlay (z-40) */}
            <div 
              className="absolute inset-0 z-40 touch-none cursor-ns-resize"
              onPointerDown={(e) => e.currentTarget.setPointerCapture(e.pointerId)}
              onPointerUp={(e) => e.currentTarget.releasePointerCapture(e.pointerId)}
              onPointerMove={(e) => {
                if (e.buttons === 1) {
                  if (e.movementY > 8) handlePrev();
                  if (e.movementY < -8) handleNext();
                }
              }}
            />

            <div className="relative w-full max-w-sm h-full flex flex-col justify-center items-center pointer-events-none">
              {coachMenuItems.map((item, index) => {
                const offset = getOffset(index);
                
                const y = offset * 110; 
                const scale = offset === 0 ? 1 : 1 - Math.abs(offset) * 0.15;
                const opacity = offset === 0 ? 1 : 1 - Math.abs(offset) * 0.35;
                const zIndex = 50 - Math.abs(offset);

                if (Math.abs(offset) > 3) return null;

                return (
                  <motion.div
                    key={item.name}
                    animate={{ y, scale, opacity, zIndex }}
                    transition={{ type: "spring", stiffness: 250, damping: 25, mass: 1 }}
                    className="absolute w-full"
                  >
                    <div 
                      className={`flex items-center gap-5 p-4 rounded-2xl transition-all duration-300 w-full ${
                        offset === 0 
                          ? `bg-[#121929] border border-white/20 shadow-2xl scale-105` 
                          : 'bg-[#121929]/40 border border-transparent backdrop-blur-sm'
                      }`}
                      style={offset === 0 ? { borderColor: item.accent, boxShadow: `0 10px 30px -10px ${item.accent}` } : {}}
                    >
                      <div className={`p-4 rounded-xl shrink-0 transition-all duration-300 ${offset === 0 ? `bg-gradient-to-br ${item.gradient}` : 'bg-slate-800'}`}>
                        <item.icon className={`w-7 h-7 ${offset === 0 ? 'text-white' : 'text-slate-500'}`} />
                      </div>
                      
                      <div className="flex flex-col overflow-hidden">
                        <h3 className={`font-black uppercase tracking-wider text-xl transition-colors duration-300 truncate ${offset === 0 ? 'text-white' : 'text-slate-500'}`}>
                          {item.name}
                        </h3>
                        {offset === 0 && (
                          <motion.span 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="text-xs font-bold uppercase tracking-widest mt-0.5"
                            style={{ color: item.accent }}
                          >
                            Selected Module
                          </motion.span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Scroll Navigators - Z-50 Overlay */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-6 z-50 opacity-40 hover:opacity-100 transition-opacity">
               <button 
                 onClick={handlePrev} 
                 className="p-3 bg-black/40 hover:bg-black/80 border border-white/10 hover:border-white/30 rounded-full cursor-pointer transition-all backdrop-blur-md"
               >
                 <ChevronUp className="w-8 h-8 text-white" />
               </button>
               <button 
                 onClick={handleNext} 
                 className="p-3 bg-black/40 hover:bg-black/80 border border-white/10 hover:border-white/30 rounded-full cursor-pointer transition-all backdrop-blur-md"
               >
                 <ChevronDown className="w-8 h-8 text-white" />
               </button>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}