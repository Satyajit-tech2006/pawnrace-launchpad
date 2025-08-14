// Protected Route Component for PawnRace Chess Academy
// Handles authentication and role-based access control

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Component to protect routes based on authentication and user roles
function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to home if user is not authenticated
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Redirect to appropriate dashboard if user role doesn't match required role
  if (requiredRole && user.role !== requiredRole) {
    const redirectPath = user.role === 'student' ? '/student-dashboard' : '/coach-dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  // User is authenticated and has the correct role, render the protected content
  return <>{children}</>;
}

export default ProtectedRoute;