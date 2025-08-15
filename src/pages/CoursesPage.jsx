// Chess Courses Page - Interactive course catalog
import React, { useState } from 'react';
import { ChevronRight, Clock, Users, Star, Trophy, Play, BookOpen, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';

function CoursesPage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState('all');

  // Course data with different difficulty levels
  const courses = [
    {
      id: 1,
      title: "Chess Fundamentals",
      description: "Master the basics of chess with our comprehensive beginner course",
      level: "beginner",
      duration: "4 weeks",
      lessons: 16,
      students: 1200,
      rating: 4.9,
      price: "$49",
      image: "🏁",
      highlights: ["Piece movement", "Basic tactics", "Opening principles", "Endgame basics"]
    },
    {
      id: 2,
      title: "Tactical Mastery",
      description: "Sharpen your tactical vision with thousands of puzzles and patterns",
      level: "intermediate",
      duration: "6 weeks",
      lessons: 24,
      students: 850,
      rating: 4.8,
      price: "$79",
      image: "⚔️",
      highlights: ["Pattern recognition", "Combination play", "Tactical themes", "Puzzle solving"]
    },
    {
      id: 3,
      title: "Strategic Planning",
      description: "Learn to think like a grandmaster with advanced strategic concepts",
      level: "advanced",
      duration: "8 weeks",
      lessons: 32,
      students: 650,
      rating: 4.9,
      price: "$119",
      image: "🧠",
      highlights: ["Positional play", "Pawn structures", "Piece coordination", "Long-term planning"]
    },
    {
      id: 4,
      title: "Opening Repertoire",
      description: "Build a solid opening repertoire for both white and black pieces",
      level: "intermediate",
      duration: "10 weeks",
      lessons: 40,
      students: 950,
      rating: 4.7,
      price: "$99",
      image: "📚",
      highlights: ["Opening theory", "Repertoire building", "Transpositions", "Middle game plans"]
    },
    {
      id: 5,
      title: "Endgame Excellence",
      description: "Master the most important endgame positions and techniques",
      level: "advanced",
      duration: "6 weeks",
      lessons: 28,
      students: 720,
      rating: 4.8,
      price: "$89",
      image: "👑",
      highlights: ["King and pawn endings", "Rook endgames", "Minor piece endings", "Practical technique"]
    },
    {
      id: 6,
      title: "Speed Chess Training",
      description: "Improve your rapid and blitz play with time management techniques",
      level: "intermediate",
      duration: "4 weeks",
      lessons: 20,
      students: 1100,
      rating: 4.6,
      price: "$59",
      image: "⚡",
      highlights: ["Time management", "Quick calculation", "Intuitive play", "Blitz tactics"]
    }
  ];

  const levelColors = {
    beginner: "bg-green-100 text-green-800 border-green-200",
    intermediate: "bg-blue-100 text-blue-800 border-blue-200", 
    advanced: "bg-purple-100 text-purple-800 border-purple-200"
  };

  const filteredCourses = selectedLevel === 'all' 
    ? courses 
    : courses.filter(course => course.level === selectedLevel);

  const handleEnrollClick = () => {
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <Navbar onLoginClick={() => setShowAuthModal(true)} />
      
      {/* Hero Section */}
      <section className="pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <BookOpen className="h-16 w-16 text-primary animate-bounce" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Master Chess with Expert Courses
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              From beginner fundamentals to grandmaster strategies, our comprehensive courses 
              will elevate your chess game to new heights.
            </p>
            
            {/* Level Filter */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Button
                variant={selectedLevel === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedLevel('all')}
                className="hover-scale"
              >
                All Courses
              </Button>
              <Button
                variant={selectedLevel === 'beginner' ? 'default' : 'outline'}
                onClick={() => setSelectedLevel('beginner')}
                className="hover-scale"
              >
                Beginner
              </Button>
              <Button
                variant={selectedLevel === 'intermediate' ? 'default' : 'outline'}
                onClick={() => setSelectedLevel('intermediate')}
                className="hover-scale"
              >
                Intermediate
              </Button>
              <Button
                variant={selectedLevel === 'advanced' ? 'default' : 'outline'}
                onClick={() => setSelectedLevel('advanced')}
                className="hover-scale"
              >
                Advanced
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/20">
                <CardHeader className="text-center">
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {course.image}
                  </div>
                  <div className="flex justify-center mb-2">
                    <Badge className={levelColors[course.level]}>
                      {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {course.title}
                  </CardTitle>
                  <p className="text-muted-foreground text-sm">
                    {course.description}
                  </p>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Course Stats */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <span>{course.lessons} lessons</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      <span>{course.students} students</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span>{course.rating}</span>
                    </div>
                  </div>
                  
                  {/* Course Highlights */}
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Target className="h-4 w-4 text-primary" />
                      What you'll learn:
                    </h4>
                    <ul className="text-sm space-y-1">
                      {course.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <ChevronRight className="h-3 w-3 text-primary" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Price and Enroll */}
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-primary">{course.price}</span>
                      <Badge variant="secondary">Limited Time</Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <Button 
                        className="w-full btn-hero group"
                        onClick={handleEnrollClick}
                      >
                        <Play className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />
                        Enroll Now
                      </Button>
                      <Button variant="outline" className="w-full">
                        Preview Course
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto max-w-4xl text-center px-4">
          <Trophy className="h-16 w-16 text-primary mx-auto mb-6 animate-pulse" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Become a Chess Master?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of students who have improved their chess skills with our expert-designed courses. 
            Start your journey to chess mastery today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="btn-hero"
              onClick={handleEnrollClick}
            >
              Start Learning Today
            </Button>
            <Button size="lg" variant="outline">
              Talk to an Advisor
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  );
}

export default CoursesPage;