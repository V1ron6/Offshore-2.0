/**
 * ========================================
 * Profile Page Component
 * ========================================
 * 
 * User profile display and management.
 * Shows user information and account details.
 * 
 * Features:
 * - User information display
 * - Account statistics
 * - Session management
 * - Logout functionality
 * - Protected route (requires authentication)
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Lock, Edit2 } from 'lucide-react';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import Alert from '../components/Alert.jsx';

const Profile = () => {
	// ========================================
	// STATE MANAGEMENT
	// ========================================
	const [user, setUser] = useState(null);
	const [showAlert, setShowAlert] = useState(false);
	const [alertMessage, setAlertMessage] = useState('');

	// ========================================
	// HOOKS
	// ========================================
	const navigate = useNavigate();

	// ========================================
	// EFFECTS
	// ========================================

	/**
	 * Check authentication on mount
	 */
	useEffect(() => {
		const userData = JSON.parse(localStorage.getItem('user') || 'null');
		if (!userData) {
			navigate('/login');
			return;
		}
		setUser(userData);
	}, [navigate]);

	// ========================================
	// EVENT HANDLERS
	// ========================================

	/**
	 * Handle logout
	 */
	const handleLogout = () => {
		localStorage.removeItem('user');
		localStorage.removeItem('authToken');
		localStorage.removeItem('rememberMe');
		setAlertMessage('Logged out successfully!');
		setShowAlert(true);
		setTimeout(() => navigate('/'), 1500);
	};

	/**
	 * Calculate session duration
	 */
	const getSessionDuration = () => {
		if (!user?.loginTime) return 'Just now';
		
		const loginTime = new Date(user.loginTime);
		const now = new Date();
		const diff = Math.floor((now - loginTime) / 1000);

		if (diff < 60) return `${diff}s ago`;
		if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
		return `${Math.floor(diff / 3600)}h ago`;
	};

	// ========================================
	// RENDER
	// ========================================

	if (!user) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<p className="text-lg text-gray-600">Loading...</p>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-100 py-12">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Page Header */}
				<div className="mb-8">
					<h1 className="text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
					<p className="text-gray-600">Manage your account and view your information</p>
				</div>

				{/* Alert */}
				{showAlert && (
					<Alert
						type="success"
						message={alertMessage}
						onClose={() => setShowAlert(false)}
					/>
				)}

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{/* Main Profile Card */}
					<div className="md:col-span-2 space-y-6">
						{/* Profile Header Card */}
						<Card 
							title="Account Information"
							icon={User}
						>
							<div className="space-y-6">
								{/* Username */}
								<div className="border-b border-gray-200 pb-4">
									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-4">
											<div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
												{user.username.charAt(0).toUpperCase()}
											</div>
											<div>
												<p className="text-sm text-gray-600">Username</p>
												<p className="text-2xl font-bold text-gray-900">{user.username}</p>
											</div>
										</div>
										<Button
											variant="secondary"
											size="sm"
											icon={Edit2}
										>
											Edit
										</Button>
									</div>
								</div>

								{/* User ID */}
								<div className="border-b border-gray-200 pb-4">
									<p className="text-sm text-gray-600 mb-2">User ID</p>
									<div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
										<code className="font-mono text-gray-700">{user.id}</code>
										<button className="text-blue-500 hover:text-blue-600 text-sm font-semibold">
											Copy
										</button>
									</div>
								</div>

								{/* Account Status */}
								<div>
									<p className="text-sm text-gray-600 mb-2">Account Status</p>
									<div className="flex items-center space-x-2">
										<div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
										<span className="text-gray-900 font-semibold">Active</span>
									</div>
								</div>
							</div>
						</Card>

						{/* Security Card */}
						<Card
							title="Security"
							icon={Lock}
						>
							<div className="space-y-4">
								<div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
									<h4 className="font-semibold text-blue-900 mb-2">Password Security</h4>
									<p className="text-sm text-blue-700 mb-3">
										Last changed: <span className="font-semibold">Recently</span>
									</p>
									<Button
										variant="secondary"
										size="sm"
										fullWidth
									>
										Change Password
									</Button>
								</div>

								<div className="bg-green-50 border border-green-200 p-4 rounded-lg">
									<h4 className="font-semibold text-green-900 mb-2">✓ Two-Factor Auth</h4>
									<p className="text-sm text-green-700">
										Not yet enabled. Enable for enhanced security.
									</p>
									<Button
										variant="secondary"
										size="sm"
										fullWidth
										className="mt-3"
									>
										Enable 2FA
									</Button>
								</div>
							</div>
						</Card>
					</div>

					{/* Sidebar */}
					<div className="space-y-6">
						{/* Session Info Card */}
						<Card title="Session">
							<div className="space-y-4">
								<div>
									<p className="text-sm text-gray-600">Logged In Since</p>
									<p className="text-lg font-semibold text-gray-900">
										{user.loginTime ? new Date(user.loginTime).toLocaleDateString() : 'Today'}
									</p>
								</div>
								<div>
									<p className="text-sm text-gray-600">Session Duration</p>
									<p className="text-lg font-semibold text-gray-900">
										{getSessionDuration()}
									</p>
								</div>
								<hr />
								<Button
									variant="danger"
									size="sm"
									onClick={handleLogout}
									icon={LogOut}
									fullWidth
									className="mt-4"
								>
									Logout
								</Button>
							</div>
						</Card>

						{/* Quick Stats */}
						<Card title="Quick Stats">
							<div className="space-y-3 text-sm">
								<div className="flex justify-between">
									<span className="text-gray-600">Account Age</span>
									<span className="font-semibold">New</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-600">Last Login</span>
									<span className="font-semibold">Today</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-600">Total Logins</span>
									<span className="font-semibold">1</span>
								</div>
								<hr />
								<p className="text-xs text-gray-500 mt-2">
									📍 Location: Your Device
								</p>
							</div>
						</Card>

						{/* Account Actions */}
						<Card title="Account">
							<div className="space-y-2">
								<Button
									variant="secondary"
									size="sm"
									fullWidth
									className="text-left"
								>
									💾 Download My Data
								</Button>
								<Button
									variant="secondary"
									size="sm"
									fullWidth
									className="text-left"
								>
									🔄 Deactivate Account
								</Button>
							</div>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Profile;
