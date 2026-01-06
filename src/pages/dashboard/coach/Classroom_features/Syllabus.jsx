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
  Copy, 
  MonitorUp 
} from "lucide-react";

const LEVELS = [
  'Beginner 1', 'Beginner 2', 'Beginner 3', 
  'Intermediate 1', 'Intermediate 2', 'Intermediate 3', 
  'Advanced 1', 'Advanced 2', 'Advanced 3', 'Master'
];

const Syllabus = ({ isOpen, onClose, onLoadPGN, roomId }) => {
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState("Beginner 1");
  const [techniques, setTechniques] = useState([]);

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
      // We need to find which Course this Room belongs to.
      // Since we don't have a direct "Get Class By RoomID" endpoint in your list,
      // we assume we can find it via the coach's classes or a specific endpoint.
      // Ideally, you should add: router.get('/by-room/:roomId', ...) to your backend.
      // FOR NOW: We will use a workaround or assume the endpoint exists.
      
      // OPTION A: If you created the endpoint I suggested earlier:
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
      // Fallback: If API fails, we can't show progress, but we can show generic syllabus
      // toast.error("Failed to load class details.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTechniques = async () => {
    if (!course) return;
    
    try {
      const res = await apiClient.get(`/syllabus/course/${course._id}?level=${encodeURIComponent(selectedLevel)}`);
      
      // DEBUG: See exactly what the backend sends
      console.log("Syllabus API Response:", res.data);

      // FIX: Robust check. 
      // If 'data' is the array (your current case), use it.
      // If 'data.techniques' exists (future case), use that.
      const techniqueList = Array.isArray(res.data.data) 
          ? res.data.data 
          : res.data.data.techniques || [];

      setTechniques(techniqueList);

    } catch (error) {
      console.error("Error loading techniques:", error);
      toast.error("Failed to load syllabus list.");
    }
  };

  const handleToggleComplete = async (techniqueId) => {
    if (!course) return;

    // 1. Optimistic UI Update (Immediate feedback)
    setTechniques(prev => prev.map(t => 
      t._id === techniqueId 
        ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' } 
        : t
    ));

    try {
      // 2. Call API
      await apiClient.patch('/syllabus/course/toggle', { 
        courseId: course._id,
        techniqueId 
      });
      toast.success("Progress updated");
    } catch (error) {
      toast.error("Failed to save progress");
      fetchTechniques(); // Revert on error
    }
  };

  const handleLoad = (pgn, name) => {
    onLoadPGN(pgn);
    toast.success(`Loaded: ${name}`);
    // Optional: Auto-close if you want
    // onClose(); 
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
            techniques.map((tech) => (
              <div key={tech._id} className="border border-white/5 bg-[#161616] p-4 rounded-xl flex flex-col gap-3 group hover:border-violet-500/30 transition-colors">
                
                {/* Top Row: Title & Toggle */}
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h4 className="text-sm font-bold text-gray-100 group-hover:text-violet-300 transition-colors">
                            {tech.name}
                        </h4>
                        {tech.description && (
                            <p className="text-xs text-gray-500 mt-1 line-clamp-1">{tech.description}</p>
                        )}
                    </div>
                    
                    <button 
                        onClick={() => handleToggleComplete(tech._id)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border
                        ${tech.status === 'completed'
                            ? "bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20"
                            : "bg-gray-800 text-gray-500 border-gray-700 hover:border-gray-500 hover:text-gray-300"
                        }`}
                    >
                        {tech.status === 'completed' ? <CheckCircle className="w-3 h-3"/> : <Circle className="w-3 h-3"/>}
                        {tech.status === 'completed' ? "Done" : "Pending"}
                    </button>
                </div>

                {/* Bottom Row: PGN & Load Button */}
                <div className="flex items-center gap-3 mt-1">
                    <div className="flex-1 bg-black/40 rounded px-3 py-1.5 border border-white/5">
                        <code className="text-[10px] text-gray-500 font-mono line-clamp-1">
                            {tech.pgn}
                        </code>
                    </div>
                    <button 
                        onClick={() => handleLoad(tech.pgn, tech.name)}
                        className="flex items-center gap-2 px-4 py-1.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold rounded transition-colors shadow-lg shadow-violet-900/20"
                    >
                        <MonitorUp className="w-3 h-3" /> Load
                    </button>
                </div>

              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default Syllabus;