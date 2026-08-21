import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, ArrowRight } from 'lucide-react';

/* -------------------------------------------------------------------------- */
/* GLOBAL 3D ASSETS (Created once to save massive GPU memory)                 */
/* -------------------------------------------------------------------------- */

const pawnProfile = [
  new THREE.Vector2(0.48, 0),
  new THREE.Vector2(0.48, 0.08),
  new THREE.Vector2(0.38, 0.12),
  new THREE.Vector2(0.28, 0.38),
  new THREE.Vector2(0.32, 0.42),
  new THREE.Vector2(0.18, 0.65),
  new THREE.Vector2(0.18, 0.72),
  new THREE.Vector2(0.28, 0.76),
  new THREE.Vector2(0.22, 0.8),
];

// OPTIMIZATION: Reduced segments drastically. Visually identical in the background.
const bodyGeo = new THREE.LatheGeometry(pawnProfile, 24); 
const headGeo = new THREE.SphereGeometry(0.24, 24, 24);

// OPTIMIZATION: MeshPhysicalMaterial is very heavy. Declaring it globally means 
// the GPU only compiles this complex clearcoat shader exactly once.
const bodyMat = new THREE.MeshPhysicalMaterial({
  color: "#0f172a",
  metalness: 0.9,
  roughness: 0.2,
  clearcoat: 1,
  clearcoatRoughness: 0.1,
  emissive: "#ca8a04",
  emissiveIntensity: 0.1
});

const headMat = new THREE.MeshPhysicalMaterial({
  color: "#facc15",
  metalness: 0.8,
  roughness: 0.15,
  clearcoat: 1,
  emissive: "#facc15",
  emissiveIntensity: 0.2
});

/* -------------------------------------------------------------------------- */
/* 3D Background Elements                                                     */
/* -------------------------------------------------------------------------- */

// Procedural high-detail 3D Pawn
function BackgroundPawn({ isMobile }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.2 - (isMobile ? 1.5 : 2);
    }
  });

  return (
    <group ref={groupRef} position={[isMobile ? 0 : 5, -2, -3]} scale={isMobile ? 4.5 : 6.5}>
      <mesh geometry={bodyGeo} material={bodyMat} />
      <mesh geometry={headGeo} material={headMat} position={[0, 0.99, 0]} />
    </group>
  );
}

function Footer3DScene() {
  const { size } = useThree();
  const isMobile = size.width < 768;

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={2} color="#facc15" />
      <pointLight position={[-10, -10, -5]} intensity={1.5} color="#38bdf8" />
      
      <BackgroundPawn isMobile={isMobile} />
      
      {/* OPTIMIZATION: Lowered max sparkles slightly */}
      <Sparkles 
        count={isMobile ? 25 : 50} 
        scale={15} 
        size={isMobile ? 2 : 3} 
        speed={0.3} 
        color="#facc15" 
        opacity={0.4} 
      />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Main HTML Footer Component                                                 */
/* -------------------------------------------------------------------------- */

const ChessPawnIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className={className} fill="currentColor">
    <path d="M320 96c0-53-43-96-96-96S128 43 128 96s43 96 96 96 96-43 96-96zM224 224c-79.5 0-144 64.5-144 144v32h288v-32c0-79.5-64.5-144-144-144zm-96 96c0-8.8 7.2-16 16-16h160c8.8 0 16 7.2 16 16v32H128v-32zm192 64H128v64h192v-64z"/>
  </svg>
);

