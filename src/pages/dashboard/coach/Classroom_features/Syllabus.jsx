import React, { useState, useEffect } from "react";
import apiClient from "../../../../lib/api";
import { toast } from "sonner";
import { 
  X, 
  BookOpen, 
  CheckCircle, 
  Circle, 
  Loader2, 
  Layers, 
  MonitorUp,
  ChevronDown,
  ChevronRight
} from "lucide-react";

const LEVELS = [
  'Beginner 1', 'Beginner 2', 'Beginner 3', 
  'Intermediate 1', 'Intermediate 2', 'Intermediate 3', 
  'Advanced 1', 'Advanced 2', 'Advanced 3', 'Master'
];

const Syllabus = ({ isOpen, onClose, onLoadPGN, onPlayPlaylist, roomId }) => {
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState("Beginner 1");
  const [techniques, setTechniques] = useState([]);
  
  // Track which technique is currently expanded (Accordion)
  const [expandedTechId, setExpandedTechId] = useState(null);

  // 1. INITIALIZATION: Find the Course based on Room ID
  useEffect(() => {
    if (isOpen && roomId) {
      fetchClassContext();
    }
  }, [isOpen, roomId]);

  // 2. LISTENER: Fetch techniques whenever Course or Level changes
  useEffect(() => {
    if (course && selectedLevel) {
      fetchTechniques();
    }
  }, [course, selectedLevel]);

  // --- API HANDLERS ---

  const fetchClassContext = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/newclasses/room/${roomId}`);
      const classData = res.data.data;
      
      if (classData && classData.course) {
        setCourse(classData.course);
        // Default the view to the course's current level
        if (classData.course.level) {
            setSelectedLevel(classData.course.level);
        }
      } else {
        toast.error("Could not link this room to a course.");
      }
    } catch (error) {
      console.error("Error fetching class context:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTechniques = async () => {
    if (!course) return;
    
    try {
      const res = await apiClient.get(`/syllabus/course/${course._id}?level=${encodeURIComponent(selectedLevel)}`);
      
      // Robust check for data structure
      const techniqueList = Array.isArray(res.data.data) 
          ? res.data.data 
          : res.data.data.techniques || [];

      setTechniques(techniqueList);

    } catch (error) {
      console.error("Error loading techniques:", error);
      toast.error("Failed to load syllabus list.");
    }
  };

  const handleToggleChapter = async (chapterId) => {
    if (!course) return;

    // 1. Optimistic UI Update (Deep nested update)
    setTechniques(prev => prev.map(tech => ({
        ...tech,
        chapters: tech.chapters.map(ch => 
            ch._id === chapterId 
                ? { ...ch, status: ch.status === 'completed' ? 'pending' : 'completed' }
                : ch
        )
    })));

    try {
      // 2. Call API
      await apiClient.patch('/syllabus/course/toggle', { 
        courseId: course._id,
        chapterId 
      });
      toast.success("Progress updated");
    } catch (error) {
      toast.error("Failed to save progress");
      fetchTechniques(); // Revert on error
    }
  };

  // UPDATED: Handles loading a full playlist for the technique
  const handleLoadChapter = (chapters, index) => {
    if (typeof onPlayPlaylist === 'function') {
        onPlayPlaylist(chapters, index);
        // onClose(); // Optional: Auto-close the modal
    } else if (typeof onLoadPGN === 'function') {
        // Fallback if playlist function isn't provided
        onLoadPGN(chapters[index].pgn, chapters[index].name);
    } else {
        toast.error("Error: Cannot load to board.");
    }
  };

  const toggleAccordion = (id) => {
      setExpandedTechId(prev => prev === id ? null : id);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-[#1a1a1a] border border-white/10 w-full max-w-2xl h-[85vh] rounded-2xl flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* HEADER */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#202020] rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-violet-400" /> 
              Class Syllabus
            </h2>
            {course && (
              <p className="text-xs text-gray-400 mt-1">
                Course: <span className="text-gray-200 font-semibold">{course.title}</span>
              </p>
            )}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONTROLS (Level Selector) */}
        <div className="p-4 border-b border-white/5 bg-[#1a1a1a] flex items-center gap-3">
            <Layers className="w-4 h-4 text-gray-500" />
            <select 
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="flex-1 bg-black/50 border border-white/10 text-white text-sm rounded-lg px-3 py-2 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all cursor-pointer"
            >
                {LEVELS.map(lvl => (
                    <option key={lvl} value={lvl}>{lvl}</option>
                ))}
            </select>
        </div>

        {/* CONTENT LIST */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-[#111]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-500 gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-violet-500" />
                <span className="text-xs">Loading curriculum...</span>
            </div>
          ) : !course ? (
             <div className="text-center py-10 text-red-400 text-sm">
               Error: Could not link this classroom to a course.
             </div>
          ) : techniques.length === 0 ? (
            <div className="text-center py-12 text-gray-500 text-sm border border-dashed border-white/5 rounded-xl">
              No techniques found for <strong>{selectedLevel}</strong>.
            </div>
          ) : (
            techniques.map((tech) => {
              // Calculate progress for header (e.g., 2/5)
              const completedCount = tech.chapters.filter(c => c.status === 'completed').length;
              const totalCount = tech.chapters.length;
              const isExpanded = expandedTechId === tech._id;

              return (
                <div key={tech._id} className="border border-white/5 bg-[#161616] rounded-xl overflow-hidden transition-all">
                  
                  {/* Technique Header (Clickable) */}
                  <button 
                    onClick={() => toggleAccordion(tech._id)}
                    className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                        {isExpanded ? <ChevronDown className="w-4 h-4 text-violet-400"/> : <ChevronRight className="w-4 h-4 text-gray-500"/>}
                        <div>
                            <h4 className={`text-sm font-bold ${isExpanded ? 'text-violet-200' : 'text-gray-200'}`}>
                                {tech.name}
                            </h4>
                            <p className="text-[10px] text-gray-500 mt-0.5">
                                {completedCount}/{totalCount} chapters completed
                            </p>
                        </div>
                    </div>
                    {/* Progress Bar Mini */}
                    <div className="w-16 h-1 bg-gray-800 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-violet-500 transition-all duration-500" 
                            style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
                        />
                    </div>
                  </button>

                  {/* Chapters List (Expanded) */}
                  {isExpanded && (
                    <div className="border-t border-white/5 bg-[#0f0f0f]">
                        {tech.chapters.length === 0 ? (
                            <div className="p-4 text-center text-xs text-gray-600 italic">
                                No chapters available yet.
                            </div>
                        ) : (
                            // UPDATED: Using index in map to pass to handler
                            tech.chapters.map((ch, index) => (
                                <div key={ch._id} className="flex items-center justify-between p-3 pl-11 hover:bg-white/5 border-b border-white/5 last:border-0 transition-colors group">
                                    
                                    <div className="flex items-center gap-3">
                                        <button 
                                            onClick={() => handleToggleChapter(ch._id)}
                                            className={`transition-colors ${ch.status === 'completed' ? 'text-green-400' : 'text-gray-600 hover:text-gray-400'}`}
                                        >
                                            {ch.status === 'completed' ? <CheckCircle className="w-4 h-4"/> : <Circle className="w-4 h-4"/>}
                                        </button>
                                        <div className="flex flex-col">
                                            <span className={`text-xs font-medium ${ch.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-300'}`}>
                                                {ch.name}
                                            </span>
                                            {/* Preview PGN Snippet */}
                                            <span className="text-[9px] text-gray-600 font-mono line-clamp-1 max-w-[200px]">
                                                {ch.pgn}
                                            </span>
                                        </div>
                                    </div>

                                    {/* UPDATED: Calling handleLoadChapter with the full list and index */}
                                    <button 
                                        onClick={() => handleLoadChapter(tech.chapters, index)}
                                        className="flex items-center gap-1.5 px-3 py-1 bg-violet-600/10 hover:bg-violet-600 text-violet-300 hover:text-white text-[10px] font-bold uppercase rounded transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <MonitorUp className="w-3 h-3" /> Load
                                    </button>

                                </div>
                            ))
                        )}
                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};

export default Syllabus;