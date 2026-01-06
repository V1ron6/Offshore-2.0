import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { SessionContext } from './sessionContextDef';

// Configuration constants
const IDLE_TIME = 15 * 60 * 1000; // 15 minutes
const WARNING_DURATION = 60; // 60 seconds grace period
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export const SessionProvider = ({ children }) => {
	const navigate = useNavigate();
	const [showSessionWarning, setShowSessionWarning] = useState(false);
	const [timeRemaining, setTimeRemaining] = useState(WARNING_DURATION);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	const idleTimerRef = useRef(null);
	const countdownIntervalRef = useRef(null);
	const performLogoutRef = useRef(null);

	// Perform logout
	const performLogout = useCallback(async () => {
		try {
			const token = localStorage.getItem('token');
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

			// Clear session data
			localStorage.removeItem('token');
			localStorage.removeItem('user');
			sessionStorage.removeItem('token');
			sessionStorage.removeItem('user');

			setShowSessionWarning(false);
			setIsAuthenticated(false);
			navigate('/login');
		} catch (error) {
			console.error('Logout error:', error);
			navigate('/login');
		}
	}, [navigate]);

	// Keep performLogoutRef updated
	useEffect(() => {
		performLogoutRef.current = performLogout;
	}, [performLogout]);

	// Start countdown to logout
	const startLogoutCountdown = useCallback(() => {
		let secondsLeft = WARNING_DURATION;
		setTimeRemaining(secondsLeft);

		countdownIntervalRef.current = setInterval(() => {
			secondsLeft -= 1;
			setTimeRemaining(secondsLeft);

			if (secondsLeft <= 0) {
				clearInterval(countdownIntervalRef.current);
				if (performLogoutRef.current) {
					performLogoutRef.current();
				}
			}
		}, 1000);
	}, []);

	// Reset idle timer
	const resetIdleTimer = useCallback(() => {
		// Clear existing timers
		if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
		if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

		// Hide warning if visible
		setShowSessionWarning(false);
		setTimeRemaining(WARNING_DURATION);

		// Set new idle timer
		idleTimerRef.current = setTimeout(() => {
			setShowSessionWarning(true);
			startLogoutCountdown();
		}, IDLE_TIME);
	}, [startLogoutCountdown]);

	// Continue session
	const continueSession = useCallback(() => {
		if (countdownIntervalRef.current) {
			clearInterval(countdownIntervalRef.current);
		}
		resetIdleTimer();
	}, [resetIdleTimer]);

	// Setup activity listeners
	useEffect(() => {
		const handleActivity = () => {
			if (isAuthenticated && !showSessionWarning) {
				resetIdleTimer();
			}
		};

		const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

		if (isAuthenticated) {
			events.forEach(event => {
				document.addEventListener(event, handleActivity);
			});

			// Initial timer setup
			resetIdleTimer();
		}

		// Cleanup
		return () => {
			events.forEach(event => {
				document.removeEventListener(event, handleActivity);
			});
			if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
			if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
		};
	}, [isAuthenticated, resetIdleTimer, showSessionWarning]);

	const value = {
		showSessionWarning,
		timeRemaining,
		continueSession,
		performLogout,
		setIsAuthenticated,
		isAuthenticated
	};

	return (
		<SessionContext.Provider value={value}>
			{children}
		</SessionContext.Provider>
	);
};
