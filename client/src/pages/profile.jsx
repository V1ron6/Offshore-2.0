/**
 * ========================================
 * Profile Page Component
 * ========================================
 * 
 * User profile page showing user information and account settings.
 * Displays user details, account activity, and preferences.
 * 
 * Features:
 * - User information display
 * - Account settings
 * - Change password
 * - Activity log
 * - Profile picture upload
 * - Account statistics
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Save, X, Lock, Shield } from 'lucide-react';

/**
 * Profile Component
 * Protected page showing user profile information
 */
const Profile = () => {
	// ========================================
	// STATE MANAGEMENT
	// ========================================
	const [user, setUser] = useState(null);
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({
		email: '',
		phone: '',
		bio: ''
	});

	// ========================================
	// HOOKS
	// ========================================
	const navigate = useNavigate();

	// ========================================
	// EFFECTS
	// ========================================

	/**
	 * Load user data from localStorage on component mount
	 */
	useEffect(() => {
		const userData = localStorage.getItem('user');
		if (!userData) {
			navigate('/login');
			return;
		}

		const parsedUser = JSON.parse(userData);
		setUser(parsedUser);
		setFormData({
			email: parsedUser.email || '',
			phone: parsedUser.phone || '',
			bio: parsedUser.bio || ''
		});
	}, [navigate]);

	// ========================================
	// EVENT HANDLERS
	// ========================================

	/**
	 * Handle form input changes
	 */
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	/**
	 * Handle profile save
	 */
	const handleSaveProfile = () => {
		const updatedUser = { ...user, ...formData };
		localStorage.setItem('user', JSON.stringify(updatedUser));
		setUser(updatedUser);
		setIsEditing(false);
		alert('Profile updated successfully!');
	};

	if (!user) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<p className="text-xl text-gray-600">Loading...</p>
			</div>
		);
	}

	// ========================================
	// RENDER
	// ========================================

	return (
		<>
		<div className="min-h-screen bg-gray-100 py-8">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
					<p className="text-gray-600">Manage your account information and preferences</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Profile Card */}
					<div className="lg:col-span-1">
						<div className="bg-white rounded-lg shadow-md p-6 text-center">
							{/* Profile Picture */}
						<div className="w-24 h-24 bg-gradient-to-br from-red-400 to-red-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
							<Lock size={40} />

							{/* User Name */}
							<h2 className="text-2xl font-bold text-gray-900 mb-2">{user.username}</h2>

							{/* Status */}
							<div className="flex items-center justify-center gap-2 mb-4">
								<span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
								<span className="text-sm text-gray-600">Active</span>
							</div>

							{/* Join Date */}
							<p className="text-sm text-gray-600 mb-6">
								Joined {new Date(user.loginTime || Date.now()).toLocaleDateString()}
							</p>

							{/* Action Button */}
							<button
								onClick={() => setIsEditing(!isEditing)}
							className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold flex items-center justify-center space-x-2"
						>
							{isEditing ? (
								<>
									<X size={18} />
									<span>Cancel</span>
								</>
							) : (
								<>
									<Edit2 size={18} />
									<span>Edit Profile</span>
								</>
							)}
							</button>
						</div>
					</div>

					{/* Profile Details */}
					<div className="lg:col-span-2 space-y-6">
						{/* Basic Information */}
						<div className="bg-white rounded-lg shadow-md p-6">
							<h3 className="text-xl font-bold text-gray-900 mb-6">Account Information</h3>

							{!isEditing ? (
								<div className="space-y-4">
									<div>
										<label className="text-sm text-gray-600">Username</label>
										<p className="text-lg text-gray-900 font-semibold">{user.username}</p>
									</div>
									<div>
										<label className="text-sm text-gray-600">Email</label>
										<p className="text-lg text-gray-900 font-semibold">{user.email || 'Not provided'}</p>
									</div>
									<div>
										<label className="text-sm text-gray-600">Phone</label>
										<p className="text-lg text-gray-900 font-semibold">{user.phone || 'Not provided'}</p>
									</div>
									<div>
										<label className="text-sm text-gray-600">Bio</label>
										<p className="text-lg text-gray-900 font-semibold">{user.bio || 'No bio added'}</p>
									</div>
								</div>
							) : (
								<div className="space-y-4">
									<div>
										<label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
										<input
											type="email"
											name="email"
											value={formData.email}
											onChange={handleInputChange}
											className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
										/>
									</div>
									<div>
										<label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
										<input
											type="tel"
											name="phone"
											value={formData.phone}
											onChange={handleInputChange}
											className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
										/>
									</div>
									<div>
										<label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
										<textarea
											name="bio"
											value={formData.bio}
											onChange={handleInputChange}
											rows="4"
											className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
										></textarea>
									</div>
									<button
										onClick={handleSaveProfile}
										className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold flex items-center justify-center space-x-2"
									>
										<Save size={18} />
										<span>Save Changes</span>
									</button>
								</div>
							)}
						</div>

						{/* Account Statistics */}
						<div className="bg-white rounded-lg shadow-md p-6">
							<h3 className="text-xl font-bold text-gray-900 mb-6">Account Activity</h3>

							<div className="grid grid-cols-2 gap-4">
								<div className="bg-blue-50 p-4 rounded-lg">
									<p className="text-sm text-gray-600">Last Login</p>
									<p className="text-2xl font-bold text-blue-600">Today</p>
								</div>
								<div className="bg-green-50 p-4 rounded-lg">
									<p className="text-sm text-gray-600">Account Age</p>
									<p className="text-2xl font-bold text-green-600">New</p>
								</div>
								<div className="bg-purple-50 p-4 rounded-lg">
									<p className="text-sm text-gray-600">Total Sessions</p>
									<p className="text-2xl font-bold text-purple-600">1</p>
								</div>
								<div className="bg-orange-50 p-4 rounded-lg">
									<p className="text-sm text-gray-600">Security Status</p>
									<p className="text-2xl font-bold text-orange-600">✓ Secure</p>
								</div>
							</div>
						</div>

						{/* Security Settings */}
						<div className="bg-white rounded-lg shadow-md p-6">
							<div className="flex items-center space-x-2 mb-6">
								<Shield size={24} className="text-red-500" />
								<h3 className="text-xl font-bold text-gray-900">Security & Privacy</h3>
							</div>

							<div className="space-y-4">
								<div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
									<div>
										<p className="font-semibold text-gray-900">Two-Factor Authentication</p>
										<p className="text-sm text-gray-600">Add an extra layer of security</p>
									</div>
									<button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
										Enable
									</button>
								</div>

								<div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
									<div>
										<p className="font-semibold text-gray-900">Change Password</p>
										<p className="text-sm text-gray-600">Update your password regularly</p>
									</div>
									<button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
										Change
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		</>
	);
};

export default Profile;