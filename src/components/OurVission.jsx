import React from "react";
import { motion } from "framer-motion";
import {
  Brain,
  GraduationCap,
  Puzzle,
  Trophy,
  ChartBar,
  Globe2,
  Link as LinkIcon,
  Award,
} from "lucide-react";

const fadeInUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut", delay },
  viewport: { once: true, amount: 0.2 },
});

const glass =
  "bg-white/5 border border-yellow-400/30 backdrop-blur-lg shadow-[0_8px_40px_rgb(2,6,23,0.6)] rounded-3xl";

const OurVission = () => {
  return (
    <>
      

      {/* Main Container */}
      <div className="min-h-screen w-full relative bg-[#0E1A3C] text-white overflow-hidden">
        {/* Animated Gradient Aura */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 -left-32 h-96 w-96 rounded-full blur-3xl opacity-30 bg-yellow-400/30" />
          <div className="absolute -bottom-44 -right-24 h-[28rem] w-[28rem] rounded-full blur-3xl opacity-20 bg-yellow-300/25" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-72 w-72 rounded-full blur-3xl opacity-15 bg-yellow-200/20" />
        </div>

        {/* Hero Section */}
        <section className="relative max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 pt-28">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className={`p-10 md:p-14 ${glass}`}
          >
            <span className="inline-block text-sm tracking-widest uppercase text-yellow-300">
              🇮🇳 India’s First Hybrid Chess + Study Academy
            </span>

            <h1 className="mt-4 text-4xl md:text-6xl font-extrabold leading-tight">
              <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                ♟ PawnRace Academy
              </span>{" "}
              – Where Champions Are Cultivated
            </h1>

            <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-3xl leading-relaxed">
              PawnRace isn’t just an academy—it’s a movement. We’re the first in
              India to fuse world-class chess training with academic excellence,
              scholarship opportunities, and IQ-building puzzles—under one roof.
            </p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="mt-8 inline-flex items-center gap-3 rounded-2xl px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 shadow-lg cursor-pointer transition duration-300" onClick={() => window.open("https://chat.whatsapp.com/COooj4ewuA3BGsqTtyznYp?mode=ems_copy_t", "_blank") }
            >
              <LinkIcon className="w-5 h-5 text-black" />
              <span className="text-base font-bold text-black">Join the Movement</span>
            </motion.div>
          </motion.div>
        </section>

        {/* What Makes Us Different */}
        <section className="relative max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 mt-20">
          <motion.h2
            {...fadeInUp(0)}
            className="text-3xl md:text-4xl font-bold mb-10 bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 bg-clip-text text-transparent"
          >
            🎓 What Makes Us Different?
          </motion.h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Brain className="w-7 h-7 text-yellow-400" />}
              title="Chess + Study Integration"
              desc="Train with FIDE-rated masters while engaging in logic-based academic puzzles."
              delay={0.05}
            />
            <FeatureCard
              icon={<GraduationCap className="w-7 h-7 text-yellow-400" />}
              title="Foundation to Mastery"
              desc="From absolute beginners to tournament-level players with a step-by-step curriculum."
              delay={0.1}
            />
            <FeatureCard
              icon={<Puzzle className="w-7 h-7 text-yellow-400" />}
              title="IQ Development"
              desc="Daily puzzles and cognitive games to boost analysis and decision-making."
              delay={0.15}
            />
            <FeatureCard
              icon={<Trophy className="w-7 h-7 text-yellow-400" />}
              title="Scholarship Program"
              desc="Merit-based scholarships for top performers—because talent deserves opportunity."
              delay={0.2}
            />
            <FeatureCard
              icon={<Globe2 className="w-7 h-7 text-yellow-400" />}
              title="Global Mentorship"
              desc="International coaches and mentors with real-time feedback and personalization."
              delay={0.25}
            />
            <FeatureCard
              icon={<ChartBar className="w-7 h-7 text-yellow-400" />}
              title="Progress Analytics"
              desc="AI-powered dashboards track progress in chess and cognitive skills."
              delay={0.3}
            />
          </div>

          {/* Interactive Assignments */}
          <motion.div {...fadeInUp(0.35)} className={`mt-10 p-6 ${glass}`}>
            <p className="text-yellow-300 font-semibold text-lg">
              🧩 Interactive Assignments
            </p>
            <p className="text-gray-300 mt-2">
              Custom exercises blend chess tactics with academic logic—improving
              retention, reasoning, and confidence.
            </p>
          </motion.div>
        </section>

        {/* Our Promise */}
        <section className="relative max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 mt-20">
          <motion.h2
            {...fadeInUp(0)}
            className="text-3xl md:text-4xl font-bold mb-10 bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 bg-clip-text text-transparent"
          >
            🏆 Our Promise to Parents & Students
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            <PromiseCard
              title="Holistic Development"
              desc="Not just chess, not just study—your child learns to think, solve, and lead."
              delay={0.05}
            />
            <PromiseCard
              title="Flexible Learning"
              desc="24/7 scheduling, live sessions, and personalized paths for every learner."
              delay={0.1}
            />
            <PromiseCard
              title="Community of Excellence"
              desc="Join a global network of students, coaches, and mentors pushing boundaries."
              delay={0.15}
            />
          </div>
        </section>

        {/* Scholarship & Free Chess Camp Initiative */}
        <section className="relative max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 mt-20 mb-20">
          <motion.div
            {...fadeInUp(0.1)}
            className={`p-10 md:p-14 ${glass} text-center`}
          >
            <div className="flex justify-center mb-6">
              <Award className="w-12 h-12 text-yellow-400" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              🎓 Scholarship & Free Chess Camp Initiative
            </h2>
            <p className="mt-6 text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto">
              At PawnRace Academy, we proudly stand as India’s first innovative
              chess + IQ development company—where talent meets opportunity.
              We believe that every passionate player deserves a chance to shine.
            </p>
            <p className="mt-4 text-gray-300 text-base max-w-3xl mx-auto">
              That’s why we’ve launched our <span className="text-yellow-300 font-semibold">Free Chess Camp & Scholarship Program</span>,
              designed to support and uplift students who show dedication and potential,
              under basic eligibility criteria.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="mt-8 px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold rounded-xl shadow-lg"
             onClick={() => window.open("https://docs.google.com/forms/d/e/1FAIpQLSfteebL_sxkXyYVc-MjRQPWUttZG61DSbCUPi5YazHjxj2msg/viewform?usp=dialog", "_blank") }
            >
              Apply for Scholarship
            </motion.button>
          </motion.div>
        </section>
      </div>
    </>
  );
};

const FeatureCard = ({ icon, title, desc, delay = 0 }) => (
  <motion.div
    {...fadeInUp(delay)}
    whileHover={{ y: -6, scale: 1.03 }}
    className={`p-6 ${glass}`}
  >
    <div className="flex items-center gap-4">
      <div className="p-3 rounded-xl bg-yellow-400/10 border border-yellow-300/40">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-yellow-300">{title}</h3>
    </div>
    <p className="mt-3 text-gray-300">{desc}</p>
  </motion.div>
);

const PromiseCard = ({ title, desc, delay = 0 }) => (
  <motion.div
    {...fadeInUp(delay)}
    whileHover={{ y: -6, scale: 1.03 }}
    className={`p-6 ${glass}`}
  >
    <h3 className="text-xl font-semibold bg-gradient-to-r from-yellow-200 to-yellow-500 bg-clip-text text-transparent">
      {title}
    </h3>
    <p className="mt-3 text-gray-300">{desc}</p>
  </motion.div>
);

export default OurVission;
