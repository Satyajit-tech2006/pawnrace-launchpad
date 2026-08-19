import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext.jsx";
import apiClient from "../../../lib/api.js";
import { ENDPOINTS } from "../../../lib/endpoints.js";
import { 
  CheckCircle2, Play, Clock, AlertCircle, 
  Trophy, ChevronRight, Loader2, BookOpen, Timer
} from "lucide-react";
import { Button } from "../../../components/ui/button.tsx";

const formatTime = (totalSeconds) => {
    if (!totalSeconds) return "--:--";
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
};

const StudentTest = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [pendingTests, setPendingTests] = useState([]);
  const [completedTests, setCompletedTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const coursesRes = await apiClient.get(ENDPOINTS.COURSES.GET_MY_COURSES_AS_STUDENT);
      const enrolledCourses = coursesRes.data.data || [];

      if (enrolledCourses.length > 0) {
        const testPromises = enrolledCourses.map(course =>
          apiClient.get(ENDPOINTS.TESTS.GET_BY_COURSE(course._id))
        );
        const testResults = await Promise.all(testPromises);

        const allTests = testResults.flatMap(res => res.data.data || []);
        
        const pending = [];
        const completed = [];

        allTests.forEach(test => {
          const attempt = test?.myAttempt;
          if (!attempt || attempt.status === 'in_progress') {
            pending.push(test);
          } else if (attempt.status === 'completed' || attempt.status === 'timeout') {
            completed.push(test);
          }
        });

        setPendingTests(pending);
        setCompletedTests(completed);
      }
    } catch (err) {
      console.error("Error fetching tests:", err);
      setError("Could not load your tests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed': return <span className="text-[10px] font-bold bg-green-500/20 text-green-400 px-2 py-1 rounded-md flex items-center gap-1 uppercase tracking-wider"><CheckCircle2 className="w-3 h-3"/> Graded</span>;
      case 'timeout': return <span className="text-[10px] font-bold bg-orange-500/20 text-orange-400 px-2 py-1 rounded-md flex items-center gap-1 uppercase tracking-wider"><AlertCircle className="w-3 h-3"/> Time Expired</span>;
      case 'in_progress': return <span className="text-[10px] font-bold bg-blue-500/20 text-blue-400 px-2 py-1 rounded-md flex items-center gap-1 uppercase tracking-wider"><Timer className="w-3 h-3 animate-pulse"/> In Progress</span>;
      default: return <span className="text-[10px] font-bold bg-white/10 text-gray-300 px-2 py-1 rounded-md uppercase tracking-wider">Not Started</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] p-4 md:p-8 text-white font-sans selection:bg-blue-500/30">
      <div className="max-w-5xl mx-auto space-y-10">
        
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
              Exam Center
            </h1>
            <p className="text-gray-400 mt-2 text-sm md:text-base">Timed tests to evaluate your tactical and positional vision.</p>
          </div>
          <div className="bg-black/30 border border-white/10 px-4 py-2 rounded-xl flex items-center gap-3">
             <Trophy className="w-5 h-5 text-yellow-500"/>
             <div>
                <div className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">Total Score</div>
                <div className="text-lg font-black text-white leading-none">{user?.totalPoints || 0} Pts</div>
             </div>
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
             <Loader2 className="w-10 h-10 text-blue-500 animate-spin"/>
             <p className="text-gray-400 font-medium tracking-wide animate-pulse">Loading exams...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-40 bg-red-500/10 border border-red-500/20 rounded-2xl">
            <AlertCircle className="w-8 h-8 text-red-400 mb-2"/>
            <p className="text-red-400 font-medium">{error}</p>
          </div>
        ) : (
          <div className="space-y-12">
            
            {/* === ACTIVE TESTS === */}
            <section>
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-white">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                Available Exams
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {pendingTests.length > 0 ? (
                  pendingTests.map((test) => {
                    const attempt = test?.myAttempt;
                    const isResuming = attempt?.status === 'in_progress';

                    return (
                      <motion.div 
                        key={test._id} 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="group bg-[#131825] border border-white/5 hover:border-blue-500/30 p-5 rounded-2xl transition-all duration-300 flex flex-col justify-between hover:shadow-2xl hover:shadow-blue-900/10 relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors"></div>

                        <div>
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-lg font-bold text-gray-100 group-hover:text-blue-400 transition-colors line-clamp-1">{test.title}</h3>
                            {getStatusBadge(attempt?.status)}
                          </div>
                          <p className="text-xs text-gray-500 flex items-center gap-1.5 mb-4">
                            <BookOpen className="w-3.5 h-3.5"/> {test.course?.title}
                          </p>
                          
                          <div className="flex items-center gap-4 text-xs font-mono text-gray-300 mb-6 bg-black/20 p-2 rounded-lg border border-white/5 w-fit">
                              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-blue-400"/> {formatTime(test.timeLimit)}</span>
                              <span className="flex items-center gap-1.5"><Trophy className="w-3.5 h-3.5 text-yellow-500"/> {test.rewardPoints} Pts</span>
                          </div>
                        </div>

                        <div className="flex items-end justify-between gap-4 mt-auto pt-4 border-t border-white/5">
                          <div className="flex-1 text-xs text-gray-500">
                             {test.tasks.length} tactical challenges await.
                          </div>

                          <Button 
                            onClick={() => navigate(`/student-dashboard/test/${test._id}`)}
                            className="bg-white text-black hover:bg-gray-200 font-bold px-6 py-2 h-auto rounded-lg shadow-lg hover:shadow-xl transition-all"
                          >
                            <Play className="w-4 h-4 mr-2 fill-black"/> 
                            {isResuming ? "Resume Exam" : "Start Exam"}
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-16 bg-[#131825]/50 border border-dashed border-white/10 rounded-2xl">
                    <Trophy className="w-12 h-12 text-gray-600 mb-3"/>
                    <p className="text-gray-400 font-medium text-center">No active exams at the moment.</p>
                  </div>
                )}
              </div>
            </section>

            {/* === COMPLETED HISTORY === */}
            {completedTests.length > 0 && (
              <section>
                <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-400">
                  <CheckCircle2 className="w-5 h-5"/> Exam History
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {completedTests.map((test) => {
                     // Since lazy evaluation auto-grades, the attempt score should be accurate here
                     const correctTasks = test.myAttempt?.solvedTasks?.filter(t => t.isCorrect)?.length || 0;
                     const score = test.tasks.length > 0 ? Math.round((correctTasks / test.tasks.length) * test.rewardPoints) : 0;

                     return (
                        <motion.div 
                          key={test._id}
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                          onClick={() => navigate(`/student-dashboard/test/${test._id}`)}
                          className="group bg-[#131825] border border-white/5 hover:border-green-500/30 p-4 rounded-xl flex items-center justify-between cursor-pointer transition-all hover:bg-[#161d2d]"
                        >
                          <div className="flex-1 pr-4">
                            <h3 className="font-semibold text-gray-300 group-hover:text-white transition-colors">{test.title}</h3>
                            <p className="text-xs text-gray-500 mt-0.5">{test.course?.title}</p>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="text-right mr-2">
                                <div className="text-sm font-black text-yellow-500">{score} <span className="text-[10px] font-normal text-gray-500">/ {test.rewardPoints}</span></div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-green-400 transition-colors"/>
                          </div>
                        </motion.div>
                     )
                  })}
                </div>
              </section>
            )}

          </div>
        )}
      </div>
    </div>
  );
};

export default StudentTest;