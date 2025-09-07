import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, UserPlus, UserX } from "lucide-react";
// Corrected import paths to use .tsx for all UI components and ensure all are present
import { Button } from "../../../components/ui/button.tsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card.tsx";
import { Input } from "../../../components/ui/input.tsx";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../../components/ui/dialog.tsx";
import { Label } from "../../../components/ui/label.tsx";
import { Textarea } from "../../../components/ui/textarea.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select.tsx";
import { useAuth } from "../../../contexts/AuthContext.jsx";
import apiClient from "../../../lib/api.js";
import { ENDPOINTS } from "../../../lib/endpoints.js";
import DashboardNavbar from "../../../components/Dashbordnavbar.jsx";
import { toast } from "sonner";

// This component now functions as a "My Courses" manager.
const MyStudents = () => {
  const [courses, setCourses] = useState([]);
  const [syllabi, setSyllabi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for modals
  const [isCreateCourseModalOpen, setIsCreateCourseModalOpen] = useState(false);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);

  // State for forms
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [studentIdToAdd, setStudentIdToAdd] = useState("");
  const [newCourseData, setNewCourseData] = useState({ title: "", description: "", syllabusId: "" });

  const { user } = useAuth();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [coursesResponse, syllabiResponse] = await Promise.all([
        apiClient.get(ENDPOINTS.COURSES.GET_MY_COURSES_AS_COACH),
        apiClient.get(ENDPOINTS.COURSES.GET_SYLLABI)
      ]);
      setCourses(coursesResponse.data.data || []);
      setSyllabi(syllabiResponse.data.data || []);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load your courses. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);
  
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!newCourseData.title || !newCourseData.syllabusId) {
        toast.error("Title and syllabus are required.");
        return;
    }
    try {
        await apiClient.post(ENDPOINTS.COURSES.CREATE, newCourseData);
        toast.success("Course created successfully!");
        setIsCreateCourseModalOpen(false);
        setNewCourseData({ title: "", description: "", syllabusId: "" });
        fetchData();
    } catch (err) {
        toast.error(err.response?.data?.message || "Failed to create course.");
        console.error("Error creating course:", err);
    }
  };

  const openAddStudentModal = (courseId) => {
    setSelectedCourseId(courseId);
    setStudentIdToAdd("");
    setIsAddStudentModalOpen(true);
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!studentIdToAdd.trim()) return;
    try {
      await apiClient.post(ENDPOINTS.COURSES.ADD_STUDENT(selectedCourseId), {
        studentId: studentIdToAdd,
      });
      toast.success("Student added successfully!");
      setIsAddStudentModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add student. Please check the ID.");
      console.error("Error adding student:", err);
    }
  };

  const handleRemoveStudent = async (courseId, studentId) => {
    if (window.confirm("Are you sure you want to remove this student from the course?")) {
      try {
        await apiClient.delete(ENDPOINTS.COURSES.REMOVE_STUDENT(courseId, studentId));
        toast.success("Student removed successfully.");
        fetchData();
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to remove student.");
        console.error("Error removing student:", err);
      }
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm("Are you sure you want to permanently delete this course? This action cannot be undone.")) {
      try {
        await apiClient.delete(ENDPOINTS.COURSES.DELETE(courseId));
        toast.success("Course deleted successfully.");
        fetchData();
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to delete course.");
        console.error("Error deleting course:", err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <DashboardNavbar />
      <div className="max-w-7xl mx-auto pt-28 px-6 pb-12">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">My Courses</h1>
            <Button className="btn-hero" onClick={() => setIsCreateCourseModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4"/> Create New Course
            </Button>
        </div>

        {loading ? (<p className="text-center text-gray-400">Loading your courses...</p>) 
        : error ? (<p className="text-center text-red-500">{error}</p>)
        : courses.length === 0 ? (
            <p className="text-gray-400">You have not created any courses yet.</p>
        ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {courses.map((course) => (
                    <motion.div key={course._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <Card className="bg-gray-800 border-gray-700 text-white h-full flex flex-col">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle>{course.title}</CardTitle>
                                        <CardDescription className="text-gray-400">{course.description || "No description."}</CardDescription>
                                    </div>
                                    <Button variant="destructive" size="icon" onClick={() => handleDeleteCourse(course._id)}>
                                        <Trash2 className="h-4 w-4"/>
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <h4 className="font-semibold mb-2">Enrolled Students ({course.students.length})</h4>
                                <div className="space-y-2">
                                    {course.students.length > 0 ? course.students.map(student => (
                                        <div key={student._id} className="flex items-center justify-between bg-gray-700/50 p-2 rounded">
                                            <span className="text-sm">{student.fullname} ({student.email})</span>
                                            <Button size="icon" variant="ghost" onClick={() => handleRemoveStudent(course._id, student._id)}>
                                                <UserX className="h-4 w-4 text-red-400"/>
                                            </Button>
                                        </div>
                                    )) : <p className="text-sm text-gray-500">No students enrolled yet.</p>}
                                </div>
                            </CardContent>
                            <div className="p-6 pt-0">
                                <Button className="w-full" onClick={() => openAddStudentModal(course._id)}>
                                    <UserPlus className="mr-2 h-4 w-4"/> Add Student
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        )}

        {/* Create Course Modal */}
        <Dialog open={isCreateCourseModalOpen} onOpenChange={setIsCreateCourseModalOpen}>
            <DialogContent className="bg-gray-800 border-gray-700 text-white">
                <DialogHeader>
                    <DialogTitle>Create a New Course</DialogTitle>
                    <DialogDescription>Fill in the details below to create a new course.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateCourse} className="space-y-4">
                    <div>
                        <Label htmlFor="title">Course Title</Label>
                        <Input id="title" value={newCourseData.title} onChange={(e) => setNewCourseData({...newCourseData, title: e.target.value})} className="bg-gray-700 border-gray-600" required/>
                    </div>
                    <div>
                        <Label htmlFor="description">Description (Optional)</Label>
                        <Textarea id="description" value={newCourseData.description} onChange={(e) => setNewCourseData({...newCourseData, description: e.target.value})} className="bg-gray-700 border-gray-600"/>
                    </div>
                    <div>
                        <Label htmlFor="syllabusId">Syllabus</Label>
                        <Select onValueChange={(value) => setNewCourseData({...newCourseData, syllabusId: value})} required>
                            <SelectTrigger className="bg-gray-700 border-gray-600">
                                <SelectValue placeholder="Select a syllabus..." />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 text-white border-gray-600">
                                {syllabi.map(syllabus => (
                                    <SelectItem key={syllabus._id} value={syllabus._id}>{syllabus.level}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Button type="submit" className="w-full">Create Course</Button>
                </form>
            </DialogContent>
        </Dialog>

        {/* Add Student Modal */}
        <Dialog open={isAddStudentModalOpen} onOpenChange={setIsAddStudentModalOpen}>
            <DialogContent className="bg-gray-800 border-gray-700 text-white">
                <DialogHeader>
                    <DialogTitle>Add Student to Course</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddStudent} className="space-y-4">
                    <div>
                        <Label htmlFor="studentId">Student ID</Label>
                        <Input
                            id="studentId"
                            placeholder="Paste the student's ID here"
                            value={studentIdToAdd}
                            onChange={(e) => setStudentIdToAdd(e.target.value)}
                            className="bg-gray-700 border-gray-600"
                        />
                    </div>
                    <Button type="submit" className="w-full">Add Student</Button>
                </form>
            </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default MyStudents;

