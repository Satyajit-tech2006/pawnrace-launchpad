import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "../lib/api.js";
import { ENDPOINTS } from "../lib/endpoints.js";
import { useAuth } from "../contexts/AuthContext.jsx";
import {
  Trophy, Loader2, TrendingUp, Crown, Zap,
  ChevronLeft, ChevronRight, RefreshCw, Medal
} from "lucide-react";

/*
  Same visual family as the Student Dashboard — warm-dark background, gold
  for prestige, violet for the "energy" accent — so the Hall of Fame feels
  like part of the same game rather than a different app.
*/

const INK = "#100E1A";
const PANEL = "#181530";
const PANEL_RAISED = "#201C3D";
const LINE = "#2E2A54";
const TEXT = "#F3F0FF";
const TEXT_DIM = "#9691C4";
const GOLD = "#FFC53D";
const XP_BAR = "#7C5CFF";

const RANK_STYLE = {
  1: { tone: "#FFC53D", label: "Gold" },
  2: { tone: "#CBD5E1", label: "Silver" },
  3: { tone: "#D97757", label: "Bronze" },
};

const Avatar = ({ student, size = 48, ring }) => {
  const initial = (student?.username || student?.fullname || "?").charAt(0).toUpperCase();
  return (
    <div
      className="rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 font-black"
      style={{
        width: size, height: size,
        background: `linear-gradient(135deg, ${XP_BAR}, #FF6BD6)`,
        border: ring ? `3px solid ${ring}` : `2px solid ${LINE}`,
        fontSize: size * 0.4,
        color: "#fff",
      }}
    >
      {student?.profilePicture
        ? <img src={student.profilePicture} alt="" className="w-full h-full object-cover" />
        : initial}
    </div>
  );
};

const RowSkeleton = () => (
  <div className="flex items-center justify-between p-4 rounded-xl animate-pulse" style={{ background: PANEL, border: `1px solid ${LINE}` }}>
    <div className="flex items-center gap-4">
      <div className="w-8 h-5 rounded" style={{ background: LINE }} />
      <div className="w-11 h-11 rounded-full" style={{ background: LINE }} />
      <div className="w-32 h-4 rounded" style={{ background: LINE }} />
    </div>
    <div className="w-16 h-5 rounded" style={{ background: LINE }} />
  </div>
);

