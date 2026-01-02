import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import apiClient, { setAccessToken as setApiAccessToken } from "../lib/api.js";
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
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuthStatus = useCallback(async () => {
    try {
      const response = await apiClient.post(ENDPOINTS.USERS.REFRESH_TOKEN);
      const { user: refreshedUser, accessToken } = response.data.data;
      
      setUser(refreshedUser);
      setToken(accessToken);
      setApiAccessToken(accessToken);

      // 1. SAVE TO LOCAL STORAGE ON REFRESH (So it persists if you reload page)
      localStorage.setItem("user", JSON.stringify(refreshedUser)); // <--- ⚠️ ADD THIS LINE
      
      console.log("Session restored successfully.");
    } catch (error) {
      console.log("No active session found.");
      setUser(null);
      setToken(null);
      setApiAccessToken('');
      localStorage.removeItem("user"); // Clean up if session is invalid
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
      const response = await apiClient.post(ENDPOINTS.USERS.LOGIN, { email, password });
      const { user: loggedInUser, accessToken } = response.data.data;
      
      setUser(loggedInUser);
      setToken(accessToken);
      setApiAccessToken(accessToken);
      
      // 2. SAVE TO LOCAL STORAGE ON LOGIN (This fixes your CoachTournament issue)
      localStorage.setItem("user", JSON.stringify(loggedInUser)); // <--- ⚠️ ADD THIS LINE
      
      return loggedInUser;
    } catch (error) {
      console.error("Login failed:", error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, fullname, email, password, role, countryCode, number) => {
    setLoading(true);
    try {
      const response = await apiClient.post(ENDPOINTS.USERS.REGISTER, { 
        username, 
        fullname, 
        email, 
        password, 
        role,
        countryCode,
        number
      });
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
      setToken(null);
      setApiAccessToken('');

      // 3. REMOVE FROM LOCAL STORAGE ON LOGOUT
      localStorage.removeItem("user"); // <--- ⚠️ ADD THIS LINE
    }
  };

  const value = {
    user,
    token,
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