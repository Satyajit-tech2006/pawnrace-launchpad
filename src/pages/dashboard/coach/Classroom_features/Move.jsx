import React, { useEffect, useRef } from 'react';

const Move = ({ history = [], viewIndex, goToMove, userRole }) => {
    const scrollRef = useRef(null);
    const visibleHistory = history; 

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, [viewIndex, history.length]);

    return (
        <div className="flex flex-col h-full bg-[#0F0F12]">
            <div className="grid grid-cols-[3rem_1fr_1fr] px-4 py-2 bg-zinc-900/50 text-[10px] font-bold uppercase text-zinc-500 border-b border-white/5 shrink-0">
                <div>#</div>
                <div>White</div>
                <div>Black</div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                <table className="w-full text-xs border-collapse table-fixed">
                    <tbody>
                        {Array.from({ length: Math.ceil(visibleHistory.length / 2) }).map((_, i) => {
                            const whiteMoveIndex = i * 2;
                            const blackMoveIndex = i * 2 + 1;
                            const isCurrentRow = Math.floor(viewIndex / 2) === i;

                            return (
                                <tr 
                                    key={i} 
                                    className={`border-b border-white/[0.02] transition-colors ${
                                        isCurrentRow ? 'bg-white/[0.02]' : 'hover:bg-white/[0.02]'
                                    }`}
                                >
                                    <td className="py-2.5 pl-4 text-zinc-600 font-mono w-12 text-[11px]">
                                        {i + 1}.
                                    </td>

                                    <td 
                                        onClick={() => goToMove(whiteMoveIndex)} 
                                        ref={viewIndex === whiteMoveIndex ? scrollRef : null}
                                        className={`py-2 px-2 cursor-pointer transition-colors ${
                                            viewIndex === whiteMoveIndex 
                                            ? 'text-violet-400 font-bold bg-violet-500/20 rounded' 
                                            : 'text-zinc-300 hover:text-white'
                                        }`}
                                    >
                                        {visibleHistory[whiteMoveIndex]}
                                    </td>

                                    <td 
                                        onClick={() => visibleHistory[blackMoveIndex] && goToMove(blackMoveIndex)} 
                                        ref={viewIndex === blackMoveIndex ? scrollRef : null}
                                        className={`py-2 px-2 cursor-pointer transition-colors ${
                                            viewIndex === blackMoveIndex 
                                            ? 'text-violet-400 font-bold bg-violet-500/20 rounded' 
                                            : 'text-zinc-300 hover:text-white'
                                        }`}
                                    >
                                        {visibleHistory[blackMoveIndex] || ''}
                                    </td>
                                </tr>
                            );
                        })}
                        
                        {visibleHistory.length === 0 && (
                            <tr>
                                <td colSpan="3" className="text-center py-10 text-zinc-600 text-xs italic opacity-50">
                                    Game ready to start
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Move;