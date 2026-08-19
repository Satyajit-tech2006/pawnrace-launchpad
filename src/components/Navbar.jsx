import React, { useState, useEffect, useRef, useMemo } from "react";
import { Menu, X, LogOut, User, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "./AuthModal";
import { Button } from "@/components/ui/button";

/* -------------------------------------------------------------------------- */
/* 3D Mini Logo Piece Component                                               */
/* -------------------------------------------------------------------------- */

function Mini3DPawn({ isHovered }) {
  const meshRef = useRef();

  const { bodyGeo, headGeo } = useMemo(() => {
    const profile = [
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
    return {
      bodyGeo: new THREE.LatheGeometry(profile, 32),
      headGeo: new THREE.SphereGeometry(0.24, 24, 24),
    };
  }, []);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * (isHovered ? 3.5 : 1.2);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
      <group ref={meshRef} position={[0, -0.45, 0]} scale={0.9}>
        <mesh geometry={bodyGeo}>
          <meshStandardMaterial
            color={isHovered ? "#FDE047" : "#FACC15"}
            metalness={0.9}
            roughness={0.2}
            emissive="#CA8A04"
            emissiveIntensity={isHovered ? 0.4 : 0.2}
          />
        </mesh>
        <mesh geometry={headGeo} position={[0, 0.99, 0]}>
          <meshStandardMaterial
            color={isHovered ? "#FDE047" : "#FACC15"}
            metalness={0.9}
            roughness={0.15}
            emissive="#EAB308"
            emissiveIntensity={isHovered ? 0.5 : 0.25}
          />
        </mesh>
      </group>
    </Float>
  );
}

function Logo3DCanvas({ isHovered }) {
  return (
    <div className="w-10 h-10 sm:w-12 sm:h-12 relative flex items-center justify-center pointer-events-none">
      <Canvas camera={{ position: [0, 0, 2.5], fov: 45 }} className="w-full h-full">
        <ambientLight intensity={1.2} />
        <directionalLight position={[3, 5, 2]} intensity={2.5} color="#fff" />
        <pointLight position={[-3, -2, -1]} intensity={1.5} color="#38BDF8" />
        <Mini3DPawn isHovered={isHovered} />
      </Canvas>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main Navbar Component                                                      */
/* -------------------------------------------------------------------------- */

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [logoHovered, setLogoHovered] = useState(false);

  const { user, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => setHasScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { title: "Home", href: "/" },
    // { title: "Coaches", href: "/coaches" },
    { title: "Contact", href: "/contact" },
    { title: "Our Vision", href: "/ourvission" },
    { title: "About Us", href: "/aboutus" },
    { title: "Curriculum", href: "/Curriculum" },
  ];

  const handleAuthClick = (mode) => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const menuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.3, staggerChildren: 0.05 },
    },
    exit: { opacity: 0, height: 0, transition: { duration: 0.2 } },
  };

  const linkVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <>
      <motion.nav
        className={`fixed w-full top-0 left-0 z-40 transition-all duration-300 ${
          hasScrolled
            ? "bg-[#070b14]/90 backdrop-blur-xl border-b border-yellow-500/20 shadow-2xl shadow-black/60 py-2.5"
            : "bg-gradient-to-b from-[#070b14]/95 via-[#070b14]/70 to-transparent py-4"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            
            {/* Brand / Logo */}
            <NavLink
              to="/"
              onMouseEnter={() => setLogoHovered(true)}
              onMouseLeave={() => setLogoHovered(false)}
              className="flex items-center gap-2.5 sm:gap-3 group select-none"
            >
              <div className="relative flex items-center justify-center p-1 rounded-xl bg-slate-900/80 border border-yellow-500/30 group-hover:border-yellow-400 group-hover:shadow-[0_0_15px_rgba(234,179,8,0.3)] transition-all duration-300">
                <Logo3DCanvas isHovered={logoHovered} />
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white group-hover:text-yellow-400 transition-colors">
                  Pawn<span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">Race</span>
                </span>
                <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 -mt-1 tracking-wider uppercase">
                  Moves That Make Champions
                </span>
              </div>
            </NavLink>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1 bg-slate-900/70 border border-slate-800/80 backdrop-blur-md px-3 py-1.5 rounded-full shadow-inner">
              {navLinks.map((link) => (
                <NavLink
                  key={link.href}
                  to={link.href}
                  className={({ isActive }) =>
                    `px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 shadow-md shadow-yellow-500/20"
                        : "text-slate-300 hover:text-yellow-400 hover:bg-slate-800/60"
                    }`
                  }
                >
                  {link.title}
                </NavLink>
              ))}
            </div>

            {/* Desktop User / Auth Button */}
            <div className="hidden lg:flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-3 bg-slate-900/80 border border-slate-800 px-3.5 py-1.5 rounded-full">
                  <div className="flex items-center space-x-2 text-yellow-400">
                    <div className="w-7 h-7 bg-yellow-400/20 rounded-full flex items-center justify-center border border-yellow-500/40">
                      <User size={14} className="text-yellow-400" />
                    </div>
                    <span className="font-semibold text-xs sm:text-sm text-slate-200">{user?.name}</span>
                  </div>
                  <Button
                    onClick={logout}
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2.5 text-xs text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors"
                  >
                    <LogOut size={14} className="mr-1" />
                    Logout
                  </Button>
                </div>
              ) : (
                <button
                  onClick={() => handleAuthClick("login")}
                  className="relative group px-6 py-2 rounded-full font-bold text-xs sm:text-sm uppercase tracking-wider bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 shadow-lg shadow-yellow-500/25 hover:shadow-yellow-500/40 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <span className="relative z-10 flex items-center gap-1.5">
                      Login
                  </span>
                </button>
              )}
            </div>

            {/* Mobile / Tablet Menu Button */}
            <div className="lg:hidden flex items-center gap-2">
              <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Menu"
                className="p-2 rounded-xl bg-slate-900/80 border border-yellow-500/30 text-yellow-400 hover:bg-slate-800 transition-colors"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile / Tablet Drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="lg:hidden bg-[#070b14]/95 backdrop-blur-2xl border-b border-yellow-500/20 overflow-hidden mt-3"
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="px-5 pt-3 pb-6 space-y-2 max-w-md mx-auto">
                {navLinks.map((link) => (
                  <motion.div variants={linkVariants} key={link.href}>
                    <NavLink
                      to={link.href}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `block px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                          isActive
                            ? "bg-yellow-400 text-slate-950 font-bold shadow-md shadow-yellow-500/20"
                            : "text-slate-300 hover:text-yellow-400 hover:bg-slate-900"
                        }`
                      }
                    >
                      {link.title}
                    </NavLink>
                  </motion.div>
                ))}

                <motion.div variants={linkVariants} className="pt-3 border-t border-slate-800 space-y-3">
                  {isAuthenticated ? (
                    <div className="space-y-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                      <div className="flex items-center space-x-2 text-yellow-400 px-2">
                        <User size={18} />
                        <span className="font-semibold text-sm text-slate-200">{user?.name}</span>
                      </div>
                      <Button
                        onClick={() => {
                          logout();
                          setIsOpen(false);
                        }}
                        variant="outline"
                        className="w-full border-red-500/40 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl text-xs font-bold"
                      >
                        <LogOut size={14} className="mr-2" />
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        handleAuthClick("login");
                        setIsOpen(false);
                      }}
                      className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 shadow-lg shadow-yellow-500/25 flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" /> Login to Account
                    </button>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
        onSwitchMode={setAuthMode}
      />
    </>
  );
};

export default Navbar;