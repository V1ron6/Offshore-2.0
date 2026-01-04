/**
 * Secure API Client
 * Handles API requests with authentication
 */

import axios from 'axios';
import { sanitizeInput, logSecurityEvent } from './security.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Public endpoints that don't require authentication
const PUBLIC_ENDPOINTS = [
  '/user/signup',
  '/user/login',
  '/admin/login',
  '/products',
  '/categories'
];

// Check if endpoint is public
const isPublicEndpoint = (url) => {
  if (!url) return false;
  return PUBLIC_ENDPOINTS.some(endpoint => url.includes(endpoint));
};

// Create axios instance with defaults
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000
});

/**
 * Request interceptor - Add auth headers
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    
    // Set default headers
    config.headers = config.headers || {};
    
    // Don't set Content-Type for FormData (let browser set it with boundary)
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }

    // Add token to headers if available
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Sanitize query parameters (but not for public endpoints to allow search)
    if (config.params && !isPublicEndpoint(config.url)) {
      Object.keys(config.params).forEach(key => {
        if (typeof config.params[key] === 'string') {
          config.params[key] = sanitizeInput(config.params[key]);
        }
      });
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor - Handle errors
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle different error types
    if (error.response?.status === 401 && !isPublicEndpoint(error.config?.url)) {
      // Unauthorized on protected endpoint - clear session
      logSecurityEvent('UNAUTHORIZED', { url: error.config?.url });
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      // Don't redirect automatically, let the component handle it
    } else if (error.response?.status === 403) {
      logSecurityEvent('FORBIDDEN', { url: error.config?.url });
    }

    return Promise.reject(error);
  }
);

export default apiClient;
