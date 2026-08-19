import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Image as DreiImage,
  ScrollControls,
  useScroll,
  Float,
  Text,
  Html,
} from "@react-three/drei";
import * as THREE from "three";
import { X, Trophy, Award, ExternalLink, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const coaches = [
  {
    name: "Tapan Badamundi",
    image: "https://i.ibb.co/RGGxB5kz/455e7661-1fc9-4385-94c2-717bbda15d27.jpg",
    title: "FIDE Rated Chess Coach & Player",
    description:
      "Tapan Badamundi is a highly respected FIDE-rated chess player and coach with a peak FIDE rating of 2000. Known for his deep positional understanding and tournament experience, he brings elite-level training to his students.",
    achievements: [
      "♟️ FIDE Rating: 2000",
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
    description:
      "With over 14 years of playing experience and a remarkable rating of 1800+, Dikshant Dash is a force to be reckoned with in the chess world.",
    achievements: [
      "🏆 U-7 National Champion: 7th place",
      "🏆 U-9 National Championship: 10th place",
      "🏆 U-11 National Championship: 7th place",
      "🥇 U-11 State Champion",
      "🥈 U-13 State Championship: 5th place",
      "🌍 Commonwealth Junior Championship: 5th place",
    ],
    coaching: ["Independent Chess Coaching"],
    fideId: "25091433",
  },
  {
    name: "Pratyush Mohapatra",
    image: "https://i.ibb.co/CKw1bJf7/Whats-App-Image-2025-08-31-at-00-39-39-ef66f27e.jpg",
    title: "Renowned Chess Coach & Player",
    description:
      "With over 10 years of playing experience and a stellar coaching record, Pratyush Mohapatra is a highly sought-after chess coach.",
    achievements: [
      "🏆 SGFI U-17 Champion (2019)",
      "🏆 State School Champion (2018)",
      "🥇 Gold Medalist in Far East Zone CBSE Clusters (2019)",
      "🌍 Participated in Bhopal & Delhi GM Tournaments",
    ],
    coaching: ["Private Coaching", "Proven track record of improving students' skills"],
    fideId: "25620673",
  },
  {
    name: "Majhi Fakir",
    image: "https://i.ibb.co/DX7xbkf/Whats-App-Image-2025-09-07-at-03-33-15-a8445611.jpg",
    title: "FIDE-Rated Chess Coach & Player",
    description:
      "With over 10 years of playing experience and a FIDE rating of 1900, Majhi Fakir is a highly accomplished coach.",
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
    description:
      "Over 12 years of playing experience with international representation and multiple state championships.",
    achievements: [
      "🥈 SGFI U-17 Runners-up (2019)",
      "🏆 RSP State Open Champion (2024)",
      "🌍 Represented India in Asian Cities Team Chess Championship (2017)",
    ],
    coaching: ["Specialized tactical mentorship"],
    fideId: "46690077",
  },
  {
    name: "Anshuman Barik",
    image: "https://i.ibb.co/Cp9Fst6H/Whats-App-Image-2025-09-07-at-03-25-57-01220eea.jpg",
    title: "FIDE Arena International Master",
    description:
      "Certified instructor recognized by AICF & FIDE, specializing in high-level opening and middle-game concepts.",
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
    description:
      "Over 8 years of competitive playing experience and 3+ years of coaching rising champions across Odisha.",
    achievements: [
      "🏆 National Team Event: 2nd Runner-up",
      "🥉 State School Championship: 3rd place",
      "🌍 KIIT International Chess: Multiple top 10 finishes",
    ],
    coaching: ["S.R. Chess Centre", "Aryavant Academy", "PM Shri Navodaya Vidyalaya"],
    fideId: "25638785",
  },
];

function createRoundedRectShape(width, height, radius) {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;

  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);

  return shape;
}

function Card3D({ coach, index, total, onSelect }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const scroll = useScroll();

  const { bgGeometry, borderGeometry } = useMemo(() => {
    const bgShape = createRoundedRectShape(2.7, 3.8, 0.18);
    const borderShape = createRoundedRectShape(2.76, 3.86, 0.2);
    return {
      bgGeometry: new THREE.ShapeGeometry(bgShape),
      borderGeometry: new THREE.ShapeGeometry(borderShape),
    };
  }, []);

  useFrame((state, delta) => {
    if (!scroll) return;

    const scrollOffset = scroll.offset;
    const progress = (index / total - scrollOffset * 0.85) % 1;
    const normalizedProgress = progress < 0 ? progress + 1 : progress;

    const angle = normalizedProgress * Math.PI * 1.6 - 0.8;
    const radius = 7;

    const targetX = Math.sin(angle) * radius;
    const targetZ = -Math.cos(angle) * radius + 4.5;
    const targetRotY = -angle * 0.9;

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
      <Float speed={hovered ? 0 : 2} rotationIntensity={0.15} floatIntensity={0.25}>
        <mesh position={[0, 0, -0.05]} geometry={borderGeometry}>
          <meshBasicMaterial color={hovered ? "#FACC15" : "#CA8A04"} />
        </mesh>

        <mesh position={[0, 0, -0.04]} geometry={bgGeometry}>
          <meshStandardMaterial
            color={hovered ? "#172033" : "#0f172a"}
            metalness={0.7}
            roughness={0.25}
          />
        </mesh>

        <DreiImage
          url={coach.image}
          scale={[2.3, 2.1]}
          position={[0, 0.6, 0.02]}
          transparent
        />

        <Text
          position={[0, -0.75, 0.05]}
          fontSize={0.18}
          color="#FACC15"
          anchorX="center"
          anchorY="middle"
          maxWidth={2.3}
          fontWeight="bold"
        >
          {coach.name}
        </Text>

        <Text
          position={[0, -1.05, 0.05]}
          fontSize={0.11}
          color="#94A3B8"
          anchorX="center"
          anchorY="middle"
          maxWidth={2.3}
        >
          {coach.title}
        </Text>

        <Html transform position={[0, -1.45, 0.06]} scale={0.18} center>
          {/* <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(coach);
            }}
            className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-xl cursor-pointer ${
              hovered
                ? "bg-yellow-400 text-slate-950 scale-105 shadow-yellow-500/50"
                : "bg-slate-800 text-yellow-400 border border-yellow-500/50 hover:bg-slate-700"
            }`}
          >
            Know More
          </button> */}
        </Html>
      </Float>
    </group>
  );
}

function Scene({ onSelectCoach }) {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 10, 5]} intensity={1.5} color="#fff" />
      <pointLight position={[-5, 5, 2]} intensity={2} color="#EAB308" />
      <pointLight position={[0, -5, 2]} intensity={1} color="#38BDF8" />

      <ScrollControls pages={3} damping={0.15}>
        <group position={[0, 0, 0]}>
          {coaches.map((coach, index) => (
            <Card3D
              key={coach.name}
              coach={coach}
              index={index}
              total={coaches.length}
              onSelect={onSelectCoach}
            />
          ))}
        </group>
      </ScrollControls>
    </>
  );
}

