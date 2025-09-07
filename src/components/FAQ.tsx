import React from "react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ: React.FC = () => {
  const faqs = [
    {
      question: "Are all coaches really FIDE-rated?",
      answer:
        "Yes, absolutely! Every coach on our platform is verified FIDE-rated with official tournament experience. We conduct thorough background checks and require proof of ratings and teaching credentials before approving any instructor.",
    },
    {
      question: "Can I schedule lessons across different time zones?",
      answer:
        "Definitely! Our platform supports global scheduling across all time zones. You can book lessons 24/7 with coaches from around the world, making it perfect for busy professionals and students with varying schedules.",
    },
    {
      question: "What skill levels do you teach?",
      answer:
        "We cater to all skill levels — from complete beginners who've never played chess to advanced players seeking grandmaster-level insights. Our coaches specialize in different levels and use personalized learning paths tailored to your specific goals.",
    },
    {
      question: "How much do lessons cost?",
      answer:
        "Our pricing varies based on the coach's rating and experience level. Plans start from $5/session for beginner-focused coaches and go up to $50/session for International Masters and Grandmasters. We also offer package deals and monthly subscriptions for better value.",
    },
    {
      question: "Can I switch coaches if needed?",
      answer:
        "Of course! We want you to find the perfect learning match. You can try different coaches and switch anytime without penalty. Many students work with multiple coaches to learn different aspects of chess strategy and tactics.",
    },
    {
      question: "Do you provide study materials and assignments?",
      answer:
        "Yes! Each coach provides personalized assignments, opening repertoires, tactical puzzles, and game analysis. You'll also get access to our premium chess database, opening explorer, and interactive learning tools as part of your subscription.",
    },
    {
      question: "How do online chess lessons work?",
      answer:
        "Lessons are conducted via video calls (Zoom/Google Meet) with shared chess boards for real-time analysis. Coaches use digital chess boards, screen sharing for demonstrations, and can analyze your games in real-time. It's just as effective as in-person lessons!",
    },
    {
      question: "Is there a mobile app available?",
      answer:
        "We're currently web-based and fully mobile-responsive, so you can access everything from your phone or tablet browser. A dedicated mobile app is coming soon with additional features like offline puzzle solving and push notifications.",
    },
    {
      question: "Can coaches help with tournament preparation?",
      answer:
        "Absolutely! Many of our coaches are active tournament players themselves. They can help with opening preparation, psychological aspects of competitive play, time management, and specific tournament strategies based on your playing style.",
    },
    {
      question: "Do you offer group lessons or just 1-on-2 or 3?",
      answer:
        "While we specialize in personalized 1-on-1 instruction for maximum learning efficiency, some coaches do offer small group sessions (2-5 students) at discounted rates. Group sessions are great for friends or family members learning together.",
    },
  ];

  return (
    <section
      id="faq"
      className="relative py-20 bg-gradient-to-b from-black via-[#0A0A0A] to-black text-white"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 bg-gradient-to-r from-[#FFD700] to-[#FFB700] bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Everything you need to know about learning chess with{" "}
            <span className="text-[#FFD700] font-semibold">PawnRace</span>.  
            Can't find your answer? Contact our support team anytime.
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <AccordionItem
                  value={`item-${index}`}
                  className="bg-[#121212] border border-gray-800 rounded-xl px-6 shadow-lg hover:shadow-[#FFD700]/20 transition-all"
                >
                  <AccordionTrigger className="text-left py-6 text-lg font-semibold text-white hover:text-[#FFD700] transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 pt-2 text-gray-400 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>

        {/* Contact Support Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-[#1a1a1a] via-[#101010] to-[#1a1a1a] border border-gray-800 rounded-2xl p-8 inline-block shadow-lg hover:shadow-[#FFD700]/20 transition-all">
            <h3 className="text-2xl font-bold text-[#FFD700] mb-3">
              Still have questions?
            </h3>
            <p className="text-gray-400 mb-6">
              Our support team is available 24/7 to help you get started.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-[#FFD700] hover:bg-[#e6c200] text-black px-6 py-3 rounded-lg font-semibold shadow-lg transition">
                Contact Support
              </button>
              <button className="border border-[#FFD700] hover:bg-[#FFD700] hover:text-black text-[#FFD700] px-6 py-3 rounded-lg font-semibold transition">
                Schedule a Demo
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
