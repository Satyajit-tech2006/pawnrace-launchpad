import React from "react";
import {
  Calendar,
  Clock,
  User,
  BookOpen,
  Target,
  TrendingUp,
  FileText,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import DashboardNavbar from "../../components/Dashbordnavbar";

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();

  const upcomingClasses = [
    {
      id: 1,
      title: "Opening Strategies",
      coach: "GM Alexandra Petrov",
      date: "2024-01-15",
      time: "10:00 AM",
      zoomLink: "https://zoom.us/j/123456789",
    },
    {
      id: 2,
      title: "Endgame Tactics",
      coach: "IM Michael Chen",
      date: "2024-01-16",
      time: "2:00 PM",
      zoomLink: "https://zoom.us/j/987654321",
    },
  ];

  const recentAssignments = [
    {
      id: 1,
      title: "King and Pawn Endgames",
      dueDate: "2024-01-20",
      status: "pending",
    },
    {
      id: 2,
      title: "Tactical Puzzles Set 5",
      dueDate: "2024-01-18",
      status: "submitted",
    },
  ];

  const stats = [
    { label: "Current Rating", value: "1245", change: "+45", icon: TrendingUp },
    { label: "Classes Completed", value: "24", change: "+3", icon: BookOpen },
    { label: "Puzzles Solved", value: "156", change: "+12", icon: Target },
    { label: "Study Hours", value: "48h", change: "+6h", icon: Clock },
  ];

  return (
    <>
    <div className="pb-12">
      <DashboardNavbar /></div>
      {/* Page Container */}
      <div className="space-y-10 p-6 bg-muted/30 min-h-screen">
        
        {/* Welcome Section */}
        <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-black p-8 rounded-2xl shadow-md">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Welcome back, {user?.name || "Student"} 👋
          </h1>
          <p className="mt-2 text-lg opacity-90">
            Ready to continue your chess journey? Here’s your progress and
            upcoming lessons.
          </p>
        </section>

        {/* Stats Overview */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="transition-all duration-200 hover:shadow-lg hover:scale-[1.02] bg-white"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-green-600">{stat.change}</p>
                  </div>
                  <div className="bg-primary/10 p-3 rounded-xl">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Classes + Actions + Progress */}
        <section className="grid lg:grid-cols-3 gap-8">
          
          {/* Upcoming Classes */}
          <Card className="lg:col-span-2 bg-white shadow-md">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Calendar className="h-5 w-5 text-primary" />
                Upcoming Classes
              </CardTitle>
              <CardDescription>
                Your next scheduled lessons with coaches
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingClasses.length > 0 ? (
                upcomingClasses.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition"
                  >
                    <div>
                      <h4 className="font-semibold text-lg">
                        {lesson.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        with {lesson.coach}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                        <span>📅 {lesson.date}</span>
                        <span>🕐 {lesson.time}</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => window.open(lesson.zoomLink, "_blank")}
                      className="btn-hero"
                    >
                      Join Class
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No upcoming classes scheduled</p>
                  <Button className="mt-4 btn-outline">
                    Schedule a Lesson
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions + Progress */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-white shadow-md">
              <CardHeader className="border-b">
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full btn-hero justify-start gap-2">
                  <Calendar className="h-4 w-4" />
                  Book a Lesson
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <User className="h-4 w-4" />
                  Message Coach
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <BookOpen className="h-4 w-4" />
                  Practice Puzzles
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Target className="h-4 w-4" />
                  View Progress
                </Button>
              </CardContent>
            </Card>

            {/* Learning Progress */}
            <Card className="bg-white shadow-md">
              <CardHeader className="border-b">
                <CardTitle>Learning Progress</CardTitle>
                <CardDescription>
                  Your current curriculum completion
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {[
                  { label: "Opening Principles", value: 85 },
                  { label: "Tactical Patterns", value: 72 },
                  { label: "Endgame Basics", value: 45 },
                ].map((course, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm mb-2 font-medium">
                      <span>{course.label}</span>
                      <span>{course.value}%</span>
                    </div>
                    <Progress value={course.value} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Recent Assignments */}
        <Card className="bg-white shadow-md">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2 text-xl">
              <FileText className="h-5 w-5 text-primary" />
              Recent Assignments
            </CardTitle>
            <CardDescription>
              Track your homework and practice submissions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentAssignments.map((assignment) => (
              <div
                key={assignment.id}
                className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition"
              >
                <div>
                  <h4 className="font-semibold text-lg">{assignment.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    Due: {assignment.dueDate}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      assignment.status === "submitted"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {assignment.status}
                  </span>
                  <Button variant="outline" size="sm">
                    {assignment.status === "submitted" ? "View" : "Submit"}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default StudentDashboard;
