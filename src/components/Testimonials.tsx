import React from 'react';
import { Star, Quote } from 'lucide-react';

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Alex Thompson',
      role: 'Student, Age 16',
      content: 'PawnRace helped me improve my rating from 1200 to 1800 in just 6 months. The personalized coaching and interactive lessons made all the difference.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 2,
      name: 'Maria Garcia',
      role: 'Parent',
      content: 'My daughter loves her weekly sessions with GM Petrov. The platform is safe, educational, and has truly sparked her passion for chess.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 3,
      name: 'David Kim',
      role: 'Adult Student',
      content: 'As a working professional, the flexible scheduling was perfect. I finally broke through my plateau and achieved my goal of 2000 rating.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 4,
      name: 'Sophie Wilson',
      role: 'Student, Age 12',
      content: 'The lessons are fun and easy to understand. I won my first tournament last month thanks to what I learned on PawnRace!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating 
            ? 'fill-accent text-accent' 
            : 'text-muted-foreground'
        }`}
      />
    ));
  };

  return (
    <section id="testimonials" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            What Our Students <span className="text-gradient">Say</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real stories from real students who transformed their chess game with PawnRace
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="card-elegant group hover-lift"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Quote Icon */}
              <div className="mb-4">
                <Quote className="h-8 w-8 text-primary/20 group-hover:text-primary/40 transition-colors duration-300" />
              </div>

              {/* Content */}
              <div className="space-y-4">
                <p className="text-muted-foreground italic leading-relaxed">
                  "{testimonial.content}"
                </p>

                {/* Rating */}
                <div className="flex space-x-1">
                  {renderStars(testimonial.rating)}
                </div>

                {/* Author Info */}
                <div className="flex items-center space-x-4 pt-4 border-t border-border">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 pt-16 border-t border-border">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-gradient mb-2">4.9/5</div>
              <div className="text-muted-foreground">Average Rating</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gradient mb-2">10,000+</div>
              <div className="text-muted-foreground">Happy Students</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gradient mb-2">50,000+</div>
              <div className="text-muted-foreground">Lessons Completed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gradient mb-2">98%</div>
              <div className="text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;