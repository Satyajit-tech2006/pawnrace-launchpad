import React, { useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Image as DreiImage,
  ScrollControls,
  useScroll,
  Float,
  Text,
  Html,
  RoundedBox,
  Sparkles,
} from "@react-three/drei";
import * as THREE from "three";
import { X, Trophy, Award, ExternalLink, Sparkles as SparklesIcon, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const coaches = [
  {
    name: "Tapan Badamundi",
    image: "https://i.ibb.co/RGGxB5kz/455e7661-1fc9-4385-94c2-717bbda15d27.jpg",
    title: "FIDE Rated Chess Coach & Player",
    rating: "Peak FIDE: 2000",
    description:
      "Tapan Badamundi is a highly respected FIDE-rated chess player and coach with a peak FIDE rating of 2000. Known for his deep positional understanding and tournament experience, he brings elite-level training to his students.",
    achievements: [
      "♟️ Peak FIDE Rating: 2000",
      "🏆 Multiple National & International Tournament Performances",
      "🎯 Known for strong positional & endgame mastery",
      "🌍 Active participant in FIDE-rated events",
    ],
    coaching: [
      "Professional Chess Coaching",
      "Advanced Tournament Preparation",
      "Opening Repertoire & Endgame Training",
    ],
    fideId: "XXXXXXX",
  },
  {
    name: "Dikshant Dash",
    image: "https://i.ibb.co/21kBv1dK/Whats-App-Image-2025-09-08-at-19-51-53-ab248d0c.jpg",
    title: "International Chess Sensation",
    rating: "FIDE Rating: 1800+",
    description:
      "With over 14 years of playing experience and a remarkable rating of 1800+, Dikshant Dash is a force to be reckoned with in the competitive chess circuit.",
    achievements: [
      "🏆 U-7 National Champion: 7th place",
      "🏆 U-9 National Championship: 10th place",
      "🏆 U-11 National Championship: 7th place",
      "🥇 U-11 State Champion",
      "🥈 U-13 State Championship: 5th place",
      "🌍 Commonwealth Junior Championship: 5th place",
    ],
    coaching: ["Independent Chess Coaching", "Opening repertoire mastery"],
    fideId: "25091433",
  },
  {
    name: "Pratyush Mohapatra",
    image: "https://i.ibb.co/CKw1bJf7/Whats-App-Image-2025-08-31-at-00-39-39-ef66f27e.jpg",
    title: "Renowned Chess Coach & Player",
    rating: "State Champion",
    description:
      "With over 10 years of playing experience and a stellar coaching record, Pratyush Mohapatra is a highly sought-after chess coach across India.",
    achievements: [
      "🏆 SGFI U-17 Champion (2019)",
      "🏆 State School Champion (2018)",
      "🥇 Gold Medalist in Far East Zone CBSE Clusters (2019)",
      "🌍 Participated in Bhopal & Delhi GM Tournaments",
    ],
    coaching: ["Private Coaching", "Proven track record of rating improvement"],
    fideId: "25620673",
  },
  {
    name: "Majhi Fakir",
    image: "https://i.ibb.co/DX7xbkf/Whats-App-Image-2025-09-07-at-03-33-15-a8445611.jpg",
    title: "FIDE-Rated Coach & Player",
    rating: "FIDE Rating: 1900",
    description:
      "With over 10 years of playing experience and a FIDE rating of 1900, Majhi Fakir is a senior competitive tournament player and experienced trainer.",
    achievements: [
      "🏆 Odisha Inter University Games 2024: Champion",
      "🥈 Odisha State Blitz Chess Championship: 1st Runner-up",
      "🌍 SOA International FIDE Rating 2024: Champion (Category B)",
      "🌍 All India FIDE Chess Rating Tournament 2025: 2nd place",
    ],
    coaching: ["Over 2 years of professional coaching"],
    fideId: "25712195",
  },
  {
    name: "Manindra Karjee",
    image: "https://i.ibb.co/k62M2sN7/Whats-App-Image-2025-08-31-at-00-51-47-eecaec59.jpg",
    title: "Experienced Chess Coach & Player",
    rating: "International Veteran",
    description:
      "Over 12 years of playing experience with international representation and multiple state championship podium finishes.",
    achievements: [
      "🥈 SGFI U-17 Runners-up (2019)",
      "🏆 RSP State Open Champion (2024)",
      "🌍 Represented India in Asian Cities Team Chess Championship (2017)",
    ],
    coaching: ["Specialized tactical mentorship", "Middle-game strategy"],
    fideId: "46690077",
  },
  {
    name: "Anshuman Barik",
    image: "https://i.ibb.co/Cp9Fst6H/Whats-App-Image-2025-09-07-at-03-25-57-01220eea.jpg",
    title: "FIDE Arena International Master",
    rating: "AIM / Rapid: 1687",
    description:
      "Certified instructor recognized by AICF & FIDE, specializing in high-level opening preparation and structured tactical training for junior players.",
    achievements: [
      "🏆 SGFI National Representative (3 times)",
      "⭐ Best Player in UT of DNH & Daman & Diu (2022)",
      "🎓 Captain of Ravenshaw University Chess Team",
    ],
    coaching: ["Beginner & Intermediate specialized training"],
    fideId: "48769738",
  },
  {
    name: "Dipti Ranjan Nayak",
    image: "https://i.ibb.co/7J8hYpj0/857e4e5d-6b53-4911-b91e-da1a0635e5b0.jpg",
    title: "Experienced Chess Coach & Player",
    rating: "Certified Mentor",
    description:
      "Over 8 years of competitive playing experience and 3+ years of coaching rising state champions across regional academies.",
    achievements: [
      "🏆 National Team Event: 2nd Runner-up",
      "🥉 State School Championship: 3rd place",
      "🌍 KIIT International Chess: Multiple top 10 finishes",
    ],
    coaching: ["S.R. Chess Centre", "Aryavant Academy", "PM Shri Navodaya Vidyalaya"],
    fideId: "25638785",
  },
];

function Card3D({ coach, index, total, onSelect, isMobile }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const scroll = useScroll();

  const cardW = isMobile ? 2.2 : 2.5;
  const cardH = isMobile ? 3.3 : 3.7;

  useFrame((state, delta) => {
    if (!scroll || !meshRef.current) return;

    const scrollOffset = scroll.offset;
    const progress = (index / total - scrollOffset * 0.85) % 1;
    const normalizedProgress = progress < 0 ? progress + 1 : progress;

    const angle = normalizedProgress * Math.PI * 1.6 - 0.8;
    const radius = isMobile ? 4.8 : 6.8;

    const targetX = Math.sin(angle) * radius;
    const targetZ = -Math.cos(angle) * radius + (isMobile ? 2.8 : 4.2);
    const targetRotY = -angle * 0.95;

    meshRef.current.position.x = THREE.MathUtils.damp(meshRef.current.position.x, targetX, 5, delta);
    meshRef.current.position.z = THREE.MathUtils.damp(meshRef.current.position.z, targetZ, 5, delta);
    meshRef.current.position.y = THREE.MathUtils.damp(
      meshRef.current.position.y,
      hovered ? 0.25 : 0,
      6,
      delta
    );

    meshRef.current.rotation.y = THREE.MathUtils.damp(meshRef.current.rotation.y, targetRotY, 5, delta);

    if (hovered) {
      meshRef.current.rotation.x = THREE.MathUtils.damp(meshRef.current.rotation.x, -0.06, 4, delta);
    } else {
      meshRef.current.rotation.x = THREE.MathUtils.damp(meshRef.current.rotation.x, 0, 4, delta);
    }
  });

  return (
    <group
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => onSelect(coach)}
    >
      <Float speed={hovered ? 0 : 2} rotationIntensity={0.12} floatIntensity={0.2}>
        {/* Outer Glowing Border */}
        <RoundedBox
          args={[cardW + 0.08, cardH + 0.08, 0.05]}
          radius={0.18}
          smoothness={4}
          position={[0, 0, -0.02]}
        >
          <meshBasicMaterial color={hovered ? "#FACC15" : "#B45309"} />
        </RoundedBox>

        {/* Card Body */}
        <RoundedBox
          args={[cardW, cardH, 0.07]}
          radius={0.16}
          smoothness={4}
          position={[0, 0, 0]}
        >
          <meshStandardMaterial
            color={hovered ? "#162033" : "#0c1322"}
            metalness={0.75}
            roughness={0.25}
          />
        </RoundedBox>

        {/* Coach Photo */}
        <DreiImage
          url={coach.image}
          scale={isMobile ? [1.9, 1.8] : [2.2, 2.1]}
          position={[0, isMobile ? 0.55 : 0.65, 0.06]}
          radius={0.1}
          transparent
        />

        {/* Name */}
        <Text
          position={[0, isMobile ? -0.58 : -0.68, 0.06]}
          fontSize={isMobile ? 0.16 : 0.19}
          color="#FACC15"
          anchorX="center"
          anchorY="middle"
          maxWidth={cardW - 0.2}
          fontWeight="bold"
        >
          {coach.name}
        </Text>

        {/* Title */}
        <Text
          position={[0, isMobile ? -0.88 : -1.0, 0.06]}
          fontSize={isMobile ? 0.095 : 0.11}
          color="#94A3B8"
          anchorX="center"
          anchorY="middle"
          maxWidth={cardW - 0.2}
          textAlign="center"
        >
          {coach.title}
        </Text>

        {/* CTA Button Overlay */}
        <Html transform position={[0, isMobile ? -1.25 : -1.42, 0.08]} scale={isMobile ? 0.14 : 0.16} center>
           
        </Html>
      </Float>
    </group>
  );
}

