import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../../contexts/AuthContext.jsx";
import apiClient from "../../../lib/api.js";
import { ENDPOINTS } from "../../../lib/endpoints.js";
import { Button } from "../../../components/ui/button.tsx";
import { ExternalLink } from "lucide-react";
import { toast } from "sonner";

const StudentTestResults = () => {
  const { user } = useAuth();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchStudentTests = async () => {
      try {
        setLoading(true);
        setError(null);

        // Step 1: Fetch all courses the student is enrolled in.
        const coursesRes = await apiClient.get(ENDPOINTS.COURSES.GET_MY_COURSES_AS_STUDENT);
        const enrolledCourses = coursesRes.data.data || [];

        if (enrolledCourses.length > 0) {
          // Step 2: For each course, create a promise to fetch its tests.
          const testPromises = enrolledCourses.map(course =>
            apiClient.get(ENDPOINTS.TESTS.GET_BY_COURSE(course._id))
          );

          // Step 3: Wait for all test requests to complete.
          const testResults = await Promise.all(testPromises);

          // Step 4: Combine all tests from all courses into a single flat array.
          const allTests = testResults.flatMap(res => res.data.data || []);
          
          setTests(allTests);
        } else {
          setTests([]); // If no courses, then no tests.
        }
      } catch (err) {
        console.error("Error fetching tests:", err);
        setError("Could not load your tests at this time.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentTests();
  }, [user]);

  // Main layout is always rendered. Loading/error/content is handled inside.
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#10172a] via-[#0a1020] to-black p-6 text-white">
      <h1 className="text-3xl font-extrabold text-center mb-8">📝 Test Results</h1>

      {loading ? (
        <p className="text-center text-lg text-gray-400">Loading your assigned tests...</p>
      ) : error ? (
        <p className="text-center text-lg text-red-500">{error}</p>
      ) : tests.length === 0 ? (
        <p className="text-gray-400 text-center">No tests have been assigned to you yet.</p>
      ) : (
        <div className="max-w-4xl mx-auto space-y-4">
          {tests.map((test, index) => (
            <motion.div
              key={test._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center"
            >
              <div>
                <h2 className="text-xl font-bold">{test.testName}</h2>
                <p className="text-gray-400 mt-1 text-sm">
                  Course: {test.course?.title || "N/A"}
                </p>
                {/* We'll add the review section later if needed */}
              </div>
              
              <a
                href={test.zoomLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 sm:mt-0"
              >
                <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Join Test
                </Button>
              </a>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentTestResults;
