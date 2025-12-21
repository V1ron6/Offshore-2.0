/**
 * Secure API Client
 * Handles IDOR and XSS protection
 */

import axios from 'axios';
import { sanitizeInput, validateSession, getSecureHeaders, logSecurityEvent, isValidJWT } from './security.js';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

// Create axios instance with secure defaults
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: getSecureHeaders()
});

/**
 * Request interceptor - Add security headers and validate session
 */
apiClient.interceptors.request.use(
  (config) => {
    // Validate session before each request
    const user = validateSession();
    const token = localStorage.getItem('authToken');
    
    if (!isValidJWT(token)) {
      logSecurityEvent('INVALID_TOKEN', { url: config.url });
      // Clear invalid token
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      throw new Error('Invalid session');
    }

    // Add token to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Sanitize query parameters
    if (config.params) {
      Object.keys(config.params).forEach(key => {
        if (typeof config.params[key] === 'string') {
          config.params[key] = sanitizeInput(config.params[key]);
        }
      });
    }

    // Sanitize request data
    if (config.data && typeof config.data === 'object') {
      Object.keys(config.data).forEach(key => {
        if (typeof config.data[key] === 'string') {
          config.data[key] = sanitizeInput(config.data[key]);
        }
      });
    }

    return config;
  },
  (error) => {
    logSecurityEvent('REQUEST_ERROR', { error: error.message });
    return Promise.reject(error);
  }
);

/**
 * Response interceptor - Validate response and handle errors
 */
apiClient.interceptors.response.use(
  (response) => {
    // Verify response contains expected data
    if (!response.data) {
      logSecurityEvent('EMPTY_RESPONSE', { url: response.config.url });
      throw new Error('Invalid response from server');
    }

    return response;
  },
  (error) => {
    // Handle different error types
    if (error.response?.status === 401) {
      // Unauthorized - clear session
      logSecurityEvent('UNAUTHORIZED', { url: error.config?.url });
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      // Forbidden - IDOR attempt detected
      logSecurityEvent('IDOR_ATTEMPT', { url: error.config?.url });
      throw new Error('Access denied: You do not have permission to access this resource');
    } else if (error.response?.status === 404) {
      logSecurityEvent('NOT_FOUND', { url: error.config?.url });
    }

    return Promise.reject(error);
  }
);

export default apiClient;
