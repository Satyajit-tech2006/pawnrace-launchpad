import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";

/* -------------------------------------------------------------------------- */
/* 3D Gold Pawn with Glowing Orbit Rings                                      */
/* -------------------------------------------------------------------------- */

function LoadingScene3D() {
  const pawnRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();

  const profile = [
    new THREE.Vector2(0.52, 0.0),
    new THREE.Vector2(0.52, 0.08),
    new THREE.Vector2(0.48, 0.12),
    new THREE.Vector2(0.44, 0.14),
    new THREE.Vector2(0.38, 0.22),
    new THREE.Vector2(0.24, 0.52),
    new THREE.Vector2(0.23, 0.56),
    new THREE.Vector2(0.34, 0.62),
    new THREE.Vector2(0.34, 0.70),
    new THREE.Vector2(0.22, 0.74),
    new THREE.Vector2(0.18, 0.78),
  ];

  const bodyGeo = new THREE.LatheGeometry(profile, 64);
  const headGeo = new THREE.SphereGeometry(0.25, 36, 36);

  useFrame((_, delta) => {
    if (pawnRef.current) {
      pawnRef.current.rotation.y += delta * 1.8;
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 1.4;
      ring1Ref.current.rotation.x += delta * 0.8;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y += delta * 1.6;
      ring2Ref.current.rotation.z -= delta * 0.9;
    }
  });

  return (
    <Float speed={3} rotationIntensity={0.25} floatIntensity={0.5}>
      {/* Centered Rotating Pawn */}
      <group ref={pawnRef} position={[0, -0.42, 0]} scale={1.25}>
        <mesh geometry={bodyGeo} castShadow>
          <meshStandardMaterial
            color="#F5C042"
            metalness={0.92}
            roughness={0.14}
            emissive="#D97706"
            emissiveIntensity={0.35}
          />
        </mesh>
        <mesh geometry={headGeo} position={[0, 0.98, 0]} castShadow>
          <meshStandardMaterial
            color="#FDE047"
            metalness={0.9}
            roughness={0.12}
            emissive="#EAB308"
            emissiveIntensity={0.45}
          />
        </mesh>
      </group>

      {/* Cybernetic Gyro Halo Ring 1 */}
      <mesh ref={ring1Ref} position={[0, 0.2, 0]}>
        <torusGeometry args={[1.3, 0.02, 16, 64]} />
        <meshBasicMaterial color="#FACC15" transparent opacity={0.65} />
      </mesh>

      {/* Cybernetic Gyro Halo Ring 2 */}
      <mesh ref={ring2Ref} position={[0, 0.2, 0]}>
        <torusGeometry args={[1.5, 0.015, 16, 64]} />
        <meshBasicMaterial color="#38BDF8" transparent opacity={0.45} />
      </mesh>
    </Float>
  );
}

/* -------------------------------------------------------------------------- */
/* Dynamic Letter-by-Letter Stagger Variants                                  */
/* -------------------------------------------------------------------------- */

const letterContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const singleLetterVariants = {
  hidden: { opacity: 0, y: 25, scale: 0.6, rotateX: -60 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: {
      type: "spring",
      damping: 10,
      stiffness: 160,
    },
  },
};

const brandLetters = [
  { char: "P", highlight: false },
  { char: "a", highlight: false },
  { char: "w", highlight: false },
  { char: "n", highlight: false },
  { char: "R", highlight: true },
  { char: "a", highlight: true },
  { char: "c", highlight: true },
  { char: "e", highlight: true },
];

const loadingQuotes = [
  "Setting the Grandmaster board...",
  "Calibrating tactical engine...",
  "Aligning opening theory...",
  "Preparing FIDE master insights...",
];

/* -------------------------------------------------------------------------- */
/* Main Loader Component                                                      */
/* -------------------------------------------------------------------------- */

export default function Loader() {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % loadingQuotes.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#070b14] flex flex-col items-center justify-center select-none overflow-hidden px-4">
      {/* Background Volumetric Neon Glows */}
      <div className="absolute w-64 sm:w-96 h-64 sm:h-96 bg-yellow-500/15 rounded-full blur-[110px] sm:blur-[140px] pointer-events-none -top-10" />
      <div className="absolute w-64 sm:w-96 h-64 sm:h-96 bg-sky-600/15 rounded-full blur-[110px] sm:blur-[140px] pointer-events-none -bottom-10" />

      {/* 3D Floating Canvas Stage */}
      <div className="w-52 h-52 sm:w-64 sm:h-64 lg:w-72 lg:h-72 relative flex items-center justify-center">
        <Canvas camera={{ position: [0, 0, 3.4], fov: 45 }}>
          <ambientLight intensity={1.4} />
          <directionalLight position={[5, 8, 4]} intensity={2.8} color="#ffffff" />
          <pointLight position={[-4, -2, -1]} intensity={2.5} color="#FBBF24" />
          <pointLight position={[3, -2, 2]} intensity={2.0} color="#38BDF8" />
          <LoadingScene3D />
          <Sparkles count={45} scale={5} size={2.5} speed={0.4} color="#FACC15" opacity={0.7} />
        </Canvas>
      </div>

      {/* Staggered Letter-by-Letter "PawnRace" Title */}
      <motion.div
        variants={letterContainerVariants}
        initial="hidden"
        animate="visible"
        className="flex items-center justify-center tracking-tight text-3xl sm:text-4xl lg:text-5xl font-black mt-2 select-none"
      >
        {brandLetters.map((item, idx) => (
          <motion.span
            key={idx}
            variants={singleLetterVariants}
            className={`inline-block ${
              item.highlight
                ? "text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500 drop-shadow-[0_0_15px_rgba(250,204,21,0.4)]"
                : "text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]"
            }`}
          >
            {item.char}
          </motion.span>
        ))}
      </motion.div>

      {/* Dynamic Subtitle / Quotes */}
      <div className="h-6 mt-3 flex items-center justify-center overflow-hidden">
        <motion.p
          key={quoteIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35 }}
          className="text-xs sm:text-sm text-slate-400 font-mono tracking-wider uppercase text-center"
        >
          {loadingQuotes[quoteIndex]}
        </motion.p>
      </div>

      {/* Futuristic Progress Tracker Bar */}
      <div className="relative w-48 sm:w-56 h-1.5 bg-slate-900/90 rounded-full overflow-hidden border border-yellow-500/25 mt-5 shadow-inner">
        <motion.div
          className="h-full bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 rounded-full shadow-[0_0_12px_#facc15]"
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </div>
  );
}