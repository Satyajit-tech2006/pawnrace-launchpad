import React, { useEffect, useRef, useState, useCallback } from "react";
import Chessboard from "chessboardjsx";
import { Chess, Move } from "chess.js";
import { io, Socket } from "socket.io-client";
import { useLocation } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area"; 
import { Button } from "@/components/ui/button";
import { 
  RefreshCw, 
  Cpu, 
  EyeOff, 
  Eye, 
  Trophy,
  Copy,
  Flag
} from "lucide-react";
import apiClient from "../lib/api"; 
import { toast } from "sonner"; 

type Props = {
  roomId: string;
  serverUrl?: string;
  startFEN?: string;
  headerHeight?: number;
};

export default function ChessGame({
  roomId,
  serverUrl = import.meta.env.VITE_SOCKET_URL,
  startFEN,
  headerHeight = 64,
}: Props) {
  // --- Game State ---
  const [game] = useState(() => new Chess(startFEN));
  const [fen, setFen] = useState<string>(game.fen());
  const [history, setHistory] = useState<string[]>([]);
  const [pgn, setPgn] = useState<string>("");

  // --- UI/Settings State ---
  const [myColor, setMyColor] = useState<"w" | "b" | null>(null);
  const [boardSize, setBoardSize] = useState<number>(560);
  const [showLegalHints, setShowLegalHints] = useState(true); // Default ON
  const [isEngineThinking, setIsEngineThinking] = useState(false);

  // --- Interaction State ---
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [legalMoves, setLegalMoves] = useState<string[]>([]);
  const [winner, setWinner] = useState<"w" | "b" | "draw" | null>(null);

  // --- Refs ---
  const socketRef = useRef<Socket | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();

  // Orientation
  const orientation = myColor === "b" ? "black" : "white";
  const isMyTurn = myColor && game.turn() === myColor;

  // Colors Palette
  const palette = {
    highlightOrigin: "rgba(255, 255, 0, 0.5)",
    highlightTarget: "radial-gradient(circle, rgba(0,0,0,0.2) 25%, transparent 30%)", 
    highlightCheck: "rgba(255, 0, 0, 0.6)",
  };

  /* -------------------------------------------------------------------------- */
  /* SOCKET LOGIC                                */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    // Connect to Socket
    const socket = io(serverUrl, { transports: ["websocket", "polling"] });
    socketRef.current = socket;
    
    const creatorColor = location.state?.playerColor;

    // Join Room
    socket.emit("joinRoom", { roomId, playerColor: creatorColor });

    // Listeners
    socket.on("colorAssigned", ({ color }) => {
      setMyColor(color);
      toast.info(`You are playing as ${color === "w" ? "White" : "Black"}`);
    });

    socket.on("opponentMove", ({ fen: newFen }) => {
      if (newFen) {
        // Update local game instance with opponent's move
        game.load(newFen);
        updateGameState();
        checkGameOverAndAnnounce();
        playMoveSound();
      }
    });

    socket.on("peer_left", () => toast.error("Opponent disconnected"));

    return () => {
      socket.disconnect();
    };
  }, [roomId, serverUrl]);

  /* -------------------------------------------------------------------------- */
  /* GAME LOGIC & HELPERS                        */
  /* -------------------------------------------------------------------------- */
  
  const updateGameState = () => {
    setFen(game.fen());
    setHistory(game.history());
    setPgn(game.pgn());
  };

  const playMoveSound = () => {
    // Optional: Add Audio logic here
    // const audio = new Audio('/move-self.mp3');
    // audio.play().catch(() => {});
  };

  // Check Game Over & Save to DB
  const checkGameOverAndAnnounce = () => {
    if (game.isGameOver()) {
      let result: "w" | "b" | "draw" = "draw";
      if (game.isCheckmate()) result = game.turn() === "w" ? "b" : "w";
      
      setWinner(result);
      saveGameToDB(result); 
    }
  };

  // Save Game to Database
  const saveGameToDB = async (result: string) => {
    try {
      const resultText = result === 'w' ? 'White Won' : result === 'b' ? 'Black Won' : 'Draw';
      
      // Ensure backend has this endpoint
      await apiClient.post("/games/save", {
        roomId,
        pgn: game.pgn(),
        result,
        winner: resultText,
        playedAt: new Date()
      });
      toast.success("Game result saved to database!");
    } catch (error) {
      console.error("Failed to save game", error);
    }
  };

  // Execute Move
  const makeMove = (move: string | { from: string; to: string; promotion?: string }) => {
    try {
      const result = game.move(move); // chess.js validation
      if (result) {
        updateGameState();
        setSelectedSquare(null);
        setLegalMoves([]);
        playMoveSound();
        
        // Emit to server
        socketRef.current?.emit("makeMove", {
          roomId,
          fen: game.fen(),
          pgn: game.pgn(),
          move: result
        });

        checkGameOverAndAnnounce();
        return true;
      }
    } catch (e) {
      return false;
    }
    return false;
  };

  /* -------------------------------------------------------------------------- */
  /* KEYBOARD FEATURES (E & I)                   */
  /* -------------------------------------------------------------------------- */
  
  // 1. Engine Move (Key: E)
  const triggerEngineMove = useCallback(() => {
    if (!isMyTurn || game.isGameOver()) {
        if(!isMyTurn) toast.warning("It's not your turn!");
        return;
    }

    setIsEngineThinking(true);
    toast.loading("Engine is calculating...", { duration: 1000 });

    // SIMULATED ENGINE LOGIC (Replace with Stockfish API if needed)
    setTimeout(() => {
      const moves = game.moves();
      if (moves.length > 0) {
        // Pick a random legal move (Basic Engine)
        const randomMove = moves[Math.floor(Math.random() * moves.length)];
        makeMove(randomMove);
        toast.dismiss();
        toast.success("Engine played a move!");
      }
      setIsEngineThinking(false);
    }, 800); 
  }, [isMyTurn, game]);

  // 2. Toggle Illegal Moves / Hints (Key: I)
  const toggleIllegalHints = useCallback(() => {
    setShowLegalHints(prev => !prev);
    toast(showLegalHints ? "Hints Hidden (Hardcore Mode)" : "Hints Visible");
  }, [showLegalHints]);

  // Listen for Keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key.toLowerCase() === 'e') triggerEngineMove();
      if (e.key.toLowerCase() === 'i') toggleIllegalHints();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerEngineMove, toggleIllegalHints]);


  /* -------------------------------------------------------------------------- */
  /* BOARD INTERACTION                           */
  /* -------------------------------------------------------------------------- */
  
  const onSquareClick = (square: string) => {
    // Block interaction if not my turn or game over
    if (!myColor || game.turn() !== myColor || game.isGameOver()) return;

    // 1. Attempt to move to clicked square (if piece already selected)
    if (selectedSquare) {
      const moveAttempt = makeMove({ from: selectedSquare, to: square, promotion: "q" });
      if (moveAttempt) return; // Stop if move succeeded
    }

    // 2. Select new piece
    const piece = game.get(square as any);
    if (piece && piece.color === myColor) {
      setSelectedSquare(square);
      // Calculate legal moves for highlighting
      const moves = game.moves({ square: square as any, verbose: true });
      setLegalMoves(moves.map(m => m.to));
    } else {
      // Clicked empty square or opponent piece without selection -> Deselect
      setSelectedSquare(null);
      setLegalMoves([]);
    }
  };

  /* -------------------------------------------------------------------------- */
  /* STYLES & RENDERING                          */
  /* -------------------------------------------------------------------------- */

  // Calculate Board Size Responsively
  useEffect(() => {
    const handleResize = () => {
       if (containerRef.current) {
           const width = containerRef.current.offsetWidth;
           const height = window.innerHeight - 180; // Buffer for headers
           setBoardSize(Math.min(width, height, 600));
       }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getSquareStyles = () => {
    const styles: Record<string, React.CSSProperties> = {};

    // 1. Highlight Selected Square
    if (selectedSquare) {
      styles[selectedSquare] = { background: palette.highlightOrigin };
    }

    // 2. Highlight Legal Moves (Only if 'I' toggle is ON)
    if (showLegalHints) {
        legalMoves.forEach(sq => {
            const isCapture = game.get(sq as any);
            styles[sq] = {
                background: isCapture 
                    ? "radial-gradient(circle, transparent 20%, rgba(255,0,0,0.5) 20%)" // Capture Ring
                    : "radial-gradient(circle, rgba(0,0,0,0.2) 25%, transparent 30%)", // Move Dot
                borderRadius: isCapture ? "0%" : "50%"
            };
        });
    }

    // 3. Highlight King in Check
    if (game.inCheck()) {
        game.board().forEach((row, rIdx) => {
            row.forEach((piece, cIdx) => {
                if (piece && piece.type === 'k' && piece.color === game.turn()) {
                    const square = `${String.fromCharCode(97 + cIdx)}${8 - rIdx}`;
                    styles[square] = { background: palette.highlightCheck };
                }
            });
        });
    }

    return styles;
  };


  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#111] text-white overflow-hidden">
      
      {/* --- LEFT: Game Board Area --- */}
      <div 
        ref={containerRef}
        className="flex-1 flex flex-col items-center justify-center p-2 bg-[#1a1a1a] relative"
      >
        {/* Top Bar: Opponent Info */}
        <div className="w-full max-w-[600px] flex justify-between items-center mb-2 px-2">
           <div className="flex items-center gap-3">
             <div className={`w-3 h-3 rounded-full ${!isMyTurn && !winner ? 'bg-yellow-500 animate-pulse' : 'bg-gray-600'}`}></div>
             <span className="text-gray-300 font-medium">Opponent</span>
           </div>
           <div className="text-gray-500 text-sm font-mono">Room: {roomId}</div>
        </div>

        {/* --- CHESSBOARD --- */}
        <div className="relative shadow-2xl border-[4px] border-[#333] rounded-sm bg-[#333]">
            
            {/* Game Over Overlay */}
            {winner && (
                <div className="absolute inset-0 z-20 bg-black/80 flex flex-col items-center justify-center backdrop-blur-sm animate-in fade-in duration-300">
                    <Trophy className="w-16 h-16 text-yellow-500 mb-4 drop-shadow-lg" />
                    <h2 className="text-4xl font-bold text-white mb-2">
                        {winner === 'w' ? "White Wins!" : winner === 'b' ? "Black Wins!" : "Draw!"}
                    </h2>
                    <Button onClick={() => window.location.reload()} variant="secondary" className="mt-4">
                        <RefreshCw className="w-4 h-4 mr-2"/> Play Again
                    </Button>
                </div>
            )}
            
            <Chessboard
                position={fen}
                orientation={orientation}
                width={boardSize}
                draggable={false} // Click-to-move is preferred
                onSquareClick={onSquareClick}
                squareStyles={getSquareStyles()}
                lightSquareStyle={{ backgroundColor: "#eeeed2" }}
                darkSquareStyle={{ backgroundColor: "#769656" }}
                transitionDuration={200}
            />
        </div>

        {/* Bottom Bar: Player Info & Hotkeys */}
        <div className="w-full max-w-[600px] flex justify-between items-end mt-3 px-2">
             <div className="flex items-center gap-3">
                 <div className="flex items-center gap-2 bg-[#252525] px-4 py-2 rounded-lg border border-white/5">
                    <span className="w-3 h-3 rounded-full shadow-sm" style={{ background: myColor === 'w' ? 'white' : 'black', border: '1px solid gray' }}></span>
                    <div>
                        <p className="text-sm font-bold leading-none">{myColor === 'w' ? 'You (White)' : 'You (Black)'}</p>
                        <p className={`text-xs mt-1 ${isMyTurn ? 'text-green-400' : 'text-gray-500'}`}>
                            {isMyTurn ? 'Your Turn' : 'Waiting...'}
                        </p>
                    </div>
                 </div>
             </div>
             
             {/* Hotkey Legend */}
             <div className="hidden sm:flex gap-3 text-xs text-gray-500 font-mono">
                <span className="flex items-center gap-1 bg-black/30 px-2 py-1 rounded"><kbd className="text-white">E</kbd> Engine</span>
                <span className="flex items-center gap-1 bg-black/30 px-2 py-1 rounded"><kbd className="text-white">I</kbd> Hints</span>
             </div>
        </div>
      </div>


      {/* --- RIGHT: Sidebar Panel (History & Controls) --- */}
      <div className="w-full lg:w-[320px] bg-[#111] border-l border-white/10 flex flex-col shadow-2xl z-10">
        
        {/* Header */}
        <div className="p-4 border-b border-white/10 bg-[#161616] flex justify-between items-center">
            <h2 className="text-lg font-bold flex items-center gap-2 text-gray-200">
                <Flag className="w-5 h-5 text-violet-500" /> Match Details
            </h2>
            {/* Copy PGN Button */}
            <Button variant="ghost" size="icon" onClick={() => { navigator.clipboard.writeText(pgn); toast.success("PGN Copied!"); }}>
                <Copy className="w-4 h-4 text-gray-400" />
            </Button>
        </div>

        {/* Move History (PGN Grid) */}
        <div className="flex-1 relative bg-[#1c1c1c]">
            <div className="absolute top-0 left-0 w-full p-2 bg-[#222] text-[10px] tracking-widest text-center text-gray-500 font-mono border-b border-white/5 uppercase">
                Move History
            </div>
            <ScrollArea className="h-full pt-10 pb-4 px-2">
                <div className="grid grid-cols-[30px_1fr_1fr] gap-y-1 text-sm font-mono">
                    {history.map((move, index) => {
                        const moveNumber = Math.floor(index / 2) + 1;
                        const isWhite = index % 2 === 0;
                        
                        return isWhite ? (
                            <React.Fragment key={index}>
                                <div className="text-gray-600 text-right pr-2 py-1">{moveNumber}.</div>
                                <div className="text-gray-200 bg-white/5 px-2 py-1 rounded hover:bg-white/10 cursor-pointer transition text-center border border-transparent hover:border-white/20">
                                    {move}
                                </div>
                            </React.Fragment>
                        ) : (
                            <div key={index} className="text-gray-200 bg-white/5 px-2 py-1 rounded hover:bg-white/10 cursor-pointer transition text-center border border-transparent hover:border-white/20">
                                {move}
                            </div>
                        );
                    })}
                </div>
            </ScrollArea>
        </div>

        {/* Action Controls */}
        <div className="p-4 bg-[#161616] border-t border-white/10 space-y-3">
            
            {/* Engine Button */}
            <Button 
                onClick={triggerEngineMove} 
                disabled={!isMyTurn || isEngineThinking || Boolean(winner)}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white flex justify-between group transition-all"
            >
                <span className="flex items-center gap-2">
                    <Cpu className={`w-4 h-4 ${isEngineThinking ? 'animate-spin' : ''}`}/> 
                    {isEngineThinking ? "Thinking..." : "Play Engine Move"}
                </span>
                <span className="bg-black/20 text-[10px] px-1.5 py-0.5 rounded text-violet-200 group-hover:bg-black/30">E</span>
            </Button>

            {/* Hint Toggle */}
            <Button 
                onClick={toggleIllegalHints}
                variant="outline"
                className="w-full border-gray-700 bg-transparent text-gray-300 hover:bg-white/5 flex justify-between group"
            >
                <span className="flex items-center gap-2">
                    {showLegalHints ? <Eye className="w-4 h-4 text-green-400"/> : <EyeOff className="w-4 h-4 text-red-400"/>} 
                    {showLegalHints ? "Hints On" : "Hints Off"}
                </span>
                <span className="bg-white/10 text-[10px] px-1.5 py-0.5 rounded text-gray-400 group-hover:bg-white/20">I</span>
            </Button>

            <div className="grid grid-cols-2 gap-2 mt-2">
                <Button variant="secondary" className="w-full" onClick={() => window.location.reload()}>
                   Resign
                </Button>
                <Button variant="ghost" className="w-full text-gray-400 hover:text-white" onClick={() => toast("Draw offer functionality coming soon!")}>
                   Offer Draw
                </Button>
            </div>
        </div>

      </div>
    </div>
  );
}