import React from 'react';
import { Shield, Clock, Globe, Zap, Users, Star, BookOpen, HeadphonesIcon } from 'lucide-react';

const WhyChooseUs: React.FC = () => {
  const features = [
    {
      icon: Shield,
      title: 'FIDE-Certified Coaches',
      description: 'Learn from officially rated chess masters with proven tournament experience and teaching credentials.',
      benefit: 'Expert Guidance'
    },
    {
      icon: Clock,
      title: '24/7 Flexible Scheduling',
      description: 'Book lessons anytime across global time zones. Perfect for busy professionals and students.',
      benefit: 'Ultimate Flexibility'
    },
    {
      icon: Globe,
      title: 'Global Chess Community',
      description: 'Connect with players worldwide. Practice, compete, and learn from diverse chess cultures.',
      benefit: 'World-Class Network'
    },
    {
      icon: Zap,
      title: 'Instant Progress Tracking',
      description: 'Real-time analytics show your improvement. Watch your rating climb with every lesson.',
      benefit: 'Measurable Results'
    },
    {
      icon: Users,
      title: 'Personalized Learning Path',
      description: 'Custom curriculum adapted to your goals, whether casual play or competitive tournaments.',
      benefit: 'Tailored Experience'
    },
    {
      icon: Star,
      title: 'Premium Learning Tools',
      description: 'Advanced chess engines, opening databases, and interactive puzzles included with every plan.',
      benefit: 'Complete Toolkit'
    },
    {
      icon: BookOpen,
      title: 'Structured Curriculum',
      description: 'Follow proven learning methodologies from beginner basics to grandmaster strategies.',
      benefit: 'Systematic Growth'
    },
    {
      icon: HeadphonesIcon,
      title: '24/7 Student Support',
      description: 'Get help anytime with technical issues, scheduling, or academic questions from our support team.',
      benefit: 'Always Supported'
    }
  ];

  return (
    <section id="why-choose-us" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Why Choose <span className="text-gradient">PawnRace</span>?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're not just another chess platform. We're your partner in mastering the royal game 
            with unmatched quality, flexibility, and results.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group bg-card border border-border rounded-2xl p-6 hover-lift hover:border-primary/50 transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className="mb-6">
                <div className="bg-primary/10 rounded-xl p-3 w-14 h-14 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <feature.icon className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
                </div>
              </div>

              {/* Content */}
              <div className="space-y-3">
                <div className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-full">
                  {feature.benefit}
                </div>
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Section */}
        <div className="bg-card rounded-2xl border border-border p-8 md:p-12">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-8">
            PawnRace vs Others
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Features</th>
                  <th className="text-center py-4 px-6 font-semibold text-primary">PawnRace</th>
                  <th className="text-center py-4 px-6 font-semibold text-muted-foreground">Others</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-border/50">
                  <td className="py-4 px-6 text-foreground">FIDE-Rated Coaches</td>
                  <td className="text-center py-4 px-6">
                    <div className="w-6 h-6 bg-green-500 rounded-full mx-auto flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  </td>
                  <td className="text-center py-4 px-6">
                    <div className="w-6 h-6 bg-red-500 rounded-full mx-auto flex items-center justify-center">
                      <span className="text-white text-xs">✗</span>
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-4 px-6 text-foreground">24/7 Global Support</td>
                  <td className="text-center py-4 px-6">
                    <div className="w-6 h-6 bg-green-500 rounded-full mx-auto flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  </td>
                  <td className="text-center py-4 px-6">
                    <div className="w-6 h-6 bg-yellow-500 rounded-full mx-auto flex items-center justify-center">
                      <span className="text-white text-xs">~</span>
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-4 px-6 text-foreground">Personalized Curriculum</td>
                  <td className="text-center py-4 px-6">
                    <div className="w-6 h-6 bg-green-500 rounded-full mx-auto flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  </td>
                  <td className="text-center py-4 px-6">
                    <div className="w-6 h-6 bg-yellow-500 rounded-full mx-auto flex items-center justify-center">
                      <span className="text-white text-xs">~</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-foreground">Real-time Progress Analytics</td>
                  <td className="text-center py-4 px-6">
                    <div className="w-6 h-6 bg-green-500 rounded-full mx-auto flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  </td>
                  <td className="text-center py-4 px-6">
                    <div className="w-6 h-6 bg-red-500 rounded-full mx-auto flex items-center justify-center">
                      <span className="text-white text-xs">✗</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;