import React from 'react';
import { Users, Award, Trophy, Target } from 'lucide-react';

const AboutUs: React.FC = () => {
  const stats = [
    { icon: Users, number: '500+', label: 'FIDE Coaches', color: 'text-primary' },
    { icon: Award, number: '10K+', label: 'Students Trained', color: 'text-accent' },
    { icon: Trophy, number: '98%', label: 'Success Rate', color: 'text-primary' },
    { icon: Target, number: '50+', label: 'Countries', color: 'text-accent' }
  ];

  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            About <span className="text-gradient">PawnRace</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Founded by chess masters and education experts, PawnRace is the world's premier 
            online chess academy, connecting ambitious learners with FIDE-rated coaches globally.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <div className="space-y-6">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground">
              Our Mission: Democratizing Chess Excellence
            </h3>
            <div className="space-y-4 text-muted-foreground">
              <p className="text-lg leading-relaxed">
                We believe every chess enthusiast deserves access to world-class training. 
                Our platform connects you with certified FIDE coaches who provide personalized, 
                structured learning paths tailored to your skill level and goals.
              </p>
              <p className="text-lg leading-relaxed">
                From complete beginners taking their first steps to advanced players seeking 
                grandmaster-level insights, our coaches use proven methodologies to accelerate 
                your chess journey.
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-foreground font-medium">Personalized 1-on-1 coaching sessions</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span className="text-foreground font-medium">Structured curriculum for all levels</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-foreground font-medium">Real-time game analysis and feedback</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span className="text-foreground font-medium">Flexible scheduling across time zones</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white rounded-2xl p-8 shadow-xl hover-lift">
              <div className="text-center space-y-4">
                <div className="text-6xl">♔</div>
                <h4 className="text-xl font-bold text-foreground">Elite Standards</h4>
                <p className="text-muted-foreground">
                  All our coaches are FIDE-rated professionals with proven track records 
                  in competitive chess and teaching excellence.
                </p>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-primary rounded-lg p-3 text-white shadow-lg animate-pulse">
              <Trophy className="w-6 h-6" />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-accent rounded-lg p-3 text-accent-foreground shadow-lg hover-scale">
              <Award className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group hover-scale">
              <div className="mb-4">
                <stat.icon className={`w-12 h-12 mx-auto ${stat.color} group-hover:scale-110 transition-transform`} />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">
                {stat.number}
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutUs;