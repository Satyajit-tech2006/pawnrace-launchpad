import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../../contexts/AuthContext.jsx";
import apiClient from "../../../lib/api.js";
import { ENDPOINTS } from "../../../lib/endpoints.js";
import { toast } from "sonner";
import { CheckCircle2, ExternalLink } from "lucide-react";
import { Button } from "../../../components/ui/button.tsx";

const StudentAssignment = () => {
  const { user } = useAuth();
  const [pendingAssignments, setPendingAssignments] = useState([]);
  const [completedAssignments, setCompletedAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Re-usable function to fetch all assignment data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Fetch all courses the student is enrolled in
      const coursesRes = await apiClient.get(ENDPOINTS.COURSES.GET_MY_COURSES_AS_STUDENT);
      const enrolledCourses = coursesRes.data.data || [];

      if (enrolledCourses.length > 0) {
        // 2. Fetch assignments for each course
        const assignmentPromises = enrolledCourses.map(course =>
          apiClient.get(ENDPOINTS.ASSIGNMENTS.GET_BY_COURSE(course._id))
        );
        const assignmentResults = await Promise.all(assignmentPromises);

        // 3. Combine all assignments into a single list
        const allAssignments = assignmentResults.flatMap(res => res.data.data || []);
        
        // 4. Filter assignments into pending and completed lists
        setPendingAssignments(allAssignments.filter((a) => a.status !== 'completed'));
        setCompletedAssignments(allAssignments.filter((a) => a.status === 'completed'));
      } else {
        setPendingAssignments([]);
        setCompletedAssignments([]);
      }
    } catch (err) {
      console.error("Error fetching assignments:", err);
      setError("Could not load your assignments at this time.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  // Handler for when a student marks an assignment as complete
  const handleMarkAsComplete = async (assignmentId) => {
    try {
      await apiClient.patch(ENDPOINTS.ASSIGNMENTS.UPDATE_STATUS(assignmentId), {
        status: 'completed'
      });
      toast.success("Assignment marked as complete!");
      fetchData(); // Refresh the lists to move the assignment
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update assignment.");
      console.error("Error marking as complete:", err);
    }
  };
  
  // The main layout is now always rendered. Loading/error/content is handled inside.
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1429] via-[#0a1020] to-black p-6 text-white">
      <h1 className="text-3xl font-extrabold text-center mb-8">
        📘 My Assignments
      </h1>

      {loading ? (
        <div className="text-center text-lg text-gray-400">Loading assignments...</div>
      ) : error ? (
        <div className="text-center text-lg text-red-500">{error}</div>
      ) : (
        <>
          {/* Pending Assignments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg mb-8"
          >
            <h2 className="text-2xl font-semibold mb-4 text-yellow-400">⏳ Pending Assignments</h2>
            {pendingAssignments.length > 0 ? (
              pendingAssignments.map((assignment) => (
                <div key={assignment._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-800/50 p-4 rounded-lg mb-3">
                  <div>
                    <h3 className="text-lg font-bold">{assignment.title}</h3>
                    <p className="text-sm text-gray-400">Course: {assignment.course?.title || 'General'}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-3 sm:mt-0">
                    <a href={assignment.assignmentLink} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="text-white border-blue-400 hover:bg-blue-500 hover:text-white">
                        <ExternalLink className="mr-2 h-4 w-4"/>
                        Open
                      </Button>
                    </a>
                    <Button onClick={() => handleMarkAsComplete(assignment._id)} className="bg-green-600 hover:bg-green-700">
                      <CheckCircle2 className="mr-2 h-4 w-4"/>
                      Mark as Complete
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400">You have no pending assignments. Great job!</p>
            )}
          </motion.div>

          {/* Completed Assignments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg"
          >
            <h2 className="text-2xl font-semibold mb-4 text-green-400">✅ Completed Assignments</h2>
            {completedAssignments.length > 0 ? (
              completedAssignments.map((assignment) => (
                <div key={assignment._id} className="flex items-center justify-between bg-gray-800/50 p-4 rounded-lg mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-400 line-through">{assignment.title}</h3>
                    <p className="text-sm text-gray-500">Course: {assignment.course?.title || 'General'}</p>
                  </div>
                  <a href={assignment.assignmentLink} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" className="text-gray-400">
                      <ExternalLink className="mr-2 h-4 w-4"/>
                      View
                    </Button>
                  </a>
                </div>
              ))
            ) : (
              <p className="text-gray-400">You haven't completed any assignments yet.</p>
            )}
          </motion.div>
        </>
      )}
    </div>
  );
};

export default StudentAssignment;

