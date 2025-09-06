import React from "react";
import { motion } from "framer-motion";
import { Trophy, Users } from "lucide-react";

const students = [
  {
    name: "Sanal Vaibhav",
    achievement: "Under 9 State Championship - 3rd Place",
    image: null,
  },
  {
    name: "Amruta Priyalaxmi",
    achievement: "Under 13 State Champion",
    image: null,
  },
  {
    name: "PM Shri",
    achievement: "Navodaya Vidyalaya Bhopal Region Meet Champion",
    image: null,
  },
];

const StudentGlory = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1e47] to-[#0a1331] flex flex-col items-center justify-center px-6 py-16">
      
      {/* Page Title */}
      <motion.h1
        className="text-4xl md:text-5xl font-extrabold text-yellow-400 text-center mb-4"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        Champions Who Make Their First Step 🏆
      </motion.h1>

      <motion.p
        className="text-lg md:text-xl text-yellow-300 text-center max-w-2xl mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        We proudly celebrate the achievements of our talented students!
      </motion.p>

      {/* Student Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
        {students.map((student, index) => (
          <motion.div
            key={index}
            className="bg-white/5 border border-yellow-400/40 rounded-2xl shadow-lg p-6 backdrop-blur-md flex flex-col items-center transition hover:scale-105 hover:shadow-xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.7 }}
          >
            {student.image ? (
              <img
                src={student.image}
                alt={student.name}
                className="w-28 h-28 rounded-full object-cover border-4 border-yellow-400 shadow-lg mb-4"
              />
            ) : (
              <div className="w-28 h-28 flex items-center justify-center rounded-full bg-yellow-600 text-black text-3xl font-bold shadow-lg mb-4">
                {student.name.charAt(0)}
              </div>
            )}

            <h2 className="text-xl font-bold text-yellow-400 text-center">
              {student.name}
            </h2>
            <p className="text-yellow-200 text-center mt-2">
              {student.achievement}
            </p>

            <div className="flex items-center gap-2 mt-4 bg-yellow-600 text-black px-4 py-2 rounded-full text-sm shadow-lg">
              <Trophy size={16} />
              Champion
            </div>
          </motion.div>
        ))}
      </div>

      {/* Congratulations Section */}
      <motion.div
        className="mt-16 max-w-3xl text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <h2 className="text-3xl font-bold text-yellow-400 mb-4">
          Congratulations to our Champions! 🎉
        </h2>
        <p className="text-yellow-200 text-lg">
          We are thrilled to see our students excel in chess tournaments. Their
          hard work, dedication, and passion for the game have paid off, and we
          couldn't be prouder!
        </p>
      </motion.div>

      {/* Call-to-Action */}
      <motion.div
        className="mt-12 text-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.7 }}
      >
        <button className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-full text-lg font-semibold shadow-lg flex items-center gap-2 mx-auto">
          <Users size={20} /> Join Pawn Race
        </button>
        <p className="text-yellow-200 mt-4">
          Become a part of our vibrant chess community and get access to expert
          coaching, interactive lessons, and exciting tournaments.
        </p>
      </motion.div>
    </div>
  );
};

export default StudentGlory;
