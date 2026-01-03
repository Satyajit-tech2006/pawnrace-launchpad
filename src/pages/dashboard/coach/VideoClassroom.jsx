import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { io } from 'socket.io-client';
import { PhoneOff } from 'lucide-react';
import { toast } from 'sonner';

// Import Components
import AnalysisTools from './Classroom_features/AnalysisTools';
import ClassroomSidebar from './Classroom_features/ClassroomSidebar';
import CoordinateOverlay from './Classroom_features/CoordinateOverlay';
import SetupPosition from './Classroom_features/SetupPosition';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'https://pawnrace-backend-socket.onrender.com';

const VideoClassroom = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const socketRef = useRef(null); 

    // --- State ---
    const [game, setGame] = useState(new Chess());
    const [orientation, setOrientation] = useState('white');
    const [history, setHistory] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [viewIndex, setViewIndex] = useState(-1);
    const [boardWidth, setBoardWidth] = useState(600);
    
    // --- UI State ---
    const [rightClickedSquares, setRightClickedSquares] = useState({});
    const [boardKey, setBoardKey] = useState(0); 
    const [showTools, setShowTools] = useState(true);
    const [showCoordinates, setShowCoordinates] = useState(true);
    const [showSetupModal, setShowSetupModal] = useState(false);

    const [activeTab, setActiveTab] = useState('moves');
    const [micOn, setMicOn] = useState(true);
    const [cameraOn, setCameraOn] = useState(true);

    // --- CHAT STATE (Added Back) ---
    const [chatMessages, setChatMessages] = useState([]);

    // --- 1. RESIZE ---
    useEffect(() => {
        function handleResize() {
            const h = window.innerHeight;
            setBoardWidth(Math.min(h * 0.70, 600)); 
        }
        window.addEventListener('resize', handleResize);
        handleResize(); 
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // --- 2. SOCKETS ---
    useEffect(() => {
        socketRef.current = io(SOCKET_URL);
        socketRef.current.on('connect', () => { setIsConnected(true); socketRef.current.emit('join_room', roomId); });
        
        // MOVES
        socketRef.current.on('receive_move', (moveData) => {
            setGame((prevGame) => {
                const gameCopy = new Chess();
                gameCopy.loadPgn(prevGame.pgn());
                try {
                    if (moveData.from) gameCopy.move(moveData);
                    else if (moveData.fen) return new Chess(moveData.fen);
                    setHistory(gameCopy.history());
                    setViewIndex(-1);
                    setRightClickedSquares({}); 
                    setBoardKey(k => k + 1); 
                    return gameCopy;
                } catch (e) { return new Chess(moveData.fen); }
            });
        });

        // CHAT (Added Back)
        socketRef.current.on('receive_message', (data) => {
            setChatMessages(prev => [...prev, { ...data, isMe: false }]);
        });

        return () => { if (socketRef.current) socketRef.current.disconnect(); };
    }, [roomId]);

    // --- 3. CHAT HANDLER (Added Back) ---
    const handleSendMessage = (text) => {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const messageData = { text, time, sender: 'Coach' };

        // Update locally
        setChatMessages(prev => [...prev, { ...messageData, isMe: true }]);

        // Send to Socket
        if (socketRef.current) {
            socketRef.current.emit('send_message', { roomId, ...messageData });
        }
    };

    // --- 4. GAME ACTIONS ---
    function onDrop(sourceSquare, targetSquare) {
        if (viewIndex !== -1) { toast.error("Resume live game to play."); return false; }
        try {
            const tempGame = new Chess();
            tempGame.loadPgn(game.pgn());
            const move = tempGame.move({ from: sourceSquare, to: targetSquare, promotion: 'q' });
            if (!move) return false;

            setGame(tempGame);
            setHistory(tempGame.history());
            setRightClickedSquares({});
            setBoardKey(prev => prev + 1);

            if (socketRef.current) {
                socketRef.current.emit('make_move', { roomId, from: sourceSquare, to: targetSquare, promotion: 'q', fen: tempGame.fen() });
            }
            return true;
        } catch (error) { return false; }
    }

    const undoMove = () => {
        const tempGame = new Chess();
        tempGame.loadPgn(game.pgn()); 
        if (tempGame.undo()) {
            setGame(tempGame); setHistory(tempGame.history()); setViewIndex(-1);
            if (socketRef.current) socketRef.current.emit('make_move', { roomId, fen: tempGame.fen() });
        }
    };

    // --- 5. ANNOTATIONS ---
    function onSquareRightClick(square) {
        const red = "rgba(255, 0, 0, 0.6)";
        const orange = "rgba(255, 165, 0, 0.6)";
        const green = "rgba(0, 255, 0, 0.6)";
        const blue = "rgba(0, 0, 255, 0.6)";

        setRightClickedSquares((prev) => {
            const current = prev[square];
            let nextColor = undefined;
            if (!current) nextColor = { backgroundColor: red };
            else if (current.backgroundColor === red) nextColor = { backgroundColor: orange };
            else if (current.backgroundColor === orange) nextColor = { backgroundColor: green };
            else if (current.backgroundColor === green) nextColor = { backgroundColor: blue };
            return { ...prev, [square]: nextColor };
        });
    }

    const clearAnnotations = () => {
        setRightClickedSquares({});
        setBoardKey(prev => prev + 1);
        toast.success("Annotations cleared");
    };

    // --- 6. PGN / SETUP ---
    const handleLoadPGN = (pgn) => {
        try {
            const newGame = new Chess(); newGame.loadPgn(pgn);
            setGame(newGame); setHistory(newGame.history()); setViewIndex(-1);
            if (socketRef.current) socketRef.current.emit('make_move', { roomId, fen: newGame.fen() });
            toast.success("PGN Loaded");
        } catch (e) { toast.error("Invalid PGN"); }
    };

    const handleSetupLoad = (fen) => {
        try {
            const newGame = new Chess(fen);
            setGame(newGame); setHistory([]); setViewIndex(-1);
            if (socketRef.current) socketRef.current.emit('make_move', { roomId, fen: newGame.fen() });
            toast.success("Custom Position Loaded");
        } catch (e) { toast.error("Failed to load position"); }
    };

    const handleDownloadPGN = () => {
        const blob = new Blob([game.pgn()], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `game_${roomId}.pgn`; document.body.appendChild(a); a.click(); document.body.removeChild(a);
    };

    const getBoardPosition = () => {
        if (viewIndex === -1) return game.fen();
        const tempGame = new Chess();
        for (let i = 0; i <= viewIndex; i++) tempGame.move(history[i]);
        return tempGame.fen();
    };

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
                <button onClick={() => navigate(-1)} className="bg-red-600/90 hover:bg-red-600 text-white px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wide flex items-center gap-2 transition-all">
                    <PhoneOff className="w-3 h-3" /> Exit
                </button>
            </header>

            <div className="flex-1 flex overflow-hidden">
                <div className="flex-1 bg-[#0a0a0a] relative flex flex-col justify-center items-center">
                    
                    <div className="relative shadow-2xl shadow-black/50" style={{ width: boardWidth, height: boardWidth }}>
                        <Chessboard 
                            id="ClassroomBoard"
                            key={boardKey} 
                            position={getBoardPosition()} 
                            onPieceDrop={onDrop}
                            boardOrientation={orientation}
                            customDarkSquareStyle={{ backgroundColor: '#779954' }}
                            customLightSquareStyle={{ backgroundColor: '#e9edcc' }}
                            animationDuration={200}
                            showBoardNotation={false}
                            areArrowsAllowed={true}
                            customArrowColor="rgba(255, 0, 0, 0.9)"
                            onSquareRightClick={onSquareRightClick}
                            customSquareStyles={rightClickedSquares}
                        />
                        <CoordinateOverlay orientation={orientation} showCoordinates={showCoordinates} boardWidth={boardWidth} />
                    </div>
                    
                    <AnalysisTools 
                        onUndo={undoMove}
                        onReset={() => { const ng = new Chess(); setGame(ng); setHistory([]); setViewIndex(-1); clearAnnotations(); }}
                        onFlip={() => setOrientation(o => o === 'white' ? 'black' : 'white')}
                        onClear={clearAnnotations}
                        onSetup={() => setShowSetupModal(true)}
                        showTools={showTools} setShowTools={setShowTools}
                        showCoordinates={showCoordinates} setShowCoordinates={setShowCoordinates}
                    />
                </div>

                <ClassroomSidebar 
                    activeTab={activeTab} setActiveTab={setActiveTab}
                    history={history} viewIndex={viewIndex} goToMove={setViewIndex}
                    onLoadPGN={handleLoadPGN} onDownloadPGN={handleDownloadPGN}
                    micOn={micOn} setMicOn={setMicOn}
                    cameraOn={cameraOn} setCameraOn={setCameraOn}
                    // ✅ PASSED CHAT PROPS HERE
                    chatMessages={chatMessages}
                    onSendMessage={handleSendMessage}
                />
            </div>

            <SetupPosition 
                isOpen={showSetupModal} 
                onClose={() => setShowSetupModal(false)}
                currentFen={game.fen()}
                onLoadPosition={handleSetupLoad}
            />
        </div>
    );
};

export default VideoClassroom;