import React, { useState, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Sparkles, Text, Image as DreiImage, Html, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Users, ChevronLeft, ChevronRight, Sparkles as SparkleIcon, ExternalLink } from "lucide-react";

// IMAGES
import hariselvan from "../assets/hariselvan.jpg";
import dibyesh from "../assets/dibyesh.jpg";
import sharwin from "../assets/sharwin.jpg";
import abhudoyaU11 from "../assets/abhudoyaU11.jpg";
import abhudoyaU19 from "../assets/abhudoyaU19.jpg";
import izian from "../assets/izian.jpg";
import joshua from "../assets/joshua.jpg";

const students = [
  {
    name: "Hariselvan P",
    achievement: "U-11 State Champion 🏆 (6.5/7)",
    image: hariselvan,
    tag: "State Champion",
  },
  {
    name: "Dibyesh",
    achievement: "State Chess Tournament Winner 🏆",
    image: dibyesh,
    tag: "State Winner",
  },
  {
    name: "Sharwin",
    achievement: "Malaysia District Champion 🏆",
    image: sharwin,
    tag: "International",
  },
  {
    name: "Sanal Vaibhav",
    achievement: "Under 9 State Championship - 3rd Place",
    image: null,
    tag: "U-9 State",
  },
  {
    name: "Amruta Priyalaxmi",
    achievement: "Under 13 State Champion",
    image: null,
    tag: "U-13 Champion",
  },
  {
    name: "PM Shri",
    achievement: "Navodaya Vidyalaya Champion",
    image: null,
    tag: "School Meet",
  },
  {
    name: "Abhudoya",
    achievement: "U-19 District Champion! 🏆",
    image: abhudoyaU19,
    tag: "U-19 Champion",
  },
  {
    name: "Abhudoya",
    achievement: "3rd Position - Jorhat District U-11 (5/6 pts)",
    image: abhudoyaU11,
    tag: "District 3rd",
  },
  {
    name: "Izian",
    achievement: "U-9 School Tournament 2nd Place, UP 🥈",
    image: izian,
    tag: "U-9 Silver",
  },
  {
    name: "Hari Selvan",
    achievement: "Runner's Up - 1st HIET State Level 🥈",
    image: hariselvan,
    tag: "State Runner-up",
  },
  {
    name: "Sharwin",
    achievement: "U12 Winner - Tamil Vizha Cup, Malaysia 🏆",
    image: sharwin,
    tag: "Malaysia 2026",
  },
  {
    name: "Joshua Lobo",
    achievement: "Best Improvement: Beg to Intermediate in 3mo 📈",
    image: joshua,
    tag: "Rising Star",
  },
];

