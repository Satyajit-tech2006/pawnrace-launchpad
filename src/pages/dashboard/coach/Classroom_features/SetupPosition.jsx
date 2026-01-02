import React, { useState, useEffect, useRef } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { X, Trash2, Check, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

// RELIABLE IMAGE SOURCE (Lichess - cburnett style)
const PIECE_IMAGES = {
    wP: 'https://raw.githubusercontent.com/lichess-org/lila/master/public/piece/cburnett/wP.svg',
    wN: 'https://raw.githubusercontent.com/lichess-org/lila/master/public/piece/cburnett/wN.svg',
    wB: 'https://raw.githubusercontent.com/lichess-org/lila/master/public/piece/cburnett/wB.svg',
    wR: 'https://raw.githubusercontent.com/lichess-org/lila/master/public/piece/cburnett/wR.svg',
    wQ: 'https://raw.githubusercontent.com/lichess-org/lila/master/public/piece/cburnett/wQ.svg',
    wK: 'https://raw.githubusercontent.com/lichess-org/lila/master/public/piece/cburnett/wK.svg',
    bP: 'https://raw.githubusercontent.com/lichess-org/lila/master/public/piece/cburnett/bP.svg',
    bN: 'https://raw.githubusercontent.com/lichess-org/lila/master/public/piece/cburnett/bN.svg',
    bB: 'https://raw.githubusercontent.com/lichess-org/lila/master/public/piece/cburnett/bB.svg',
    bR: 'https://raw.githubusercontent.com/lichess-org/lila/master/public/piece/cburnett/bR.svg',
    bQ: 'https://raw.githubusercontent.com/lichess-org/lila/master/public/piece/cburnett/bQ.svg',
    bK: 'https://raw.githubusercontent.com/lichess-org/lila/master/public/piece/cburnett/bK.svg',
};

const SetupPosition = ({ isOpen, onClose, currentFen, onLoadPosition }) => {
    if (!isOpen) return null;

    // --- State ---
    const [boardPosition, setBoardPosition] = useState({});
    const [selectedPiece, setSelectedPiece] = useState(null); // 'wP', 'trash', etc.
    const [toPlay, setToPlay] = useState('w');
    const [castling, setCastling] = useState({ wK: true, wQ: true, bK: true, bQ: true });
    
    const boardWrapperRef = useRef(null); // Reference for Drag & Drop calculation

    // --- Initialize Board from FEN ---
    useEffect(() => {
        try {
            const safeFen = currentFen || "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
            const tempGame = new Chess(safeFen);
            const board = {};
            
            ['a','b','c','d','e','f','g','h'].forEach(file => {
                ['1','2','3','4','5','6','7','8'].forEach(rank => {
                    const square = file + rank;
                    const piece = tempGame.get(square);
                    if (piece) {
                        board[square] = piece.color + piece.type.toUpperCase();
                    }
                });
            });
            setBoardPosition(board);
            
            const parts = safeFen.split(' ');
            setToPlay(parts[1] || 'w');
            setCastling({
                wK: parts[2].includes('K'),
                wQ: parts[2].includes('Q'),
                bK: parts[2].includes('k'),
                bQ: parts[2].includes('q')
            });

        } catch (e) {
            console.error("FEN Parse Error", e);
            setBoardPosition({});
        }
    }, [isOpen, currentFen]);

    // --- LOGIC: Click to Paint ---
    const onSquareClick = (square) => {
        const newBoard = { ...boardPosition };
        if (selectedPiece === 'trash') {
            delete newBoard[square];
        } else if (selectedPiece) {
            newBoard[square] = selectedPiece;
        }
        setBoardPosition(newBoard);
    };

    // --- LOGIC: Drag existing pieces ON board ---
    const onPieceDrop = (sourceSquare, targetSquare) => {
        const newBoard = { ...boardPosition };
        const piece = newBoard[sourceSquare];
        delete newBoard[sourceSquare];
        newBoard[targetSquare] = piece;
        setBoardPosition(newBoard);
        return true;
    };

    // --- LOGIC: External Drag & Drop (Palette -> Board) ---
    const handleDragOver = (e) => {
        e.preventDefault(); // Essential to allow dropping
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const pieceCode = e.dataTransfer.getData("piece");
        if (!pieceCode || !boardWrapperRef.current) return;

        // Calculate Square from Mouse Coordinates
        const rect = boardWrapperRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const squareSize = rect.width / 8;

        const fileIdx = Math.floor(x / squareSize);
        const rankIdx = 7 - Math.floor(y / squareSize); // Rank 8 is at y=0

        if (fileIdx >= 0 && fileIdx <= 7 && rankIdx >= 0 && rankIdx <= 7) {
            const file = ['a','b','c','d','e','f','g','h'][fileIdx];
            const rank = (rankIdx + 1).toString();
            const square = file + rank;

            const newBoard = { ...boardPosition };
            newBoard[square] = pieceCode;
            setBoardPosition(newBoard);
        }
    };

    // --- Helper: Generate FEN ---
    const handleLoad = () => {
        const pieces = Object.values(boardPosition);
        if (!pieces.includes('wK') || !pieces.includes('bK')) {
            toast.error("Invalid: Both Kings are required!");
            return;
        }

        let fenString = "";
        for (let r = 8; r >= 1; r--) {
            let empty = 0;
            for (let f = 0; f < 8; f++) {
                const file = ['a','b','c','d','e','f','g','h'][f];
                const piece = boardPosition[file + r];
                if (piece) {
                    if (empty > 0) { fenString += empty; empty = 0; }
                    const char = piece[1] === 'P' ? 'p' : piece[1] === 'N' ? 'n' : piece[1] === 'B' ? 'b' : piece[1] === 'R' ? 'r' : piece[1] === 'Q' ? 'q' : 'k';
                    fenString += piece[0] === 'w' ? char.toUpperCase() : char;
                } else {
                    empty++;
                }
            }
            if (empty > 0) fenString += empty;
            if (r > 1) fenString += "/";
        }
        fenString += ` ${toPlay}`;
        
        let cStr = "";
        if (castling.wK) cStr += "K";
        if (castling.wQ) cStr += "Q";
        if (castling.bK) cStr += "k";
        if (castling.bQ) cStr += "q";
        fenString += ` ${cStr || "-"}`;
        
        fenString += " - 0 1";
        onLoadPosition(fenString);
        onClose();
    };

    // --- Palette Item (Draggable) ---
    const PaletteItem = ({ code }) => (
        <div 
            draggable={true}
            onDragStart={(e) => {
                e.dataTransfer.setData("piece", code);
                setSelectedPiece(code); // Also select it for clicking
            }}
            onClick={() => setSelectedPiece(code)}
            className={`w-full aspect-square flex items-center justify-center rounded transition-all cursor-grab active:cursor-grabbing hover:bg-white/10 ${selectedPiece === code ? 'bg-violet-500/30 ring-2 ring-violet-500' : ''}`}
        >
            <img src={PIECE_IMAGES[code]} alt={code} className="w-8 h-8 pointer-events-none select-none" />
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-md">
            <div className="bg-[#121212] border border-white/10 rounded-xl w-full max-w-5xl h-[85vh] flex shadow-2xl overflow-hidden">
                
                {/* --- LEFT: WHITE PALETTE --- */}
                <div className="w-20 bg-[#1a1a1a] border-r border-white/10 flex flex-col items-center py-4 gap-2 overflow-y-auto">
                    <span className="text-[10px] font-bold text-gray-500 uppercase">White</span>
                    {['wP','wN','wB','wR','wQ','wK'].map(p => <PaletteItem key={p} code={p} />)}
                    
                    <div className="w-10 h-px bg-white/10 my-2"></div>
                    
                    <button 
                        onClick={() => setSelectedPiece('trash')}
                        className={`w-12 h-12 flex flex-col items-center justify-center rounded transition-all ${selectedPiece === 'trash' ? 'bg-red-500/20 text-red-400 ring-2 ring-red-500' : 'text-gray-400 hover:bg-white/10'}`}
                        title="Trash Tool"
                    >
                        <Trash2 className="w-6 h-6"/>
                    </button>
                    <span className="text-[9px] text-gray-600 text-center px-1">Right-click board to delete</span>
                </div>

                {/* --- CENTER: BOARD --- */}
                <div className="flex-1 bg-[#0f0f0f] relative flex flex-col items-center justify-center p-6">
                    <h2 className="absolute top-4 text-white font-bold text-lg opacity-80">Setup Board</h2>
                    
                    {/* Board Wrapper for Drop Detection */}
                    <div 
                        ref={boardWrapperRef}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        className="w-full max-w-[65vh] aspect-square shadow-2xl border-4 border-[#252525] relative"
                    >
                        <Chessboard 
                            position={boardPosition} 
                            onPieceDrop={onPieceDrop}
                            onSquareClick={onSquareClick}
                            onSquareRightClick={(square) => {
                                const newBoard = { ...boardPosition };
                                delete newBoard[square];
                                setBoardPosition(newBoard);
                            }}
                            arePiecesDraggable={true} 
                            animationDuration={0}
                            customDarkSquareStyle={{ backgroundColor: '#779954' }}
                            customLightSquareStyle={{ backgroundColor: '#e9edcc' }}
                            customBoardStyle={{ 
                                cursor: selectedPiece === 'trash' ? 'not-allowed' : selectedPiece ? 'crosshair' : 'default' 
                            }}
                            // Use custom pieces to ensure Lichess images everywhere
                            customPieces={Object.keys(PIECE_IMAGES).reduce((acc, p) => {
                                acc[p] = ({ squareWidth }) => (
                                    <div 
                                        style={{
                                            width: squareWidth,
                                            height: squareWidth,
                                            backgroundImage: `url(${PIECE_IMAGES[p]})`,
                                            backgroundSize: '100%',
                                        }}
                                    />
                                );
                                return acc;
                            }, {})}
                        />
                    </div>

                    {/* Action Bar */}
                    <div className="absolute bottom-6 flex gap-3">
                        <button 
                            onClick={() => { setBoardPosition({}); setSelectedPiece(null); }}
                            className="px-4 py-2 bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-gray-300 rounded text-xs font-bold uppercase transition-colors"
                        >
                            Clear Board
                        </button>
                        <button 
                            onClick={() => { 
                                const start = new Chess(); 
                                const board = {};
                                ['a','b','c','d','e','f','g','h'].forEach(f => ['1','2','3','4','5','6','7','8'].forEach(r => { 
                                    const p = start.get(f+r); 
                                    if(p) board[f+r] = p.color + p.type.toUpperCase(); 
                                }));
                                setBoardPosition(board);
                            }}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded text-xs font-bold uppercase transition-colors"
                        >
                            Standard Start
                        </button>
                    </div>
                </div>

                {/* --- RIGHT: BLACK PALETTE --- */}
                <div className="w-20 bg-[#1a1a1a] border-l border-white/10 flex flex-col items-center py-4 gap-2 overflow-y-auto">
                    <span className="text-[10px] font-bold text-gray-500 uppercase">Black</span>
                    {['bP','bN','bB','bR','bQ','bK'].map(p => <PaletteItem key={p} code={p} />)}
                </div>

                {/* --- FAR RIGHT: SETTINGS --- */}
                <div className="w-64 bg-[#121212] border-l border-white/10 p-6 flex flex-col justify-between">
                    <div className="space-y-6">
                        {/* Side to Play */}
                        <div>
                            <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Side to Play</h3>
                            <div className="flex bg-[#1a1a1a] p-1 rounded-lg border border-white/5">
                                <button onClick={() => setToPlay('w')} className={`flex-1 py-2 rounded text-xs font-bold transition-all ${toPlay === 'w' ? 'bg-white text-black shadow' : 'text-gray-500 hover:text-white'}`}>White</button>
                                <button onClick={() => setToPlay('b')} className={`flex-1 py-2 rounded text-xs font-bold transition-all ${toPlay === 'b' ? 'bg-white text-black shadow' : 'text-gray-500 hover:text-white'}`}>Black</button>
                            </div>
                        </div>

                        {/* Castling */}
                        <div>
                            <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Castling Rights</h3>
                            <div className="space-y-2">
                                <label className="flex items-center gap-3 p-2 rounded hover:bg-white/5 cursor-pointer border border-transparent hover:border-white/10 transition-all">
                                    <input type="checkbox" checked={castling.wK} onChange={(e) => setCastling({...castling, wK: e.target.checked})} className="w-4 h-4 accent-violet-500 rounded bg-white/10 border-white/20"/>
                                    <span className="text-sm text-gray-300">White O-O</span>
                                </label>
                                <label className="flex items-center gap-3 p-2 rounded hover:bg-white/5 cursor-pointer border border-transparent hover:border-white/10 transition-all">
                                    <input type="checkbox" checked={castling.wQ} onChange={(e) => setCastling({...castling, wQ: e.target.checked})} className="w-4 h-4 accent-violet-500 rounded bg-white/10 border-white/20"/>
                                    <span className="text-sm text-gray-300">White O-O-O</span>
                                </label>
                                <label className="flex items-center gap-3 p-2 rounded hover:bg-white/5 cursor-pointer border border-transparent hover:border-white/10 transition-all">
                                    <input type="checkbox" checked={castling.bK} onChange={(e) => setCastling({...castling, bK: e.target.checked})} className="w-4 h-4 accent-violet-500 rounded bg-white/10 border-white/20"/>
                                    <span className="text-sm text-gray-300">Black O-O</span>
                                </label>
                                <label className="flex items-center gap-3 p-2 rounded hover:bg-white/5 cursor-pointer border border-transparent hover:border-white/10 transition-all">
                                    <input type="checkbox" checked={castling.bQ} onChange={(e) => setCastling({...castling, bQ: e.target.checked})} className="w-4 h-4 accent-violet-500 rounded bg-white/10 border-white/20"/>
                                    <span className="text-sm text-gray-300">Black O-O-O</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Done Actions */}
                    <div className="space-y-3">
                        <button onClick={handleLoad} className="w-full py-3 bg-violet-600 hover:bg-violet-700 rounded-lg text-sm font-bold text-white uppercase tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-violet-900/20 transition-all">
                            <Check className="w-5 h-5"/> Load Position
                        </button>
                        <button onClick={onClose} className="w-full py-3 bg-[#1a1a1a] hover:bg-[#252525] rounded-lg text-sm font-bold text-gray-400 hover:text-white uppercase tracking-wide transition-all">
                            Cancel
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SetupPosition;