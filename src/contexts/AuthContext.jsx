// Authentication Context for PawnRace Chess Academy
// Manages user login, registration, logout, and authentication state

import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the authentication context
const AuthContext = createContext(undefined);

// Custom hook to use authentication context
// Throws an error if used outside of AuthProvider
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Authentication Provider Component
// Wraps the app and provides authentication functionality to all child components
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing user session when the app loads
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setCurrentUser(userData);
      } catch (error) {
        console.error('Failed to parse saved user data:', error);
        localStorage.removeItem('user'); // Clean up invalid data
      }
    }
    setIsLoading(false);
  }, []);

  // Login function - authenticates user with email and password
  async function loginUser(userEmail, userPassword, userRole) {
    setIsLoading(true);
    try {
      // TODO: Replace with actual Supabase authentication
      // For now, we simulate an API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a mock user object
      const newUser = {
        id: '1',
        name: userEmail.split('@')[0], // Use email prefix as name
        email: userEmail,
        role: userRole, // 'student' or 'coach'
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userEmail}`
      };
      
      // Save user to state and localStorage
      setCurrentUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    } catch (error) {
      throw new Error('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  }

  // Registration function - creates new user account
  async function registerUser(userName, userEmail, userPassword, userRole) {
    setIsLoading(true);
    try {
      // TODO: Replace with actual Supabase authentication
      // For now, we simulate an API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a new user object
      const newUser = {
        id: '1',
        name: userName,
        email: userEmail,
        role: userRole, // 'student' or 'coach'
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userEmail}`
      };
      
      // Save user to state and localStorage
      setCurrentUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    } catch (error) {
      throw new Error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  // Logout function - clears user session
  function logoutUser() {
    setCurrentUser(null);
    localStorage.removeItem('user');
  }

  // Context value that will be provided to child components
  const authValue = {
    user: currentUser,
    login: loginUser,
    register: registerUser,
    logout: logoutUser,
    loading: isLoading
  };

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
}