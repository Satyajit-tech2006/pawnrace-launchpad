// Navigation Component for PawnRace Chess Academy
// Responsive navigation bar with mobile menu support

import React, { useState, useEffect } from 'react';
import { Menu, X, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';

// Navigation bar component with responsive design
function Navbar({ onLoginClick }) {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Track scroll position to change navbar appearance
  useEffect(() => {
    function handleScrollChange() {
      setHasScrolled(window.scrollY > 50);
    }
    
    window.addEventListener('scroll', handleScrollChange);
    return () => window.removeEventListener('scroll', handleScrollChange);
  }, []);

  const currentLocation = useLocation();
  
  // Define navigation links
  const navigationLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/how-it-works', label: 'How It Works' },
    { href: '/why-us', label: 'Why Us' },
    { href: '/mentors', label: 'Mentors' },
    { href: '/faq', label: 'FAQ' },
    { href: '/pricing', label: 'Pricing' },
  ];

  // Handle mobile menu link clicks
  function handleMobileLinkClick() {
    setShowMobileMenu(false);
  }

  // Handle mobile login button clicks
  function handleMobileLogin() {
    onLoginClick();
    setShowMobileMenu(false);
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      hasScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-2">
            <Crown className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-gradient">PawnRace</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-foreground hover:text-primary transition-colors duration-200 font-medium ${
                  currentLocation.pathname === link.href ? 'text-primary' : ''
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Authentication Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={onLoginClick}
              className="btn-outline"
            >
              Login
            </Button>
            <Button
              onClick={onLoginClick}
              className="btn-hero"
            >
              Sign Up
            </Button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="lg:hidden bg-white border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`block px-3 py-2 text-foreground hover:text-primary transition-colors duration-200 ${
                    currentLocation.pathname === link.href ? 'text-primary' : ''
                  }`}
                  onClick={handleMobileLinkClick}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Mobile Authentication Buttons */}
              <div className="px-3 py-2 space-y-2">
                <Button
                  variant="outline"
                  onClick={handleMobileLogin}
                  className="w-full btn-outline"
                >
                  Login
                </Button>
                <Button
                  onClick={handleMobileLogin}
                  className="w-full btn-hero"
                >
                  Sign Up
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;