import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Users, Clock, Target, ChevronRight, Trophy, Zap, ShieldCheck, Microscope, Layers, Brain, Swords, MessageSquare, Repeat, Search, Activity, BarChart3, Star } from "lucide-react";

const curriculumData = {
  beginner: {
    title: "Beginner Level",
    rating: "Below 1000",
    accent: "yellow",
    gradient: "from-blue-600/20 via-[#0f1e47] to-[#050a1f]",
    plans: {
      "1 Month": {
        sessions: 10,
        headerStats: [
          { label: "Total Sessions", val: "10" },
          { label: "Core Learning", val: "8" },
          { label: "Special Training", val: "2" }
        ],
        target: "Play structured chess, understand tactics, and apply principles with confidence.",
        modules: [
          { title: "Session 1: Introduction", points: ["Chessboard setup", "Piece names & values", "Basic movement rules", "Understanding capturing"] },
          { title: "Session 2: Piece Mastery", points: ["Legal vs Illegal moves", "Capturing exercises", "Revision of movement", "Simple practice games"] },
          { title: "Session 3: Safety & Hanging Pieces", points: ["Hanging piece identification", "Unsafe square recognition", "Finding safe landing squares", "Puzzle-based practice"] },
          { title: "Session 4: Protection & Defense", points: ["Techniques to defend pieces", "Attacking vs. Defending", "Piece coordination basics", "Real-board puzzle solving"] },
          { title: "Session 5: Opening Principles", points: ["Controlling the center", "Developing minor pieces", "Castling & King safety", "Avoiding early Queen blunders"] },
          { title: "Session 6: Basic Checkmates", points: ["Ladder Mate (Rook Mate)", "Checkmate patterns", "Visualization exercises", "Pattern practice"] },
          { title: "Session 7: Queen Checkmate", points: ["King + Queen vs King", "Step-by-step technique", "Practical mating drills", "Opposition concepts"] },
          { title: "Session 8: Pawn Endgames", points: ["Pawn race concept", "Promotion strategies", "Endgame calculation", "Practical exercises"] }
        ],
        specialSessions: [
          { title: "Session 9: Training Session", desc: "Practical training games with live analysis. Focus on applying principles and identifying common beginner mistakes." },
          { title: "Session 10: Test & Dubts", desc: "Tactical evaluation (Mate in 1, Threats). Doubt clearing and personalized performance feedback." }
        ],
        benefits: "Participate in weekly online tournaments to improve time management, tactical awareness, and competitive confidence in a real-game environment."
      },
      "3 Months": {
        sessions: 30,
        stats: { core: 24, tournaments: 12, doubts: 3 },
        target: "Mastery of tactical patterns and structured planning, leading to a projected rating of 1200+ on Lichess Rapid.",
        modules: [
          { title: "1. Chess Fundamentals", points: ["Advanced Piece Movement & Captures", "Square Control: Safe vs. Unsafe", "Protection & Piece Coordination", "Special Rules (En Passant, Castling)"] },
          { title: "2. Opening Mastery", points: ["Center Control & Fundamental Dev.", "King Safety & Strategic Castling", "Early Tactics & Trap Avoidance", "Development Efficiency"] },
          { title: "3. Tactical Weapons", points: ["Forks (Double Attacks)", "Discovered Attacks & Double Checks", "Skewers & Pins", "Basic Tactical Combinations"] },
          { title: "4. Game Phases & Strategy", points: ["Transitioning (Opening to Middlegame)", "Understanding Middlegame Objectives", "Endgame Transition Principles", "Whole-game planning"] },
          { title: "5. Checkmate Patterns", points: ["Ladder (Heavy Piece) Mates", "Essential Queen & Minor Piece Mates", "Mate in 1 & Mate in 2 Drills", "Threatmate Recognition"] },
          { title: "6. Endgame Technique", points: ["The Pawn Race & Promotion Speed", "King Activity in the Endgame", "Basic King & Pawn Drills", "Converting Winning Material"] }
        ],
        appliedLearning: [
          { icon: <Swords size={20} />, title: "Training (3)", desc: "Live practice games with instant coach analysis and decision-making feedback." },
          { icon: <Brain size={20} />, title: "Evaluation (3)", desc: "Monthly formal tests covering tactical puzzles, positions, and theoretical knowledge." },
          { icon: <MessageSquare size={20} />, title: "Weekly Doubt Clearing", desc: "Personalized support sessions to fix recurring mistakes and clarify complex concepts." }
        ]
      },
      "6 Months": {
        sessions: 60,
        stats: { core: 48, tournaments: 24, trainTest: "6+6" },
        target: "Empowering Minds Through Strategic Excellence. Targeting a projected rating of 1600+ on Lichess Rapid.",
        modules: [
          { title: "I. Strategic Openings", points: ["Center Control & Rapid Mobilization", "King Safety Protocols (Castling Logic)", "Error Analysis & Trap Prevention", "Custom Opening Repertoire Plans"] },
          { title: "II. Tactical Mastery", points: ["Forks, Skewers & Discovered Attacks", "The Woodpecker Method (Pattern Recognition)", "Candidate Move Identification", "Double Checks & Advanced Combinations"] },
          { title: "III. Advanced Endgames", points: ["Rook Endgame Fundamental Theory", "Opposition, Triangulation & Outflanking", "Dvoretsky Method Fundamentals", "Pawn Race & Wing Strategy"] },
          { title: "IV. Calculation & Logic", points: ["Systematic Calculation Techniques", "Prophylactic Thinking (Opponent's Ideas)", "Positional Planning in the Middlegame", "Visualization Depth Exercises"] }
        ],
        methodology: [
          { icon: <Repeat size={20} />, title: "The Woodpecker Method", desc: "Intensive tactical solving to burn patterns into the subconscious for lightning-fast pattern recognition." },
          { icon: <Search size={20} />, title: "Game Reconstruction", desc: "In-depth analysis of the student's tournament games to identify psychological and technical weaknesses." },
          { icon: <Activity size={20} />, title: "Doubt-Clearing Ecosystem", desc: "Weekly dedicated support classes ensuring no concept is left misunderstood before progressing." }
        ],
        competitiveEdge: "Integrated tournament play builds Time Management, Emotional Resilience, and Practical Application of theoretical knowledge. Students learn to handle pressure in a real-world competitive environment."
      }
    }
  },
  intermediate: {
    title: "Intermediate Level",
    rating: "1000 - 1500",
    accent: "purple",
    gradient: "from-purple-900/30 via-[#0f1e47] to-[#050a1f]",
    plans: {
      "1 Month": {
        sessions: 10,
        target: "Rapid identification of tactical motifs, expanded visualization depth, and the ability to execute forcing checkmate combinations with precision.",
        modules: [
          { title: "S1: Tactical Foundations", points: ["Philosophy of Calculation", "Identifying Tactical Triggers", "Pattern Scanning Methods"] },
          { title: "S2: Fork & Double Attack", points: ["Knight & Pawn Fork Motifs", "Coordination of Pieces", "Escaping Defensive Forks"] },
          { title: "S3: Simultaneous Targets", points: ["Identifying Weak Squares/Pieces", "Dual Threat Geometry", "Overloading Defenders"] },
          { title: "S4: Discovered Attacks", points: ["The 'Windmill' Concept", "Creating Hidden Batteries", "Discovered Checks & Wins"] },
          { title: "S5: Power of Double Check", points: ["Forcing King Exposure", "Calculation without Response", "Tactical Combinations"] },
          { title: "S6: Execution & Combos", points: ["Multi-step Combinations", "Calculation Under Pressure", "Efficiency in Execution"] },
          { title: "S7: Essential Mating Nets", points: ["Smothered & Anastasia's Mate", "Back-Rank & Corridor Mates", "Pattern Finalization"] },
          { title: "S8: Intensive Calculation", points: ["Mixed Puzzle Simulation", "Visualization Depth Drills", "Pattern Recognition Speed"] }
        ],
        evaluationSessions: [
          { title: "Training Session (S9)", desc: "Full-game simulation against the coach. Focused on real-time tactical identification and high-pressure game analysis." },
          { title: "Final Evaluation (S10)", desc: "Tactical efficiency test & mate pattern identification. Includes a comprehensive performance feedback report." }
        ],
        tags: ["Forks", "Discovered Checks", "Complex Calculation", "Mating Patterns"]
      },
      "3 Months": {
        sessions: 30,
        stats: { sessions: 30, tournaments: 24, doubt: "Weekly", target: "1800+" },
        target: "Developing the ability to analyze positions independently and execute tactics with surgical precision.",
        modules: [
          { title: "I. High-Level Tactical Patterns", points: ["Advanced Forks: Checkmate Motifs & Loose Pieces", "The Art of the Pin: Attacking & Neutralizing", "Complex Discovered Attacks & Batteries", "Double Checks & Forcing Combinations", "Pattern Recognition Repetition Training"] },
          { title: "II. Checkmate Encyclopedia", points: ["Classical Mates: Arabian, Boden's, and Opera", "Geometric Patterns: Anastasia's & Smothered", "Rare Motifs: Epaulette, Dovetail, and Hook Mates", "Forced Mating Sequences in the Middlegame"] },
          { title: "III. Strategic & Positional Depth", points: ["The Italian Game: Structural Mastery for both sides", "Counter-Attack Theory & Neutralization", "Piece Trade Logic: When to simplify vs. complicate", "Checks, Captures, & Threats (CCT) Framework", "Practical Opening Traps & Gambit Refutations"] },
          { title: "IV. Endgame Theory & Technique", points: ["Pawn Mastery: Rule of Square & Key Squares", "Opposition: Direct, Diagonal, and Distant", "Queen vs. 7th Rank Pawn Defenses", "Rook Endgame Fundamentals & Dvoretsky Methods", "Converting material advantages into wins"] }
        ],
        eliteResources: [
          { icon: <Repeat size={20} />, title: "The Woodpecker Method", desc: "Intensive tactical repetition designed to automate pattern recognition and speed." },
          { icon: <Star size={20} />, title: "Classical Game Analysis", desc: "Studying masterpiece games like 'The Game of the Century' and 'The Immortal Game'." },
          { icon: <Target size={20} />, title: "Candidate Move Technique", desc: "Building a rigorous calculation tree for deep and accurate visualization." }
        ],
        performanceBanner: "Beginner → Intermediate → Advanced → Tournament Pro"
      },
      "6 Months": {
        sessions: 60,
        target: "Tournament Ready / 1900+ Rating",
        modules: [
          { title: "I. Advanced Tactical Arsenal", points: ["Deflection & Decoy", "Zwischenzug", "Clearance Sacrifices", "Desperado"] },
          { title: "II. Elite Mating Patterns", points: ["Hook Mate", "Advanced Back Rank", "Attacking King Safety Protocols"] },
          { title: "III. Strategic Fundamentals", points: ["Prophylaxis: Preventive Thinking", "Weak Squares & Outpost Creation", "Good vs. Bad Bishop Imbalances"] },
          { title: "IV. Advanced Competition", points: ["IQP Dynamics", "Hanging & Backward Pawns", "Opening & Repertoire Analysis"] }
        ]
      }
    }
  },
  advanced: {
    title: "Advanced Level",
    rating: "1500+",
    accent: "orange",
    gradient: "from-orange-900/20 via-[#0f1e47] to-[#050a1f]",
    plans: {
      "1 Month": {
        sessions: 10,
        target: "Master complex tactical combinations & Blitz efficiency.",
        modules: [
          { title: "01. Tactical Awareness", points: ["Scanning Loose Pieces", "Structural Triggers", "Prophylaxis"] },
          { title: "02. Fork Mastery", points: ["Knight, Queen, Pawn Forks", "Checkmate Forks"] },
          { title: "04. Art of the Pin", points: ["Absolute vs Relative Pins", "Applied Pin Pressure"] },
          { title: "06. Skewers & Double Checks", points: ["Long-range Skewers", "Devastating Double Checks"] },
          { title: "08. Advanced Mating", points: ["Anastasia's Mate", "Pattern Recognition speed-drill"] }
        ]
      },
      "3 Months": {
        sessions: 30,
        target: "1800+ Rating & Advanced Competition Ready",
        modules: [
          { title: "I. Elite Tactical Weapons", points: ["Calculation Loops", "Desperado & Swindle Motifs", "Exchange Sacrifice Optimization"] },
          { title: "II. Advanced Attack", points: ["Greek Gift Destruction", "7th Rank Batteries", "Pawn Storms"] },
          { title: "III. Positional Evaluation", points: ["Principle of Two Weaknesses", "Static vs Dynamic Imbalances"] },
          { title: "IV. Opening Transpositions", points: ["English & Reti Infrastructure", "Hypermodern Logic"] }
        ]
      },
      "6 Months": {
        sessions: 60,
        target: "2000+ Lichess Rapid & FIDE Preparedness",
        modules: [
          { title: "Tactical Elite & Structure", points: ["Knight & Bishop Specialist Calculations", "Pawn Wedge & Perpetual Check", "Exchange Sacrifice & Counter-Threats"] },
          { title: "Positional Depth", points: ["Static vs. Dynamic Evaluations", "Minority Attack & Game of Tension", "Opposite Colored Bishop Strategies"] },
          { title: "Endgame & Opening Mastery", points: ["Complex Rook Endgame Theory", "Advanced Pawn Endings (Dvoretsky)", "Albin Countergambit & Fantasy Depth"] },
          { title: "Elite Analysis Training", points: ["Woodpecker Pattern Drills", "Post-Mortem: Strategic Mistake Correction", "Candidate Move & Calculation Trees", "Database & Engine Workflow Mastery"] }
        ]
      }
    }
  }
};

