import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Users, Target } from "lucide-react";
import Navbar from "./Navbar";
const levels = [
  {
    title: "Beginner Level",
    rating: "Below 1100",
    classes: "25 classes to complete",
    image: "/demo-photo.jpg", // Replace with your uploaded demo photo
    points: [
      "Who should join? – Students new to chess or just starting tournaments.",
      "What will you learn? – Basic rules, opening principles, tactics.",
      "Result – Build strong foundation and confidence.",
    ],
  },
  {
    title: "Intermediate Level",
    rating: "1100 – 1500",
    classes: "35 classes to complete",
    image: "/demo-photo.jpg",
    points: [
      "Who should join? – Players with basic knowledge aiming to compete.",
      "What will you learn? – Middle-game planning, advanced tactics, positional play.",
      "Result – Strengthen tournament performance and rating.",
    ],
  },
  {
    title: "Advanced Level",
    rating: "1500+",
    classes: "40 classes to complete",
    image: "/demo-photo.jpg",
    points: [
      "Who should join? – Serious players competing at state/national level.",
      "What will you learn? – Endgame mastery, advanced openings, strategy.",
      "Result – Become a tournament-ready, well-rounded player.",
    ],
  },
];

const Curriculum = () => {
  return (
    <>
    <div className="fixed top-0 left-0 w-full z-50 pb-72 mb-44">
      <Navbar/></div>
      
    <div className="min-h-screen bg-gradient-to-br from-[#0f1e47] to-[#0a1331] flex flex-col items-center px-6 py-16 pt-24">
      {/* Page Title */}
      <motion.h1
        className="text-4xl md:text-5xl font-extrabold text-yellow-400 text-center mb-6"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        Our Chess Curriculum 📖
      </motion.h1>

      <motion.p
        className="text-lg md:text-xl text-yellow-200 text-center max-w-2xl mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        Learn & Experience the game with Pawn Race.  
         our curriculum follows a structured progression across 3 levels.
      </motion.p>

      {/* Levels Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
        {levels.map((level, index) => (
          <motion.div
            key={index}
            className="bg-white/5 border border-yellow-400/40 rounded-2xl shadow-lg p-6 backdrop-blur-md flex flex-col items-center transition hover:scale-105 hover:shadow-xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.7 }}
          >
            
            <h2 className="text-2xl font-bold text-yellow-400 text-center">
              {level.title}
            </h2>
            <p className="text-yellow-300 text-center mt-2">
              Rating: {level.rating}
            </p>
            <p className="text-yellow-200 text-center text-sm italic">
              {level.classes}
            </p>

            <ul className="mt-4 space-y-2 text-yellow-200 text-sm">
              {level.points.map((point, i) => (
                <li key={i}>• {point}</li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* Playing Partner Section */}
      <motion.div
        className="mt-20 max-w-4xl bg-white/5 border border-yellow-400/40 rounded-2xl shadow-lg p-8 text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <h2 className="text-3xl font-bold text-yellow-400 mb-4 flex items-center justify-center gap-2">
          <Users /> Get Paired with a Playing Partner!
        </h2>
        <p className="text-yellow-200 text-lg mb-6">
          Find a partner tailored to your skill level and grow together.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-yellow-600/20 p-4 rounded-xl border border-yellow-500/40">
            <h3 className="font-semibold text-yellow-300">Beginner</h3>
            <p className="text-yellow-200 text-sm mt-1">
              Friendly partners (1500–1600 coach rating) to guide you through the basics.
            </p>
          </div>
          <div className="bg-yellow-600/20 p-4 rounded-xl border border-yellow-500/40">
            <h3 className="font-semibold text-yellow-300">Intermediate</h3>
            <p className="text-yellow-200 text-sm mt-1">
              Opponents (1600–1900 coach rating) to challenge and improve your skills.
            </p>
          </div>
          <div className="bg-yellow-600/20 p-4 rounded-xl border border-yellow-500/40">
            <h3 className="font-semibold text-yellow-300">Advanced</h3>
            <p className="text-yellow-200 text-sm mt-1">
              Partners (1900+ coach rating) to push your strategic thinking to the next level.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
    </>
  );
};

export default Curriculum;
