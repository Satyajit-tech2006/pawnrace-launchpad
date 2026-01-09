import axios from 'axios';
// 1. We no longer import API_BASE_URL from endpoints
import { ENDPOINTS } from './endpoints.js';

const apiClient = axios.create({
  // 2. The baseURL is now defined directly from the environment variable here
  baseURL: import.meta.env.VITE_API_URL,
  // This allows axios to send the httpOnly cookie (refreshToken) with requests
  withCredentials: true,
});

// We'll store the accessToken in memory.
let accessToken = '';

export const setAccessToken = (token) => {
  accessToken = token;
};

// --- Axios Interceptors ---

// Request Interceptor: Attaches the accessToken to every outgoing request
apiClient.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handles token refresh logic
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle token refresh for 401 errors
    if (error.response?.status === 401) {
        
      // --- CRITICAL FIX: STOP INFINITE LOOPS ---
      // If the request that failed WAS the refresh attempt, or we already retried...
      if (originalRequest._retry || originalRequest.url.includes("refresh-token")) {
          // Session is dead. Clear state and redirect.
          // (You can add localStorage clearing here if needed)
          // window.location.href = "/login"; 
          return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const response = await apiClient.post(ENDPOINTS.USERS.REFRESH_TOKEN);
        const { accessToken: newAccessToken } = response.data.data;

        setAccessToken(newAccessToken);
        
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        return apiClient(originalRequest);

      } catch (refreshError) {
        console.error("Session expired. Please log in again.", refreshError);
        // Clean up user data if refresh fails
        localStorage.removeItem("user"); 
        // Optional: Force reload/redirect to ensure clean state
        // window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;