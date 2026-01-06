/**
 * Session Management Utilities
 * Client-side utilities for managing user sessions and authentication
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

/**
 * Check if user is authenticated
 * @returns {boolean} - True if user has valid token
 */
export const isAuthenticated = () => {
	const token = localStorage.getItem('authToken');
	return !!token;
};

/**
 * Get current user from localStorage
 * @returns {object|null} - User object or null
 */
export const getCurrentUser = () => {
	const user = localStorage.getItem('user');
	return user ? JSON.parse(user) : null;
};

/**
 * Get auth token
 * @returns {string|null} - Auth token or null
 */
export const getAuthToken = () => {
	return localStorage.getItem('authToken');
};

/**
 * Check session status on server
 * @returns {object} - Session status response
 */
export const checkSessionStatus = async () => {
	try {
		const token = getAuthToken();
		if (!token) {
			return { status: 'expired', message: 'No active session' };
		}

		const response = await fetch(`${API_BASE_URL}/user/session-status`, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			if (response.status === 401) {
				return { status: 'expired', message: 'Session expired' };
			}
			throw new Error('Failed to check session status');
		}

		const data = await response.json();
		return data.session;
	} catch (error) {
		console.error('Session check error:', error);
		return { status: 'error', message: error.message };
	}
};

/**
 * Logout user
 * @returns {boolean} - True if logout successful
 */
export const logoutUser = async () => {
	try {
		const token = getAuthToken();
		if (token) {
			try {
				await fetch(`${API_BASE_URL}/user/logout`, {
					method: 'POST',
					headers: {
						'Authorization': `Bearer ${token}`,
						'Content-Type': 'application/json'
					}
				});
			} catch (err) {
				console.error('Logout API call failed:', err);
			}
		}

		// Clear local storage
		localStorage.removeItem('authToken');
		localStorage.removeItem('user');
		sessionStorage.removeItem('authToken');
		sessionStorage.removeItem('user');

		return true;
	} catch (error) {
		console.error('Logout error:', error);
		return false;
	}
};

/**
 * Get session info for display
 * @returns {object} - Session information
 */
export const getSessionInfo = () => {
	const user = getCurrentUser();
	const token = getAuthToken();

	return {
		isAuthenticated: !!token,
		user: user,
		loginTime: user?.loginTime || null,
		sessionDuration: user ? new Date().getTime() - new Date(user.loginTime).getTime() : 0
	};
};

/**
 * Format milliseconds to readable time format
 * @param {number} ms - Milliseconds
 * @returns {string} - Formatted time
 */
export const formatSessionDuration = (ms) => {
	const totalSeconds = Math.floor(ms / 1000);
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;

	if (hours > 0) {
		return `${hours}h ${minutes}m ${seconds}s`;
	} else if (minutes > 0) {
		return `${minutes}m ${seconds}s`;
	} else {
		return `${seconds}s`;
	}
};
