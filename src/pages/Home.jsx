import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Testimonials from "@/components/Testimonials";
import Coaches from "@/components/Coaches";
import Contacts from "@/components/Contacts";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import StudentGlory from "../components/StudentGlory";
import FAQPage from "./FAQPage";
export default function Home() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Yeh function modal ko open karega
  const handleLoginClick = () => {
    setIsAuthModalOpen(true);
  };

  // Yeh function modal ko close karega
  const handleCloseModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* Hum yahan se handleLoginClick function ko Navbar mein bhej rahe hain */}
      <Navbar onLoginClick={handleLoginClick} />

      <main className="flex-grow">
        <Hero onLoginClick={handleLoginClick} />
        <Features />
        {/* <Testimonials /> */}
        <Coaches />
        {/* <Contacts /> */}
      </main>
<StudentGlory/>
      <FAQPage/>
      <Footer />

      {/* AuthModal ko yahan se control kar rahe hain */}
      <AuthModal isOpen={isAuthModalOpen} onClose={handleCloseModal} />
    </div>
  );
}