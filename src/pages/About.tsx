import React from 'react';
import Navbar from '@/components/Navbar';
import AboutUs from '@/components/AboutUs';
import Footer from '@/components/Footer';
import { useState } from 'react';
import AuthModal from '@/components/AuthModal';

const About: React.FC = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleLoginClick = () => {
    setIsAuthModalOpen(true);
  };

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <div className="min-h-screen">
      <Navbar onLoginClick={handleLoginClick} />
      <div className="pt-20">
        <AboutUs />
      </div>
      <Footer />
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={handleCloseAuthModal} 
      />
    </div>
  );
};

export default About;