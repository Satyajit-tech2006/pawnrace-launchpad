import React from 'react';
import { Calendar, Clock, User, BookOpen, Target, TrendingUp, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();

  const upcomingClasses = [
    {
      id: 1,
      title: 'Opening Strategies',
      coach: 'GM Alexandra Petrov',
      date: '2024-01-15',
      time: '10:00 AM',
      zoomLink: 'https://zoom.us/j/123456789'
    },
    {
      id: 2,
      title: 'Endgame Tactics',
      coach: 'IM Michael Chen',
      date: '2024-01-16',
      time: '2:00 PM',
      zoomLink: 'https://zoom.us/j/987654321'
    }
  ];

  const recentAssignments = [
    {
      id: 1,
      title: 'King and Pawn Endgames',
      dueDate: '2024-01-20',
      status: 'pending'
    },
    {
      id: 2,
      title: 'Tactical Puzzles Set 5',
      dueDate: '2024-01-18',
      status: 'submitted'
    }
  ];

  const stats = [
    { label: 'Current Rating', value: '1245', change: '+45', icon: TrendingUp },
    { label: 'Classes Completed', value: '24', change: '+3', icon: BookOpen },
    { label: 'Puzzles Solved', value: '156', change: '+12', icon: Target },
    { label: 'Study Hours', value: '48h', change: '+6h', icon: Clock }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-muted-foreground mt-2">
          Ready to continue your chess journey? Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-green-600">{stat.change}</p>
                </div>
                <div className="bg-primary/10 p-3 rounded-lg">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Upcoming Classes */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Classes
              </CardTitle>
              <CardDescription>
                Your next scheduled lessons with coaches
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingClasses.map((lesson) => (
                <div key={lesson.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="space-y-1">
                    <h4 className="font-semibold text-foreground">{lesson.title}</h4>
                    <p className="text-sm text-muted-foreground">with {lesson.coach}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>📅 {lesson.date}</span>
                      <span>🕐 {lesson.time}</span>
                    </div>
                  </div>
                  <Button 
                    onClick={() => window.open(lesson.zoomLink, '_blank')}
                    className="btn-hero"
                  >
                    Join Class
                  </Button>
                </div>
              ))}
              
              {upcomingClasses.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No upcoming classes scheduled</p>
                  <Button className="mt-4 btn-outline">Schedule a Lesson</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Progress */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
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
          <Card>
            <CardHeader>
              <CardTitle>Learning Progress</CardTitle>
              <CardDescription>Current curriculum completion</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Opening Principles</span>
                  <span>85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Tactical Patterns</span>
                  <span>72%</span>
                </div>
                <Progress value={72} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Endgame Basics</span>
                  <span>45%</span>
                </div>
                <Progress value={45} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Assignments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Recent Assignments
          </CardTitle>
          <CardDescription>
            Track your homework and practice assignments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentAssignments.map((assignment) => (
              <div key={assignment.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <h4 className="font-semibold text-foreground">{assignment.title}</h4>
                  <p className="text-sm text-muted-foreground">Due: {assignment.dueDate}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    assignment.status === 'submitted' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {assignment.status}
                  </span>
                  <Button variant="outline" size="sm">
                    {assignment.status === 'submitted' ? 'View' : 'Submit'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;