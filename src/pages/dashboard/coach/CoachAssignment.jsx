import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const CoachAssignment = () => {
  const [assignments, setAssignments] = useState([]);
  const [newAssignment, setNewAssignment] = useState("");
  const [assignmentLink, setAssignmentLink] = useState("");
  const [remark, setRemark] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");

  // ✅ Fetch all assignments
  const fetchAssignments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/assignments");
      setAssignments(res.data);
    } catch (err) {
      console.error("Error fetching assignments:", err);
    }
  };

  // ✅ Fetch all students
  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/students");
      setStudents(res.data);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  // ✅ Create new assignment for selected student
  const handleAddAssignment = async (e) => {
    e.preventDefault();
    if (!selectedStudent) {
      alert("Please select a student first.");
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/assignments", {
        topic: newAssignment,
        studentId: selectedStudent,
        link: assignmentLink,
      });
      setNewAssignment("");
      setAssignmentLink("");
      setSelectedStudent("");
      fetchAssignments();
    } catch (err) {
      console.error("Error creating assignment:", err);
    }
  };

  // ✅ Add remark to student submission
  const handleRemark = async (assignmentId) => {
    try {
      await axios.put(`http://localhost:5000/api/assignments/${assignmentId}/remark`, {
        remark,
      });
      setRemark("");
      fetchAssignments();
    } catch (err) {
      console.error("Error adding remark:", err);
    }
  };

  useEffect(() => {
    fetchAssignments();
    fetchStudents();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1429] via-[#0a1020] to-black p-6 text-white">
      <h1 className="text-3xl font-extrabold text-center mb-8">
        👨‍🏫 Coach Assignments
      </h1>

      {/* ➕ Add Assignment */}
      <motion.form
        onSubmit={handleAddAssignment}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg mb-8"
      >
        <h2 className="text-xl font-semibold mb-3">➕ Create Assignment</h2>

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

        {/* Assignment Topic */}
        <input
          type="text"
          className="w-full p-3 rounded-lg bg-black/40 border border-gray-500 text-white mb-3 focus:ring-2 focus:ring-violet-500"
          placeholder="Enter assignment topic..."
          value={newAssignment}
          onChange={(e) => setNewAssignment(e.target.value)}
          required
        />

        {/* Assignment Link */}
        <input
          type="url"
          className="w-full p-3 rounded-lg bg-black/40 border border-gray-500 text-white mb-3 focus:ring-2 focus:ring-blue-500"
          placeholder="Enter assignment link"
          value={assignmentLink}
          onChange={(e) => setAssignmentLink(e.target.value)}
        />

        <button
          type="submit"
          className="mt-3 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg shadow-md"
        >
          Assign to Student
        </button>
      </motion.form>

      {/* 📄 Review Assignments */}
      {assignments.length === 0 ? (
        <p className="text-gray-400 text-center">No assignments created yet.</p>
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
            <p className="text-gray-300">
              🎓 Assigned to: {assignment.student?.name || "Unknown Student"}
            </p>

            {/* ✅ Show Assignment Link */}
            {assignment.link && (
              <a
                href={assignment.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline mt-2 inline-block"
              >
                🔗 Open Assignment
              </a>
            )}

            {/* Student Submission */}
            {assignment.submission ? (
              <div className="mt-3">
                <p className="text-gray-300">📑 Student Submission:</p>
                <p className="bg-black/40 p-3 rounded-lg mt-2">{assignment.submission}</p>

                {/* Remark */}
                <textarea
                  className="w-full mt-3 p-3 rounded-lg bg-black/40 border border-gray-500 text-white focus:ring-2 focus:ring-green-500"
                  rows="2"
                  placeholder="Write a remark..."
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                ></textarea>
                <button
                  onClick={() => handleRemark(assignment._id)}
                  className="mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md"
                >
                  Send Remark
                </button>
              </div>
            ) : (
              <p className="mt-3 text-gray-400">⏳ No submission yet.</p>
            )}
          </motion.div>
        ))
      )}
    </div>
  );
};

export default CoachAssignment;
