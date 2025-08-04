import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import Index from "./pages/Index";
import StudentDashboard from "./pages/dashboard/StudentDashboard";
import CoachDashboard from "./pages/dashboard/CoachDashboard";
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
            
            {/* Student Dashboard Routes */}
            <Route path="/student-dashboard" element={
              <ProtectedRoute requiredRole="student">
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<StudentDashboard />} />
              <Route path="schedule" element={<div>Student Schedule</div>} />
              <Route path="coach" element={<div>My Coach</div>} />
              <Route path="assignments" element={<div>My Assignments</div>} />
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
              <Route path="schedule" element={<div>Coach Schedule</div>} />
              <Route path="students" element={<div>My Students</div>} />
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
