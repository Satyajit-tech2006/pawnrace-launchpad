import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext.jsx";
import apiClient from "../../../lib/api.js";
import { ENDPOINTS } from "../../../lib/endpoints.js";
import { toast } from "sonner";
import { Trash2, Video, User, Calendar, Clock, CheckCircle } from "lucide-react";
import { Button } from "../../../components/ui/button.tsx";

// Helper: Format Date for display
const formatClassTime = (isoString) => {
  if (!isoString) return { date: 'N/A', time: 'N/A' };
  const date = new Date(isoString);
  const formattedDate = date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return { date: formattedDate, time: formattedTime };
};

// Helper: Generate a random Room ID for the internal classroom
const generateRoomId = () => {
    return 'room-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now().toString(36);
};

export const CoachClasses = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // --- State Management ---
  const [students, setStudents] = useState([]); // List of students assigned to coach
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [completedClasses, setCompletedClasses] = useState([]);

  // UI States
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(true);
  
  // Form State
  const [newClass, setNewClass] = useState({ title: "", date: "", time: "" });

  // --- 1. Fetch Students on Mount ---
  useEffect(() => {
    const fetchStudents = async () => {
        try {
            setLoadingStudents(true);
            // Replace with your actual endpoint to get students assigned to this coach
            // Example: const res = await apiClient.get(ENDPOINTS.COACH.GET_MY_STUDENTS);
            // For now, using the logic that you might be fetching "Courses" or "Users"
            // If you don't have a specific endpoint yet, you might need to mock this or adjust
            const response = await apiClient.get(ENDPOINTS.COURSES.GET_MY_COURSES_AS_COACH); 
            // Assuming the backend returns courses/students. Adjust mapping as needed.
            setStudents(response.data.data || []); 
        } catch (err) {
            console.error("Error fetching students:", err);
            toast.error("Could not load student list.");
        } finally {
            setLoadingStudents(false);
        }
    };
    if (user) fetchStudents();
  }, [user]);

  // --- 2. Fetch Classes when Student/Course is Selected ---
  const fetchClasses = async () => {
    if (!selectedStudentId) {
        setUpcomingClasses([]);
        setCompletedClasses([]);
        return;
    }

    try {
        setLoading(true);
        // Fetching classes based on the selected ID (Student ID or Course ID)
        const response = await apiClient.get(ENDPOINTS.CLASSES.GET_BY_COURSE(selectedStudentId));
        const allClasses = response.data.data || [];

        setUpcomingClasses(allClasses.filter(c => c.status === 'scheduled' || c.status === 'upcoming'));
        setCompletedClasses(allClasses.filter(c => c.status === 'completed'));
    } catch (err) {
        console.error("Error fetching classes:", err);
        toast.error("Failed to load schedule.");
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [selectedStudentId]);

  // --- 3. Schedule New Class (Internal Room) ---
  const handleAddClass = async (e) => {
    e.preventDefault();
    if (!selectedStudentId) {
      toast.error("Please select a student/course first.");
      return;
    }

    try {
      const classTime = new Date(`${newClass.date}T${newClass.time}`).toISOString();
      const roomId = generateRoomId(); // Create the internal room ID

      // POST request to backend
      await apiClient.post(ENDPOINTS.CLASSES.SCHEDULE(selectedStudentId), {
        title: newClass.title,
        classTime,
        roomId: roomId, // Sending generated Room ID
        platform: 'internal', // Flag to tell backend this isn't Zoom
        status: 'scheduled'
      });

      toast.success("Class scheduled successfully!");
      setNewClass({ title: "", date: "", time: "" });
      fetchClasses(); // Refresh list
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to schedule class.");
    }
  };

  // --- 4. Actions ---
  const handleStartClass = (roomId) => {
      if(!roomId) {
          toast.error("Error: No Room ID found for this class.");
          return;
      }
      // Navigate to your internal video classroom route
      navigate(`/classroom/${roomId}`);
  };

  const handleDelete = async (classId) => {
      if(window.confirm("Are you sure you want to cancel this class?")) {
          try {
              await apiClient.delete(ENDPOINTS.CLASSES.DELETE(classId));
              toast.success("Class cancelled.");
              fetchClasses();
          } catch (err) {
              toast.error("Failed to delete class.");
          }
      }
  };

  const handleMarkCompleted = async (classId) => {
      try {
          await apiClient.patch(ENDPOINTS.CLASSES.UPDATE(classId), { status: 'completed' });
          toast.success("Class marked as completed.");
          fetchClasses();
      } catch (err) {
          toast.error("Failed to update status.");
      }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1429] via-[#0a1020] to-black p-6 text-white">
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-extrabold flex items-center gap-2">
                🎓 Coach Classroom
            </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT COLUMN: Schedule Class Form */}
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="lg:col-span-1">
                <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-xl sticky top-6">
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-violet-400"/> Schedule Class
                    </h2>
                    
                    <form onSubmit={handleAddClass} className="space-y-4">
                        {/* Student/Course Select */}
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400 ml-1">Assign To</label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 w-4 h-4 text-gray-500"/>
                                <select 
                                    value={selectedStudentId} 
                                    onChange={(e) => setSelectedStudentId(e.target.value)} 
                                    required 
                                    disabled={loadingStudents}
                                    className="w-full bg-black/50 border border-gray-700 text-white p-2 pl-9 rounded-lg focus:ring-2 focus:ring-violet-600 outline-none appearance-none"
                                >
                                    <option value="" disabled>-- Select Student / Course --</option>
                                    {students.map((s) => (
                                        // Adjust 's.title' or 's.name' based on your API response
                                        <option key={s._id} value={s._id}>{s.title || s.name || "Unnamed Course"}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Title */}
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400 ml-1">Topic</label>
                            <input 
                                type="text" 
                                placeholder="e.g. Queen's Gambit" 
                                value={newClass.title} 
                                onChange={(e) => setNewClass({ ...newClass, title: e.target.value })} 
                                required 
                                className="w-full bg-black/50 border border-gray-700 p-2 rounded-lg focus:ring-2 focus:ring-violet-600 outline-none text-white"
                            />
                        </div>

                        {/* Date & Time */}
                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400 ml-1">Date</label>
                                <input 
                                    type="date" 
                                    value={newClass.date} 
                                    onChange={(e) => setNewClass({ ...newClass, date: e.target.value })} 
                                    required 
                                    className="w-full bg-black/50 border border-gray-700 p-2 rounded-lg focus:ring-2 focus:ring-violet-600 outline-none text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400 ml-1">Time</label>
                                <input 
                                    type="time" 
                                    value={newClass.time} 
                                    onChange={(e) => setNewClass({ ...newClass, time: e.target.value })} 
                                    required 
                                    className="w-full bg-black/50 border border-gray-700 p-2 rounded-lg focus:ring-2 focus:ring-violet-600 outline-none text-white"
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
                
                {/* 1. Upcoming Sessions */}
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
                                        <p className="text-xs text-violet-400 mt-1 font-mono">
                                            ID: {cls.roomId || "No ID"}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2 w-full sm:w-auto">
                                        <Button 
                                            onClick={() => handleStartClass(cls.roomId)} 
                                            className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white gap-2 shadow-lg shadow-green-900/20"
                                        >
                                            <Video className="w-4 h-4" /> Start Class
                                        </Button>
                                        <button 
                                            onClick={() => handleMarkCompleted(cls._id)}
                                            title="Mark as Completed"
                                            className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
                                        >
                                            <CheckCircle className="w-5 h-5" />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(cls._id)}
                                            title="Cancel Class"
                                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 2. Completed Classes (Ported from Old Code) */}
                <div>
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-300">
                        <CheckCircle className="w-5 h-5 text-green-600"/> Completed History
                    </h2>
                    
                    <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/5 overflow-hidden">
                         {loading ? <div className="p-4 text-center text-gray-500">Loading...</div> : 
                          completedClasses.length === 0 ? (
                            <div className="p-6 text-center text-gray-500 text-sm">No completed classes yet.</div>
                         ) : (
                            <div className="divide-y divide-gray-800">
                              {completedClasses.map((cls) => (
                                <div key={cls._id} className="p-4 flex justify-between items-center hover:bg-white/5 transition-colors">
                                  <div>
                                    <h3 className="text-md font-medium text-gray-400 line-through decoration-gray-600">{cls.title}</h3>
                                    <p className="text-xs text-gray-500">{formatClassTime(cls.classTime).date}</p>
                                  </div>
                                  <Button onClick={() => handleDelete(cls._id)} variant="ghost" size="icon" className="text-gray-600 hover:text-red-400 hover:bg-transparent">
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

export default CoachClasses;