import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const CoachTestResults = () => {
  const [tests, setTests] = useState([]);
  const [students, setStudents] = useState([]);
  const [newTest, setNewTest] = useState("");
  const [zoomLink, setZoomLink] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [review, setReview] = useState("");

  // ✅ Fetch tests
  const fetchTests = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tests");
      setTests(res.data);
    } catch (err) {
      console.error("Error fetching tests:", err);
    }
  };

  // ✅ Fetch students
  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/students");
      setStudents(res.data);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  // ✅ Assign test to student
  const handleAddTest = async (e) => {
    e.preventDefault();
    if (!selectedStudent) {
      alert("Please select a student");
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/tests", {
        name: newTest,
        zoomLink,
        studentId: selectedStudent,
      });
      setNewTest("");
      setZoomLink("");
      setSelectedStudent("");
      fetchTests();
    } catch (err) {
      console.error("Error adding test:", err);
    }
  };

  // ✅ Add review
  const handleReview = async (testId) => {
    try {
      await axios.put(`http://localhost:5000/api/tests/${testId}/review`, {
        review,
      });
      setReview("");
      fetchTests();
    } catch (err) {
      console.error("Error adding review:", err);
    }
  };

  useEffect(() => {
    fetchTests();
    fetchStudents();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#10172a] via-[#0a1020] to-black p-6 text-white">
      <h1 className="text-3xl font-extrabold text-center mb-8">👨‍🏫 Manage Tests</h1>

      {/* ➕ Assign Test */}
      <motion.form
        onSubmit={handleAddTest}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg mb-8"
      >
        <h2 className="text-xl font-semibold mb-3">➕ Assign New Test</h2>

        {/* Select Student */}
        <select
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
          className="w-full p-3 rounded-lg bg-black/40 border border-gray-500 text-white mb-3"
          required
        >
          <option value="">-- Select Student --</option>
          {students.map((student) => (
            <option key={student._id} value={student._id}>
              {student.name}
            </option>
          ))}
        </select>

        {/* Test Name */}
        <input
          type="text"
          className="w-full p-3 mb-3 rounded-lg bg-black/40 border border-gray-500 text-white focus:ring-2 focus:ring-violet-500"
          placeholder="Enter test name..."
          value={newTest}
          onChange={(e) => setNewTest(e.target.value)}
          required
        />

        {/* Zoom Link */}
        <input
          type="url"
          className="w-full p-3 mb-3 rounded-lg bg-black/40 border border-gray-500 text-white focus:ring-2 focus:ring-blue-500"
          placeholder="Enter Zoom link..."
          value={zoomLink}
          onChange={(e) => setZoomLink(e.target.value)}
          required
        />

        <button
          type="submit"
          className="mt-3 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg shadow-md"
        >
          Assign Test
        </button>
      </motion.form>

      {/* 📄 Review Tests */}
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
            <p className="text-gray-300">
              🎓 Assigned to: {test.student?.name || "Unknown"}
            </p>

            {/* Zoom Link */}
            {test.zoomLink && (
              <a
                href={test.zoomLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md"
              >
                Join Link
              </a>
            )}

            {/* Review Section */}
            <textarea
              className="w-full mt-4 p-3 rounded-lg bg-black/40 border border-gray-500 text-white focus:ring-2 focus:ring-green-500"
              rows="2"
              placeholder="Write coach review..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
            ></textarea>
            <button
              onClick={() => handleReview(test._id)}
              className="mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md"
            >
              Save Review
            </button>
          </motion.div>
        ))
      )}
    </div>
  );
};

export default CoachTestResults;
