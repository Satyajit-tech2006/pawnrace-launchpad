import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import Page Components
import Home from '../pages/Home.jsx';
import CoursesPage from '../pages/CoursesPage.jsx';
import MentorsPage from '../pages/MentorsPage.tsx';
import PricingPage from '../pages/PricingPage.tsx';
import TournamentsPage from '../pages/TournamentsPage.jsx';
import About from '../pages/About.tsx';
import HowItWorksPage from '../pages/HowItWorksPage.tsx';
import WhyUsPage from '../pages/WhyUsPage.tsx';
import FAQPage from '../pages/FAQPage.tsx';
import NotFound from '../pages/NotFound.jsx';
import Contacts from '../components/Contacts.jsx';
import Coaches from '../components/Coaches.jsx';

// Import Dashboard & Route Guards
import ProtectedRoute from './ProtectedRoute.jsx';
// Corrected the file extension from .jsx to .tsx
// import DashboardLayout from '../components/dashboard/DashboardLayout.tsx';

// Coach Dashboard Pages
import CoachDashboard from '../pages/dashboard/coach/CoachDashboard.tsx';
import CoachSchedule from '../pages/dashboard/coach/CoachSchedule.tsx';
import CoachStudents from '../pages/dashboard/coach/CoachStudents.tsx';
import { CoachClasses } from '../pages/dashboard/coach/CoachClasses.jsx';
import CoachAssignment from '../pages/dashboard/coach/CoachAssignment.jsx';
import CoachTournament from '../pages/dashboard/coach/CoachTournament.jsx';
import CoachTestResults from '../pages/dashboard/coach/CoachTestResults.jsx';
import CoachChat from '../pages/dashboard/coach/CoachChat.jsx';
import MyStudents from '../pages/dashboard/coach/MyStudents.jsx';

// Student Dashboard Pages
import StudentDashboard from '../pages/dashboard/student/StudentDashboard.tsx';
import StudentSchedule from '../pages/dashboard/student/StudentSchedule.tsx';
import Classes from '../pages/dashboard/student/Classes.jsx';
import StudentAssignment from '../pages/dashboard/student/StudentAssignments.jsx';
import StudentTournament from '../pages/dashboard/student/StudentTournament.jsx';
import StudentTestResults from '../pages/dashboard/student/StudentTestResults.jsx';
import StudentChat from '../pages/dashboard/student/StudentChat.jsx';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
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

      {/* Student Dashboard - Protected Routes */}
      <Route
        path="/student-dashboard"
        // element={
        //   <ProtectedRoute requiredRole="student">
        //     {/* <DashboardLayout /> */}
        //               </ProtectedRoute>
        // }
      >
        <Route index element={<StudentDashboard />} />
        <Route path="schedule" element={<StudentSchedule />} />
        <Route path="assignments" element={<StudentAssignment />} />
        <Route path="classes" element={<Classes />} />
        <Route path="tournaments" element={<StudentTournament />} />
        <Route path="test-results" element={<StudentTestResults />} />
        <Route path="contact-coach" element={<StudentChat />} />
      </Route>

      {/* Coach Dashboard - Protected Routes */}
      <Route
        path="/coach-dashboard"
        // element={
        //   <ProtectedRoute requiredRole="coach">
        //     {/* <DashboardLayout /> */}
        //   </ProtectedRoute>
        // }
      >
        <Route index element={<CoachDashboard />} />
        <Route path="schedule" element={<CoachSchedule />} />
        <Route path="students" element={<CoachStudents />} />
        <Route path="classes" element={<CoachClasses />} />
        <Route path="assignments" element={<CoachAssignment />} />
        <Route path="tournaments" element={<CoachTournament />} />
        <Route path="test-results" element={<CoachTestResults />} />
        <Route path="chats" element={<CoachChat />} />
        <Route path="my-students" element={<MyStudents />} />
      </Route>

      {/* Not Found Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;

