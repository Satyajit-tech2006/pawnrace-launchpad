import React from 'react';
import Navbar from '@/components/Navbar';
import Pricing from '@/components/Pricing';
import Footer from '@/components/Footer';
import { useState } from 'react';
import AuthModal from '@/components/AuthModal';

const PricingPage: React.FC = () => {
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
        <Pricing onLoginClick={handleLoginClick} />
      </div>
      <Footer />
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={handleCloseAuthModal} 
      />
    </div>
  );
};

export default PricingPage;