export default function Footer() {
  const footerNavigationLinks = {
    'Company': [
      { name: 'About Us', to: '/aboutus' },
    ],
    'Contact Us': [
      { name: '+91 78945 89238', icon: Phone },
      { name: 'academy@pawnrace.com', icon: Mail },
      { name: 'Puri, Odisha, India', icon: MapPin },
    ],
  };

  const socialMediaLinks = [
    { icon: Facebook, href: 'https://www.facebook.com/share/1FqjqyDeNH/', label: 'Facebook' },
    { icon: Instagram, href: 'https://www.instagram.com/pawnrace/', label: 'Instagram' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' }
  ];

  const handleSubscribe = () => {
    window.open("https://docs.google.com/forms/d/e/1FAIpQLSdiz9pqLM32FBZHNBh6EQPeAnOG5K3qevs9JhgGvqptWU8P4w/viewform?usp=dialog", "_blank");
  };

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <footer className="relative bg-[#070b14] text-slate-300 overflow-hidden border-t border-yellow-500/20">
      
      {/* 3D Background Canvas (Pointer events disabled so users can click HTML links) */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
        {/* OPTIMIZATION: Added dpr cap and low-power preference */}
        <Canvas 
          camera={{ position: [0, 0, 8], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{ powerPreference: "low-power", antialias: true }}
        >
          <Footer3DScene />
        </Canvas>
      </div>

      {/* Radial Gradient Overlays for blending */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#070b14] to-transparent z-0" />
      <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-[#070b14] via-[#070b14]/80 to-transparent z-0" />

      {/* Main Content Container */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 pt-20 pb-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Column */}
          <motion.div variants={itemVariants} className="lg:col-span-4">
            <Link to="/" className="flex items-center space-x-3 mb-6 group w-fit">
              <div className="p-2.5 bg-slate-900/80 rounded-xl border border-yellow-500/30 group-hover:border-yellow-400 transition-colors shadow-lg shadow-yellow-500/10">
                <ChessPawnIcon className="h-7 w-7 text-yellow-400" />
              </div>
              <span className="text-3xl font-black text-white tracking-tight">PawnRace</span>
            </Link>
            
            <p className="text-slate-400 mb-8 max-w-sm leading-relaxed text-sm sm:text-base">
              The world's leading online chess academy connecting ambitious students 
              with elite FIDE-rated grandmasters for personalized, data-driven chess education.
            </p>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialMediaLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="group relative p-3 bg-slate-900/80 rounded-full border border-slate-700/50 hover:border-yellow-400 hover:bg-yellow-400/10 transition-all duration-300 hover:-translate-y-1"
                >
                  <social.icon className="h-5 w-5 text-slate-400 group-hover:text-yellow-400 transition-colors" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Navigation Links Column */}
          <motion.div variants={itemVariants} className="lg:col-span-2 lg:col-start-6">
            <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              Company
              <div className="h-0.5 w-6 bg-yellow-400 rounded-full"></div>
            </h3>
            <ul className="space-y-4">
              {footerNavigationLinks['Company'].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.to}
                    className="group flex items-center text-sm text-slate-400 hover:text-yellow-400 transition-colors duration-200 w-fit"
                  >
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 mr-2" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Us Column */}
          <motion.div variants={itemVariants} className="lg:col-span-3">
            <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              Contact Us
              <div className="h-0.5 w-6 bg-yellow-400 rounded-full"></div>
            </h3>
            <ul className="space-y-4">
              {footerNavigationLinks['Contact Us'].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-400">
                    <div className="p-1.5 bg-slate-900 rounded-md border border-slate-800 mt-0.5">
                      <Icon className="h-4 w-4 text-yellow-400" />
                    </div>
                    <span className="mt-1">{item.name}</span>
                  </li>
                );
              })}
            </ul>
          </motion.div>

          {/* Newsletter Column */}
          <motion.div variants={itemVariants} className="lg:col-span-3">
            <div className="p-6 bg-slate-900/60 rounded-2xl border border-slate-800 backdrop-blur-md">
              <h3 className="text-lg font-bold text-white mb-2">Stay Updated</h3>
              <p className="text-xs text-slate-400 mb-5 leading-relaxed">
                Get grandmaster tips, tournament updates, and exclusive coaching offers delivered directly.
              </p>
              
              <button 
                onClick={handleSubscribe}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40 active:scale-95"
              >
                Subscribe Now
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

        </div>

        {/* Bottom Bar */}
        <motion.div 
          variants={itemVariants}
          className="pt-8 border-t border-slate-800/80 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <div className="text-slate-500 text-xs sm:text-sm text-center md:text-left">
            © {new Date().getFullYear()} <span className="text-slate-300 font-semibold">PawnRace Chess Academy</span>. All rights reserved.
          </div>
          
          <div className="flex space-x-6 text-xs sm:text-sm text-slate-500">
            <Link to="#" className="hover:text-yellow-400 transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-yellow-400 transition-colors">Terms of Service</Link>
          </div>
        </motion.div>
      </motion.div>

    </footer>
  );
}