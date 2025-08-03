import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Coaches from '@/components/Coaches';
import Testimonials from '@/components/Testimonials';
import Pricing from '@/components/Pricing';

import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';

const Home: React.FC = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleLoginClick = () => {
    setIsAuthModalOpen(true);
  };

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <Navbar onLoginClick={handleLoginClick} />
      
      {/* Main Content */}
      <main>
        <Hero onLoginClick={handleLoginClick} />
        <Features />
        <Coaches />
        <Testimonials />
        <Pricing onLoginClick={handleLoginClick} />
      </main>
      
      {/* Footer */}
      <Footer />
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={handleCloseAuthModal} 
      />
    </div>
  );
};

export default Home;