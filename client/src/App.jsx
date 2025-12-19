import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header.jsx';
import Home from './pages/home.jsx';
import Login from './pages/login.jsx';
import Signup from './pages/signup.jsx';
import Dashboard from './pages/dashboard.jsx';
import Profile from './pages/profile.jsx';
import NotFound from './pages/notfound.jsx';

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
						<Route path="/" element={<Home />} />
						<Route path="/login" element={<Login />} />
						<Route path="/signup" element={<Signup />} />
						<Route path="/dashboard" element={<Dashboard />} />
						<Route path="/profile" element={<Profile />} />
						<Route path="*" element={<NotFound />} />
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
