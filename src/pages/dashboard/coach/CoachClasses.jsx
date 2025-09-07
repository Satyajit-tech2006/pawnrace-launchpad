import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import apiClient from "../../../lib/api.js";
import { ENDPOINTS } from "../../../lib/endpoints.js";

// A helper function to format date/time nicely
const formatClassTime = (isoString) => {
  const date = new Date(isoString);
  const formattedDate = date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return { date: formattedDate, time: formattedTime };
};

export const CoachClasses = () => { // Correctly a named export
  const [courses, setCourses] = useState([]);
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [completedClasses, setCompletedClasses] = useState([]);
  const [newClass, setNewClass] = useState({
    title: "",
    date: "",
    time: "",
    zoomLink: "",
    course: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Refactored data fetching logic
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Step 1: Fetch the coach's courses first.
      const coursesResponse = await apiClient.get(ENDPOINTS.COURSES.GET_ALL);
      const coachCourses = coursesResponse.data.data || [];
      setCourses(coachCourses);

      // Step 2: If there are courses, fetch the classes for EACH course.
      if (coachCourses.length > 0) {
        const classFetchPromises = coachCourses.map(course =>
          apiClient.get(ENDPOINTS.CLASSES.GET_BY_COURSE(course._id))
        );
        const classResponses = await Promise.all(classFetchPromises);
        
        // Combine the classes from all courses into a single array
        const allClasses = classResponses.flatMap(response => response.data.data || []);
        
        // Filter classes into upcoming ('scheduled') and completed
        setUpcomingClasses(allClasses.filter((c) => c.status === "scheduled"));
        setCompletedClasses(allClasses.filter((c) => c.status === "completed"));
      } else {
        // If the coach has no courses, there are no classes to fetch.
        setUpcomingClasses([]);
        setCompletedClasses([]);
      }

    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load class data. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handler to add a new class for a specific course
  const handleAddClass = async (e) => {
    e.preventDefault();
    if (!newClass.course) {
        alert("Please select a course to schedule the class for.");
        return;
    }
    try {
      const classTime = new Date(`${newClass.date}T${newClass.time}`).toISOString();
      
      await apiClient.post(ENDPOINTS.CLASSES.SCHEDULE(newClass.course), {
        title: newClass.title,
        classTime: classTime,
        zoomLink: newClass.zoomLink,
      });

      setNewClass({ title: "", date: "", time: "", zoomLink: "", course: "" });
      fetchData(); // Refresh all data
    } catch (err) {
      console.error("Error adding class:", err);
      alert("Failed to add class. Check console for details.");
    }
  };

  // Handler to mark a class as completed
  const markCompleted = async (classId) => {
    try {
      await apiClient.patch(ENDPOINTS.CLASSES.UPDATE(classId), { status: "completed" });
      fetchData();
    } catch (err) {
      console.error("Error marking class as completed:", err);
    }
  };

  // Handler to delete a class
  const deleteClass = async (classId) => {
    try {
      await apiClient.delete(ENDPOINTS.CLASSES.DELETE(classId));
      fetchData();
    } catch (err) {
      console.error("Error deleting class:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1429] via-[#0a1020] to-black p-6 text-white">
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-extrabold text-center mb-8"
      >
        🎓 Coach Classes
      </motion.h1>

      {/* Add New Class Form */}
      <motion.form
        onSubmit={handleAddClass}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-xl mb-8"
      >
        <h2 className="text-2xl font-semibold mb-4">➕ Add New Class</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Class Title" className="border border-gray-500 bg-transparent p-2 rounded focus:outline-none focus:ring-2 focus:ring-violet-500" value={newClass.title} onChange={(e) => setNewClass({ ...newClass, title: e.target.value })} required />
          <input type="date" className="border border-gray-500 bg-transparent p-2 rounded focus:outline-none focus:ring-2 focus:ring-violet-500" value={newClass.date} onChange={(e) => setNewClass({ ...newClass, date: e.target.value })} required />
          <input type="time" className="border border-gray-500 bg-transparent p-2 rounded focus:outline-none focus:ring-2 focus:ring-violet-500" value={newClass.time} onChange={(e) => setNewClass({ ...newClass, time: e.target.value })} required />
          <input type="text" placeholder="Zoom Link" className="border border-gray-500 bg-transparent p-2 rounded focus:outline-none focus:ring-2 focus:ring-violet-500" value={newClass.zoomLink} onChange={(e) => setNewClass({ ...newClass, zoomLink: e.target.value })} required />
          <select className="border border-gray-500 bg-black text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-violet-500 col-span-2" value={newClass.course} onChange={(e) => setNewClass({ ...newClass, course: e.target.value })} required>
            <option value="" disabled>Select Course</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id} className="bg-black text-white">{course.title}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="mt-4 bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105">
          Add Class
        </button>
      </motion.form>

      {/* Display loading or error states */}
      {loading && <p className="text-center text-lg">Loading Classes...</p>}
      {error && <p className="text-center text-lg text-red-400">{error}</p>}

      {/* Lists of Classes */}
      {!loading && !error && (
        <>
          <h2 className="text-2xl font-semibold mb-3">📅 Upcoming Classes</h2>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg mb-8">
            {upcomingClasses.length === 0 ? (<p className="text-gray-300">No upcoming classes.</p>) : (
              upcomingClasses.map((cls, index) => (
                <motion.div key={cls._id} initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: index * 0.1 }} className="flex justify-between items-center border-b border-gray-600 py-3">
                  <div>
                    <h3 className="text-lg font-semibold">{cls.title}</h3>
                    <p className="text-sm text-gray-300">{formatClassTime(cls.classTime).date} • {formatClassTime(cls.classTime).time}</p>
                    <p className="text-sm text-gray-400">For Course: {courses.find(c => c._id === cls.course)?.title || "N/A"}</p>
                    <a href={cls.zoomLink} target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">Join Zoom</a>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => markCompleted(cls._id)} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg transition-transform hover:scale-105">Mark Completed</button>
                    <button onClick={() => deleteClass(cls._id)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg transition-transform hover:scale-105">Delete</button>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>

          <h2 className="text-2xl font-semibold mb-3">✅ Completed Classes</h2>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg">
            {completedClasses.length === 0 ? (<p className="text-gray-300">No completed classes yet.</p>) : (
              completedClasses.map((cls, index) => (
                <motion.div key={cls._id} initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: index * 0.1 }} className="flex justify-between items-center border-b border-gray-600 py-3">
                  <div>
                    <h3 className="text-lg font-semibold">{cls.title}</h3>
                    <p className="text-sm text-gray-300">{formatClassTime(cls.classTime).date} • {formatClassTime(cls.classTime).time}</p>
                    <p className="text-sm text-gray-400">For Course: {courses.find(c => c._id === cls.course)?.title || "N/A"}</p>
                    <a href={cls.zoomLink} target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">View Recording</a>
                  </div>
                  <button onClick={() => deleteClass(cls._id)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg transition-transform hover:scale-105">Delete</button>
                </motion.div>
              ))
            )}
          </motion.div>
        </>
      )}
    </div>
  );
};

