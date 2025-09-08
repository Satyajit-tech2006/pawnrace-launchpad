import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../../contexts/AuthContext.jsx";
import apiClient from "../../../lib/api.js";
import { ENDPOINTS } from "../../../lib/endpoints.js";

// Helper function to format the ISO date string from the backend
const formatClassTime = (isoString) => {
  if (!isoString) return { date: 'N/A', time: 'N/A' };
  const date = new Date(isoString);
  const formattedDate = date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return { date: formattedDate, time: formattedTime };
};

const Classes = () => {
  const { user } = useAuth();
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [completedClasses, setCompletedClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchStudentClasses = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. CORRECTED: Using the correct endpoint key from your endpoints.js file.
        const enrolledCoursesRes = await apiClient.get(ENDPOINTS.COURSES.GET_MY_COURSES_AS_STUDENT);
        const enrolledCourses = enrolledCoursesRes.data.data || [];

        if (enrolledCourses.length > 0) {
          const classFetchPromises = enrolledCourses.map(course =>
            apiClient.get(ENDPOINTS.CLASSES.GET_BY_COURSE(course._id))
          );
          const classResponses = await Promise.all(classFetchPromises);
          const allClasses = classResponses.flatMap(response => response.data.data || []);
          
          setUpcomingClasses(allClasses.filter((cls) => cls.status === "scheduled"));
          setCompletedClasses(allClasses.filter((cls) => cls.status === "completed"));
        } else {
            setUpcomingClasses([]);
            setCompletedClasses([]);
        }

      } catch (err) {
        console.error("Error fetching student classes:", err);
        setError("Could not load your classes at this time.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentClasses();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg font-semibold text-gray-200 bg-gradient-to-br from-[#0a1429] via-[#0a1020] to-black">
        Loading your classes...
      </div>
    );
  }

  if (error) {
    return (
        <div className="flex items-center justify-center h-screen text-lg text-center font-semibold text-red-400 bg-gradient-to-br from-[#0a1429] via-[#0a1020] to-black">
            {error}
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1429] via-[#0a1020] to-black text-white">
      <div className="max-w-6xl mx-auto p-6">
        <motion.h1
          className="text-4xl font-extrabold text-center mb-10"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          🎓 My Classes
        </motion.h1>

        {/* Upcoming Classes */}
        <motion.div
          className="bg-white/10 backdrop-blur-md shadow-xl rounded-2xl p-6 mb-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-green-400">📅 Upcoming Classes</h2>
          {upcomingClasses.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {upcomingClasses.map((cls, index) => {
                const { date, time } = formatClassTime(cls.classTime);
                return (
                  <motion.div
                    key={cls._id}
                    className="p-5 bg-gradient-to-br from-green-900/40 to-green-600/20 rounded-xl shadow-lg border border-green-500/30 hover:border-green-400 transition-all"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <h3 className="text-lg font-bold">{cls.title}</h3>
                    <p className="text-gray-300">📅 {date}</p>
                    <p className="text-gray-300">🕒 {time}</p>
                    <a
                      href={cls.zoomLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-4 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-5 rounded-lg shadow-md transition-transform transform hover:scale-105"
                    >
                      Join Class
                    </a>
                  </motion.div>
                )
              })}
            </div>
          ) : (
            <p className="text-gray-400">You have no upcoming classes scheduled.</p>
          )}
        </motion.div>

        {/* Completed Classes */}
        <motion.div
          className="bg-white/10 backdrop-blur-md shadow-xl rounded-2xl p-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-blue-400">✅ Completed Classes</h2>
          {completedClasses.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {completedClasses.map((cls, index) => {
                const { date, time } = formatClassTime(cls.classTime);
                return (
                  <motion.div
                    key={cls._id}
                    className="p-5 bg-gradient-to-br from-blue-900/40 to-blue-600/20 rounded-xl shadow-lg border border-blue-500/30 hover:border-blue-400 transition-all"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <h3 className="text-lg font-bold">{cls.title}</h3>
                    <p className="text-gray-300">📅 {date}</p>
                    <p className="text-gray-300">🕒 {time}</p>
                    <p className="mt-2 text-green-400 font-semibold">✔ Completed</p>
                  </motion.div>
                )
              })}
            </div>
          ) : (
            <p className="text-gray-400">You have no completed classes yet.</p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Classes;

