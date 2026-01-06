import React, { useEffect, useState } from 'react';
import { X, BookOpen, ChevronDown, ChevronRight, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import apiClient from '../../../../lib/api'; 
import { ENDPOINTS } from '../../../../lib/endpoints'; 

const Syllabus = ({ isOpen, onClose, onLoadPGN }) => {
    const [syllabi, setSyllabi] = useState([]);
    const [loading, setLoading] = useState(false);
    const [expandedLevel, setExpandedLevel] = useState(null);

    // Fetch Syllabus Data on Open
    useEffect(() => {
        if (isOpen) {
            const fetchSyllabus = async () => {
                try {
                    setLoading(true);
                    // We fetch ALL levels so the coach has full access
                    const res = await apiClient.get(ENDPOINTS.SYLLABUS.GET_ALL);
                    setSyllabi(res.data.data || []);
                } catch (error) {
                    console.error("Error loading syllabus:", error);
                    toast.error("Failed to load syllabus");
                } finally {
                    setLoading(false);
                }
            };
            fetchSyllabus();
        }
    }, [isOpen]);

    const handleToggleLevel = (levelId) => {
        setExpandedLevel(expandedLevel === levelId ? null : levelId);
    };

    const handleLoad = (pgn, name) => {
        onLoadPGN(pgn);
        toast.success(`Loaded: ${name}`);
        onClose(); // Optional: Close modal after selection
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#1a1a1a] border border-white/10 w-full max-w-2xl h-[80vh] rounded-2xl flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
                
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#202020] rounded-t-2xl">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-violet-400" /> 
                        Course Syllabus
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                    {loading ? (
                        <div className="text-center py-10 text-gray-500 animate-pulse">Loading curriculum...</div>
                    ) : syllabi.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">No syllabus found.</div>
                    ) : (
                        syllabi.map((item) => (
                            <div key={item._id} className="border border-white/5 rounded-xl bg-[#111] overflow-hidden">
                                {/* Level Header */}
                                <button 
                                    onClick={() => handleToggleLevel(item._id)}
                                    className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors text-left"
                                >
                                    <span className="font-bold text-gray-200">{item.level}</span>
                                    {expandedLevel === item._id ? <ChevronDown className="w-4 h-4 text-violet-400"/> : <ChevronRight className="w-4 h-4 text-gray-500"/>}
                                </button>

                                {/* Techniques List */}
                                {expandedLevel === item._id && (
                                    <div className="border-t border-white/5 bg-black/20">
                                        {item.techniques && item.techniques.length > 0 ? (
                                            item.techniques.map((tech) => (
                                                <div key={tech._id} className="p-4 border-b border-white/5 last:border-0 flex items-center justify-between gap-4 group hover:bg-white/5 transition-colors">
                                                    <div>
                                                        <h4 className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors">{tech.name}</h4>
                                                        {tech.description && (
                                                            <p className="text-xs text-gray-500 mt-1 line-clamp-1">{tech.description}</p>
                                                        )}
                                                    </div>
                                                    <button 
                                                        onClick={() => handleLoad(tech.pgn, tech.name)}
                                                        className="flex items-center gap-2 px-3 py-1.5 bg-violet-600/20 hover:bg-violet-600 text-violet-300 hover:text-white border border-violet-500/30 rounded text-xs font-bold uppercase tracking-wide transition-all"
                                                    >
                                                        <Copy className="w-3 h-3" /> Paste PGN
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-4 text-xs text-gray-600 italic">No techniques added yet.</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Syllabus;