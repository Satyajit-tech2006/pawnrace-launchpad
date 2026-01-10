import React, { useState } from 'react';
import { RotateCcw, Repeat, Trash2, PenTool, Eye, EyeOff, MousePointer2, Undo2, Hash, Settings2, FileText, X } from 'lucide-react';
import IllegalMoves from './IllegalMoves'; 

const AnalysisTools = ({ 
    onUndo, onReset, onFlip, onClear, onSetup,
    showTools, setShowTools,
    showCoordinates, setShowCoordinates,
    illegalMode, setIllegalMode,
    currentPgn // <--- NEW PROP
}) => {
  const [showPgnModal, setShowPgnModal] = useState(false);

  return (
    // [CHANGE] Increased width from max-w-2xl to max-w-4xl
    <div className="mt-4 flex flex-col items-center gap-3 w-full max-w-4xl px-4 relative">
        
        {/* Toggle Button */}
        <div className="w-full flex justify-end">
            <button 
                onClick={() => setShowTools(!showTools)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide transition-all ${
                    showTools 
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/20 ring-1 ring-violet-500' 
                    : 'bg-[#252525] text-gray-400 hover:bg-[#333]'
                }`}
            >
                {showTools ? <Eye className="w-3 h-3"/> : <EyeOff className="w-3 h-3"/>} 
                {showTools ? 'Hide Tools' : 'Show Tools'}
            </button>
        </div>

        {/* The Tool Box */}
        {showTools && (
            <div className="flex items-center justify-center gap-6 bg-[#1a1a1a] border border-white/5 rounded-xl p-3 shadow-2xl w-full animate-in slide-in-from-bottom-2 fade-in duration-300">
                
                {/* 1. Game Controls */}
                <div className="flex items-center gap-2 border-r border-white/10 pr-6">
                    
                    {/* Setup Button */}
                    <button onClick={onSetup} className="flex flex-col items-center gap-1.5 p-2 hover:bg-white/5 rounded-lg group min-w-[55px] transition-all">
                        <div className="p-2 bg-[#252525] rounded-full group-hover:bg-[#333]">
                            <Settings2 className="w-4 h-4 text-gray-400 group-hover:text-white" />
                        </div>
                        <span className="text-[9px] text-gray-500 group-hover:text-gray-300 uppercase font-bold tracking-wider">Setup</span>
                    </button>

                    {/* NEW: PGN Moves Button */}
                    <button 
                        onClick={() => setShowPgnModal(true)} 
                        className="flex flex-col items-center gap-1.5 p-2 hover:bg-white/5 rounded-lg group min-w-[55px] transition-all"
                        title="View PGN Source Moves"
                    >
                        <div className="p-2 bg-[#252525] rounded-full group-hover:bg-[#333]">
                            <FileText className="w-4 h-4 text-gray-400 group-hover:text-violet-400" />
                        </div>
                        <span className="text-[9px] text-gray-500 group-hover:text-violet-300 uppercase font-bold tracking-wider">PGN</span>
                    </button>

                    {/* Illegal Moves Toggle */}
                    <IllegalMoves 
                        enabled={illegalMode} 
                        onToggle={() => setIllegalMode(!illegalMode)} 
                    />

                    <button onClick={onUndo} className="flex flex-col items-center gap-1.5 p-2 hover:bg-white/5 rounded-lg group min-w-[55px] transition-all">
                        <div className="p-2 bg-[#252525] rounded-full group-hover:bg-[#333]">
                            <Undo2 className="w-4 h-4 text-gray-400 group-hover:text-white" />
                        </div>
                        <span className="text-[9px] text-gray-500 group-hover:text-gray-300 uppercase font-bold tracking-wider">Undo</span>
                    </button>

                    <button onClick={onReset} className="flex flex-col items-center gap-1.5 p-2 hover:bg-white/5 rounded-lg group min-w-[55px] transition-all">
                        <div className="p-2 bg-[#252525] rounded-full group-hover:bg-[#333]">
                            <RotateCcw className="w-4 h-4 text-gray-400 group-hover:text-white" />
                        </div>
                        <span className="text-[9px] text-gray-500 group-hover:text-gray-300 uppercase font-bold tracking-wider">Reset</span>
                    </button>
                    
                    <button onClick={onFlip} className="flex flex-col items-center gap-1.5 p-2 hover:bg-white/5 rounded-lg group min-w-[55px] transition-all">
                        <div className="p-2 bg-[#252525] rounded-full group-hover:bg-[#333]">
                            <Repeat className="w-4 h-4 text-gray-400 group-hover:text-white" />
                        </div>
                        <span className="text-[9px] text-gray-500 group-hover:text-gray-300 uppercase font-bold tracking-wider">Flip</span>
                    </button>
                </div>

                {/* 2. Annotation Actions */}
                <div className="flex items-center gap-2 pl-2">
                    <button onClick={() => setShowCoordinates(!showCoordinates)} className={`flex flex-col items-center gap-1.5 p-2 rounded-lg group min-w-[55px] transition-all ${showCoordinates ? 'hover:bg-white/5' : 'opacity-50 hover:opacity-100'}`}>
                        <div className={`p-2 rounded-full ${showCoordinates ? 'bg-[#252525] group-hover:bg-[#333]' : 'bg-transparent border border-gray-600'}`}>
                            <Hash className={`w-4 h-4 ${showCoordinates ? 'text-blue-400' : 'text-gray-500'}`} />
                        </div>
                        <span className="text-[9px] text-gray-500 group-hover:text-gray-300 uppercase font-bold tracking-wider">Coords</span>
                    </button>

                    <div className="flex flex-col items-center gap-1.5 p-2 min-w-[55px] opacity-70" title="Right-Click + Drag to Draw">
                        <PenTool className="w-4 h-4 text-violet-400" />
                        <span className="text-[9px] text-violet-300 uppercase font-bold tracking-wider">Draw</span>
                    </div>
                    
                    <div className="flex flex-col items-center gap-1.5 p-2 min-w-[55px] opacity-70" title="Right-Click to Highlight">
                        <MousePointer2 className="w-4 h-4 text-green-400" />
                        <span className="text-[9px] text-green-300 uppercase font-bold tracking-wider">Mark</span>
                    </div>

                    <button onClick={onClear} className="flex flex-col items-center gap-1.5 p-2 hover:bg-red-500/10 rounded-lg group min-w-[55px] transition-all">
                        <div className="p-2 bg-[#252525] rounded-full group-hover:bg-red-900/30">
                            <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-400" />
                        </div>
                        <span className="text-[9px] text-gray-500 group-hover:text-red-300 uppercase font-bold tracking-wider">Clear</span>
                    </button>
                </div>
            </div>
        )}

        {/* --- PGN VIEWER MODAL --- */}
        {showPgnModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                <div className="bg-[#18181B] border border-white/10 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[60vh]">
                    <div className="flex items-center justify-between p-4 border-b border-white/5 bg-[#202020]">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <FileText className="w-4 h-4 text-violet-400"/> Source Moves
                        </h3>
                        <button onClick={() => setShowPgnModal(false)} className="text-zinc-500 hover:text-white transition-colors">
                            <X className="w-4 h-4"/>
                        </button>
                    </div>
                    <div className="p-5 overflow-y-auto bg-[#121212]">
                        {currentPgn ? (
                            <p className="text-sm font-mono text-zinc-300 leading-relaxed whitespace-pre-wrap">
                                {currentPgn}
                            </p>
                        ) : (
                            <div className="text-center py-8 text-zinc-600 text-xs italic">
                                No PGN moves loaded.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default AnalysisTools;