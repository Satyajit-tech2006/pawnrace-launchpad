import React, { useEffect, useState } from "react";
import DashboardNavbar from "../../../components/Dashbordnavbar.jsx";
import apiClient from "../../../lib/api.js";
import { ENDPOINTS } from "../../../lib/endpoints.js";

const MyStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(ENDPOINTS.CHATS.GET_STUDENTS_FOR_COACH);
        setStudents(response.data.data);
      } catch (error) {
        console.error("Error fetching students:", error);
        setError("Failed to fetch students. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <DashboardNavbar />
      <div className="max-w-6xl mx-auto pt-28 px-6">
        <h1 className="text-2xl font-bold mb-6">My Students</h1>

        {loading ? (
          <p className="text-gray-400">Loading students...</p>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : students.length === 0 ? (
          <p className="text-gray-400">No students found.</p>
        ) : (
          <div className="overflow-x-auto bg-gray-800 rounded-xl shadow-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-700 text-gray-200">
                  {/* 1. Removed extra table headers */}
                  <th className="py-3 px-4">Full Name</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr
                    key={student._id}
                    className="border-b border-gray-700 hover:bg-gray-700/50"
                  >
                    {/* 2. Removed extra table cells to only show the name */}
                    <td className="py-3 px-4">{student.fullname}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyStudents;

