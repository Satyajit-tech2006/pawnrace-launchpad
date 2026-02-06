import React, { useState } from 'react';
import { 
  MonitorUp, Clipboard, Download, X, 
  ChevronLeft, ChevronRight, Users, MessageSquare, List, Info, Lock, FileText
} from 'lucide-react';
import ClassroomChat from './ClassroomChat';
import VideoRoom from '../../../../components/VideoRoom'; 
import Move from './Move';

const ClassroomSidebar = ({ 
    activeTab, setActiveTab, 
    history, viewIndex, goToMove, 
    
    // Reference Props
    referenceHistory = [],
    onRestoreReference,

    onLoadPGN, onDownloadPGN, 
    chatMessages, onSendMessage,
    connectedUsers = [],
    roomId,
    userRole,         
    controls,         
    onAssignControl,
    currentPgn 
}) => {
    const [showPGNModal, setShowPGNModal] = useState(false);
    const [pgnInput, setPgnInput] = useState("");

    const handlePGNSubmit = () => {
        onLoadPGN(pgnInput);
        setShowPGNModal(false);
        setPgnInput("");
    };

    const TabButton = ({ id, label, icon: Icon }) => (
        <button 
            onClick={() => setActiveTab(id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all duration-200 rounded-md ${
                activeTab === id 
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/20' 
                : 'text-zinc-500 hover:bg-white/5 hover:text-zinc-300'
            }`}
        >
            <Icon className="w-3.5 h-3.5" />
            {label}
        </button>
    );

    // Helper component for restricted access message
    const RestrictedAccess = ({ tabName = "Content" }) => (
        <div className="flex flex-col items-center justify-center h-full text-zinc-500 space-y-4 p-6">
            <div className="w-16 h-16 rounded-full bg-zinc-900/80 flex items-center justify-center border border-white/5 shadow-inner">
                <Lock className="w-8 h-8 opacity-50" />
            </div>
            <div className="text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-1">Access Restricted</p>
                <p className="text-[10px] opacity-60">Only Coach are authorized to view {tabName}</p>
            </div>
        </div>
    );

    return (
        <div className="w-[40vw] min-w-[350px] bg-[#0F0F12] border-l border-white/5 flex flex-col h-full shrink-0 shadow-2xl shadow-black transition-all duration-300 ease-in-out">
            
            {/* 1. VIDEO AREA */}
            <div className="w-full shrink-0 aspect-video bg-black relative border-b border-white/5 overflow-hidden shadow-md z-20">
                {roomId ? (
                    <VideoRoom roomId={roomId} />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-zinc-600 bg-zinc-900/50">
                        <MonitorUp className="w-10 h-10 mb-3 opacity-20"/>
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Waiting for Video...</span>
                    </div>
                )}
            </div>

            {/* 2. TABS */}
            <div className="p-2 bg-[#0F0F12] border-b border-white/5 z-10">
                <div className="flex bg-black/40 p-1 rounded-lg border border-white/5">
                    <TabButton id="moves" label="Live" icon={List} />
                    <TabButton id="pgn" label="PGN" icon={FileText} />
                    <TabButton id="chat" label="Chat" icon={MessageSquare} />
                    <TabButton id="students" label="People" icon={Users} />
                </div>
            </div>

            {/* 3. CONTENT AREA */}
            <div className="flex-1 min-h-0 bg-[#0F0F12] relative flex flex-col">
                
                {/* === LIVE MOVES TAB (RESTRICTED TO COACH) === */}
                {activeTab === 'moves' && (
                    <div className="flex flex-col h-full">
                        {userRole === 'Coach' ? (
                            <>
                                <Move 
                                    history={history}
                                    viewIndex={viewIndex}
                                    goToMove={goToMove}
                                    userRole={userRole}
                                />
                                {/* Footer Controls */}
                                <div className="p-3 border-t border-white/5 bg-[#121215] space-y-3 shrink-0">
                                    <div className="flex justify-center gap-1">
                                        <ControlBtn onClick={() => goToMove(-1)} icon={ChevronLeft} double title="Start"/>
                                        <ControlBtn onClick={() => goToMove(viewIndex <= -1 ? -1 : viewIndex - 1)} icon={ChevronLeft} title="Prev"/>
                                        <ControlBtn onClick={() => goToMove(viewIndex >= history.length - 1 ? history.length - 1 : viewIndex + 1)} icon={ChevronRight} title="Next"/>
                                        <ControlBtn onClick={() => goToMove(history.length - 1)} icon={ChevronRight} double title="End"/>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button onClick={() => setShowPGNModal(true)} className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 py-2.5 rounded-md text-[10px] font-bold uppercase text-zinc-300 transition-colors border border-white/5">
                                            <Clipboard className="w-3 h-3"/> Import PGN
                                        </button>
                                        <button onClick={onDownloadPGN} className="flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 py-2.5 rounded-md text-[10px] font-bold uppercase text-white transition-colors shadow-lg shadow-violet-900/20">
                                            <Download className="w-3 h-3"/> Download
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <RestrictedAccess tabName="Moves" />
                        )}
                    </div>
                )}

                {/* === PGN REFERENCE TAB (RESTRICTED TO COACH, STATIC HISTORY) === */}
                {activeTab === 'pgn' && (
                    <div className="flex flex-col h-full">
                        {userRole === 'Coach' ? (
                            <>
                                <div className="p-2 border-b border-white/5 bg-[#121215] text-[10px] text-zinc-500 text-center font-bold uppercase tracking-wide">
                                    Original Syllabus (Reference)
                                </div>
                                <Move 
                                    history={referenceHistory}
                                    viewIndex={-1} // Don't highlight current move to differentiate from live, or maintain sync if preferred. Passing -1 allows pure navigation.
                                    goToMove={onRestoreReference} // Clicking here restores the game to this point
                                    userRole={userRole}
                                />
                            </>
                        ) : (
                            <RestrictedAccess tabName="Syllabus" />
                        )}
                    </div>
                )}

                {/* === CHAT TAB === */}
                {activeTab === 'chat' && (
                    <div className="h-full flex flex-col">
                        <ClassroomChat messages={chatMessages || []} onSendMessage={onSendMessage} />
                    </div>
                )}

                {/* === STUDENTS TAB === */}
                {activeTab === 'students' && (
                    <div className="absolute inset-0 overflow-y-auto p-4 space-y-3">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Connected</h3>
                            <span className="bg-green-500/10 text-green-400 text-[10px] px-2 py-0.5 rounded-full font-bold border border-green-500/20">{connectedUsers.length} Online</span>
                        </div>
                          
                        {connectedUsers.map((u, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-zinc-900/40 rounded-lg border border-white/5 hover:border-violet-500/30 transition-colors group">
                                <div className="relative">
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                                        {u.name.charAt(0).toUpperCase()}
                                    </div>
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-zinc-200 truncate flex items-center gap-2">
                                        {u.name}
                                        {controls?.white === u.sessionId && <span className="text-[9px] bg-white text-black px-1 rounded font-bold shadow-sm" title="Controls White">W</span>}
                                        {controls?.black === u.sessionId && <span className="text-[9px] bg-zinc-800 text-white px-1 rounded font-bold border border-white/20" title="Controls Black">B</span>}
                                    </p>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">{u.role}</p>
                                </div>

                                {userRole === 'Coach' && (
                                    <div className="flex gap-1">
                                        <button 
                                            onClick={() => onAssignControl('white', controls?.white === u.sessionId ? null : u.sessionId)}
                                            className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold border transition-all ${
                                                controls?.white === u.sessionId 
                                                ? 'bg-white text-black border-white shadow-[0_0_8px_rgba(255,255,255,0.3)]' 
                                                : 'bg-transparent text-zinc-500 border-zinc-700 hover:border-white hover:text-white'
                                            }`}
                                        >W</button>
                                        <button 
                                            onClick={() => onAssignControl('black', controls?.black === u.sessionId ? null : u.sessionId)}
                                            className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold border transition-all ${
                                                controls?.black === u.sessionId 
                                                ? 'bg-black text-white border-white shadow-[0_0_8px_rgba(255,255,255,0.1)]' 
                                                : 'bg-transparent text-zinc-500 border-zinc-700 hover:border-white hover:text-white'
                                            }`}
                                        >B</button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* PGN MODAL (Coach Only) */}
            {showPGNModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-6 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#18181B] border border-white/10 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#1f1f22]">
                            <h2 className="text-sm font-bold flex items-center gap-2 text-white uppercase tracking-wider">
                                <Clipboard className="w-4 h-4 text-violet-400"/> Import Game (PGN)
                            </h2>
                            <button onClick={() => setShowPGNModal(false)} className="text-zinc-500 hover:text-white transition-colors"><X className="w-4 h-4"/></button>
                        </div>
                        <div className="p-4">
                            <textarea 
                                value={pgnInput} 
                                onChange={(e) => setPgnInput(e.target.value)} 
                                placeholder="1. e4 e5 2. Nf3 Nc6..." 
                                className="w-full h-48 bg-black/30 border border-white/10 rounded-lg p-4 text-xs font-mono text-zinc-300 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 resize-none transition-all placeholder:text-zinc-700"
                            ></textarea>
                        </div>
                        <div className="p-4 bg-[#1f1f22] border-t border-white/5 flex justify-end gap-3">
                            <button onClick={() => setShowPGNModal(false)} className="px-4 py-2 text-xs font-bold text-zinc-400 hover:text-white uppercase transition-colors">Cancel</button>
                            <button onClick={handlePGNSubmit} className="px-6 py-2 bg-violet-600 hover:bg-violet-500 rounded text-xs font-bold text-white uppercase tracking-wide shadow-lg shadow-violet-900/20 transition-all transform hover:scale-105 active:scale-95">Load Game</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const ControlBtn = ({ onClick, icon: Icon, double, title }) => (
    <button 
        onClick={onClick} 
        title={title}
        className="h-8 flex-1 flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 rounded text-zinc-400 hover:text-white transition-colors border border-white/5"
    >
        <div className="flex -space-x-1">
            <Icon className="w-3.5 h-3.5" />
            {double && <Icon className="w-3.5 h-3.5" />}
        </div>
    </button>
);

export default ClassroomSidebar;