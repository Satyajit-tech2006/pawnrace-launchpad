import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext.jsx";
import apiClient from "../../../lib/api.js";
import { ENDPOINTS } from "../../../lib/endpoints.js";
import { toast } from "sonner";
import { Trash2, Video, Calendar, Clock, CheckCircle } from "lucide-react";
import { Button } from "../../../components/ui/button.tsx";

// Helper: Format Date
const formatClassTime = (isoString) => {
  if (!isoString) return { date: 'N/A', time: 'N/A' };
  const date = new Date(isoString);
  const formattedDate = date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return { date: formattedDate, time: formattedTime };
};

// Helper: Generate Unique Room ID
const generateRoomId = () => {
    return 'room-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now().toString(36);
};

const CoachClassesNew = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // --- State ---
  const [students, setStudents] = useState([]); 
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [completedClasses, setCompletedClasses] = useState([]);

  // --- UI State ---
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [loading, setLoading] = useState(false);
  
  // --- Form State ---
  const [newClass, setNewClass] = useState({ title: "", date: "", time: "" });

  // 1. Fetch Students
  useEffect(() => {
    const fetchStudents = async () => {
        try {
            const response = await apiClient.get(ENDPOINTS.COURSES.GET_MY_COURSES_AS_COACH); 
            setStudents(response.data.data || []); 
        } catch (err) {
            console.error("Error fetching students:", err);
            toast.error("Could not load student list.");
        }
    };
    if (user) fetchStudents();
  }, [user]);

  // 2. Fetch Classes
  const fetchClasses = async () => {
    if (!selectedStudentId) {
        setUpcomingClasses([]);
        setCompletedClasses([]);
        return;
    }

    try {
        setLoading(true);
        const response = await apiClient.get(ENDPOINTS.NEW_CLASSES.GET_BY_COURSE(selectedStudentId));
        const allClasses = response.data.data || [];

        setUpcomingClasses(allClasses.filter(c => c.status === 'scheduled' || c.status === 'upcoming'));
        setCompletedClasses(allClasses.filter(c => c.status === 'completed'));
    } catch (err) {
        console.error("Error fetching classes:", err);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [selectedStudentId]);

  // 3. Schedule Class
  const handleAddClass = async (e) => {
    e.preventDefault();
    if (!selectedStudentId) {
      toast.error("Please select a student/course first.");
      return;
    }

    try {
      const classTime = new Date(`${newClass.date}T${newClass.time}`).toISOString();
      const roomId = generateRoomId(); 

      await apiClient.post(ENDPOINTS.NEW_CLASSES.SCHEDULE(selectedStudentId), {
        title: newClass.title,
        classTime,
        roomId: roomId, 
        platform: 'internal', 
        status: 'scheduled'
      });

      toast.success("New Class scheduled successfully!");
      setNewClass({ title: "", date: "", time: "" });
      fetchClasses(); 
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to schedule class.");
    }
  };

  // 4. Start Class
  const handleStartClass = (roomId) => {
      navigate(`/classroom/${roomId}`);
  };

  // 5. Mark Class as Completed (NEW FUNCTION)
  const handleMarkCompleted = async (classId) => {
    if(!window.confirm("Mark this class as completed?")) return;

    try {
        // We assume a standard PATCH endpoint exists. 
        // If your ENDPOINTS file has a specific UPDATE method, use ENDPOINTS.NEW_CLASSES.UPDATE(classId)
        await apiClient.patch(ENDPOINTS.NEW_CLASSES.UPDATE(classId), { status: 'completed' });        
        toast.success("Class marked as completed.");
        fetchClasses(); // Refresh lists
    } catch (err) {
        console.error(err);
        toast.error("Failed to update status.");
    }
  };

  // 6. Delete Class
  const handleDelete = async (classId) => {
      if(window.confirm("Delete this class record?")) {
          try {
              await apiClient.delete(ENDPOINTS.NEW_CLASSES.DELETE(classId));
              toast.success("Class deleted.");
              fetchClasses();
          } catch (err) {
              toast.error("Failed to delete class.");
          }
      }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1429] via-[#0a1020] to-black p-6 text-white">
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-extrabold flex items-center gap-2">
                🚀 Coach Classroom (V2)
            </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT COLUMN: Schedule Form */}
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="lg:col-span-1">
                <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-xl sticky top-6">
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-violet-400"/> Schedule Class
                    </h2>
                    
                    <form onSubmit={handleAddClass} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400 ml-1">Assign To</label>
                            <select 
                                value={selectedStudentId} 
                                onChange={(e) => setSelectedStudentId(e.target.value)} 
                                required 
                                className="w-full bg-black/50 border border-gray-700 text-white p-2 rounded-lg focus:ring-2 focus:ring-violet-600 outline-none"
                            >
                                <option value="" disabled>-- Select Student / Course --</option>
                                {students.map((s) => (
                                    <option key={s._id} value={s._id}>{s.title || s.name || "Unnamed Course"}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-400 ml-1">Topic</label>
                            <input 
                                type="text" 
                                placeholder="e.g. King's Indian Defense" 
                                value={newClass.title} 
                                onChange={(e) => setNewClass({ ...newClass, title: e.target.value })} 
                                required 
                                className="w-full bg-black/50 border border-gray-700 p-2 rounded-lg text-white"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400 ml-1">Date</label>
                                <input 
                                    type="date" 
                                    value={newClass.date} 
                                    onChange={(e) => setNewClass({ ...newClass, date: e.target.value })} 
                                    required 
                                    className="w-full bg-black/50 border border-gray-700 p-2 rounded-lg text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400 ml-1">Time</label>
                                <input 
                                    type="time" 
                                    value={newClass.time} 
                                    onChange={(e) => setNewClass({ ...newClass, time: e.target.value })} 
                                    required 
                                    className="w-full bg-black/50 border border-gray-700 p-2 rounded-lg text-white"
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full mt-4 bg-violet-600 hover:bg-violet-700 text-white font-medium py-2 rounded-lg transition-all">
                            Assign Class
                        </Button>
                    </form>
                </div>
            </motion.div>

            {/* RIGHT COLUMN: Lists */}
            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="lg:col-span-2 space-y-8">
                
                {/* Upcoming */}
                <div>
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white">
                        <Clock className="w-5 h-5 text-blue-400"/> Upcoming Sessions
                    </h2>
                    
                    {loading ? (
                        <div className="p-8 text-center text-gray-500 bg-white/5 rounded-xl animate-pulse">Loading schedule...</div>
                    ) : upcomingClasses.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 bg-white/5 rounded-xl border border-dashed border-gray-700">
                            {selectedStudentId ? "No upcoming classes scheduled." : "Select a student to view schedule."}
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {upcomingClasses.map((cls) => (
                                <div key={cls._id} className="bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4 hover:bg-white/10 transition-colors">
                                    <div>
                                        <h3 className="text-lg font-bold text-white">{cls.title}</h3>
                                        <p className="text-sm text-gray-400 flex items-center gap-2 mt-1">
                                            <Calendar className="w-3 h-3"/> {formatClassTime(cls.classTime).date} 
                                            <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                                            {formatClassTime(cls.classTime).time}
                                        </p>
                                        <p className="text-xs text-violet-400 mt-1 font-mono">ID: {cls.roomId}</p>
                                    </div>

                                    <div className="flex items-center gap-2 w-full sm:w-auto">
                                        <Button 
                                            onClick={() => handleStartClass(cls.roomId)} 
                                            className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white gap-2 shadow-lg shadow-green-900/20"
                                        >
                                            <Video className="w-4 h-4" /> Start
                                        </Button>

                                        {/* Mark Completed Button */}
                                        <button 
                                            onClick={() => handleMarkCompleted(cls._id)}
                                            className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                                            title="Mark as Completed"
                                        >
                                            <CheckCircle className="w-5 h-5" />
                                        </button>

                                        <button 
                                            onClick={() => handleDelete(cls._id)}
                                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                            title="Cancel Class"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Completed */}
                <div>
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-300">
                        <CheckCircle className="w-5 h-5 text-green-600"/> Completed History
                    </h2>
                    
                    <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/5 overflow-hidden p-4 min-h-[100px]">
                         {completedClasses.length === 0 ? (
                            <div className="text-center text-gray-500">No completed classes yet.</div>
                         ) : (
                            <div className="divide-y divide-gray-800">
                              {completedClasses.map((cls) => (
                                <div key={cls._id} className="p-3 flex justify-between items-center hover:bg-white/5 transition-colors rounded">
                                  <div>
                                    <h3 className="text-md font-medium text-gray-400 line-through">{cls.title}</h3>
                                    <p className="text-xs text-gray-500">{formatClassTime(cls.classTime).date}</p>
                                  </div>
                                  <Button onClick={() => handleDelete(cls._id)} variant="ghost" size="icon" className="text-gray-600 hover:text-red-400">
                                      <Trash2 className="h-4 w-4"/>
                                  </Button>
                                </div>
                              ))}
                            </div>
                         )}
                    </div>
                </div>

            </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default CoachClassesNew;