export default function Coaches() {
  const [selectedCoach, setSelectedCoach] = useState(null);

  return (
    <div className="relative w-full h-screen bg-[#070b14] overflow-hidden select-none font-sans">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />

      <header className="absolute top-6 left-0 right-0 z-10 flex flex-col items-center pointer-events-none text-center px-4">
       
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
          Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500">Star Coaches</span>
        </h1>
         
      </header>

      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 50 }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <Scene onSelectCoach={setSelectedCoach} />
      </Canvas>

      <AnimatePresence>
        {selectedCoach && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative w-full max-w-xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-yellow-500/60 rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col text-white"
            >
              <button
                onClick={() => setSelectedCoach(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-yellow-400 transition-colors border border-yellow-500/30"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <img
                      src={selectedCoach.image}
                      alt={selectedCoach.name}
                      className="w-32 h-32 sm:w-36 sm:h-36 object-cover rounded-2xl border-2 border-yellow-400 shadow-xl shadow-yellow-500/20"
                    />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-yellow-400">
                    {selectedCoach.name}
                  </h2>
                  <p className="text-sm font-semibold text-slate-300 mt-1">
                    {selectedCoach.title}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-400 mt-3 leading-relaxed max-w-md">
                    {selectedCoach.description}
                  </p>
                </div>

                {selectedCoach.achievements?.length > 0 && (
                  <div className="space-y-2.5">
                    <h3 className="text-sm font-bold text-yellow-400 uppercase tracking-wider flex items-center gap-2">
                      <Trophy className="w-4 h-4" /> Key Achievements
                    </h3>
                    <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/60 space-y-2">
                      {selectedCoach.achievements.map((item, idx) => (
                        <div key={idx} className="text-xs sm:text-sm text-slate-200 flex items-start gap-2">
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedCoach.coaching?.length > 0 && (
                  <div className="space-y-2.5">
                    <h3 className="text-sm font-bold text-yellow-400 uppercase tracking-wider flex items-center gap-2">
                      <Award className="w-4 h-4" /> Coaching Specialization
                    </h3>
                    <ul className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/60 space-y-1.5 list-disc list-inside text-xs sm:text-sm text-slate-300">
                      {selectedCoach.coaching.map((c, idx) => (
                        <li key={idx}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t border-slate-800">
                  {selectedCoach.fideId && selectedCoach.fideId !== "XXXXXXX" && (
                    <a
                      href={`https://ratings.fide.com/profile/${selectedCoach.fideId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2.5 px-4 rounded-xl text-sm transition-all"
                    >
                      <ExternalLink className="w-4 h-4" /> FIDE Profile
                    </a>
                  )}
                  <button
                    onClick={() => setSelectedCoach(null)}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-2.5 px-4 rounded-xl text-sm border border-slate-700 transition-all"
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