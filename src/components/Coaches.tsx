import React from 'react';
import { Button } from '@/components/ui/button';
import { Star, Users, Trophy } from 'lucide-react';

const Coaches: React.FC = () => {
  const coaches = [
    {
      id: 1,
      name: 'GM Alexander Petrov',
      rating: 2680,
      title: 'Grandmaster',
      speciality: 'Opening Theory',
      students: 250,
      experience: '15 years',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 2,
      name: 'IM Sarah Chen',
      rating: 2520,
      title: 'International Master',
      speciality: 'Endgame Mastery',
      students: 180,
      experience: '12 years',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 3,
      name: 'GM Viktor Kozlov',
      rating: 2720,
      title: 'Grandmaster',
      speciality: 'Tactical Training',
      students: 320,
      experience: '20 years',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 4,
      name: 'WIM Elena Rodriguez',
      rating: 2480,
      title: 'Women\'s International Master',
      speciality: 'Positional Play',
      students: 195,
      experience: '10 years',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    }
  ];

  return (
    <section id="mentors" className="py-20 bg-subtle-gradient">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Meet Our <span className="text-gradient">Master Coaches</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Learn from FIDE-rated professionals who have trained champions and 
            mastered the art of chess education
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {coaches.map((coach, index) => (
            <div
              key={coach.id}
              className="card-elegant hover-lift group text-center"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Avatar */}
              <div className="relative mb-6">
                <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-primary/20 group-hover:border-primary/50 transition-all duration-300">
                  <img
                    src={coach.avatar}
                    alt={coach.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <div className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-bold">
                    {coach.rating}
                  </div>
                </div>
              </div>

              {/* Coach Info */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {coach.name}
                  </h3>
                  <p className="text-primary font-medium text-sm">
                    {coach.title}
                  </p>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center justify-center space-x-1">
                    <Trophy className="h-4 w-4" />
                    <span>{coach.speciality}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{coach.students} students</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <Star className="h-4 w-4 fill-accent text-accent" />
                    <span>{coach.experience} experience</span>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full btn-outline group-hover:btn-hero transition-all duration-300"
                >
                  View Profile
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* See All Mentors CTA */}
        <div className="text-center">
          <Button size="lg" className="btn-hero px-8">
            See All Mentors
          </Button>
          <p className="mt-4 text-muted-foreground">
            Over 500+ certified coaches available worldwide
          </p>
        </div>
      </div>
    </section>
  );
};

export default Coaches;