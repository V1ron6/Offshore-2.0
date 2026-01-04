/**
 * Rate Limiting Middleware
 * Protects against brute force attacks
 */

const rateLimit = require('express-rate-limit');

// General API rate limiter
const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per windowMs
	message: {
		success: false,
		message: 'Too many requests from this IP, please try again after 15 minutes'
	},
	standardHeaders: true,
	legacyHeaders: false,
});

// Strict rate limiter for authentication routes
const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 5, // Limit each IP to 5 login attempts per 15 minutes
	message: {
		success: false,
		message: 'Too many login attempts from this IP, please try again after 15 minutes'
	},
	standardHeaders: true,
	legacyHeaders: false,
	skipSuccessfulRequests: true, // Don't count successful requests
});

// Signup rate limiter
const signupLimiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 1 hour
	max: 5, // Limit each IP to 5 signup attempts per hour
	message: {
		success: false,
		message: 'Too many accounts created from this IP, please try again after an hour'
	},
	standardHeaders: true,
	legacyHeaders: false,
});

// Password reset rate limiter
const passwordResetLimiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 1 hour
	max: 3, // Limit each IP to 3 password reset requests per hour
	message: {
		success: false,
		message: 'Too many password reset attempts, please try again after an hour'
	},
	standardHeaders: true,
	legacyHeaders: false,
});

module.exports = {
	apiLimiter,
	authLimiter,
	signupLimiter,
	passwordResetLimiter
};