const Curriculum = () => {
  const [activeLevel, setActiveLevel] = useState("beginner");
  const [activePlan, setActivePlan] = useState("1 Month");

  const currentLevel = curriculumData[activeLevel];
  const currentPlan = currentLevel.plans[activePlan];

  const getAccentColor = () => {
    if (activeLevel === "beginner") return "text-yellow-400";
    if (activeLevel === "intermediate") return "text-purple-400";
    return "text-orange-400";
  };

  const getBgAccent = () => {
    if (activeLevel === "beginner") return "bg-yellow-400";
    if (activeLevel === "intermediate") return "bg-purple-400";
    return "bg-orange-400";
  };

  // WhatsApp Integration Logic
  const handleWhatsAppRedirect = () => {
    const phoneNumber = "8984021185";
    const message = `Hello Madhu, I want to book a free trial for the ${currentLevel.title} (${activePlan}) chess coaching program.`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className={`min-h-screen transition-colors duration-1000 bg-gradient-to-br ${currentLevel.gradient} text-white px-4 py-16`}>
      
      {/* Header */}
      <div className="max-w-6xl mx-auto text-center mb-16">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter uppercase">
            Chess <span className={getAccentColor()}>Expertise</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto italic uppercase tracking-widest opacity-60">
            Professional Individual Coaching Program
          </p>
        </motion.div>
      </div>

      {/* Level Tabs */}
      <div className="max-w-4xl mx-auto flex p-1 bg-white/5 backdrop-blur-md rounded-full border border-white/10 mb-12">
        {Object.keys(curriculumData).map((lvl) => (
          <button
            key={lvl}
            onClick={() => { setActiveLevel(lvl); setActivePlan("1 Month"); }}
            className={`relative flex-1 py-4 rounded-full font-bold text-sm transition-colors duration-300 z-10 uppercase ${
              activeLevel === lvl ? "text-[#050a1f]" : "text-gray-400 hover:text-white"
            }`}
          >
            {activeLevel === lvl && (
              <motion.div layoutId="activeTab" className={`absolute inset-0 ${getBgAccent()} rounded-full -z-10`} transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
            )}
            {curriculumData[lvl].title}
          </button>
        ))}
      </div>

      {/* Plan Selection Buttons */}
      <div className="max-w-md mx-auto flex justify-center gap-3 mb-16 bg-white/5 p-1.5 rounded-2xl border border-white/10">
        {["1 Month", "3 Months", "6 Months"].map((plan) => (
          <button
            key={plan}
            onClick={() => setActivePlan(plan)}
            className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${activePlan === plan ? `${getBgAccent()} text-[#050a1f] shadow-lg` : "text-gray-500 hover:text-white"}`}
          >
            {plan}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        <motion.div key={`${activeLevel}-${activePlan}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }} className="max-w-6xl mx-auto">
          
          {/* Target Focus Section */}
          <div className="mb-12 p-10 rounded-[40px] bg-white/5 border border-white/10 backdrop-blur-xl relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-64 h-64 ${getBgAccent()} opacity-5 blur-[80px] rounded-full`} />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
               {activeLevel === "beginner" && activePlan === "1 Month" ? (
                  currentPlan.headerStats.map((stat, i) => (
                    <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/10 text-center">
                      <p className={`text-3xl font-black ${getAccentColor()}`}>{stat.val}</p>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{stat.label}</p>
                    </div>
                  ))
               ) : activeLevel === "intermediate" && activePlan === "3 Months" ? (
                  <>
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-center">
                      <p className={`text-3xl font-black ${getAccentColor()}`}>30</p>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Sessions</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-center">
                      <p className={`text-3xl font-black ${getAccentColor()}`}>24</p>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Tournaments</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-center">
                      <p className={`text-3xl font-black ${getAccentColor()}`}>Weekly</p>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Doubt-Clearing</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-center">
                      <p className={`text-3xl font-black ${getAccentColor()}`}>1800+</p>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Target Rating</p>
                    </div>
                  </>
               ) : (activePlan === "6 Months" || activePlan === "3 Months") && (
                 <>
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-center">
                      <p className={`text-3xl font-black ${getAccentColor()}`}>{activePlan === "6 Months" ? '60' : '30'}</p>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Sessions</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-center">
                      <p className={`text-3xl font-black ${getAccentColor()}`}>{activePlan === "6 Months" ? '48' : '24'}</p>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{activePlan === "6 Months" ? 'Clinics' : 'Core'}</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-center">
                      <p className={`text-3xl font-black ${getAccentColor()}`}>{activePlan === "6 Months" ? '24' : '12'}</p>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Tournaments</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-center">
                      <p className={`text-3xl font-black ${getAccentColor()}`}>{activePlan === "6 Months" ? '6+6' : '3'}</p>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{activePlan === "6 Months" ? 'Train & Test' : 'Doubt Support'}</p>
                    </div>
                 </>
               )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left">
              <div className="md:col-span-2">
                <div className="flex items-center gap-2 mb-4 justify-center md:justify-start">
                   <Trophy className={getAccentColor()} size={24} /> 
                   <span className="text-xs font-black tracking-widest uppercase opacity-60">Objective Goal</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black leading-tight tracking-tight uppercase">{currentPlan.target}</h2>
              </div>
              <div className="bg-white/5 p-6 rounded-3xl border border-white/10 text-center">
                 <p className="text-gray-400 text-xs font-bold uppercase mb-1">Recommended Rating</p>
                 <p className={`text-4xl font-black ${getAccentColor()}`}>{currentLevel.rating}</p>
                 <div className="flex items-center justify-center gap-2 mt-3 text-gray-300">
                    <Clock size={16} /> <span className="text-sm font-bold tracking-tighter uppercase">{currentPlan.sessions} Classes</span>
                 </div>
              </div>
            </div>
          </div>

          {/* Core Modules Section */}
          <div className="mb-16">
            <h3 className={`text-2xl font-black mb-8 flex items-center gap-3 uppercase tracking-wider ${getAccentColor()}`}>
              <Layers size={28} /> Core Learning Curriculum
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {currentPlan.modules.map((module, idx) => (
                <motion.div key={idx} whileHover={{ y: -8 }} className="relative bg-white/5 p-8 rounded-[35px] border border-white/10 group hover:border-white/20 transition-all overflow-hidden">
                  <div className="absolute -top-4 -right-4 text-8xl font-black text-white/[0.03] group-hover:text-white/[0.07] transition-colors pointer-events-none">
                    {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                  </div>
                  <div className={`w-10 h-10 rounded-xl ${getBgAccent()} bg-opacity-10 flex items-center justify-center mb-6`}>
                     <BookOpen className={getAccentColor()} size={18} />
                  </div>
                  <h3 className="text-lg font-bold mb-4 z-10 relative leading-tight uppercase tracking-tighter">{module.title}</h3>
                  <ul className="space-y-2 z-10 relative text-gray-400 text-[11px] leading-relaxed">
                    {module.points.map((p, i) => (
                      <li key={i} className="flex items-start gap-2 group-hover:text-gray-300 transition-colors">
                        <Zap className={`${getAccentColor()} mt-1 flex-shrink-0`} size={10} /> {p}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>

          {/* BEGINNER 1-MONTH SPECIFIC */}
          {activeLevel === "beginner" && activePlan === "1 Month" && (
             <>
               {currentPlan.specialSessions && (
                  <div className="mb-16">
                    <h3 className={`text-2xl font-black mb-8 flex items-center gap-3 uppercase tracking-wider ${getAccentColor()}`}>
                      <Microscope size={28} /> Special Coaching Sessions
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {currentPlan.specialSessions.map((s, i) => (
                        <div key={i} className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 p-10 rounded-[40px] backdrop-blur-sm">
                          <h4 className="text-2xl font-bold mb-4">{s.title}</h4>
                          <p className="text-gray-400 text-base leading-relaxed">{s.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
               )}
               {currentPlan.benefits && (
                  <div className="mt-12 p-10 rounded-[40px] bg-green-500/5 border border-green-500/20 flex flex-col md:flex-row items-center gap-8">
                    <ShieldCheck className="text-green-400" size={60} />
                    <div>
                      <h4 className="text-green-400 font-black text-xl mb-2 tracking-wider uppercase italic">Additional Benefits: 4 Monthly Practice Tournaments</h4>
                      <p className="text-gray-400 text-sm leading-relaxed italic">{currentPlan.benefits}</p>
                    </div>
                  </div>
               )}
             </>
          )}

          {/* Intermediate 3-Month Specific methodology */}
          {activeLevel === "intermediate" && activePlan === "3 Months" && currentPlan.eliteResources && (
            <div className="mb-16">
               <h3 className={`text-2xl font-black mb-8 flex items-center gap-3 uppercase tracking-wider ${getAccentColor()}`}>
                <Star size={28} /> Training Methodology & Elite Resources
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {currentPlan.eliteResources.map((res, i) => (
                   <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-[35px] backdrop-blur-sm text-center">
                      <div className={`w-12 h-12 rounded-2xl mx-auto mb-5 flex items-center justify-center ${getBgAccent()} text-[#050a1f]`}>{res.icon}</div>
                      <h4 className="text-xl font-bold mb-3 uppercase tracking-tighter">{res.title}</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">{res.desc}</p>
                   </div>
                 ))}
              </div>
              <div className="mt-10 p-10 rounded-[40px] bg-white/5 border border-white/10 text-center">
                 <h4 className={`text-3xl font-black mb-2 ${getAccentColor()}`}>Target Performance: 1800+ Lichess Rapid</h4>
                 <p className="text-gray-400 font-black text-xs uppercase tracking-[0.3em] mb-6">Beginner → Intermediate → <span className={getAccentColor()}>Advanced</span> → Tournament Pro</p>
                 <p className="text-gray-300 text-lg italic font-medium max-w-2xl mx-auto leading-relaxed">"Developing the ability to analyze positions independently and execute tactics with surgical precision."</p>
              </div>
            </div>
          )}

          {/* Special Action Button Section (WhatsApp Integration) */}
          <div className={`mt-20 p-1 rounded-[45px] bg-gradient-to-r ${activeLevel === 'beginner' ? 'from-yellow-400 to-yellow-600' : activeLevel === 'intermediate' ? 'from-purple-500 to-purple-700' : 'from-orange-500 to-orange-700'}`}>
            <div className="bg-[#050a1f] px-10 py-16 rounded-[42px] flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
              <div>
                <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter uppercase italic leading-none">Unlock Expert <br/> Coaching</h2>
                <p className="text-gray-400 text-lg font-medium uppercase tracking-[0.2em] opacity-80">Slots available for new cohort enrollment.</p>
              </div>
              <button 
                onClick={handleWhatsAppRedirect}
                className={`${getBgAccent()} text-[#050a1f] px-16 py-6 rounded-2xl font-black text-xl hover:scale-105 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.4)] active:scale-95 whitespace-nowrap uppercase tracking-widest`}
              >
                Book Trial
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Footer Ecosystem */}
      <div className="mt-40 max-w-6xl mx-auto border-t border-white/5 pt-20 text-center">
         <h2 className="text-4xl md:text-5xl font-black mb-20 flex items-center justify-center gap-6 uppercase tracking-tighter">
            <Users size={50} className={getAccentColor()} /> Training Ecosystem
         </h2>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: "Live Analysis", desc: "Practical training games with real-time coach feedback and post-mortem analysis sessions." },
              { title: "Pattern Recognition", desc: "Systematic Woodpecker method integration to burn tactical motifs into your muscle memory." },
              { title: "Doubt Clearing", desc: "Dedicated 1-on-1 support to fix recurring strategic mistakes and clarify advanced theory." }
            ].map((item, i) => (
              <div key={i} className="p-10 rounded-[40px] bg-white/5 border border-white/5 hover:bg-white/[0.08] transition-all duration-500 group">
                <h4 className={`font-black text-2xl mb-5 uppercase tracking-tighter ${getAccentColor()} group-hover:scale-110 transition-transform`}>{item.title}</h4>
                <p className="text-gray-500 text-base leading-relaxed">{item.desc}</p>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default Curriculum;
