import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../../contexts/AuthContext.jsx";
import apiClient from "../../../lib/api.js";
import { ENDPOINTS } from "../../../lib/endpoints.js";
import { toast } from "sonner";
import { 
  Trash2, Plus, CheckCircle, 
  XCircle, Loader2, User, Filter,
  Search, GitBranch, ArrowLeft, Lightbulb,
  Clock, Trophy, TimerOff, RefreshCw
} from "lucide-react";
import { Button } from "../../../components/ui/button.tsx";

import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

const LEVELS = [
  'Beginner 1', 'Beginner 2', 'Beginner 3', 
  'Intermediate 1', 'Intermediate 2', 'Intermediate 3', 
  'Advanced 1', 'Advanced 2', 'Advanced 3', 'Master'
];

// Helper to format seconds into MM:SS
const formatTime = (totalSeconds) => {
    if (totalSeconds == null) return "--:--";
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
};

const CoachTest = () => {
  const { user } = useAuth();
  
  // --- Data State ---
  const [courses, setCourses] = useState([]);
  const [testsByCourse, setTestsByCourse] = useState({});
  const [loading, setLoading] = useState(true);

  // --- Creation Form State ---
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formTimeLimitMins, setFormTimeLimitMins] = useState(30);
  const [formTimeLimitSecs, setFormTimeLimitSecs] = useState(0); 
  const [formRewardPoints, setFormRewardPoints] = useState(100); 
  
  // Syllabus & Task Selection State
  const [syllabus, setSyllabus] = useState([]); 
  const [loadingSyllabus, setLoadingSyllabus] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]); 
  
  const [filterLevel, setFilterLevel] = useState("Beginner 1");

  // --- Review/Analytics Modal State ---
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [currentTest, setCurrentTest] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [loadingAttempts, setLoadingAttempts] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false); // NEW: Track silent refresh state

  // --- Detailed Review State ---
  const [detailedAttempt, setDetailedAttempt] = useState(null); 
  const [activeTaskReview, setActiveTaskReview] = useState(null); 
  const [reviewGame, setReviewGame] = useState(new Chess());

  // ==================== 1. INITIAL DATA FETCHING ====================
  
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const coursesRes = await apiClient.get(ENDPOINTS.COURSES.GET_MY_COURSES_AS_COACH);
      const myCourses = coursesRes.data.data || [];
      setCourses(myCourses);

      const testMap = {};
      if (myCourses.length > 0) {
        await Promise.all(myCourses.map(async (course) => {
          try {
            const res = await apiClient.get(ENDPOINTS.TESTS.GET_BY_COURSE(course._id));
            testMap[course._id] = res.data.data || [];
          } catch (e) {
            console.error(`Failed to load tests for ${course.title}`, e);
            testMap[course._id] = [];
          }
        }));
      }
      setTestsByCourse(testMap);

    } catch (err) {
      console.error("Error loading dashboard:", err);
      toast.error("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchDashboardData();
  }, [user]);

  // ==================== 2. SYLLABUS & TASK SELECTION ====================

  useEffect(() => {
    if (!selectedCourseId) {
      setSyllabus([]);
      setSelectedTasks([]); 
      return;
    }

    const fetchSyllabus = async () => {
      try {
        setLoadingSyllabus(true);
        const baseUrl = ENDPOINTS.SYLLABUS.GET_BY_COURSE(selectedCourseId);
        const res = await apiClient.get(`${baseUrl}?level=${encodeURIComponent(filterLevel)}`);
        
        const data = res.data.data; 
        const syllabusList = Array.isArray(data) ? data : (data.techniques || []);
        setSyllabus(syllabusList);
        
      } catch (error) {
        toast.error("Could not load course syllabus.");
        setSyllabus([]);
      } finally {
        setLoadingSyllabus(false);
      }
    };

    fetchSyllabus();
  }, [selectedCourseId, filterLevel]); 

  const toggleTaskSelection = (chapter) => {
    setSelectedTasks(prev => {
      const exists = prev.find(t => t.chapterId === chapter._id);
      if (exists) {
        return prev.filter(t => t.chapterId !== chapter._id);
      } else {
        return [...prev, { 
          chapterId: chapter._id, 
          title: chapter.name, 
          pgn: chapter.pgn, 
          fen: chapter.fen 
        }];
      }
    });
  };

  // ==================== 3. ACTIONS (CREATE, DELETE, REVIEW) ====================

  const handleCreateTest = async (e) => {
    e.preventDefault();
    if (!selectedCourseId || !formTitle.trim()) {
      toast.error("Title and Course are required.");
      return;
    }
    if (selectedTasks.length === 0) {
      toast.error("Please select at least one task/puzzle for the test.");
      return;
    }
    
    const totalSeconds = (parseInt(formTimeLimitMins || 0) * 60) + parseInt(formTimeLimitSecs || 0);
    
    if (totalSeconds < 10) {
      toast.error("Time limit must be at least 10 seconds.");
      return;
    }

    try {
      await apiClient.post(ENDPOINTS.TESTS.CREATE(selectedCourseId), {
        title: formTitle,
        description: formDesc,
        tasks: selectedTasks,
        timeLimit: totalSeconds,
        rewardPoints: parseInt(formRewardPoints || 0)
      });
      
      toast.success("Test created!");
      
      setFormTitle("");
      setFormDesc("");
      setFormTimeLimitMins(30);
      setFormTimeLimitSecs(0);
      setFormRewardPoints(100);
      setSelectedTasks([]);
      setSelectedCourseId(""); 
      fetchDashboardData(); 

    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create test.");
    }
  };

  const handleDeleteTest = async (id) => {
    if(!window.confirm("Delete this test? Student attempts and scores will be lost.")) return;
    try {
      await apiClient.delete(ENDPOINTS.TESTS.DELETE(id));
      toast.success("Deleted.");
      fetchDashboardData();
    } catch (err) {
      toast.error("Failed to delete.");
    }
  };

  // --- REAL-TIME REVIEW/ANALYTICS LOGIC ---

  // Extracted fetch function to support both initial load and background polling
  const fetchAttempts = async (testId, isSilent = false) => {
    if (!isSilent) setLoadingAttempts(true);
    else setIsRefreshing(true);

    try {
      const res = await apiClient.get(ENDPOINTS.TEST_SUBMISSIONS.GET_ALL_FOR_TEST(testId));
      setAttempts(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch attempts:", error);
      if (!isSilent) toast.error("Could not load test attempts.");
    } finally {
      setLoadingAttempts(false);
      setIsRefreshing(false);
    }
  };

  const openReviewModal = (test) => {
    setCurrentTest(test);
    setDetailedAttempt(null);
    setActiveTaskReview(null);
    setReviewModalOpen(true);
    fetchAttempts(test._id, false); // Trigger initial load
  };

  // NEW: Background Polling Hook
  useEffect(() => {
    let intervalId;
    if (reviewModalOpen && currentTest && !detailedAttempt) {
      // Poll every 10 seconds while the analytics view is open
      intervalId = setInterval(() => {
        fetchAttempts(currentTest._id, true);
      }, 10000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [reviewModalOpen, currentTest, detailedAttempt]);


  // --- Detailed Task Helper ---
  const getTaskAttemptData = (task) => {
    if (!detailedAttempt) return null;
    const matchId1 = task._id;
    const matchId2 = task.chapterId;
    
    if (detailedAttempt.solvedTasks) {
        return detailedAttempt.solvedTasks.find(t => 
            t.taskId === matchId1 || t.taskId === matchId2
        );
    }
    return null;
  };

  const loadTaskBoard = (taskData, testTaskData) => {
      setActiveTaskReview(taskData);
      try {
          const game = new Chess();
          if (taskData.overridePgn) {
              game.loadPgn(taskData.overridePgn);
          } else if (testTaskData.fen && testTaskData.fen !== 'start') {
              game.load(testTaskData.fen);
          }
          setReviewGame(game);
      } catch (e) {
          toast.error("Could not parse student's board data.");
      }
  };

  // ==================== RENDER ====================

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1429] via-[#0a1020] to-black p-6 text-white font-sans">
      <div className="max-w-6xl mx-auto">
        
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <span className="text-4xl">⏱️</span> Coach Tests & Exams
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: CREATE FORM */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-xl sticky top-6"
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-violet-500"/> New Test
              </h2>

              <form onSubmit={handleCreateTest} className="space-y-4">
                {/* 1. Select Course */}
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Course</label>
                  <select 
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm focus:border-violet-500 outline-none"
                  >
                    <option value="">Select a Course...</option>
                    {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                  </select>
                </div>

                {/* 2. Basic Info */}
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Title</label>
                  <input 
                    type="text" 
                    value={formTitle}
                    onChange={e => setFormTitle(e.target.value)}
                    placeholder="e.g. Midterm: Endgame Conversions"
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm focus:border-violet-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Instructions</label>
                  <textarea 
                    value={formDesc}
                    onChange={e => setFormDesc(e.target.value)}
                    placeholder="Brief instructions for the student..."
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm focus:border-violet-500 outline-none h-20 resize-none"
                  />
                </div>

                {/* Timer & Points Configuration */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-blue-400"/> Limit (M:S)
                    </label>
                    <div className="flex gap-2">
                      <input 
                        type="number" 
                        min="0"
                        placeholder="Min"
                        value={formTimeLimitMins}
                        onChange={e => setFormTimeLimitMins(e.target.value)}
                        className="w-1/2 bg-black/40 border border-white/10 rounded-lg p-3 text-sm focus:border-blue-500 outline-none text-blue-100 font-mono text-center text-xs"
                      />
                      <span className="flex items-center text-gray-500 font-bold">:</span>
                      <input 
                        type="number" 
                        min="0"
                        max="59"
                        placeholder="Sec"
                        value={formTimeLimitSecs}
                        onChange={e => setFormTimeLimitSecs(e.target.value)}
                        className="w-1/2 bg-black/40 border border-white/10 rounded-lg p-3 text-sm focus:border-blue-500 outline-none text-blue-100 font-mono text-center text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1">
                      <Trophy className="w-3 h-3 text-yellow-400"/> Reward Pts
                    </label>
                    <input 
                      type="number" 
                      min="0"
                      value={formRewardPoints}
                      onChange={e => setFormRewardPoints(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm focus:border-yellow-500 outline-none text-yellow-100 font-mono h-full"
                    />
                  </div>
                </div>

                {/* 3. Task Selection (Syllabus Tree) */}
                <div className="border-t border-white/10 pt-4">
                  <div className="flex flex-col gap-2 mb-2">
                    <label className="text-xs font-bold text-violet-400 uppercase flex justify-between items-center">
                      <span>Select Test Questions</span>
                      <span className="text-white bg-violet-600 px-2 py-0.5 rounded-full text-[10px]">{selectedTasks.length} Selected</span>
                    </label>

                    {/* Filter Dropdown */}
                    <div className="flex items-center gap-2 bg-black/40 p-2 rounded-lg border border-white/10">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <select 
                          value={filterLevel}
                          onChange={(e) => setFilterLevel(e.target.value)}
                          className="bg-transparent text-sm outline-none w-full text-white cursor-pointer"
                        >
                          {LEVELS.map(lvl => (
                            <option key={lvl} value={lvl} className="bg-gray-900">{lvl}</option>
                          ))}
                        </select>
                    </div>
                  </div>
                  
                  {/* EXPANDED LIST CONTAINER */}
                  <div className="h-[450px] overflow-y-auto bg-black/30 rounded-lg border border-white/5 p-2 custom-scrollbar relative">
                    {!selectedCourseId ? (
                      <p className="text-xs text-gray-400 text-center py-10">Select a course to view syllabus.</p>
                    ) : loadingSyllabus ? (
                      <div className="flex justify-center py-10"><Loader2 className="animate-spin text-violet-500"/></div>
                    ) : syllabus.length === 0 ? (
                      <div className="text-center py-10">
                        <p className="text-xs text-red-400">
                           No techniques found in {filterLevel}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {syllabus.map((item) => (
                          <div key={item._id} className="mb-2">
                            <h4 className="text-xs font-bold text-gray-300 bg-[#1a2333] px-3 py-2 rounded-t border border-white/10 border-b-0 sticky top-0 z-10 flex justify-between items-center shadow-md">
                                {item.name || item.level} 
                            </h4>
                            <div className="border border-white/10 rounded-b bg-black/20 p-2 space-y-1">
                                {item.techniques?.map((tech) => (
                                    <div key={tech._id} className="mb-2">
                                        <div className="text-[11px] font-bold text-violet-400 px-2 py-1 uppercase">{tech.name}</div>
                                        {tech.chapters?.map(ch => {
                                            const isSelected = selectedTasks.some(t => t.chapterId === ch._id);
                                            return (
                                                <div 
                                                  key={ch._id}
                                                  onClick={() => toggleTaskSelection(ch)}
                                                  className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-all ml-2 ${isSelected ? 'bg-violet-600/20 border border-violet-500/50' : 'hover:bg-white/5 border border-transparent'}`}
                                                >
                                                  <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${isSelected ? 'bg-violet-500 border-violet-500' : 'border-gray-600'}`}>
                                                    {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
                                                  </div>
                                                  <span className={`text-sm ${isSelected ? 'text-white font-medium' : 'text-gray-400'}`}>
                                                    {ch.name}
                                                  </span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                ))}

                                {item.chapters?.map((ch) => {
                                  const isSelected = selectedTasks.some(t => t.chapterId === ch._id);
                                  return (
                                    <div 
                                      key={ch._id}
                                      onClick={() => toggleTaskSelection(ch)}
                                      className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-all ${isSelected ? 'bg-violet-600/20 border border-violet-500/50' : 'hover:bg-white/5 border border-transparent'}`}
                                    >
                                      <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${isSelected ? 'bg-violet-500 border-violet-500' : 'border-gray-600'}`}>
                                        {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
                                      </div>
                                      <span className={`text-sm ${isSelected ? 'text-white font-medium' : 'text-gray-400'}`}>
                                        {ch.name}
                                      </span>
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-6">
                  Publish Test
                </Button>
              </form>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: TEST LIST */}
          <div className="lg:col-span-2 space-y-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-violet-500 animate-spin mb-2"/>
                <p className="text-gray-500 text-sm">Loading dashboard...</p>
              </div>
            ) : Object.keys(testsByCourse).length === 0 ? (
              <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/5 border-dashed">
                <p className="text-gray-500">No tests active.</p>
              </div>
            ) : (
              courses.map(course => {
                const tests = testsByCourse[course._id];
                if (!tests || tests.length === 0) return null;

                return (
                  <motion.div 
                    key={course._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-lg"
                  >
                    <div className="bg-black/20 p-4 border-b border-white/5 flex justify-between items-center">
                      <h3 className="font-bold text-lg text-gray-200">{course.title}</h3>
                      <span className="text-xs font-mono text-gray-400 bg-black/40 px-2 py-1 rounded">
                        {tests.length} Tests
                      </span>
                    </div>

                    <div className="divide-y divide-white/5">
                      {tests.map(test => (
                        <div key={test._id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors">
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-bold text-white text-base">{test.title}</h4>
                              <span className="text-[10px] bg-violet-500/10 text-violet-400 border border-violet-500/20 px-2 py-0.5 rounded-full font-bold uppercase">
                                {test.tasks.length} Questions
                              </span>
                            </div>
                            {test.description && (
                              <p className="text-sm text-gray-400 line-clamp-1 mb-2">{test.description}</p>
                            )}
                            
                            <div className="flex items-center gap-4 text-xs font-mono text-gray-400">
                              <span className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-blue-400"/>
                                {formatTime(test.timeLimit)}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Trophy className="w-3.5 h-3.5 text-yellow-500"/>
                                {test.rewardPoints} Pts
                              </span>
                              <span>Created: {new Date(test.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <Button 
                              variant="outline" 
                              className="border-violet-500/50 text-violet-300 hover:bg-violet-500/10 hover:text-violet-200"
                              onClick={() => openReviewModal(test)}
                            >
                              View Attempts
                            </Button>
                            
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-gray-500 hover:text-red-400 hover:bg-red-500/10"
                              onClick={() => handleDeleteTest(test._id)}
                            >
                              <Trash2 className="w-4 h-4"/>
                            </Button>
                          </div>

                        </div>
                      ))}
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

        </div>
      </div>

      {/* ================= REVIEW/ANALYTICS MODAL ================= */}
      <AnimatePresence>
        {reviewModalOpen && currentTest && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-[#121212] border border-white/10 w-full max-w-5xl h-[85vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#181818]">
                <div className="flex items-center gap-4">
                  {detailedAttempt && (
                    <button 
                      onClick={() => { setDetailedAttempt(null); setActiveTaskReview(null); }} 
                      className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white flex items-center gap-2 text-sm font-bold uppercase tracking-wider"
                    >
                      <ArrowLeft className="w-4 h-4"/> Back to Analytics
                    </button>
                  )}
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      {detailedAttempt ? `Analyzing: ${detailedAttempt.student?.fullname}` : "Test Results:"} 
                      {!detailedAttempt && <span className="text-violet-400">{currentTest.title}</span>}
                    </h2>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-3">
                        <span>Total Questions: {currentTest.tasks.length}</span>
                        <span>Max Score: {currentTest.rewardPoints} Pts</span>
                    </p>
                  </div>
                </div>
                
                {/* Header Actions (Refresh & Close) */}
                <div className="flex items-center gap-2">
                  {!detailedAttempt && (
                    <button 
                      onClick={() => fetchAttempts(currentTest._id, true)} 
                      className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"
                      title="Refresh Results"
                    >
                      <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin text-violet-400' : ''}`} />
                    </button>
                  )}
                  <button onClick={() => setReviewModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white">
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto bg-[#0a0a0a]">
                {loadingAttempts ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <Loader2 className="w-8 h-8 animate-spin mb-2"/>
                    Analyzing attempts...
                  </div>
                ) : attempts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full border border-dashed border-white/10 rounded-xl m-6">
                    <p className="text-gray-500">No students have taken this test yet.</p>
                  </div>
                ) : detailedAttempt ? (
                  /* --- DETAILED INSPECTOR VIEW --- */
                  <div className="flex flex-col md:flex-row h-full">
                      {/* Left Side: Task List */}
                      <div className="w-full md:w-1/2 p-6 overflow-y-auto border-r border-white/10 flex flex-col">
                          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Question Breakdown</h3>
                          
                          <div className="space-y-3 mb-6 flex-1">
                              {currentTest.tasks.map((task, idx) => {
                                  const subData = getTaskAttemptData(task);
                                  const isCompleted = !!subData;
                                  const isCorrect = isCompleted && subData.isCorrect === true;
                                  const isOffScript = isCompleted && subData.isCorrect === false;
                                  const isActive = activeTaskReview && activeTaskReview.taskId === task._id;

                                  return (
                                      <div key={task._id} className={`p-4 rounded-xl border transition-all ${isActive ? 'bg-blue-900/20 border-blue-500/50' : 'bg-[#161616] border-white/5 hover:border-white/10'}`}>
                                          <div className="flex justify-between items-start mb-2">
                                              <span className="font-bold text-gray-200 text-sm">{idx + 1}. {task.title}</span>
                                              {isCompleted ? (
                                                  isOffScript ? (
                                                      <span className="text-[10px] font-bold bg-red-500/20 text-red-400 px-2 py-0.5 rounded uppercase flex items-center gap-1">
                                                          <XCircle className="w-3 h-3"/> Incorrect
                                                      </span>
                                                  ) : (
                                                      <span className="text-[10px] font-bold bg-green-500/20 text-green-400 px-2 py-0.5 rounded uppercase flex items-center gap-1">
                                                          <CheckCircle className="w-3 h-3"/> Correct
                                                      </span>
                                                  )
                                              ) : (
                                                  <span className="text-[10px] font-bold bg-gray-800 text-gray-500 px-2 py-0.5 rounded uppercase">Unsolved / Skipped</span>
                                              )}
                                          </div>
                                          
                                          {isOffScript && (
                                              <Button 
                                                  size="sm" 
                                                  onClick={() => loadTaskBoard(subData, task)}
                                                  className="w-full mt-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/30 font-bold"
                                              >
                                                  <Search className="w-4 h-4 mr-2"/> Inspect Mistake
                                              </Button>
                                          )}
                                      </div>
                                  );
                              })}
                          </div>
                      </div>

                      {/* Right Side: Chessboard */}
                      <div className="w-full md:w-1/2 p-6 flex flex-col items-center justify-center bg-black/50">
                          {activeTaskReview ? (
                              <div className="w-full max-w-[400px]">
                                  <div className="mb-4 text-center">
                                      <h3 className="font-bold text-red-400 flex items-center justify-center gap-2 mb-1">
                                          <GitBranch className="w-4 h-4"/> Student's Incorrect Line
                                      </h3>
                                      <p className="text-xs text-gray-500">Board reflects where they went wrong.</p>
                                  </div>
                                  <div className="rounded-md overflow-hidden shadow-2xl border-2 border-red-500/50 p-1 bg-red-900/20">
                                      <Chessboard 
                                          position={reviewGame.fen()} 
                                          arePiecesDraggable={false}
                                          customDarkSquareStyle={{ backgroundColor: '#47638A' }} 
                                          customLightSquareStyle={{ backgroundColor: '#E4EBF2' }}
                                      />
                                  </div>
                              </div>
                          ) : (
                              <div className="flex flex-col items-center justify-center text-gray-500">
                                  <Lightbulb className="w-12 h-12 mb-3 opacity-20"/>
                                  <p className="text-sm">Select an "Incorrect" task on the left to inspect the board.</p>
                              </div>
                          )}
                      </div>
                  </div>
                ) : (
                  /* --- OVERVIEW GRID (Analytics) --- */
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
                    {attempts.map(attempt => {
                      const progressStr = attempt.progress || "0 / 0"; 
                      const [solved, total] = progressStr.split(' / ').map(Number);
                      
                      const correctCount = attempt.solvedTasks?.filter(t => t.isCorrect).length || 0;
                      const calculatedPoints = total > 0 ? Math.round((correctCount / total) * currentTest.rewardPoints) : 0;
                      
                      const percent = total > 0 ? (correctCount / total) * 100 : 0;
                      
                      return (
                        <div key={attempt._id} className="bg-[#161616] border border-white/5 rounded-xl p-5 flex flex-col gap-4">
                          
                          {/* Student Info & Score */}
                          <div className="flex justify-between items-start border-b border-white/5 pb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-violet-600/20 text-violet-400 flex items-center justify-center">
                                <User className="w-5 h-5"/>
                              </div>
                              <div>
                                <h4 className="font-bold text-white">{attempt.student?.fullname || "Unknown"}</h4>
                                <p className="text-xs text-gray-500 flex gap-2">
                                    <span>@{attempt.student?.username}</span>
                                    {attempt.student?.totalPoints !== undefined && (
                                        <span className="text-yellow-500">({attempt.student.totalPoints} Global Pts)</span>
                                    )}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-black text-yellow-400 leading-none">
                                {calculatedPoints} <span className="text-sm font-normal text-gray-500">/ {currentTest.rewardPoints}</span>
                              </div>
                            </div>
                          </div>

                          {/* Stats Grid */}
                          <div className="grid grid-cols-2 gap-2 mt-2">
                              {/* Accuracy */}
                              <div className="bg-black/30 p-3 rounded-lg border border-white/5">
                                  <div className="text-[10px] uppercase text-gray-500 font-bold mb-1">Accuracy</div>
                                  <div className="text-sm font-bold text-gray-200">{correctCount} of {total} Correct</div>
                                  <div className="w-full h-1 bg-gray-800 rounded-full mt-2">
                                    <div className={`h-full rounded-full ${percent >= 80 ? 'bg-green-500' : percent >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${percent}%` }}></div>
                                  </div>
                              </div>

                              {/* Timing & Status */}
                              <div className="bg-black/30 p-3 rounded-lg border border-white/5 flex flex-col justify-center">
                                  <div className="text-[10px] uppercase text-gray-500 font-bold mb-1">Status</div>
                                  {attempt.status === 'in_progress' ? (
                                      <div className="text-sm font-bold text-blue-400 flex items-center gap-1.5"><Clock className="w-4 h-4"/> Testing...</div>
                                  ) : attempt.status === 'timeout' ? (
                                      <div className="text-sm font-bold text-orange-400 flex items-center gap-1.5"><TimerOff className="w-4 h-4"/> Time Expired</div>
                                  ) : (
                                      <div className="text-sm font-bold text-green-400 flex items-center gap-1.5"><CheckCircle className="w-4 h-4"/> Completed</div>
                                  )}
                                  
                                  {attempt.timeTakenSeconds && (
                                      <div className="text-xs text-gray-400 mt-1 font-mono">
                                          Time taken: {formatTime(attempt.timeTakenSeconds)}
                                      </div>
                                  )}
                              </div>
                          </div>

                          {/* Action Button */}
                          <div className="mt-auto pt-2">
                            <Button 
                                variant="outline" 
                                className="w-full border-white/10 text-gray-300 hover:bg-white/5 transition-colors"
                                onClick={() => setDetailedAttempt(attempt)}
                                disabled={attempt.status === 'in_progress'}
                            >
                                <Search className="w-4 h-4 mr-2"/> {attempt.status === 'in_progress' ? 'Cannot inspect while testing' : 'Inspect Mistakes'}
                            </Button>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default CoachTest;