const Leaderboard = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [myStats, setMyStats] = useState(null);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [metric, setMetric] = useState("rating");

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setLoadError(false);
      const res = await apiClient.get(`${ENDPOINTS.USERS.GET_LEADERBOARD}?sortBy=${metric}&page=${pagination.currentPage}&limit=10`);
      setLeaderboard(res.data?.data?.leaderboard || []);
      setMyStats(res.data?.data?.myStats || null);
      setPagination(res.data?.data?.pagination || { currentPage: 1, totalPages: 1 });
    } catch (error) {
      console.error("Failed to load leaderboard:", error);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metric, pagination.currentPage]);

  const handleMetricChange = (newMetric) => {
    if (newMetric === metric) return;
    setMetric(newMetric);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const getDisplayScore = (student) => {
    if (!student) return 0;
    if (metric === "rating") return student.stats?.rating || 1200;
    return student.stats?.shopPoints || student.totalPoints || 0;
  };

  const isRatingMode = metric === "rating";
  const isPageOne = pagination.currentPage === 1;
  const accent = isRatingMode ? XP_BAR : GOLD;
  const unit = isRatingMode ? "ELO" : "PTS";

  const topThree = isPageOne ? leaderboard.slice(0, 3) : [];
  const restOfBoard = isPageOne ? leaderboard.slice(3) : leaderboard;

  const podiumOrder = [
    topThree[1] ? { ...topThree[1], displayRank: 2 } : null,
    topThree[0] ? { ...topThree[0], displayRank: 1 } : null,
    topThree[2] ? { ...topThree[2], displayRank: 3 } : null,
  ];

  if (loading && leaderboard.length === 0 && !loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: INK }}>
        <Loader2 className="w-12 h-12 animate-spin" style={{ color: XP_BAR }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans relative overflow-hidden flex flex-col" style={{ background: INK, color: TEXT }}>

      {/* Ambient glow, tuned to the active metric */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none transition-colors duration-700" style={{ background: `${accent}22` }} />
      <div className="fixed bottom-[10%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none transition-colors duration-700" style={{ background: `${accent}12` }} />

      {/* faint checkerboard wash across the whole page */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: `repeating-conic-gradient(${TEXT} 0% 25%, transparent 0% 50%)`, backgroundSize: "40px 40px" }}
      />

      <div className="max-w-5xl mx-auto px-4 md:px-8 pt-16 pb-40 relative z-10 w-full flex-1">

        {/* HEADER */}
        <header className="text-center space-y-5 mb-10">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 3 }}
            transition={{ type: "spring", stiffness: 120 }}
            className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto shadow-2xl"
            style={{ background: `${accent}22`, border: `1px solid ${accent}55` }}
          >
            {isRatingMode ? <TrendingUp className="w-12 h-12" style={{ color: accent }} /> : <Trophy className="w-12 h-12" style={{ color: accent }} />}
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight" style={{ color: TEXT }}>
            Hall of Fame
          </h1>
          <p className="text-sm" style={{ color: TEXT_DIM }}>Where every rating point earns its place.</p>
        </header>

        {/* METRIC TOGGLE */}
        <div className="flex justify-center mb-16 relative z-20">
          <div className="p-1.5 rounded-full flex items-center gap-1 shadow-xl" style={{ background: PANEL, border: `1px solid ${LINE}` }}>
            {[
              { key: "rating", label: "Pawn Rating", icon: TrendingUp },
              { key: "shopPoints", label: "Shop Points", icon: Zap },
            ].map(tab => {
              const active = metric === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => handleMetricChange(tab.key)}
                  className="relative flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-colors"
                  style={{ color: active ? INK : TEXT_DIM }}
                >
                  {active && (
                    <motion.div
                      layoutId="metric-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: tab.key === "rating" ? XP_BAR : GOLD }}
                      transition={{ type: "spring", stiffness: 300, damping: 28 }}
                    />
                  )}
                  <span className="relative flex items-center gap-2">
                    <tab.icon size={16} /> {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {loadError && (
          <div className="mb-10 flex items-center justify-between gap-4 rounded-xl px-5 py-3.5 max-w-2xl mx-auto" style={{ background: "#A2463214", border: "1px solid #A2463240" }}>
            <span className="text-sm" style={{ color: "#F0B4A8" }}>Couldn't load the leaderboard right now.</span>
            <button onClick={fetchLeaderboard} className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-md" style={{ background: "#A2463225", color: "#F0B4A8" }}>
              <RefreshCw size={14} /> Retry
            </button>
          </div>
        )}

        {/* PODIUM */}
        {isPageOne && !loadError && topThree.length > 0 && (
          <div className="flex justify-center items-end gap-3 md:gap-6 lg:gap-8 mt-12 mb-32 px-2 relative z-10">
            {podiumOrder.map((student, index) => {
              if (!student) return <div key={index} className="flex-1 max-w-[160px]" />;
              const style = RANK_STYLE[student.displayRank];
              const isGold = student.displayRank === 1;
              const heights = isGold ? "h-48 md:h-56" : student.displayRank === 2 ? "h-36 md:h-44" : "h-28 md:h-36";

              return (
                <motion.div
                  key={student._id}
                  initial={{ opacity: 0, y: 120 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 90, damping: 14 }}
                  className={`flex-1 flex flex-col items-center max-w-[180px] relative ${isGold ? "z-20" : "z-10"}`}
                >
                  {isGold && (
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -top-16 z-30"
                    >
                      <Crown className="w-12 h-12 drop-shadow-md" style={{ color: GOLD, fill: GOLD }} />
                    </motion.div>
                  )}
                  <div className="flex flex-col items-center mb-6 text-center w-full">
                    <Avatar student={student} size={isGold ? 96 : 72} ring={style.tone} />
                    <span className="font-black mt-4 truncate w-full">{student.username || student.fullname}</span>
                    <div className="text-sm font-black mt-1.5" style={{ color: style.tone }}>
                      {getDisplayScore(student)} {unit}
                    </div>
                  </div>
                  <div
                    className={`w-full ${heights} rounded-t-3xl border-t-2 border-x flex flex-col items-center justify-start pt-4 gap-1`}
                    style={{ background: `linear-gradient(180deg, ${style.tone}30, ${PANEL})`, borderColor: `${style.tone}55` }}
                  >
                    <Medal size={20} style={{ color: style.tone }} />
                    <span className="text-6xl font-black opacity-15">{student.displayRank}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* LIST */}
        {!loadError && (
          <div className="space-y-3 max-w-3xl mx-auto relative z-10">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <RowSkeleton key={i} />)
              : restOfBoard.map((student) => {
                  const isMe = student._id === user?._id;
                  return (
                    <motion.div
                      key={student._id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ x: 2 }}
                      className="flex items-center justify-between p-4 md:p-5 rounded-xl transition-colors"
                      style={{
                        background: isMe ? `${accent}14` : PANEL,
                        border: `1px solid ${isMe ? `${accent}55` : LINE}`,
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-9 font-black text-lg text-right" style={{ color: TEXT_DIM }}>#{student.rank}</div>
                        <Avatar student={student} size={44} />
                        <h3 className="font-bold">{student.username || student.fullname}</h3>
                        {isMe && (
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full" style={{ background: `${accent}25`, color: accent }}>
                            You
                          </span>
                        )}
                      </div>
                      <div className="font-black text-lg flex items-center gap-1.5">
                        {getDisplayScore(student)} <span className="text-xs font-semibold" style={{ color: TEXT_DIM }}>{unit}</span>
                      </div>
                    </motion.div>
                  );
                })}

            {!loading && restOfBoard.length === 0 && topThree.length === 0 && (
              <div className="text-center py-16" style={{ color: TEXT_DIM }}>
                No players on the board yet — be the first to set a score.
              </div>
            )}
          </div>
        )}

        {/* PAGINATION */}
        {pagination.totalPages > 1 && !loadError && (
          <div className="flex justify-center items-center gap-6 mt-12 relative z-10">
            <button
              disabled={pagination.currentPage === 1}
              onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
              className="p-2 rounded-full transition-colors disabled:opacity-30"
              style={{ background: PANEL, border: `1px solid ${LINE}` }}
            >
              <ChevronLeft size={22} />
            </button>
            <span className="font-bold text-sm" style={{ color: TEXT_DIM }}>
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              disabled={pagination.currentPage === pagination.totalPages}
              onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
              className="p-2 rounded-full transition-colors disabled:opacity-30"
              style={{ background: PANEL, border: `1px solid ${LINE}` }}
            >
              <ChevronRight size={22} />
            </button>
          </div>
        )}
      </div>

      {/* STICKY MY STATS BAR */}
      {myStats && (
        <div className="fixed bottom-0 left-0 right-0 backdrop-blur-xl p-5 z-50" style={{ background: "#100E1AE6", borderTop: `1px solid ${LINE}` }}>
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center font-black text-lg"
                style={{ border: `2px solid ${accent}66`, color: accent }}
              >
                #{myStats.rank}
              </div>
              <div>
                <div className="text-xs uppercase font-black mb-1" style={{ color: TEXT_DIM }}>Your Global Rank</div>
                <div className="font-bold text-sm">{myStats.rank === 1 ? "You're the champion!" : "Keep climbing!"}</div>
              </div>
            </div>
            <div className="text-2xl font-black" style={{ color: accent }}>
              {getDisplayScore(myStats)} <span className="text-sm" style={{ color: TEXT_DIM }}>{unit}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;