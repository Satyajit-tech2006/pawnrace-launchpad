import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext"; // ✅ import AuthContext

const StudentAssignment = () => {
  const { user } = useAuth(); // ✅ get logged-in student
  const [assignments, setAssignments] = useState([]);
  const [submission, setSubmission] = useState("");
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  // ✅ Fetch assignments for this student
  const fetchAssignments = async () => {
    if (!user?._id) return; // wait until user is loaded

    try {
      const res = await axios.get(
        `http://localhost:5000/api/assignments?studentId=${user._id}`
      );
      setAssignments(res.data);
    } catch (err) {
      console.error("Error fetching assignments:", err);
    }
  };

  // ✅ Submit assignment (student’s work)
  const handleSubmit = async (assignmentId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/assignments/${assignmentId}/submit`,
        {
          studentId: user._id, // ✅ attach student id
          submission,
        }
      );
      setSubmission("");
      setSelectedAssignment(null);
      fetchAssignments();
    } catch (err) {
      console.error("Error submitting assignment:", err);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1429] via-[#0a1020] to-black p-6 text-white">
      <h1 className="text-3xl font-extrabold text-center mb-8">
        📘 Student Assignments
      </h1>

      {assignments.length === 0 ? (
        <p className="text-gray-400 text-center">No assignments yet.</p>
      ) : (
        assignments.map((assignment, index) => (
          <motion.div
            key={assignment._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg mb-6"
          >
            <h2 className="text-xl font-bold">{assignment.topic}</h2>

            <button
              onClick={() => setSelectedAssignment(assignment._id)}
              className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md"
            >
              View Assignment
            </button>

            {/* ✅ Submit Section */}
            {selectedAssignment === assignment._id && (
              <div className="mt-4">
                <textarea
                  className="w-full p-3 rounded-lg bg-black/40 border border-gray-500 text-white focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  placeholder="Write your answer here..."
                  value={submission}
                  onChange={(e) => setSubmission(e.target.value)}
                ></textarea>
                <button
                  onClick={() => handleSubmit(assignment._id)}
                  className="mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md"
                >
                  Submit Assignment
                </button>
              </div>
            )}

            {/* ✅ Remark from coach */}
            {assignment.remark && (
              <p className="mt-4 text-green-400 font-semibold">
                ✅ Remark from Coach: {assignment.remark}
              </p>
            )}
          </motion.div>
        ))
      )}
    </div>
  );
};

export default StudentAssignment;