// Individual 3D Student Card with perfect RoundedBox Geometry
function StudentCard3D({ student, index, activeIndex, total, onSelect, isMobile }) {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);

  const cardW = isMobile ? 2.2 : 2.5;
  const cardH = isMobile ? 3.3 : 3.6;
  const isCurrent = (index - activeIndex + total) % total === 0;

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const angleOffset = ((index - activeIndex + total) % total) * ((Math.PI * 2) / total);
    const radius = isMobile ? 4.0 : 5.2;

    const targetX = Math.sin(angleOffset) * radius;
    const targetZ = -Math.cos(angleOffset) * radius + (isMobile ? 2.0 : 2.6);
    const targetRotY = -angleOffset;

    groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, targetX, 5, delta);
    groupRef.current.position.z = THREE.MathUtils.damp(groupRef.current.position.z, targetZ, 5, delta);
    groupRef.current.position.y = THREE.MathUtils.damp(
      groupRef.current.position.y,
      isCurrent ? (isMobile ? 0.1 : 0.2) : hovered ? 0.1 : -0.2,
      5,
      delta
    );

    groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetRotY, 5, delta);
  });

  return (
    <group
      ref={groupRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => onSelect(index)}
    >
      <Float speed={isCurrent ? 2 : 0} rotationIntensity={0.08} floatIntensity={0.15}>
        {/* Glowing Golden Outer Frame */}
        <RoundedBox
          args={[cardW + 0.08, cardH + 0.08, 0.06]}
          radius={0.16}
          smoothness={4}
          position={[0, 0, -0.02]}
        >
          <meshBasicMaterial color={isCurrent ? "#FACC15" : hovered ? "#EAB308" : "#713F12"} />
        </RoundedBox>

        {/* Card Dark Body */}
        <RoundedBox
          args={[cardW, cardH, 0.08]}
          radius={0.14}
          smoothness={4}
          position={[0, 0, 0]}
        >
          <meshStandardMaterial
            color={isCurrent ? "#0f172a" : "#080d1a"}
            metalness={0.7}
            roughness={0.3}
          />
        </RoundedBox>

        {/* Photo or Monogram */}
        {student.image ? (
          <DreiImage
            url={student.image}
            scale={isMobile ? [1.5, 1.5] : [1.7, 1.7]}
            position={[0, isMobile ? 0.65 : 0.75, 0.08]}
            radius={0.8}
            transparent
          />
        ) : (
          <group position={[0, isMobile ? 0.65 : 0.75, 0.08]}>
            <mesh>
              <circleGeometry args={[isMobile ? 0.75 : 0.85, 32]} />
              <meshStandardMaterial color="#CA8A04" metalness={0.8} roughness={0.2} />
            </mesh>
            <Text
              position={[0, 0, 0.02]}
              fontSize={isMobile ? 0.55 : 0.65}
              color="#000000"
              fontWeight="bold"
              anchorX="center"
              anchorY="middle"
            >
              {student.name.charAt(0)}
            </Text>
          </group>
        )}

        {/* Student Name */}
        <Text
          position={[0, isMobile ? -0.42 : -0.48, 0.08]}
          fontSize={isMobile ? 0.16 : 0.19}
          color={isCurrent ? "#FACC15" : "#FFFFFF"}
          anchorX="center"
          anchorY="middle"
          maxWidth={cardW - 0.2}
          fontWeight="bold"
        >
          {student.name}
        </Text>

        {/* Achievement Text */}
        <Text
          position={[0, isMobile ? -0.78 : -0.88, 0.08]}
          fontSize={isMobile ? 0.09 : 0.105}
          color="#94A3B8"
          anchorX="center"
          anchorY="middle"
          maxWidth={cardW - 0.3}
          textAlign="center"
        >
          {student.achievement}
        </Text>

        {/* HTML Tag Badge */}
        <Html transform position={[0, isMobile ? -1.2 : -1.35, 0.09]} scale={isMobile ? 0.14 : 0.16} center>
          <div
            className={`px-3.5 py-1 rounded-full text-[11px] font-bold tracking-wider flex items-center gap-1.5 shadow-xl whitespace-nowrap select-none transition-all ${
              isCurrent
                ? "bg-yellow-400 text-slate-950 shadow-yellow-500/50 scale-105"
                : "bg-slate-800 text-yellow-400/90 border border-yellow-500/30"
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            {student.tag}
          </div>
        </Html>
      </Float>
    </group>
  );
}

// 3D Scene Controller
function Scene({ activeIndex, onSelect }) {
  const { width } = useThree((state) => state.size);
  const isMobile = width < 768;

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 10, 5]} intensity={1.6} color="#ffffff" />
      <pointLight position={[0, 4, 3]} intensity={3.5} color="#EAB308" />
      <pointLight position={[-6, -2, -2]} intensity={2} color="#38BDF8" />
      <pointLight position={[6, -2, -2]} intensity={2} color="#F59E0B" />

      <group position={[0, isMobile ? 0 : -0.1, 0]}>
        {students.map((student, i) => (
          <StudentCard3D
            key={i}
            student={student}
            index={i}
            activeIndex={activeIndex}
            total={students.length}
            onSelect={onSelect}
            isMobile={isMobile}
          />
        ))}
      </group>

      <Sparkles count={isMobile ? 45 : 85} scale={10} size={2.5} speed={0.4} color="#FACC15" opacity={0.6} />
    </>
  );
}

export default function StudentGlory() {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % students.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + students.length) % students.length);
  };

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % students.length);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchStartX.current - touchEndX;

    if (deltaX > 40) handleNext();
    else if (deltaX < -40) handlePrev();
    setIsPaused(false);
  };

  const currentStudent = students[index];

  return (
    <section className="relative w-full min-h-screen bg-[#070b14] text-white overflow-hidden flex flex-col justify-between py-8 sm:py-12 px-3 sm:px-6 select-none">
      <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[300px] sm:w-[600px] h-[200px] sm:h-[300px] bg-yellow-500/10 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-6 w-48 sm:w-80 h-48 sm:h-80 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 text-center max-w-4xl mx-auto space-y-2.5 px-2">
        

        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight"
        >
          Champions Who Made Their{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500 block sm:inline">
            First Step 🏆
          </span>
        </motion.h1>

        <p className="text-xs sm:text-base text-slate-400 max-w-xl mx-auto">
          Swipe or drag to explore our tournament winners & rising stars.
        </p>
      </div>

      {/* 3D Canvas Stage */}
      <div
        className="relative w-full h-[400px] sm:h-[500px] lg:h-[560px] my-2 sm:my-4 cursor-grab active:cursor-grabbing"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Canvas camera={{ position: [0, 0, 5.5], fov: 50 }}>
          <Scene activeIndex={index} onSelect={(i) => setIndex(i)} />
        </Canvas>

        {/* Orbit Controls (Prev / Next Buttons) */}
        <div className="absolute inset-y-1/2 inset-x-2 sm:inset-x-8 lg:inset-x-12 -translate-y-1/2 flex justify-between pointer-events-none z-20">
          <button
            onClick={handlePrev}
            className="p-2.5 sm:p-3 rounded-full bg-slate-900/90 hover:bg-yellow-400 hover:text-black text-yellow-400 border border-yellow-500/40 backdrop-blur-md pointer-events-auto transition-all shadow-xl hover:scale-110 active:scale-90"
            aria-label="Previous Student"
          >
            <ChevronLeft className="w-5 sm:w-6 h-5 sm:h-6" />
          </button>
          <button
            onClick={handleNext}
            className="p-2.5 sm:p-3 rounded-full bg-slate-900/90 hover:bg-yellow-400 hover:text-black text-yellow-400 border border-yellow-500/40 backdrop-blur-md pointer-events-auto transition-all shadow-xl hover:scale-110 active:scale-90"
            aria-label="Next Student"
          >
            <ChevronRight className="w-5 sm:w-6 h-5 sm:h-6" />
          </button>
        </div>
      </div>

      {/* Active Spotlight Card Info HUD */}
      <div className="relative z-10 flex flex-col items-center max-w-xl mx-auto text-center px-4 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="bg-slate-900/80 border border-yellow-500/30 backdrop-blur-xl px-5 sm:px-6 py-3 sm:py-3.5 rounded-2xl shadow-xl w-full"
          >
            <div className="flex items-center justify-center gap-1.5 text-yellow-400 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-1">
              <Trophy className="w-3.5 h-3.5" /> Spotlight Achievement
            </div>
            <h3 className="text-lg sm:text-2xl font-extrabold text-white">{currentStudent.name}</h3>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">{currentStudent.achievement}</p>
          </motion.div>
        </AnimatePresence>

        {/* Call to Action Button */}
        <div className="mt-5 sm:mt-8 w-full sm:w-auto">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="w-full sm:w-auto bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-bold px-7 sm:px-9 py-3 sm:py-3.5 rounded-full text-sm sm:text-base shadow-[0_10px_25px_rgba(234,179,8,0.3)] flex items-center justify-center gap-2 transition-all cursor-pointer"
            onClick={() =>
              window.open(
                "https://docs.google.com/forms/d/e/1FAIpQLSd368-GnfJjgbQdIeAiU6ro68983N8OPo6upy5n0kDI9YClkA/viewform",
                "_blank"
              )
            }
          >
            <Users className="w-4 sm:w-5 h-4 sm:h-5" /> Join Pawn Race Academy <ExternalLink className="w-3.5 sm:w-4 h-3.5 sm:h-4 ml-0.5" />
          </motion.button>
        </div>

        <p className="text-slate-400 text-[11px] sm:text-xs mt-2.5 font-medium">
          Start your chess training journey with rated grandmasters & certified coaches 🚀
        </p>
      </div>
    </section>
  );
}