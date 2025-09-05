import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const CoachClasses = () => {
  const [students, setStudents] = useState([]);
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [completedClasses, setCompletedClasses] = useState([]);
  const [newClass, setNewClass] = useState({
    title: "",
    date: "",
    time: "",
    zoomLink: "",
    student: "",
  });

  // ✅ Fetch all registered students
  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/students");
      setStudents(res.data);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  // ✅ Fetch all classes
  const fetchClasses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/classes");
      const upcoming = res.data.filter((c) => c.status === "upcoming");
      const completed = res.data.filter((c) => c.status === "completed");
      setUpcomingClasses(upcoming);
      setCompletedClasses(completed);
    } catch (err) {
      console.error("Error fetching classes:", err);
    }
  };

  // ✅ Add a new class
  const handleAddClass = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/classes", {
        ...newClass,
        status: "upcoming",
      });
      setNewClass({ title: "", date: "", time: "", zoomLink: "", student: "" });
      fetchClasses();
    } catch (err) {
      console.error("Error adding class:", err);
    }
  };

  // ✅ Mark as completed
  const markCompleted = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/classes/${id}`, {
        status: "completed",
      });
      fetchClasses();
    } catch (err) {
      console.error("Error updating class:", err);
    }
  };

  // ✅ Delete a class
  const deleteClass = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/classes/${id}`);
      fetchClasses();
    } catch (err) {
      console.error("Error deleting class:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchClasses();
  }, []);

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

      {/* ➤ Add New Class Form */}
      <motion.form
        onSubmit={handleAddClass}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-xl mb-8"
      >
        <h2 className="text-2xl font-semibold mb-4">➕ Add New Class</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Class Title"
            className="border border-gray-500 bg-transparent p-2 rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
            value={newClass.title}
            onChange={(e) => setNewClass({ ...newClass, title: e.target.value })}
            required
          />
          <input
            type="date"
            className="border border-gray-500 bg-transparent p-2 rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
            value={newClass.date}
            onChange={(e) => setNewClass({ ...newClass, date: e.target.value })}
            required
          />
          <input
            type="time"
            className="border border-gray-500 bg-transparent p-2 rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
            value={newClass.time}
            onChange={(e) => setNewClass({ ...newClass, time: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Zoom Link"
            className="border border-gray-500 bg-transparent p-2 rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
            value={newClass.zoomLink}
            onChange={(e) =>
              setNewClass({ ...newClass, zoomLink: e.target.value })
            }
            required
          />

          {/* ✅ Choose Student */}
          <select
            className="border border-gray-500 bg-black text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-violet-500 col-span-2"
            value={newClass.student}
            onChange={(e) =>
              setNewClass({ ...newClass, student: e.target.value })
            }
            required
          >
            <option value="" disabled>
              Select Student
            </option>
            {students.map((student) => (
              <option
                key={student._id}
                value={student._id}
                className="bg-black text-white"
              >
                {student.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="mt-4 bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105"
        >
          Add Class
        </button>
      </motion.form>

      {/* ➤ Upcoming Classes */}
      <h2 className="text-2xl font-semibold mb-3">📅 Upcoming Classes</h2>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg mb-8"
      >
        {upcomingClasses.length === 0 ? (
          <p className="text-gray-300">No upcoming classes.</p>
        ) : (
          upcomingClasses.map((cls, index) => (
            <motion.div
              key={cls._id}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex justify-between items-center border-b border-gray-600 py-3"
            >
              <div>
                <h3 className="text-lg font-semibold">{cls.title}</h3>
                <p className="text-sm text-gray-300">
                  {cls.date} • {cls.time}
                </p>
                <p className="text-sm text-gray-400">
                  👨‍🎓 {cls.student?.name || "Unknown Student"}
                </p>
                <a
                  href={cls.zoomLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-violet-400 hover:underline"
                >
                  Join Zoom
                </a>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => markCompleted(cls._id)}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg transition-transform hover:scale-105"
                >
                  Mark Completed
                </button>
                <button
                  onClick={() => deleteClass(cls._id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg transition-transform hover:scale-105"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* ➤ Completed Classes */}
      <h2 className="text-2xl font-semibold mb-3">✅ Completed Classes</h2>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg"
      >
        {completedClasses.length === 0 ? (
          <p className="text-gray-300">No completed classes yet.</p>
        ) : (
          completedClasses.map((cls, index) => (
            <motion.div
              key={cls._id}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex justify-between items-center border-b border-gray-600 py-3"
            >
              <div>
                <h3 className="text-lg font-semibold">{cls.title}</h3>
                <p className="text-sm text-gray-300">
                  {cls.date} • {cls.time}
                </p>
                <p className="text-sm text-gray-400">
                  👨‍🎓 {cls.student?.name || "Unknown Student"}
                </p>
                <a
                  href={cls.zoomLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-violet-400 hover:underline"
                >
                  View Recording
                </a>
              </div>
              <button
                onClick={() => deleteClass(cls._id)}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg transition-transform hover:scale-105"
              >
                Delete
              </button>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
};

export { CoachClasses };
