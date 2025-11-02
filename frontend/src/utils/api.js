import axios from 'axios';
import toast from 'react-hot-toast';
import { ERROR_MESSAGES } from './constants';

// Get API URL from environment variable or use relative path
const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Handle successful responses
    return response;
  },
  (error) => {
    // Handle errors
    const { response } = error;

    if (!response) {
      // Network error or timeout
      toast.error(ERROR_MESSAGES.NETWORK_ERROR);
      return Promise.reject(error);
    }

    const { status, data } = response;

    switch (status) {
      case 401:
        // Unauthorized - clear token and redirect
        localStorage.removeItem('token');
        if (window.location.pathname !== '/login') {
          toast.error(ERROR_MESSAGES.UNAUTHORIZED);
          window.location.href = '/login';
        }
        break;
      case 403:
        // Forbidden
        toast.error(data?.message || ERROR_MESSAGES.FORBIDDEN);
        break;
      case 404:
        // Not found
        toast.error(data?.message || ERROR_MESSAGES.NOT_FOUND);
        break;
      case 422:
      case 400:
        // Validation error
        if (data?.errors && Array.isArray(data.errors)) {
          // Handle validation errors array
          data.errors.forEach((err) => {
            toast.error(err.msg || err.message || ERROR_MESSAGES.VALIDATION_ERROR);
          });
        } else {
          toast.error(data?.message || ERROR_MESSAGES.VALIDATION_ERROR);
        }
        break;
      case 429:
        // Rate limit exceeded
        toast.error('Terlalu banyak request. Silakan tunggu sebentar.');
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        // Server errors
        toast.error(data?.message || ERROR_MESSAGES.SERVER_ERROR);
        break;
      default:
        toast.error(data?.message || ERROR_MESSAGES.UNKNOWN_ERROR);
    }

    return Promise.reject(error);
  }
);

export default api;

