import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import sambitpandaIMG from "../assets/sambit-panda.jpg";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Coaches from "@/components/Coaches";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import StudentGlory from "../components/StudentGlory";
import AutoPopup from "@/components/AutoPopup";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAutoPopupOpen, setIsAutoPopupOpen] = useState(false);

  // Auto redirect
  useEffect(() => {
    if (user) {
      if (user.role === "coach") {
        navigate("/coach-dashboard");
      } else {
        navigate("/student-dashboard");
      }
    }
  }, [user, navigate]);

  // Auto popup
  useEffect(() => {
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

  /* -------------------- OFFER BANNER -------------------- */

  const OfferBanner = () => {
    const navigate = useNavigate();

    const offers = [
      {
        text: "♟ Advanced Chess Workshop: Attack & Defense",
        link: "/special-offer",
        img: sambitpandaIMG,
      },
      {
        text: "📅 14 March 2026 | Live Online Workshop with IM Sambit Panda",
        link: "/special-offer",
        img: sambitpandaIMG,
      },
      {
        text: "💰 Workshop Fee: ₹899 Only (Incl. GST)",
        link: "/special-offer",
        img: sambitpandaIMG,
      },
      {
        text: "🏆 Top 3 Players Win FREE 3-Month Training Course",
        link: "/special-offer",
        img: sambitpandaIMG,
      },
      {
        text: "🎁 Bonus: Free E-Books for all participants",
        link: "/special-offer",
        img: sambitpandaIMG,
      },
    ];

    const [index, setIndex] = useState(0);

    // Auto slider
    useEffect(() => {
      const interval = setInterval(() => {
        setIndex((prev) => (prev + 1) % offers.length);
      }, 2500);

      return () => clearInterval(interval);
    }, []);

    const current = offers[index];

    return (
      <div className="w-full flex justify-center mt-6">
        <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-10 px-10 rounded-2xl shadow-2xl border border-orange-400/30 w-[90%] max-w-5xl transition-all duration-700">
          <div className="flex items-center justify-between">
            {/* LEFT TEXT */}

            <div className="flex flex-col gap-3">
              <span className="font-bold text-lg md:text-xl flex items-center gap-3">
                <span className="animate-pulse ring-2 ring-white/50 rounded-full w-3 h-3 bg-white"></span>

                {current.text}
              </span>

              <button
                onClick={() => navigate(current.link)}
                className="bg-white text-orange-600 px-5 py-2 rounded-full text-sm font-black uppercase hover:bg-gray-100 transition w-fit"
              >
                View Details
              </button>
            </div>

            {/* RIGHT IMAGE */}

            <div className="hidden md:block">
              <img
                src={current.img}
                alt="Coach"
                className="h-24 md:h-32 object-cover rounded-xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* -------------------- UI -------------------- */

  if (user) return null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <Navbar onLoginClick={handleLoginClick} />

      <main className="flex-grow">
        <Hero onLoginClick={handleLoginClick} />

        <OfferBanner />

        <Coaches />

        <Features />
      </main>

      <StudentGlory />

      <Footer />

      <AuthModal isOpen={isAuthModalOpen} onClose={handleCloseModal} />

      <AutoPopup isOpen={isAutoPopupOpen} onClose={handleCloseAutoPopup} />
    </div>
  );
}
