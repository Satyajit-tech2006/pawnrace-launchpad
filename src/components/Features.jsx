import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { 
  Video, 
  Users, 
  Calendar, 
  BookOpen, 
  BarChart3, 
  Globe, 
  Shield, 
  Zap,
  Sparkles as SparklesIcon,
  ChevronRight
} from 'lucide-react';
import Navbar from './Navbar';

/* -------------------------------------------------------------------------- */
/* GLOBAL 3D ASSETS (Created once to save massive GPU memory)                 */
/* -------------------------------------------------------------------------- */

// Geometries (Reduced segment counts for background elements)
const baseGeo = new THREE.CylinderGeometry(0.6, 0.75, 0.25, 24);
const midGeo = new THREE.CylinderGeometry(0.45, 0.6, 0.25, 24);
const stemGeo = new THREE.CylinderGeometry(0.25, 0.45, 0.9, 16);
const collarGeo = new THREE.TorusGeometry(0.3, 0.08, 12, 24);
const headGeo = new THREE.SphereGeometry(0.38, 24, 24);

// Materials (Shared across all pawn instances)
const pawnProps = { metalness: 0.8, roughness: 0.2 };
const matYellow = new THREE.MeshStandardMaterial({ color: "#EAB308", ...pawnProps });
const matBlue = new THREE.MeshStandardMaterial({ color: "#38BDF8", ...pawnProps });
const matDarkGold = new THREE.MeshStandardMaterial({ color: "#CA8A04", ...pawnProps });
const matSlate = new THREE.MeshStandardMaterial({ color: "#1E293B", ...pawnProps });
const matCollar = new THREE.MeshStandardMaterial({ color: "#FACC15", metalness: 0.9, roughness: 0.1 });

// --- 3D Chess Pawn Geometry Helper ---
function PawnMesh({ position, material, scale = 1, rotationSpeed = 1 }) {
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.4 * rotationSpeed;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.6} floatIntensity={0.8} position={position}>
      <group ref={meshRef} scale={scale}>
        {/* Base */}
        <mesh position={[0, -0.9, 0]} geometry={baseGeo} material={material} />
        <mesh position={[0, -0.65, 0]} geometry={midGeo} material={material} />
        {/* Body stem */}
        <mesh position={[0, -0.1, 0]} geometry={stemGeo} material={material} />
        {/* Collar ring */}
        <mesh position={[0, 0.4, 0]} geometry={collarGeo} material={matCollar} />
        {/* Head sphere */}
        <mesh position={[0, 0.75, 0]} geometry={headGeo} material={material} />
      </group>
    </Float>
  );
}

// --- 3D Floating Interactive Grid & Elements ---
function Background3DScene() {
  const gridRef = useRef();

  useFrame((state) => {
    // Subtle mouse tilt response
    const { x, y } = state.pointer;
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, x * 1.2, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, y * 0.8, 0.05);
    state.camera.lookAt(0, 0, 0);

    if (gridRef.current) {
      gridRef.current.rotation.z += 0.0008;
    }
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 15, 10]} intensity={1.8} color="#ffffff" />
      <pointLight position={[-8, -5, 5]} intensity={2.5} color="#EAB308" />
      <pointLight position={[8, 5, -5]} intensity={2} color="#38BDF8" />

      {/* Floating Gold & Slate Chess Pieces using Shared Materials */}
      <PawnMesh position={[-4.5, 2.2, -2]} scale={0.75} material={matYellow} rotationSpeed={1.2} />
      <PawnMesh position={[4.6, 2.8, -3]} scale={0.9} material={matBlue} rotationSpeed={-0.8} />
      <PawnMesh position={[-5.2, -2.5, -1.5]} scale={0.8} material={matDarkGold} rotationSpeed={0.9} />
      <PawnMesh position={[5, -2, -2]} scale={0.85} material={matYellow} rotationSpeed={-1.1} />
      <PawnMesh position={[0, -3.8, -4]} scale={1.2} material={matSlate} rotationSpeed={0.5} />

      {/* 3D Wireframe Cyber Chess Floor */}
      <group position={[0, -4, -6]} rotation={[-Math.PI / 2.5, 0, 0]} ref={gridRef}>
        <gridHelper args={[30, 30, 0xEAB308, 0x1E293B]} />
      </group>

      {/* Atmospheric Star/Gold Dust Particles (Optimized count to 45) */}
      <Sparkles count={45} scale={12} size={2.5} speed={0.4} color="#FACC15" opacity={0.6} />
    </>
  );
}

