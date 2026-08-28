import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, MotionConfig, type Variants } from "framer-motion";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "../../../components/Dashbordnavbar";
import {
  GraduationCap, Trophy, ClipboardList, Award, FileBarChart,
  Brain, Medal, Zap, ChevronRight, Flame, Star,
  TrendingUp, Lock, Crown, Target, BookOpen,
  Gamepad2, MessageSquare, Settings, Swords
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import apiClient from "../../../lib/api";
import { ENDPOINTS } from "../../../lib/endpoints.js";

/* =============================================================================
   TYPES & INTERFACES
============================================================================= */
interface RankConfig {
  title: string;
  min: number;
  max: number;
  glyph: string;
}

interface ModuleConfig {
  name: string;
  coord: string;
  path: string;
  icon: LucideIcon;
  accent: string;
  desc: string;
}

interface ActivityRow {
  icon: LucideIcon;
  color: string;
  text: string;
}

interface BadgeTeaser {
  title: string;
  icon: LucideIcon;
  unlocked: boolean;
}

interface IqStats {
  easy: number;
  medium: number;
  hard: number;
}

interface IqDifficultyStat {
  difficulty: "easy" | "medium" | "hard" | string;
  totalGamesPlayed: number;
}

interface LeaderboardPlayer {
  _id: string;
}

/* =============================================================================
   THEME — "Tournament Hall": dark walnut board room, brass fittings, ivory.
============================================================================= */
const INK          = "#0A0806"; // deeper ebony
const PANEL        = "#1A1510"; // dark walnut
const PANEL_RAISED = "#241D16"; // lit walnut
const LINE         = "#3B301F"; // brass-brown hairline
const LINE_SOFT    = "#2A2216";
const TEXT         = "#F2E9D6"; // ivory piece
const TEXT_DIM     = "#A4937A"; // parchment
const TEXT_FAINT   = "#6E624E";
const GOLD         = "#D4AF37"; // metallic gold/brass
const GOLD_BRIGHT  = "#F3E5AB";
const EMERALD      = "#2E5C40"; // felt board green
const OXBLOOD      = "#8B3220"; // red leather

const FONT_DISPLAY = "'Fraunces', 'Iowan Old Style', Georgia, serif";
const FONT_BODY    = "'Inter', -apple-system, sans-serif";
const FONT_MONO    = "'IBM Plex Mono', 'SF Mono', monospace";

const FontLoader: React.FC = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
  `}</style>
);

/* ----------------------------- RANK ENGINE ----------------------------- */
const RANK_LADDER: RankConfig[] = [
  { title: "Novice",      min: 0,    max: 1200, glyph: "♟" },
  { title: "Knight",      min: 1200, max: 1400, glyph: "♞" },
  { title: "Bishop",      min: 1400, max: 1600, glyph: "♝" },
  { title: "Rook",        min: 1600, max: 1800, glyph: "♜" },
  { title: "Queen",       min: 1800, max: 2000, glyph: "♛" },
  { title: "Grandmaster", min: 2000, max: 3000, glyph: "♚" },
];

const getRankDetails = (rating: number): RankConfig =>
  RANK_LADDER.find(r => rating < r.max) || RANK_LADDER[RANK_LADDER.length - 1];

const getRankIndex = (rating: number): number => {
  const idx = RANK_LADDER.findIndex(r => rating < r.max);
  return idx === -1 ? RANK_LADDER.length - 1 : idx;
};

/* ------------------------------- MODULE DATA ------------------------------ */
const MODULES: ModuleConfig[] = [
  { name: "Play Game",    coord: "e4", path: "play", icon: Swords,              accent: OXBLOOD, desc: "Enter ranked matchmaking and put your rating on the line." },
  { name: "Classes",      coord: "d4", path: "student-dashboard/classes",       icon: GraduationCap, accent: "#4A6FA5", desc: "Join live sessions with your assigned Grandmaster." },
  { name: "IQ Gym",       coord: "c3", path: "student-dashboard/iqpuzzles",     icon: Brain,          accent: "#7D5282", desc: "Sharpen calculation and pattern recognition." },
  { name: "Tournaments",  coord: "f6", path: "student-dashboard/tournaments",   icon: Trophy,         accent: GOLD,      desc: "Compete in rated events and climb the bracket." },
  { name: "Training",     coord: "b1", path: "student-dashboard/training-sessions", icon: Gamepad2,   accent: EMERALD,   desc: "Review finished games with engine analysis." },
  { name: "Leaderboard",  coord: "g7", path: "student-dashboard/leaderboard",   icon: Medal,          accent: "#A67B5B", desc: "See how your rating compares across the academy." },
  { name: "Assignments",  coord: "a2", path: "student-dashboard/assignments",   icon: ClipboardList,  accent: "#6D828C", desc: "Complete your assigned tactical puzzle sets." },
  { name: "Achievements", coord: "h8", path: "student-dashboard/achievements",  icon: Award,          accent: GOLD,      desc: "Track badges earned and rating milestones reached." },
  { name: "Testing",      coord: "c6", path: "student-dashboard/test",          icon: FileBarChart,   accent: EMERALD,   desc: "Sit a standardized assessment to confirm your rating." },
  { name: "Chats",        coord: "f2", path: "student-dashboard/chats",         icon: MessageSquare,  accent: "#8B806B", desc: "Message your coach and academy mentors directly." },
  { name: "Settings",     coord: "a1", path: "student-dashboard/settings",      icon: Settings,       accent: "#7A6E59", desc: "Manage your profile and account preferences." },
];

/* ------------------------------ BOARD TEXTURE ------------------------------ */
const BoardTexture: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
    <div
      className="absolute top-0 right-0 w-full h-[600px] opacity-[0.03]"
      style={{
        backgroundImage: `linear-gradient(45deg, ${TEXT} 25%, transparent 25%), linear-gradient(-45deg, ${TEXT} 25%, transparent 25%), linear-gradient(45deg, transparent 75%, ${TEXT} 75%), linear-gradient(-45deg, transparent 75%, ${TEXT} 75%)`,
        backgroundSize: "64px 64px",
        backgroundPosition: "0 0, 0 32px, 32px -32px, -32px 0px",
        maskImage: "radial-gradient(ellipse at top right, black 10%, transparent 70%)",
        WebkitMaskImage: "radial-gradient(ellipse at top right, black 10%, transparent 70%)",
      }}
    />
    <span
      className="absolute -bottom-20 -left-16 select-none mix-blend-overlay"
      style={{ fontSize: 400, color: TEXT, opacity: 0.015, lineHeight: 1 }}
    >
      ♞
    </span>
  </div>
);

/* ------------------------------ RANK SQUARES ------------------------------ */
const RankSquares: React.FC<{ progress: number }> = ({ progress }) => {
  const filled = Math.round((progress / 100) * 8);
  const files = ["a", "b", "c", "d", "e", "f", "g", "h"];

  return (
    <div className="w-full">
      <div className="flex gap-1.5 mb-1.5">
        {files.map((_, i) => {
          const isFilled = i < filled;
          const isDarkSquare = i % 2 === 0;
          return (
            <motion.div
              key={i}
              initial={{ scaleY: 0.2, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.05, duration: 0.4, ease: "easeOut" }}
              className="h-3.5 flex-1 rounded-[2px]"
              style={{
                background: isFilled
                  ? `linear-gradient(135deg, ${GOLD}, ${GOLD_BRIGHT})`
                  : (isDarkSquare ? LINE_SOFT : LINE),
                boxShadow: isFilled ? `inset 0 0 4px rgba(255,255,255,0.4), 0 0 12px -2px ${GOLD}88` : "inset 0 2px 4px rgba(0,0,0,0.5)",
                border: `1px solid ${isFilled ? "#FFF2B2" : INK}`,
              }}
            />
          );
        })}
      </div>
      <div className="flex gap-1.5 px-0.5">
        {files.map((file, i) => (
          <div key={file} className="flex-1 text-center text-[9px] uppercase font-bold" style={{ color: i < filled ? GOLD : TEXT_FAINT, fontFamily: FONT_MONO }}>
            {file}
          </div>
        ))}
      </div>
    </div>
  );
};

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [iqStats, setIqStats] = useState<IqStats>({ easy: 0, medium: 0, hard: 0 });
  const [globalRank, setGlobalRank] = useState<number | null>(null);

  // Data Extraction
  const userName = user?.username || user?.fullname || "Player One";
  const stats = {
    rating: user?.stats?.rating || 1200,
    shopPoints: user?.stats?.shopPoints || user?.totalPoints || 0,
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

  useEffect(() => {
    let isMounted = true;

    const fetchLiveStats = async () => {
      try {
        const [iqRes, leaderRes] = await Promise.all([
          apiClient.get(ENDPOINTS.IQ.GET_STATS),
          apiClient.get("/users/leaderboard?sortBy=rating&limit=100"),
        ]);

        if (!isMounted) return;

        let easy = 0, medium = 0, hard = 0;
        const iqData: IqDifficultyStat[] = iqRes.data?.data || [];
        iqData.forEach((stat) => {
          if (stat.difficulty === "easy") easy += stat.totalGamesPlayed;
          if (stat.difficulty === "medium") medium += stat.totalGamesPlayed;
          if (stat.difficulty === "hard") hard += stat.totalGamesPlayed;
        });
        setIqStats({ easy, medium, hard });

        const players: LeaderboardPlayer[] = leaderRes.data?.data?.leaderboard || leaderRes.data?.data || [];
        const myIndex = players.findIndex((p) => p._id === user?._id);
        if (myIndex !== -1) setGlobalRank(myIndex + 1);

      } catch (error) {
        console.error("Dashboard sync failed.", error);
      }
    };

    fetchLiveStats();
    return () => { isMounted = false; };
  }, [user]);

  const activityRows: ActivityRow[] = useMemo(() => {
    const rows: ActivityRow[] = [];
    if (assignmentsCount > 0) rows.push({ icon: ClipboardList, color: "#6D828C", text: `${assignmentsCount} assignments completed` });
    if (testsCount > 0) rows.push({ icon: FileBarChart, color: EMERALD, text: `${testsCount} tests passed` });
    if (totalIqPuzzles > 0) rows.push({ icon: Brain, color: "#7D5282", text: `${totalIqPuzzles} IQ puzzles solved` });
    rows.push({ icon: TrendingUp, color: GOLD, text: `Current rating: ${stats.rating}` });
    return rows;
  }, [assignmentsCount, testsCount, totalIqPuzzles, stats.rating]);

  const badgeTeasers: BadgeTeaser[] = useMemo(() => ([
    { title: "First Blood", icon: BookOpen, unlocked: assignmentsCount > 0 },
    { title: "Test Veteran", icon: Flame, unlocked: testsCount >= 5 },
    { title: "Rising Star", icon: Star, unlocked: stats.rating >= 1400 },
    { title: "Grandmaster", icon: Crown, unlocked: stats.rating >= 2000 },
  ]), [assignmentsCount, testsCount, stats.rating]);

  const goTo = (path: string) => navigate(path.startsWith("/") ? path : `/${path}`);

  const containerVars: Variants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
  const itemVars: Variants = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } } };

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen w-full relative overflow-hidden" style={{ background: INK, color: TEXT, fontFamily: FONT_BODY }}>
        <FontLoader />
        <BoardTexture />
        <DashboardNavbar />

        <main className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-28">

          {/* ============================ HEADER / RANK CARD ============================ */}
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: "easeOut" }}
            className="relative rounded-2xl p-6 md:p-8 mb-10 overflow-hidden shadow-2xl"
            style={{ background: `linear-gradient(160deg, ${PANEL_RAISED}, ${PANEL})`, border: `1px solid ${LINE}`, boxShadow: `0 20px 40px -15px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05)` }}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="flex items-center gap-5">
                <div
                  className="w-20 h-20 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner"
                  style={{ background: `linear-gradient(135deg, ${PANEL}, ${INK})`, border: `1px solid ${GOLD}66`, boxShadow: `inset 0 4px 10px rgba(0,0,0,0.5), 0 0 15px ${GOLD}22` }}
                >
                  <span style={{ fontFamily: FONT_DISPLAY, fontSize: 36, color: GOLD, textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}>
                    {rank.glyph}
                  </span>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.3em] mb-1 font-bold" style={{ color: GOLD, fontFamily: FONT_MONO }}>
                    {rank.title}
                  </p>
                  <h1 className="text-3xl font-semibold tracking-tight" style={{ fontFamily: FONT_DISPLAY, color: TEXT }}>
                    {userName}
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl px-5 py-3 self-start md:self-auto" style={{ background: INK, border: `1px solid ${LINE}`, boxShadow: "inset 0 2px 8px rgba(0,0,0,0.6)" }}>
                <Zap size={18} color={GOLD} fill={GOLD} />
                <span className="font-bold text-xl" style={{ color: GOLD, fontFamily: FONT_MONO }}>{stats.shopPoints}</span>
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: TEXT_FAINT }}>pts</span>
              </div>
            </div>

            <div className="mt-8 pt-6" style={{ borderTop: `1px solid ${LINE}` }}>
              <div className="flex justify-between items-baseline mb-3">
                <span className="text-base font-bold tracking-wide" style={{ fontFamily: FONT_MONO, color: TEXT }}>
                  {stats.rating} <span style={{ color: TEXT_FAINT, fontSize: 11, letterSpacing: "0.1em" }}>ELO RATING</span>
                </span>
                <span className="text-[11px] uppercase tracking-wider font-bold" style={{ color: TEXT_DIM, fontFamily: FONT_MONO }}>
                  {isMaxRank ? "Pinnacle Reached" : `${pointsToNextRank} pts to ${RANK_LADDER[rankIndex + 1]?.title}`}
                </span>
              </div>
              <RankSquares progress={rankProgress} />
            </div>
          </motion.div>

          {/* ============================ QUICK STATS ============================ */}
          <motion.div variants={containerVars} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {[
              { label: "Pawn Rating", value: stats.rating, icon: TrendingUp, color: GOLD },
              { label: "Shop Wallet", value: stats.shopPoints, icon: Zap, color: GOLD },
              { label: "Assignments", value: assignmentsCount, icon: ClipboardList, color: "#6D828C" },
              { label: "Global Rank", value: globalRank ? `#${globalRank}` : "—", icon: Medal, color: OXBLOOD },
            ].map((s) => (
              <motion.div
                key={s.label} variants={itemVars}
                className="rounded-xl p-5 flex flex-col gap-3 shadow-lg"
                style={{ background: PANEL, border: `1px solid ${LINE}`, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)" }}
              >
                <s.icon size={16} color={s.color} />
                <span className="text-2xl font-bold" style={{ fontFamily: FONT_MONO }}>{s.value}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: TEXT_FAINT }}>{s.label}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* ============================ FEATURED ACTION: IQ GYM ============================ */}
          <motion.button
            initial={{ opacity: 0, scale: 0.985 }} animate={{ opacity: 1, scale: 1 }} whileHover={{ y: -2 }} whileTap={{ scale: 0.99 }} transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={() => goTo("student-dashboard/iqpuzzles")}
            className="relative w-full overflow-hidden rounded-2xl p-8 mb-16 text-left focus:outline-none focus-visible:ring-2"
            style={{
              background: `linear-gradient(135deg, ${PANEL_RAISED}, ${PANEL} 70%)`,
              border: `1px solid ${GOLD}55`,
              boxShadow: "0 20px 40px -20px rgba(0,0,0,0.9), inset 0 0 0 1px rgba(255,255,255,0.05)",
              "--tw-ring-color": GOLD,
            } as React.CSSProperties}
          >
            {/* Brass plaque styling inner border */}
            <div className="absolute inset-2 border pointer-events-none rounded-xl" style={{ borderColor: `${GOLD}22` }} />

            <div className="relative flex items-center justify-between gap-6 flex-wrap z-10">
              <div className="flex items-center gap-6">
                <div
                  className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg"
                  style={{ background: `linear-gradient(to bottom, ${GOLD}, ${GOLD_BRIGHT})`, border: "1px solid #FFF2B2" }}
                >
                  <Brain size={32} strokeWidth={1.8} color={INK} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-1.5" style={{ color: GOLD, fontFamily: FONT_MONO }}>
                    Tactical Computation
                  </p>
                  <h2 className="text-3xl sm:text-4xl font-semibold mb-2 drop-shadow-md" style={{ fontFamily: FONT_DISPLAY, color: TEXT }}>
                    The IQ Gym
                  </h2>
                  <p className="text-[13px] max-w-md font-medium" style={{ color: TEXT_DIM }}>
                    Engage the evaluation engine. Solve daily tactical motifs to increase your official rating.
                  </p>
                </div>
              </div>
              <div
                className="hidden sm:flex items-center gap-2 px-6 py-3.5 rounded-lg font-bold text-xs uppercase tracking-wider flex-shrink-0 shadow-md hover:shadow-lg transition-shadow"
                style={{ background: `linear-gradient(to bottom, ${GOLD}, ${GOLD_BRIGHT})`, color: INK, border: "1px solid #FFF2B2" }}
              >
                Commence Training <ChevronRight size={14} strokeWidth={2.5} />
              </div>
            </div>
          </motion.button>

          {/* ============================ MODULE GRID ============================ */}
          <div className="flex items-center gap-4 mb-6">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color: TEXT_FAINT, fontFamily: FONT_MONO }}>The Grandmaster's Study</h3>
            <div className="h-px flex-1" style={{ background: LINE }} />
          </div>

          <motion.div variants={containerVars} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
            {MODULES.map((item) => (
              <motion.button
                key={item.name} variants={itemVars} whileHover={{ y: -3, backgroundColor: PANEL_RAISED }} whileTap={{ scale: 0.985 }} transition={{ duration: 0.2, ease: "easeOut" }}
                onClick={() => goTo(item.path)}
                className="relative text-left rounded-xl p-5 flex items-start gap-4 overflow-hidden group focus:outline-none focus-visible:ring-2 shadow-md"
                style={{ background: PANEL, border: `1px solid ${LINE}`, "--tw-ring-color": item.accent } as React.CSSProperties}
              >
                <span className="absolute top-3 right-3.5 text-[10px] font-bold tracking-wide opacity-30 group-hover:opacity-100 transition-opacity" style={{ fontFamily: FONT_MONO, color: item.accent }}>
                  {item.coord}
                </span>
                <div
                  className="relative w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-inner"
                  style={{ background: `${item.accent}15`, border: `1px solid ${item.accent}40`, color: item.accent }}
                >
                  <item.icon size={20} strokeWidth={1.8} />
                </div>
                <div className="relative min-w-0 pr-4 mt-0.5">
                  <h4 className="font-semibold text-base mb-1.5 flex items-center gap-1.5" style={{ fontFamily: FONT_DISPLAY }}>
                    {item.name}
                    <ChevronRight size={13} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" style={{ color: item.accent }} />
                  </h4>
                  <p className="text-[12px] font-medium leading-relaxed" style={{ color: TEXT_DIM }}>{item.desc}</p>
                </div>
              </motion.button>
            ))}
          </motion.div>

          {/* ============================ ACTIVITY & TEASERS ============================ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
            <div className="rounded-xl p-6 shadow-lg" style={{ background: PANEL, border: `1px solid ${LINE}` }}>
              <div className="flex items-center gap-3 mb-6 pb-4" style={{ borderBottom: `1px solid ${LINE_SOFT}` }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-inner" style={{ background: `${GOLD}1A`, border: `1px solid ${GOLD}40`, color: GOLD }}>
                  <Target size={14} />
                </div>
                <h3 className="font-semibold text-base" style={{ fontFamily: FONT_DISPLAY }}>Evaluation Log</h3>
              </div>
              <div className="space-y-4">
                {activityRows.length > 0 ? activityRows.map((row, i) => (
                  <div key={i} className="flex items-center gap-4 text-sm">
                    <div className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 shadow-inner" style={{ background: `${row.color}15`, border: `1px solid ${row.color}33`, color: row.color }}>
                      <row.icon size={14} />
                    </div>
                    <span className="font-medium tracking-wide" style={{ color: TEXT_DIM }}>{row.text}</span>
                  </div>
                )) : (
                  <p className="text-[13px] font-medium italic" style={{ color: TEXT_FAINT }}>No games recorded in the ledger yet.</p>
                )}
              </div>
            </div>

            <div className="rounded-xl p-6 shadow-lg" style={{ background: PANEL, border: `1px solid ${LINE}` }}>
              <div className="flex items-center justify-between mb-6 pb-4" style={{ borderBottom: `1px solid ${LINE_SOFT}` }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-inner" style={{ background: `${OXBLOOD}1A`, border: `1px solid ${OXBLOOD}40`, color: OXBLOOD }}>
                    <Award size={14} />
                  </div>
                  <h3 className="font-semibold text-base" style={{ fontFamily: FONT_DISPLAY }}>Honors & Titles</h3>
                </div>
                <button
                  onClick={() => goTo("student-dashboard/achievements")}
                  className="text-[10px] uppercase font-bold tracking-widest flex items-center gap-1 px-3 py-1.5 rounded-md transition-colors focus:outline-none focus-visible:ring-2 hover:bg-opacity-80"
                  style={{ background: `${GOLD}15`, color: GOLD_BRIGHT, border: `1px solid ${GOLD}33`, "--tw-ring-color": GOLD } as React.CSSProperties}
                >
                  View Library <ChevronRight size={12} />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <AnimatePresence>
                  {badgeTeasers.map((badge, i) => (
                    <motion.div
                      key={badge.title} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.04 * i, duration: 0.25 }}
                      className="rounded-lg py-4 px-2 flex flex-col items-center text-center gap-2.5 shadow-inner"
                      style={{ background: badge.unlocked ? `${GOLD}0A` : INK, border: `1px solid ${badge.unlocked ? `${GOLD}40` : LINE}` }}
                    >
                      <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-md" style={badge.unlocked ? { background: `linear-gradient(135deg, ${GOLD}33, ${GOLD}11)`, border: `1px solid ${GOLD}66`, color: GOLD } : { background: LINE_SOFT, color: TEXT_FAINT }}>
                        {badge.unlocked ? <badge.icon size={16} /> : <Lock size={14} />}
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider leading-tight" style={{ color: badge.unlocked ? TEXT : TEXT_FAINT }}>{badge.title}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* ============================ FOOTER NOTE ============================ */}
          <div className="mt-20 flex items-center justify-center gap-2.5 text-[11px] font-bold uppercase tracking-widest" style={{ color: TEXT_FAINT, fontFamily: FONT_MONO }}>
            <span style={{ fontSize: 14, color: GOLD }}>♟</span>
            <span>Every puzzle moves you one square closer to mastery.</span>
          </div>

        </main>
      </div>
    </MotionConfig>
  );
}