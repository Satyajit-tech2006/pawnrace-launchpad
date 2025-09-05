import React, { useEffect, useState } from "react";
import DashboardNavbar from "../../../components/Dashbordnavbar";

const MyStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Replace this with your backend API URL
  const API_URL = "http://localhost:5000/api/students";

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setStudents(data);
      } catch (error) {
        console.error("Error fetching students:", error);
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
        ) : students.length === 0 ? (
          <p className="text-gray-400">No students found.</p>
        ) : (
          <div className="overflow-x-auto bg-gray-800 rounded-xl shadow-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-700 text-gray-200">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Class</th>
                  <th className="py-3 px-4">Progress</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr
                    key={student.id}
                    className="border-b border-gray-700 hover:bg-gray-700/50"
                  >
                    <td className="py-3 px-4">{student.name}</td>
                    <td className="py-3 px-4">{student.email}</td>
                    <td className="py-3 px-4">{student.className}</td>
                    <td className="py-3 px-4">{student.progress}%</td>
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
