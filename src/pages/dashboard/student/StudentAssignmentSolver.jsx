import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "../../../lib/api.js";
import { ENDPOINTS } from "../../../lib/endpoints.js";
import { toast } from "sonner";
import { 
  ChevronLeft, CheckCircle2, Circle, Lightbulb, 
  RotateCcw, ArrowRight, Trophy, Loader2, GitBranch, Clock, Send
} from "lucide-react";

const safeGame = (fen) => {
    try { return new Chess(fen || undefined); } 
    catch (e) { return new Chess(); }
};

const StudentAssignmentSolver = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();

  // --- State ---
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [game, setGame] = useState(new Chess());
  const [solutionMoves, setSolutionMoves] = useState([]); 
  const [isTaskCompleted, setIsTaskCompleted] = useState(false);
  const [solvedTaskIds, setSolvedTaskIds] = useState([]);
  
  // --- New State for Overall Assignment Status ---
  const [assignmentStatus, setAssignmentStatus] = useState('pending'); // 'pending', 'submitted', 'pass', 'fail'
  
  // --- Off-Script Feature ---
  const [isOffScript, setIsOffScript] = useState(false);
  const isMovingRef = useRef(false);

  // --- Fetch Data ---
  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        setLoading(true);
        const directRes = await apiClient.get(`/assignments/${assignmentId}`); 
        const data = directRes?.data?.data;
        if (data) {
            setAssignment(data);
            if(data?.mySubmission) {
                setAssignmentStatus(data.mySubmission.status || 'pending');
                if(data.mySubmission.solvedTaskIds) {
                    setSolvedTaskIds(data.mySubmission.solvedTaskIds.filter(Boolean));
                }
            }
        }
      } catch (err) {
        console.error("Load Error:", err);
        toast.error("Failed to load assignment.");
      } finally {
        setLoading(false);
      }
    };
    fetchAssignment();
  }, [assignmentId]);

  // --- Load Task ---
  useEffect(() => {
    if (!assignment || !assignment.tasks || assignment.tasks.length === 0) return;
    const task = assignment.tasks[currentTaskIndex];
    if (!task) return;

    try {
        const pgnLoader = new Chess();
        try { pgnLoader.loadPgn(task.pgn); } catch (e) {}

        let startFen = task.fen;
        if ((!startFen || startFen === 'start') && pgnLoader.header()['FEN']) {
             startFen = pgnLoader.header()['FEN'];
        }

        const gameInstance = safeGame(startFen);
        setGame(gameInstance);

        if (startFen && startFen !== 'start' && !pgnLoader.header()['FEN']) {
             const manualLoader = new Chess(startFen);
             try { manualLoader.loadPgn(task.pgn); } catch(e){}
             setSolutionMoves(manualLoader.history({ verbose: true }));
        } else {
             setSolutionMoves(pgnLoader.history({ verbose: true }));
        }

        const alreadySolved = (task._id && solvedTaskIds.includes(task._id)) || 
                              (task.chapterId && solvedTaskIds.includes(task.chapterId));
        
        setIsTaskCompleted(alreadySolved);
        setIsOffScript(false); 
        isMovingRef.current = false;

    } catch (e) {
        toast.error("Error loading puzzle.");
    }
  }, [assignment, currentTaskIndex, solvedTaskIds]);

  // --- Handle Move ---
  const onDrop = (sourceSquare, targetSquare) => {
    // Prevent moves if task is done OR if the whole assignment is already submitted
    if (isTaskCompleted || isMovingRef.current || assignmentStatus === 'submitted' || assignmentStatus === 'pass') return false;

    try {
        const gameCopy = new Chess(game.fen());
        const move = gameCopy.move({ from: sourceSquare, to: targetSquare, promotion: 'q' });

        if (!move) return false; 

        // Free Play Mode
        if (isOffScript) {
            setGame(gameCopy);
            return true;
        }

        // Validate 
        const expectedMoveIndex = game.history().length; 
        const expectedMove = solutionMoves[expectedMoveIndex];

        // Off-script detected
        if (!expectedMove || move.san !== expectedMove.san) {
            setIsOffScript(true);
            setGame(gameCopy); 
            toast.message("New Line Explored", {
                description: "You're off script. Play it out and submit for review."
            });
            return true; 
        }

        // Correct Move
        setGame(gameCopy);
        
        if (expectedMoveIndex + 1 >= solutionMoves.length) {
            completeTask(true);
            return true;
        }

        // Computer Response
        isMovingRef.current = true;
        setTimeout(() => {
            const nextGameCopy = new Chess(gameCopy.fen());
            const computerMove = solutionMoves[expectedMoveIndex + 1];

            if (computerMove) {
                nextGameCopy.move(computerMove);
                setGame(nextGameCopy);
                if (expectedMoveIndex + 2 >= solutionMoves.length) {
                    completeTask(true);
                }
            }
            isMovingRef.current = false;
        }, 300);

        return true;
    } catch (e) {
        return false;
    }
  };

  const completeTask = async (isCorrect = true) => {
    if (isTaskCompleted) return;
    setIsTaskCompleted(true);
    const task = assignment.tasks[currentTaskIndex];
    
    if (!solvedTaskIds.includes(task._id)) {
        const newSolved = [...solvedTaskIds, task._id];
        setSolvedTaskIds(newSolved); 
        
        try {
            await apiClient.post(ENDPOINTS.ASSIGNMENTS.SOLVE_TASK(assignmentId), {
                chapterId: task.chapterId,
                isCorrect: isCorrect,
                overridePgn: isCorrect ? null : game.pgn() 
            });
            isCorrect ? toast.success("Solution Mastered!") : toast.success("Line saved!");
        } catch (e) {
            console.error(e);
        }
    }
  };

  // --- Handle Final Assignment Submission ---
  const handleFinalSubmit = async () => {
      try {
          // Send a request to a theoretical endpoint that changes submission status to 'submitted'
          await apiClient.patch(`/submissions/${assignmentId}/submit`);
          setAssignmentStatus('submitted');
          toast.success("Assignment submitted to your coach!");
      } catch (error) {
          console.error("Submit Error:", error);
          toast.error("Could not submit assignment.");
      }
  };

  const handleNext = () => currentTaskIndex < assignment.tasks.length - 1 && setCurrentTaskIndex(p => p + 1);
  const handlePrev = () => currentTaskIndex > 0 && setCurrentTaskIndex(p => p - 1);
  
  const handleReset = () => {
    if (assignmentStatus === 'submitted' || assignmentStatus === 'pass') return;
    const task = assignment.tasks[currentTaskIndex];
    const pgnLoader = new Chess();
    try { pgnLoader.loadPgn(task.pgn); } catch(e){}
    let startFen = task.fen;
    if ((!startFen || startFen === 'start') && pgnLoader.header()['FEN']) startFen = pgnLoader.header()['FEN'];
    setGame(safeGame(startFen));
    setIsTaskCompleted(false);
    setIsOffScript(false);
    isMovingRef.current = false;
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center text-white">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500"/>
    </div>
  );

  if (!assignment || !assignment.tasks || assignment.tasks.length === 0) return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center text-white">
        <div className="text-center">
            <h2 className="text-xl font-bold mb-2">No Tasks Found</h2>
            <button onClick={() => navigate(-1)} className="text-blue-400 hover:underline">Go Back</button>
        </div>
    </div>
  );

  const currentTask = assignment.tasks[currentTaskIndex];
  const progressPercent = assignment.tasks.length > 0 ? (solvedTaskIds.length / assignment.tasks.length) * 100 : 0;
  const isAssignmentFullySolved = solvedTaskIds.length === assignment.tasks.length;
  const isLocked = assignmentStatus === 'submitted' || assignmentStatus === 'pass';

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white font-sans flex flex-col overflow-hidden selection:bg-blue-500/30">
      
      {/* Top Bar */}
      <header className="h-16 border-b border-white/10 bg-[#131825] flex items-center justify-between px-4 md:px-6 z-20 shrink-0">
        <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-md">
                <ChevronLeft className="w-4 h-4"/> Back
            </button>
            <div className="hidden md:block">
                <h1 className="text-sm font-bold text-gray-200">{assignment.title}</h1>
            </div>
            {assignmentStatus === 'submitted' && (
                <span className="text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/20 px-2 py-1 rounded font-bold uppercase tracking-wider hidden md:inline-block">
                    Awaiting Review
                </span>
            )}
        </div>
        
        <div className="flex items-center gap-4 w-48 md:w-64">
            <div className="flex-1">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                    <span>Progress</span>
                    <span className={progressPercent === 100 ? 'text-green-400' : 'text-blue-400'}>{Math.round(progressPercent)}%</span>
                </div>
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
                </div>
            </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex flex-col md:flex-row h-[calc(100vh-4rem)]">
        
        {/* Left Sidebar: Tasks */}
        <div className="w-full md:w-72 bg-[#131825] border-r border-white/5 overflow-y-auto hidden md:flex flex-col z-10">
            <div className="p-4 border-b border-white/5">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Techniques List</h3>
            </div>
            <div className="p-3 flex-1 overflow-y-auto space-y-1.5">
                {assignment.tasks.map((task, idx) => {
                    const isSolved = (task._id && solvedTaskIds.includes(task._id)) || (task.chapterId && solvedTaskIds.includes(task.chapterId));
                    const isActive = idx === currentTaskIndex;
                    
                    return (
                        <div 
                            key={idx}
                            onClick={() => setCurrentTaskIndex(idx)}
                            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                                isActive 
                                ? 'bg-blue-600/10 border border-blue-500/30 shadow-inner' 
                                : 'hover:bg-white/5 border border-transparent'
                            }`}
                        >
                            {isSolved ? (
                                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-green-400"/>
                                </div>
                            ) : (
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${isActive ? 'border-blue-500 text-blue-500' : 'border-gray-600'}`}>
                                    <span className="text-[10px] font-bold">{idx + 1}</span>
                                </div>
                            )}
                            <span className={`text-sm font-medium line-clamp-1 ${isActive ? 'text-blue-100' : 'text-gray-400'}`}>
                                {task.title}
                            </span>
                        </div>
                    )
                })}
            </div>
            
            {/* The Final Submit Button Section */}
            {isAssignmentFullySolved && assignmentStatus !== 'submitted' && assignmentStatus !== 'pass' && (
                <div className="p-4 border-t border-white/5 bg-gradient-to-t from-blue-900/20 to-transparent">
                    <button 
                        onClick={handleFinalSubmit}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl shadow-lg shadow-blue-900/20 font-bold flex items-center justify-center gap-2 transition-all animate-pulse hover:animate-none"
                    >
                        <Send className="w-4 h-4"/> Submit Assignment
                    </button>
                    <p className="text-[10px] text-center text-gray-500 mt-2 uppercase tracking-wider">Send to coach for review</p>
                </div>
            )}
        </div>

        {/* Center: Interactive Board */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 relative z-0 overflow-y-auto">
            
            <div className="w-full max-w-[600px] flex flex-col items-center">
                
                {/* Status Header */}
                <div className="w-full flex items-end justify-between mb-4 px-2">
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-1">{currentTask.title}</h2>
                        {isLocked ? (
                            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded flex items-center inline-flex gap-1.5 bg-gray-800 text-gray-400">
                                <Clock className="w-3 h-3"/> Locked for Review
                            </span>
                        ) : isTaskCompleted ? (
                            <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded flex items-center inline-flex gap-1.5 ${isOffScript ? 'bg-orange-500/20 text-orange-400' : 'bg-green-500/20 text-green-400'}`}>
                                {isOffScript ? <Clock className="w-3 h-3"/> : <CheckCircle2 className="w-3 h-3"/>}
                                {isOffScript ? "Line Saved" : "Completed"}
                            </span>
                        ) : isOffScript ? (
                            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded flex items-center inline-flex gap-1.5 bg-orange-500/20 text-orange-400">
                                <GitBranch className="w-3 h-3"/> Free Play Line
                            </span>
                        ) : (
                            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded flex items-center inline-flex gap-1.5 bg-blue-500/20 text-blue-400">
                                <Lightbulb className="w-3 h-3"/> Find the best move
                            </span>
                        )}
                    </div>
                </div>

                {/* Board Container */}
                <div className={`w-full relative rounded-md p-1.5 transition-all duration-300 shadow-2xl ${
                    isLocked ? 'bg-white/5 shadow-none opacity-80' :
                    isTaskCompleted 
                        ? (isOffScript ? 'bg-orange-500 shadow-orange-900/20' : 'bg-green-500 shadow-green-900/20') 
                        : isOffScript 
                            ? 'bg-gradient-to-r from-orange-600 to-yellow-500 shadow-orange-900/30' 
                            : 'bg-white/10 shadow-black/50'
                }`}>
                    <div className="rounded overflow-hidden relative">
                        <Chessboard 
                            position={game.fen()} 
                            onPieceDrop={onDrop}
                            animationDuration={200}
                            customDarkSquareStyle={{ backgroundColor: '#47638A' }} 
                            customLightSquareStyle={{ backgroundColor: '#E4EBF2' }}
                            arePiecesDraggable={!isTaskCompleted && !isLocked}
                        />
                        
                        {/* Success Overlay */}
                        <AnimatePresence>
                            {isTaskCompleted && !isLocked && (
                                <motion.div 
                                    initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                                    animate={{ opacity: 1, backdropFilter: 'blur(4px)' }}
                                    className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-20"
                                >
                                    <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex flex-col items-center">
                                        <Trophy className={`w-16 h-16 mb-4 drop-shadow-2xl ${isOffScript ? 'text-orange-400' : 'text-green-400'}`}/>
                                        <h3 className="text-3xl font-black text-white mb-2 tracking-tight">
                                            {isOffScript ? "Line Saved!" : "Brilliant!"}
                                        </h3>
                                        <p className="text-gray-300 font-medium mb-6">
                                            {isOffScript ? "Move to the next task." : "Perfect execution."}
                                        </p>
                                        <button 
                                            onClick={handleNext} 
                                            className="bg-white text-black hover:bg-gray-200 font-bold py-3 px-8 rounded-full shadow-xl transition-transform hover:scale-105"
                                        >
                                            Next Task
                                        </button>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Mobile Controls */}
                <div className="w-full flex md:hidden flex-col gap-3 mt-6">
                    {isOffScript && !isTaskCompleted && !isLocked && (
                        <button 
                            onClick={() => completeTask(false)}
                            className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-900/20"
                        >
                            <CheckCircle2 className="w-5 h-5"/> Save Custom Line
                        </button>
                    )}
                    <div className="flex justify-between items-center bg-[#131825] border border-white/5 rounded-xl p-2">
                        <button disabled={currentTaskIndex === 0} onClick={handlePrev} className="p-2 rounded hover:bg-white/5 disabled:opacity-30">
                            <ChevronLeft className="w-5 h-5"/>
                        </button>
                        <button onClick={handleReset} disabled={isLocked} className="p-2 text-gray-400 hover:text-white disabled:opacity-30">
                            <RotateCcw className="w-4 h-4"/>
                        </button>
                        <button disabled={currentTaskIndex >= assignment.tasks.length - 1} onClick={handleNext} className="p-2 rounded hover:bg-white/5 disabled:opacity-30">
                            <ArrowRight className="w-5 h-5"/>
                        </button>
                    </div>
                </div>

            </div>
        </div>

        {/* Right Sidebar: Tools */}
        <div className="w-full md:w-72 bg-[#131825] border-l border-white/5 p-6 hidden md:flex flex-col justify-between z-10">
            <div className="space-y-4">
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
                    <h4 className="text-blue-400 font-bold text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4"/> Objective
                    </h4>
                    <p className="text-sm text-gray-400 leading-relaxed">
                        {isLocked 
                            ? "This assignment has been submitted to your coach for grading. The board is now locked." 
                            : "Execute the techniques mapped in your syllabus. If you discover a different valid continuation, play it out to submit a custom line."}
                    </p>
                </div>

                {/* Off-Script Save Button (Desktop) */}
                <AnimatePresence>
                    {isOffScript && !isTaskCompleted && !isLocked && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                            <button 
                                onClick={() => completeTask(false)}
                                className="w-full bg-gradient-to-r from-orange-600 to-yellow-500 hover:from-orange-500 hover:to-yellow-400 text-white py-3 rounded-xl shadow-lg shadow-orange-900/20 font-bold flex items-center justify-center gap-2 transition-all mt-2"
                            >
                                <CheckCircle2 className="w-4 h-4"/> Save Line
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="space-y-3">
                <button 
                    onClick={handleReset} 
                    disabled={isLocked}
                    className="w-full flex items-center justify-center gap-2 bg-[#1A2133] hover:bg-[#232B42] text-white py-3 rounded-xl border border-white/5 transition-all text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <RotateCcw className="w-4 h-4"/> Reset Board
                </button>
                <div className="flex gap-2">
                    <button disabled={currentTaskIndex === 0} onClick={handlePrev} className="flex-1 flex items-center justify-center bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl transition-all disabled:opacity-30">
                        <ChevronLeft className="w-5 h-5"/>
                    </button>
                    <button disabled={currentTaskIndex >= assignment.tasks.length - 1} onClick={handleNext} className="flex-1 flex items-center justify-center bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl transition-all disabled:opacity-30">
                        <ArrowRight className="w-5 h-5"/>
                    </button>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default StudentAssignmentSolver;