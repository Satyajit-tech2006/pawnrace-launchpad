import React, { useState } from 'react';
import { FileText, Clock, CheckCircle, Upload, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const StudentAssignments: React.FC = () => {
  const assignments = [
    {
      id: 1,
      title: 'Analyze Kasparov vs Karpov Game',
      description: 'Study the famous World Championship game and identify key strategic concepts',
      dueDate: '2024-01-20',
      status: 'pending',
      type: 'Analysis',
      coach: 'GM Alexandra Petrov',
      points: 25,
      attachments: ['kasparov_karpov_1984.pgn']
    },
    {
      id: 2,
      title: 'Tactical Puzzles Set #5',
      description: 'Solve 20 tactical puzzles focusing on knight forks and pins',
      dueDate: '2024-01-18',
      status: 'submitted',
      type: 'Practice',
      coach: 'IM Michael Chen',
      points: 15,
      submissionDate: '2024-01-17',
      grade: 'A-'
    },
    {
      id: 3,
      title: 'Opening Repertoire Report',
      description: 'Prepare a 3-page report on your chosen opening system',
      dueDate: '2024-01-25',
      status: 'in_progress',
      type: 'Report',
      coach: 'GM Alexandra Petrov',
      points: 35
    },
    {
      id: 4,
      title: 'Endgame Study Collection',
      description: 'Complete the provided endgame studies and explain solutions',
      dueDate: '2024-01-22',
      status: 'graded',
      type: 'Study',
      coach: 'IM Michael Chen',
      points: 20,
      submissionDate: '2024-01-19',
      grade: 'B+',
      feedback: 'Good understanding of basic concepts. Work on calculation depth.'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'submitted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_progress': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'graded': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'Analysis': 'bg-purple-100 text-purple-800 border-purple-200',
      'Practice': 'bg-blue-100 text-blue-800 border-blue-200',
      'Report': 'bg-green-100 text-green-800 border-green-200',
      'Study': 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const pendingAssignments = assignments.filter(a => a.status === 'pending' || a.status === 'in_progress');
  const submittedAssignments = assignments.filter(a => a.status === 'submitted');
  const gradedAssignments = assignments.filter(a => a.status === 'graded');

  const AssignmentCard = ({ assignment }: { assignment: any }) => (
    <Card className="hover-lift">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold text-foreground">{assignment.title}</h3>
              <Badge className={getStatusColor(assignment.status)}>
                {assignment.status.replace('_', ' ')}
              </Badge>
              <Badge className={getTypeColor(assignment.type)}>
                {assignment.type}
              </Badge>
            </div>
            
            <p className="text-muted-foreground">{assignment.description}</p>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Coach: {assignment.coach}</span>
              <span>Points: {assignment.points}</span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Due: {assignment.dueDate}
              </span>
            </div>
            
            {assignment.attachments && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Attachments:</span>
                {assignment.attachments.map((file: string, index: number) => (
                  <Button key={index} variant="outline" size="sm">
                    <Download className="h-3 w-3 mr-1" />
                    {file}
                  </Button>
                ))}
              </div>
            )}
            
            {assignment.feedback && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium text-foreground mb-1">Feedback:</p>
                <p className="text-sm text-muted-foreground">{assignment.feedback}</p>
              </div>
            )}
          </div>
          
          <div className="flex flex-col gap-2">
            {assignment.grade && (
              <div className="text-center p-2 bg-green-100 rounded-lg">
                <div className="text-lg font-bold text-green-800">{assignment.grade}</div>
              </div>
            )}
            
            {assignment.status === 'pending' || assignment.status === 'in_progress' ? (
              <Button className="btn-hero">
                <Upload className="h-4 w-4 mr-2" />
                Submit Work
              </Button>
            ) : (
              <Button variant="outline">
                View Submission
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Assignments</h1>
        <p className="text-muted-foreground mt-1">
          Track your homework and practice assignments
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-orange-600 mb-2">{pendingAssignments.length}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">{submittedAssignments.length}</div>
            <div className="text-sm text-muted-foreground">Submitted</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">{gradedAssignments.length}</div>
            <div className="text-sm text-muted-foreground">Graded</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-primary mb-2">85%</div>
            <div className="text-sm text-muted-foreground">Avg Grade</div>
          </CardContent>
        </Card>
      </div>

      {/* Assignments Tabs */}
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">Pending ({pendingAssignments.length})</TabsTrigger>
          <TabsTrigger value="submitted">Submitted ({submittedAssignments.length})</TabsTrigger>
          <TabsTrigger value="graded">Graded ({gradedAssignments.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="space-y-4 mt-6">
          {pendingAssignments.length > 0 ? (
            pendingAssignments.map((assignment) => (
              <AssignmentCard key={assignment.id} assignment={assignment} />
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-muted-foreground">No pending assignments</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="submitted" className="space-y-4 mt-6">
          {submittedAssignments.map((assignment) => (
            <AssignmentCard key={assignment.id} assignment={assignment} />
          ))}
        </TabsContent>
        
        <TabsContent value="graded" className="space-y-4 mt-6">
          {gradedAssignments.map((assignment) => (
            <AssignmentCard key={assignment.id} assignment={assignment} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentAssignments;