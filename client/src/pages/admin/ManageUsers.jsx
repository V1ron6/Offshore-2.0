/**
 * Manage Users Page - Admin dashboard for user management
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Search, Edit2, Trash2, Plus, LogOut, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import Button from '../../components/Button.jsx';
import LoadingScreen from '../../components/LoadingScreen.jsx';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const ManageUsers = () => {
	const [loading, setLoading] = useState(false);
	const [users, setUsers] = useState([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [success, setSuccess] = useState('');
	const [error, setError] = useState('');
	const [selectedUser, setSelectedUser] = useState(null);
	const [showAddModal, setShowAddModal] = useState(false);
	const [newUser, setNewUser] = useState({ username: '', email: '', password: '', status: 'active' });
	const navigate = useNavigate();

	useEffect(() => {
		const adminToken = localStorage.getItem('adminToken');
		const adminData = localStorage.getItem('adminData');

		if (!adminToken || !adminData) {
			navigate('/admin/login');
			return;
		}

		try {
			setLoading(true);

			// Fetch users from backend
			const fetchUsers = async () => {
				try {
					const response = await fetch(`${API_BASE_URL}/user`, {
						method: 'GET',
						headers: {
							'Authorization': `Bearer ${adminToken}`,
							'Content-Type': 'application/json'
						}
					});

					if (response.ok) {
						const data = await response.json();
						console.log('Users data received:', data);
						
						// Use backend data if available
						if (Array.isArray(data)) {
							setUsers(data);
						} else if (data.data && Array.isArray(data.data)) {
							setUsers(data.data);
						} else {
							setUsers([]);
						}
					}
				} catch (err) {
					console.error('Error fetching users:', err);
					setError('Failed to load users');
				} finally {
					setLoading(false);
				}
			};

			fetchUsers();
		} catch {
			navigate('/admin/login');
		}
	}, [navigate]);

	const handleLogout = () => {
		setSuccess('Logging out...');
		setTimeout(() => {
			localStorage.removeItem('adminToken');
			localStorage.removeItem('adminData');
			navigate('/admin/login');
		}, 1000);
	};

	const filteredUsers = users.filter(user =>
		user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
		user.email.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleDeleteUser = async (userId) => {
		if (confirm('Are you sure you want to delete this user?')) {
			try {
				const adminToken = localStorage.getItem('adminToken');
				const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
					method: 'DELETE',
					headers: {
						'Authorization': `Bearer ${adminToken}`,
						'Content-Type': 'application/json'
					}
				});

				if (response.ok) {
					setUsers(users.filter(u => u.id !== userId && u._id !== userId));
					setSuccess('User deleted successfully');
				} else {
					setError('Failed to delete user');
				}
			} catch (err) {
				console.error('Error deleting user:', err);
				setError('Failed to delete user');
			}
		}
	};

	const handleStatusChange = async (userId) => {
		const user = users.find(u => u.id === userId || u._id === userId);
		const newStatus = user?.status === 'active' ? 'inactive' : 'active';
		
		try {
			const adminToken = localStorage.getItem('adminToken');
			const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
				method: 'PUT',
				headers: {
					'Authorization': `Bearer ${adminToken}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ status: newStatus })
			});

			if (response.ok) {
				setUsers(users.map(u =>
					(u.id === userId || u._id === userId) ? { ...u, status: newStatus } : u
				));
				setSuccess('User status updated');
				setSelectedUser(null);
			} else {
				setError('Failed to update user status');
			}
		} catch (err) {
			console.error('Error updating user:', err);
			setError('Failed to update user status');
		}
	};

	const handleAddUser = async (e) => {
		e.preventDefault();
		if (!newUser.username || !newUser.email || !newUser.password) {
			setError('Please fill in all fields');
			return;
		}
		
		try {
			const adminToken = localStorage.getItem('adminToken');
			const response = await fetch(`${API_BASE_URL}/user/register`, {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${adminToken}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(newUser)
			});

			if (response.ok) {
				const data = await response.json();
				const addedUser = data.user || data.data || { ...newUser, id: Date.now(), joinDate: new Date().toISOString().split('T')[0] };
				setUsers([...users, addedUser]);
				setSuccess('User added successfully');
				setShowAddModal(false);
				setNewUser({ username: '', email: '', password: '', status: 'active' });
			} else {
				const data = await response.json();
				setError(data.message || 'Failed to add user');
			}
		} catch (err) {
			console.error('Error adding user:', err);
			setError('Failed to add user');
		}
	};

	if (loading) {
		return <LoadingScreen message="Loading Users" submessage="Preparing user management..." />;
	}

	return (
		<div className="min-h-screen bg-gray-100">
			{/* Top Navigation */}
			<div className="bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg sticky top-0 z-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<Button
								variant="secondary"
								size="sm"
								onClick={() => navigate('/admin/dashboard')}
								className="flex items-center gap-2 text-white hover:text-red-100"
							>
								<ArrowLeft size={18} />
								Back
							</Button>
							<div>
								<h1 className="text-3xl font-bold">Manage Users</h1>
								<p className="text-red-100 text-sm">Total users: {users.length}</p>
							</div>
						</div>
						<Button 
							variant="danger" 
							size="sm"
							onClick={handleLogout}
							className="flex items-center gap-2"
						>
							<LogOut size={18} />
							Logout
						</Button>
					</div>
				</div>
			</div>

			{/* Alerts */}
			{success && (
				<div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 m-4 flex items-center gap-2">
					<CheckCircle size={20} />
					{success}
				</div>
			)}
			{error && (
				<div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 m-4 flex items-center gap-2">
					<AlertCircle size={20} />
					{error}
				</div>
			)}

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Search and Actions */}
				<div className="bg-white rounded-lg shadow-lg p-6 mb-8">
					<div className="flex flex-col sm:flex-row gap-4">
						<div className="flex-1 relative">
							<Search className="absolute left-3 top-3 text-gray-400" size={20} />
							<input
								type="text"
								placeholder="Search users by name or email..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
							/>
						</div>
						<Button variant="danger" className="flex items-center gap-2" onClick={() => setShowAddModal(true)}>
							<Plus size={18} />
							Add New User
						</Button>
					</div>
				</div>

				{/* Users Table */}
				<div className="bg-white rounded-lg shadow-lg overflow-hidden">
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="bg-gray-50 border-b-2 border-gray-200">
									<th className="text-left py-4 px-6 font-semibold text-gray-600">Username</th>
									<th className="text-left py-4 px-6 font-semibold text-gray-600">Email</th>
									<th className="text-left py-4 px-6 font-semibold text-gray-600">Status</th>
									<th className="text-left py-4 px-6 font-semibold text-gray-600">Join Date</th>
									<th className="text-left py-4 px-6 font-semibold text-gray-600">Actions</th>
								</tr>
							</thead>
							<tbody>
								{filteredUsers.map((user) => (
									<tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
										<td className="py-4 px-6 font-semibold text-gray-900">{user.username}</td>
										<td className="py-4 px-6 text-gray-700">{user.email}</td>
										<td className="py-4 px-6">
											<span className={`px-3 py-1 rounded-full text-xs font-semibold ${
												user.status === 'active'
													? 'bg-green-100 text-green-800'
													: 'bg-red-100 text-red-800'
											}`}>
												{user.status.charAt(0).toUpperCase() + user.status.slice(1)}
											</span>
										</td>
										<td className="py-4 px-6 text-gray-600 text-sm">{user.joinDate}</td>
										<td className="py-4 px-6">
											<div className="flex gap-2">
												<button
													onClick={() => setSelectedUser(user)}
													className="text-blue-600 hover:text-blue-700 p-2 rounded hover:bg-blue-50 transition"
													title="Edit user"
												>
													<Edit2 size={18} />
												</button>
												<button
													onClick={() => handleDeleteUser(user.id)}
													className="text-red-600 hover:text-red-700 p-2 rounded hover:bg-red-50 transition"
													title="Delete user"
												>
													<Trash2 size={18} />
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					{filteredUsers.length === 0 && (
						<div className="text-center py-8 text-gray-500">
							<Users size={40} className="mx-auto mb-2 opacity-50" />
							<p>No users found matching your search</p>
						</div>
					)}
				</div>

				{/* User Details Panel */}
				{selectedUser && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
						<div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
							<h3 className="text-2xl font-bold mb-4">User Details</h3>
							<div className="space-y-4">
								<div>
									<label className="text-sm text-gray-600">Username</label>
									<p className="font-semibold text-gray-900">{selectedUser.username}</p>
								</div>
								<div>
									<label className="text-sm text-gray-600">Email</label>
									<p className="font-semibold text-gray-900">{selectedUser.email}</p>
								</div>
								<div>
									<label className="text-sm text-gray-600">Status</label>
									<p className="font-semibold text-gray-900">{selectedUser.status}</p>
								</div>
								<div>
									<label className="text-sm text-gray-600">Join Date</label>
									<p className="font-semibold text-gray-900">{selectedUser.joinDate}</p>
								</div>
								<div className="flex gap-2 pt-4">
									<button
										onClick={() => handleStatusChange(selectedUser.id)}
										className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
									>
										Toggle Status
									</button>
									<button
										onClick={() => setSelectedUser(null)}
										className="flex-1 px-4 py-2 bg-gray-300 text-gray-900 rounded-lg font-semibold hover:bg-gray-400 transition"
									>
										Close
									</button>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Add User Modal */}
				{showAddModal && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
						<div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
							<h3 className="text-2xl font-bold mb-4">Add New User</h3>
							<form onSubmit={handleAddUser} className="space-y-4">
								<div>
									<label className="block text-sm text-gray-600 mb-1">Username</label>
									<input
										type="text"
										value={newUser.username}
										onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
										placeholder="Enter username"
									/>
								</div>
								<div>
									<label className="block text-sm text-gray-600 mb-1">Email</label>
									<input
										type="email"
										value={newUser.email}
										onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
										placeholder="Enter email"
									/>
								</div>
								<div>
									<label className="block text-sm text-gray-600 mb-1">Password</label>
									<input
										type="password"
										value={newUser.password}
										onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
										placeholder="Enter password"
									/>
								</div>
								<div>
									<label className="block text-sm text-gray-600 mb-1">Status</label>
									<select
										value={newUser.status}
										onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
									>
										<option value="active">Active</option>
										<option value="inactive">Inactive</option>
									</select>
								</div>
								<div className="flex gap-2 pt-4">
									<button
										type="submit"
										className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
									>
										Add User
									</button>
									<button
										type="button"
										onClick={() => { setShowAddModal(false); setNewUser({ username: '', email: '', password: '', status: 'active' }); }}
										className="flex-1 px-4 py-2 bg-gray-300 text-gray-900 rounded-lg font-semibold hover:bg-gray-400 transition"
									>
										Cancel
									</button>
								</div>
							</form>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default ManageUsers;
