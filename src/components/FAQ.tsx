import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ: React.FC = () => {
  const faqs = [
    {
      question: "How do I get started with PawnRace?",
      answer: "Getting started is simple! Create your account, complete a quick chess assessment to determine your skill level, browse our FIDE-rated coaches, and book your first lesson. You can start with a free trial session to ensure the perfect coach match."
    },
    {
      question: "Are all coaches really FIDE-rated?",
      answer: "Yes, absolutely! Every coach on our platform is verified FIDE-rated with official tournament experience. We conduct thorough background checks and require proof of ratings and teaching credentials before approving any instructor."
    },
    {
      question: "Can I schedule lessons across different time zones?",
      answer: "Definitely! Our platform supports global scheduling across all time zones. You can book lessons 24/7 with coaches from around the world, making it perfect for busy professionals and students with varying schedules."
    },
    {
      question: "What skill levels do you teach?",
      answer: "We cater to all skill levels - from complete beginners who've never played chess to advanced players seeking grandmaster-level insights. Our coaches specialize in different levels and use personalized learning paths tailored to your specific goals."
    },
    {
      question: "How much do lessons cost?",
      answer: "Our pricing varies based on the coach's rating and experience level. Plans start from $29/session for beginner-focused coaches and go up to $99/session for International Masters and Grandmasters. We also offer package deals and monthly subscriptions for better value."
    },
    {
      question: "Can I switch coaches if needed?",
      answer: "Of course! We want you to find the perfect learning match. You can try different coaches and switch anytime without penalty. Many students work with multiple coaches to learn different aspects of chess strategy and tactics."
    },
    {
      question: "Do you provide study materials and assignments?",
      answer: "Yes! Each coach provides personalized assignments, opening repertoires, tactical puzzles, and game analysis. You'll also get access to our premium chess database, opening explorer, and interactive learning tools as part of your subscription."
    },
    {
      question: "How do online chess lessons work?",
      answer: "Lessons are conducted via video calls (Zoom/Google Meet) with shared chess boards for real-time analysis. Coaches use digital chess boards, screen sharing for demonstrations, and can analyze your games in real-time. It's just as effective as in-person lessons!"
    },
    {
      question: "Is there a mobile app available?",
      answer: "We're currently web-based and fully mobile-responsive, so you can access everything from your phone or tablet browser. A dedicated mobile app is coming soon with additional features like offline puzzle solving and push notifications."
    },
    {
      question: "What's your refund policy?",
      answer: "We offer a satisfaction guarantee! If you're not happy with your first lesson, we'll provide a full refund or help you find a better coach match. For ongoing lessons, we have a flexible cancellation policy with 24-hour notice required."
    },
    {
      question: "Can coaches help with tournament preparation?",
      answer: "Absolutely! Many of our coaches are active tournament players themselves. They can help with opening preparation, psychological aspects of competitive play, time management, and specific tournament strategies based on your playing style."
    },
    {
      question: "Do you offer group lessons or just 1-on-1?",
      answer: "While we specialize in personalized 1-on-1 instruction for maximum learning efficiency, some coaches do offer small group sessions (2-4 students) at discounted rates. Group sessions are great for friends or family members learning together."
    }
  ];

  return (
    <section id="faq" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to know about learning chess with PawnRace. 
            Can't find your answer? Contact our support team anytime.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-card border border-border rounded-xl px-6 hover:border-primary/50 transition-colors"
              >
                <AccordionTrigger className="text-left py-6 hover:no-underline hover:text-primary transition-colors">
                  <span className="font-semibold text-lg pr-4">
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-6 pt-2 text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Contact Support */}
          <div className="text-center mt-12">
            <div className="bg-subtle-gradient rounded-2xl p-8 inline-block">
              <h3 className="text-xl font-bold text-foreground mb-3">
                Still have questions?
              </h3>
              <p className="text-muted-foreground mb-6">
                Our support team is available 24/7 to help you get started.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="btn-hero px-6 py-3 rounded-lg font-semibold">
                  Contact Support
                </button>
                <button className="btn-outline px-6 py-3 rounded-lg font-semibold">
                  Schedule a Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;