/**
 * Session Management Middleware
 * Tracks user sessions and implements idle timeouts on the server side
 */

const activeSessionsMap = new Map(); // Map to store user sessions

// Configuration
const SESSION_CONFIG = {
	IDLE_TIMEOUT: 16 * 60 * 1000, // 16 minutes (15 min idle + 1 min warning)
	WARNING_TIME: 15 * 60 * 1000, // 15 minutes
	CLEANUP_INTERVAL: 60 * 1000 // Clean up expired sessions every 1 minute
};

// Initialize cleanup interval
setInterval(() => {
	const now = Date.now();
	for (const [userId, session] of activeSessionsMap.entries()) {
		if (now - session.lastActivity > SESSION_CONFIG.IDLE_TIMEOUT) {
			activeSessionsMap.delete(userId);
			console.log(`Session expired for user: ${userId}`);
		}
	}
}, SESSION_CONFIG.CLEANUP_INTERVAL);

/**
 * Middleware to track session activity
 */
const sessionTrackerMiddleware = (req, res, next) => {
	// Extract user from token (assumes verifyToken middleware has run)
	if (req.user && req.user.id) {
		const userId = req.user.id;
		const now = Date.now();

		// Create or update session
		if (!activeSessionsMap.has(userId)) {
			activeSessionsMap.set(userId, {
				userId,
				loginTime: now,
				lastActivity: now,
				ipAddress: req.ip,
				userAgent: req.get('user-agent')
			});
		} else {
			const session = activeSessionsMap.get(userId);
			session.lastActivity = now;
			activeSessionsMap.set(userId, session);
		}

		// Attach session info to request
		req.session = activeSessionsMap.get(userId);
	}

	next();
};

/**
 * Check if user session is idle and should be warned/logged out
 */
const checkSessionStatus = (userId) => {
	if (!activeSessionsMap.has(userId)) {
		return { status: 'expired', message: 'No active session' };
	}

	const session = activeSessionsMap.get(userId);
	const timeSinceActivity = Date.now() - session.lastActivity;

	if (timeSinceActivity > SESSION_CONFIG.IDLE_TIMEOUT) {
		activeSessionsMap.delete(userId);
		return { status: 'expired', message: 'Session expired due to inactivity' };
	}

	if (timeSinceActivity > SESSION_CONFIG.WARNING_TIME) {
		return { 
			status: 'warning', 
			message: 'Session will expire soon',
			timeRemaining: Math.ceil((SESSION_CONFIG.IDLE_TIMEOUT - timeSinceActivity) / 1000)
		};
	}

	return { 
		status: 'active', 
		message: 'Session is active',
		timeRemaining: Math.ceil((SESSION_CONFIG.WARNING_TIME - timeSinceActivity) / 1000)
	};
};

/**
 * Get all active sessions (admin use)
 */
const getActiveSessions = () => {
	return Array.from(activeSessionsMap.values());
};

/**
 * Terminate user session
 */
const terminateSession = (userId) => {
	if (activeSessionsMap.has(userId)) {
		activeSessionsMap.delete(userId);
		return true;
	}
	return false;
};

/**
 * Get session for user
 */
const getSession = (userId) => {
	return activeSessionsMap.get(userId) || null;
};

module.exports = {
	sessionTrackerMiddleware,
	checkSessionStatus,
	getActiveSessions,
	terminateSession,
	getSession,
	activeSessionsMap
};
