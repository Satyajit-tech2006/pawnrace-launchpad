import React, { useState } from "react";
import { Menu, X, LogOut, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "./AuthModal";
import { Button } from "@/components/ui/button";

const ChessPawnIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
    className={className}
    fill="currentColor"
  >
    <path d="M320 96c0-53-43-96-96-96S128 43 128 96s43 96 96 96 96-43 96-96zM224 224c-79.5 0-144 64.5-144 144v32h288v-32c0-79.5-64.5-144-144-144zm-96 96c0-8.8 7.2-16 16-16h160c8.8 0 16 7.2 16 16v32H128v-32zm192 64H128v64h192v-64z" />
  </svg>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const { user, logout, isAuthenticated } = useAuth();

  React.useEffect(() => {
    const handleScroll = () => setHasScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { title: "Home", href: "/" },
    { title: "Coaches", href: "/coaches" },
    { title: "Contact", href: "/contact" },
    { title: "Ourvision", href: "/ourvission" },
    { title: "About Us", href: "/aboutus" },
    { title: "Curriculum", href: "/Curriculum" },
  ];

  const handleAuthClick = (mode) => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.07, duration: 0.3 },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  const linkVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <motion.nav
        className={`fixed w-full top-0 left-0 z-40 transition-all duration-300 bg-black/95 backdrop-blur-md shadow-lg ${
          hasScrolled ? "shadow-xl" : ""
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <NavLink
              to="/"
              className="flex items-center space-x-3 cursor-pointer"
            >
              <motion.div
                animate={{
                  filter: [
                    "drop-shadow(0 0 6px #facc15)",
                    "drop-shadow(0 0 12px #facc15)",
                    "drop-shadow(0 0 6px #facc15)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <ChessPawnIcon className="h-10 w-10 text-yellow-400" />
              </motion.div>
              <div>
                <span className="text-2xl font-bold text-yellow-400">
                  PawnRace
                </span>
                <p className="text-xs font-medium text-yellow-400/80 -mt-1">
                  Moves That Make Champions
                </p>
              </div>
            </NavLink>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-3 bg-[#1e293b] px-4 py-2 rounded-2xl shadow-md">
              {navLinks.map((link) => (
                <NavLink
                  key={link.href}
                  to={link.href}
                  className={({ isActive }) =>
                    `px-6 py-2 rounded-xl font-semibold text-lg transition-all duration-300 ${
                      isActive
                        ? "bg-yellow-400 text-black shadow-md"
                        : "text-yellow-400 hover:bg-yellow-400/20"
                    }`
                  }
                >
                  {link.title}
                </NavLink>
              ))}
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 text-yellow-400">
                    <div className="w-8 h-8 bg-yellow-400/20 rounded-full flex items-center justify-center">
                      <User size={16} className="text-yellow-400" />
                    </div>
                    <span className="font-medium">{user?.name}</span>
                  </div>
                  <Button
                    onClick={logout}
                    variant="outline"
                    size="sm"
                    className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <>
                  <Button
        onClick={() => handleAuthClick("login")}
        variant="outline"
        className="relative group border-2 border-yellow-400 bg-yellow-400 text-black font-bold 
        px-8 py-3 rounded-xl overflow-hidden
        transition-all duration-300 ease-in-out 
        shadow-[0_0_15px_rgba(255,215,0,0.5)]
        hover:shadow-[0_0_30px_rgba(255,215,0,0.9)]
        hover:bg-yellow-300 hover:text-black"
      >
        {/* Animated Gradient Glow */}
        <span
          className="absolute inset-0 bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 
          opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500"
        />

        {/* Button Text */}
        <span className="relative z-10 tracking-wide text-lg">Login</span>
      </Button>

                  {/* <Button
                    onClick={() => handleAuthClick('signup')}
                    className="bg-yellow-400 font-bold text-black hover:bg-yellow-300"
                  >
                    Sign Up
                  </Button> */}
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Menu"
              >
                {isOpen ? (
                  <X className="h-8 w-8 text-yellow-400" />
                ) : (
                  <Menu className="h-8 w-8 text-yellow-400" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="md:hidden bg-black/95 backdrop-blur-lg absolute w-full border-t border-border"
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="px-6 pt-2 pb-6 space-y-3">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `block px-4 py-3 rounded-lg text-lg transition-colors duration-300 ${
                        isActive
                          ? "bg-yellow-400 text-black"
                          : "text-yellow-400 hover:bg-yellow-400/20"
                      }`
                    }
                  >
                    {link.title}
                  </NavLink>
                ))}

                <motion.div
                  variants={linkVariants}
                  className="border-t border-border pt-4 space-y-3"
                >
                  {isAuthenticated ? (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 px-4 py-2 text-yellow-400">
                        <User size={20} />
                        <span className="font-medium">{user?.name}</span>
                      </div>
                      <Button
                        onClick={() => {
                          logout();
                          setIsOpen(false);
                        }}
                        variant="outline"
                        className="w-full border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                      >
                        <LogOut size={16} className="mr-2" />
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Button
                        onClick={() => {
                          handleAuthClick("login");
                          setIsOpen(false);
                        }}
                        variant="outline"
                        className="w-full border-400 text-black-400 text-black bg-yellow-500 hover:bg-yellow-400 hover:text-black"
                      >
                        Login
                      </Button>
                      {/* <Button
                        onClick={() => {
                          handleAuthClick('signup');
                          setIsOpen(false);
                        }}
                        className="w-full bg-yellow-400 text-black font-bold hover:bg-yellow-300"
                      >
                        Sign Up
                      </Button> */}
                    </>
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
