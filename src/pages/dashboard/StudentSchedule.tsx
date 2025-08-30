import React, { useState } from "react";
import { Calendar, Clock, Video, User, Plus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DashboardNavbar from "../../components/Dashbordnavbar";

const StudentSchedule: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const upcomingClasses = [
    {
      id: 1,
      title: "Opening Principles & King Safety",
      coach: "GM Alexandra Petrov",
      date: "2024-01-15",
      time: "10:00 AM - 11:00 AM",
      type: "Private Lesson",
      status: "confirmed",
      zoomLink: "https://zoom.us/j/123456789",
      description:
        "Focus on controlling the center and developing pieces efficiently",
    },
    {
      id: 2,
      title: "Tactical Patterns Workshop",
      coach: "IM Michael Chen",
      date: "2024-01-16",
      time: "2:00 PM - 3:00 PM",
      type: "Group Session",
      status: "confirmed",
      zoomLink: "https://zoom.us/j/987654321",
      description: "Learn common tactical motifs: pins, forks, skewers",
    },
    {
      id: 3,
      title: "Endgame Fundamentals",
      coach: "GM Alexandra Petrov",
      date: "2024-01-18",
      time: "4:00 PM - 5:00 PM",
      type: "Private Lesson",
      status: "pending",
      zoomLink: "https://zoom.us/j/456789123",
      description: "King and pawn endgames - essential techniques",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeColor = (type: string) => {
    return type === "Private Lesson"
      ? "bg-blue-100 text-blue-800 border-blue-200"
      : "bg-purple-100 text-purple-800 border-purple-200";
  };

  return (
    <>
      <DashboardNavbar />

      {/* Added spacing & container */}
      <div className="max-w-6xl mx-auto px-6 mt-8 space-y-6 pt-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-11">
          <div>
            <h1 className="text-3xl font-bold text-foreground">📅 My Schedule</h1>
            <p className="text-muted-foreground mt-1">
              Manage your chess lessons and practice sessions
            </p>
          </div>
          <Button className="bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg hover:scale-105 transition">
            <Plus className="h-4 w-4 mr-2" />
            Request Lesson
          </Button>
        </div>

        {/* Date Filter */}
        <Card className="shadow-md hover:shadow-lg transition">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Filter by Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border border-border rounded-md bg-background focus:ring-2 focus:ring-primary"
            />
          </CardContent>
        </Card>

        {/* Upcoming Classes */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Upcoming Classes</CardTitle>
            <CardDescription>
              Your scheduled lessons and workshops
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingClasses.map((lesson) => (
              <div
                key={lesson.id}
                className="border border-border rounded-lg p-6 bg-card shadow-sm hover:shadow-md transition"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold text-foreground">
                        {lesson.title}
                      </h3>
                      <Badge className={getStatusColor(lesson.status)}>
                        {lesson.status}
                      </Badge>
                      <Badge className={getTypeColor(lesson.type)}>
                        {lesson.type}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>with {lesson.coach}</span>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{lesson.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{lesson.time}</span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {lesson.description}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button variant="outline" size="sm">
                      Reschedule
                    </Button>
                    <Button
                      onClick={() => window.open(lesson.zoomLink, "_blank")}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md hover:scale-105 transition"
                      size="sm"
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Join Class
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold mb-2">12</div>
              <div className="text-sm">Classes This Month</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold mb-2">3</div>
              <div className="text-sm">Upcoming This Week</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold mb-2">48h</div>
              <div className="text-sm">Total Study Time</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default StudentSchedule;
