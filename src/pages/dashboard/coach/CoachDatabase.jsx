import React, { useState, useEffect } from "react";
import apiClient from "../../../lib/api.js"; 
import { motion } from "framer-motion";
import { ENDPOINTS } from "../../../lib/endpoints.js";
import { toast } from "sonner"; 
import { Database, Plus, BookOpen, CheckCircle, Circle, FileText, Layers, Search, Loader2, Copy, Save } from "lucide-react";
import { Button } from "../../../components/ui/button.tsx"; 

const AUTHORIZED_COACH_IDS = [
  "68b9ea4597d09c8a268e8d38","68c5d1d20127081a51b8c073" 
];

const LEVELS = [
  'Beginner 1', 'Beginner 2', 'Beginner 3', 
  'Intermediate 1', 'Intermediate 2', 'Intermediate 3', 
  'Advanced 1', 'Advanced 2', 'Advanced 3', 'Master'
];

const CoachDatabase = () => {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedViewLevel, setSelectedViewLevel] = useState("Beginner 1");
  const [syllabus, setSyllabus] = useState([]);
  const [loadingSyllabus, setLoadingSyllabus] = useState(false);
  
  // State for adding new chapters (Map of techniqueID -> pgn string)
  const [newChapterPgns, setNewChapterPgns] = useState({});

  // Form State (Container Only)
  const [formData, setFormData] = useState({
    level: "Beginner 1",
    name: "",
    description: ""
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
    fetchMyCourses();
  }, []);

  const isAuthorized = user && AUTHORIZED_COACH_IDS.includes(user._id);

  // --- API CALLS ---
  const fetchMyCourses = async () => {
    try {
      const res = await apiClient.get(ENDPOINTS.COURSES.GET_MY_COURSES_AS_COACH);
      let list = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setCourses(list);
    } catch (err) { toast.error("Failed to load courses"); }
  };

  const fetchSyllabusContent = async () => {
    if (!selectedCourse) return;
    setLoadingSyllabus(true);
    try {
      const res = await apiClient.get(`/syllabus/course/${selectedCourse._id}?level=${encodeURIComponent(selectedViewLevel)}`);
      setSyllabus(res.data.data || []);
    } catch (err) { toast.error("Could not fetch syllabus"); } 
    finally { setLoadingSyllabus(false); }
  };

  useEffect(() => { if (selectedCourse) fetchSyllabusContent(); }, [selectedCourse, selectedViewLevel]);

  // 1. CREATE TECHNIQUE CONTAINER
  const handleAddTechnique = async (e) => {
    e.preventDefault();
    if (!isAuthorized) return;
    try {
      await apiClient.post(ENDPOINTS.SYLLABUS.ADD, formData);
      toast.success(`Technique Created in ${formData.level}`);
      setFormData({ ...formData, name: "", description: "" });
      
      // Refresh if viewing that level
      if (selectedCourse && selectedViewLevel === formData.level) fetchSyllabusContent();
    } catch (err) { toast.error("Failed to create technique"); }
  };

  // 2. ADD CHAPTER TO TECHNIQUE
  const handleAddChapter = async (techniqueId) => {
    const pgn = newChapterPgns[techniqueId];
    if (!pgn || !pgn.trim()) return toast.error("Please enter PGN");

    try {
        await apiClient.post('/syllabus/chapter/add', { techniqueId, pgn });
        toast.success("Chapter Added!");
        
        // Clear input
        setNewChapterPgns(prev => ({ ...prev, [techniqueId]: "" }));
        
        // Refresh list
        fetchSyllabusContent();
    } catch (err) { toast.error("Failed to add chapter"); }
  };

  // 3. TOGGLE CHAPTER PROGRESS
  const handleToggleChapter = async (chapterId) => {
    if (!selectedCourse) return;
    try {
      const res = await apiClient.patch('/syllabus/course/toggle', { 
          courseId: selectedCourse._id,
          chapterId 
      });
      
      if (res.data.data.leveledUp) {
          toast.success(res.data.message);
          setSelectedViewLevel(res.data.data.nextLevelName); // Switch view to new level
      } else {
          toast.success("Progress updated");
          // Update local state (Optimistic or Refresh)
          fetchSyllabusContent(); 
      }
    } catch (err) { toast.error("Failed to update status"); }
  };

  const onCourseSelect = (e) => {
    const c = courses.find(course => course._id === e.target.value);
    if (c) {
      setSelectedCourse(c);
      if (c.level) setSelectedViewLevel(c.level);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1429] via-[#0a1020] to-black p-6 text-white">
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="max-w-7xl mx-auto">
        
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold flex items-center gap-3">
             <Database className="w-8 h-8 text-blue-500" /> Coach Database
          </h1>
          {!isAuthorized && <span className="bg-gray-800 text-gray-400 text-xs px-3 py-1 rounded-full">View Only</span>}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- LEFT: CREATE TECHNIQUE FORM --- */}
          {isAuthorized && (
            <div className="lg:col-span-1">
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-xl sticky top-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-white"><Plus className="w-5 h-5 text-green-400"/> New Technique</h2>
                <form onSubmit={handleAddTechnique} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400 ml-1">Target Level</label>
                    <select className="w-full bg-black/50 border border-gray-700 text-white p-2 rounded-lg" value={formData.level} onChange={(e) => setFormData({...formData, level: e.target.value})}>
                      {LEVELS.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400 ml-1">Name</label>
                    <input type="text" className="w-full bg-black/50 border border-gray-700 p-2 rounded-lg text-white" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. The Pin"/>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400 ml-1">Description</label>
                    <textarea className="w-full bg-black/50 border border-gray-700 p-2 rounded-lg text-white" rows="3" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Description..."/>
                  </div>
                  <Button type="submit" className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white">Create Container</Button>
                </form>
              </div>
            </div>
          )}

          {/* --- RIGHT: SYLLABUS VIEWER --- */}
          <div className={`${isAuthorized ? "lg:col-span-2" : "lg:col-span-3"} space-y-6`}>
            
            {/* Filter Bar */}
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col md:flex-row gap-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-3 text-gray-500 w-4 h-4" />
                <select className="w-full bg-black/50 border border-gray-700 text-white pl-10 pr-4 py-2.5 rounded-lg cursor-pointer" onChange={onCourseSelect} value={selectedCourse ? selectedCourse._id : ""}>
                  <option value="" disabled>Select Student Group...</option>
                  {courses.map(c => <option key={c._id} value={c._id}>{c.name || c.title} ({c.level || "Beginner 1"})</option>)}
                </select>
              </div>
              <div className="relative w-full md:w-48">
                <Layers className="absolute left-3 top-3 text-gray-500 w-4 h-4" />
                <select className="w-full bg-black/50 border border-gray-700 text-white pl-10 pr-4 py-2.5 rounded-lg cursor-pointer" onChange={(e) => setSelectedViewLevel(e.target.value)} value={selectedViewLevel}>
                  {LEVELS.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                </select>
              </div>
            </div>

            {/* Techniques List */}
            <div className="space-y-4">
              {!selectedCourse ? (
                <div className="p-12 text-center text-gray-500 bg-white/5 rounded-2xl border border-dashed border-gray-700">Select a course to start.</div>
              ) : loadingSyllabus ? (
                 <div className="flex justify-center p-12 text-gray-400"><Loader2 className="w-6 h-6 animate-spin mr-2"/> Loading...</div>
              ) : syllabus.length === 0 ? (
                <div className="p-12 text-center text-gray-500 bg-white/5 rounded-2xl">No techniques in {selectedViewLevel}.</div>
              ) : (
                syllabus.map((tech) => (
                  <div key={tech._id} className="bg-white/5 border border-white/10 p-5 rounded-xl">
                    
                    {/* Technique Header */}
                    <div className="mb-4">
                        <h3 className="text-xl font-bold text-gray-100">{tech.name}</h3>
                        {tech.description && <p className="text-sm text-gray-400">{tech.description}</p>}
                    </div>

                    {/* Chapters List */}
                    <div className="space-y-2 mb-4">
                        {tech.chapters.length === 0 && <div className="text-xs text-gray-600 italic">No chapters yet. Add one below.</div>}
                        
                        {tech.chapters.map((ch) => (
                            <div key={ch._id} className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-white/5 group">
                                <div className="flex items-center gap-3">
                                    {/* Toggle Checkbox */}
                                    <button 
                                        onClick={() => handleToggleChapter(ch._id)}
                                        className={`transition-colors ${ch.status === 'completed' ? 'text-green-400' : 'text-gray-600 hover:text-gray-400'}`}
                                    >
                                        {ch.status === 'completed' ? <CheckCircle className="w-5 h-5"/> : <Circle className="w-5 h-5"/>}
                                    </button>
                                    <span className={`text-sm ${ch.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-300'}`}>
                                        {ch.name}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => {navigator.clipboard.writeText(ch.pgn); toast.success("Copied")}} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                                        <Copy className="w-3 h-3"/> PGN
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* AUTHORIZED: Add Chapter Input */}
                    {isAuthorized && (
                        <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
                            <input 
                                type="text" 
                                className="flex-1 bg-black/50 border border-gray-700 rounded px-3 py-2 text-sm text-gray-300 placeholder-gray-600 focus:border-green-500 outline-none"
                                placeholder="Paste PGN here to add a new chapter..."
                                value={newChapterPgns[tech._id] || ""}
                                onChange={(e) => setNewChapterPgns(prev => ({...prev, [tech._id]: e.target.value}))}
                            />
                            <button 
                                onClick={() => handleAddChapter(tech._id)}
                                className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded text-sm font-bold flex items-center gap-2"
                            >
                                <Save className="w-4 h-4"/> Save
                            </button>
                        </div>
                    )}

                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CoachDatabase;