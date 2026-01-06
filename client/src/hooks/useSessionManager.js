import { useEffect, useRef, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Custom hook for session management with idle detection
 * - Monitors user activity
 * - Alerts after 15 minutes of inactivity
 * - Logs out after 16 minutes (15 min + 1 min grace period)
 */
export const useSessionManager = () => {
	const navigate = useNavigate();
	const timeoutRef = useRef(null);
	const idleTimerRef = useRef(null);
	const [showSessionWarning, setShowSessionWarning] = useState(false);
	const [timeRemaining, setTimeRemaining] = useState(60); // seconds until logout

	// Track user activity events
	const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

	// Reset the idle timer
	const resetIdleTimer = useCallback(() => {
		// Clear existing timers
		if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
		if (timeoutRef.current) clearTimeout(timeoutRef.current);

		// Hide warning if visible
		setShowSessionWarning(false);
		setTimeRemaining(60);

		// Set new idle timer (15 minutes = 900000 ms)
		idleTimerRef.current = setTimeout(() => {
			setShowSessionWarning(true);
			startLogoutCountdown();
		}, 900000); // 15 minutes
	}, []);

	// Start countdown to logout (1 minute = 60000 ms)
	const startLogoutCountdown = useCallback(() => {
		let secondsLeft = 60;
		setTimeRemaining(secondsLeft);

		const countdownInterval = setInterval(() => {
			secondsLeft -= 1;
			setTimeRemaining(secondsLeft);

			if (secondsLeft <= 0) {
				clearInterval(countdownInterval);
				handleLogout();
			}
		}, 1000);

		timeoutRef.current = countdownInterval;
	}, []);

	// Handle session continuation
	const continueSession = useCallback(() => {
		if (timeoutRef.current) {
			clearInterval(timeoutRef.current);
		}
		resetIdleTimer();
	}, [resetIdleTimer]);

	// Handle logout
	const handleLogout = useCallback(async () => {
		try {
			// Clear session data
			localStorage.removeItem('token');
			localStorage.removeItem('user');
			sessionStorage.removeItem('token');
			sessionStorage.removeItem('user');

			// Call logout endpoint if needed
			const token = localStorage.getItem('token');
			if (token) {
				try {
					await fetch('http://localhost:4000/api/user/logout', {
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

			// Redirect to login
			setShowSessionWarning(false);
			navigate('/login');
		} catch (error) {
			console.error('Logout error:', error);
			navigate('/login');
		}
	}, [navigate]);

	// Add event listeners
	useEffect(() => {
		const handleActivity = () => {
			resetIdleTimer();
		};

		// Add listeners for activity events
		events.forEach(event => {
			document.addEventListener(event, handleActivity);
		});

		// Initial timer setup
		resetIdleTimer();

		// Cleanup
		return () => {
			events.forEach(event => {
				document.removeEventListener(event, handleActivity);
			});
			if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
			if (timeoutRef.current) clearInterval(timeoutRef.current);
		};
	}, [resetIdleTimer]);

	return {
		showSessionWarning,
		timeRemaining,
		continueSession,
		handleLogout
	};
};
