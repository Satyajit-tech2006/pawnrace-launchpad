import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import apiClient, { setAccessToken } from "../lib/api.js";
import { ENDPOINTS } from "../lib/endpoints.js";

const AuthContext = createContext(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuthStatus = useCallback(async () => {
    try {
      const response = await apiClient.post(ENDPOINTS.USERS.REFRESH_TOKEN);
      const { user: refreshedUser, accessToken } = response.data.data;
      setUser(refreshedUser);
      setAccessToken(accessToken);
      console.log("Session restored successfully.");
    } catch (error) {
      console.log("No active session found.");
      setUser(null);
      setAccessToken('');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      // Your backend returns the user and accessToken inside a 'data' object
      const response = await apiClient.post(ENDPOINTS.USERS.LOGIN, { email, password });
      const { user: loggedInUser, accessToken } = response.data.data;
      
      setUser(loggedInUser);
      setAccessToken(accessToken); // This stores the token in memory for our apiClient
      
      return loggedInUser; // Return the user object so the UI can redirect based on role
    } catch (error) {
      console.error("Login failed:", error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  // Updated register function to match all fields from your backend controller
  const register = async (username, fullname, email, password, role, countryCode, number) => {
    setLoading(true);
    try {
      // Your backend expects all these fields for registration
      const response = await apiClient.post(ENDPOINTS.USERS.REGISTER, { 
        username, 
        fullname, 
        email, 
        password, 
        role,
        countryCode,
        number
      });
      // Per your backend code, registration returns a success message but does not log the user in.
      // We return the response so the UI can show "Registration successful, please log in."
      return response.data;
    } catch (error) {
      console.error("Registration failed:", error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiClient.post(ENDPOINTS.USERS.LOGOUT);
    } catch (error) {
      console.error("Server logout failed, clearing client session anyway:", error);
    } finally {
      setUser(null);
      setAccessToken('');
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

