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
import { useNavigate ,Link } from 'react-router-dom';
import { User, LogOut, Lock, Edit2, MessageSquare, HelpCircle } from 'lucide-react';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import Alert from '../components/Alert.jsx';
import LoadingScreen  from '../components/LoadingScreen.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
const Profile = () => {
	// ========================================
	// STATE MANAGEMENT
	// ========================================
	const [user, setUser] = useState(null);
	const [showAlert, setShowAlert] = useState(false);
	const [alertMessage, setAlertMessage] = useState('');
	const [showEditModal, setShowEditModal] = useState(false);
	const [editUsername, setEditUsername] = useState('');
	const [showPasswordModal, setShowPasswordModal] = useState(false);
	const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
	const [show2FAModal, setShow2FAModal] = useState(false);
	const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
	const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);

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
	 * Copy user ID to clipboard
	 */
	const handleCopyId = () => {
		navigator.clipboard.writeText(user.id);
		setAlertMessage('User ID copied to clipboard!');
		setShowAlert(true);
		setTimeout(() => setShowAlert(false), 3000);
	};

	/**
	 * Handle edit username
	 */
	const handleEditProfile = () => {
		setEditUsername(user.username);
		setShowEditModal(true);
	};

	const handleSaveProfile = () => {
		if (editUsername.trim() && editUsername !== user.username) {
			const updatedUser = { ...user, username: editUsername };
			setUser(updatedUser);
			localStorage.setItem('user', JSON.stringify(updatedUser));
			setAlertMessage('Profile updated successfully!');
			setShowAlert(true);
			setShowEditModal(false);
		}
	};

	/**
	 * Handle password change
	 */
	const handleChangePassword = () => {
		if (passwordData.new !== passwordData.confirm) {
			setAlertMessage('New passwords do not match!');
			setShowAlert(true);
			return;
		}
		if (passwordData.new.length < 6) {
			setAlertMessage('Password must be at least 6 characters!');
			setShowAlert(true);
			return;
		}
		setAlertMessage('Password changed successfully!');
		setShowAlert(true);
		setPasswordData({ current: '', new: '', confirm: '' });
		setShowPasswordModal(false);
	};

	/**
	 * Handle 2FA toggle
	 */
	const handleEnable2FA = () => {
		setAlertMessage('Two-Factor Authentication has been enabled!');
		setShowAlert(true);
		setShow2FAModal(false);
	};
	const handleLogout = () => {
		setShowLogoutConfirm(true);
	};

	const confirmLogout = () => {
		localStorage.removeItem('user');
		localStorage.removeItem('authToken');
		localStorage.removeItem('rememberMe');
		setShowLogoutConfirm(false);
		setAlertMessage('Logged out successfully!');
		setShowAlert(true);
		setTimeout(() => navigate('/'), 1500);
	};

	/**
	 * Handle download user data
	 */
	const handleDownloadData = () => {
		const userData = JSON.stringify(user, null, 2);
		const element = document.createElement('a');
		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(userData));
		element.setAttribute('download', `user-data-${user.id}.json`);
		element.style.display = 'none';
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
		setAlertMessage('User data downloaded successfully!');
		setShowAlert(true);
	};

	/**
	 * Handle deactivate account
	 */
	const handleDeactivateAccount = () => {
		setShowDeactivateConfirm(true);
	};

	const confirmDeactivateAccount = () => {
		localStorage.removeItem('user');
		localStorage.removeItem('authToken');
		localStorage.removeItem('rememberMe');
		setShowDeactivateConfirm(false);
		setAlertMessage('Account deactivated. Redirecting to home...');
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
											onClick={handleEditProfile}
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
									<button 
										onClick={handleCopyId}
										className="text-blue-500 hover:text-blue-600 text-sm font-semibold hover:bg-blue-50 px-2 py-1 rounded transition"
									>
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
										onClick={() => setShowPasswordModal(true)}
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
										onClick={handleEnable2FA}
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
									onClick={handleDownloadData}
								>
									💾 Download My Data
								</Button>
								<Button
									variant="secondary"
									size="sm"
									fullWidth
									className="text-left"
									onClick={handleDeactivateAccount}
								>
									🔄 Deactivate Account
								</Button>
								
								<Link to="/app">
								<Button
									variant="secondary"
									size="sm"
									fullWidth
									className="text-left"
								>
									back
								</Button>
								</Link>

								<Link to="/wishlist">
								<Button
									variant="secondary"
									size="sm"
									fullWidth
									className="text-left"
								>
									wishlist
								</Button>
								</Link>
							</div>
						</Card>

						{/* Help & Support Card */}
						<Card title="Help & Support">
							<div className="space-y-3">
								<p className="text-sm text-gray-600">
									Need help? Have a concern? We're here for you!
								</p>
								<Link to="/complaints">
									<Button
										variant="danger"
										size="sm"
										fullWidth
										className="flex items-center justify-center gap-2"
									>
										<MessageSquare size={16} />
										Submit a Complaint
									</Button>
								</Link>
								<div className="pt-2 border-t border-gray-200">
									<p className="text-xs text-gray-500 flex items-center gap-1">
										<HelpCircle size={12} />
										Our team typically responds within 24 hours
									</p>
								</div>
							</div>
						</Card>
					</div>
				</div>
			</div>

			{/* Edit Profile Modal */}
			{showEditModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<Card className="w-full max-w-md">
						<h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-semibold text-gray-900 mb-2">Username</label>
								<input
									type="text"
									value={editUsername}
									onChange={(e) => setEditUsername(e.target.value)}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
									placeholder="Enter new username"
								/>
							</div>
							<div className="flex gap-3 pt-4">
								<button
									onClick={() => setShowEditModal(false)}
									className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg font-semibold hover:bg-gray-300 transition"
								>
									Cancel
								</button>
								<button
									onClick={handleSaveProfile}
									className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition"
								>
									Save Changes
								</button>
							</div>
						</div>
					</Card>
				</div>
			)}

			{/* Change Password Modal */}
			{showPasswordModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<Card className="w-full max-w-md">
						<h2 className="text-2xl font-bold mb-4">Change Password</h2>
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-semibold text-gray-900 mb-2">Current Password</label>
								<input
									type="password"
									value={passwordData.current}
									onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
									placeholder="Enter current password"
								/>
							</div>
							<div>
								<label className="block text-sm font-semibold text-gray-900 mb-2">New Password</label>
								<input
									type="password"
									value={passwordData.new}
									onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
									placeholder="Enter new password"
								/>
							</div>
							<div>
								<label className="block text-sm font-semibold text-gray-900 mb-2">Confirm Password</label>
								<input
									type="password"
									value={passwordData.confirm}
									onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
									placeholder="Confirm new password"
								/>
							</div>
							<div className="flex gap-3 pt-4">
								<button
									onClick={() => setShowPasswordModal(false)}
									className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg font-semibold hover:bg-gray-300 transition"
								>
									Cancel
								</button>
								<button
									onClick={handleChangePassword}
									className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition"
								>
									Change Password
								</button>
							</div>
						</div>
					</Card>
				</div>
			)}

			{/* Enable 2FA Modal */}
			{show2FAModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<Card className="w-full max-w-md">
						<h2 className="text-2xl font-bold mb-4">Enable Two-Factor Authentication</h2>
						<div className="space-y-4">
							<div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
								<p className="text-sm text-blue-700 mb-3">
									Two-Factor Authentication (2FA) adds an extra layer of security to your account by requiring a second verification method.
								</p>
								<div className="space-y-2 text-sm text-blue-700">
									<p>✓ You'll receive a code via SMS or email</p>
									<p>✓ Enter the code to complete login</p>
									<p>✓ Your account will be more secure</p>
								</div>
							</div>
							<div>
								<label className="block text-sm font-semibold text-gray-900 mb-2">Verification Method</label>
								<select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
									<option>Email (Recommended)</option>
									<option>SMS</option>
								</select>
							</div>
							<div className="flex gap-3 pt-4">
								<button
									onClick={() => setShow2FAModal(false)}
									className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg font-semibold hover:bg-gray-300 transition"
								>
									Cancel
								</button>
								<button
									onClick={handleEnable2FA}
									className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition"
								>
									Enable 2FA
								</button>
							</div>
						</div>
					</Card>
				</div>
			)}

			{/* Logout Confirmation Dialog */}
			<ConfirmDialog
				isOpen={showLogoutConfirm}
				onClose={() => setShowLogoutConfirm(false)}
				onConfirm={confirmLogout}
				title="Logout"
				message="Are you sure you want to logout? You'll need to sign in again to access your account."
				confirmText="Logout"
				type="logout"
			/>

			{/* Deactivate Account Confirmation Dialog */}
			<ConfirmDialog
				isOpen={showDeactivateConfirm}
				onClose={() => setShowDeactivateConfirm(false)}
				onConfirm={confirmDeactivateAccount}
				title="Deactivate Account"
				message="Are you sure you want to deactivate your account? This action cannot be undone and you will lose access to all your data."
				confirmText="Deactivate"
				type="delete"
			/>
		</div>
	);
};

export default Profile;