import React, { useState } from 'react';
import { User, Search, Filter, Mail, Phone, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

const CoachStudents: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const students = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+1 (555) 123-4567',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
      currentRating: 1245,
      startingRating: 1100,
      level: 'Intermediate',
      classesCompleted: 24,
      nextClass: '2024-01-15 10:00 AM',
      progress: {
        opening: 85,
        tactics: 72,
        endgame: 45,
        strategy: 60
      },
      notes: 'Strong tactical vision, needs work on endgame fundamentals'
    },
    {
      id: 2,
      name: 'Michael Brown',
      email: 'michael.b@email.com',
      phone: '+1 (555) 234-5678',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael',
      currentRating: 1456,
      startingRating: 1300,
      level: 'Advanced',
      classesCompleted: 18,
      nextClass: '2024-01-16 2:00 PM',
      progress: {
        opening: 90,
        tactics: 85,
        endgame: 70,
        strategy: 88
      },
      notes: 'Excellent student, ready for tournament play'
    },
    {
      id: 3,
      name: 'Emma Davis',
      email: 'emma.d@email.com',
      phone: '+1 (555) 345-6789',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
      currentRating: 1189,
      startingRating: 1000,
      level: 'Beginner',
      classesCompleted: 12,
      nextClass: '2024-01-18 4:00 PM',
      progress: {
        opening: 65,
        tactics: 58,
        endgame: 40,
        strategy: 45
      },
      notes: 'Quick learner, good pattern recognition'
    },
    {
      id: 4,
      name: 'Alex Thompson',
      email: 'alex.t@email.com',
      phone: '+1 (555) 456-7890',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
      currentRating: 1623,
      startingRating: 1400,
      level: 'Advanced',
      classesCompleted: 32,
      nextClass: '2024-01-17 11:00 AM',
      progress: {
        opening: 95,
        tactics: 92,
        endgame: 88,
        strategy: 90
      },
      notes: 'Preparing for national tournament'
    }
  ];

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'Intermediate': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Advanced': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Students</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track your students' progress
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button className="btn-hero">
            <User className="h-4 w-4 mr-2" />
            Add Student
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search students by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Students Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-primary mb-2">{students.length}</div>
            <div className="text-sm text-muted-foreground">Total Students</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-primary mb-2">+187</div>
            <div className="text-sm text-muted-foreground">Avg Rating Gain</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-primary mb-2">86</div>
            <div className="text-sm text-muted-foreground">Total Classes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-primary mb-2">96%</div>
            <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Students List */}
      <div className="grid gap-6">
        {filteredStudents.map((student) => (
          <Card key={student.id} className="hover-lift">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Student Info */}
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={student.avatar} alt={student.name} />
                    <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-foreground">{student.name}</h3>
                      <Badge className={getLevelColor(student.level)}>
                        {student.level}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span>{student.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>{student.phone}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{student.notes}</p>
                  </div>
                </div>

                {/* Rating Progress */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Rating Progress</span>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-600 font-medium">
                        +{student.currentRating - student.startingRating}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Opening</span>
                        <span>{student.progress.opening}%</span>
                      </div>
                      <Progress value={student.progress.opening} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Tactics</span>
                        <span>{student.progress.tactics}%</span>
                      </div>
                      <Progress value={student.progress.tactics} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Endgame</span>
                        <span>{student.progress.endgame}%</span>
                      </div>
                      <Progress value={student.progress.endgame} className="h-2" />
                    </div>
                  </div>
                </div>

                {/* Stats & Actions */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="text-lg font-bold text-primary">{student.currentRating}</div>
                      <div className="text-xs text-muted-foreground">Current Rating</div>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="text-lg font-bold text-primary">{student.classesCompleted}</div>
                      <div className="text-xs text-muted-foreground">Classes Done</div>
                    </div>
                  </div>
                  
                  <div className="text-center text-sm text-muted-foreground">
                    Next Class: {student.nextClass}
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button className="btn-hero" size="sm">
                      Schedule Class
                    </Button>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CoachStudents;