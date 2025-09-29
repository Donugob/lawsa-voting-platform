// client/src/utils/api.js
import axios from 'axios';

// 1. Get the backend URL from environment variables.
//    Vite exposes env variables on `import.meta.env`.
//    We use a fallback to 'http://localhost:5000/api' for local development.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// 2. Create the axios instance using the variable.
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add a request interceptor
// This function runs BEFORE any request is sent
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    // If a token exists, add it to the Authorization header
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;