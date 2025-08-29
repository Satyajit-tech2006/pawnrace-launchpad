import React from "react";
// ✨ Icons for a polished look
import { Star, ShieldCheck, BookOpen, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

import Navbar from "./Navbar";

// --- Mock Data for 6 Coaches ---
// You can replace these with your actual coach data.
// I've used placeholder images for now.
const coachesData = [
  {
    id: 1,
    name: "Jagdish",
    title: "Grandmaster",
    rating: 2488,
    photoUrl: "https://placehold.co/400x400/8B5CF6/FFFFFF?text=AG",
    specialty: "Opening Theory & Tactics",
    bio: "A seasoned Grandmaster with a knack for simplifying complex opening concepts for aspiring players.",
    verified: true,
  },
  {
    id: 2,
    name: "Jagdish",
    title: "International Master",
    rating: 2450,
    photoUrl: "https://placehold.co/400x400/F59E0B/FFFFFF?text=DD",
    specialty: "Middlegame Strategy",
    bio: "Specializes in positional play and strategic planning. Excellent at teaching long-term thinking.",
    verified: true,
  },
  {
    id: 3,
    name: "Jagdish",
    title: "Grandmaster",
    rating: 2515,
    photoUrl: "https://placehold.co/400x400/10B981/FFFFFF?text=SM",
    specialty: "Endgame Mastery",
    bio: "An endgame wizard who can help you convert even the slightest advantage into a win.",
    verified: true,
  },
  {
    id: 4,
    name: "Jagdish",
    title: "International Master",
    rating: 2420,
    photoUrl: "https://placehold.co/400x400/3B82F6/FFFFFF?text=KP",
    specialty: "Dynamic & Attacking Chess",
    bio: "Known for his aggressive style, Kushager teaches students how to create and capitalize on attacking chances.",
    verified: true,
  },
  {
    id: 5,
    name: "Jagdish",
    title: "Woman Grandmaster",
    rating: 2350,
    photoUrl: "https://placehold.co/400x400/EC4899/FFFFFF?text=PK",
    specialty: "Positional Understanding",
    bio: "Helps students build a solid foundation by focusing on pawn structures and piece coordination.",
    verified: true,
  },
  {
    id: 6,
    name: "Jagdish",
    title: "FIDE Master",
    rating: 2300,
    photoUrl: "https://placehold.co/400x400/EF4444/FFFFFF?text=RS",
    specialty: "Beginner & Intermediate Training",
    bio: "An expert coach for players starting their journey, making chess fun and accessible for all levels.",
    verified: false,
  },
];

// --- Animation Variants for Framer Motion ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 },
  },
};

// --- Single Coach Card Component ---
const CoachCard = ({ coach }) => (
  <motion.div
    variants={itemVariants}
    className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group"
  >
    <div className="relative">
      <img
        src={coach.photoUrl}
        alt={`Photo of ${coach.name}`}
        className="w-full h-56 object-cover"
      />
      <div className="absolute top-4 right-4 bg-slate-900/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1.5">
        <Star className="h-4 w-4 text-yellow-400" />
        <span>{coach.rating}</span>
      </div>
    </div>
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-800">{coach.name}</h3>
        {coach.verified && (
          <div
            className="flex items-center gap-1 text-blue-600"
            title="Verified Coach"
          >
            <ShieldCheck className="h-5 w-5" />
          </div>
        )}
      </div>
      <p className="text-sm font-semibold text-slate-500">{coach.title}</p>

      <div className="mt-4 flex items-center gap-2 text-slate-600">
        <BookOpen className="h-5 w-5 text-indigo-500" />
        <p className="text-sm font-medium">{coach.specialty}</p>
      </div>

      <p className="text-sm text-slate-500 mt-2 h-10">{coach.bio}</p>

      <button className="mt-6 w-full font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 rounded-lg py-3 flex items-center justify-center gap-2 transition-all duration-300 transform group-hover:scale-105">
        <span>Book a Free Demo</span>
        <ChevronRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
      </button>
    </div>
  </motion.div>
);

// --- Main Coaches Page Component ---
const CoachesPage = () => {
  return (
    <>
      <div className="mb-12">
        <Navbar />
      </div>
      <div className="bg-slate-50 min-h-screen p-6 sm:p-8 lg:p-12 font-sans mt-12">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 text-center">
              Meet Our World-Class Mentors
            </h1>
            <p className="text-lg text-slate-600 mt-4 max-w-2xl mx-auto text-center">
              Learn from the best. Our certified coaches are here to guide you
              at every step of your chess journey.
            </p>
          </motion.div>

          {/* Coaches Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12"
          >
            {coachesData.map((coach) => (
              <CoachCard key={coach.id} coach={coach} />
            ))}
          </motion.div>
        </div>
      </div>
    </>
  );
};
export default CoachesPage;
