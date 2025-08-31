// Main Application Component for PawnRace Chess Academy
// This component sets up routing, authentication, and global providers

import React, { useState, useEffect } from "react"; // Make sure useState is imported
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

// Import all page components
import Index from "./pages/Index";
import About from "./pages/About";
import HowItWorksPage from "./pages/HowItWorksPage";
import WhyUsPage from "./pages/WhyUsPage";
import MentorsPage from "./pages/MentorsPage";
import FAQPage from "./pages/FAQPage";
import CoursesPage from "./pages/CoursesPage";
import TournamentsPage from "./pages/TournamentsPage";
import StudentDashboard from "./pages/dashboard/StudentDashboard";
import StudentSchedule from "./pages/dashboard/StudentSchedule";
import StudentAssignments from "./pages/dashboard/StudentAssignments";
import CoachDashboard from "./pages/dashboard/CoachDashboard";
import CoachSchedule from "./pages/dashboard/CoachSchedule";
import CoachStudents from "./pages/dashboard/CoachStudents";
import NotFound from "./pages/NotFound";
import AutoPopup from "./components/AutoPopup"; // Your pro popup component
import Features from "./components/Features";
import Pricing from "./pages/PricingPage";
import Coaches from "./components/Coaches";
import Contacts from "./components/Contacts";

// Set up React Query with reasonable defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes
      gcTime: 10 * 60 * 1000, // Cache cleanup after 10 minutes
    },
  },
});

// SEO Component - automatically updates page titles and meta descriptions
function SEOWrapper({ children }) {
  const location = useLocation();

  useEffect(() => {
    // Define page titles for better SEO
    const pageTitles = {
      "/": "PawnRace - Professional Chess Academy | Learn Chess Online",
      "/about": "About Us - PawnRace Chess Academy",
      "/how-it-works": "How It Works - PawnRace Chess Academy",
      "/why-us": "Why Choose Us - PawnRace Chess Academy",
      "/mentors": "Our Chess Mentors - PawnRace Academy",
      "/faq": "Frequently Asked Questions - PawnRace",
      "/pricing": "Pricing Plans - PawnRace Chess Academy",
      "/student-dashboard": "Student Dashboard - PawnRace",
      "/coach-dashboard": "Coach Dashboard - PawnRace",
    };

    // Update the page title based on current route
    const currentTitle =          
      pageTitles[location.pathname] || "PawnRace - Chess Academy";
    document.title = currentTitle;

    // Update meta description for better SEO
    const metaDescription = document.querySelector('meta[name="description"]');
    const pageDescriptions = {
      "/": "Join PawnRace, the premier online chess academy. Learn from expert coaches, improve your game, and master chess strategy with personalized lessons.",
      "/about":
        "Learn about PawnRace Chess Academy - our mission, vision, and commitment to chess education excellence.",
      "/how-it-works":
        "Discover how PawnRace works - from booking lessons to tracking progress with our expert chess coaches.",
      "/why-us":
        "Why choose PawnRace? Expert coaches, personalized learning, flexible scheduling, and proven results.",
      "/mentors":
        "Meet our world-class chess mentors and coaches at PawnRace - grandmasters and international masters ready to help you improve.",
      "/pricing":
        "Affordable chess lessons with flexible pricing plans. Find the perfect package for your chess learning journey.",
    };

    const currentDescription =
      pageDescriptions[location.pathname] ||
      "Professional chess academy with expert coaches and personalized learning.";

    if (metaDescription) {
      metaDescription.setAttribute("content", currentDescription);
    }
  }, [location.pathname]);

  return <>{children}</>;
}

