/**
 * Theme Toggle Component
 * Button to switch between light and dark modes
 */

import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeContext.jsx';

const ThemeToggle = ({ className = '' }) => {
	const { isDark, toggleTheme } = useTheme();

	return (
		<button
			onClick={toggleTheme}
			className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
				isDark 
					? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
					: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
			} ${className}`}
			aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
			title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
		>
			{isDark ? (
				<Sun className="w-5 h-5" />
			) : (
				<Moon className="w-5 h-5" />
			)}
		</button>
	);
};

export default ThemeToggle;
