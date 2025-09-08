import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../../contexts/AuthContext.jsx";
import apiClient from "../../../lib/api.js";
import { ENDPOINTS } from "../../../lib/endpoints.js";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/button.tsx";

const CoachTestResults = () => {
  const [courses, setCourses] = useState([]);
  const [testsByCourse, setTestsByCourse] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for the creation form
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [newTestName, setNewTestName] = useState("");
  const [newTestZoomLink, setNewTestZoomLink] = useState("");
  
  const { user } = useAuth();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Fetch all courses the coach owns
      const coursesResponse = await apiClient.get(ENDPOINTS.COURSES.GET_MY_COURSES_AS_COACH);
      const coachCourses = coursesResponse.data.data || [];
      setCourses(coachCourses);

      // 2. For each course, fetch its tests
      if (coachCourses.length > 0) {
        const testPromises = coachCourses.map(course =>
          apiClient.get(ENDPOINTS.TESTS.GET_BY_COURSE(course._id))
        );
        const testResults = await Promise.all(testPromises);

        // 3. Organize tests into a map for easy lookup: { courseId: [tests] }
        const testsMap = {};
        coachCourses.forEach((course, index) => {
          testsMap[course._id] = testResults[index].data.data || [];
        });
        setTestsByCourse(testsMap);
      }
    } catch (err) {
      console.error("Error fetching test data:", err);
      setError("Failed to load test data. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  // Handler for creating a new test
  const handleAddTest = async (e) => {
    e.preventDefault();
    if (!selectedCourseId || !newTestName.trim() || !newTestZoomLink.trim()) {
      toast.error("Please select a course and fill out all fields.");
      return;
    }
    try {
      await apiClient.post(ENDPOINTS.TESTS.CREATE(selectedCourseId), {
        testName: newTestName,
        zoomLink: newTestZoomLink,
      });
      toast.success("Test created successfully!");
      // Reset form and refetch data
      setSelectedCourseId("");
      setNewTestName("");
      setNewTestZoomLink("");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create test.");
      console.error("Error creating test:", err);
    }
  };
  
  // Handler for deleting a test
  const handleDeleteTest = async (testId) => {
    if (window.confirm("Are you sure you want to delete this test?")) {
        try {
            await apiClient.delete(ENDPOINTS.TESTS.DELETE(testId));
            toast.success("Test deleted.");
            fetchData(); // Refresh data
        } catch(err) {
            toast.error(err.response?.data?.message || "Failed to delete test.");
            console.error("Error deleting test:", err);
        }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#10172a] via-[#0a1020] to-black p-6 text-white">
      <h1 className="text-3xl font-extrabold text-center mb-8">👨‍🏫 Manage Tests</h1>

      {/* Assign Test Form */}
      <motion.form
        onSubmit={handleAddTest}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg mb-8"
      >
        <h2 className="text-xl font-semibold mb-3">➕ Assign New Test</h2>

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

        {/* Test Name */}
        <input
          type="text"
          className="w-full p-3 mb-3 rounded-lg bg-black/40 border border-gray-500 text-white focus:ring-2 focus:ring-violet-500"
          placeholder="Enter test name..."
          value={newTestName}
          onChange={(e) => setNewTestName(e.target.value)}
          required
        />

        {/* Zoom Link */}
        <input
          type="url"
          className="w-full p-3 mb-3 rounded-lg bg-black/40 border border-gray-500 text-white focus:ring-2 focus:ring-blue-500"
          placeholder="Enter Zoom link..."
          value={newTestZoomLink}
          onChange={(e) => setNewTestZoomLink(e.target.value)}
          required
        />

        <button
          type="submit"
          className="mt-3 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg shadow-md"
        >
          Assign Test to Course
        </button>
      </motion.form>

      {/* Review Tests Section */}
      <h2 className="text-2xl font-semibold mb-3">📄 Assigned Tests</h2>
       {loading ? <p className="text-center">Loading tests...</p>
      : error ? <p className="text-center text-red-400">{error}</p>
      : courses.length === 0 ? <p className="text-gray-400">Create a course to start assigning tests.</p>
      : (
        <div className="space-y-6">
          {courses.map(course => (
            <div key={course._id}>
              <h3 className="text-xl font-bold text-violet-400 mb-2">{course.title}</h3>
              {testsByCourse[course._id]?.length > 0 ? (
                testsByCourse[course._id].map((test) => (
                  <motion.div
                    key={test._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/10 backdrop-blur-lg p-4 rounded-lg shadow-lg mb-4 flex justify-between items-center"
                  >
                    <div>
                        <h4 className="text-lg font-semibold">{test.testName}</h4>
                        <a href={test.zoomLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline mt-1 inline-block">
                            🔗 Join Link
                        </a>
                    </div>
                    <Button variant="destructive" size="icon" onClick={() => handleDeleteTest(test._id)}>
                        <Trash2 className="h-4 w-4"/>
                    </Button>
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-500 text-sm ml-2">No tests assigned to this course yet.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CoachTestResults;