// Main App Component
function App() {
  // ✅ FIX: Moved useState hook inside the App component
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // This effect will run once when the App component mounts
  useEffect(() => {
    // Add structured data for better SEO
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      name: "PawnRace Chess Academy",
      description:
        "Professional online chess academy offering personalized lessons from expert coaches",
      url: "https://pawnrace.com",
      logo: "https://pawnrace.com/logo.png",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        availableLanguage: "English",
      },
      offers: {
        "@type": "Offer",
        name: "Chess Lessons",
        category: "Education",
      },
    };

    const structuredDataScript = document.createElement("script");
    structuredDataScript.type = "application/ld+json";
    structuredDataScript.text = JSON.stringify(structuredData);
    document.head.appendChild(structuredDataScript);

    // ✨ Automatically open the popup after 5 seconds for new users
    const popupTimer = setTimeout(() => {
      // You can add logic here to only show it once using localStorage
      if (!sessionStorage.getItem("popupShown")) {
        setIsPopupOpen(true);
        sessionStorage.setItem("popupShown", "true");
      }
    }, 3000);




  


    // Cleanup function
    return () => {
      if (document.head.contains(structuredDataScript)) {
        document.head.removeChild(structuredDataScript);
      }
      clearTimeout(popupTimer); // Clear the timer if the component unmounts
    };
  }, []); // Empty dependency array means this runs only once

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <SEOWrapper>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/how-it-works" element={<HowItWorksPage />} />
                <Route path="/why-us" element={<WhyUsPage />} />
                <Route path="/mentors" element={<MentorsPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/courses" element={<CoursesPage />} />
                <Route path="/tournaments" element={<TournamentsPage />} />
                <Route path="/features" element={<Features />} />
                {/* <Route path="/pricing" element={<Pricing />} /> */}
                <Route path="/coaches" element={<Coaches />} />
                <Route path="/contacts" element={<Contacts />} />




// --- Main App Component ---
// This component now controls which page is visible.
);
 


                {/* Student Dashboard Routes */}
                <Route
                  path="/student-dashboard"
                  // element={
                  // //  <ProtectedRoute requiredRole="student">
                  //     <DashboardLayout />
                  //   // </ProtectedRoute> 
                  // }
                >
                  <Route index element={<StudentDashboard />} />
                  <Route path="schedule" element={<StudentSchedule />} />
                  <Route
                    path="coach"
                    element={
                      <div className="p-6">
                        <h1 className="text-2xl font-bold">My Coach</h1>
                        <p className="text-muted-foreground">
                          Connect with your assigned chess coach.
                        </p>
                      </div>
                    }
                  />
                  <Route path="assignments" element={<StudentAssignments />} />
                  <Route
                    path="progress"
                    element={
                      <div className="p-6">
                        <h1 className="text-2xl font-bold">My Progress</h1>
                        <p className="text-muted-foreground">
                          Track your chess improvement and statistics.
                        </p>
                      </div>
                    }
                  />
                  <Route
                    path="settings"
                    element={
                      <div className="p-6">
                        <h1 className="text-2xl font-bold">Settings</h1>
                        <p className="text-muted-foreground">
                          Manage your account preferences.
                        </p>
                      </div>
                    }
                  />
                </Route>

                {/* Coach Dashboard Routes */}
                <Route
                  path="/coach-dashboard"
                  // element={
                  //   <ProtectedRoute requiredRole="coach">
                  //     <DashboardLayout />
                  //   </ProtectedRoute>
                  // }
                >
                  <Route index element={<CoachDashboard />} />
                  <Route path="schedule" element={<CoachSchedule />} />
                  <Route path="students" element={<CoachStudents />} />
                  <Route
                    path="assignments"
                    element={
                      <div className="p-6">
                        <h1 className="text-2xl font-bold">
                          Assignment Management
                        </h1>
                        <p className="text-muted-foreground">
                          Create and manage student assignments.
                        </p>
                      </div>
                    }
                  />
                  <Route
                    path="analytics"
                    element={
                      <div className="p-6">
                        <h1 className="text-2xl font-bold">Analytics</h1>
                        <p className="text-muted-foreground">
                          View detailed performance analytics.
                        </p>
                      </div>
                    }
                  />
                  <Route
                    path="profile"
                    element={
                      <div className="p-6">
                        <h1 className="text-2xl font-bold">Profile</h1>
                        <p className="text-muted-foreground">
                          Manage your coaching profile.
                        </p>
                      </div>
                    }
                  />
                </Route>

                {/* Catch-all 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </SEOWrapper>
          </BrowserRouter>

          {/* ✨ Render the AutoPopup component here, outside the router */}
          <AutoPopup
            isOpen={isPopupOpen}
            onClose={() => setIsPopupOpen(false)}
          />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
