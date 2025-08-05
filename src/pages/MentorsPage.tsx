import React from 'react';
import Navbar from '@/components/Navbar';
import Coaches from '@/components/Coaches';
import Footer from '@/components/Footer';
import { useState } from 'react';
import AuthModal from '@/components/AuthModal';

const MentorsPage: React.FC = () => {
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
        <Coaches />
      </div>
      <Footer />
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={handleCloseAuthModal} 
      />
    </div>
  );
};

export default MentorsPage;