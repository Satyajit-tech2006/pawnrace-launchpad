import React from 'react';
import { UserPlus, Search, Calendar, Play, BarChart, Trophy } from 'lucide-react';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: UserPlus,
      step: '01',
      title: 'Sign Up & Assessment',
      description: 'Create your account and complete a quick chess assessment to determine your current skill level.',
      color: 'bg-primary'
    },
    {
      icon: Search,
      step: '02', 
      title: 'Find Your Coach',
      description: 'Browse our FIDE-rated coaches and select the perfect mentor based on expertise and availability.',
      color: 'bg-accent'
    },
    {
      icon: Calendar,
      step: '03',
      title: 'Schedule Sessions',
      description: 'Book flexible 1-on-1 lessons that fit your schedule across any time zone.',
      color: 'bg-primary'
    },
    {
      icon: Play,
      step: '04',
      title: 'Learn & Practice',
      description: 'Attend live sessions, receive personalized assignments, and practice with guided exercises.',
      color: 'bg-accent'
    },
    {
      icon: BarChart,
      step: '05',
      title: 'Track Progress',
      description: 'Monitor your improvement with detailed analytics and performance tracking.',
      color: 'bg-primary'
    },
    {
      icon: Trophy,
      step: '06',
      title: 'Master Chess',
      description: 'Achieve your chess goals with consistent coaching and structured learning paths.',
      color: 'bg-accent'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            How <span className="text-gradient">PawnRace</span> Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Your journey to chess mastery simplified into 6 easy steps. 
            From beginner to advanced, we guide you every move of the way.
          </p>
        </div>

        <div className="relative">
          {/* Connection Lines */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-accent to-primary opacity-30 -translate-y-1/2"></div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className="relative group hover-lift"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Step Card */}
                <div className="bg-card border border-border rounded-2xl p-8 text-center relative z-10 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  {/* Step Number */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className={`${step.color} text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg`}>
                      {step.step}
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="mb-6 mt-4">
                    <div className={`${step.color} rounded-2xl p-4 w-16 h-16 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Connecting Arrow (Desktop) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-6 w-12 h-0.5 bg-gradient-to-r from-primary to-accent opacity-50 -translate-y-1/2 z-0">
                    <div className="absolute right-0 top-1/2 w-0 h-0 border-l-4 border-l-accent border-y-2 border-y-transparent -translate-y-1/2"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-subtle-gradient rounded-2xl p-8 md:p-12 inline-block">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Ready to Start Your Chess Journey?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Join thousands of students who have already improved their game with our expert coaches.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-hero px-8 py-3 rounded-lg font-semibold">
                Start Free Assessment
              </button>
              <button className="btn-outline px-8 py-3 rounded-lg font-semibold">
                Browse Coaches
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;