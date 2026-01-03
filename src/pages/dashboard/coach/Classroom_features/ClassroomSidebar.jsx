import React, { useState } from 'react';
import { Mic, MicOff, Video, VideoOff, MonitorUp, Clipboard, Download, X, ChevronLeft, ChevronRight } from 'lucide-react';
import ClassroomChat from './ClassroomChat'; // <--- 1. IMPORT ADDED

const ClassroomSidebar = ({ 
    activeTab, setActiveTab, history, viewIndex, goToMove, 
    onLoadPGN, onDownloadPGN, 
    micOn, setMicOn, cameraOn, setCameraOn,
    chatMessages, onSendMessage // <--- 2. PROPS ADDED
}) => {
    const [showPGNModal, setShowPGNModal] = useState(false);
    const [pgnInput, setPgnInput] = useState("");

    const handlePGNSubmit = () => {
        onLoadPGN(pgnInput);
        setShowPGNModal(false);
        setPgnInput("");
    };

    return (
        <div className="w-[350px] bg-[#111] border-l border-white/10 flex flex-col shrink-0 z-10 h-full">
            
            {/* Video Feed Placeholder */}
            <div className="w-full aspect-video bg-black/50 relative group border-b border-white/5 flex items-center justify-center text-gray-600">
                <div className="text-center">
                    <MonitorUp className="w-8 h-8 mx-auto mb-2 opacity-30"/>
                    <span className="text-xs font-medium opacity-50">Video Feed Ready</span>
                </div>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setMicOn(!micOn)} className={`p-2 rounded-full backdrop-blur-md ${micOn ? 'bg-white/10 hover:bg-white/20' : 'bg-red-500/80 hover:bg-red-500'}`}>{micOn ? <Mic className="w-3 h-3 text-white"/> : <MicOff className="w-3 h-3 text-white"/>}</button>
                        <button onClick={() => setCameraOn(!cameraOn)} className={`p-2 rounded-full backdrop-blur-md ${cameraOn ? 'bg-white/10 hover:bg-white/20' : 'bg-red-500/80 hover:bg-red-500'}`}>{cameraOn ? <Video className="w-3 h-3 text-white"/> : <VideoOff className="w-3 h-3 text-white"/>}</button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10 bg-[#161616]">
                {['moves', 'chat', 'students'].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors ${activeTab === tab ? 'text-violet-400 border-b-2 border-violet-400 bg-white/5' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}>
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 bg-[#111] overflow-hidden flex flex-col relative">
                
                {/* 1. MOVES TAB */}
                {activeTab === 'moves' && (
                        <div className="absolute inset-0 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 flex flex-col">
                        <div className="flex-1 p-2">
                            <table className="w-full text-xs border-collapse">
                                <thead className="bg-[#1a1a1a] text-gray-500 sticky top-0 font-mono"><tr><th className="py-2 pl-4 text-left w-10">#</th><th className="py-2 text-left">White</th><th className="py-2 text-left">Black</th></tr></thead>
                                <tbody>
                                    {Array.from({ length: Math.ceil(history.length / 2) }).map((_, i) => (
                                        <tr key={i} className={`border-b border-white/5 transition-colors ${Math.floor(viewIndex/2) === i ? 'bg-violet-500/10' : 'hover:bg-white/5'}`}>
                                            <td className="py-2 pl-4 text-gray-600 font-mono">{i + 1}.</td>
                                            <td onClick={() => goToMove(i * 2)} className={`py-2 cursor-pointer ${viewIndex === (i * 2) ? 'text-violet-400 font-bold' : 'text-gray-300 hover:text-white'}`}>{history[i * 2]}</td>
                                            <td onClick={() => history[i * 2 + 1] && goToMove(i * 2 + 1)} className={`py-2 cursor-pointer ${viewIndex === (i * 2 + 1) ? 'text-violet-400 font-bold' : 'text-gray-300 hover:text-white'}`}>{history[i * 2 + 1] || ''}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Navigation Buttons */}
                        <div className="p-2 border-t border-white/10 flex justify-center gap-2 bg-[#161616]">
                             <button onClick={() => goToMove(0)} disabled={history.length === 0} className="p-2 hover:bg-white/10 rounded text-gray-400 hover:text-white disabled:opacity-30"><ChevronLeft className="w-4 h-4"/><span className="sr-only">Start</span></button>
                             <button onClick={() => goToMove(viewIndex === -1 ? history.length - 2 : viewIndex - 1)} disabled={history.length === 0 || viewIndex === 0} className="p-2 hover:bg-white/10 rounded text-gray-400 hover:text-white disabled:opacity-30"><ChevronLeft className="w-3 h-3"/></button>
                             <button onClick={() => goToMove(viewIndex === -1 ? -1 : viewIndex + 1)} disabled={viewIndex === -1 || viewIndex === history.length - 1} className="p-2 hover:bg-white/10 rounded text-gray-400 hover:text-white disabled:opacity-30"><ChevronRight className="w-3 h-3"/></button>
                             <button onClick={() => goToMove(-1)} disabled={viewIndex === -1} className="p-2 hover:bg-white/10 rounded text-gray-400 hover:text-white disabled:opacity-30"><ChevronRight className="w-4 h-4"/></button>
                        </div>

                        {/* PGN Buttons */}
                        <div className="p-3 border-t border-white/10 grid grid-cols-2 gap-2 bg-[#161616]">
                            <button onClick={() => setShowPGNModal(true)} className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 py-2 rounded text-[10px] font-bold uppercase tracking-wider text-gray-300 transition-colors"><Clipboard className="w-3 h-3"/> Paste PGN</button>
                            <button onClick={onDownloadPGN} className="flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 py-2 rounded text-[10px] font-bold uppercase tracking-wider text-white transition-colors"><Download className="w-3 h-3"/> Download</button>
                        </div>
                    </div>
                )}
                
                {/* 2. CHAT TAB - FIXED! */}
                {activeTab === 'chat' && (
                    <ClassroomChat 
                        messages={chatMessages || []} 
                        onSendMessage={onSendMessage} 
                    />
                )}

                {/* 3. STUDENTS TAB */}
                {activeTab === 'students' && <div className="p-8 text-center text-gray-600 text-xs uppercase tracking-widest">Students List Coming Soon</div>}
            </div>

            {/* Modal */}
            {showPGNModal && (
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6 w-full max-w-lg relative shadow-2xl">
                        <button onClick={() => setShowPGNModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X className="w-5 h-5"/></button>
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-white"><Clipboard className="w-5 h-5 text-violet-400"/> Import Game</h2>
                        <textarea value={pgnInput} onChange={(e) => setPgnInput(e.target.value)} placeholder="Paste PGN here..." className="w-full h-32 bg-black/50 border border-white/10 rounded-lg p-3 text-xs font-mono text-gray-300 focus:outline-none focus:border-violet-500 mb-4 resize-none"></textarea>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setShowPGNModal(false)} className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-white uppercase">Cancel</button>
                            <button onClick={handlePGNSubmit} className="px-6 py-2 bg-violet-600 hover:bg-violet-700 rounded text-xs font-bold text-white uppercase tracking-wide">Load</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClassroomSidebar;