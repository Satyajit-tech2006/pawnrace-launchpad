import React, { useState } from 'react';
import { Calendar, Clock, Video, User, Plus, Edit } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const CoachSchedule: React.FC = () => {
  const [isCreateClassOpen, setIsCreateClassOpen] = useState(false);

  const todaysClasses = [
    {
      id: 1,
      title: 'Opening Principles Workshop',
      student: 'Sarah Johnson',
      time: '10:00 AM - 11:00 AM',
      type: 'Private Lesson',
      status: 'upcoming',
      zoomLink: 'https://zoom.us/j/123456789',
      notes: 'Focus on center control and piece development'
    },
    {
      id: 2,
      title: 'Tactical Training Session',
      student: 'Michael Brown',
      time: '2:00 PM - 3:00 PM',
      type: 'Private Lesson',
      status: 'upcoming',
      zoomLink: 'https://zoom.us/j/987654321',
      notes: 'Work on knight fork patterns'
    },
    {
      id: 3,
      title: 'Endgame Fundamentals',
      student: 'Emma Davis',
      time: '4:00 PM - 5:00 PM',
      type: 'Private Lesson',
      status: 'completed',
      zoomLink: 'https://zoom.us/j/456789123',
      notes: 'King and pawn endgames covered'
    }
  ];

  const upcomingClasses = [
    {
      id: 4,
      title: 'Strategic Planning',
      student: 'Alex Thompson',
      date: '2024-01-16',
      time: '11:00 AM - 12:00 PM',
      type: 'Private Lesson',
      status: 'scheduled'
    },
    {
      id: 5,
      title: 'Group Tactics Workshop',
      students: ['Sarah Johnson', 'Michael Brown', 'Emma Davis'],
      date: '2024-01-17',
      time: '3:00 PM - 4:30 PM',
      type: 'Group Session',
      status: 'scheduled'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'scheduled': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Schedule Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage your classes and student sessions
          </p>
        </div>
        
        <Dialog open={isCreateClassOpen} onOpenChange={setIsCreateClassOpen}>
          <DialogTrigger asChild>
            <Button className="btn-hero">
              <Plus className="h-4 w-4 mr-2" />
              Create New Class
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Class</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Class Title</Label>
                <Input id="title" placeholder="e.g., Opening Principles" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" />
                </div>
                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input id="time" type="time" />
                </div>
              </div>
              <div>
                <Label htmlFor="zoomLink">Zoom/Meet Link</Label>
                <Input id="zoomLink" placeholder="https://zoom.us/j/..." />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" placeholder="Class objectives and notes..." />
              </div>
              <Button onClick={() => setIsCreateClassOpen(false)} className="w-full btn-hero">
                Create Class
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Today's Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Today's Classes
          </CardTitle>
          <CardDescription>
            Your schedule for today - {new Date().toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {todaysClasses.map((classItem) => (
            <div key={classItem.id} className="border border-border rounded-lg p-4 hover-lift">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{classItem.title}</h3>
                    <Badge className={getStatusColor(classItem.status)}>
                      {classItem.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>{classItem.student}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{classItem.time}</span>
                  </div>
                  
                  {classItem.notes && (
                    <p className="text-sm text-muted-foreground">{classItem.notes}</p>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  {classItem.status === 'upcoming' && (
                    <Button 
                      onClick={() => window.open(classItem.zoomLink, '_blank')}
                      className="btn-hero"
                      size="sm"
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Start Class
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Upcoming Classes */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Classes</CardTitle>
          <CardDescription>
            Classes scheduled for the next few days
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {upcomingClasses.map((classItem) => (
            <div key={classItem.id} className="border border-border rounded-lg p-4 hover-lift">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{classItem.title}</h3>
                    <Badge className={getStatusColor(classItem.status)}>
                      {classItem.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>
                      {'student' in classItem 
                        ? classItem.student 
                        : `${classItem.students.length} students`
                      }
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>📅 {classItem.date}</span>
                    <span>🕐 {classItem.time}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Reschedule
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-primary mb-2">8</div>
            <div className="text-sm text-muted-foreground">Classes This Week</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-primary mb-2">24</div>
            <div className="text-sm text-muted-foreground">Active Students</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-primary mb-2">96%</div>
            <div className="text-sm text-muted-foreground">Attendance Rate</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-primary mb-2">4.8</div>
            <div className="text-sm text-muted-foreground">Average Rating</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CoachSchedule;