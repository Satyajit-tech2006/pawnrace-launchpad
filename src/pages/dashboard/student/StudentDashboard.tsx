import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "../../../components/Dashbordnavbar";
import {
  GraduationCap, Trophy, ClipboardList, Award, FileBarChart,
  Brain, Medal, Castle, Zap, ChevronRight, Flame, Star, 
  TrendingUp, Lock, CheckCircle, Crown, Target, BookOpen,
  Gamepad, Gamepad2, MessageSquare, Settings, Swords
} from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import apiClient from "../../../lib/api";
import { ENDPOINTS } from "../../../lib/endpoints.js";

/* ---------------------------------- THEME --------------------------------- */
const INK = "#100E1A";
const PANEL = "#181530";
const PANEL_RAISED = "#201C3D";
const LINE = "#2E2A54";
const TEXT = "#F3F0FF";
const TEXT_DIM = "#9691C4";
const GOLD = "#FFC53D";
const BRAND_ACCENT = "#7C5CFF";

/* ----------------------------- RANK ENGINE ----------------------------- */
const RANK_LADDER = [
  { title: "Novice",      min: 0,    max: 1200 },
  { title: "Knight",      min: 1200, max: 1400 },
  { title: "Bishop",      min: 1400, max: 1600 },
  { title: "Rook",        min: 1600, max: 1800 },
  { title: "Queen",       min: 1800, max: 2000 },
  { title: "Grandmaster", min: 2000, max: 3000 },
];

const getRankDetails = (rating) => RANK_LADDER.find(r => rating < r.max) || RANK_LADDER[RANK_LADDER.length - 1];
const getRankIndex = (rating) => {
  const idx = RANK_LADDER.findIndex(r => rating < r.max);
  return idx === -1 ? RANK_LADDER.length - 1 : idx;
};

/* ------------------------------- MODULE DATA ------------------------------ */
const MODULES = [
  { name: "Play Game", path: "play", icon: Gamepad, accent: "#F97316", desc: "Global matchmaking arena. Put your Elo on the line in brutal combat." },
  { name: "Classes", path: "student-dashboard/classes", icon: GraduationCap, accent: "#3B82F6", desc: "Connect to the live neural-link with your assigned Grandmaster." },
  { name: "IQ Gym", path: "student-dashboard/iqpuzzles", icon: Brain, accent: "#D946EF", desc: "Push your calculation hardware to the limit. Rapid-fire tactical recognition." },
  { name: "Tournaments", path: "student-dashboard/tournaments", icon: Trophy, accent: "#FACC15", desc: "Official FIDE-rated battlegrounds. Survive the bracket and claim the prize." },
  { name: "Training", path: "student-dashboard/training-sessions", icon: Gamepad2, accent: "#34D399", desc: "Review past battles with Stockfish 16. Identify blunders and missed brilliancies." },
  { name: "Leaderboard", path: "student-dashboard/leaderboard", icon: Medal, accent: "#F43F5E", desc: "See where you rank among global academy students." },
  { name: "Assignments", path: "student-dashboard/assignments", icon: ClipboardList, accent: "#22D3EE", desc: "Complete your required tactical quota. Consistency unlocks true power." },
  { name: "Achievements", path: "student-dashboard/achievements", icon: Award, accent: "#8B5CF6", desc: "View your earned badges, ranks, and rating milestones." },
  { name: "Testing", path: "student-dashboard/test", icon: FileBarChart, accent: "#2DD4BF", desc: "Take standardized exams to evaluate your current Elo level." },
  { name: "Chats", path: "student-dashboard/chats", icon: MessageSquare, accent: "#94A3B8", desc: "Communicate directly with your coaches and academy mentors." },
  { name: "Settings", path: "student-dashboard/settings", icon: Settings, accent: "#6B7280", desc: "Manage your profile, preferences, and system settings." },
];

/* ------------------------------ MINI BACKGROUND ---------------------------- */
const FLOATERS = ["♞", "♟", "♜", "♝", "♛"];
const FloatingPieces = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
    {FLOATERS.map((glyph, i) => (
      <motion.span
        key={i}
        className="absolute text-6xl"
        style={{ left: `${12 + i * 20}%`, color: TEXT_DIM, opacity: 0.06 }}
        initial={{ y: "110%", rotate: -8 }}
        animate={{ y: "-20%", rotate: 8 }}
        transition={{ duration: 26 + i * 4, repeat: Infinity, ease: "linear", delay: i * 3 }}
      >
        {glyph}
      </motion.span>
    ))}
  </div>
);

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [iqStats, setIqStats] = useState({ easy: 0, medium: 0, hard: 0 });
  const [globalRank, setGlobalRank] = useState(null);

  // Real Data Extraction
  const userName = user?.username || user?.fullname || "Player One";
  const stats = {
    rating: user?.stats?.rating || 1200,
    shopPoints: user?.stats?.shopPoints || user?.totalPoints || 0
  };
  const completions = user?.completions || {};
  const assignmentsCount = completions.assignments?.length || 0;
  const testsCount = completions.tests?.length || 0;
  const totalIqPuzzles = iqStats.easy + iqStats.medium + iqStats.hard;

  // Rank Math
  const rank = getRankDetails(stats.rating);
  const rankIndex = getRankIndex(stats.rating);
  const isMaxRank = rank.title === "Grandmaster" && stats.rating >= rank.max;
  const rankProgress = Math.min(100, Math.max(0, ((stats.rating - rank.min) / (rank.max - rank.min)) * 100));
  const pointsToNextRank = Math.max(0, rank.max - stats.rating);

  // Fetch Live IQ Stats & Leaderboard Rank
  useEffect(() => {
    let isMounted = true;
    
    const fetchLiveStats = async () => {
      try {
        const [iqRes, leaderRes] = await Promise.all([
          apiClient.get(ENDPOINTS.IQ.GET_STATS),
          apiClient.get('/users/leaderboard')
        ]);
        
        if (!isMounted) return;

        // Parse IQ Data
        let easy = 0, medium = 0, hard = 0;
        (iqRes.data?.data || []).forEach(stat => {
          if (stat.difficulty === "easy") easy += stat.totalGamesPlayed;
          if (stat.difficulty === "medium") medium += stat.totalGamesPlayed;
          if (stat.difficulty === "hard") hard += stat.totalGamesPlayed;
        });
        setIqStats({ easy, medium, hard });

        // Parse Global Rank
        const players = leaderRes.data?.data || [];
        const myIndex = players.findIndex(p => p._id === user?._id);
        if (myIndex !== -1) setGlobalRank(myIndex + 1);

      } catch (error) {
        console.error("Dashboard sync failed.", error);
      }
    };

    fetchLiveStats();
    return () => { isMounted = false; };
  }, [user]);

  // Activity Feed built from truth
  const activityRows = useMemo(() => {
    const rows = [];
    if (assignmentsCount > 0) rows.push({ icon: ClipboardList, color: "#22D3EE", text: `${assignmentsCount} assignments completed` });
    if (testsCount > 0) rows.push({ icon: FileBarChart, color: "#2DD4BF", text: `${testsCount} tests passed` });
    if (totalIqPuzzles > 0) rows.push({ icon: Brain, color: "#E879F9", text: `${totalIqPuzzles} IQ puzzles solved` });
    rows.push({ icon: TrendingUp, color: "#60A5FA", text: `Current Pawn Rating: ${stats.rating}` });
    return rows;
  }, [assignmentsCount, testsCount, totalIqPuzzles, stats.rating]);

  // Achievement Teasers
  const badgeTeasers = useMemo(() => ([
    { title: "First Blood", icon: BookOpen, unlocked: assignmentsCount > 0 },
    { title: "Test Veteran", icon: Flame, unlocked: testsCount >= 5 },
    { title: "Rising Star", icon: Crown, unlocked: stats.rating >= 1400 },
    { title: "Grandmaster", icon: Trophy, unlocked: stats.rating >= 2000 },
  ]), [assignmentsCount, testsCount, stats.rating]);

  // Handle paths that already include the prefix
  const goTo = (path) => navigate(path.startsWith("/") ? path : `/${path}`);

  // Animations
  const containerVars = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
  const itemVars = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="min-h-screen w-full font-sans relative overflow-hidden" style={{ background: INK, color: TEXT }}>
      <FloatingPieces />
      <DashboardNavbar />

      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-24">

        {/* ============================ HEADER / RANK PROGRESS CARD ============================ */}
        <motion.div
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="relative rounded-2xl p-6 mb-6 overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${PANEL_RAISED}, ${PANEL})`, border: `1px solid ${LINE}` }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black"
                  style={{ background: `linear-gradient(135deg, ${BRAND_ACCENT}, #FF6BD6)`, color: "#fff" }}
                >
                  {userName.charAt(0).toUpperCase()}
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em]" style={{ color: TEXT_DIM }}>{rank.title}</p>
                <h1 className="text-2xl font-black tracking-tight">{userName}</h1>
              </div>
            </div>

            {/* Wallet Quick View */}
            <div className="flex items-center gap-2 rounded-xl px-4 py-2.5 self-start bg-black/20 border border-[#2E2A54]">
              <Zap size={18} color={GOLD} fill={GOLD} />
              <span className="font-black text-lg text-[#FFC53D]">{stats.shopPoints}</span>
              <span className="text-xs text-[#9691C4]">pts</span>
            </div>
          </div>

          {/* Real Rank Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-xs mb-1.5 font-medium" style={{ color: TEXT_DIM }}>
              <span className="text-white">{stats.rating} Rating</span>
              <span>{isMaxRank ? "MAX RANK" : `${pointsToNextRank} pts to ${RANK_LADDER[rankIndex + 1]?.title}`}</span>
            </div>
            <div className="h-3 w-full rounded-full overflow-hidden" style={{ background: LINE }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${rankProgress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full rounded-full relative"
                style={{ background: `linear-gradient(90deg, ${BRAND_ACCENT}, #FF6BD6)` }}
              >
                <div className="absolute inset-0 opacity-40" style={{ background: "linear-gradient(90deg, transparent, #fff, transparent)" }} />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* ============================ QUICK STATS ============================ */}
        <motion.div variants={containerVars} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Pawn Rating", value: stats.rating, icon: TrendingUp, color: "#60A5FA" },
            { label: "Shop Wallet", value: stats.shopPoints, icon: Zap, color: GOLD },
            { label: "Assignments", value: assignmentsCount, icon: ClipboardList, color: "#22D3EE" },
            { label: "Global Rank", value: globalRank ? `#${globalRank}` : "—", icon: Medal, color: "#FB7185" },
          ].map((s) => (
            <motion.div
              key={s.label}
              variants={itemVars}
              className="rounded-xl p-4 flex flex-col gap-2"
              style={{ background: PANEL, border: `1px solid ${LINE}` }}
            >
              <s.icon size={16} color={s.color} />
              <span className="text-xl font-black">{s.value}</span>
              <span className="text-[11px] uppercase tracking-wide" style={{ color: TEXT_DIM }}>{s.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* ============================ FEATURED ACTION: IQ GYM ============================ */}
        <motion.button
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => goTo("student-dashboard/iqpuzzles")}
          className="relative w-full overflow-hidden rounded-2xl p-7 mb-10 text-left bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500"
          style={{ boxShadow: `0 20px 60px -20px #d946ef88` }}
        >
          <div
            className="absolute inset-y-0 right-0 w-56 opacity-20 pointer-events-none"
            style={{ backgroundImage: "repeating-conic-gradient(#fff 0% 25%, transparent 0% 50%)", backgroundSize: "26px 26px" }}
          />
          <div className="relative flex items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <motion.div
                animate={{ rotate: [0, -8, 8, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1.5 }}
                className="w-16 h-16 rounded-2xl flex items-center justify-center bg-white/15 backdrop-blur-sm border border-white/30"
              >
                <Brain size={30} className="text-white" strokeWidth={1.75} />
              </motion.div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/70 mb-1">Daily Grind</p>
                <h2 className="text-3xl font-black text-white mb-1">Enter IQ Gym</h2>
                <p className="text-sm text-white/80 max-w-sm">Solve tactical puzzles to increase your Pawn Rating.</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-5 py-3 rounded-xl font-black text-sm flex-shrink-0 bg-white text-black">
              Train Now <ChevronRight size={18} />
            </div>
          </div>
        </motion.button>

        {/* ============================ MODULE GRID ============================ */}
        <div className="flex items-center gap-3 mb-5">
          <h3 className="text-sm uppercase tracking-[0.2em]" style={{ color: TEXT_DIM }}>Explore</h3>
          <div className="h-px flex-1" style={{ background: LINE }} />
        </div>

        <motion.div variants={containerVars} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {MODULES.map((item) => (
            <motion.button
              key={item.name}
              variants={itemVars}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => goTo(item.path)}
              className="relative text-left rounded-xl p-5 flex items-start gap-4 overflow-hidden group"
              style={{ background: PANEL, border: `1px solid ${LINE}` }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `radial-gradient(circle at 20% 20%, ${item.accent}22, transparent 70%)` }}
              />
              <div
                className="relative w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                style={{ background: `${item.accent}22`, border: `1px solid ${item.accent}55`, color: item.accent }}
              >
                <item.icon size={20} strokeWidth={1.75} />
              </div>
              <div className="relative min-w-0">
                <h4 className="font-bold text-base mb-1 flex items-center gap-1.5">
                  {item.name}
                  <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" style={{ color: item.accent }} />
                </h4>
                <p className="text-xs leading-relaxed" style={{ color: TEXT_DIM }}>{item.desc}</p>
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* ============================ ACTIVITY & TEASERS ============================ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-12">
          
          {/* Progress So Far */}
          <div className="rounded-xl p-6" style={{ background: PANEL, border: `1px solid ${LINE}` }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${GOLD}22`, color: GOLD }}>
                <Target size={16} />
              </div>
              <h3 className="font-bold text-sm">Your Progress So Far</h3>
            </div>
            <div className="space-y-4">
              {activityRows.length > 0 ? activityRows.map((row, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${row.color}20`, color: row.color }}>
                    <row.icon size={13} />
                  </div>
                  <span className="font-medium" style={{ color: TEXT_DIM }}>{row.text}</span>
                </div>
              )) : (
                <p className="text-sm text-[#9691C4]">No data yet. Hit the IQ Gym to get started!</p>
              )}
            </div>
          </div>

          {/* Achievement Shelf */}
          <div className="rounded-xl p-6" style={{ background: PANEL, border: `1px solid ${LINE}` }}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 bg-purple-500/20 text-purple-400">
                  <Award size={16} />
                </div>
                <h3 className="font-bold text-sm">Badges</h3>
              </div>
              <button
                onClick={() => goTo("student-dashboard/achievements")}
                className="text-xs font-bold flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors bg-[#7C5CFF]/20 text-[#C4B5FD]"
              >
                View all <ChevronRight size={13} />
              </button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <AnimatePresence>
                {badgeTeasers.map((badge, i) => (
                  <motion.div
                    key={badge.title}
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.05 * i }}
                    className="rounded-xl py-3 px-1 flex flex-col items-center text-center gap-2"
                    style={{ background: badge.unlocked ? `${GOLD}14` : "transparent", border: `1px solid ${badge.unlocked ? `${GOLD}55` : LINE}` }}
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center"
                      style={badge.unlocked ? { background: `${GOLD}25`, color: GOLD } : { background: LINE, color: TEXT_DIM }}
                    >
                      {badge.unlocked ? <badge.icon size={16} /> : <Lock size={14} />}
                    </div>
                    <span className="text-[10px] font-bold" style={{ color: badge.unlocked ? TEXT : TEXT_DIM }}>{badge.title}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

        </div>

        {/* ============================ FOOTER NOTE ============================ */}
        <div className="mt-14 flex items-center justify-center gap-2 text-xs" style={{ color: TEXT_DIM }}>
          <Star size={12} />
          <span>Every game, every puzzle — one more step up the FIDE ladder.</span>
        </div>

      </main>
    </div>
  );
}