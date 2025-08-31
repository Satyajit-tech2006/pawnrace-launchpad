import React from 'react';
import Hero from '@/components/Hero';

interface IndexProps {
  onLoginClick?: () => void;
}

const Index: React.FC<IndexProps> = ({ onLoginClick }) => {
  return (
    <main className="pt-20">
      <Hero onLoginClick={onLoginClick} />
    </main>
  );
};

export default Index;
