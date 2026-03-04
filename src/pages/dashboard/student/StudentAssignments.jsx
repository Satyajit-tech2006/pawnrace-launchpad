import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext.jsx";
import apiClient from "../../../lib/api.js";
import { ENDPOINTS } from "../../../lib/endpoints.js";
import { toast } from "sonner";
import { 
  CheckCircle2, Play, Clock, AlertCircle, 
  Trophy, ChevronRight, Loader2, BookOpen
} from "lucide-react";
import { Button } from "../../../components/ui/button.tsx";

const StudentAssignment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [pendingAssignments, setPendingAssignments] = useState([]);
  const [completedAssignments, setCompletedAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Fetch enrolled courses
      const coursesRes = await apiClient.get(ENDPOINTS.COURSES.GET_MY_COURSES_AS_STUDENT);
      const enrolledCourses = coursesRes.data.data || [];

      if (enrolledCourses.length > 0) {
        // 2. Fetch assignments
        const assignmentPromises = enrolledCourses.map(course =>
          apiClient.get(ENDPOINTS.ASSIGNMENTS.GET_BY_COURSE(course._id))
        );
        const assignmentResults = await Promise.all(assignmentPromises);

        // 3. Flatten list
        const allAssignments = assignmentResults.flatMap(res => res.data.data || []);
        
        // 4. Sort into Pending vs Completed
        const pending = [];
        const completed = [];

        allAssignments.forEach(assign => {
          // Safe fallback for newly enrolled students with no submission record yet
          const sub = assign?.mySubmission;
          if (!sub || ['pending', 'in_progress', 'submitted', 'fail'].includes(sub.status)) {
            pending.push(assign);
          } else if (sub.status === 'pass') {
            completed.push(assign);
          }
        });

        setPendingAssignments(pending);
        setCompletedAssignments(completed);
      }
    } catch (err) {
      console.error("Error fetching assignments:", err);
      setError("Could not load your assignments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const getProgress = (assign) => {
    const total = assign?.tasks?.length || 0;
    const solved = assign?.mySubmission?.solvedTaskIds?.length || 0;
    const percent = total > 0 ? (solved / total) * 100 : 0;
    return { solved, total, percent };
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'submitted': return <span className="text-[10px] font-bold bg-blue-500/20 text-blue-400 px-2 py-1 rounded-md flex items-center gap-1 uppercase tracking-wider"><Clock className="w-3 h-3"/> Pending Review</span>;
      case 'fail': return <span className="text-[10px] font-bold bg-red-500/20 text-red-400 px-2 py-1 rounded-md flex items-center gap-1 uppercase tracking-wider"><AlertCircle className="w-3 h-3"/> Needs Revision</span>;
      case 'pass': return <span className="text-[10px] font-bold bg-green-500/20 text-green-400 px-2 py-1 rounded-md flex items-center gap-1 uppercase tracking-wider"><Trophy className="w-3 h-3"/> Passed</span>;
      default: return <span className="text-[10px] font-bold bg-white/10 text-gray-300 px-2 py-1 rounded-md uppercase tracking-wider">In Progress</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] p-4 md:p-8 text-white font-sans selection:bg-blue-500/30">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
              Training Grounds
            </h1>
            <p className="text-gray-400 mt-2 text-sm md:text-base">Master the lines assigned by your coach.</p>
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
             <Loader2 className="w-10 h-10 text-blue-500 animate-spin"/>
             <p className="text-gray-400 font-medium tracking-wide animate-pulse">Loading assignments...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-40 bg-red-500/10 border border-red-500/20 rounded-2xl">
            <AlertCircle className="w-8 h-8 text-red-400 mb-2"/>
            <p className="text-red-400 font-medium">{error}</p>
          </div>
        ) : (
          <div className="space-y-12">
            
            {/* === ACTIVE ASSIGNMENTS === */}
            <section>
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-white">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                Active Training
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {pendingAssignments.length > 0 ? (
                  pendingAssignments.map((assign) => {
                    const { solved, total, percent } = getProgress(assign);
                    const sub = assign?.mySubmission;

                    return (
                      <motion.div 
                        key={assign._id} 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="group bg-[#131825] border border-white/5 hover:border-blue-500/30 p-5 rounded-2xl transition-all duration-300 flex flex-col justify-between hover:shadow-2xl hover:shadow-blue-900/10 relative overflow-hidden"
                      >
                        {/* Background subtle glow */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors"></div>

                        <div>
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-lg font-bold text-gray-100 group-hover:text-blue-400 transition-colors line-clamp-1">{assign.title}</h3>
                            {getStatusBadge(sub?.status)}
                          </div>
                          <p className="text-xs text-gray-500 flex items-center gap-1.5 mb-6">
                            <BookOpen className="w-3.5 h-3.5"/> {assign.course?.title}
                          </p>
                          
                          {/* Coach Feedback Box */}
                          {sub?.status === 'fail' && sub?.feedback && (
                            <div className="mb-6 bg-red-950/30 border border-red-900/50 p-3 rounded-lg">
                              <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider mb-1 block flex items-center gap-1">
                                Coach Notes
                              </span>
                              <p className="text-sm text-red-200/80 leading-relaxed">"{sub.feedback}"</p>
                            </div>
                          )}
                        </div>

                        {/* Bottom Section: Progress & Action */}
                        <div className="flex items-end justify-between gap-4 mt-auto pt-4 border-t border-white/5">
                          <div className="flex-1 max-w-[200px]">
                            <div className="flex justify-between text-[11px] font-medium text-gray-400 mb-1.5 uppercase tracking-wide">
                              <span>Progress</span>
                              <span>{solved} / {total}</span>
                            </div>
                            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-500 ${sub?.status === 'fail' ? 'bg-red-500' : 'bg-blue-500'}`} 
                                style={{ width: `${percent}%` }}
                              ></div>
                            </div>
                          </div>

                          <Button 
                            onClick={() => navigate(`/student-dashboard/assignment/${assign._id}`)}
                            className="bg-white text-black hover:bg-gray-200 font-bold px-6 py-2 h-auto rounded-lg shadow-lg hover:shadow-xl transition-all"
                          >
                            <Play className="w-4 h-4 mr-2 fill-black"/> 
                            {solved > 0 ? "Resume" : "Start"}
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-16 bg-[#131825]/50 border border-dashed border-white/10 rounded-2xl">
                    <Trophy className="w-12 h-12 text-gray-600 mb-3"/>
                    <p className="text-gray-400 font-medium text-center">You are all caught up on your assignments.</p>
                  </div>
                )}
              </div>
            </section>

            {/* === COMPLETED HISTORY === */}
            {completedAssignments.length > 0 && (
              <section>
                <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-400">
                  <CheckCircle2 className="w-5 h-5"/> Training History
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {completedAssignments.map((assign) => (
                    <motion.div 
                      key={assign._id}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      onClick={() => navigate(`/student-dashboard/assignment/${assign._id}`)}
                      className="group bg-[#131825] border border-white/5 hover:border-green-500/30 p-4 rounded-xl flex items-center justify-between cursor-pointer transition-all hover:bg-[#161d2d]"
                    >
                      <div className="flex-1 pr-4">
                        <h3 className="font-semibold text-gray-300 group-hover:text-white transition-colors">{assign.title}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{assign.course?.title}</p>
                        {assign?.mySubmission?.feedback && (
                          <p className="text-xs text-green-400/80 italic mt-2 border-l-2 border-green-500/30 pl-2">
                            "{assign.mySubmission.feedback}"
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] bg-green-500/10 text-green-400 px-2 py-1 rounded font-bold uppercase tracking-wider">Passed</span>
                        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-green-400 transition-colors"/>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAssignment;