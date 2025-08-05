import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';
import AutoPopup from '@/components/AutoPopup';

const Home: React.FC = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showAutoPopup, setShowAutoPopup] = useState(false);

  // Auto popup after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAutoPopup(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleLoginClick = () => {
    setIsAuthModalOpen(true);
  };

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const handleCloseAutoPopup = () => {
    setShowAutoPopup(false);
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <Navbar onLoginClick={handleLoginClick} />
      
      {/* Main Content */}
      <main>
        <Hero onLoginClick={handleLoginClick} />
        <Features />
        <Testimonials />
      </main>
      
      {/* Footer */}
      <Footer />
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={handleCloseAuthModal} 
      />

      {/* Auto Popup */}
      {showAutoPopup && (
        <AutoPopup onClose={handleCloseAutoPopup} />
      )}
    </div>
  );
};

export default Home;