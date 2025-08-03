import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';
import heroImage from '@/assets/chess-hero.jpg';

interface HeroProps {
  onLoginClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onLoginClick }) => {

  return (
    <section id="home" className="relative min-h-screen flex items-center bg-subtle-gradient overflow-hidden">
      {/* Floating Chess Pieces Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 opacity-10 float-animation">
          <div className="text-6xl">♛</div>
        </div>
        <div className="absolute top-40 right-20 opacity-10 float-animation" style={{ animationDelay: '1s' }}>
          <div className="text-4xl">♞</div>
        </div>
        <div className="absolute bottom-40 left-20 opacity-10 float-animation" style={{ animationDelay: '2s' }}>
          <div className="text-5xl">♜</div>
        </div>
        <div className="absolute bottom-20 right-10 opacity-10 float-animation" style={{ animationDelay: '0.5s' }}>
          <div className="text-3xl">♟</div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="fade-in-up">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6">
                Master Chess with{' '}
                <span className="text-gradient">World-Class</span> Mentors
              </h1>
              
              <div className="space-y-4 mb-8">
                <p className="text-xl lg:text-2xl text-muted-foreground max-w-2xl">
                  Join the elite. Train with FIDE-rated masters and unlock your true potential.
                </p>
                <div className="flex flex-wrap gap-6 justify-center lg:justify-start text-sm text-accent font-medium">
                  <span className="flex items-center gap-2">✓ 1-on-1 Live Training</span>
                  <span className="flex items-center gap-2">✓ Personalized Learning Path</span>
                  <span className="flex items-center gap-2">✓ Real-time Game Analysis</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  size="lg"
                  onClick={onLoginClick}
                  className="btn-hero px-8 py-6 text-lg font-semibold group"
                >
                  Join as Student
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <Button
                  size="lg"
                  variant="outline"
                  onClick={onLoginClick}
                  className="btn-outline px-8 py-6 text-lg font-semibold group"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Become a Coach
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-border">
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-gradient">500+</div>
                  <div className="text-sm text-muted-foreground">FIDE Coaches</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-gradient">10K+</div>
                  <div className="text-sm text-muted-foreground">Students Trained</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-gradient">98%</div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative lg:order-2">
            <div className="relative">
              {/* Main Image */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl hover-lift">
                <img
                  src={heroImage}
                  alt="Chess Academy - Learn from FIDE Masters"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
              </div>

              {/* Floating Achievement Cards */}
              <div className="absolute -top-4 -left-4 bg-white rounded-lg shadow-lg p-4 animate-pulse">
                <div className="text-2xl mb-1">🏆</div>
                <div className="text-sm font-semibold">#1 Chess Academy</div>
              </div>

              <div className="absolute -bottom-4 -right-4 bg-accent rounded-lg shadow-lg p-4 hover-scale">
                <div className="text-2xl mb-1">⚡</div>
                <div className="text-sm font-semibold text-accent-foreground">Live Sessions</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;