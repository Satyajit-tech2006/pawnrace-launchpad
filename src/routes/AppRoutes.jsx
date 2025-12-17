import React from "react";
import { Routes, Route } from "react-router-dom";

// Import Page Components
import Home from "../pages/Home.jsx";
import CoursesPage from "../pages/CoursesPage.jsx";
import MentorsPage from "../pages/MentorsPage.tsx";
import PricingPage from "../pages/PricingPage.tsx";
import TournamentsPage from "../pages/TournamentsPage.jsx";
import OurVission from "../components/OurVission.jsx";
import HowItWorksPage from "../pages/HowItWorksPage.tsx";
import WhyUsPage from "../pages/WhyUsPage.tsx";
import FAQPage from "../pages/FAQPage.tsx";
import NotFound from "../pages/NotFound.jsx";
import Contacts from "../components/Contacts.jsx";
import Coaches from "../components/Coaches.jsx";
import ComingSoon from "../pages/ComingSoon.jsx";
import Curriculum from "../components/Curriculum.jsx";
import { Layout } from "../components/Layout";
import LiveGamePage from "../pages/LiveGamePage.jsx";
import AboutUs from "../components/AboutUs.jsx";
import GameLobby from '../pages/GameLobby';
import Classroom from "../pages/Classroom.jsx";


// Coach Dashboard Pages
import CoachDashboard from "../pages/dashboard/coach/CoachDashboard.tsx";
import CoachSchedule from "../pages/dashboard/coach/CoachSchedule.tsx";
import CoachStudents from "../pages/dashboard/coach/CoachStudents.tsx";
import { CoachClasses } from "../pages/dashboard/coach/CoachClasses.jsx";
import CoachAssignment from "../pages/dashboard/coach/CoachAssignment.jsx";
import CoachTournament from "../pages/dashboard/coach/CoachTournament.jsx";
import CoachTestResults from "../pages/dashboard/coach/CoachTestResults.jsx";
import CoachChat from "../pages/dashboard/coach/CoachChat.jsx";
import MyStudents from "../pages/dashboard/coach/MyStudents.jsx";
import CoachClassesNew from "../pages/dashboard/coach/CoachClassesNew.jsx";
// Student Dashboard Pages
import StudentDashboard from "../pages/dashboard/student/StudentDashboard.tsx";
import StudentSchedule from "../pages/dashboard/student/StudentSchedule.tsx";
import Classes from "../pages/dashboard/student/Classes.jsx";
import StudentAssignment from "../pages/dashboard/student/StudentAssignments.jsx";
import StudentTournament from "../pages/dashboard/student/StudentTournament.jsx";
import StudentTestResults from "../pages/dashboard/student/StudentTestResults.jsx";
import StudentChat from "../pages/dashboard/student/StudentChat.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      {/* --- Public Routes --- */}
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/courses" element={<Layout><CoursesPage /></Layout>} />
      <Route path="/mentors" element={<Layout><MentorsPage /></Layout>} />
      <Route path="/pricing" element={<Layout><PricingPage /></Layout>} />
      <Route path="/tournaments" element={<Layout><TournamentsPage /></Layout>} />
      <Route path="/ourvission" element={<Layout><OurVission /></Layout>} />
      <Route path="/how-it-works" element={<Layout><HowItWorksPage /></Layout>} />
      <Route path="/why-us" element={<Layout><WhyUsPage /></Layout>} />
      <Route path="/faq" element={<Layout><FAQPage /></Layout>} />
      <Route path="/contact" element={<Layout><Contacts /></Layout>} />
      <Route path="/coaches" element={<Layout><Coaches /></Layout>} />
      <Route path="/aboutus" element={<Layout><AboutUs /></Layout>} />
      <Route path="/curriculum" element={<Layout><Curriculum /></Layout>} />
      <Route path="/class/:roomId" element={<Classroom />} />

      {/* --- Dashboard Routes --- */}
      
      {/* Student Dashboard */}
      <Route path="/student-dashboard">
        <Route index element={<StudentDashboard />} />
        <Route path="schedule" element={<StudentSchedule />} />
        <Route path="assignments" element={<StudentAssignment />} />
        <Route path="classes" element={<Classes />} />
        <Route path="tournaments" element={<StudentTournament />} />
        <Route path="test-results" element={<StudentTestResults />} />
        <Route path="contact-coach" element={<StudentChat />} />
        <Route path="iqpuzzles" element={<ComingSoon />} />
      </Route>

      {/* Coach Dashboard */}
      <Route path="/coach-dashboard">
        <Route index element={<CoachDashboard />} />
        <Route path="schedule" element={<CoachSchedule />} />
        <Route path="students" element={<CoachStudents />} />
        <Route path="classes" element={<CoachClasses />} />
        <Route path="assignments" element={<CoachAssignment />} />
        <Route path="tournaments" element={<CoachTournament />} />
        <Route path="test-results" element={<CoachTestResults />} />
        <Route path="chats" element={<CoachChat />} />
        <Route path="my-students" element={<MyStudents />} />
        <Route path="database" element={<ComingSoon />} />
        <Route path="settings" element={<ComingSoon />} />
        <Route path="new-classes(coming-soon)" element={<CoachClassesNew />} />
      </Route>

      {/* --- Game Routes --- */}
      <Route path="/play" element={<GameLobby />} />
      
      {/* Yeh hai normal play route */}
      <Route path="/play/:roomId" element={<LiveGamePage />} />

      {/* ✅ NEW: Yeh route add karo Classroom flow ke liye */}
      <Route path="/classroom/:roomId" element={<LiveGamePage />} />

      {/* Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;