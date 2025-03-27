// src/features/shared/api/apiClient.js

import axios from 'axios';

// Base URL for API requests - update with your actual API URL
const API_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api/v1';

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle token expiration
    if (error.response && error.response.status === 401 && error.response.data.error.code === 'TOKEN_EXPIRED' && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Get current Firebase user
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          throw new Error('No authenticated user');
        }

        // Force token refresh
        const newToken = await user.getIdToken(true);
        localStorage.setItem('authToken', newToken);

        // Update the original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // If token refresh fails, redirect to login
        localStorage.removeItem('authToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;