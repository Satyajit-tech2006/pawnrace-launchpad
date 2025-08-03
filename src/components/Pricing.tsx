import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Crown, Star } from 'lucide-react';

interface PricingProps {
  onLoginClick: () => void;
}

const Pricing: React.FC<PricingProps> = ({ onLoginClick }) => {
  const plans = [
    {
      name: 'Beginner',
      price: '₹999',
      period: '/month',
      description: 'Perfect for chess newcomers',
      features: [
        '4 one-on-one sessions per month',
        'Basic game analysis',
        'Access to beginner curriculum',
        'Email support',
        'Progress tracking'
      ],
      popular: false,
      cta: 'Start Learning'
    },
    {
      name: 'Intermediate',
      price: '₹1,999',
      period: '/month',
      description: 'For developing competitive players',
      features: [
        '8 one-on-one sessions per month',
        'Advanced game analysis',
        'Complete chess curriculum',
        'Priority support',
        'Tournament preparation',
        'Custom practice assignments',
        'Coach feedback reports'
      ],
      popular: true,
      cta: 'Most Popular'
    },
    {
      name: 'Pro',
      price: '₹3,999',
      period: '/month',
      description: 'Elite training for serious players',
      features: [
        'Unlimited one-on-one sessions',
        'GM-level coaching',
        'Personalized curriculum',
        '24/7 premium support',
        'Master-level game analysis',
        'Opening repertoire building',
        'Psychology & mindset coaching',
        'Tournament strategy sessions'
      ],
      popular: false,
      cta: 'Go Pro'
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-subtle-gradient">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Choose Your <span className="text-gradient">Chess Journey</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Flexible pricing plans designed to fit every chess player's needs and budget
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative card-elegant hover-lift ${
                plan.popular 
                  ? 'ring-2 ring-primary transform scale-105' 
                  : ''
              }`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-current" />
                    <span>Most Popular</span>
                  </div>
                </div>
              )}

              <div className="p-8">
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {plan.description}
                  </p>
                  
                  <div className="flex items-baseline justify-center">
                    <span className="text-5xl font-bold text-gradient">
                      {plan.price}
                    </span>
                    <span className="text-muted-foreground ml-2">
                      {plan.period}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div
                      key={featureIndex}
                      className="flex items-start space-x-3"
                    >
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground text-sm">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button
                  onClick={onLoginClick}
                  className={`w-full ${
                    plan.popular 
                      ? 'btn-hero' 
                      : 'btn-outline'
                  }`}
                  size="lg"
                >
                  {plan.popular && <Crown className="mr-2 h-5 w-5" />}
                  {plan.cta}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Money-back Guarantee */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-2 text-muted-foreground">
            <Check className="h-5 w-5 text-primary" />
            <span>30-day money-back guarantee on all plans</span>
          </div>
        </div>

        {/* Enterprise CTA */}
        <div className="mt-16 text-center bg-primary/5 rounded-2xl p-8">
          <h3 className="text-2xl font-bold mb-4">
            Need a custom plan for your chess club or school?
          </h3>
          <p className="text-muted-foreground mb-6">
            We offer enterprise solutions with volume discounts and additional features
          </p>
          <Button variant="outline" size="lg" className="btn-outline">
            Contact Sales
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Pricing;