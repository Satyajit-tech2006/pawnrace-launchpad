import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * A route guard component that protects routes based on user authentication and role.
 * @param {{ children: React.ReactNode, requiredRole: 'student' | 'coach' }} props
 */
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // If the auth state is still loading, we can show a loading spinner
  // or null, as the AuthProvider already prevents rendering.
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading session...</p>
      </div>
    );
  }

  // 1. Check if the user is authenticated
  if (!isAuthenticated) {
    // If not authenticated, redirect them to the home page to log in.
    // We pass the original location they tried to access in the state.
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // 2. Check if the user has the required role for this route
  if (requiredRole && user.role !== requiredRole) {
    // If they are logged in but have the wrong role, redirect them to their correct dashboard.
    const homeDashboard = user.role === 'coach' ? '/coach-dashboard' : '/student-dashboard';
    return <Navigate to={homeDashboard} replace />;
  }

  // 3. If authenticated and has the correct role, render the component
  return children;
};

export default ProtectedRoute;
