import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../../contexts/AuthContext.jsx";
import DashboardNavbar from "../../../components/Dashbordnavbar";
import {
  Trophy, Brain, Target, Shield, Zap, Castle, Crown,
  BookOpen, CheckCircle, Lock, RefreshCw, ChevronRight, Flame
} from "lucide-react";
import { Card, CardContent } from "../../../components/ui/card";
import { ENDPOINTS } from "../../../lib/endpoints.js";
import apiClient from "../../../lib/api.js";

/*
  Design language
  ----------------
  Grounded in the subject rather than a generic dashboard: tones read as an
  engraved chess-club rating certificate rather than a neon game-UI.

  Ink       #15130F  — page background, warm near-black (not blue-black)
  Panel     #1C1912  — card surface
  Line      #34301F  — hairline borders / ticks
  Parchment #EDE6D6  — primary text
  Parch-dim #9C917B  — secondary / muted text
  Pine      #4C7A6B  — in-progress accent
  Rust      #A24632  — error accent

  Rank tiers move through a muted heritage palette (stone -> bronze -> pewter
  -> pine -> wine -> brass) instead of a rainbow gradient cycle, and numbers
  are set in a monospace face, the way ratings and PGN notation are
  traditionally typeset.
*/

const INK = "#15130F";
const PANEL = "#1C1912";
const PANEL_RAISED = "#231F16";
const LINE = "#34301F";
const PARCHMENT = "#EDE6D6";
const PARCH_DIM = "#9C917B";
const PINE = "#4C7A6B";
const RUST = "#A24632";

const RANK_LADDER = [
  { title: "Novice",      min: 0,    max: 1200, tone: "#8C8370", icon: Shield },
  { title: "Knight",      min: 1200, max: 1400, tone: "#B5722E", icon: Target },
  { title: "Bishop",      min: 1400, max: 1600, tone: "#6E8CA0", icon: Zap },
  { title: "Rook",        min: 1600, max: 1800, tone: "#3F6E63", icon: Castle },
  { title: "Queen",       min: 1800, max: 2000, tone: "#8B3A4B", icon: Crown },
  { title: "Grandmaster", min: 2000, max: 3000, tone: "#C9A227", icon: Trophy },
];

const getRankIndex = (rating) => {
  const idx = RANK_LADDER.findIndex(r => rating < r.max);
  return idx === -1 ? RANK_LADDER.length - 1 : idx;
};

const SkeletonLine = ({ className = "" }) => (
  <div className={`animate-pulse rounded ${className}`} style={{ background: LINE }} />
);

