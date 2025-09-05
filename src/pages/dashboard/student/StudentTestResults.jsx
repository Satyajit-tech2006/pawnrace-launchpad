import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext"; // ✅ logged-in student

const StudentTestResults = () => {
  const { user } = useAuth();
  const [tests, setTests] = useState([]);

  // ✅ Fetch tests for this student
  const fetchTests = async () => {
    if (!user?._id) return;
    try {
      const res = await axios.get(
        `http://localhost:5000/api/tests?studentId=${user._id}`
      );
      setTests(res.data);
    } catch (err) {
      console.error("Error fetching tests:", err);
    }
  };

  useEffect(() => {
    fetchTests();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#10172a] via-[#0a1020] to-black p-6 text-white">
      <h1 className="text-3xl font-extrabold text-center mb-8">📝 Test Results</h1>

      {tests.length === 0 ? (
        <p className="text-gray-400 text-center">No tests assigned yet.</p>
      ) : (
        tests.map((test, index) => (
          <motion.div
            key={test._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg mb-6"
          >
            <h2 className="text-xl font-bold">{test.name}</h2>
            <p className="text-gray-400 mt-2">
              📅 Assigned by: {test.coach?.name || "Coach"}
            </p>

            {/* ✅ Join Zoom Link */}
            {test.zoomLink && (
              <a
                href={test.zoomLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md"
              >
                Join Test
              </a>
            )}

            {/* ✅ Coach Review */}
            {test.review && (
              <p className="mt-4 text-green-400 font-semibold">
                ✅ Coach Review: {test.review}
              </p>
            )}
          </motion.div>
        ))
      )}
    </div>
  );
};

export default StudentTestResults;
