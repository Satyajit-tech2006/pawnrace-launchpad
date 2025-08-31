// Features Section Component for PawnRace Chess Academy
// Showcases the key features and benefits of the platform

import React from 'react';
import { 
  Video, 
  Users, 
  Calendar, 
  BookOpen, 
  BarChart3, 
  Globe, 
  Shield, 
  Zap 
} from 'lucide-react';

import Navbar from './Navbar';
function Features() {
  // Define all platform features with icons and descriptions
  const platformFeatures = [
    {
      icon: Video,
      title: '1-on-1 Live Chess Classes',
      description: 'Personal attention from FIDE-rated coaches in interactive sessions'
    },
    {
      icon: BarChart3,
      title: 'Real-time Game Review',
      description: 'Analyze your games instantly with AI-powered insights and coach feedback'
    },
    {
      icon: Calendar,
      title: 'Schedule Flexibility',
      description: 'Book sessions that fit your schedule with 24/7 availability'
    },
    {
      icon: BookOpen,
      title: 'Interactive Assignments',
      description: 'Practice with puzzles, tactics, and custom exercises'
    },
    {
      icon: Users,
      title: 'Coach Dashboards',
      description: 'Advanced tools for coaches to track student progress'
    },
    {
      icon: Zap,
      title: 'Progress Analytics',
      description: 'Detailed insights into your chess improvement journey'
    },
    {
      icon: Shield,
      title: 'Trusted by Rated Coaches',
      description: 'Learn from verified FIDE masters and international coaches'
    },
    {
      icon: Globe,
      title: 'Global Chess Community',
      description: 'Connect with players and coaches from around the world'
    }
  ];

  return (
    <>
    <Navbar/>
    <section id="features" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-zinc-950">
            Why Choose <span className="text-gradient">PawnRace?</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience the future of chess education with cutting-edge technology 
            and world-class instruction
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {platformFeatures.map((feature, index) => (
            <div
              key={index}
              className="card-feature hover-lift group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Feature Icon */}
              <div className="mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <feature.icon className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                </div>
              </div>
              
              {/* Feature Title */}
              <h3 className="text-lg font-semibold mb-3 text-foreground">
                {feature.title}
              </h3>
              
              {/* Feature Description */}
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-2 text-accent font-semibold text-lg">
            <span>Ready to start your chess journey?</span>
            <span className="animate-pulse">♔</span>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}

export default Features;