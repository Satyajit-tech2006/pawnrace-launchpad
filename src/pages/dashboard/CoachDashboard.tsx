import React from "react";
import {
  Calendar,
  Users,
  FileText,
  TrendingUp,
  Star,
  DollarSign,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import DashboardNavbar from "../../components/Dashbordnavbar";

const CoachDashboard: React.FC = () => {
  const { user } = useAuth();

  const upcomingClasses = [
    {
      id: 1,
      title: "Opening Strategies",
      student: "Sarah Johnson",
      date: "2024-01-15",
      time: "10:00 AM",
      duration: "60 min",
      zoomLink: "https://zoom.us/j/123456789",
    },
    {
      id: 2,
      title: "Endgame Tactics",
      student: "Michael Brown",
      date: "2024-01-15",
      time: "2:00 PM",
      duration: "45 min",
      zoomLink: "https://zoom.us/j/987654321",
    },
    {
      id: 3,
      title: "Tactical Training",
      student: "Emma Davis",
      date: "2024-01-15",
      time: "4:00 PM",
      duration: "60 min",
      zoomLink: "https://zoom.us/j/456789123",
    },
  ];

  const recentStudents = [
    {
      id: 1,
      name: "Sarah Johnson",
      rating: 1245,
      progress: "+85",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    },
    {
      id: 2,
      name: "Michael Brown",
      rating: 1456,
      progress: "+120",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
    },
    {
      id: 3,
      name: "Emma Davis",
      rating: 1189,
      progress: "+95",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
    },
  ];

  const stats = [
    {
      label: "Total Students",
      value: "24",
      change: "+3",
      icon: Users,
      color: "text-blue-600",
    },
    {
      label: "This Month Earnings",
      value: "$2,450",
      change: "+$320",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      label: "Classes This Week",
      value: "18",
      change: "+2",
      icon: Calendar,
      color: "text-purple-600",
    },
    {
      label: "Rating Average",
      value: "4.8",
      change: "+0.2",
      icon: Star,
      color: "text-yellow-600",
    },
  ];

  return (
    <>
      <DashboardNavbar />
      <div className="px-6 md:px-12 py-10 space-y-10 ">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Good morning, Coach {user?.name}! 🏆
          </h1>
          <p className="text-muted-foreground mt-2">
            You have{" "}
            <span className="font-semibold">{upcomingClasses.length}</span>{" "}
            classes scheduled today.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <Card
              key={i}
              className="hover:shadow-lg transition-shadow rounded-2xl"
            >
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-green-600">{stat.change}</p>
                </div>
                <div className="bg-primary/10 p-3 rounded-xl">
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Today's Schedule */}
          <Card className="lg:col-span-2 rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" /> Today’s Schedule
              </CardTitle>
              <CardDescription>Your upcoming classes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingClasses.map((lesson) => (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-xl hover:shadow-md transition"
                >
                  <div className="space-y-1">
                    <h4 className="font-semibold">{lesson.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      with {lesson.student}
                    </p>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span>🕐 {lesson.time}</span>
                      <span>⏱️ {lesson.duration}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Reschedule
                    </Button>
                    <Button
                      size="sm"
                      className="btn-hero"
                      onClick={() => window.open(lesson.zoomLink, "_blank")}
                    >
                      Start Class
                    </Button>
                  </div>
                </div>
              ))}
              <div className="pt-4 border-t">
                <Button variant="outline" className="w-full">
                  View Full Schedule
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions + Students */}
          <div className="space-y-6">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full btn-hero gap-2">
                  <Calendar className="h-4 w-4" /> Create New Class
                </Button>
                <Button variant="outline" className="w-full gap-2">
                  <FileText className="h-4 w-4" /> Assign Homework
                </Button>
                <Button variant="outline" className="w-full gap-2">
                  <Users className="h-4 w-4" /> Message Students
                </Button>
                <Button variant="outline" className="w-full gap-2">
                  <TrendingUp className="h-4 w-4" /> View Analytics
                </Button>
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Recent Students</CardTitle>
                <CardDescription>Students you’ve worked with</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentStudents.map((stu) => (
                  <div
                    key={stu.id}
                    className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:shadow-sm"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={stu.avatar} alt={stu.name} />
                      <AvatarFallback>{stu.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{stu.name}</p>
                      <div className="flex gap-2 text-xs text-muted-foreground">
                        <span>Rating: {stu.rating}</span>
                        <span className="text-green-600">{stu.progress}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-2">
                  View All Students
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Performance */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" /> Performance Overview
            </CardTitle>
            <CardDescription>Your teaching stats this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-muted/30 rounded-xl text-center">
                <p className="text-2xl font-bold text-primary">96%</p>
                <p className="text-sm text-muted-foreground">
                  Student Satisfaction
                </p>
              </div>
              <div className="p-6 bg-muted/30 rounded-xl text-center">
                <p className="text-2xl font-bold text-primary">142</p>
                <p className="text-sm text-muted-foreground">
                  Total Classes Taught
                </p>
              </div>
              <div className="p-6 bg-muted/30 rounded-xl text-center">
                <p className="text-2xl font-bold text-primary">+187</p>
                <p className="text-sm text-muted-foreground">
                  Avg. Rating Improvement
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default CoachDashboard;
