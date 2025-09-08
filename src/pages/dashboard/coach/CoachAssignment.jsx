import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../../contexts/AuthContext.jsx";
import apiClient from "../../../lib/api.js";
import { ENDPOINTS } from "../../../lib/endpoints.js";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
// 1. ADDED: The missing Button component import
import { Button } from "../../../components/ui/button.tsx";

const CoachAssignment = () => {
  const [courses, setCourses] = useState([]);
  const [assignmentsByCourse, setAssignmentsByCourse] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for the creation form
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [newAssignmentTitle, setNewAssignmentTitle] = useState("");
  const [newAssignmentLink, setNewAssignmentLink] = useState("");
  
  const { user } = useAuth();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Fetch all courses the coach owns
      const coursesResponse = await apiClient.get(ENDPOINTS.COURSES.GET_MY_COURSES_AS_COACH);
      const coachCourses = coursesResponse.data.data || [];
      setCourses(coachCourses);

      // 2. For each course, fetch its assignments
      if (coachCourses.length > 0) {
        const assignmentsPromises = coachCourses.map(course =>
          apiClient.get(ENDPOINTS.ASSIGNMENTS.GET_BY_COURSE(course._id))
        );
        const assignmentsResults = await Promise.all(assignmentsPromises);

        // 3. Organize assignments into a map for easy lookup: { courseId: [assignments] }
        const assignmentsMap = {};
        coachCourses.forEach((course, index) => {
          assignmentsMap[course._id] = assignmentsResults[index].data.data || [];
        });
        setAssignmentsByCourse(assignmentsMap);
      }
    } catch (err) {
      console.error("Error fetching assignment data:", err);
      setError("Failed to load assignment data. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  // Handler for creating a new assignment
  const handleAddAssignment = async (e) => {
    e.preventDefault();
    if (!selectedCourseId || !newAssignmentTitle.trim() || !newAssignmentLink.trim()) {
      toast.error("Please select a course and fill out all fields.");
      return;
    }
    try {
      await apiClient.post(ENDPOINTS.ASSIGNMENTS.CREATE(selectedCourseId), {
        title: newAssignmentTitle,
        assignmentLink: newAssignmentLink,
      });
      toast.success("Assignment created successfully!");
      // Reset form and refetch data
      setSelectedCourseId("");
      setNewAssignmentTitle("");
      setNewAssignmentLink("");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create assignment.");
      console.error("Error creating assignment:", err);
    }
  };
  
  // Handler for deleting an assignment
  const handleDeleteAssignment = async (assignmentId) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
        try {
            await apiClient.delete(ENDPOINTS.ASSIGNMENTS.DELETE(assignmentId));
            toast.success("Assignment deleted.");
            fetchData(); // Refresh data
        } catch(err) {
            toast.error(err.response?.data?.message || "Failed to delete assignment.");
            console.error("Error deleting assignment:", err);
        }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1429] via-[#0a1020] to-black p-6 text-white">
      <h1 className="text-3xl font-extrabold text-center mb-8">
        👨‍🏫 Coach Assignments
      </h1>

      {/* Create Assignment Form */}
      <motion.form
        onSubmit={handleAddAssignment}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg mb-8"
      >
        <h2 className="text-xl font-semibold mb-3">➕ Create Assignment</h2>
        
        {/* Select Course Dropdown */}
        <select
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
          className="w-full p-3 rounded-lg bg-black/40 border border-gray-500 text-white mb-3"
          required
        >
          <option value="">-- Select Course --</option>
          {courses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.title}
            </option>
          ))}
        </select>

        {/* Assignment Title */}
        <input
          type="text"
          className="w-full p-3 rounded-lg bg-black/40 border border-gray-500 text-white mb-3 focus:ring-2 focus:ring-violet-500"
          placeholder="Enter assignment topic..."
          value={newAssignmentTitle}
          onChange={(e) => setNewAssignmentTitle(e.target.value)}
          required
        />

        {/* Assignment Link */}
        <input
          type="url"
          className="w-full p-3 rounded-lg bg-black/40 border border-gray-500 text-white mb-3 focus:ring-2 focus:ring-blue-500"
          placeholder="Enter assignment link (e.g., Lichess)"
          value={newAssignmentLink}
          onChange={(e) => setNewAssignmentLink(e.target.value)}
          required
        />

        <button
          type="submit"
          className="mt-3 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg shadow-md"
        >
          Create Assignment for Course
        </button>
      </motion.form>

      {/* Review Assignments Section */}
      <h2 className="text-2xl font-semibold mb-3">📄 Review Assignments</h2>
      {loading ? <p className="text-center">Loading assignments...</p>
      : error ? <p className="text-center text-red-400">{error}</p>
      : courses.length === 0 ? <p className="text-gray-400">Create a course to start adding assignments.</p>
      : (
        <div className="space-y-6">
          {courses.map(course => (
            <div key={course._id}>
              <h3 className="text-xl font-bold text-violet-400 mb-2">{course.title}</h3>
              {assignmentsByCourse[course._id]?.length > 0 ? (
                assignmentsByCourse[course._id].map((assignment) => (
                  <motion.div
                    key={assignment._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/10 backdrop-blur-lg p-4 rounded-lg shadow-lg mb-4 flex justify-between items-center"
                  >
                    <div>
                        <h4 className="text-lg font-semibold">{assignment.title}</h4>
                        <a href={assignment.assignmentLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline mt-1 inline-block">
                            🔗 View Assignment
                        </a>
                    </div>
                    {/* This button will now render correctly */}
                    <Button variant="destructive" size="icon" onClick={() => handleDeleteAssignment(assignment._id)}>
                        <Trash2 className="h-4 w-4"/>
                    </Button>
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-500 text-sm ml-2">No assignments for this course yet.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CoachAssignment;

