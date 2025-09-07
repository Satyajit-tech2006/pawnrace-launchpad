import React from "react";
import { motion } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx"; // 1. Import our useAuth hook

const ChessPawnIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className={className} fill="currentColor">
    <path d="M320 96c0-53-43-96-96-96S128 43 128 96s43 96 96 96 96-43 96-96zM224 224c-79.5 0-144 64.5-144 144v32h288v-32c0-79.5-64.5-144-144-144zm-96 96c0-8.8 7.2-16 16-16h160c8.8 0 16 7.2 16 16v32H128v-32zm192 64H128v64h192v-64z" />
  </svg>
);

const DashboardNavbar = () => {
  // 2. Get the real user and logout function from our context
  const { user, logout } = useAuth(); 
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to home after logout
  };

  return (
    <motion.nav
      className="fixed w-full top-0 left-0 z-50 bg-black shadow-lg"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <NavLink to="/" className="flex items-center space-x-3 cursor-pointer">
            <motion.div
              animate={{ filter: ["drop-shadow(0 0 2px #fbbd23)", "drop-shadow(0 0 15px #fbbd23)", "drop-shadow(0 0 2px #fbbd23)"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChessPawnIcon className="h-8 w-8 md:h-10 md:w-10 text-amber-400" />
            </motion.div>
            <div>
              <span className="text-xl md:text-2xl font-bold text-amber-400">PawnRace</span>
              <p className="hidden sm:block text-xs font-medium text-amber-500 -mt-1">Moves That Make Champions</p>
            </div>
          </NavLink>

          {/* Right Section */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* 3. Display the real user's fullname with a fallback */}
            <span className="text-white font-semibold text-base md:text-lg text-center md:text-left">
              Hi, {user?.fullname || "User"}
            </span>

            {/* Logout Button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <button
                onClick={handleLogout} // 4. Wire up the real logout function
                className="flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl shadow-md hover:from-red-700 hover:to-red-800 hover:shadow-red-500/40 hover:shadow-lg transition-all duration-300 ease-in-out font-bold text-sm md:text-base"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V5m0 14h1a2 2 0 002-2v-3m0-4V7a2 2 0 00-2-2h-1" /></svg>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default DashboardNavbar;

