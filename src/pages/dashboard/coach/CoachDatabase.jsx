import React, { useState, useEffect } from "react";
import apiClient from "../../../lib/api.js"; 
import { motion } from "framer-motion";
import { ENDPOINTS } from "../../../lib/endpoints.js";
import { toast } from "sonner"; 
import { Database, Plus, BookOpen, CheckCircle, Circle, FileText, Layers, Search, Loader2, Copy } from "lucide-react";
import { Button } from "../../../components/ui/button.tsx"; 

const AUTHORIZED_COACH_IDS = [
  "68b9ea4597d09c8a268e8d38" // Replace with real IDs
];

const LEVELS = [
  'Beginner 1', 'Beginner 2', 'Beginner 3', 
  'Intermediate 1', 'Intermediate 2', 'Intermediate 3', 
  'Advanced 1', 'Advanced 2', 'Advanced 3', 'Master'
];

const CoachDatabase = () => {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  
  // --- View State ---
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedViewLevel, setSelectedViewLevel] = useState("Beginner 1"); // Default Level
  
  const [syllabus, setSyllabus] = useState([]);
  const [loadingSyllabus, setLoadingSyllabus] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    level: "Beginner 1",
    name: "",
    description: "",
    pgn: ""
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
      let courseList = [];
      if (Array.isArray(res.data)) courseList = res.data;
      else if (res.data?.data && Array.isArray(res.data.data)) courseList = res.data.data;
      else if (res.data?.courses && Array.isArray(res.data.courses)) courseList = res.data.courses;
      setCourses(courseList);
    } catch (err) {
      toast.error("Failed to load your courses.");
    }
  };

  // Fetch Syllabus (Uses both Course ID AND Level)
  const fetchSyllabusContent = async () => {
    if (!selectedCourse) return;
    setLoadingSyllabus(true);
    
    try {
      // Endpoint: /syllabus/course/:courseId?level=Intermediate 1
      const res = await apiClient.get(`/syllabus/course/${selectedCourse._id}?level=${encodeURIComponent(selectedViewLevel)}`);
      setSyllabus(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Could not fetch syllabus.");
    } finally {
      setLoadingSyllabus(false);
    }
  };

  // Trigger fetch when Course or Level changes
  useEffect(() => {
    if (selectedCourse) {
        fetchSyllabusContent();
    }
  }, [selectedCourse, selectedViewLevel]);


  const handleAddTechnique = async (e) => {
    e.preventDefault();
    if (!isAuthorized) return;

    try {
      await apiClient.post(ENDPOINTS.SYLLABUS.ADD, formData);
      toast.success(`Added to ${formData.level}`);
      setFormData({ ...formData, name: "", description: "", pgn: "" });
      
      // If adding to the currently viewed level, refresh list
      if (selectedCourse && selectedViewLevel === formData.level) {
        fetchSyllabusContent();
      }
    } catch (err) {
      toast.error("Failed to add technique.");
    }
  };

  const handleToggleComplete = async (techniqueId) => {
    if (!selectedCourse) return;

    // Optimistic UI Update (Standard toggle)
    setSyllabus(prev => prev.map(tech => 
      tech._id === techniqueId 
          ? { ...tech, status: tech.status === 'completed' ? 'pending' : 'completed' } 
          : tech
    ));

    try {
      const res = await apiClient.patch('/syllabus/course/toggle', { 
          courseId: selectedCourse._id,
          techniqueId 
      });
      
      // NEW: Check if Level Up happened
      if (res.data.data.leveledUp) {
          toast.success(res.data.message); // "Promoted to Beginner 2!"
          
          // Refresh the whole syllabus view to show the NEW level
          // We clear selectedViewLevel so fetchSyllabusContent picks up the new course.level default
          setSelectedViewLevel(res.data.data.nextLevelName);
          fetchSyllabusContent(); 
      } else {
          toast.success("Progress updated.");
      }

    } catch (err) {
      toast.error("Failed to update status.");
      fetchSyllabusContent(); // Revert on error
    }
  };

  const handleCopyPGN = (pgn) => {
      navigator.clipboard.writeText(pgn);
      toast.success("PGN Copied to Clipboard");
  };

  const onCourseSelect = (e) => {
    const courseId = e.target.value;
    const course = courses.find(c => c._id === courseId);
    if (course) {
      setSelectedCourse(course);
      // Optional: Auto-switch view to course's main level
      if (course.level) setSelectedViewLevel(course.level);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1429] via-[#0a1020] to-black p-6 text-white">
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold flex items-center gap-3">
             <Database className="w-8 h-8 text-blue-500" /> Coach Database
          </h1>
          {!isAuthorized && (
            <span className="bg-gray-800 text-gray-400 text-xs px-3 py-1 rounded-full border border-gray-700">
              View Only Access
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- LEFT: ADD FORM --- */}
          {isAuthorized && (
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="lg:col-span-1">
              <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-xl sticky top-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-white">
                  <Plus className="w-5 h-5 text-green-400"/> Add Global Technique
                </h2>
                
                <form onSubmit={handleAddTechnique} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400 ml-1 flex items-center gap-2"><Layers className="w-3 h-3"/> Target Level</label>
                    <select 
                      className="w-full bg-black/50 border border-gray-700 text-white p-2 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                      value={formData.level}
                      onChange={(e) => setFormData({...formData, level: e.target.value})}
                    >
                      {LEVELS.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-400 ml-1">Technique Name</label>
                    <input 
                      type="text" 
                      className="w-full bg-black/50 border border-gray-700 p-2 rounded-lg text-white placeholder-gray-600 focus:border-blue-500 transition-colors outline-none"
                      placeholder="e.g. The Windmill Tactic"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-400 ml-1">Description</label>
                    <textarea 
                      className="w-full bg-black/50 border border-gray-700 p-2 rounded-lg text-white placeholder-gray-600 focus:border-blue-500 transition-colors outline-none resize-none"
                      rows="3"
                      placeholder="Brief explanation..."
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-400 ml-1 flex items-center gap-2"><FileText className="w-3 h-3"/> PGN Data</label>
                    <textarea 
                      className="w-full bg-black/50 border border-gray-700 p-2 rounded-lg text-green-400 font-mono text-xs placeholder-gray-700 focus:border-green-500 transition-colors outline-none"
                      rows="4"
                      required
                      placeholder="1. e4 e5 ..."
                      value={formData.pgn}
                      onChange={(e) => setFormData({...formData, pgn: e.target.value})}
                    />
                  </div>

                  <Button type="submit" className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-all shadow-lg shadow-blue-900/20">
                    Add to Database
                  </Button>
                </form>
              </div>
            </motion.div>
          )}

          {/* --- RIGHT: SYLLABUS LIST --- */}
          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className={`${isAuthorized ? "lg:col-span-2" : "lg:col-span-3"} space-y-6`}>
            
            {/* Control Bar */}
            <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10 flex flex-col gap-4">
              
              <div className="flex items-center gap-2 text-gray-300 mb-2">
                <BookOpen className="w-5 h-5 text-purple-400"/>
                <span className="font-semibold">Syllabus Viewer</span>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                  {/* 1. SELECT COURSE */}
                  <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <select 
                      className="w-full bg-black/50 border border-gray-700 text-white pl-10 pr-4 py-2.5 rounded-lg appearance-none focus:ring-2 focus:ring-purple-600 outline-none cursor-pointer text-sm"
                      onChange={onCourseSelect}
                      value={selectedCourse ? selectedCourse._id : ""}
                    >
                      <option value="" disabled>Select Student Group...</option>
                      {courses.map(course => (
                        <option key={course._id} value={course._id}>
                          {course.name || course.title} ({course.level || "Beginner 1"})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 2. SELECT LEVEL */}
                  <div className="relative w-full md:w-48">
                    <Layers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <select 
                      className="w-full bg-black/50 border border-gray-700 text-white pl-10 pr-4 py-2.5 rounded-lg appearance-none focus:ring-2 focus:ring-blue-600 outline-none cursor-pointer text-sm"
                      onChange={(e) => setSelectedViewLevel(e.target.value)}
                      value={selectedViewLevel}
                    >
                      {LEVELS.map(lvl => (
                          <option key={lvl} value={lvl}>{lvl}</option>
                      ))}
                    </select>
                  </div>
              </div>
            </div>

            {/* List */}
            <div className="space-y-4">
              {!selectedCourse ? (
                <div className="flex flex-col items-center justify-center p-12 bg-white/5 rounded-2xl border border-dashed border-gray-700 text-gray-500">
                  <Search className="w-12 h-12 mb-4 opacity-20" />
                  <p>Select a course to view techniques.</p>
                </div>
              ) : loadingSyllabus ? (
                 <div className="flex items-center justify-center p-12 text-gray-400">
                    <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading...
                 </div>
              ) : syllabus.length === 0 ? (
                <div className="p-12 text-center text-gray-500 bg-white/5 rounded-2xl">
                  No techniques found for <strong>{selectedViewLevel}</strong>.
                </div>
              ) : (
                <div className="grid gap-3">
                  {syllabus.map((tech) => (
                    <motion.div key={tech._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 border border-white/10 p-4 rounded-xl hover:bg-white/10 transition-all group">
                      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-lg font-bold text-gray-100">{tech.name}</h3>
                            <button
                              onClick={() => handleToggleComplete(tech._id)}
                              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer
                                ${tech.status === 'completed'
                                  ? "bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30" 
                                  : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/30"
                                }`}
                            >
                              {tech.status === 'completed' ? <CheckCircle className="w-3 h-3"/> : <Circle className="w-3 h-3"/>}
                              {tech.status === 'completed' ? "Completed" : "Pending"}
                            </button>
                          </div>
                          <p className="text-sm text-gray-400 line-clamp-2">{tech.description || "No description provided."}</p>
                        </div>

                        <div className="w-full md:w-auto flex flex-col items-end gap-2">
                          <div className="w-full md:w-64 bg-black/40 rounded p-2 border border-white/5 relative group/code">
                             <code className="text-xs text-gray-500 font-mono line-clamp-1 block">{tech.pgn}</code>
                             <div className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover/code:opacity-100 transition-opacity rounded">
                                 <button onClick={() => handleCopyPGN(tech.pgn)} className="flex items-center gap-1 text-xs font-bold text-white">
                                     <Copy className="w-3 h-3"/> Copy PGN
                                 </button>
                             </div>
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default CoachDatabase;