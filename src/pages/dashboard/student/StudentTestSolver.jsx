import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "../../../lib/api.js";
import { toast } from "sonner";
import { 
  ChevronLeft, Circle, 
  ArrowRight, Trophy, Loader2, Clock, PlayCircle, Send
} from "lucide-react";

const safeGame = (fen) => {
    try { return new Chess(fen || undefined); } 
    catch (e) { return new Chess(); }
};

// Helper to display timer
const formatTime = (totalSeconds) => {
    if (totalSeconds < 0) return "00:00";
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
};

const StudentTestSolver = () => {
  const { testId } = useParams();
  const navigate = useNavigate();

  // --- State ---
  const [test, setTest] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Test mechanics
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [game, setGame] = useState(new Chess());
  const [solutionMoves, setSolutionMoves] = useState([]); 
  const isMovingRef = useRef(false);

  // Timer State
  const [timeLeft, setTimeLeft] = useState(null);
  const timerIntervalRef = useRef(null);

  // --- 1. Initial Load (Checks Gate) ---
  useEffect(() => {
    const fetchTest = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get(`/tests/${testId}`); 
        const data = res?.data?.data;
        if (data) {
            setTest(data);
            setAttempt(data.myAttempt);
        }
      } catch (err) {
        toast.error("Failed to load exam data.");
      } finally {
        setLoading(false);
      }
    };
    fetchTest();
  }, [testId]);

  // --- 2. Timer Management ---
  useEffect(() => {
      if (attempt?.status === 'in_progress' && test?.timeLimit) {
          
          const updateTimer = () => {
              const start = new Date(attempt.startTime).getTime();
              const elapsed = Math.floor((Date.now() - start) / 1000);
              const remaining = test.timeLimit - elapsed;
              
              if (remaining <= 0) {
                  setTimeLeft(0);
                  clearInterval(timerIntervalRef.current);
                  handleFinalSubmit(true); // Auto submit if time runs out
              } else {
                  setTimeLeft(remaining);
              }
          };

          updateTimer(); // Initial call
          timerIntervalRef.current = setInterval(updateTimer, 1000);
      } else {
          setTimeLeft(attempt?.status === 'completed' || attempt?.status === 'timeout' ? 0 : null);
      }

      return () => clearInterval(timerIntervalRef.current);
  }, [attempt, test]);

  // --- 3. Load Task (Board Setup) ---
  useEffect(() => {
    if (!test || !test.tasks || test.tasks.length === 0 || !attempt || attempt.status !== 'in_progress') return;
    const task = test.tasks[currentTaskIndex];
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
        
        isMovingRef.current = false;
    } catch (e) {
        toast.error("Error loading board.");
    }
  }, [test, attempt, currentTaskIndex]);


  // --- Actions ---

  const handleStartTest = async () => {
      try {
          const res = await apiClient.post(`/test-submissions/${testId}/start`);
          setAttempt(res.data.data);
          toast.success("Timer started! Good luck.");
      } catch (e) {
          toast.error(e.response?.data?.message || "Could not start test.");
      }
  };

  const handleFinalSubmit = async (isAuto = false) => {
    try {
        const res = await apiClient.post(`/test-submissions/${testId}/submit`);
        const updatedAttempt = res.data.data?.attempt || res.data.data;
        setAttempt(updatedAttempt); 
        
        clearInterval(timerIntervalRef.current);
        if (isAuto) {
            toast.error("Time is up! Exam auto-submitted.");
        } else {
            toast.success("Exam submitted successfully!");
        }
    } catch (error) {
        console.error("Submit Error:", error);
        toast.error(error.response?.data?.message || "Failed to submit exam.");
    }
  };

  // --- Blind Grading Move Logic ---
  const onDrop = async (sourceSquare, targetSquare) => {
    if (isMovingRef.current || !attempt || attempt.status !== 'in_progress') return false;

    const task = test.tasks[currentTaskIndex];
    // SAFETY FIX: Fallback to empty array
    const solvedTasks = attempt.solvedTasks || [];
    const isAlreadyAnswered = solvedTasks.some(t => t.taskId === task._id || t.taskId === task.chapterId);
    if (isAlreadyAnswered) return false;

    try {
        const gameCopy = new Chess(game.fen());
        const move = gameCopy.move({ from: sourceSquare, to: targetSquare, promotion: 'q' });
        if (!move) return false; 

        const expectedMoveIndex = game.history().length; 
        const expectedMove = solutionMoves[expectedMoveIndex];

        setGame(gameCopy);

        // BLIND GRADING
        if (!expectedMove || move.san !== expectedMove.san) {
            await recordTask(false, gameCopy.pgn());
            toast.message("Answer recorded", { description: "Moving to next challenge." });
            setTimeout(handleNext, 1000); 
            return true; 
        }

        if (expectedMoveIndex + 1 >= solutionMoves.length) {
            await recordTask(true, null);
            toast.message("Answer recorded", { description: "Moving to next challenge." });
            setTimeout(handleNext, 1000); 
            return true;
        }

        isMovingRef.current = true;
        setTimeout(async () => {
            const nextGameCopy = new Chess(gameCopy.fen());
            const computerMove = solutionMoves[expectedMoveIndex + 1];

            if (computerMove) {
                nextGameCopy.move(computerMove);
                setGame(nextGameCopy);
                if (expectedMoveIndex + 2 >= solutionMoves.length) {
                    await recordTask(true, null);
                    toast.message("Answer recorded", { description: "Moving to next challenge." });
                    setTimeout(handleNext, 1000);
                }
            }
            isMovingRef.current = false;
        }, 300);

        return true;
    } catch (e) {
        return false;
    }
  };

  const recordTask = async (isCorrect, overridePgn) => {
      const task = test.tasks[currentTaskIndex];
      try {
          const res = await apiClient.post(`/test-submissions/${testId}/solve`, {
              chapterId: task.chapterId, 
              isCorrect: isCorrect,
              overridePgn: overridePgn 
          });
          setAttempt(res.data.data);
      } catch (e) {
          console.error(e);
      }
  };

  const handleNext = () => currentTaskIndex < test.tasks.length - 1 && setCurrentTaskIndex(p => p + 1);
  const handlePrev = () => currentTaskIndex > 0 && setCurrentTaskIndex(p => p - 1);
  
  // --- Render Handling ---

  if (loading) return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center text-white">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500"/>
    </div>
  );

  // THE START GATE
  if (!attempt || attempt.status === 'not_started') {
      return (
          <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center text-white p-4">
              <div className="max-w-md w-full bg-[#131825] border border-white/10 rounded-3xl p-8 text-center shadow-2xl">
                  <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Clock className="w-10 h-10 text-blue-500"/>
                  </div>
                  <h1 className="text-2xl font-bold mb-2">{test.title}</h1>
                  <p className="text-gray-400 mb-6 text-sm">
                      This is a timed exam. Once you start, the timer cannot be paused. Make sure you have a stable connection and enough time to complete it.
                  </p>
                  
                  <div className="bg-black/30 rounded-xl p-4 mb-8 flex justify-around">
                      <div>
                          <div className="text-[10px] uppercase text-gray-500 font-bold">Time Limit</div>
                          <div className="font-mono text-lg text-white">{formatTime(test.timeLimit)}</div>
                      </div>
                      <div>
                          <div className="text-[10px] uppercase text-gray-500 font-bold">Questions</div>
                          <div className="font-mono text-lg text-white">{test.tasks.length}</div>
                      </div>
                  </div>

                  <button 
                      onClick={handleStartTest}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                      <PlayCircle className="w-5 h-5"/> Start Exam Now
                  </button>
                  <button onClick={() => navigate(-1)} className="mt-4 text-sm text-gray-500 hover:text-white">Cancel & Go Back</button>
              </div>
          </div>
      );
  }

  // EXAM RESULTS VIEW (Locked)
  if (attempt.status === 'completed' || attempt.status === 'timeout') {
      // SAFETY FIX: Using (attempt.solvedTasks || []) ensures .filter never crashes
      const safeSolvedTasks = attempt.solvedTasks || [];
      const correctCount = safeSolvedTasks.filter(t => t.isCorrect).length;
      const score = test.tasks?.length > 0 ? Math.round((correctCount / test.tasks.length) * test.rewardPoints) : 0;

      return (
          <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center text-white p-4">
              <div className="max-w-md w-full bg-[#131825] border border-white/10 rounded-3xl p-8 text-center shadow-2xl">
                  <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]"/>
                  <h1 className="text-2xl font-bold mb-2">Exam Completed</h1>
                  <p className="text-gray-400 mb-8 text-sm">Your answers have been submitted to your coach.</p>
                  
                  <div className="bg-black/30 rounded-xl p-6 mb-8 border border-white/5">
                      <div className="text-[10px] uppercase text-gray-500 font-bold tracking-widest mb-1">Final Score</div>
                      <div className="text-5xl font-black text-yellow-500">{score} <span className="text-lg text-gray-500 font-normal">/ {test.rewardPoints}</span></div>
                      
                      <div className="text-sm text-gray-400 mt-4">
                          You solved <span className="text-white font-bold">{correctCount} out of {test.tasks?.length || 0}</span> puzzles correctly.
                      </div>
                  </div>

                  <button onClick={() => navigate(-1)} className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl transition-all">
                      Return to Dashboard
                  </button>
              </div>
          </div>
      );
  }

  // --- ACTIVE EXAM ENVIRONMENT ---
  const currentTask = test.tasks[currentTaskIndex];
  
  // SAFETY FIX: Fallback to empty array
  const safeSolvedTasks = attempt.solvedTasks || [];
  const isCurrentTaskLocked = safeSolvedTasks.some(t => t.taskId === currentTask._id || t.taskId === currentTask.chapterId);
  const totalAnswered = safeSolvedTasks.length;

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white font-sans flex flex-col overflow-hidden selection:bg-blue-500/30">
      
      {/* Top Bar - Strict Exam Mode */}
      <header className="h-16 border-b border-white/10 bg-[#131825] flex items-center justify-between px-4 md:px-6 z-20 shrink-0">
        <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-md">
                <ChevronLeft className="w-4 h-4"/> Leave Exam (Timer runs)
            </button>
            <div className="hidden md:block">
                <h1 className="text-sm font-bold text-gray-200">{test.title}</h1>
            </div>
        </div>
        
        {/* TIMER */}
        <div className="flex items-center gap-3 bg-blue-900/20 border border-blue-500/30 px-4 py-1.5 rounded-lg">
            <Clock className={`w-4 h-4 ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-blue-400'}`}/>
            <span className={`font-mono text-lg font-bold tracking-wider ${timeLeft < 60 ? 'text-red-400' : 'text-white'}`}>
                {formatTime(timeLeft)}
            </span>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex flex-col md:flex-row h-[calc(100vh-4rem)]">
        
        {/* Left Sidebar: Navigating Questions */}
        <div className="w-full md:w-72 bg-[#131825] border-r border-white/5 overflow-y-auto hidden md:flex flex-col z-10">
            <div className="p-4 border-b border-white/5 flex justify-between items-center">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Questions</h3>
                <span className="text-xs font-mono text-blue-400">{totalAnswered} / {test.tasks.length} Done</span>
            </div>
            
            <div className="p-3 flex-1 overflow-y-auto space-y-1.5">
                {test.tasks.map((task, idx) => {
                    const isAnswered = safeSolvedTasks.some(t => t.taskId === task._id || t.taskId === task.chapterId);
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
                            {isAnswered ? (
                                <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center shrink-0">
                                    <span className="text-[10px] font-bold text-gray-400">✓</span>
                                </div>
                            ) : (
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${isActive ? 'border-blue-500 text-blue-500' : 'border-gray-600'}`}>
                                    <span className="text-[10px] font-bold">{idx + 1}</span>
                                </div>
                            )}
                            <span className={`text-sm font-medium line-clamp-1 ${isActive ? 'text-blue-100' : (isAnswered ? 'text-gray-500 line-through' : 'text-gray-300')}`}>
                                Question {idx + 1}
                            </span>
                        </div>
                    )
                })}
            </div>
            
            {/* Early Submit */}
            <div className="p-4 border-t border-white/5">
                <button 
                    onClick={() => { if(window.confirm("Are you sure you want to submit? You cannot change answers after.")) handleFinalSubmit(false); }}
                    className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3 rounded-xl font-bold transition-all"
                >
                    Submit Exam Early
                </button>
            </div>
        </div>

        {/* Center: Interactive Board */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 relative z-0 overflow-y-auto">
            
            <div className="w-full max-w-[600px] flex flex-col items-center">
                
                {/* Header & Turn Indicator Area */}
                <div className="w-full flex items-end justify-between mb-4 px-2">
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-1">Question {currentTaskIndex + 1}</h2>
                        {isCurrentTaskLocked ? (
                            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-gray-800 text-gray-400">
                                Answer Recorded
                            </span>
                        ) : (
                            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">
                                Find the best continuation
                            </span>
                        )}
                    </div>

                    {!isCurrentTaskLocked && (
                        <div className="flex items-center gap-2 bg-black/40 border border-white/10 px-3 py-1.5 rounded-lg shadow-sm">
                            <div className={`w-3.5 h-3.5 rounded-sm border ${game.turn() === 'w' ? 'bg-[#E4EBF2] border-gray-400' : 'bg-[#47638A] border-black shadow-inner'}`}></div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-300">
                                {game.turn() === 'w' ? 'White to play' : 'Black to play'}
                            </span>
                        </div>
                    )}
                </div>

                {/* Board Container */}
                <div className={`w-full relative rounded-md p-1.5 transition-all duration-300 shadow-2xl ${
                    isCurrentTaskLocked ? 'bg-white/5 shadow-none opacity-50' : 'bg-white/10 shadow-black/50'
                }`}>
                    <div className="rounded overflow-hidden relative">
                        <Chessboard 
                            position={game.fen()} 
                            onPieceDrop={onDrop}
                            animationDuration={200}
                            customDarkSquareStyle={{ backgroundColor: '#47638A' }} 
                            customLightSquareStyle={{ backgroundColor: '#E4EBF2' }}
                            arePiecesDraggable={!isCurrentTaskLocked}
                        />
                        
                        {/* Overlay to block interaction and guide to next question/submit */}
                        <AnimatePresence>
                            {isCurrentTaskLocked && (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center z-20 backdrop-blur-sm"
                                >
                                    <div className="bg-[#131825] border border-white/10 p-6 rounded-2xl text-center shadow-2xl">
                                        <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Circle className="w-6 h-6 text-gray-400 fill-gray-400"/>
                                        </div>
                                        <h3 className="font-bold text-white mb-4">Response Locked In</h3>
                                        <button 
                                            onClick={() => {
                                                if (currentTaskIndex >= test.tasks.length - 1) {
                                                    if (window.confirm("Submit your exam now?")) handleFinalSubmit(false);
                                                } else {
                                                    handleNext();
                                                }
                                            }}
                                            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-lg transition-all"
                                        >
                                            {currentTaskIndex >= test.tasks.length - 1 ? "Submit Exam" : "Go to Next Question"}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className="w-full flex md:hidden justify-between items-center bg-[#131825] border border-white/5 rounded-xl p-2 mt-6">
                    <button disabled={currentTaskIndex === 0} onClick={handlePrev} className="p-3 rounded hover:bg-white/5 disabled:opacity-30">
                        <ChevronLeft className="w-5 h-5"/>
                    </button>
                    
                    <span className="text-xs font-mono text-gray-400">{currentTaskIndex + 1} / {test.tasks.length}</span>
                    
                    {currentTaskIndex >= test.tasks.length - 1 ? (
                        <button 
                            onClick={() => { if(window.confirm("Submit your exam now?")) handleFinalSubmit(false); }}
                            className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1 transition-all"
                        >
                            <Send className="w-3.5 h-3.5"/> Submit
                        </button>
                    ) : (
                        <button onClick={handleNext} className="p-3 rounded hover:bg-white/5">
                            <ArrowRight className="w-5 h-5"/>
                        </button>
                    )}
                </div>

            </div>
        </div>
      </div>
    </div>
  );
};

export default StudentTestSolver;