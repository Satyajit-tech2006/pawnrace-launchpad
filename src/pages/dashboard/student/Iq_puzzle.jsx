import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { 
    Brain, Eye, Bomb, Camera, Search, Play, 
    Trophy, X, Timer, Zap, Loader2, ArrowLeft, Target, LogOut, Info, Crown, Route
} from "lucide-react";
import apiClient from "../../../lib/api.js";
import { ENDPOINTS } from "../../../lib/endpoints.js";
import { toast } from "sonner";
import { useAuth } from "../../../contexts/AuthContext.jsx";

// --- GAME MODES CONFIG ---
const MODES = [
    { id: 'vision', name: 'Board Vision', icon: Eye, desc: 'Find the target squares instantly.', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/50', locked: false },
    { id: 'minefield', name: 'Minefield', icon: Bomb, desc: 'Navigate the Knight safely.', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/50', locked: false },
    { id: 'memory', name: 'Photo Memory', icon: Camera, desc: 'Memorize positions in seconds.', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/50', locked: false },
    { id: 'detective', name: 'Detective', icon: Search, desc: 'Calculate legal moves instantly.', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/50', locked: false },
    { id: 'queens', name: '8 Queens', icon: Crown, desc: 'Place non-attacking Queens.', color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/50', locked: false },
    { id: 'tour', name: "Knight's Tour", icon: Route, desc: 'Jump without revisiting squares.', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/50', locked: false },
];

const DIFFICULTIES = ['easy', 'medium', 'hard'];

const DIFF_MODIFIERS = {
    vision: { easy: 'Coordinates ON', medium: 'Coordinates OFF', hard: 'No Coordinates + Random Board Flips' },
    minefield: { easy: '4 Mines (Safe Paths)', medium: '8 Mines (Complex)', hard: '12 Mines (Brutal)' },
    memory: { easy: '6 Second Flash', medium: '4 Second Flash', hard: '2 Second Flash' },
    detective: { easy: 'Open Positions', medium: 'Standard Positions', hard: 'Crowded Middle-games' },
    queens: { easy: 'Target: 5 Queens', medium: 'Target: 6 Queens', hard: 'Target: 8 Queens (Full Solve)' },
    tour: { easy: 'Target: 10 Jumps', medium: 'Target: 25 Jumps', hard: 'Target: 40 Jumps' }
};

// --- RULES CONFIG ---
const MODE_RULES = {
    vision: [
        "Locate and click the exact coordinate called out.",
        "Correct clicks earn points and instantly spawn a new target.",
        "3 incorrect clicks will abort the simulation."
    ],
    minefield: [
        "Navigate the White Knight to the White King's square.",
        "Do NOT land on Black Pawns.",
        "Do NOT land on squares attacked by Black Pawns (diagonals)."
    ],
    memory: [
        "Memorize the entire board before the snapshot timer ends.",
        "Recall the exact piece that was on the highlighted square.",
        "Select from the multiple-choice options. 3 strikes and you're out."
    ],
    detective: [
        "Examine the highlighted piece on the board.",
        "Calculate its TOTAL number of strictly legal moves.",
        "Select the correct number from the options."
    ],
    queens: [
        "Place Queens on the board one by one.",
        "No two Queens can share the same row, column, or diagonal.",
        "Clicking an attacked square will result in an immediate strike."
    ],
    tour: [
        "Move the Knight using standard 'L' shaped jumps.",
        "You cannot land on a square you have already visited.",
        "Survive until you hit the target number of consecutive jumps."
    ]
};

// --- FEN DATABASES FOR DETECTIVE/MEMORY ---
const FENS = {
    easy: [
        "8/8/8/4k3/8/8/4K3/8 w - - 0 1", 
        "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", 
        "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1"
    ],
    medium: [
        "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3",
        "rnbq1rk1/ppp1ppbp/5np1/3p4/3P4/2N1PN2/PPP1BPPP/R1BQK2R w KQ - 3 6",
        "2kr3r/ppp2ppp/2n1bn2/3q4/3P4/2B2N2/PP2BPPP/R2Q1RK1 w - - 3 11"
    ],
    hard: [
        "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1", 
        "4r1k1/1p3ppp/p1n5/3p4/3P1q2/2P2N2/PP3QPP/4R1K1 w - - 1 22",
        "r2q1rk1/1b2bppp/p1n1pn2/1p1p4/3P4/1PN1PN2/PB2BPPP/R2Q1RK1 w - - 0 1"
    ]
};

const PIECE_NAMES = { 'p': 'Pawn', 'n': 'Knight', 'b': 'Bishop', 'r': 'Rook', 'q': 'Queen', 'k': 'King' };

const IqPuzzle = () => {
    const { user } = useAuth();
    
    const [view, setView] = useState('menu'); 
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState([]);
    const [feedbackState, setFeedbackState] = useState(null); 
    
    const [selectedMode, setSelectedMode] = useState('vision');
    const [difficulty, setDifficulty] = useState('easy');
    
    const [score, setScore] = useState(0);
    const [strikes, setStrikes] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [lastResult, setLastResult] = useState(null);

    // Mode Specific States
    const [boardOrientation, setBoardOrientation] = useState('white');
    const [targetSquare, setTargetSquare] = useState('');
    
    const [minefieldPos, setMinefieldPos] = useState({});
    const [knightPos, setKnightPos] = useState('a1');
    const [goalPos, setGoalPos] = useState('h8');
    const [mines, setMines] = useState([]);
    
    const [memoryPhase, setMemoryPhase] = useState('view');
    const [memoryFen, setMemoryFen] = useState('');
    const [memoryQuestion, setMemoryQuestion] = useState(null);
    
    const [detectiveFen, setDetectiveFen] = useState('');
    const [detectiveQuestion, setDetectiveQuestion] = useState(null);

    const [queensPos, setQueensPos] = useState({});
    const [queensPlaced, setQueensPlaced] = useState([]);

    const [tourPos, setTourPos] = useState({});
    const [tourCurrent, setTourCurrent] = useState('');
    const [tourVisited, setTourVisited] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await apiClient.get(ENDPOINTS.IQ.GET_STATS);
                setStats(res.data.data || []);
            } catch (error) {
                console.error("Failed to load IQ stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [view]);

    // --- GAME ENGINE ---
    const startGame = () => {
        setScore(0);
        setStrikes(0);
        setTimeLeft(60);
        setBoardOrientation('white');
        setFeedbackState(null);
        
        if (selectedMode === 'vision') generateVisionTask();
        if (selectedMode === 'minefield') generateMinefieldTask();
        if (selectedMode === 'memory') generateMemoryTask();
        if (selectedMode === 'detective') generateDetectiveTask();
        if (selectedMode === 'queens') generateQueensTask();
        if (selectedMode === 'tour') generateTourTask();
        
        setView('playing');
    };

    const triggerFeedback = (type) => {
        setFeedbackState(type);
        setTimeout(() => setFeedbackState(null), 300);
    };

    const handleStrike = () => {
        triggerFeedback('error');
        setStrikes(prev => {
            const next = prev + 1;
            if (next >= 3) {
                setTimeout(() => endGame(score, 3), 300);
            } else {
                toast.error("Incorrect!", { position: 'top-center', duration: 800 });
            }
            return next;
        });
    };

    const handleSuccess = () => {
        triggerFeedback('success');
        setScore(prev => prev + 1);
        
        if (selectedMode === 'vision') generateVisionTask();
        if (selectedMode === 'minefield') generateMinefieldTask();
        if (selectedMode === 'memory') generateMemoryTask();
        if (selectedMode === 'detective') generateDetectiveTask();
        if (selectedMode === 'queens') generateQueensTask();
        if (selectedMode === 'tour') generateTourTask();
    };

    useEffect(() => {
        let timer;
        const isTimerActive = view === 'playing' && !(selectedMode === 'memory' && memoryPhase === 'question');
        
        if (isTimerActive && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        endGame(score, strikes);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [view, timeLeft, score, strikes, selectedMode, memoryPhase]);

    const endGame = async (finalScore, finalStrikes) => {
        setView('loading_result');
        const timeSpent = 60 - timeLeft;

        try {
            const res = await apiClient.post(ENDPOINTS.IQ.SUBMIT_SCORE, {
                mode: selectedMode,
                difficulty,
                score: finalScore,
                timeSpent
            });
            setLastResult(res.data.data);
            setView('result');
        } catch (error) {
            toast.error("Failed to submit score.");
            setView('menu');
        }
    };

    const getHighScore = (mode, diff) => {
        const record = stats.find(s => s.mode === mode && s.difficulty === diff);
        return record ? record.highScore : 0;
    };

    // ==========================================
    // 1. BOARD VISION
    // ==========================================
    const generateVisionTask = useCallback(() => {
        const files = 'abcdefgh';
        const ranks = '12345678';
        setTargetSquare(`${files[Math.floor(Math.random() * 8)]}${ranks[Math.floor(Math.random() * 8)]}`);
        
        if (difficulty === 'hard') {
            setBoardOrientation(Math.random() > 0.5 ? 'white' : 'black');
        } else {
            setBoardOrientation('white');
        }
    }, [difficulty]);

    const handleVisionClick = (square) => {
        if (square === targetSquare) handleSuccess();
        else handleStrike();
    };


    // ==========================================
    // 2. MINEFIELD ALGORITHMS
    // ==========================================
    const isAttackedByBlackPawn = (targetSq, pawnSquares) => {
        const targetFile = targetSq.charCodeAt(0);
        const targetRank = parseInt(targetSq[1]);

        for (let pawnSq of pawnSquares) {
            const pFile = pawnSq.charCodeAt(0);
            const pRank = parseInt(pawnSq[1]);
            if (targetRank === pRank - 1 && Math.abs(targetFile - pFile) === 1) return true;
        }
        return false;
    };

    const isBoardSolvable = (start, goal, mines) => {
        const queue = [start];
        const visited = new Set([start]);
        const knightMoves = [[1,2], [2,1], [-1,2], [-2,1], [1,-2], [2,-1], [-1,-2], [-2,-1]];

        while (queue.length > 0) {
            const curr = queue.shift();
            if (curr === goal) return true;

            const f = curr.charCodeAt(0);
            const r = parseInt(curr[1]);

            for (let [df, dr] of knightMoves) {
                const nf = String.fromCharCode(f + df);
                const nr = r + dr;
                const nextSq = `${nf}${nr}`;

                if (nf >= 'a' && nf <= 'h' && nr >= 1 && nr <= 8) {
                    if (!visited.has(nextSq) && !mines.includes(nextSq) && !isAttackedByBlackPawn(nextSq, mines)) {
                        visited.add(nextSq);
                        queue.push(nextSq);
                    }
                }
            }
        }
        return false;
    };

    const generateMinefieldTask = useCallback(() => {
        const files = 'abcdefgh';
        const ranks = '12345678';
        const getSq = () => `${files[Math.floor(Math.random() * 8)]}${ranks[Math.floor(Math.random() * 8)]}`;
        
        let validBoardGenerated = false;
        let finalStart, finalGoal, finalMines;
        let attempts = 0;
        const mineCount = difficulty === 'hard' ? 12 : difficulty === 'medium' ? 8 : 4;

        while (!validBoardGenerated && attempts < 100) {
            attempts++;
            let start = getSq();
            let goal = getSq();
            while (start === goal) goal = getSq(); 

            const newMines = [];
            for (let i = 0; i < mineCount; i++) {
                let m = getSq();
                if (m !== start && m !== goal && !newMines.includes(m)) newMines.push(m);
            }

            if (isAttackedByBlackPawn(start, newMines) || isAttackedByBlackPawn(goal, newMines)) continue;

            if (isBoardSolvable(start, goal, newMines)) {
                finalStart = start;
                finalGoal = goal;
                finalMines = newMines;
                validBoardGenerated = true;
            }
        }

        if (!validBoardGenerated) {
            finalStart = 'a1'; finalGoal = 'h8'; finalMines = ['d4', 'e5'];
        }

        setKnightPos(finalStart);
        setGoalPos(finalGoal);
        setMines(finalMines);

        const posObj = { [finalStart]: 'wN', [finalGoal]: 'wK' }; 
        finalMines.forEach(m => posObj[m] = 'bP');
        setMinefieldPos(posObj);
    }, [difficulty]);

    const handleMinefieldClick = (square) => {
        const fileDiff = Math.abs(square.charCodeAt(0) - knightPos.charCodeAt(0));
        const rankDiff = Math.abs(square.charCodeAt(1) - knightPos.charCodeAt(1));
        const isKnightMove = (fileDiff === 2 && rankDiff === 1) || (fileDiff === 1 && rankDiff === 2);

        if (!isKnightMove) return;

        if (mines.includes(square) || isAttackedByBlackPawn(square, mines)) {
            handleStrike();
        } else if (square === goalPos) {
            handleSuccess();
        } else {
            setKnightPos(square);
            const newPosObj = { [square]: 'wN', [goalPos]: 'wK' };
            mines.forEach(m => newPosObj[m] = 'bP');
            setMinefieldPos(newPosObj);
        }
    };

    // ==========================================
    // 3. PHOTO MEMORY
    // ==========================================
    const generateMemoryTask = useCallback(() => {
        setMemoryPhase('view');
        const fenPool = FENS[difficulty];
        const randomFen = fenPool[Math.floor(Math.random() * fenPool.length)];
        setMemoryFen(randomFen);

        const chess = new Chess(randomFen);
        const board = chess.board();
        const occupiedSquares = [];
        
        for (let r=0; r<8; r++) {
            for (let c=0; c<8; c++) {
                if (board[r][c]) occupiedSquares.push({ square: `${String.fromCharCode(97+c)}${8-r}`, piece: board[r][c] });
            }
        }

        const target = occupiedSquares[Math.floor(Math.random() * occupiedSquares.length)];
        const colorStr = target.piece.color === 'w' ? 'White' : 'Black';
        const pieceStr = PIECE_NAMES[target.piece.type];
        const correctAns = `${colorStr} ${pieceStr}`;

        const options = [correctAns];
        const allColors = ['White', 'Black'];
        const allPieces = Object.values(PIECE_NAMES);
        
        while(options.length < 4) {
            const fake = `${allColors[Math.floor(Math.random()*2)]} ${allPieces[Math.floor(Math.random()*6)]}`;
            if (!options.includes(fake)) options.push(fake);
        }

        setMemoryQuestion({
            square: target.square,
            options: options.sort(() => Math.random() - 0.5),
            correct: correctAns
        });

        const delay = difficulty === 'hard' ? 2000 : difficulty === 'medium' ? 4000 : 6000;
        setTimeout(() => {
            setMemoryPhase('question');
        }, delay);
    }, [difficulty]);

    const handleMemoryAnswer = (ans) => {
        if (ans === memoryQuestion.correct) handleSuccess();
        else handleStrike();
    };

    // ==========================================
    // 4. DETECTIVE
    // ==========================================
    const generateDetectiveTask = useCallback(() => {
        const fenPool = FENS[difficulty];
        const randomFen = fenPool[Math.floor(Math.random() * fenPool.length)];
        const chess = new Chess(randomFen);
        setDetectiveFen(randomFen);

        const turn = chess.turn();
        const board = chess.board();
        const myPieces = [];
        
        for (let r=0; r<8; r++) {
            for (let c=0; c<8; c++) {
                if (board[r][c] && board[r][c].color === turn) {
                    myPieces.push({ square: `${String.fromCharCode(97+c)}${8-r}`, piece: board[r][c] });
                }
            }
        }

        const target = myPieces[Math.floor(Math.random() * myPieces.length)];
        const legalMoves = chess.moves({ square: target.square });
        const correctAns = legalMoves.length;

        const options = new Set([correctAns]);
        while(options.size < 4) {
            const variance = Math.floor(Math.random() * 5) - 2; 
            const fake = Math.max(0, correctAns + variance + (Math.floor(Math.random() * 2)));
            options.add(fake);
        }

        setDetectiveQuestion({
            square: target.square,
            pieceName: `${turn === 'w' ? 'White' : 'Black'} ${PIECE_NAMES[target.piece.type]}`,
            options: Array.from(options).sort((a,b) => a-b),
            correct: correctAns
        });
    }, [difficulty]);

    const handleDetectiveAnswer = (ans) => {
        if (ans === detectiveQuestion.correct) handleSuccess();
        else handleStrike();
    };

    // ==========================================
    // 5. N-QUEENS
    // ==========================================
    const generateQueensTask = useCallback(() => {
        setQueensPos({});
        setQueensPlaced([]);
    }, []);

    const isAttackedByQueen = (sq, placedQueens) => {
        const f1 = sq.charCodeAt(0);
        const r1 = parseInt(sq[1]);
        for (let q of placedQueens) {
            const f2 = q.charCodeAt(0);
            const r2 = parseInt(q[1]);
            // Check Row, Column, or Diagonals
            if (f1 === f2 || r1 === r2 || Math.abs(f1 - f2) === Math.abs(r1 - r2)) {
                return true;
            }
        }
        return false;
    };

    const handleQueensClick = (square) => {
        if (queensPlaced.includes(square)) return; 

        if (isAttackedByQueen(square, queensPlaced)) {
            handleStrike();
        } else {
            const newPlaced = [...queensPlaced, square];
            setQueensPlaced(newPlaced);
            setQueensPos({ ...queensPos, [square]: 'wQ' });

            const target = difficulty === 'hard' ? 8 : difficulty === 'medium' ? 6 : 5;
            if (newPlaced.length === target) {
                setTimeout(() => handleSuccess(), 300);
            }
        }
    };

    // ==========================================
    // 6. KNIGHT'S TOUR
    // ==========================================
    const generateTourTask = useCallback(() => {
        const files = 'abcdefgh';
        const ranks = '12345678';
        const startSq = `${files[Math.floor(Math.random() * 8)]}${ranks[Math.floor(Math.random() * 8)]}`;
        setTourCurrent(startSq);
        setTourVisited([startSq]);
        setTourPos({ [startSq]: 'wN' });
    }, []);

    const handleTourClick = (square) => {
        const fileDiff = Math.abs(square.charCodeAt(0) - tourCurrent.charCodeAt(0));
        const rankDiff = Math.abs(square.charCodeAt(1) - tourCurrent.charCodeAt(1));
        const isKnightMove = (fileDiff === 2 && rankDiff === 1) || (fileDiff === 1 && rankDiff === 2);

        if (!isKnightMove) return;

        if (tourVisited.includes(square)) {
            handleStrike();
        } else {
            const newVisited = [...tourVisited, square];
            setTourVisited(newVisited);
            setTourCurrent(square);
            setTourPos({ [square]: 'wN' });

            const targetJumps = difficulty === 'hard' ? 40 : difficulty === 'medium' ? 25 : 10;
            const jumpsMade = newVisited.length - 1;

            if (jumpsMade === targetJumps) {
                setTimeout(() => handleSuccess(), 300);
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#05070C] flex flex-col items-center justify-center text-white">
                <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
                <p className="text-gray-400 font-bold tracking-widest uppercase">Loading Matrix...</p>
            </div>
        );
    }

    return (
        <div className={`min-h-screen transition-colors duration-300 font-sans relative overflow-hidden ${
            feedbackState === 'success' ? 'bg-green-900/20' : 
            feedbackState === 'error' ? 'bg-red-900/20' : 'bg-[#05070C]'
        } text-white selection:bg-blue-500/30`}>
            
            {/* Ambient Background Glows */}
            <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>

            <AnimatePresence mode="wait">
                
                {/* --- MENU VIEW --- */}
                {view === 'menu' && (
                    <motion.div 
                        key="menu"
                        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                        className="max-w-7xl mx-auto px-4 md:px-8 pt-12 pb-24 relative z-10"
                    >
                        <header className="mb-12">
                            <div className="flex items-center gap-5 mb-2">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-indigo-500/10 rounded-2xl flex items-center justify-center border border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.15)]">
                                    <Brain className="w-8 h-8 text-blue-400" />
                                </div>
                                <div>
                                    <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-blue-400 tracking-tight">
                                        IQ Tactical Gym
                                    </h1>
                                    <p className="text-gray-400 font-medium mt-1">Train your raw processing speed, memory, and spatial awareness.</p>
                                </div>
                            </div>
                        </header>

                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                            {/* Left: Mode Selection (Takes up 3/4 columns now for a 3x2 grid) */}
                            <div className="lg:col-span-3 space-y-4">
                                <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Target className="w-4 h-4"/> Select Protocol
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {MODES.map(mode => {
                                        const isSelected = selectedMode === mode.id;
                                        return (
                                            <div 
                                                key={mode.id}
                                                onClick={() => !mode.locked && setSelectedMode(mode.id)}
                                                className={`p-6 rounded-3xl border-2 transition-all duration-300 relative overflow-hidden group ${
                                                    mode.locked ? 'bg-gray-900/50 border-gray-800 opacity-50 cursor-not-allowed' :
                                                    isSelected ? `bg-[#111726] ${mode.border} shadow-[0_0_30px_rgba(59,130,246,0.15)] scale-[1.02]` : 'bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.04] cursor-pointer'
                                                }`}
                                            >
                                                {mode.locked && (
                                                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-10">
                                                        <span className="text-xs font-black uppercase tracking-widest text-gray-400 bg-black/80 px-3 py-1 rounded border border-gray-700">Coming Soon</span>
                                                    </div>
                                                )}
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${mode.bg}`}>
                                                    <mode.icon className={`w-6 h-6 ${mode.color}`} />
                                                </div>
                                                <h4 className="text-xl font-bold text-gray-100 mb-1.5">{mode.name}</h4>
                                                <p className="text-sm text-gray-500 mb-6">{mode.desc}</p>
                                                
                                                {!mode.locked && (
                                                    <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center text-sm bg-black/20 -mx-6 -mb-6 px-6 py-4">
                                                        <span className="text-gray-500 font-bold uppercase tracking-wider text-xs">Personal Best</span>
                                                        <span className="text-yellow-500 font-black flex items-center gap-1.5">
                                                            <Trophy className="w-3.5 h-3.5" /> {getHighScore(mode.id, difficulty)} Pts
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Right: Difficulty, Rules & Start */}
                            <div className="space-y-6 bg-[#0f1423]/60 p-6 md:p-8 rounded-3xl border border-white/5 h-fit backdrop-blur-md shadow-2xl">
                                {/* Mission Briefing / Rules Box */}
                                <div className="bg-blue-500/10 p-5 rounded-2xl border border-blue-500/20 shadow-inner">
                                    <div className="text-[10px] text-blue-400 font-black uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                        <Info className="w-4 h-4" /> Mission Briefing
                                    </div>
                                    <ul className="space-y-2.5">
                                        {MODE_RULES[selectedMode].map((rule, idx) => (
                                            <li key={idx} className="text-sm text-gray-300 font-medium flex items-start gap-2.5 leading-snug">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
                                                {rule}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-4">Difficulty Level</h3>
                                    <div className="flex flex-col gap-3">
                                        {DIFFICULTIES.map(diff => (
                                            <button
                                                key={diff}
                                                onClick={() => setDifficulty(diff)}
                                                className={`w-full py-4 px-5 rounded-2xl font-black uppercase tracking-wider text-sm transition-all flex justify-between items-center ${
                                                    difficulty === diff 
                                                        ? 'bg-blue-600 text-white shadow-[0_0_25px_rgba(37,99,235,0.4)] scale-105 border border-blue-400/50' 
                                                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-transparent'
                                                }`}
                                            >
                                                {diff}
                                                <span className={`text-xs font-mono px-2 py-1 rounded-md ${difficulty === diff ? 'bg-black/30 text-white' : 'bg-black/40 text-gray-500'}`}>
                                                    x{diff === 'hard' ? 3 : diff === 'medium' ? 2 : 1}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                
                                <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                                    <div className="text-[10px] text-orange-400 font-bold uppercase tracking-widest mb-1 flex items-center gap-1.5">
                                        <Zap className="w-3 h-3" /> Active Modifiers
                                    </div>
                                    <p className="text-sm text-gray-300 font-medium">
                                        {DIFF_MODIFIERS[selectedMode][difficulty]}
                                    </p>
                                </div>

                                <div className="pt-6 border-t border-white/5">
                                    <button 
                                        onClick={startGame}
                                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-5 rounded-2xl font-black text-lg shadow-[0_10px_30px_rgba(37,99,235,0.3)] transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <Play className="w-5 h-5 fill-white" /> Start Simulation
                                    </button>
                                </div>
                            </div>

                        </div>
                    </motion.div>
                )}

                {/* --- PLAYING VIEW (ALL MODES) --- */}
                {view === 'playing' && (
                    <motion.div 
                        key="playing"
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        className="max-w-4xl mx-auto px-4 py-6 md:py-10 flex flex-col items-center justify-start min-h-screen relative z-10"
                    >
                        {/* HUD WITH ABORT BUTTON */}
                        <div className={`w-full flex justify-between items-center mb-6 bg-[#111726]/90 backdrop-blur-xl border p-4 md:p-5 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] transition-colors duration-300 ${feedbackState === 'error' ? 'border-red-500/50' : feedbackState === 'success' ? 'border-green-500/50' : 'border-white/10'}`}>
                            <div className="flex items-center gap-4 md:gap-8">
                                <button 
                                    onClick={() => endGame(score, strikes)}
                                    className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl border border-red-500/30 transition-colors group"
                                    title="Abort Simulation"
                                >
                                    <LogOut className="w-5 h-5 md:w-6 md:h-6 group-hover:-translate-x-0.5 transition-transform" />
                                </button>
                                <div className="h-8 w-px bg-white/10 hidden md:block"></div>
                                <div className="flex items-center gap-2 md:gap-3 bg-black/40 px-4 py-2 rounded-2xl border border-white/5">
                                    <Timer className={`w-6 h-6 md:w-8 md:h-8 ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-blue-400'}`} />
                                    <span className={`text-2xl md:text-4xl font-black font-mono tracking-tight ${timeLeft <= 10 ? 'text-red-500' : 'text-white'}`}>
                                        0:{timeLeft.toString().padStart(2, '0')}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 md:gap-3">
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center border border-yellow-500/30">
                                        <Zap className="w-5 h-5 md:w-6 md:h-6 text-yellow-500" />
                                    </div>
                                    <span className="text-3xl md:text-5xl font-black text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.4)]">{score}</span>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2 bg-black/40 px-4 py-3 rounded-2xl border border-white/5">
                                {[...Array(3)].map((_, i) => (
                                    <X key={i} className={`w-7 h-7 md:w-8 md:h-8 transition-colors duration-300 ${i < strikes ? 'text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]' : 'text-gray-700'}`} strokeWidth={4} />
                                ))}
                            </div>
                        </div>

                        {/* UNIVERSAL IN-GAME RULES REMINDER */}
                        <div className="w-full max-w-[600px] mb-8 bg-black/30 border border-white/5 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-center gap-4 text-center text-sm text-gray-300">
                            <div className="font-bold text-blue-400 uppercase tracking-widest text-[10px] flex items-center gap-1.5 shrink-0">
                                <Info className="w-4 h-4"/> Rule Check
                            </div>
                            <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
                                {MODE_RULES[selectedMode].map((rule, idx) => (
                                    <span key={idx} className="flex items-center gap-2 text-xs md:text-sm">
                                        <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                                        {rule}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* 1. VISION MODE */}
                        {selectedMode === 'vision' && (
                            <div className="flex flex-col items-center w-full">
                                <div className="mb-6 text-center">
                                    <h2 className="text-blue-400 font-bold uppercase tracking-widest text-sm mb-1 flex items-center justify-center gap-2">
                                        <Target className="w-4 h-4"/> Locate Square
                                    </h2>
                                    <div className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500 drop-shadow-2xl">
                                        {targetSquare.toUpperCase()}
                                    </div>
                                    {difficulty === 'hard' && <span className="text-xs text-orange-400 font-bold uppercase tracking-wider bg-orange-500/10 px-2 py-1 rounded mt-2 inline-block">Board May Be Flipped</span>}
                                </div>
                                <div className={`w-full max-w-[500px] aspect-square rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-4 transition-colors duration-300 relative cursor-crosshair ${feedbackState === 'error' ? 'border-red-500' : feedbackState === 'success' ? 'border-green-500' : 'border-[#2b3954]'}`}>
                                    <Chessboard 
                                        position="8/8/8/8/8/8/8/8 w - - 0 1" 
                                        onSquareClick={handleVisionClick}
                                        arePiecesDraggable={false}
                                        boardOrientation={boardOrientation}
                                        showBoardNotation={difficulty === 'easy'} 
                                        customDarkSquareStyle={{ backgroundColor: '#2b3954' }} 
                                        customLightSquareStyle={{ backgroundColor: '#e2e8f0' }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* 2. MINEFIELD MODE */}
                        {selectedMode === 'minefield' && (
                            <div className="flex flex-col items-center w-full">
                                <div className="mb-6 text-center">
                                    <h2 className="text-orange-400 font-bold uppercase tracking-widest text-sm mb-1 flex items-center justify-center gap-2">
                                        <Bomb className="w-4 h-4"/> Pathfinding Active
                                    </h2>
                                </div>
                                <div className={`w-full max-w-[500px] aspect-square rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-4 transition-colors duration-300 relative cursor-pointer ${feedbackState === 'error' ? 'border-red-500' : feedbackState === 'success' ? 'border-green-500' : 'border-orange-900/50'}`}>
                                    <Chessboard 
                                        position={minefieldPos} 
                                        onSquareClick={handleMinefieldClick}
                                        arePiecesDraggable={false}
                                        showBoardNotation={false}
                                        customDarkSquareStyle={{ backgroundColor: '#47638A' }} 
                                        customLightSquareStyle={{ backgroundColor: '#E4EBF2' }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* 3. MEMORY MODE */}
                        {selectedMode === 'memory' && (
                            <div className="flex flex-col items-center w-full">
                                <div className="mb-6 text-center h-16">
                                    {memoryPhase === 'view' ? (
                                        <>
                                            <h2 className="text-purple-400 font-bold uppercase tracking-widest text-sm mb-1 flex items-center justify-center gap-2 animate-pulse">
                                                <Camera className="w-4 h-4"/> Snapshot Active
                                            </h2>
                                            <p className="text-gray-300 font-black text-xl">Memorize ({difficulty === 'hard' ? '2s' : difficulty === 'medium' ? '4s' : '6s'})...</p>
                                        </>
                                    ) : (
                                        <>
                                            <h2 className="text-yellow-400 font-bold uppercase tracking-widest text-sm mb-1 flex items-center justify-center gap-2">
                                                <Brain className="w-4 h-4"/> Recall Phase
                                            </h2>
                                            <p className="text-white font-black text-2xl">What piece was on <span className="text-blue-400">{memoryQuestion?.square}</span>?</p>
                                        </>
                                    )}
                                </div>
                                
                                {memoryPhase === 'view' ? (
                                    <div className={`w-full max-w-[500px] aspect-square rounded-xl overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.3)] border-4 transition-colors duration-300 ${feedbackState === 'error' ? 'border-red-500' : feedbackState === 'success' ? 'border-green-500' : 'border-purple-500/50'}`}>
                                        <Chessboard 
                                            position={memoryFen} 
                                            arePiecesDraggable={false}
                                        />
                                    </div>
                                ) : (
                                    <div className="w-full max-w-[500px] grid grid-cols-1 gap-4 mt-8">
                                        {memoryQuestion?.options.map((opt, idx) => (
                                            <button 
                                                key={idx}
                                                onClick={() => handleMemoryAnswer(opt)}
                                                className="bg-[#111726] border border-white/10 hover:bg-blue-600 hover:border-blue-500 text-white font-bold py-6 rounded-2xl text-xl shadow-lg transition-all transform hover:scale-[1.02]"
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 4. DETECTIVE MODE */}
                        {selectedMode === 'detective' && (
                            <div className="flex flex-col items-center w-full">
                                <div className="mb-6 text-center">
                                    <h2 className="text-green-400 font-bold uppercase tracking-widest text-sm mb-1 flex items-center justify-center gap-2">
                                        <Search className="w-4 h-4"/> Calculate Targets
                                    </h2>
                                    <p className="text-white font-bold text-lg md:text-xl">
                                        Total legal moves for the <span className="text-green-400">{detectiveQuestion?.pieceName}</span> on <span className="text-blue-400">{detectiveQuestion?.square}</span>?
                                    </p>
                                </div>
                                
                                <div className={`w-full max-w-[450px] aspect-square rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-4 transition-colors duration-300 relative mb-8 pointer-events-none ${feedbackState === 'error' ? 'border-red-500' : feedbackState === 'success' ? 'border-green-500' : 'border-green-900/50'}`}>
                                    <Chessboard 
                                        position={detectiveFen} 
                                        arePiecesDraggable={false}
                                        customSquareStyles={{
                                            [detectiveQuestion?.square]: { backgroundColor: 'rgba(74, 222, 128, 0.6)' } 
                                        }}
                                    />
                                </div>

                                <div className="w-full max-w-[450px] grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {detectiveQuestion?.options.map((opt, idx) => (
                                        <button 
                                            key={idx}
                                            onClick={() => handleDetectiveAnswer(opt)}
                                            className="bg-[#111726] border border-white/10 hover:bg-green-600 hover:border-green-400 text-white font-black py-4 rounded-xl text-2xl shadow-lg transition-all transform hover:scale-[1.05]"
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 5. N-QUEENS MODE */}
                        {selectedMode === 'queens' && (() => {
                            const target = difficulty === 'hard' ? 8 : difficulty === 'medium' ? 6 : 5;
                            return (
                            <div className="flex flex-col items-center w-full">
                                <div className="mb-6 text-center">
                                    <h2 className="text-pink-400 font-bold uppercase tracking-widest text-sm mb-1 flex items-center justify-center gap-2">
                                        <Crown className="w-4 h-4"/> Queen Placement
                                    </h2>
                                    <p className="text-white font-bold text-xl">
                                        Safe Queens: <span className="text-pink-400">{queensPlaced.length} / {target}</span>
                                    </p>
                                </div>
                                <div className={`w-full max-w-[500px] aspect-square rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-4 transition-colors duration-300 relative cursor-pointer ${feedbackState === 'error' ? 'border-red-500' : feedbackState === 'success' ? 'border-green-500' : 'border-pink-900/50'}`}>
                                    <Chessboard 
                                        position={queensPos} 
                                        onSquareClick={handleQueensClick}
                                        arePiecesDraggable={false}
                                        showBoardNotation={false}
                                        customDarkSquareStyle={{ backgroundColor: '#5c4b69' }} 
                                        customLightSquareStyle={{ backgroundColor: '#e2dbe6' }}
                                    />
                                </div>
                            </div>
                        )})()}

                        {/* 6. KNIGHT'S TOUR MODE */}
                        {selectedMode === 'tour' && (() => {
                            const targetJumps = difficulty === 'hard' ? 40 : difficulty === 'medium' ? 25 : 10;
                            return (
                            <div className="flex flex-col items-center w-full">
                                <div className="mb-6 text-center">
                                    <h2 className="text-emerald-400 font-bold uppercase tracking-widest text-sm mb-1 flex items-center justify-center gap-2">
                                        <Route className="w-4 h-4"/> Memory Map
                                    </h2>
                                    <p className="text-white font-bold text-xl">
                                        Consecutive Jumps: <span className="text-emerald-400">{Math.max(0, tourVisited.length - 1)} / {targetJumps}</span>
                                    </p>
                                </div>
                                <div className={`w-full max-w-[500px] aspect-square rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-4 transition-colors duration-300 relative cursor-pointer ${feedbackState === 'error' ? 'border-red-500' : feedbackState === 'success' ? 'border-green-500' : 'border-emerald-900/50'}`}>
                                    <Chessboard 
                                        position={tourPos} 
                                        onSquareClick={handleTourClick}
                                        arePiecesDraggable={false}
                                        showBoardNotation={false}
                                        customDarkSquareStyle={{ backgroundColor: '#3f5752' }} 
                                        customLightSquareStyle={{ backgroundColor: '#d5e0de' }}
                                        customSquareStyles={tourVisited.reduce((acc, sq) => {
                                            acc[sq] = { 
                                                backgroundColor: sq === tourCurrent 
                                                    ? 'rgba(52, 211, 153, 0.9)' // Bright Emerald for current position
                                                    : 'rgba(52, 211, 153, 0.4)' // Dim Emerald for trailing path
                                            };
                                            return acc;
                                        }, {})}
                                    />
                                </div>
                            </div>
                        )})()}

                    </motion.div>
                )}

                {/* --- RESULT VIEW --- */}
                {view === 'result' && lastResult && (
                    <motion.div 
                        key="result"
                        initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
                        className="max-w-md mx-auto px-4 py-20 relative z-10 text-center"
                    >
                        <div className="bg-[#111726]/90 backdrop-blur-2xl border border-white/10 p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative overflow-hidden">
                            
                            {lastResult.isNewHighScore && (
                                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 text-black text-xs font-black uppercase tracking-widest py-1.5 animate-pulse shadow-md">
                                    New Personal Best!
                                </div>
                            )}

                            <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-blue-500/50 mt-4 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                                <Trophy className="w-12 h-12 text-blue-400" />
                            </div>

                            <h2 className="text-3xl md:text-4xl font-black text-white mb-2">Simulation Complete</h2>
                            <p className="text-gray-400 mb-10 font-medium">Protocol: <span className="text-white uppercase">{selectedMode} - {difficulty}</span></p>

                            <div className="grid grid-cols-2 gap-4 mb-10">
                                <div className="bg-black/50 p-5 rounded-2xl border border-white/5 shadow-inner">
                                    <div className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">Puzzles Solved</div>
                                    <div className="text-4xl font-black text-white">{lastResult.record.score}</div>
                                </div>
                                <div className="bg-yellow-500/10 p-5 rounded-2xl border border-yellow-500/20 shadow-inner">
                                    <div className="text-yellow-600/80 text-[10px] font-black uppercase tracking-widest mb-2">Global Pts Earned</div>
                                    <div className="text-4xl font-black text-yellow-500">+{lastResult.pointsEarned}</div>
                                </div>
                            </div>

                            <button 
                                onClick={() => setView('menu')}
                                className="w-full bg-white/5 hover:bg-white/10 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] border border-white/10"
                            >
                                <ArrowLeft className="w-5 h-5" /> Return to Command Center
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default IqPuzzle;