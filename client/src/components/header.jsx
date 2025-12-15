/**
 * ========================================
 * Header Component
 * ========================================
 * 
 * Navigation header component that appears on all pages.
 * Provides navigation links, user menu, and responsive design.
 * 
 * Features:
 * - Responsive navigation bar
 * - Logo and branding
 * - Navigation links
 * - User authentication status display
 * - Mobile menu support
 * - Dark mode ready
 */

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, User, BarChart3, LogIn } from 'lucide-react';

/**
 * Header Component
 * Displays top navigation and branding
 */
const Header = () => {
	// ========================================
	// STATE MANAGEMENT
	// ========================================
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [userMenuOpen, setUserMenuOpen] = useState(false);

	// ========================================
	// HOOKS
	// ========================================
	const navigate = useNavigate();
	const location = useLocation();

	// ========================================
	// DERIVED STATE
	// ========================================
	// Check if user is logged in from localStorage
	const user = JSON.parse(localStorage.getItem('user') || 'null');
	const isLoggedIn = !!user;

	// ========================================
	// EVENT HANDLERS
	// ========================================

	/**
	 * Handle user logout
	 * Clears user data from localStorage and redirects to home
	 */
	const handleLogout = () => {
		localStorage.removeItem('user');
		localStorage.removeItem('rememberMe');
		setUserMenuOpen(false);
		navigate('/');
	};

	/**
	 * Check if current route is active
	 * @param {string} path - Route path to check
	 * @returns {boolean} - True if path matches current location
	 */
	const isActive = (path) => location.pathname === path;

	/**
	 * Get active link styling
	 * @param {string} path - Route path
	 * @returns {string} - Tailwind classes for active/inactive state
	 */
	const getLinkClass = (path) => {
		return `
			px-4 py-2 rounded-md transition duration-200
			${isActive(path) 
				? 'bg-white text-red-500 font-semibold shadow-md' 
				: 'text-white hover:bg-red-400'
			}
		`;
	};

	// ========================================
	// RENDER
	// ========================================

	return (
		<header className="bg-gradient-to-r from-red-400 to-red-500 shadow-lg sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					{/* Logo Section */}
					<Link 
						to="/" 
						className="flex items-center group"
						title="Go to home page"
					>
						<h1 className="text-2xl font-bold text-white group-hover:scale-105 transition transform duration-200">
							Off<span className="text-yellow-200">Shore</span>
						</h1>
					</Link>

					{/* Desktop Navigation Menu */}
					<nav className="hidden md:flex items-center space-x-2">
						{/* Public Links */}
						<Link to="/" className={getLinkClass('/')}>
							Home
						</Link>

						{/* Conditional Links Based on Login Status */}
						{!isLoggedIn ? (
							<>
								<Link to="/login" className={getLinkClass('/login')}>
									Login
								</Link>
								<Link to="/signup" className={getLinkClass('/signup')}>
									Signup
								</Link>
							</>
						) : (
							<>
								<Link to="/dashboard" className={getLinkClass('/dashboard')}>
									Dashboard
								</Link>
								<Link to="/profile" className={getLinkClass('/profile')}>
									Profile
								</Link>
							</>
						)}
					</nav>

					{/* User Menu / Auth Button - Desktop */}
					<div className="hidden md:flex items-center">
						{isLoggedIn ? (
							<div className="relative">
								{/* User Profile Button */}
								<button
									onClick={() => setUserMenuOpen(!userMenuOpen)}
									className="flex items-center space-x-2 bg-white text-red-500 px-4 py-2 rounded-md hover:bg-red-50 transition duration-200 font-semibold"
									title={`Logged in as ${user.username}`}
								>
									<User size={18} />
									<span className="hidden sm:inline">{user.username}</span>
									<span className={`transition transform ${userMenuOpen ? 'rotate-180' : ''}`}>
										▼
									</span>
								</button>

								{/* User Dropdown Menu */}
								{userMenuOpen && (
									<div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 border border-gray-200">
										<Link
											to="/profile"
											className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
											onClick={() => setUserMenuOpen(false)}
										>
											<User size={16} className="mr-2" />
											My Profile
										</Link>
										<Link
											to="/dashboard"
											className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
											onClick={() => setUserMenuOpen(false)}
										>
											<BarChart3 size={16} className="mr-2" />
											Dashboard
										</Link>
										<hr className="my-2" />
										<button
											onClick={handleLogout}
											className="w-full text-left flex items-center px-4 py-2 text-red-600 hover:bg-red-50 transition font-semibold"
										>
											<LogOut size={16} className="mr-2" />
											Logout
										</button>
									</div>
								)}
							</div>
						) : (
							<Link
								to="/login"
								className="flex items-center bg-white text-red-500 px-6 py-2 rounded-md hover:bg-red-50 transition font-semibold"
							>
								<LogIn size={18} className="mr-2" />
								Login
							</Link>
						)}
					</div>

					{/* Mobile Menu Toggle Button */}
					<button
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						className="md:hidden text-white hover:bg-red-400 p-2 rounded-md transition"
						title="Toggle mobile menu"
						aria-label="Toggle menu"
					>
						{mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
					</button>
				</div>

				{/* Mobile Navigation Menu */}
				{mobileMenuOpen && (
					<nav className="md:hidden pb-4 space-y-2">
						<Link
							to="/"
							className="block px-4 py-2 text-white hover:bg-red-400 rounded-md transition"
							onClick={() => setMobileMenuOpen(false)}
						>
							Home
						</Link>

						{!isLoggedIn ? (
							<>
								<Link
									to="/login"
									className="block px-4 py-2 text-white hover:bg-red-400 rounded-md transition"
									onClick={() => setMobileMenuOpen(false)}
								>
									Login
								</Link>
								<Link
									to="/signup"
									className="block px-4 py-2 text-white hover:bg-red-400 rounded-md transition"
									onClick={() => setMobileMenuOpen(false)}
								>
									Signup
								</Link>
							</>
						) : (
							<>
								<Link
									to="/dashboard"
									className="block px-4 py-2 text-white hover:bg-red-400 rounded-md transition"
									onClick={() => setMobileMenuOpen(false)}
								>
									Dashboard
								</Link>
								<Link
									to="/profile"
									className="block px-4 py-2 text-white hover:bg-red-400 rounded-md transition"
									onClick={() => setMobileMenuOpen(false)}
								>
									Profile
								</Link>
								<button
									onClick={handleLogout}
									className="w-full text-left px-4 py-2 text-white hover:bg-red-400 rounded-md transition font-semibold"
								>
									Logout
								</button>
							</>
						)}
					</nav>
				)}
			</div>
		</header>
	);
};

export default Header;

/**
 * Header Component
 * Displays top navigation and branding
 */
const Header = () => {
	// ========================================
	// STATE MANAGEMENT
	// ========================================
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [userMenuOpen, setUserMenuOpen] = useState(false);

	// ========================================
	// HOOKS
	// ========================================
	const navigate = useNavigate();
	const location = useLocation();

	// ========================================
	// DERIVED STATE
	// ========================================
	// Check if user is logged in from localStorage
	const user = JSON.parse(localStorage.getItem('user') || 'null');
	const isLoggedIn = !!user;

	// ========================================
	// EVENT HANDLERS
	// ========================================

	/**
	 * Handle user logout
	 * Clears user data from localStorage and redirects to home
	 */
	const handleLogout = () => {
		localStorage.removeItem('user');
		localStorage.removeItem('rememberMe');
		setUserMenuOpen(false);
		navigate('/');
	};

	/**
	 * Check if current route is active
	 * @param {string} path - Route path to check
	 * @returns {boolean} - True if path matches current location
	 */
	const isActive = (path) => location.pathname === path;

	/**
	 * Get active link styling
	 * @param {string} path - Route path
	 * @returns {string} - Tailwind classes for active/inactive state
	 */
	const getLinkClass = (path) => {
		return `
			px-4 py-2 rounded-md transition duration-200
			${isActive(path) 
				? 'bg-white text-red-500 font-semibold shadow-md' 
				: 'text-white hover:bg-red-400'
			}
		`;
	};

	// ========================================
	// RENDER
	// ========================================

	return (
		<header className="bg-gradient-to-r from-red-400 to-red-500 shadow-lg sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					{/* Logo Section */}
					<Link 
						to="/" 
						className="flex items-center group"
						title="Go to home page"
					>
						<h1 className="text-2xl font-bold text-white group-hover:scale-105 transition transform duration-200">
							Off<span className="text-yellow-200">Shore</span>
						</h1>
					</Link>

					{/* Desktop Navigation Menu */}
					<nav className="hidden md:flex items-center space-x-2">
						{/* Public Links */}
						<Link to="/" className={getLinkClass('/')}>
							Home
						</Link>

						{/* Conditional Links Based on Login Status */}
						{!isLoggedIn ? (
							<>
								<Link to="/login" className={getLinkClass('/login')}>
									Login
								</Link>
								<Link to="/signup" className={getLinkClass('/signup')}>
									Signup
								</Link>
							</>
						) : (
							<>
								<Link to="/dashboard" className={getLinkClass('/dashboard')}>
									Dashboard
								</Link>
								<Link to="/profile" className={getLinkClass('/profile')}>
									Profile
								</Link>
							</>
						)}
					</nav>

					{/* User Menu / Auth Button - Desktop */}
					<div className="hidden md:flex items-center">
						{isLoggedIn ? (
							<div className="relative">
								{/* User Profile Button */}
								<button
									onClick={() => setUserMenuOpen(!userMenuOpen)}
									className="flex items-center space-x-2 bg-white text-red-500 px-4 py-2 rounded-md hover:bg-red-50 transition duration-200 font-semibold"
									title={`Logged in as ${user.username}`}
								>
									<span className="text-xl">👤</span>
									<span className="hidden sm:inline">{user.username}</span>
									<span className={`transition transform ${userMenuOpen ? 'rotate-180' : ''}`}>
										▼
									</span>
								</button>

								{/* User Dropdown Menu */}
								{userMenuOpen && (
									<div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 border border-gray-200">
										<Link
											to="/profile"
											className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
											onClick={() => setUserMenuOpen(false)}
										>
											👤 My Profile
										</Link>
										<Link
											to="/dashboard"
											className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
											onClick={() => setUserMenuOpen(false)}
										>
											📊 Dashboard
										</Link>
										<hr className="my-2" />
										<button
											onClick={handleLogout}
											className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition font-semibold"
										>
											🚪 Logout
										</button>
									</div>
								)}
							</div>
						) : (
							<Link
								to="/login"
								className="bg-white text-red-500 px-6 py-2 rounded-md hover:bg-red-50 transition font-semibold"
							>
								Login
							</Link>
						)}
					</div>

					{/* Mobile Menu Toggle Button */}
					<button
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						className="md:hidden text-white hover:bg-red-400 p-2 rounded-md transition"
						title="Toggle mobile menu"
						aria-label="Toggle menu"
					>
						<svg
							className={`w-6 h-6 transform transition ${mobileMenuOpen ? 'rotate-90' : ''}`}
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d={mobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
							/>
						</svg>
					</button>
				</div>

				{/* Mobile Navigation Menu */}
				{mobileMenuOpen && (
					<nav className="md:hidden pb-4 space-y-2">
						<Link
							to="/"
							className="block px-4 py-2 text-white hover:bg-red-400 rounded-md transition"
							onClick={() => setMobileMenuOpen(false)}
						>
							Home
						</Link>

						{!isLoggedIn ? (
							<>
								<Link
									to="/login"
									className="block px-4 py-2 text-white hover:bg-red-400 rounded-md transition"
									onClick={() => setMobileMenuOpen(false)}
								>
									Login
								</Link>
								<Link
									to="/signup"
									className="block px-4 py-2 text-white hover:bg-red-400 rounded-md transition"
									onClick={() => setMobileMenuOpen(false)}
								>
									Signup
								</Link>
							</>
						) : (
							<>
								<Link
									to="/dashboard"
									className="block px-4 py-2 text-white hover:bg-red-400 rounded-md transition"
									onClick={() => setMobileMenuOpen(false)}
								>
									Dashboard
								</Link>
								<Link
									to="/profile"
									className="block px-4 py-2 text-white hover:bg-red-400 rounded-md transition"
									onClick={() => setMobileMenuOpen(false)}
								>
									Profile
								</Link>
								<button
									onClick={handleLogout}
									className="w-full text-left px-4 py-2 text-white hover:bg-red-400 rounded-md transition font-semibold"
								>
									Logout
								</button>
							</>
						)}
					</nav>
				)}
			</div>
		</header>
	);
};

export default Header;