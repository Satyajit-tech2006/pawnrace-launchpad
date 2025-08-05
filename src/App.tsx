import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import Index from "./pages/Index";
import About from "./pages/About";
import HowItWorksPage from "./pages/HowItWorksPage";
import WhyUsPage from "./pages/WhyUsPage";
import MentorsPage from "./pages/MentorsPage";
import FAQPage from "./pages/FAQPage";
import PricingPage from "./pages/PricingPage";
import StudentDashboard from "./pages/dashboard/StudentDashboard";
import StudentSchedule from "./pages/dashboard/StudentSchedule";
import StudentAssignments from "./pages/dashboard/StudentAssignments";
import CoachDashboard from "./pages/dashboard/CoachDashboard";
import CoachSchedule from "./pages/dashboard/CoachSchedule";
import CoachStudents from "./pages/dashboard/CoachStudents";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/why-us" element={<WhyUsPage />} />
            <Route path="/mentors" element={<MentorsPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            
            {/* Student Dashboard Routes */}
            <Route path="/student-dashboard" element={
              <ProtectedRoute requiredRole="student">
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<StudentDashboard />} />
              <Route path="schedule" element={<StudentSchedule />} />
              <Route path="coach" element={<div>My Coach</div>} />
              <Route path="assignments" element={<StudentAssignments />} />
              <Route path="progress" element={<div>My Progress</div>} />
              <Route path="settings" element={<div>Settings</div>} />
            </Route>
            
            {/* Coach Dashboard Routes */}
            <Route path="/coach-dashboard" element={
              <ProtectedRoute requiredRole="coach">
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<CoachDashboard />} />
              <Route path="schedule" element={<CoachSchedule />} />
              <Route path="students" element={<CoachStudents />} />
              <Route path="assignments" element={<div>Assignment Management</div>} />
              <Route path="analytics" element={<div>Analytics</div>} />
              <Route path="profile" element={<div>Profile</div>} />
            </Route>
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
