import React from 'react';
import { RotateCcw, Repeat, Trash2, PenTool, Eye, EyeOff, MousePointer2, Undo2 } from 'lucide-react';

const AnalysisTools = ({ 
    onUndo, onReset, onFlip, onClear, 
    showTools, setShowTools 
}) => {
  return (
    <div className="mt-4 flex flex-col items-center gap-3 w-full max-w-xl px-4">
        
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
                    {/* UNDO BUTTON (New) */}
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
                    
                    {/* Visual Indicator: Draw */}
                    <div className="flex flex-col items-center gap-1.5 p-2 min-w-[55px] opacity-70" title="Right-Click + Drag to Draw">
                        <PenTool className="w-4 h-4 text-violet-400" />
                        <span className="text-[9px] text-violet-300 uppercase font-bold tracking-wider">Draw</span>
                    </div>
                    
                    {/* Visual Indicator: Mark */}
                    <div className="flex flex-col items-center gap-1.5 p-2 min-w-[55px] opacity-70" title="Right-Click to Highlight">
                        <MousePointer2 className="w-4 h-4 text-green-400" />
                        <span className="text-[9px] text-green-300 uppercase font-bold tracking-wider">Mark</span>
                    </div>

                    {/* CLEAR BUTTON */}
                    <button onClick={onClear} className="flex flex-col items-center gap-1.5 p-2 hover:bg-red-500/10 rounded-lg group min-w-[55px] transition-all">
                        <div className="p-2 bg-[#252525] rounded-full group-hover:bg-red-900/30">
                            <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-400" />
                        </div>
                        <span className="text-[9px] text-gray-500 group-hover:text-red-300 uppercase font-bold tracking-wider">Clear</span>
                    </button>
                </div>
            </div>
        )}
    </div>
  );
};

export default AnalysisTools;