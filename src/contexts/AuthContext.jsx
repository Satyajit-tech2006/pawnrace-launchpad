import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  // ✅ Login with backend
  async function loginUser(email, password) {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Invalid email or password");
      const data = await res.json();

      setCurrentUser(data);
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("token", data.token);
    } finally {
      setIsLoading(false);
    }
  }

  // ✅ Register with backend
  async function registerUser(name, email, password, role) {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      if (!res.ok) throw new Error("Registration failed");
      const data = await res.json();

      setCurrentUser(data);
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("token", data.token);
    } finally {
      setIsLoading(false);
    }
  }

  function logoutUser() {
    setCurrentUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }

  return (
    <AuthContext.Provider
      value={{
        user: currentUser,
        login: loginUser,
        register: registerUser,
        logout: logoutUser,
        loading: isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
