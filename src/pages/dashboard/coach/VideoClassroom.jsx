import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { io } from 'socket.io-client';
import { PhoneOff, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from "../../../contexts/AuthContext";
import { useBoardDrawing } from '../../../hooks/useBoardDrawing'; 

// --- IMPORTS FOR FEATURES ---
import AnalysisTools from './Classroom_features/AnalysisTools';
import ClassroomSidebar from './Classroom_features/ClassroomSidebar';
import CoordinateOverlay from './Classroom_features/CoordinateOverlay';
import SetupPosition from './Classroom_features/SetupPosition';
import Syllabus from './Classroom_features/Syllabus';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ;

const VideoClassroom = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const socketRef = useRef(null); 
    const { user } = useAuth();

    // --- Game State ---
    const [connectedUsers, setConnectedUsers] = useState([]);
    const [game, setGame] = useState(new Chess());
    const [currentPgn, setCurrentPgn] = useState(""); 

    // --- REFERENCE STATE (For PGN Tab) ---
    const [referenceHistory, setReferenceHistory] = useState([]);
    const [referenceStartFen, setReferenceStartFen] = useState('start');

    // --- Board State ---
    const [customFen, setCustomFen] = useState(null); 
    const [illegalMode, setIllegalMode] = useState(true);
    const [startFen, setStartFen] = useState('start');
    const [orientation, setOrientation] = useState('white');
    const [history, setHistory] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    
    // -1 = Start Position, 0...N = Moves
    const [viewIndex, setViewIndex] = useState(-1);
    const [boardWidth, setBoardWidth] = useState(600);
    
    // --- Playlist ---
    const [playlist, setPlaylist] = useState([]); 
    const [currentChapterIndex, setCurrentChapterIndex] = useState(-1); 

    // --- UI & Controls ---
    const [boardKey, setBoardKey] = useState(0); 
    const [showTools, setShowTools] = useState(true);
    const [showCoordinates, setShowCoordinates] = useState(true);
    const [showSetupModal, setShowSetupModal] = useState(false);
    const [showSyllabusModal, setShowSyllabusModal] = useState(false); 
    
    const [activeTab, setActiveTab] = useState('moves');
    const [micOn, setMicOn] = useState(true);
    const [cameraOn, setCameraOn] = useState(true);
    const [chatMessages, setChatMessages] = useState([]);
    const [controls, setControls] = useState({ white: null, black: null });

    const drawing = useBoardDrawing(orientation);

    // --- FIX: Create a ref to track the latest state for socket listeners ---
    const gameStateRef = useRef({
        currentPgn, startFen, history, viewIndex, customFen, referenceHistory, referenceStartFen, game
    });

    useEffect(() => {
        gameStateRef.current = {
            currentPgn, startFen, history, viewIndex, customFen, referenceHistory, referenceStartFen, game
        };
    }, [currentPgn, startFen, history, viewIndex, customFen, referenceHistory, referenceStartFen, game]);

    // --- 1. RESIZE ---
    useEffect(() => {
        function handleResize() { setBoardWidth(Math.min(window.innerHeight * 0.70, 600)); }
        window.addEventListener('resize', handleResize);
        handleResize(); 
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // --- 2. SOCKETS ---
    useEffect(() => {
        socketRef.current = io(SOCKET_URL);
        
        socketRef.current.on('connect', () => { 
            setIsConnected(true); 
            const userInfo = {
                name: user?.fullname || user?.username || "Coach", 
                role: user?.role === 'coach' ? "Coach" : "Student", 
                _id: user?._id
            };
            socketRef.current.emit('join_room', { roomId, user: userInfo }); 
            
            // If I am a student, ask for the current state immediately
            if (user?.role !== 'coach') {
                socketRef.current.emit('request_sync', roomId);
            }
        });
        
        socketRef.current.on('update_user_list', (users) => setConnectedUsers(users));
        socketRef.current.on('controls_updated', (newControls) => setControls(newControls));

        // --- SYNC LOGIC ---
        socketRef.current.on('perform_sync', (requesterId) => {
            if (user?.role === 'coach') {
                const state = gameStateRef.current; // Grab fresh state using the ref
                socketRef.current.emit('send_sync_data', {
                    targetId: requesterId,
                    pgn: state.currentPgn,
                    startFen: state.startFen,
                    history: state.history,
                    viewIndex: state.viewIndex,
                    fen: state.customFen || state.game.fen(),
                    referenceHistory: state.referenceHistory,
                    referenceStartFen: state.referenceStartFen
                });
            }
        });

        socketRef.current.on('receive_sync_data', (data) => {
            // Priority: Load PGN if available
            if (data.pgn) {
                loadGameFromPgn(data.pgn, "Synced Game", true, data.viewIndex); // Pass target viewIndex
                if (data.referenceHistory) setReferenceHistory(data.referenceHistory);
                if (data.referenceStartFen) setReferenceStartFen(data.referenceStartFen);
            } else if (data.fen) {
                setCustomFen(data.fen);
                setStartFen(data.fen);
                setGame(new Chess());
                setHistory([]);
                setViewIndex(-1);
                setBoardKey(prev => prev + 1);
            }
        });

        // --- LESSON LOADED (Fix for StudB seeing end) ---
        socketRef.current.on('receive_pgn', (data) => {
            // When Coach loads a PGN, students receive this.
            // true = skipEmit (don't re-broadcast)
            loadGameFromPgn(data.pgn, "Coach Loaded Lesson", true);
        });

        socketRef.current.on('receive_move', (moveData) => {
            if (moveData.fen && !moveData.from) {
                // Forced FEN update (e.g., reset or branch)
                setCustomFen(null); 
                setBoardKey(prev => prev + 1);
                try {
                    const fenGame = new Chess(moveData.fen);
                    setGame(fenGame);
                    setStartFen(moveData.fen);
                    setHistory([]);
                    setCurrentPgn(fenGame.pgn());
                    setViewIndex(-1); 
                } catch (e) {
                    setCustomFen(moveData.fen);
                    setGame(new Chess());
                    setStartFen(moveData.fen);
                    setViewIndex(-1);
                }
                return;
            }

            setGame((prevGame) => {
                const gameCopy = new Chess();
                try {
                    gameCopy.loadPgn(prevGame.pgn());
                    if (moveData.from) gameCopy.move(moveData);
                    const newHistory = gameCopy.history();
                    setHistory(newHistory); 
                    setCurrentPgn(gameCopy.pgn());
                    setViewIndex(newHistory.length - 1); 
                    setCustomFen(null);
                    return gameCopy;
                } catch (e) { return new Chess(); }
            });
        });

        socketRef.current.on('receive_annotations', (data) => {
            drawing.setArrows(data.arrows || []);
            drawing.setSquares(data.squares || {});
        });

        socketRef.current.on('receive_message', (data) => setChatMessages(prev => [...prev, { ...data, isMe: false }]));

        return () => { if (socketRef.current) socketRef.current.disconnect(); };
    }, [roomId, user]); // Kept dependencies minimal

    // --- Helpers ---
    const handleMouseUpWrapper = (e) => {
        const result = drawing.handleMouseUp(e);
        if (result.hasChanged && socketRef.current) {
            socketRef.current.emit('sync_annotations', { roomId, arrows: result.newArrows, squares: result.newSquares });
        }
    };

    const handleClearWrapper = () => {
        drawing.clearAnnotations();
        if (socketRef.current) {
            socketRef.current.emit('sync_annotations', { roomId, arrows: [], squares: {} });
        }
    };

    const handleSendMessage = (text) => {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const senderName = user?.fullname || user?.username || 'Coach'; 
        const messageData = { text, time, sender: senderName };
        setChatMessages(prev => [...prev, { ...messageData, isMe: true }]);
        if (socketRef.current) socketRef.current.emit('send_message', { roomId, ...messageData });
    };

    const handleAssignControl = (color, userId) => {
        const newControls = { ...controls, [color]: userId };
        setControls(newControls);
        if (socketRef.current) {
            socketRef.current.emit('update_controls', { roomId, controls: newControls });
        }
    };

    const handleRestoreReference = (index) => {
        try {
            const t = referenceStartFen === 'start' ? new Chess() : new Chess(referenceStartFen);
            for(let i=0; i<=index; i++) {
                if (referenceHistory[i]) t.move(referenceHistory[i]);
            }
            setGame(t);
            setHistory(t.history());
            setCurrentPgn(t.pgn());
            setViewIndex(index);
            if (socketRef.current) {
                socketRef.current.emit('make_move', { roomId, fen: t.fen() });
            }
        } catch (e) {
            toast.error("Could not restore position.");
        }
    };

    function onDrop(source, target, piece) {
        if (viewIndex !== history.length - 1 && history.length > 0 && viewIndex !== -1) { /* Branching allowed */ }
        
        const pieceColor = piece[0]; 
        const isCoach = user?.role === 'coach'; 

        if (!isCoach) {
            if (pieceColor === 'w' && controls.white !== user?._id) {
                toast.error("You are not assigned to play White.");
                return false;
            }
            if (pieceColor === 'b' && controls.black !== user?._id) {
                toast.error("You are not assigned to play Black.");
                return false;
            }
        }
        
        if (customFen) {
            if (!illegalMode) {
                toast.error("Strict Mode: Cannot move on invalid board.");
                return false; 
            }
            try {
                const newFen = movePieceInFen(customFen, source, target);
                setCustomFen(newFen);
                setStartFen(newFen); 
                if (socketRef.current) socketRef.current.emit('make_move', { roomId, fen: newFen });
                return true;
            } catch (e) { return false; }
        }

        try {
            const tempGame = startFen === 'start' ? new Chess() : new Chess(startFen);
            for(let i=0; i<=viewIndex; i++) {
                if (history[i]) tempGame.move(history[i]);
            }

            const move = tempGame.move({ from: source, to: target, promotion: 'q' });
            if (!move) return false; 
            
            setGame(tempGame); 
            const newHistory = tempGame.history();
            setHistory(newHistory); 
            setCurrentPgn(tempGame.pgn());
            
            const wasBranching = viewIndex !== history.length - 1;
            setViewIndex(newHistory.length - 1);
            handleClearWrapper(); 
            
            if (socketRef.current) {
                if (wasBranching) {
                    socketRef.current.emit('make_move', { roomId, fen: tempGame.fen() });
                } else {
                    socketRef.current.emit('make_move', { roomId, from: source, to: target, promotion: 'q', fen: tempGame.fen() });
                }
            }
            return true;
        } catch (error) { return false; }
    }

    const undoMove = () => {
        if (customFen) return; 
        if (viewIndex >= 0) {
            const newHistory = history.slice(0, -1);
            const newGame = startFen === 'start' ? new Chess() : new Chess(startFen);
            for(const m of newHistory) newGame.move(m);
            setGame(newGame);
            setHistory(newHistory);
            setCurrentPgn(newGame.pgn());
            setViewIndex(newHistory.length - 1);
            if (socketRef.current) {
                socketRef.current.emit('make_move', { roomId, fen: newGame.fen() });
            }
        }
    };

    // --- KEY FIX: Add targetViewIndex to handle React state sync better ---
    const loadGameFromPgn = (data, title = "Lesson", skipEmit = false, targetViewIndex = -1) => {
        if (!data || typeof data !== 'string' || !data.trim()) return;

        setBoardKey(prev => prev + 1);
        const cleanedData = data.trim();
        setCustomFen(null); 

        // 1. Try Loading Standard PGN
        try {
            const pgnGame = new Chess();
            pgnGame.loadPgn(cleanedData);
            
            if (pgnGame.history().length > 0) {
                const startClone = new Chess();
                startClone.loadPgn(cleanedData);
                while (startClone.undo()) {} 
                const trueStartFen = startClone.fen();

                setStartFen(trueStartFen);
                
                const fullGame = new Chess();
                fullGame.loadPgn(cleanedData);
                
                setReferenceHistory(fullGame.history());
                setReferenceStartFen(trueStartFen);

                setGame(fullGame);
                setHistory(fullGame.history());
                setCurrentPgn(fullGame.pgn());
                
                // CRITICAL: Set View to targetViewIndex (defaults to -1)
                setViewIndex(targetViewIndex); 
                
                if (!skipEmit && socketRef.current) {
                    socketRef.current.emit('load_pgn', { roomId, pgn: cleanedData });
                }
                
                toast.success(`Loaded: ${title}`);
                return;
            }
        } catch (e) {}

        // 2. Fallback to FEN
        let targetFen = cleanedData;
        const fenMatch = cleanedData.match(/\[FEN "([^"]+)"\]/);
        if (fenMatch && fenMatch[1]) { targetFen = fenMatch[1]; }

        try {
            if (!targetFen.includes('/')) throw new Error("Not a FEN");
            try {
                const fenGame = new Chess(targetFen);
                setGame(fenGame);
                setStartFen(targetFen);
                setHistory([]);
                setReferenceHistory([]); 
                setReferenceStartFen(targetFen);
                setCurrentPgn(fenGame.pgn());
                setViewIndex(-1);
                
                if (!skipEmit && socketRef.current) {
                    socketRef.current.emit('make_move', { roomId, fen: targetFen });
                }
                toast.success(`Loaded Position: ${title}`);
            } catch (chessError) {
                setCustomFen(targetFen); 
                setGame(new Chess()); 
                setStartFen(targetFen);
                setHistory([]);
                setReferenceHistory([]); 
                setCurrentPgn("");
                setViewIndex(-1);
                if (!skipEmit && socketRef.current) {
                    socketRef.current.emit('make_move', { roomId, fen: targetFen });
                }
                if (illegalMode) toast.success(`Loaded (Free Mode): ${title}`);
            }
        } catch (finalError) {
            toast.error("Failed to recognize game data.");
        }
    };

    const handlePlayPlaylist = (chapterList, index) => {
        setPlaylist(chapterList);
        setCurrentChapterIndex(index);
        const chapter = chapterList[index];
        if (chapter && chapter.pgn) {
            loadGameFromPgn(chapter.pgn, chapter.name);
            setShowSyllabusModal(false); 
        } else {
            toast.error("Selected chapter has no data.");
        }
    };

    const handleNavigateChapter = (direction) => {
        const newIndex = currentChapterIndex + direction;
        if (newIndex >= 0 && newIndex < playlist.length) {
            const nextChapter = playlist[newIndex];
            setCurrentChapterIndex(newIndex);
            loadGameFromPgn(nextChapter.pgn, nextChapter.name);
        }
    };

    const handleLoadPGN = (pgn, name = "Uploaded PGN") => {
        loadGameFromPgn(pgn, name);
        setPlaylist([]); 
        setCurrentChapterIndex(-1);
    };

    const handleSetupLoad = (fen) => {
        loadGameFromPgn(fen, "Setup Position");
    };

    const handleDownloadPGN = () => {
        const blob = new Blob([game.pgn()], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = `game_${roomId}.pgn`; document.body.appendChild(a); a.click(); document.body.removeChild(a);
    };

    // --- KEY FIX: Prevent crash during React state transitions ---
    const getBoardPosition = () => { 
        if (customFen) return customFen; 
        try {
            const t = startFen === 'start' ? new Chess() : new Chess(startFen);
            const safeLimit = Math.min(viewIndex, history.length - 1);
            for(let i=0; i<=safeLimit; i++) {
                if (history[i]) t.move(history[i]);
            } 
            return t.fen();
        } catch (e) { 
            return startFen === 'start' ? new Chess().fen() : startFen; 
        }
    };

    const currentUserRole = user?.role === 'coach' ? "Coach" : "Student";

    return (
        <div className="h-screen bg-[#111] text-white flex flex-col overflow-hidden font-sans">
            <header className="h-14 bg-[#161616] border-b border-white/10 flex items-center justify-between px-6 shrink-0 z-20">
                <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                        <span className="font-bold text-gray-200 text-sm tracking-wide">Classroom</span>
                        <span className="text-[10px] text-gray-500 font-mono uppercase">ID: {roomId.slice(0,8)}...</span>
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${isConnected ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                        {isConnected ? 'Live' : 'Offline'}
                    </span>
                </div>
                
                {playlist.length > 0 && (
                    <div className="hidden md:flex items-center bg-[#222] rounded-lg border border-white/10 p-1 gap-2 absolute left-1/2 transform -translate-x-1/2">
                        <button onClick={() => handleNavigateChapter(-1)} disabled={currentChapterIndex <= 0} className="p-1 hover:bg-white/10 rounded disabled:opacity-30 disabled:cursor-not-allowed text-gray-300">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <div className="flex flex-col items-center px-2 min-w-[120px]">
                            <span className="text-xs font-bold text-white truncate max-w-[150px]">{playlist[currentChapterIndex]?.name}</span>
                            <span className="text-[9px] text-gray-500 uppercase tracking-wider">{currentChapterIndex + 1} / {playlist.length}</span>
                        </div>
                        <button onClick={() => handleNavigateChapter(1)} disabled={currentChapterIndex >= playlist.length - 1} className="p-1 hover:bg-white/10 rounded disabled:opacity-30 disabled:cursor-not-allowed text-gray-300">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                )}

                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-[#202020] border border-white/10 rounded-md px-3 py-1 mr-2">
                        <div className="flex flex-col mr-3 items-end">
                            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Current Lesson</span>
                            <span className="text-xs font-bold text-gray-200 truncate max-w-[150px]">{playlist.length > 0 && currentChapterIndex !== -1 ? playlist[currentChapterIndex]?.name : "No Technique Loaded"}</span>
                        </div>
                        {playlist.length > 0 && (
                             <button onClick={() => handleNavigateChapter(1)} disabled={currentChapterIndex >= playlist.length - 1} className="p-1.5 hover:bg-white/10 rounded-full text-violet-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                                <ChevronRight className="w-4 h-4" />
                             </button>
                        )}
                    </div>
                    <button onClick={() => setShowSyllabusModal(true)} className="bg-violet-600/10 hover:bg-violet-600 border border-violet-500/50 text-violet-300 hover:text-white px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wide flex items-center gap-2 transition-all">
                        <BookOpen className="w-4 h-4" /> Syllabus
                    </button>
                    <button onClick={() => navigate(-1)} className="bg-red-600/90 hover:bg-red-600 text-white px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wide flex items-center gap-2 transition-all">
                        <PhoneOff className="w-3 h-3" /> Exit
                    </button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                <div className="flex-1 bg-[#0a0a0a] relative flex flex-col justify-center items-center">
                    <div 
                        ref={drawing.boardWrapperRef}
                        onMouseDown={drawing.handleMouseDown}
                        onMouseUp={handleMouseUpWrapper}
                        onContextMenu={(e) => e.preventDefault()}
                        className="relative shadow-2xl shadow-black/50" 
                        style={{ width: boardWidth, height: boardWidth }}
                    >
                        <Chessboard 
                            id="ClassroomBoard" key={boardKey} position={getBoardPosition()} onPieceDrop={onDrop} boardOrientation={orientation}
                            customDarkSquareStyle={{ backgroundColor: '#779954' }} customLightSquareStyle={{ backgroundColor: '#e9edcc' }}
                            animationDuration={200} showBoardNotation={false}
                            areArrowsAllowed={false} customArrows={drawing.arrows} customSquareStyles={drawing.squares}
                        />
                        <CoordinateOverlay orientation={orientation} showCoordinates={showCoordinates} boardWidth={boardWidth} />
                    </div>
                    
                    <AnalysisTools 
                        onUndo={undoMove}
                        onReset={() => { 
                            const ng = new Chess(); 
                            setGame(ng); 
                            setCustomFen(null);
                            setStartFen('start'); 
                            setHistory([]); 
                            setReferenceHistory([]); 
                            setCurrentPgn("");
                            setViewIndex(-1); 
                            handleClearWrapper(); 
                            if (socketRef.current) socketRef.current.emit('make_move', { roomId, fen: ng.fen() });
                        }}
                        onFlip={() => setOrientation(o => o === 'white' ? 'black' : 'white')}
                        onClear={handleClearWrapper} 
                        onSetup={() => setShowSetupModal(true)}
                        showTools={showTools} setShowTools={setShowTools} 
                        showCoordinates={showCoordinates} setShowCoordinates={setShowCoordinates}
                        illegalMode={illegalMode} setIllegalMode={setIllegalMode}
                        currentPgn={currentPgn} 
                    />
                </div>
                <ClassroomSidebar 
                    activeTab={activeTab} setActiveTab={setActiveTab} 
                    history={history}
                    viewIndex={viewIndex} goToMove={setViewIndex} 
                    referenceHistory={referenceHistory}
                    onRestoreReference={handleRestoreReference}
                    onLoadPGN={handleLoadPGN} 
                    onDownloadPGN={handleDownloadPGN} 
                    micOn={micOn} setMicOn={setMicOn} 
                    cameraOn={cameraOn} setCameraOn={setCameraOn} 
                    chatMessages={chatMessages} onSendMessage={handleSendMessage} 
                    connectedUsers={connectedUsers} roomId={roomId}
                    currentPgn={currentPgn}
                    userRole={currentUserRole} 
                    controls={controls}
                    onAssignControl={handleAssignControl}
                />
            </div>
            <SetupPosition isOpen={showSetupModal} onClose={() => setShowSetupModal(false)} currentFen={game.fen()} onLoadPosition={handleSetupLoad} />
            <Syllabus isOpen={showSyllabusModal} onClose={() => setShowSyllabusModal(false)} onPlayPlaylist={handlePlayPlaylist} roomId={roomId} onLoadPGN={handleLoadPGN} />
        </div>
    );
};

function movePieceInFen(fen, from, to) {
    const files = 'abcdefgh';
    const fromCol = files.indexOf(from[0]);
    const fromRow = 8 - parseInt(from[1]); 
    const toCol = files.indexOf(to[0]);
    const toRow = 8 - parseInt(to[1]);
    const parts = fen.split(' ');
    const rows = parts[0].split('/');
    const board = rows.map(row => {
        let expanded = '';
        for (let char of row) {
            if (!isNaN(char)) expanded += '1'.repeat(parseInt(char)); 
            else expanded += char;
        }
        return expanded.split('');
    });
    const piece = board[fromRow][fromCol];
    board[fromRow][fromCol] = '1'; 
    board[toRow][toCol] = piece;
    const newRows = board.map(row => {
        let compressed = '';
        let count = 0;
        for (let char of row) {
            if (char === '1') { count++; } 
            else {
                if (count > 0) { compressed += count; count = 0; }
                compressed += char;
            }
        }
        if (count > 0) compressed += count;
        return compressed;
    });
    parts[0] = newRows.join('/');
    return parts.join(' ');
}

export default VideoClassroom;