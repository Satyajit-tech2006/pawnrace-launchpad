import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import DashboardNavbar from "../../../components/Dashbordnavbar";
import { 
  Zap, Palette, Lock, CheckCircle, 
  Search, Sparkles, Crown, Flame
} from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import apiClient from "../../../lib/api";
import { ENDPOINTS } from "../../../lib/endpoints.js";

/* =============================================================================
   THEME — "Tournament Hall"
============================================================================= */
const INK            = "#0A0806"; 
const PANEL          = "#1A1510"; 
const PANEL_RAISED   = "#241D16"; 
const LINE           = "#3B301F"; 
const TEXT           = "#F2E9D6"; 
const TEXT_DIM       = "#A4937A"; 
const TEXT_FAINT     = "#6E624E";
const GOLD           = "#D4AF37"; 
const GOLD_BRIGHT    = "#F3E5AB";
const EMERALD        = "#2E5C40";

const FONT_DISPLAY = "'Fraunces', 'Iowan Old Style', Georgia, serif";
const FONT_BODY    = "'Inter', -apple-system, sans-serif";
const FONT_MONO    = "'IBM Plex Mono', 'SF Mono', monospace";

const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
  `}</style>
);

/* =============================================================================
   INVENTORY CATALOG - SKINS & GAMIFIED ASSETS
============================================================================= */
const SHOP_ITEMS = [
  { id: "basic", title: "Tournament Standard", desc: "The classic academy piece set and board. Reliable and clear.", price: 0, category: "cosmetic", icon: Palette, color: "#8B806B" },
  { id: "obsidian_glass", title: "Obsidian Glass", desc: "A sleek, premium dark theme for your playing arena. Zero distractions.", price: 500, category: "cosmetic", icon: Sparkles, color: "#4A6FA5" },
  { id: "walnut_ivory", title: "Walnut & Ivory", desc: "Weighted wooden piece graphics with deep mahogany squares.", price: 300, category: "cosmetic", icon: Palette, color: GOLD },
  { id: "emerald_marble", title: "Emerald Marble", desc: "Cold, polished stone. For the calculating tactician.", price: 600, category: "cosmetic", icon: Crown, color: EMERALD },
  { id: "arcane_void", title: "Arcane Void", desc: "Infused with mystical energy. Features an embedded slow-rotating sigil.", price: 1200, category: "cosmetic", icon: Sparkles, color: "#8B5CF6" },
  { id: "cyber_syndicate", title: "Cyber Syndicate", desc: "A high-tech digital grid layout with an ambient cyber pulse.", price: 1500, category: "cosmetic", icon: Flame, color: "#00FFCC" },
];

/* ------------------------------ BACKGROUND ------------------------------ */
const VaultTexture = () => (
  <div 
    className="absolute inset-0 pointer-events-none select-none z-0" 
    style={{
      backgroundImage: `linear-gradient(${LINE} 1px, transparent 1px), linear-gradient(90deg, ${LINE} 1px, transparent 1px)`,
      backgroundSize: '64px 64px',
      opacity: 0.05,
      maskImage: 'radial-gradient(circle at 50% 10%, black, transparent 80%)',
      WebkitMaskImage: 'radial-gradient(circle at 50% 10%, black, transparent 80%)'
    }}
  />
);

export default function Shop() {
  const { user, setUser } = useAuth();
  const [activeCategory, setActiveCategory] = useState("all");
  
  const [localWallet, setLocalWallet] = useState(0);
  const [localInventory, setLocalInventory] = useState(["basic"]);
  const [localEquipped, setLocalEquipped] = useState("basic");
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    if (user) {
      setLocalWallet(user.stats?.shopPoints || user.totalPoints || 0);
      setLocalInventory(user.inventory || ["basic"]);
      setLocalEquipped(user.equippedBoardSkin || "basic");
    }
  }, [user]);

  const filteredItems = SHOP_ITEMS.filter(item => activeCategory === "all" || item.category === activeCategory);

  const handleAction = async (item) => {
    const isOwned = localInventory.includes(item.id);
    const isEquipped = localEquipped === item.id;

    if (isEquipped || processingId) return;
    
    setProcessingId(item.id);
    
    try {
      if (isOwned) {
        // ================= EQUIP FLOW =================
        const res = await apiClient.post(ENDPOINTS.SHOP.EQUIP, { itemId: item.id });
        if (res.data.success) {
          const newSkin = res.data.equippedBoardSkin;
          setLocalEquipped(newSkin); 
          
          if (setUser) {
            setUser(prev => {
              const updatedUser = { ...prev, equippedBoardSkin: newSkin };
              localStorage.setItem("user", JSON.stringify(updatedUser)); 
              return updatedUser;
            });
          }
        }
      } else {
        // ================= BUY FLOW =================
        if (localWallet < item.price) return;
        
        const res = await apiClient.post(ENDPOINTS.SHOP.BUY, { itemId: item.id });
        if (res.data.success) {
          const newWallet = res.data.wallet;
          const newInventory = res.data.inventory;
          
          setLocalWallet(newWallet);
          setLocalInventory(newInventory);

          if (setUser) {
            setUser(prev => {
              const updatedUser = {
                ...prev,
                inventory: newInventory,
                stats: { ...prev.stats, shopPoints: newWallet }
              };
              localStorage.setItem("user", JSON.stringify(updatedUser)); 
              return updatedUser;
            });
          }
        }
      }
    } catch (error) {
      console.error("Transaction failed:", error);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen w-full relative overflow-hidden" style={{ background: INK, color: TEXT, fontFamily: FONT_BODY }}>
        <FontLoader />
        <VaultTexture />
        <DashboardNavbar />

        <main className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-24">
          
          {/* ============================ HEADER & WALLET ============================ */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] mb-2 font-bold" style={{ color: GOLD, fontFamily: FONT_MONO }}>
                Academy Requisitions
              </p>
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-3" style={{ fontFamily: FONT_DISPLAY, color: TEXT }}>
                The Vault
              </h1>
              <p className="text-sm max-w-lg leading-relaxed" style={{ color: TEXT_DIM }}>
                Exchange the points earned from tactical grinding for exclusive board themes to customize your playing arena.
              </p>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 rounded-2xl p-5 shadow-2xl flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${PANEL_RAISED}, ${PANEL})`, border: `1px solid ${GOLD}40`, boxShadow: `0 10px 30px -10px rgba(0,0,0,0.8), inset 0 2px 10px rgba(0,0,0,0.5)` }}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-inner" style={{ background: `${GOLD}1A`, border: `1px solid ${GOLD}40` }}>
                <Zap size={20} color={GOLD} fill={GOLD} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: TEXT_FAINT }}>Available Balance</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold" style={{ color: GOLD, fontFamily: FONT_MONO }}>{localWallet}</span>
                  <span className="text-xs font-bold uppercase tracking-widest" style={{ color: TEXT_DIM }}>pts</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ============================ FILTERS ============================ */}
          <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
            {[
              { id: "all", label: "All Assets", icon: Search },
              { id: "cosmetic", label: "Themes & Boards", icon: Palette },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors focus:outline-none flex-shrink-0"
                style={{
                  background: activeCategory === tab.id ? `${GOLD}15` : PANEL,
                  color: activeCategory === tab.id ? GOLD_BRIGHT : TEXT_DIM,
                  border: `1px solid ${activeCategory === tab.id ? `${GOLD}55` : LINE}`,
                }}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* ============================ INVENTORY GRID ============================ */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => {
                const isOwned = localInventory.includes(item.id);
                const isEquipped = localEquipped === item.id;
                const canAfford = localWallet >= item.price;
                const isProcessing = processingId === item.id;

                let btnStyle = { bg: INK, color: TEXT_FAINT, border: LINE, cursor: "not-allowed" };
                let btnContent = <><Lock size={14} /> Insufficient Funds</>;

                if (isProcessing) {
                  btnContent = <span className="animate-pulse">Authorizing...</span>;
                } else if (isEquipped) {
                  btnStyle = { bg: `${EMERALD}20`, color: EMERALD, border: `${EMERALD}50`, cursor: "default" };
                  btnContent = <><CheckCircle size={14} /> Equipped</>;
                } else if (isOwned) {
                  btnStyle = { bg: PANEL_RAISED, color: TEXT, border: LINE, cursor: "pointer" };
                  btnContent = "Equip Item";
                } else if (canAfford) {
                  btnStyle = { bg: `linear-gradient(to bottom, ${GOLD}, ${GOLD_BRIGHT})`, color: INK, border: "#FFF2B2", cursor: "pointer" };
                  btnContent = <><Sparkles size={14} /> Requisition</>;
                }

                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}
                    key={item.id}
                    className="flex flex-col rounded-2xl p-6 shadow-lg"
                    style={{ background: PANEL, border: `1px solid ${isEquipped ? `${GOLD}50` : LINE}` }}
                  >
                    <div className="flex justify-between items-start mb-5">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-inner" style={{ background: `${item.color}15`, border: `1px solid ${item.color}40`, color: item.color }}>
                        <item.icon size={22} strokeWidth={1.8} />
                      </div>
                      
                      {!isOwned && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md" style={{ background: INK, border: `1px solid ${LINE}` }}>
                          <Zap size={12} color={canAfford ? GOLD : TEXT_FAINT} fill={canAfford ? GOLD : "none"} />
                          <span className="text-xs font-bold" style={{ color: canAfford ? GOLD : TEXT_DIM, fontFamily: FONT_MONO }}>
                            {item.price}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mb-8 flex-1">
                      <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: FONT_DISPLAY }}>{item.title}</h3>
                      <p className="text-[13px] leading-relaxed" style={{ color: TEXT_DIM }}>{item.desc}</p>
                    </div>

                    <button
                      disabled={isEquipped || (!isOwned && !canAfford) || isProcessing}
                      onClick={() => handleAction(item)}
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-transform active:scale-[0.98]"
                      style={{
                        background: btnStyle.bg,
                        color: btnStyle.color,
                        border: `1px solid ${btnStyle.border}`,
                        cursor: btnStyle.cursor
                      }}
                    >
                      {btnContent}
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

        </main>
      </div>
    </MotionConfig>
  );
}