import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; 
import { useAuth } from "../../../contexts/AuthContext.jsx";
import apiClient from "../../../lib/api.js"; // Backend connect hone par use hoga
import { ENDPOINTS } from "../../../lib/endpoints.js";
import { toast } from "sonner";
import { Trash2, Video, User, Calendar, Clock } from "lucide-react";
import { Button } from "../../../components/ui/button.tsx";

// Helper: Format Date
const formatClassTime = (isoString) => {
  if (!isoString) return { date: 'N/A', time: 'N/A' };
  const date = new Date(isoString);
  const formattedDate = date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return { date: formattedDate, time: formattedTime };
};

export const CoachClasses = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // --- States ---
  const [students, setStudents] = useState([]); 
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [completedClasses, setCompletedClasses] = useState([]);
  
  // Selection & Form States
  const [selectedStudentId, setSelectedStudentId] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [newClass, setNewClass] = useState({ title: "", date: "", time: "" });

  // --- 1. Fetch Students (DEMO MODE) ---
  useEffect(() => {
    setLoading(true);
    // Asli backend call:
    // apiClient.get(ENDPOINTS.COACH.GET_MY_STUDENTS).then(res => setStudents(res.data))...

    // MOCK DATA:
    setTimeout(() => {
        setStudents([
            { _id: "student_1", name: "Rohan Kumar", email: "rohan@chess.com" },
            { _id: "student_2", name: "Anjali Gupta", email: "anjali@chess.com" },
            { _id: "student_3", name: "Vikram Singh", email: "vikram@chess.com" }
        ]);
        setLoading(false);
    }, 500);
  }, [user]);

  // --- 2. Fetch Classes for Selected Student (DEMO MODE) ---
  useEffect(() => {
    if (!selectedStudentId) {
        setUpcomingClasses([]);
        setCompletedClasses([]);
        return;
    }

    setLoading(true);
    // Asli backend call:
    // apiClient.get(`classes?studentId=${selectedStudentId}`)...

    // MOCK DATA:
    setTimeout(() => {
        // Sirf demo ke liye hum hardcoded classes dikha rahe hain
        const demoClasses = [
            { 
                _id: "cls_101", 
                title: "Opening Traps & Tricks", 
                studentId: "student_1", 
                classTime: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
                status: 'scheduled',
                roomId: 'room-alpha-1'
            },
            { 
                _id: "cls_102", 
                title: "Rook Endgames", 
                studentId: "student_2", 
                classTime: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
                status: 'scheduled',
                roomId: 'room-beta-2'
            }
        ];

        const filtered = demoClasses.filter(c => c.studentId === selectedStudentId);
        setUpcomingClasses(filtered);
        setCompletedClasses([]); // Empty for now
        setLoading(false);
    }, 400);

  }, [selectedStudentId]);


  // --- 3. Create Class (DEMO + LOGIC) ---
  const handleAddClass = async (e) => {
    e.preventDefault();
    if (!selectedStudentId) {
      toast.error("Please select a student first.");
      return;
    }

    try {
      const classTime = new Date(`${newClass.date}T${newClass.time}`).toISOString();
      // Generate Random Room ID
      const generatedRoomId = Math.random().toString(36).substring(2, 9) + Date.now().toString(36).substring(4, 8);

      const newClassObj = {
        title: newClass.title,
        classTime,
        studentId: selectedStudentId, 
        roomId: generatedRoomId,     
        coachId: user?.id || "coach_1",
        status: 'scheduled',
        _id: `temp_${Date.now()}` // Temp ID for UI
      };

      // Backend API Call (Uncomment later)
      // await apiClient.post(ENDPOINTS.CLASSES.CREATE, newClassObj);

      // UI Update (Simulation)
      setUpcomingClasses([...upcomingClasses, newClassObj]);
      
      toast.success("Class assigned successfully!");
      setNewClass({ title: "", date: "", time: "" });

    } catch (err) {
      toast.error("Failed to schedule class.");
    }
  };

  // --- Actions ---
  const handleJoinClass = (roomId) => {
      navigate(`/classroom/${roomId}`);
  };

  const handleDelete = (id) => {
      if(window.confirm("Cancel this class?")) {
          setUpcomingClasses(upcomingClasses.filter(c => c._id !== id));
          toast.success("Class cancelled.");
      }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1429] via-[#0a1020] to-black p-6 text-white">
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-extrabold flex items-center gap-2">
                🎓 Coach Classroom
            </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT COLUMN: Create Class Form */}
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="lg:col-span-1">
                <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-xl sticky top-6">
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-violet-400"/> Schedule Class
                    </h2>
                    
                    <form onSubmit={handleAddClass} className="space-y-4">
                        {/* Student Select */}
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400 ml-1">Assign Student</label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 w-4 h-4 text-gray-500"/>
                                <select 
                                    value={selectedStudentId} 
                                    onChange={(e) => setSelectedStudentId(e.target.value)} 
                                    required 
                                    className="w-full bg-black/50 border border-gray-700 text-white p-2 pl-9 rounded-lg focus:ring-2 focus:ring-violet-600 outline-none appearance-none"
                                >
                                    <option value="" disabled>Select Student</option>
                                    {students.map((s) => (
                                        <option key={s._id} value={s._id}>{s.name}</option>
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
                                className="w-full bg-black/50 border border-gray-700 p-2 rounded-lg focus:ring-2 focus:ring-violet-600 outline-none"
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
                                    className="w-full bg-black/50 border border-gray-700 p-2 rounded-lg focus:ring-2 focus:ring-violet-600 outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400 ml-1">Time</label>
                                <input 
                                    type="time" 
                                    value={newClass.time} 
                                    onChange={(e) => setNewClass({ ...newClass, time: e.target.value })} 
                                    required 
                                    className="w-full bg-black/50 border border-gray-700 p-2 rounded-lg focus:ring-2 focus:ring-violet-600 outline-none"
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full mt-4 bg-violet-600 hover:bg-violet-700 text-white font-medium py-2 rounded-lg transition-all">
                            Assign Class
                        </Button>
                    </form>
                </div>
            </motion.div>

            {/* RIGHT COLUMN: Class List */}
            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="lg:col-span-2 space-y-6">
                
                {/* Upcoming */}
                <div>
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-400"/> Upcoming Sessions
                    </h2>
                    
                    {loading ? (
                        <div className="p-8 text-center text-gray-500 bg-white/5 rounded-xl animate-pulse">Loading classes...</div>
                    ) : upcomingClasses.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 bg-white/5 rounded-xl border border-dashed border-gray-700">
                            {selectedStudentId ? "No classes scheduled for this student." : "Select a student to view their classes."}
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
                                        <p className="text-xs text-violet-400 mt-1 font-mono">Room: {cls.roomId}</p>
                                    </div>

                                    <div className="flex items-center gap-3 w-full sm:w-auto">
                                        <Button 
                                            onClick={() => handleJoinClass(cls.roomId)} 
                                            className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white gap-2 shadow-lg shadow-green-900/20"
                                        >
                                            <Video className="w-4 h-4" /> Start Class
                                        </Button>
                                        <button 
                                            onClick={() => handleDelete(cls._id)}
                                            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
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

export default CoachClasses;