const Achievements = () => {
  const { user } = useAuth();

  const [iqStats, setIqStats] = useState({ easy: 0, medium: 0, hard: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [filter, setFilter] = useState("all"); // 'all' | 'unlocked' | 'locked'

  const stats = {
    rating: user?.stats?.rating || 1200,
    shopPoints: user?.stats?.shopPoints || user?.totalPoints || 0
  };
  const completions = user?.completions || {};

  const assignmentsCount = completions.assignments?.length || 0;
  const testsCount = completions.tests?.length || 0;
  const totalIqPuzzles = iqStats.easy + iqStats.medium + iqStats.hard;

  const rankIndex = getRankIndex(stats.rating);
  const rank = RANK_LADDER[rankIndex];
  const RankIcon = rank.icon;
  const isMaxRank = rankIndex === RANK_LADDER.length - 1 && stats.rating >= rank.max;

  const rankProgress = Math.min(100, Math.max(0, ((stats.rating - rank.min) / (rank.max - rank.min)) * 100));
  const pointsToNextRank = Math.max(0, rank.max - stats.rating);

  const fetchLiveStats = async () => {
    setIsLoading(true);
    setLoadError(false);
    try {
      const response = await apiClient.get(ENDPOINTS.IQ.GET_STATS);
      const statsData = response.data?.data || [];

      let easy = 0, medium = 0, hard = 0;
      statsData.forEach(stat => {
        if (stat.difficulty === "easy") easy += stat.totalGamesPlayed;
        if (stat.difficulty === "medium") medium += stat.totalGamesPlayed;
        if (stat.difficulty === "hard") hard += stat.totalGamesPlayed;
      });
      setIqStats({ easy, medium, hard });
    } catch (error) {
      console.error("Failed to load achievement stats:", error);
      setLoadError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const badges = useMemo(() => ([
    { title: "First Blood", description: "Complete your first assignment.", icon: BookOpen, current: assignmentsCount, target: 1 },
    { title: "Test Veteran", description: "Conquer 5 timed tests.", icon: Flame, current: testsCount, target: 5 },
    { title: "Brainiac", description: "Solve 10 Easy IQ Puzzles.", icon: Brain, current: iqStats.easy, target: 10 },
    { title: "Tactician", description: "Solve 5 Medium IQ Puzzles.", icon: Target, current: iqStats.medium, target: 5 },
    { title: "Tactical Genius", description: "Solve a Hard IQ Puzzle.", icon: Zap, current: iqStats.hard, target: 1 },
    { title: "Rising Star", description: "Reach a Pawn Rating of 1400+.", icon: Crown, current: Math.min(stats.rating, 1400), target: 1400 },
  ].map(b => ({ ...b, unlocked: b.current >= b.target }))), [assignmentsCount, testsCount, iqStats, stats.rating]);

  const unlockedCount = badges.filter(b => b.unlocked).length;

  const visibleBadges = badges.filter(b => {
    if (filter === "unlocked") return b.unlocked;
    if (filter === "locked") return !b.unlocked;
    return true;
  });

  const containerVars = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
  const itemVars = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="min-h-screen font-sans" style={{ background: INK, color: PARCHMENT }}>
      <DashboardNavbar />

      <div className="max-w-6xl mx-auto pt-32 px-6 pb-20">

        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1" style={{ background: LINE }} />
          <span className="text-[11px] uppercase tracking-[0.25em]" style={{ color: PARCH_DIM }}>
            Player Record
          </span>
          <div className="h-px flex-1" style={{ background: LINE }} />
        </div>

        {/* HERO — RATING CERTIFICATE */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative rounded-lg p-8 mb-4"
          style={{ background: PANEL, border: `1px solid ${LINE}` }}
        >
          {/* corner brackets — certificate motif, replaces glow orbs */}
          <div className="absolute top-3 left-3 w-4 h-4 border-t border-l pointer-events-none" style={{ borderColor: rank.tone }} />
          <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r pointer-events-none" style={{ borderColor: rank.tone }} />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
            <div className="flex items-center gap-6 w-full lg:w-2/3">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ border: `1px solid ${rank.tone}66`, background: `${rank.tone}14`, color: rank.tone }}
              >
                <RankIcon size={30} strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] uppercase tracking-[0.2em] mb-1" style={{ color: PARCH_DIM }}>Current Rank</p>
                <h1 className="text-3xl md:text-4xl font-serif tracking-tight mb-3" style={{ color: PARCHMENT }}>
                  {rank.title}
                </h1>

                <div className="flex items-center gap-3 font-mono text-sm mb-2">
                  <span style={{ color: rank.tone }}>{stats.rating}</span>
                  <span style={{ color: PARCH_DIM }}>rating</span>
                  <span style={{ color: LINE }}>/</span>
                  <span style={{ color: PARCH_DIM }}>
                    {isMaxRank ? "top of ladder" : `${pointsToNextRank} to ${RANK_LADDER[rankIndex + 1]?.title}`}
                  </span>
                </div>

                <div
                  className="h-1 w-full rounded-full overflow-hidden"
                  style={{ background: LINE }}
                  role="progressbar"
                  aria-valuenow={Math.round(rankProgress)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Progress toward next rank"
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${rankProgress}%` }}
                    transition={{ duration: 0.9, delay: 0.15 }}
                    className="h-full rounded-full"
                    style={{ background: rank.tone }}
                  />
                </div>
              </div>
            </div>

            {/* Points */}
            <div
              className="rounded-lg px-6 py-5 min-w-[200px] w-full lg:w-auto"
              style={{ background: PANEL_RAISED, border: `1px solid ${LINE}` }}
            >
              <p className="text-[11px] uppercase tracking-[0.2em] mb-2" style={{ color: PARCH_DIM }}>Wallet</p>
              <p className="text-3xl font-mono" style={{ color: "#C9A227" }}>
                {stats.shopPoints} <span className="text-sm" style={{ color: PARCH_DIM }}>pts</span>
              </p>
            </div>
          </div>

          {/* RATING LADDER — a ruler with tick marks, like a published rating-floor table */}
          <div className="mt-10 pt-6" style={{ borderTop: `1px solid ${LINE}` }}>
            <div className="flex items-start justify-between relative">
              {RANK_LADDER.map((r, i) => {
                const StepIcon = r.icon;
                const achieved = i <= rankIndex;
                const isCurrent = i === rankIndex;
                return (
                  <div key={r.title} className="flex flex-col items-center flex-1 relative">
                    {i > 0 && (
                      <div
                        className="absolute top-[15px] right-1/2 w-full h-px"
                        style={{ background: i <= rankIndex ? rank.tone : LINE, opacity: i <= rankIndex ? 0.6 : 1 }}
                      />
                    )}
                    <div
                      className="w-[30px] h-[30px] rounded-full flex items-center justify-center relative z-10 transition-all duration-300"
                      style={{
                        background: isCurrent ? r.tone : achieved ? `${r.tone}20` : PANEL,
                        border: `1px solid ${achieved ? r.tone : LINE}`,
                        color: isCurrent ? INK : achieved ? r.tone : PARCH_DIM,
                      }}
                    >
                      <StepIcon size={13} strokeWidth={2} />
                    </div>
                    <span
                      className="text-[10px] font-mono mt-2 hidden sm:block"
                      style={{ color: isCurrent ? PARCHMENT : PARCH_DIM }}
                    >
                      {r.min}
                    </span>
                    <span
                      className="text-[10px] uppercase tracking-wide mt-0.5 hidden md:block"
                      style={{ color: isCurrent ? r.tone : PARCH_DIM }}
                    >
                      {r.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {loadError && (
          <div
            className="mb-8 flex items-center justify-between gap-4 rounded-lg px-5 py-3.5"
            style={{ background: `${RUST}14`, border: `1px solid ${RUST}40`, color: "#D89184" }}
          >
            <span className="text-sm">Couldn't load your latest puzzle stats. Numbers below may be out of date.</span>
            <button
              onClick={fetchLiveStats}
              className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-md flex-shrink-0 transition-colors"
              style={{ background: `${RUST}25`, color: "#F0B4A8" }}
            >
              <RefreshCw size={14} /> Retry
            </button>
          </div>
        )}

        {/* OVERVIEW */}
        <div className="flex items-center gap-3 mt-12 mb-6">
          <h3 className="text-sm uppercase tracking-[0.2em]" style={{ color: PARCH_DIM }}>Training Record</h3>
          <div className="h-px flex-1" style={{ background: LINE }} />
        </div>

        <motion.div variants={containerVars} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
          {[
            { icon: BookOpen, label: "Assignments Done", value: assignmentsCount },
            { icon: Flame, label: "Tests Passed", value: testsCount },
          ].map((s) => (
            <motion.div variants={itemVars} key={s.label}>
              <Card style={{ background: PANEL, border: `1px solid ${LINE}` }} className="h-full rounded-lg">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-8">
                    <s.icon size={20} style={{ color: PARCH_DIM }} />
                    <span className="text-3xl font-mono" style={{ color: PARCHMENT }}>{s.value}</span>
                  </div>
                  <p className="text-sm" style={{ color: PARCH_DIM }}>{s.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          <motion.div variants={itemVars}>
            <Card style={{ background: PANEL, border: `1px solid ${LINE}` }} className="h-full rounded-lg">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <Brain size={20} style={{ color: PARCH_DIM }} />
                  {isLoading ? <SkeletonLine className="w-10 h-8" /> : (
                    <span className="text-3xl font-mono" style={{ color: PARCHMENT }}>{totalIqPuzzles}</span>
                  )}
                </div>
                <p className="text-sm mb-4 pb-3" style={{ color: PARCH_DIM, borderBottom: `1px solid ${LINE}` }}>IQ Puzzles Solved</p>
                <div className="space-y-2 text-sm font-mono">
                  {[
                    { label: "Easy", value: iqStats.easy },
                    { label: "Medium", value: iqStats.medium },
                    { label: "Hard", value: iqStats.hard },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between items-center">
                      <span style={{ color: PARCH_DIM }}>{row.label}</span>
                      {isLoading ? <SkeletonLine className="w-8 h-4" /> : <span style={{ color: PARCHMENT }}>{row.value}</span>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* BADGES */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <h3 className="text-sm uppercase tracking-[0.2em]" style={{ color: PARCH_DIM }}>Badges</h3>
            <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ background: PANEL_RAISED, color: PARCH_DIM, border: `1px solid ${LINE}` }}>
              {unlockedCount} / {badges.length}
            </span>
          </div>

          <div className="flex items-center gap-1 rounded-md p-1 self-start" style={{ background: PANEL, border: `1px solid ${LINE}` }}>
            {[
              { key: "all", label: "All" },
              { key: "unlocked", label: "Unlocked" },
              { key: "locked", label: "Locked" },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className="px-3 py-1 text-xs font-medium rounded transition-colors"
                style={filter === tab.key
                  ? { background: "#C9A227", color: INK }
                  : { color: PARCH_DIM }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {visibleBadges.map((badge) => {
              const BadgeIcon = badge.icon;
              const progressPct = Math.min(100, Math.round((badge.current / badge.target) * 100));
              return (
                <motion.div
                  layout
                  key={badge.title}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-lg p-6 flex flex-col items-center text-center transition-colors duration-300"
                  style={{
                    background: badge.unlocked ? PANEL_RAISED : PANEL,
                    border: `1px solid ${badge.unlocked ? "#C9A22755" : LINE}`,
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                    style={badge.unlocked
                      ? { border: "1px solid #C9A22766", background: "#C9A22714", color: "#C9A227" }
                      : { border: `1px solid ${LINE}`, color: PARCH_DIM }}
                  >
                    {badge.unlocked ? <BadgeIcon size={20} strokeWidth={1.75} /> : <Lock size={17} strokeWidth={1.75} />}
                  </div>

                  <h4 className="font-serif text-base mb-1.5" style={{ color: badge.unlocked ? PARCHMENT : PARCH_DIM }}>
                    {badge.title}
                  </h4>
                  <p className="text-xs leading-relaxed mb-5" style={{ color: PARCH_DIM }}>{badge.description}</p>

                  {badge.unlocked ? (
                    <div
                      className="mt-auto inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded"
                      style={{ color: "#C9A227", background: "#C9A22714", border: "1px solid #C9A22740" }}
                    >
                      <CheckCircle size={12} strokeWidth={2} /> Unlocked
                    </div>
                  ) : (
                    <div className="w-full mt-auto">
                      <div className="flex justify-between text-[11px] font-mono mb-1.5" style={{ color: PARCH_DIM }}>
                        <span>{Math.min(badge.current, badge.target)}/{badge.target}</span>
                        <span>{progressPct}%</span>
                      </div>
                      <div className="h-1 w-full rounded-full overflow-hidden" style={{ background: LINE }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPct}%` }}
                          transition={{ duration: 0.6 }}
                          className="h-full"
                          style={{ background: PINE }}
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {visibleBadges.length === 0 && (
          <div className="text-center py-16" style={{ color: PARCH_DIM }}>
            <p className="text-sm">Nothing here yet — keep training and check back.</p>
          </div>
        )}

        {/* Closest badge nudge */}
        {(() => {
          const nextUp = badges
            .filter(b => !b.unlocked)
            .sort((a, b) => (b.current / b.target) - (a.current / a.target))[0];
          if (!nextUp) return null;
          return (
            <div
              className="mt-8 flex items-center justify-between gap-4 rounded-lg px-6 py-4"
              style={{ background: `${PINE}12`, border: `1px solid ${PINE}40` }}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${PINE}20`, color: PINE }}>
                  <nextUp.icon size={16} />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wide" style={{ color: PARCH_DIM }}>Closest badge</p>
                  <p className="font-serif text-sm" style={{ color: PARCHMENT }}>
                    {nextUp.title} — <span className="font-mono">{Math.min(nextUp.current, nextUp.target)}/{nextUp.target}</span>
                  </p>
                </div>
              </div>
              <ChevronRight size={18} style={{ color: PARCH_DIM }} className="hidden sm:block" />
            </div>
          );
        })()}

      </div>
    </div>
  );
};

export default Achievements;