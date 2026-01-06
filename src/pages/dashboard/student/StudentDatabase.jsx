import React, { useState, useEffect } from "react";
import apiClient from "../../../lib/api.js"; 
import { motion } from "framer-motion";
import { toast } from "sonner"; 
import { Database, BookOpen, CheckCircle, Circle, Layers, Search, Loader2, Copy, ChevronDown, ChevronRight } from "lucide-react";

// You might need to adjust this endpoint path based on your routes
const GET_MY_COURSES_ENDPOINT = "/courses/student/my-courses"; 

const LEVELS = [
  'Beginner 1', 'Beginner 2', 'Beginner 3', 
  'Intermediate 1', 'Intermediate 2', 'Intermediate 3', 
  'Advanced 1', 'Advanced 2', 'Advanced 3', 'Master'
];

const StudentDatabase = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedViewLevel, setSelectedViewLevel] = useState("Beginner 1");
  const [syllabus, setSyllabus] = useState([]);
  const [loadingSyllabus, setLoadingSyllabus] = useState(false);
  
  // Accordion State
  const [expandedTechId, setExpandedTechId] = useState(null);

  useEffect(() => {
    fetchMyCourses();
  }, []);

  // Fetch Syllabus when filters change
  useEffect(() => {
    if (selectedCourse) {
        fetchSyllabusContent();
    }
  }, [selectedCourse, selectedViewLevel]);

  // --- API CALLS ---
  const fetchMyCourses = async () => {
    try {
      // Assuming you have an endpoint that returns the courses this student is enrolled in
      const res = await apiClient.get(GET_MY_COURSES_ENDPOINT);
      const list = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setCourses(list);
      
      // Auto-select first course
      if (list.length > 0) {
          const first = list[0];
          setSelectedCourse(first);
          if (first.level) setSelectedViewLevel(first.level);
      }
    } catch (err) {
      console.error(err);
      // toast.error("Failed to load your courses."); 
    }
  };

  const fetchSyllabusContent = async () => {
    if (!selectedCourse) return;
    setLoadingSyllabus(true);
    try {
      // Using the same robust endpoint as the coach (Read-Only)
      const res = await apiClient.get(`/syllabus/course/${selectedCourse._id}?level=${encodeURIComponent(selectedViewLevel)}`);
      
      const data = res.data.data;
      // Handle both structure types (array or object with .techniques)
      const techniqueList = Array.isArray(data) ? data : (data.techniques || []);
      
      setSyllabus(techniqueList);
    } catch (err) {
      console.error(err);
      toast.error("Could not fetch syllabus.");
    } finally {
      setLoadingSyllabus(false);
    }
  };

  const toggleAccordion = (id) => {
      setExpandedTechId(prev => prev === id ? null : id);
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
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold flex items-center gap-3">
             <Database className="w-8 h-8 text-cyan-500" /> Student Database
          </h1>
          <span className="bg-cyan-900/30 text-cyan-400 border border-cyan-500/30 text-xs px-3 py-1 rounded-full">
             Read Only
          </span>
        </div>

        <div className="grid grid-cols-1 gap-8">
            
            {/* Filter Bar */}
            <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10 flex flex-col md:flex-row gap-4 shadow-lg">
              
              {/* Course Selector */}
              <div className="relative w-full md:w-1/2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                <select 
                    className="w-full bg-black/50 border border-gray-700 text-white pl-10 pr-4 py-3 rounded-lg appearance-none focus:ring-2 focus:ring-cyan-600 outline-none cursor-pointer"
                    onChange={onCourseSelect}
                    value={selectedCourse ? selectedCourse._id : ""}
                >
                  <option value="" disabled>Select Your Course...</option>
                  {courses.length > 0 ? (
                      courses.map(c => (
                        <option key={c._id} value={c._id}>{c.name || c.title}</option>
                      ))
                  ) : (
                      <option disabled>No courses found</option>
                  )}
                </select>
              </div>

              {/* Level Selector */}
              <div className="relative w-full md:w-1/2">
                <Layers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                <select 
                    className="w-full bg-black/50 border border-gray-700 text-white pl-10 pr-4 py-3 rounded-lg appearance-none focus:ring-2 focus:ring-cyan-600 outline-none cursor-pointer"
                    onChange={(e) => setSelectedViewLevel(e.target.value)}
                    value={selectedViewLevel}
                >
                  {LEVELS.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                </select>
              </div>
            </div>

            {/* Content List */}
            <div className="space-y-4">
              {!selectedCourse ? (
                <div className="p-16 text-center text-gray-500 bg-white/5 rounded-2xl border border-dashed border-gray-700 flex flex-col items-center">
                    <BookOpen className="w-12 h-12 mb-4 opacity-20" />
                    <p>Select a course to view your syllabus.</p>
                </div>
              ) : loadingSyllabus ? (
                 <div className="flex items-center justify-center p-16 text-gray-400">
                    <Loader2 className="w-8 h-8 animate-spin mr-3 text-cyan-500" /> Loading...
                 </div>
              ) : syllabus.length === 0 ? (
                <div className="p-16 text-center text-gray-500 bg-white/5 rounded-2xl">
                  No material available for <strong>{selectedViewLevel}</strong> yet.
                </div>
              ) : (
                syllabus.map((tech) => {
                  // Calculate Progress
                  const completedCount = tech.chapters.filter(c => c.status === 'completed').length;
                  const totalCount = tech.chapters.length;
                  const isExpanded = expandedTechId === tech._id;
                  const isFullyComplete = totalCount > 0 && completedCount === totalCount;

                  return (
                    <motion.div 
                        key={tech._id} 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }}
                        className={`border transition-all duration-300 rounded-xl overflow-hidden ${isFullyComplete ? 'border-green-500/20 bg-green-900/5' : 'border-white/5 bg-[#161616]'}`}
                    >
                      
                      {/* Technique Header (Accordion Trigger) */}
                      <button 
                        onClick={() => toggleAccordion(tech._id)}
                        className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors text-left"
                      >
                        <div className="flex items-center gap-4">
                            {/* Expand Icon */}
                            <div className={`p-1 rounded-full transition-transform duration-300 ${isExpanded ? 'bg-cyan-500/20 rotate-180' : 'bg-white/5'}`}>
                                <ChevronDown className={`w-4 h-4 ${isExpanded ? 'text-cyan-400' : 'text-gray-500'}`} />
                            </div>

                            <div>
                                <h3 className={`text-lg font-bold flex items-center gap-2 ${isFullyComplete ? 'text-green-400' : 'text-gray-100'}`}>
                                    {tech.name}
                                    {isFullyComplete && <CheckCircle className="w-4 h-4 fill-green-500/20" />}
                                </h3>
                                <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                                    {tech.description || "No description provided."}
                                </p>
                            </div>
                        </div>

                        {/* Progress Bar & Stats */}
                        <div className="flex flex-col items-end gap-2 w-32 md:w-48">
                            <span className="text-xs font-mono text-gray-400">
                                {completedCount} / {totalCount} Done
                            </span>
                            <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full transition-all duration-500 ${isFullyComplete ? 'bg-green-500' : 'bg-cyan-500'}`}
                                    style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
                                />
                            </div>
                        </div>
                      </button>

                      {/* Chapters List (Expanded) */}
                      {isExpanded && (
                        <div className="border-t border-white/5 bg-[#0a0a0a]">
                            {tech.chapters.length === 0 ? (
                                <div className="p-6 text-center text-xs text-gray-600 italic">
                                    No chapters added yet.
                                </div>
                            ) : (
                                tech.chapters.map((ch, idx) => (
                                    <div key={ch._id} className="flex items-center justify-between p-4 pl-14 hover:bg-white/5 border-b border-white/5 last:border-0 transition-colors group">
                                        
                                        <div className="flex items-center gap-4">
                                            {/* Status Icon (Static) */}
                                            <div className="shrink-0">
                                                {ch.status === 'completed' 
                                                    ? <CheckCircle className="w-5 h-5 text-green-500" />
                                                    : <Circle className="w-5 h-5 text-gray-600" />
                                                }
                                            </div>

                                            <div className="flex flex-col">
                                                <span className={`text-sm font-medium ${ch.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-200'}`}>
                                                    {ch.name}
                                                </span>
                                                {/* PGN Preview */}
                                                <span className="text-[10px] text-gray-600 font-mono line-clamp-1 max-w-[200px] md:max-w-md">
                                                    {ch.pgn}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Copy PGN Button */}
                                        <button 
                                            onClick={() => {
                                                navigator.clipboard.writeText(ch.pgn);
                                                toast.success("PGN copied to clipboard");
                                            }}
                                            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-cyan-500/20 text-gray-400 hover:text-cyan-400 text-xs font-semibold rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <Copy className="w-3 h-3" /> <span className="hidden md:inline">Copy PGN</span>
                                        </button>

                                    </div>
                                ))
                            )}
                        </div>
                      )}

                    </motion.div>
                  );
                })
              )}
            </div>

        </div>
      </motion.div>
    </div>
  );
};

export default StudentDatabase;