function Scene({ onSelectCoach }) {
  const { width } = useThree((state) => state.size);
  const isMobile = width < 768;

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 10, 5]} intensity={1.6} color="#ffffff" />
      <pointLight position={[-5, 5, 2]} intensity={2.5} color="#EAB308" />
      <pointLight position={[5, -5, 2]} intensity={2} color="#38BDF8" />

      <ScrollControls pages={isMobile ? 4 : 3} damping={0.16}>
        <group position={[0, 0, 0]}>
          {coaches.map((coach, index) => (
            <Card3D
              key={coach.name}
              coach={coach}
              index={index}
              total={coaches.length}
              onSelect={onSelectCoach}
              isMobile={isMobile}
            />
          ))}
        </group>
      </ScrollControls>

      <Sparkles count={isMobile ? 45 : 85} scale={10} size={2.5} speed={0.4} color="#FACC15" opacity={0.6} />
    </>
  );
}

export default function Coaches() {
  const [selectedCoach, setSelectedCoach] = useState(null);

  return (
    <div className="relative w-full h-screen bg-[#070b14] overflow-hidden select-none font-sans flex flex-col justify-between">
      {/* Ambient Lighting Blurs */}
      <div className="absolute top-0 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-yellow-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 pt-6 sm:pt-8 flex flex-col items-center pointer-events-none text-center px-4 space-y-2">
         
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500">Star Coaches</span>
        </h1>
        
      </header>

      {/* 3D Canvas */}
      <div className="relative w-full flex-1 cursor-grab active:cursor-grabbing">
        <Canvas
          camera={{ position: [0, 0, 4.4], fov: 48 }}
          className="w-full h-full"
        >
          <Scene onSelectCoach={setSelectedCoach} />
        </Canvas>

        {/* Scroll Helper */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[11px] text-yellow-400/80 bg-slate-900/80 border border-yellow-500/20 px-3.5 py-1.5 rounded-full backdrop-blur-md flex items-center gap-1 pointer-events-none">
          <span>Scroll to explore</span>
          <ChevronDown className="w-3 h-3 animate-bounce" />
        </div>
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedCoach && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-yellow-500/60 rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col text-white"
            >
              <button
                onClick={() => setSelectedCoach(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-yellow-400 transition-colors border border-yellow-500/30 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="overflow-y-auto p-5 sm:p-7 space-y-5">
                <div className="flex flex-col items-center text-center">
                  <img
                    src={selectedCoach.image}
                    alt={selectedCoach.name}
                    className="w-28 h-28 sm:w-32 sm:h-32 object-cover rounded-2xl border-2 border-yellow-400 shadow-xl shadow-yellow-500/20 mb-3"
                  />
                  <h2 className="text-xl sm:text-2xl font-extrabold text-yellow-400">
                    {selectedCoach.name}
                  </h2>
                  <p className="text-xs sm:text-sm font-semibold text-slate-300 mt-0.5">
                    {selectedCoach.title}
                  </p>
                  <p className="text-xs text-slate-400 mt-2.5 leading-relaxed max-w-md">
                    {selectedCoach.description}
                  </p>
                </div>

                {selectedCoach.achievements?.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-yellow-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Trophy className="w-3.5 h-3.5" /> Key Achievements
                    </h3>
                    <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/60 space-y-1.5">
                      {selectedCoach.achievements.map((item, idx) => (
                        <div key={idx} className="text-xs text-slate-200">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedCoach.coaching?.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-yellow-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5" /> Coaching Experience
                    </h3>
                    <ul className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/60 space-y-1 list-disc list-inside text-xs text-slate-300">
                      {selectedCoach.coaching.map((c, idx) => (
                        <li key={idx}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex gap-3 pt-3 border-t border-slate-800">
                  {selectedCoach.fideId && selectedCoach.fideId !== "XXXXXXX" && (
                    <a
                      href={`https://ratings.fide.com/profile/${selectedCoach.fideId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2.5 px-3 rounded-xl text-xs transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> FIDE Profile
                    </a>
                  )}
                  <button
                    onClick={() => setSelectedCoach(null)}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-2.5 px-3 rounded-xl text-xs border border-slate-700 transition-all cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}