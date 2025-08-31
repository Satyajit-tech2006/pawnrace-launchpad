import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import Home from "./pages/Home";
import CoursesPage from "./pages/CoursesPage";
import MentorsPage from "./pages/MentorsPage";
import PricingPage from "./pages/PricingPage";
import TournamentsPage from "./pages/TournamentsPage";
import About from "./pages/About";
import HowItWorksPage from "./pages/HowItWorksPage";
import WhyUsPage from "./pages/WhyUsPage";
import FAQPage from "./pages/FAQPage";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import StudentDashboard from "./pages/dashboard/StudentDashboard";
import StudentSchedule from "./pages/dashboard/StudentSchedule";
import StudentAssignments from "./pages/dashboard/StudentAssignments";
import CoachDashboard from "./pages/dashboard/CoachDashboard";
import CoachSchedule from "./pages/dashboard/CoachSchedule";
import CoachStudents from "./pages/dashboard/CoachStudents";
import Contacts from "./components/Contacts";
import Coaches from "./components/Coaches";
 import AutoPopup from "./components/AutoPopup";

function App() {
  // const [popupOpen, setPopupOpen] = useState(true);
  return (
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/mentors" element={<MentorsPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/tournaments" element={<TournamentsPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/why-us" element={<WhyUsPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/contact" element={<Contacts />} />
            <Route path="/coaches" element={<Coaches />} />
            {/* Student Dashboard */}
            <Route
              path="/student-dashboard"
              //  element={
              //   //  <ProtectedRoute requiredRole="student">
              //     //  <DashboardLayout />
              //   //  {/* </ProtectedRoute> */}
              // }
            >
              <Route index element={<StudentDashboard />} />
              <Route path="schedule" element={<StudentSchedule />} />
              <Route path="assignments" element={<StudentAssignments />} />
            </Route>

            {/* Coach Dashboard */}
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
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  );
}

export default App;