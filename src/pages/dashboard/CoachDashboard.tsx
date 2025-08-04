import React from 'react';
import { Calendar, Users, FileText, TrendingUp, Clock, Star, DollarSign } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';

const CoachDashboard: React.FC = () => {
  const { user } = useAuth();

  const upcomingClasses = [
    {
      id: 1,
      title: 'Opening Strategies',
      student: 'Sarah Johnson',
      date: '2024-01-15',
      time: '10:00 AM',
      duration: '60 min',
      zoomLink: 'https://zoom.us/j/123456789'
    },
    {
      id: 2,
      title: 'Endgame Tactics',
      student: 'Michael Brown',
      date: '2024-01-15',
      time: '2:00 PM',
      duration: '45 min',
      zoomLink: 'https://zoom.us/j/987654321'
    },
    {
      id: 3,
      title: 'Tactical Training',
      student: 'Emma Davis',
      date: '2024-01-15',
      time: '4:00 PM',
      duration: '60 min',
      zoomLink: 'https://zoom.us/j/456789123'
    }
  ];

  const recentStudents = [
    {
      id: 1,
      name: 'Sarah Johnson',
      rating: 1245,
      progress: '+85',
      lastLesson: '2024-01-10',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah'
    },
    {
      id: 2,
      name: 'Michael Brown',
      rating: 1456,
      progress: '+120',
      lastLesson: '2024-01-12',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael'
    },
    {
      id: 3,
      name: 'Emma Davis',
      rating: 1189,
      progress: '+95',
      lastLesson: '2024-01-14',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma'
    }
  ];

  const stats = [
    { label: 'Total Students', value: '24', change: '+3', icon: Users, color: 'text-blue-600' },
    { label: 'This Month Earnings', value: '$2,450', change: '+$320', icon: DollarSign, color: 'text-green-600' },
    { label: 'Classes This Week', value: '18', change: '+2', icon: Calendar, color: 'text-purple-600' },
    { label: 'Rating Average', value: '4.8', change: '+0.2', icon: Star, color: 'text-yellow-600' }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Good morning, Coach {user?.name}! 🏆
        </h1>
        <p className="text-muted-foreground mt-2">
          You have {upcomingClasses.length} classes scheduled for today. Let's make them great!
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
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Today's Schedule */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Today's Schedule
              </CardTitle>
              <CardDescription>
                Your upcoming classes for today
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingClasses.map((lesson) => (
                <div key={lesson.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover-lift">
                  <div className="space-y-1">
                    <h4 className="font-semibold text-foreground">{lesson.title}</h4>
                    <p className="text-sm text-muted-foreground">with {lesson.student}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        🕐 {lesson.time}
                      </span>
                      <span className="flex items-center gap-1">
                        ⏱️ {lesson.duration}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Reschedule
                    </Button>
                    <Button 
                      onClick={() => window.open(lesson.zoomLink, '_blank')}
                      className="btn-hero"
                      size="sm"
                    >
                      Start Class
                    </Button>
                  </div>
                </div>
              ))}
              
              <div className="pt-4 border-t border-border">
                <Button className="w-full btn-outline">
                  View Full Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Students */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full btn-hero justify-start gap-2">
                <Calendar className="h-4 w-4" />
                Create New Class
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <FileText className="h-4 w-4" />
                Assign Homework
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Users className="h-4 w-4" />
                Message Students
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <TrendingUp className="h-4 w-4" />
                View Analytics
              </Button>
            </CardContent>
          </Card>

          {/* Recent Students */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Students</CardTitle>
              <CardDescription>Students you've worked with recently</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentStudents.map((student) => (
                <div key={student.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover-lift">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={student.avatar} alt={student.name} />
                    <AvatarFallback>{student.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{student.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Rating: {student.rating}</span>
                      <span className="text-green-600">{student.progress}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              ))}
              
              <Button variant="outline" className="w-full mt-4">
                View All Students
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Performance Overview
          </CardTitle>
          <CardDescription>
            Your teaching statistics for this month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-primary mb-2">96%</div>
              <div className="text-sm text-muted-foreground">Student Satisfaction</div>
            </div>
            <div className="text-center p-6 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-primary mb-2">142</div>
              <div className="text-sm text-muted-foreground">Total Classes Taught</div>
            </div>
            <div className="text-center p-6 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-primary mb-2">+187</div>
              <div className="text-sm text-muted-foreground">Avg. Rating Improvement</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoachDashboard;