// Home Page Component for PawnRace Chess Academy
// Main landing page with hero, features, testimonials, and auto-popup

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';
import AutoPopup from '@/components/AutoPopup';

function Home() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);

  // Show welcome popup after 5 seconds for user engagement
  useEffect(() => {
    const popupTimer = setTimeout(() => {
      setShowWelcomePopup(true);
    }, 5000);

    return () => clearTimeout(popupTimer);
  }, []);

  // Handle login/signup button clicks
  function handleLoginButtonClick() {
    setShowAuthModal(true);
  }

  // Handle auth modal close
  function handleAuthModalClose() {
    setShowAuthModal(false);
  }

  // Handle welcome popup close
  function handleWelcomePopupClose() {
    setShowWelcomePopup(false);
  }

  return (
    <div className="min-h-screen">
      {/* Navigation Bar */}
      <Navbar onLoginClick={handleLoginButtonClick} />
      
      {/* Main Page Content */}
      <main>
        <Hero onLoginClick={handleLoginButtonClick} />
        <Features />
        <Testimonials />
      </main>
      
      {/* Footer */}
      <Footer />
      
      {/* Authentication Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={handleAuthModalClose} 
      />

      {/* Welcome Popup - shows after 5 seconds */}
      {showWelcomePopup && (
        <AutoPopup onClose={handleWelcomePopupClose} />
      )}
    </div>
  );
}

export default Home;