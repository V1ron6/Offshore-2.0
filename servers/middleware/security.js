/**
 * IDOR Protection Middleware
 * Validates user access to resources
 */

const jwt = require('jsonwebtoken');

/**
 * Verify JWT token and attach user to request
 */
const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No authentication token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

/**
 * Verify user owns the resource (IDOR Protection)
 */
const verifyResourceOwnership = (resourceUserId) => {
  return (req, res, next) => {
    // Ensure user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Compare user ID with resource owner ID
    if (String(req.user.id) !== String(resourceUserId)) {
      console.warn(`IDOR Attempt: User ${req.user.id} tried to access resource of user ${resourceUserId}`);
      
      return res.status(403).json({
        success: false,
        message: 'Access denied: You do not have permission to access this resource'
      });
    }

    next();
  };
};

/**
 * Rate limiting middleware
 */
const rateLimit = (limit = 100, windowMs = 60000) => {
  const requests = new Map();

  return (req, res, next) => {
    const key = req.ip || req.connection.remoteAddress;
    const now = Date.now();

    if (!requests.has(key)) {
      requests.set(key, []);
    }

    // Clean old requests
    let userRequests = requests.get(key).filter(time => now - time < windowMs);
    
    if (userRequests.length >= limit) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.'
      });
    }

    userRequests.push(now);
    requests.set(key, userRequests);
    next();
  };
};

/**
 * Input sanitization middleware
 */
const sanitizeInput = (req, res, next) => {
  const sanitize = (input) => {
    if (typeof input === 'string') {
      // Remove dangerous characters and limit length
      return input
        .replace(/[<>\"'`]/g, '')
        .slice(0, 500);
    }
    return input;
  };

  // Sanitize request body
  if (req.body && typeof req.body === 'object') {
    Object.keys(req.body).forEach(key => {
      req.body[key] = sanitize(req.body[key]);
    });
  }

  // Sanitize query parameters
  if (req.query && typeof req.query === 'object') {
    Object.keys(req.query).forEach(key => {
      req.query[key] = sanitize(req.query[key]);
    });
  }

  // Sanitize params
  if (req.params && typeof req.params === 'object') {
    Object.keys(req.params).forEach(key => {
      req.params[key] = sanitize(req.params[key]);
    });
  }

  next();
};

module.exports = {
  verifyToken,
  verifyResourceOwnership,
  rateLimit,
  sanitizeInput
};
