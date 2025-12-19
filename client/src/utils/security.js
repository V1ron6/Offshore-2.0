/**
 * Security Utilities
 * IDOR and XSS Protection
 */

/**
 * Sanitize user input to prevent XSS
 * @param {string} input - User input
 * @returns {string} - Sanitized string
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  
  const element = document.createElement('div');
  element.textContent = input;
  return element.innerHTML;
};

/**
 * Sanitize HTML content
 * @param {string} html - HTML content
 * @returns {string} - Sanitized HTML
 */
export const sanitizeHTML = (html) => {
  const element = document.createElement('div');
  element.innerHTML = html;
  
  // Remove dangerous elements
  const dangerous = element.querySelectorAll('script, iframe, style');
  dangerous.forEach(el => el.remove());
  
  return element.innerHTML;
};

/**
 * Validate and verify user access to resource
 * IDOR Protection: Ensure user can only access their own data
 * @param {string} resourceOwnerId - ID of resource owner
 * @param {string} currentUserId - ID of current user
 * @returns {boolean} - True if user can access
 */
export const canAccessResource = (resourceOwnerId, currentUserId) => {
  // Verify token exists
  const token = localStorage.getItem('authToken');
  if (!token) return false;
  
  // Verify user ID matches
  if (resourceOwnerId !== currentUserId) {
    console.warn('IDOR Attempt: User trying to access unauthorized resource');
    return false;
  }
  
  return true;
};

/**
 * Validate user session
 * @returns {object|null} - User object or null
 */
export const validateSession = () => {
  const user = localStorage.getItem('user');
  const token = localStorage.getItem('authToken');
  
  if (!user || !token) return null;
  
  try {
    return JSON.parse(user);
  } catch (error) {
    console.error('Session validation failed:', error);
    return null;
  }
};

/**
 * Encode URI component safely
 * @param {string} input - Input to encode
 * @returns {string} - Encoded string
 */
export const encodeURLParam = (input) => {
  return encodeURIComponent(String(input).slice(0, 100)); // Limit length
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(String(email).toLowerCase());
};

/**
 * Validate URL to prevent redirect attacks
 * @param {string} url - URL to validate
 * @returns {boolean} - True if safe URL
 */
export const isSafeURL = (url) => {
  try {
    const parsed = new URL(url);
    // Only allow http and https protocols
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
};

/**
 * Create secure header for API requests
 * @returns {object} - Headers object
 */
export const getSecureHeaders = () => {
  const token = localStorage.getItem('authToken');
  
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

/**
 * Rate limiting check
 * @param {string} key - Rate limit key
 * @param {number} limit - Request limit
 * @param {number} window - Time window in ms
 * @returns {boolean} - True if within limit
 */
export const checkRateLimit = (key, limit = 10, window = 60000) => {
  const data = localStorage.getItem(`rateLimit_${key}`);
  const now = Date.now();
  
  let requests = [];
  if (data) {
    try {
      requests = JSON.parse(data).filter(time => now - time < window);
    } catch {
      requests = [];
    }
  }
  
  if (requests.length >= limit) {
    return false;
  }
  
  requests.push(now);
  localStorage.setItem(`rateLimit_${key}`, JSON.stringify(requests));
  return true;
};

/**
 * Validate JWT token format (basic check)
 * @param {string} token - JWT token
 * @returns {boolean} - True if valid format
 */
export const isValidJWT = (token) => {
  if (!token || typeof token !== 'string') return false;
  
  const parts = token.split('.');
  return parts.length === 3; // JWT has 3 parts
};

/**
 * Log security event
 * @param {string} event - Event type
 * @param {object} details - Event details
 */
export const logSecurityEvent = (event, details = {}) => {
  const log = {
    event,
    timestamp: new Date().toISOString(),
    user: localStorage.getItem('user'),
    ...details
  };
  
  // In production, send to logging service
  console.warn('[SECURITY]', log);
};

export default {
  sanitizeInput,
  sanitizeHTML,
  canAccessResource,
  validateSession,
  encodeURLParam,
  isValidEmail,
  isSafeURL,
  getSecureHeaders,
  checkRateLimit,
  isValidJWT,
  logSecurityEvent
};
