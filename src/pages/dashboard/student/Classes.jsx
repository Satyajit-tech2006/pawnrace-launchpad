import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext"; // ✅ import auth context

const Classes = () => {
  const { user } = useAuth(); // ✅ get logged-in student
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [completedClasses, setCompletedClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      // if (!user?._id) return; // ✅ don’t fetch if user not loaded yet

      try {
        const res = await axios.get(
          `http://localhost:5000/api/classes?studentId=${user._id}`
        );
        const allClasses = res.data;

        setUpcomingClasses(allClasses.filter((cls) => cls.status === "upcoming"));
        setCompletedClasses(allClasses.filter((cls) => cls.status === "completed"));
      } catch (err) {
        console.error("Error fetching classes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg font-semibold text-gray-200 bg-gradient-to-br from-[#0a1429] via-[#0a1020] to-black">
        Loading classes...
      </div>
    );
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
          🎓 Chess Classes
        </motion.h1>

        {/* Upcoming Classes */}
        <motion.div
          className="bg-white/10 backdrop-blur-md shadow-xl rounded-2xl p-6 mb-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-green-400">
            📅 Upcoming Classes
          </h2>
          {upcomingClasses.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {upcomingClasses.map((cls, index) => (
                <motion.div
                  key={cls._id}
                  className="p-5 bg-gradient-to-br from-green-900/40 to-green-600/20 rounded-xl shadow-lg border border-green-500/30 hover:border-green-400 transition-all"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <h3 className="text-lg font-bold">{cls.title}</h3>
                  <p className="text-gray-300">📅 {cls.date}</p>
                  <p className="text-gray-300">🕒 {cls.time}</p>
                  <a
                    href={cls.zoomLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-5 rounded-lg shadow-md transition-transform transform hover:scale-105"
                  >
                    Join Class
                  </a>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No upcoming classes available.</p>
          )}
        </motion.div>

        {/* Completed Classes */}
        <motion.div
          className="bg-white/10 backdrop-blur-md shadow-xl rounded-2xl p-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-blue-400">
            ✅ Completed Classes
          </h2>
          {completedClasses.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {completedClasses.map((cls, index) => (
                <motion.div
                  key={cls._id}
                  className="p-5 bg-gradient-to-br from-blue-900/40 to-blue-600/20 rounded-xl shadow-lg border border-blue-500/30 hover:border-blue-400 transition-all"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <h3 className="text-lg font-bold">{cls.title}</h3>
                  <p className="text-gray-300">📅 {cls.date}</p>
                  <p className="text-gray-300">🕒 {cls.time}</p>
                  <p className="mt-2 text-green-400 font-semibold">✔ Completed</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No completed classes yet.</p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Classes;
