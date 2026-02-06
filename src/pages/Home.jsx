import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 1. Import useNavigate
import { useAuth } from "../contexts/AuthContext"; // 2. Import useAuth

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Testimonials from "@/components/Testimonials";
import Coaches from "@/components/Coaches";
import Contacts from "@/components/Contacts";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import StudentGlory from "../components/StudentGlory";
import AutoPopup from "@/components/AutoPopup"; 

export default function Home() {
  const { user } = useAuth(); // 3. Get user from context
  const navigate = useNavigate(); // 4. Initialize navigation

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAutoPopupOpen, setIsAutoPopupOpen] = useState(false);

  // 5. NEW: Auto-Redirect Effect
  useEffect(() => {
    if (user) {
      // Check role and redirect immediately
      if (user.role === 'coach') {
        navigate('/coach-dashboard');
      } else {
        navigate('/student-dashboard');
      }
    }
  }, [user, navigate]);

  // Show the popup after a 5-second delay
  useEffect(() => {
    // Optional: Don't show popup if user is logged in (though redirect happens fast)
    if (user) return; 

    const timer = setTimeout(() => {
      setIsAutoPopupOpen(true);
    }, 5000); 

    return () => clearTimeout(timer);
  }, [user]);

  const handleLoginClick = () => {
    setIsAuthModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAuthModalOpen(false);
  };

  const handleCloseAutoPopup = () => {
    setIsAutoPopupOpen(false);
  };

  // Prevent rendering the Landing Page content if redirecting
  if (user) return null; 

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <Navbar onLoginClick={handleLoginClick} />

      <main className="flex-grow">
        <Hero onLoginClick={handleLoginClick} />
        <Coaches />
        <Features />
        
      </main>
      <StudentGlory/>
      <Footer />

      <AuthModal isOpen={isAuthModalOpen} onClose={handleCloseModal} />
      
      {/* Render the AutoPopup component */}
      <AutoPopup isOpen={isAutoPopupOpen} onClose={handleCloseAutoPopup} />
    </div>
  );
}