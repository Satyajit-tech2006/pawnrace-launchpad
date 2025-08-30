import React from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink } from 'react-router-dom';

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
  const [isOpen, setIsOpen] = React.useState(false);
  const [hasScrolled, setHasScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { title: 'Home', href: '/' },
    { title: 'Coaches', href: '/Coaches' },
    // { title: 'Pricing', href: '/pricing' },
    { title: 'Contact', href: '/contacts' },
  ];

  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.07, duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  const linkVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.nav
      className={`fixed w-full top-0 left-0 z-50 transition-all duration-300 ${
        hasScrolled ? 'bg-gray-900/80 backdrop-blur-sm shadow-xl' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 bg-black">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <a href="#" className="flex items-center space-x-3 cursor-pointer">
            <motion.div
              animate={{
                filter: [
                  'drop-shadow(0 0 2px #fbbd23) drop-shadow(0 0 5px #fbbd23)',
                  'drop-shadow(0 0 5px #fbbd23) drop-shadow(0 0 15px #fbbd23)',
                  'drop-shadow(0 0 2px #fbbd23) drop-shadow(0 0 5px #fbbd23)',
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <ChessPawnIcon className="h-10 w-10 text-amber-400" />
            </motion.div>
            <div>
              <span className="text-2xl font-bold text-amber-400">PawnRace</span>
              <p className="text-xs font-medium text-amber-500 -mt-1">Moves That Make Champions</p>
            </div>
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-3 bg-gray-800 px-4 py-2 rounded-xl shadow-lg">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-amber-400 text-gray-900 shadow-md'
                      : 'text-amber-400 hover:bg-amber-400/20 hover:text-white'
                  }`
                }
              >
                {link.title}
              </NavLink>
            ))}
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="px-5 py-2 text-amber-400 border border-amber-400 rounded-lg hover:bg-amber-400 hover:text-gray-900 transition-all duration-300 font-semibold">
              Login
            </button>
            <button className="px-5 py-2 bg-amber-400 text-gray-900 rounded-lg hover:bg-amber-300 transition-all duration-300 font-semibold shadow-lg shadow-amber-500/10">
              Sign Up
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Menu">
              {isOpen ? (
                <X className="h-8 w-8 text-amber-400" />
              ) : (
                <Menu className="h-8 w-8 text-amber-400" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden bg-gray-900/95 backdrop-blur-lg absolute w-full"
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
                        ? 'bg-amber-400 text-gray-900'
                        : 'text-amber-400 hover:bg-amber-400/20 hover:text-white'
                    }`
                  }
                >
                  {link.title}
                </NavLink>
              ))}
              <motion.div
                variants={linkVariants}
                className="border-t border-gray-700 pt-4 space-y-3"
              >
                <button className="w-full px-4 py-3 text-amber-400 border border-amber-400 rounded-lg hover:bg-amber-400 hover:text-gray-900 transition-all duration-300 font-semibold">
                  Login
                </button>
                <button className="w-full px-4 py-3 bg-amber-400 text-gray-900 rounded-lg hover:bg-amber-300 transition-all duration-300 font-semibold">
                  Sign Up
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
