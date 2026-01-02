import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { io } from 'socket.io-client';
import { 
    Mic, MicOff, Video, VideoOff, PhoneOff, 
    RotateCcw, ChevronLeft, ChevronRight, 
    MessageSquare, Users, List, Repeat, MonitorUp,
    Download, Clipboard, X
} from 'lucide-react';
import { toast } from 'sonner';

// Keep using the socket URL that is already working for you
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'https://pawnrace-backend-socket.onrender.com';

const VideoClassroom = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const socketRef = useRef(null); 

    // --- State ---
    const [game, setGame] = useState(new Chess());
    const [orientation, setOrientation] = useState('white');
    const [activeTab, setActiveTab] = useState('moves'); 
    const [micOn, setMicOn] = useState(true);
    const [cameraOn, setCameraOn] = useState(true);
    const [history, setHistory] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    
    // PGN Modal State
    const [showPGNModal, setShowPGNModal] = useState(false);
    const [pgnInput, setPgnInput] = useState("");

    // --- 1. SOCKET CONNECTION ---
    useEffect(() => {
        socketRef.current = io(SOCKET_URL);

        socketRef.current.on('connect', () => {
            console.log("Connected to Classroom Socket:", socketRef.current.id);
            setIsConnected(true);
            socketRef.current.emit('join_room', roomId);
        });

        // Listen for Incoming Moves
        socketRef.current.on('receive_move', (moveData) => {
            setGame((prevGame) => {
                // IMPORTANT: We clone the PREVIOUS game instance to keep history
                const gameCopy = new Chess(prevGame.fen());
                
                // If we have history in the previous game, we try to restore it? 
                // Actually, relying on FEN destroys history. 
                // We must try to apply the move to the EXISTING game state if possible.
                
                if (moveData.from && moveData.to) {
                    try {
                        const result = gameCopy.move({
                            from: moveData.from,
                            to: moveData.to,
                            promotion: moveData.promotion || 'q'
                        });
                        
                        if (result) {
                            setHistory(gameCopy.history()); // Update history from the active chain
                            return gameCopy;
                        }
                    } catch (e) {
                        console.error("Move failed locally:", e);
                    }
                }

                // Fallback: If move fails or isn't provided, load FEN (History will be lost here, but game stays synced)
                const fenGame = new Chess(moveData.fen || prevGame.fen());
                setHistory(fenGame.history()); // Likely empty if loaded from FEN
                return fenGame;
            });
        });

        return () => {
            if (socketRef.current) socketRef.current.disconnect();
        };
    }, [roomId]);

    // --- 2. CHESS LOGIC ---
    function onDrop(sourceSquare, targetSquare) {
        try {
            const tempGame = new Chess(game.fen());
            
            // 1. Attempt Move
            const move = tempGame.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: 'q',
            });

            if (move === null) return false;

            // 2. Update Local State immediately
            setGame(tempGame);
            setHistory(tempGame.history()); // This gets the full history array ['e4', 'e5'...]

            // 3. Emit Move
            if (socketRef.current) {
                socketRef.current.emit('make_move', {
                    roomId,
                    move: { from: sourceSquare, to: targetSquare, promotion: 'q' },
                    fen: tempGame.fen()
                });
            }
            return true;
        } catch (error) {
            return false;
        }
    }

    const resetGame = () => {
        const newGame = new Chess();
        setGame(newGame);
        setHistory([]);
        // Optional: Emit reset if your socket supports it
        // socketRef.current.emit('reset_game', { roomId }); 
    };

    const flipBoard = () => {
        setOrientation(orientation === 'white' ? 'black' : 'white');
    };

    // --- 3. PGN FUNCTIONS ---
    const handleDownloadPGN = () => {
        const pgn = game.pgn();
        const blob = new Blob([pgn], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `game_${roomId}.pgn`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        toast.success("PGN Downloaded");
    };

    const handleLoadPGN = () => {
        try {
            const newGame = new Chess();
            newGame.loadPgn(pgnInput);
            setGame(newGame);
            setHistory(newGame.history());
            setPgnInput("");
            setShowPGNModal(false);
            
            // Broadcast the new position (as a move/fen update)
            if (socketRef.current) {
                socketRef.current.emit('make_move', {
                    roomId,
                    fen: newGame.fen() // Sending FEN forces other clients to sync to this position
                });
            }
            toast.success("PGN Loaded successfully");
        } catch (error) {
            toast.error("Invalid PGN format");
        }
    };

    return (
        <div className="h-screen bg-[#111] text-white flex flex-col overflow-hidden">
            
            {/* HEADER */}
            <header className="h-14 bg-[#1a1a1a] border-b border-gray-800 flex items-center justify-between px-4 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                        <span className="font-bold text-gray-200 text-sm">Classroom Session</span>
                        <span className="text-xs text-gray-500 font-mono">ID: {roomId}</span>
                    </div>
                    <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${isConnected ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
                        {isConnected ? 'Live' : 'Connecting...'}
                    </span>
                </div>
                
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors shadow-lg shadow-red-900/20">
                        <PhoneOff className="w-4 h-4" /> Exit Class
                    </button>
                </div>
            </header>

            {/* MAIN CONTENT */}
            <div className="flex-1 flex overflow-hidden">
                
                {/* LEFT: CHESS BOARD */}
                <div className="flex-1 bg-[#0f0f0f] relative flex flex-col">
                    <div className="flex-1 flex items-center justify-center p-2 bg-[#161616]">
                        <div className="w-full max-w-[85vh] aspect-square shadow-2xl rounded-sm overflow-hidden border-4 border-[#262421]">
                            <Chessboard 
                                position={game.fen()} 
                                onPieceDrop={onDrop}
                                boardOrientation={orientation}
                                customDarkSquareStyle={{ backgroundColor: '#779954' }}
                                customLightSquareStyle={{ backgroundColor: '#e9edcc' }}
                                animationDuration={200}
                            />
                        </div>
                    </div>

                    {/* Toolbar */}
                    <div className="h-14 bg-[#1a1a1a] border-t border-gray-800 flex items-center justify-center gap-6 px-4 shrink-0">
                        <div className="flex items-center gap-2 bg-black/30 rounded-lg p-1">
                            <button onClick={() => { game.undo(); setGame(new Chess(game.fen())); setHistory(game.history()); }} className="p-2 hover:bg-gray-700 rounded-md text-gray-400 hover:text-white"><ChevronLeft className="w-6 h-6" /></button>
                            <button className="p-2 hover:bg-gray-700 rounded-md text-gray-400 hover:text-white"><ChevronRight className="w-6 h-6" /></button>
                        </div>
                        <div className="h-6 w-px bg-gray-700"></div>
                        <button onClick={resetGame} className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-700 rounded-md text-gray-400 hover:text-white text-sm"><RotateCcw className="w-4 h-4" /> Reset</button>
                        <button onClick={flipBoard} className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-700 rounded-md text-gray-400 hover:text-white text-sm"><Repeat className="w-4 h-4" /> Flip</button>
                    </div>
                </div>

                {/* RIGHT: SIDEBAR */}
                <div className="w-[350px] bg-[#1a1a1a] border-l border-gray-800 flex flex-col shrink-0">
                    
                    {/* Video Placeholder */}
                    <div className="w-full aspect-video bg-black relative group border-b border-gray-800 flex items-center justify-center text-gray-600">
                        <div className="text-center">
                            <MonitorUp className="w-8 h-8 mx-auto mb-2 opacity-50"/>
                            <span className="text-sm">Video Feed Ready</span>
                        </div>
                        <div className="absolute bottom-4 flex gap-3">
                             <button onClick={() => setMicOn(!micOn)} className={`p-2 rounded-full ${micOn ? 'bg-gray-800' : 'bg-red-600'}`}>{micOn ? <Mic className="w-4 h-4"/> : <MicOff className="w-4 h-4"/>}</button>
                             <button onClick={() => setCameraOn(!cameraOn)} className={`p-2 rounded-full ${cameraOn ? 'bg-gray-800' : 'bg-red-600'}`}>{cameraOn ? <Video className="w-4 h-4"/> : <VideoOff className="w-4 h-4"/>}</button>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex border-b border-gray-800 bg-[#202020]">
                        <button onClick={() => setActiveTab('moves')} className={`flex-1 py-3 text-xs font-bold uppercase ${activeTab === 'moves' ? 'text-violet-400 border-b-2 border-violet-400' : 'text-gray-500'}`}><List className="w-4 h-4 inline mr-1"/> Moves</button>
                        <button onClick={() => setActiveTab('chat')} className={`flex-1 py-3 text-xs font-bold uppercase ${activeTab === 'chat' ? 'text-violet-400 border-b-2 border-violet-400' : 'text-gray-500'}`}><MessageSquare className="w-4 h-4 inline mr-1"/> Chat</button>
                        <button onClick={() => setActiveTab('students')} className={`flex-1 py-3 text-xs font-bold uppercase ${activeTab === 'students' ? 'text-violet-400 border-b-2 border-violet-400' : 'text-gray-500'}`}><Users className="w-4 h-4 inline mr-1"/> Users</button>
                    </div>

                    {/* Tab Content */}
                    <div className="flex-1 bg-[#1a1a1a] overflow-hidden flex flex-col relative">
                        {activeTab === 'moves' && (
                             <div className="absolute inset-0 overflow-y-auto p-0 scrollbar-thin scrollbar-thumb-gray-700 flex flex-col">
                                {/* Moves Table */}
                                <div className="flex-1">
                                    <table className="w-full text-sm border-collapse">
                                        <thead className="bg-[#252525] text-gray-400 text-xs sticky top-0"><tr><th className="py-1 pl-4 text-left w-12">#</th><th className="py-1 text-left">White</th><th className="py-1 text-left">Black</th></tr></thead>
                                        <tbody>
                                            {Array.from({ length: Math.ceil(history.length / 2) }).map((_, i) => (
                                                <tr key={i} className="border-b border-gray-800 hover:bg-white/5"><td className="py-1.5 pl-4 text-gray-500 font-mono text-xs">{i + 1}.</td><td className="py-1.5 text-gray-300">{history[i * 2]}</td><td className="py-1.5 text-gray-300">{history[i * 2 + 1] || ''}</td></tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                
                                {/* PGN Controls */}
                                <div className="p-3 bg-[#202020] border-t border-gray-700 grid grid-cols-2 gap-2">
                                    <button 
                                        onClick={() => setShowPGNModal(true)} 
                                        className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 py-2 rounded text-xs font-bold"
                                    >
                                        <Clipboard className="w-3 h-3"/> Paste PGN
                                    </button>
                                    <button 
                                        onClick={handleDownloadPGN} 
                                        className="flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 py-2 rounded text-xs font-bold"
                                    >
                                        <Download className="w-3 h-3"/> Download
                                    </button>
                                </div>
                            </div>
                        )}
                        {activeTab === 'chat' && <div className="p-4 text-gray-500 text-center text-sm">Chat connecting...</div>}
                    </div>
                </div>
            </div>

            {/* PGN MODAL */}
            {showPGNModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1e1e1e] border border-gray-700 rounded-xl p-6 w-full max-w-lg relative">
                        <button onClick={() => setShowPGNModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X className="w-5 h-5"/></button>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Clipboard className="w-5 h-5 text-violet-400"/> Load Game from PGN</h2>
                        <textarea 
                            value={pgnInput}
                            onChange={(e) => setPgnInput(e.target.value)}
                            placeholder="Paste your PGN string here..."
                            className="w-full h-40 bg-black/50 border border-gray-600 rounded-lg p-3 text-sm font-mono text-gray-300 focus:outline-none focus:border-violet-500 mb-4 resize-none"
                        ></textarea>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setShowPGNModal(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-white">Cancel</button>
                            <button onClick={handleLoadPGN} className="px-6 py-2 bg-violet-600 hover:bg-violet-700 rounded text-sm font-bold text-white">Load Game</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VideoClassroom;