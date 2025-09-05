import axios from 'axios';
import { API_BASE_URL, ENDPOINTS } from './endpoints';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  // Crucially, this allows axios to send the httpOnly cookie (refreshToken) with requests
  withCredentials: true,
});

// We'll store the accessToken in memory.
// This is a simple in-memory store, a more robust solution might use a context or state management library.
let accessToken = '';

export const setAccessToken = (token) => {
  accessToken = token;
};

// --- Axios Interceptors ---

// 1. Request Interceptor: Attaches the accessToken to every outgoing request
apiClient.interceptors.request.use(
  (config) => {
    // If we have an accessToken, add it to the Authorization header
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 2. Response Interceptor: Handles token refresh logic for 401 errors
apiClient.interceptors.response.use(
  // If the response is successful, just return it
  (response) => {
    return response;
  },
  // If the response has an error, we handle it here
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is a 401 Unauthorized and we haven't already retried this request
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark this request as retried

      try {
        // Attempt to get a new accessToken using the refreshToken cookie
        const response = await apiClient.post(ENDPOINTS.USERS.REFRESH_TOKEN);
        const { accessToken: newAccessToken } = response.data.data;

        // Update the in-memory accessToken
        setAccessToken(newAccessToken);
        
        // Update the Authorization header for the original request
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        // Retry the original request with the new token
        return apiClient(originalRequest);

      } catch (refreshError) {
        console.error("Session expired. Please log in again.", refreshError);
        return Promise.reject(refreshError);
      }
    }

    // For any other errors, just pass them along
    return Promise.reject(error);
  }
);

export default apiClient;
