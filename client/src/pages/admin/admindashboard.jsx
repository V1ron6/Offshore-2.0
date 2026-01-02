import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Users, ShoppingCart, TrendingUp, Package, BarChart3, AlertCircle, CheckCircle, Trash2, Edit2 } from 'lucide-react';
import Button from '../../components/Button.jsx';
import LoadingScreen from '../../components/LoadingScreen.jsx';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const AdminDashboard = () => {
	const [loading, setLoading] = useState(false);
	const [admin, setAdmin] = useState(null);
	const [adminList, setAdminList] = useState([]);
	const [success, setSuccess] = useState('');
	const [error, setError] = useState('');
	const navigate = useNavigate();

	// Dashboard Stats (From Backend)
	const [stats, setStats] = useState({
		totalUsers: 0,
		totalProducts: 0,
		totalOrders: 0,
		totalRevenue: 125450,
		activeAdmins: 2,
		systemHealth: '✓ Optimal'
	});

	// Recent Orders Data (From Backend)
	const [recentOrders, setRecentOrders] = useState([]);

	useEffect(() => {
		// Verify admin is logged in
		const adminToken = localStorage.getItem('adminToken');
		const adminData = localStorage.getItem('adminData');

		if (!adminToken || !adminData) {
			navigate('/admin/login');
			return;
		}

		try {
			setAdmin(JSON.parse(adminData));
			setLoading(true);
			
			// Fetch dashboard stats from backend
			const fetchStats = async () => {
				try {
					const response = await fetch(`${API_BASE_URL}/admin/stats`, {
						method: 'GET',
						headers: {
							'Authorization': `Bearer ${adminToken}`,
							'Content-Type': 'application/json'
						}
					});

					if (response.ok) {
						const data = await response.json();
						console.log('Stats data received:', data);
						if (data.success && data.stats) {
							setStats(prevStats => ({
								...prevStats,
								totalUsers: data.stats.totalUsers || 0,
								totalProducts: data.stats.totalProducts || 0,
								totalOrders: data.stats.totalOrders || 0
							}));
						}
					} else {
						console.error('Failed to fetch stats:', response.status);
					}
				} catch (err) {
					console.error('Error fetching stats:', err);
				}
			};

			// Fetch recent orders from backend
			const fetchRecentOrders = async () => {
				try {
					const response = await fetch(`${API_BASE_URL}/orders/recent?limit=5`, {
						method: 'GET',
						headers: {
							'Authorization': `Bearer ${adminToken}`,
							'Content-Type': 'application/json'
						}
					});

					if (response.ok) {
						const data = await response.json();
						console.log('Recent orders received:', data);
						if (data.success && data.data) {
							setRecentOrders(data.data);
						}
					} else {
						console.error('Failed to fetch recent orders:', response.status);
					}
				} catch (err) {
					console.error('Error fetching recent orders:', err);
				}
			};

			// Simulate loading admin list
			setTimeout(() => {
				setAdminList([
					{ id: 1, username: 'admin1', email: 'admin1@offshore.com', role: 'super_admin', status: 'active' },
					{ id: 2, username: 'admin2', email: 'admin2@offshore.com', role: 'admin', status: 'active' }
				]);
				setLoading(false);
			}, 1000);

			// Fetch stats and orders
			fetchStats();
			fetchRecentOrders();
		} catch (err) {
			navigate('/admin/login');
			console.log(err)
		}
	}, [navigate]);

	const handleLogout = () => {
		setSuccess('Logging out...');
		localStorage.removeItem('adminToken');
		localStorage.removeItem('adminData');
		setTimeout(() => {
			navigate('/admin/login');
		}, 1000);
	};

	const getStatusColor = (status) => {
		switch (status) {
			case 'delivered':
				return 'bg-green-100 text-green-800';
			case 'completed':
				return 'bg-green-100 text-green-800';
			case 'pending':
				return 'bg-yellow-100 text-yellow-800';
			case 'processing':
				return 'bg-blue-100 text-blue-800';
			case 'shipped':
				return 'bg-purple-100 text-purple-800';
			case 'cancelled':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	if (loading) {
		return <LoadingScreen message="Loading Admin Dashboard" submessage="Preparing your control panel..." />;
	}

	return (
		<div className="min-h-screen bg-gray-100">
			{/* Top Navigation Bar */}
			<div className="bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg sticky top-0 z-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-3xl font-bold"> Offshore Admin</h1>
							<p className="text-red-100 text-sm">Welcome back, {admin?.username}! </p>
						</div>
						<div className="flex items-center gap-3">
							<span className="px-4 py-2 bg-red-500 rounded-lg text-sm font-semibold">
								Role: {admin?.role === 'super_admin' ? '👑 Super Admin' : '🔐 Admin'}
							</span>
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
				{/* Dashboard Stats Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
					{/* Total Users */}
					<div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-sm font-semibold opacity-90">Total Users</h3>
							<Users size={24} className="opacity-70" />
						</div>
						<p className="text-4xl font-bold">{stats.totalUsers.toLocaleString()}</p>
						<p className="text-blue-100 text-xs mt-2">Active customers in system</p>
					</div>

					{/* Total Products */}
					<div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-sm font-semibold opacity-90">Total Products</h3>
							<Package size={24} className="opacity-70" />
						</div>
						<p className="text-4xl font-bold">{stats.totalProducts}</p>
						<p className="text-green-100 text-xs mt-2">Products in catalog</p>
					</div>

					{/* Total Orders */}
					<div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-sm font-semibold opacity-90">Total Orders</h3>
							<ShoppingCart size={24} className="opacity-70" />
						</div>
						<p className="text-4xl font-bold">{stats.totalOrders}</p>
						<p className="text-purple-100 text-xs mt-2">All-time orders</p>
					</div>

					{/* Total Revenue */}
					<div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-sm font-semibold opacity-90">Total Revenue</h3>
							<TrendingUp size={24} className="opacity-70" />
						</div>
						<p className="text-4xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
						<p className="text-yellow-100 text-xs mt-2">Generated revenue</p>
					</div>

					{/* Active Admins */}
					<div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-sm font-semibold opacity-90">Active Admins</h3>
							<BarChart3 size={24} className="opacity-70" />
						</div>
						<p className="text-4xl font-bold">{stats.activeAdmins}</p>
						<p className="text-red-100 text-xs mt-2">Admin accounts</p>
					</div>

					{/* System Health */}
					<div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-sm font-semibold opacity-90">System Status</h3>
							<CheckCircle size={24} className="opacity-70" />
						</div>
						<p className="text-2xl font-bold">{stats.systemHealth}</p>
						<p className="text-cyan-100 text-xs mt-2">All systems operational</p>
					</div>
				</div>

				{/* Two Column Layout */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Recent Orders */}
					<div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
						<h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Orders</h2>
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead>
									<tr className="border-b-2 border-gray-200">
										<th className="text-left py-3 px-4 font-semibold text-gray-600">Order ID</th>
										<th className="text-left py-3 px-4 font-semibold text-gray-600">Customer</th>
										<th className="text-left py-3 px-4 font-semibold text-gray-600">Amount</th>
										<th className="text-left py-3 px-4 font-semibold text-gray-600">Status</th>
										<th className="text-left py-3 px-4 font-semibold text-gray-600">Date</th>
									</tr>
								</thead>
								<tbody>
									{recentOrders.map((order, index) => (
										<tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition">
											<td className="py-3 px-4 font-mono text-sm text-gray-900">{order.orderId}</td>
											<td className="py-3 px-4 text-gray-700">{order.customerName}</td>
											<td className="py-3 px-4 font-semibold text-gray-900">${order.totalAmount.toFixed(2)}</td>
											<td className="py-3 px-4">
												<span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
													{order.status.charAt(0).toUpperCase() + order.status.slice(1)}
												</span>
											</td>
											<td className="py-3 px-4 text-gray-600 text-sm">{order.date}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>

					{/* Admin Users */}
					<div className="bg-white rounded-lg shadow-lg p-6">
						<h2 className="text-2xl font-bold text-gray-900 mb-6">Admin Users</h2>
						<div className="space-y-4">
							{adminList.map((admin) => (
								<div key={admin.id} className="border-l-4 border-red-500 pl-4 py-3 hover:bg-gray-50 transition rounded">
									<p className="font-semibold text-gray-900">{admin.username}</p>
									<p className="text-sm text-gray-600">{admin.email}</p>
									<div className="flex items-center justify-between mt-2">
										<span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
											{admin.role === 'super_admin' ? '👑 Super Admin' : '🔐 Admin'}
										</span>
										<span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
											Active
										</span>
									</div>
								</div>
							))}
						</div>
						<Button variant="danger" fullWidth className="mt-6">
							+ Add New Admin
						</Button>
					</div>
				</div>

				{/* Quick Actions */}
				<div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
				<Link to="/admin/manage-users" className="no-underline">
					<Button variant="danger" fullWidth className="py-3 flex items-center justify-center gap-2">
						<Users size={20} /> Manage Users
					</Button>
				</Link>
				<Link to="/admin/manage-products" className="no-underline">
					<Button variant="danger" fullWidth className="py-3 flex items-center justify-center gap-2">
						<Package size={20} /> Manage Products
					</Button>
				</Link>
				<Link to="/admin/view-orders" className="no-underline">
					<Button variant="danger" fullWidth className="py-3 flex items-center justify-center gap-2">
						<ShoppingCart size={20} /> View Orders
					</Button>
				</Link>
				<Link to="/admin/analytics" className="no-underline">
					<Button variant="danger" fullWidth className="py-3 flex items-center justify-center gap-2">
						<BarChart3 size={20} /> Analytics
					</Button>
				</Link>
				</div>
			</div>
		</div>
	);
};

export default AdminDashboard;
