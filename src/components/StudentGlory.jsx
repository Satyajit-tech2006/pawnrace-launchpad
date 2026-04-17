import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Users } from "lucide-react";

// IMAGES
import hariselvan from "../assets/hariselvan.jpg";
import dibyesh from "../assets/dibyesh.jpg";
import sharwin from "../assets/sharwin.jpg";

const students = [
  {
    name: "Hariselvan P",
    achievement: "U-11 State Champion 🏆 (6.5/7)",
    image: hariselvan,
  },
  {
    name: "Dibyesh",
    achievement: "State Chess Tournament Winner 🏆",
    image: dibyesh,
  },
  {
    name: "Sharwin",
    achievement: "Malaysia District Champion 🏆",
    image: sharwin,
  },
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
    achievement: "Navodaya Vidyalaya Champion",
    image: null,
  },
];

const StudentGlory = () => {
  const [index, setIndex] = useState(0);

  // AUTO SLIDE
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % students.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1e47] to-[#0a1331] flex flex-col items-center justify-center px-6 py-16 overflow-hidden">
      
      {/* TITLE */}
      <motion.h1
        className="text-4xl md:text-6xl font-extrabold text-yellow-400 text-center mb-4"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Champions Who Make Their First Step 🏆
      </motion.h1>

      <motion.p
        className="text-lg md:text-xl text-yellow-300 text-center max-w-2xl mb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        We proudly celebrate the achievements of our talented students!
      </motion.p>

      {/* 3D CAROUSEL */}
      <div className="relative w-full max-w-6xl h-[500px] flex items-center justify-center perspective-[1200px]">
        {students.map((student, i) => {
          const position = (i - index + students.length) % students.length;

          let scale = 0.6;
          let x = 400;
          let rotateY = -25;
          let opacity = 0;

          if (position === 0) {
            scale = 1.1;
            x = 0;
            rotateY = 0;
            opacity = 1;
          } else if (position === 1) {
            scale = 0.85;
            x = 320;
            rotateY = -20;
            opacity = 0.6;
          } else if (position === students.length - 1) {
            scale = 0.85;
            x = -320;
            rotateY = 20;
            opacity = 0.6;
          }

          return (
            <motion.div
              key={i}
              className={`absolute w-[320px] md:w-[360px] h-[420px] rounded-3xl p-6 backdrop-blur-xl border border-yellow-400/30 flex flex-col items-center justify-center text-center shadow-2xl
              ${
                position === 0
                  ? "bg-yellow-500/10 shadow-yellow-500/40"
                  : "bg-white/5"
              }`}
              animate={{
                x,
                scale,
                rotateY,
                opacity,
                zIndex: position === 0 ? 20 : 1,
              }}
              transition={{ duration: 0.8 }}
              whileHover={{
                scale: position === 0 ? 1.15 : scale,
              }}
            >
              {/* IMAGE */}
              {student.image ? (
                <motion.img
                  src={student.image}
                  alt={student.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-yellow-400 shadow-lg mb-4"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                />
              ) : (
                <div className="w-32 h-32 flex items-center justify-center rounded-full bg-yellow-600 text-black text-4xl font-bold shadow-lg mb-4">
                  {student.name.charAt(0)}
                </div>
              )}

              {/* NAME */}
              <h2 className="text-2xl font-bold text-yellow-400">
                {student.name}
              </h2>

              {/* ACHIEVEMENT */}
              <p className="text-yellow-200 mt-3 text-sm md:text-base">
                {student.achievement}
              </p>

              {/* BADGE */}
              <motion.div
                className="flex items-center gap-2 mt-6 bg-yellow-500 text-black px-5 py-2 rounded-full text-sm shadow-lg"
                whileHover={{ scale: 1.1 }}
              >
                <Trophy size={16} />
                Champion
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* CTA */}
      <motion.div
        className="mt-20 text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
      >
        <button
          className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 rounded-full text-lg font-semibold shadow-xl flex items-center gap-3 mx-auto transition"
          onClick={() =>
            window.open(
              "https://docs.google.com/forms/d/e/1FAIpQLSd368-GnfJjgbQdIeAiU6ro68983N8OPo6upy5n0kDI9YClkA/viewform",
              "_blank"
            )
          }
        >
          <Users size={22} /> Join Pawn Race
        </button>

        <p className="text-yellow-200 mt-4 text-lg">
          Become a part of our vibrant chess community 🚀
        </p>
      </motion.div>
    </div>
  );
};

export default StudentGlory;