/**
 * Theme Context
 * Handles dark/light mode toggle and persistence
 */

import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
	const [isDark, setIsDark] = useState(() => {
		// Check localStorage first
		const saved = localStorage.getItem('theme');
		if (saved) {
			return saved === 'dark';
		}
		// Check system preference
		return window.matchMedia('(prefers-color-scheme: dark)').matches;
	});

	useEffect(() => {
		// Update document class and localStorage
		if (isDark) {
			document.documentElement.classList.add('dark');
			localStorage.setItem('theme', 'dark');
		} else {
			document.documentElement.classList.remove('dark');
			localStorage.setItem('theme', 'light');
		}
	}, [isDark]);

	const toggleTheme = () => {
		setIsDark(prev => !prev);
	};

	const setTheme = (theme) => {
		setIsDark(theme === 'dark');
	};

	return (
		<ThemeContext.Provider value={{ isDark, toggleTheme, setTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};

export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}
	return context;
};
