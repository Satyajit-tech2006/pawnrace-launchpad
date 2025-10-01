import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../../contexts/AuthContext.jsx";
import apiClient from "../../../lib/api.js";
import { ENDPOINTS } from "../../../lib/endpoints.js";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/button.tsx";

// Helper function to format ISO date strings for display
const formatClassTime = (isoString) => {
  if (!isoString) return { date: 'N/A', time: 'N/A' };
  const date = new Date(isoString);
  const formattedDate = date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return { date: formattedDate, time: formattedTime };
};

export const CoachClasses = () => { // Using named export to match AppRoutes.jsx
  const { user } = useAuth();
  
  // State for data
  const [courses, setCourses] = useState([]);
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [completedClasses, setCompletedClasses] = useState([]);

  // State for UI and forms
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [error, setError] = useState(null);
  const [newClass, setNewClass] = useState({ title: "", date: "", time: "", zoomLink: "" });

  // Step 1: Fetch the coach's courses when the component mounts
  const fetchCourses = async () => {
    if (!user) return;
    try {
      setLoadingCourses(true);
      const response = await apiClient.get(ENDPOINTS.COURSES.GET_MY_COURSES_AS_COACH);
      setCourses(response.data.data || []);
    } catch (err) {
      setError("Could not fetch your courses.");
      console.error("Error fetching courses:", err);
    } finally {
      setLoadingCourses(false);
    }
  };
  useEffect(() => {
    fetchCourses();
  }, [user]);

  // Step 3: Fetch classes for a course whenever a new course is selected
  const fetchClassesForCourse = async () => {
    if (!selectedCourseId) {
      setUpcomingClasses([]);
      setCompletedClasses([]);
      return;
    };

    try {
      setLoadingClasses(true);
      const response = await apiClient.get(ENDPOINTS.CLASSES.GET_BY_COURSE(selectedCourseId));
      const allClasses = response.data.data || [];
      setUpcomingClasses(allClasses.filter(c => c.status === 'scheduled'));
      setCompletedClasses(allClasses.filter(c => c.status === 'completed'));
    } catch (err) {
      toast.error("Failed to load classes for this course.");
      console.error("Error fetching classes:", err);
    } finally {
      setLoadingClasses(false);
    }
  };
  useEffect(() => {
    fetchClassesForCourse();
  }, [selectedCourseId]);

  const handleAddClass = async (e) => {
    e.preventDefault();
    if (!selectedCourseId) {
      toast.error("Please select a course first.");
      return;
    }
    try {
      const classTime = new Date(`${newClass.date}T${newClass.time}`).toISOString();
      await apiClient.post(ENDPOINTS.CLASSES.SCHEDULE(selectedCourseId), {
        title: newClass.title,
        classTime,
        zoomLink: newClass.zoomLink,
      });
      toast.success("Class scheduled successfully!");
      setNewClass({ title: "", date: "", time: "", zoomLink: "" });
      fetchClassesForCourse(); // Refetch classes for the currently selected course
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add class.");
    }
  };

  const markCompleted = async (classId) => {
    try {
        await apiClient.patch(ENDPOINTS.CLASSES.UPDATE(classId), { status: 'completed' });
        toast.success("Class marked as completed.");
        fetchClassesForCourse();
    } catch (err) {
        toast.error("Failed to update class status.");
    }
  };
  
  const deleteClass = async (classId) => {
     if (window.confirm("Are you sure you want to delete this class?")) {
        try {
            await apiClient.delete(ENDPOINTS.CLASSES.DELETE(classId));
            toast.success("Class deleted.");
            fetchClassesForCourse();
        } catch (err) {
            toast.error("Failed to delete class.");
        }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1429] via-[#0a1020] to-black p-6 text-white">
      <motion.h1 initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-3xl font-extrabold text-center mb-8">
        🎓 Coach Classes
      </motion.h1>

      <motion.form onSubmit={handleAddClass} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-xl mb-8">
        <h2 className="text-2xl font-semibold mb-4">➕ Add New Class</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Class Title" value={newClass.title} onChange={(e) => setNewClass({ ...newClass, title: e.target.value })} required className="border border-gray-500 bg-transparent p-2 rounded focus:outline-none focus:ring-2 focus:ring-violet-500"/>
          <input type="date" value={newClass.date} onChange={(e) => setNewClass({ ...newClass, date: e.target.value })} required className="border border-gray-500 bg-transparent p-2 rounded focus:outline-none focus:ring-2 focus:ring-violet-500"/>
          <input type="time" value={newClass.time} onChange={(e) => setNewClass({ ...newClass, time: e.target.value })} required className="border border-gray-500 bg-transparent p-2 rounded focus:outline-none focus:ring-2 focus:ring-violet-500"/>
          <input type="text" placeholder="Zoom Link" value={newClass.zoomLink} onChange={(e) => setNewClass({ ...newClass, zoomLink: e.target.value })} required className="border border-gray-500 bg-transparent p-2 rounded focus:outline-none focus:ring-2 focus:ring-violet-500"/>
          
          <select value={selectedCourseId} onChange={(e) => setSelectedCourseId(e.target.value)} required className="border border-gray-500 bg-black text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-violet-500 col-span-2">
            <option value="" disabled>-- Select a Course to Manage --</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id} className="bg-black text-white">{course.title}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="mt-4 bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105">
          Add Class
        </button>
      </motion.form>

      {loadingCourses ? <p className="text-center text-gray-400">Loading your courses...</p> 
      : error ? <p className="text-center text-red-500">{error}</p>
      : (
        <>
          <h2 className="text-2xl font-semibold mb-3">📅 Upcoming Classes</h2>
          <motion.div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg mb-8 min-h-[100px]">
            {loadingClasses ? <p>Loading...</p> : upcomingClasses.length === 0 ? <p className="text-gray-300">No upcoming classes for this course.</p> : (
              upcomingClasses.map((cls, index) => (
                <motion.div key={cls._id} initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: index * 0.1 }} className="flex justify-between items-center border-b border-gray-600 py-3">
                  <div>
                    <h3 className="text-lg font-semibold">{cls.title}</h3>
                    <p className="text-sm text-gray-300">{formatClassTime(cls.classTime).date} • {formatClassTime(cls.classTime).time}</p>
                    <a href={cls.zoomLink} target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">Join Zoom</a>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => markCompleted(cls._id)} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg transition-transform hover:scale-105">Mark Completed</Button>
                    <Button onClick={() => deleteClass(cls._id)} variant="destructive" size="icon" className="transition-transform hover:scale-105"><Trash2 className="h-4 w-4"/></Button>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>

          <h2 className="text-2xl font-semibold mb-3">✅ Completed Classes</h2>
          <motion.div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg min-h-[100px]">
             {loadingClasses ? <p>Loading...</p> : completedClasses.length === 0 ? <p className="text-gray-300">No completed classes for this course.</p> : (
              completedClasses.map((cls, index) => (
                <motion.div key={cls._id} initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: index * 0.1 }} className="flex justify-between items-center border-b border-gray-600 py-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-400 line-through">{cls.title}</h3>
                    <p className="text-sm text-gray-300">{formatClassTime(cls.classTime).date} • {formatClassTime(cls.classTime).time}</p>
                  </div>
                  <Button onClick={() => deleteClass(cls._id)} variant="destructive" size="icon" className="transition-transform hover:scale-105"><Trash2 className="h-4 w-4"/></Button>
                </motion.div>
              ))
            )}
          </motion.div>
        </>
      )}
    </div>
  );
};

