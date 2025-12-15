
/**
 * ========================================
 * App Component - Main Application Root
 * ========================================
 * 
 * This is the main application component that serves as the entry point
 * for the entire Offshore application. It manages routing, layout structure,
 * and global application state.
 * 
 * Features:
 * - Routes configuration and management
 * - Global header component
 * - Layout structure
 * - Error boundary ready
 * - Responsive design
 */

import './index.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/header.jsx';
import Home from './pages/home.jsx';
import Login from './pages/login.jsx';
import Signup from './pages/signup.jsx';
import Dashboard from './pages/dashboard.jsx';
import NotFound from './pages/notfound.jsx';
import Profile from './pages/profile.jsx';

/**
 * Main App Component
 * Configures all routes and renders the application layout
 */
const App = () => {
	return (
		<Router>
			<div className="min-h-screen flex flex-col bg-gray-50">
				{/* Header - Appears on all pages */}
				<Header />

				{/* Main Content Area */}
				<main className="flex-1 w-full">
					<Routes>
						{/* Public Routes */}
						<Route path="/" element={<Home />} />
						<Route path="/login" element={<Login />} />
						<Route path="/signup" element={<Signup />} />

						{/* Protected Routes */}
						<Route path="/dashboard" element={<Dashboard />} />
						<Route path="/profile" element={<Profile />} />

						{/* 404 Not Found Route */}
						<Route path="/notfound" element={<NotFound />} />
						<Route path="*" element={<Navigate to="/notfound" replace />} />
					</Routes>
				</main>

				{/* Footer */}
				<footer className="bg-gray-800 text-white text-center py-6 mt-12">
					<p>&copy; 2025 Offshore. All rights reserved.</p>
					<p className="text-sm text-gray-400 mt-2">Made with ❤️ by the Offshore Team</p>
				</footer>
			</div>
		</Router>
	);
};

export default App;