export default function Features() {
  const [hoveredCard, setHoveredCard] = useState(null);

  const platformFeatures = [
    {
      icon: Video,
      title: '1-on-1 Live Chess Classes',
      description: 'Personal attention from FIDE-rated coaches in interactive sessions',
      tag: 'Interactive'
    },
    {
      icon: BarChart3,
      title: 'Real-time Game Review',
      description: 'Analyze your games instantly with AI-powered insights and coach feedback',
      tag: 'AI Powered'
    },
    {
      icon: Calendar,
      title: 'Schedule Flexibility',
      description: 'Book sessions that fit your schedule with 24/7 global availability',
      tag: '24/7 Access'
    },
    {
      icon: BookOpen,
      title: 'Interactive Assignments',
      description: 'Practice with curated tactical puzzles, opening drills, and custom exercises',
      tag: 'Puzzles & Labs'
    },
    {
      icon: Users,
      title: 'Coach Dashboards',
      description: 'Advanced analytics tools for coaches to track student rating progress',
      tag: 'Analytics'
    },
    {
      icon: Zap,
      title: 'Progress Analytics',
      description: 'Detailed insights into accuracy, blunder rates, and rating growth',
      tag: 'Live Metric'
    },
    {
      icon: Shield,
      title: 'Verified FIDE Masters',
      description: 'Learn directly from certified FIDE masters and international arena coaches',
      tag: 'Certified'
    },
    {
      icon: Globe,
      title: 'Global Chess Community',
      description: 'Connect and compete with passionate chess players worldwide',
      tag: 'Tournaments'
    }
  ];

  return (
    <div className="min-h-screen bg-[#070b14] text-white relative overflow-hidden flex flex-col justify-between">
      <Navbar />

      {/* 3D Background Canvas with Optimizations */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Canvas 
          camera={{ position: [0, 0, 7], fov: 45 }}
          dpr={[1, 1.5]} 
          gl={{ powerPreference: "low-power", antialias: true }}
        >
          <Background3DScene />
        </Canvas>
      </div>

      {/* Ambient Lighting Overlays */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-yellow-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Content Section */}
      <section id="features" className="relative z-10 py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
           
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
            Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500">PawnRace?</span>
          </h2>
          
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Experience chess education elevated with 3D real-time game reviews, 
            tailored grandmaster instruction, and modern data-driven analytics.
          </p>
        </div>

        {/* Features 3D Tilt Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {platformFeatures.map((feature, index) => {
            const Icon = feature.icon;
            const isHovered = hoveredCard === index;

            return (
              <div
                key={index}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`relative group rounded-2xl p-6 transition-all duration-300 backdrop-blur-xl border ${
                  isHovered 
                    ? 'bg-slate-900/85 border-yellow-400 -translate-y-2 shadow-[0_15px_35px_rgba(234,179,8,0.2)]' 
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Floating Category Badge */}
                <div className="flex items-center justify-between mb-5">
                  <div className={`p-3 rounded-xl transition-all duration-300 ${
                    isHovered 
                      ? 'bg-yellow-400 text-slate-950 scale-110 shadow-lg shadow-yellow-500/40' 
                      : 'bg-slate-800/80 text-yellow-400 border border-slate-700'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider bg-slate-800/40 px-2.5 py-1 rounded-md border border-slate-700/50">
                    {feature.tag}
                  </span>
                </div>

                {/* Feature Title */}
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                  {feature.title}
                </h3>

                {/* Feature Description */}
                <p className="text-slate-400 text-sm leading-relaxed">
                  {feature.description}
                </p>

                {/* Bottom Interactive Glow Accent */}
                <div className={`absolute inset-x-6 bottom-0 h-0.5 transition-all duration-300 ${
                  isHovered ? 'bg-gradient-to-r from-transparent via-yellow-400 to-transparent' : 'bg-transparent'
                }`} />
              </div>
            );
          })}
        </div>

        {/* CTA Footer */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
           
        </div>
      </section>
    </div>
  );
}