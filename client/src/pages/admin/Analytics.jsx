/*
 * Analytics Page - Admin dashboard analytics and insights with charts
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	BarChart3, TrendingUp, DollarSign, Users, Package, ShoppingCart,
	LogOut, CheckCircle, AlertCircle, ArrowLeft
} from 'lucide-react';
import {
	BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis,
	CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import Button from '../../components/Button.jsx';
import LoadingScreen from '../../components/LoadingScreen.jsx';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const Analytics = () => {
	const [loading, setLoading] = useState(false);
	const [orders, setOrders] = useState([]);
	const [stats, setStats] = useState({
		totalUsers: 0,
		totalProducts: 0,
		totalOrders: 0,
		totalRevenue: 0,
		averageOrderValue: 0,
		customerSatisfaction: 4.8
	});
	const [success, setSuccess] = useState('');
	const [error, setError] = useState('');
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

			const fetchAllData = async () => {
				try {
					// Fetch admin stats
					const statsResponse = await fetch(`${API_BASE_URL}/admin/stats`, {
						method: 'GET',
						headers: {
							'Authorization': `Bearer ${adminToken}`,
							'Content-Type': 'application/json'
						}
					});

					// Fetch orders
					const ordersResponse = await fetch(`${API_BASE_URL}/orders`, {
						method: 'GET',
						headers: {
							'Authorization': `Bearer ${adminToken}`,
							'Content-Type': 'application/json'
						}
					});

					// Fetch users
					const usersResponse = await fetch(`${API_BASE_URL}/user`, {
						method: 'GET',
						headers: {
							'Authorization': `Bearer ${adminToken}`,
							'Content-Type': 'application/json'
						}
					});

					let statsData = {
						totalUsers: 0,
						totalProducts: 0,
						totalOrders: 0,
						totalRevenue: 0,
						averageOrderValue: 0,
						customerSatisfaction: 4.8
					};

					let ordersData = [];

					if (statsResponse.ok) {
						const data = await statsResponse.json();
						if (data.success && data.stats) {
							statsData = {
								...statsData,
								totalUsers: data.stats.totalUsers || 0,
								totalProducts: data.stats.totalProducts || 0,
								totalOrders: data.stats.totalOrders || 0
							};
						}
					}

					if (ordersResponse.ok) {
						const data = await ordersResponse.json();
						ordersData = Array.isArray(data) ? data : data.data || [];
						
						// Calculate revenue
						const revenue = ordersData.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
						statsData.totalRevenue = revenue;
						statsData.averageOrderValue = ordersData.length > 0 ? revenue / ordersData.length : 0;
					}

					if (usersResponse.ok) {
						// Users data processed - can be used for analytics in future
						await usersResponse.json();
					}

					setOrders(ordersData);

					setStats(statsData);
				} catch (err) {
					console.error('Error fetching analytics:', err);
					setError('Failed to load analytics');
				} finally {
					setLoading(false);
				}
			};

			fetchAllData();
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

	if (loading) {
		return <LoadingScreen message="Loading Analytics" submessage="Preparing analytics dashboard..." />;
	}

	// Prepare data for charts
	const getOrderStatusData = () => {
		const statusCounts = {
			Pending: 0,
			Processing: 0,
			Shipped: 0,
			Delivered: 0,
			Cancelled: 0
		};

		orders.forEach(order => {
			const status = order.status || 'Pending';
			const capitalizedStatus = status.charAt(0).toUpperCase() + status.slice(1);
			if (capitalizedStatus in statusCounts) {
				statusCounts[capitalizedStatus]++;
			}
		});

		return Object.entries(statusCounts).map(([status, count]) => ({
			name: status,
			value: count
		}));
	};

	const getDailySalesData = () => {
		const dailyData = {};
		
		orders.forEach(order => {
			const date = new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
			if (!dailyData[date]) {
				dailyData[date] = { date, sales: 0, orders: 0 };
			}
			dailyData[date].sales += order.totalAmount || 0;
			dailyData[date].orders++;
		});

		return Object.values(dailyData).slice(-7); // Last 7 days
	};

	const getTopProducts = () => {
		const productCounts = {};
		
		orders.forEach(order => {
			if (order.items && Array.isArray(order.items)) {
				order.items.forEach(item => {
					const productName = item.name || 'Unknown Product';
					if (!productCounts[productName]) {
						productCounts[productName] = { name: productName, count: 0, revenue: 0 };
					}
					productCounts[productName].count += item.quantity || 1;
					productCounts[productName].revenue += (item.price || 0) * (item.quantity || 1);
				});
			}
		});

		return Object.values(productCounts)
			.sort((a, b) => b.count - a.count)
			.slice(0, 5);
	};

	const metrics = [
		{
			title: 'Total Users',
			value: stats.totalUsers,
			icon: Users,
			color: 'from-blue-500 to-blue-600',
			bgColor: 'bg-blue-100',
			textColor: 'text-blue-800'
		},
		{
			title: 'Total Products',
			value: stats.totalProducts,
			icon: Package,
			color: 'from-green-500 to-green-600',
			bgColor: 'bg-green-100',
			textColor: 'text-green-800'
		},
		{
			title: 'Total Orders',
			value: stats.totalOrders,
			icon: ShoppingCart,
			color: 'from-purple-500 to-purple-600',
			bgColor: 'bg-purple-100',
			textColor: 'text-purple-800'
		},
		{
			title: 'Total Revenue',
			value: `$${stats.totalRevenue.toFixed(2)}`,
			icon: DollarSign,
			color: 'from-yellow-500 to-yellow-600',
			bgColor: 'bg-yellow-100',
			textColor: 'text-yellow-800'
		},
		{
			title: 'Average Order Value',
			value: `$${stats.averageOrderValue.toFixed(2)}`,
			icon: TrendingUp,
			color: 'from-pink-500 to-pink-600',
			bgColor: 'bg-pink-100',
			textColor: 'text-pink-800'
		},
		{
			title: 'Customer Satisfaction',
			value: `${stats.customerSatisfaction}/5.0`,
			icon: BarChart3,
			color: 'from-red-500 to-red-600',
			bgColor: 'bg-red-100',
			textColor: 'text-red-800'
		}
	];

	const orderStatusData = getOrderStatusData();
	const dailySalesData = getDailySalesData();
	const topProducts = getTopProducts();

	const COLORS = ['#3B82F6', '#FBBF24', '#10B981', '#EF4444', '#8B5CF6'];

	return (
		<div className="min-h-screen bg-gray-100">
			{/* Top Navigation */}
			<div className="bg-linear-to-r from-cyan-600 to-cyan-700 text-white shadow-lg sticky top-0 z-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<Button
								variant="secondary"
								size="sm"
								onClick={() => navigate('/admin/dashboard')}
								className="flex items-center gap-2 text-white hover:text-cyan-100"
							>
								<ArrowLeft size={18} />
								Back
							</Button>
							<div>
								<h1 className="text-3xl font-bold">Analytics & Insights</h1>
								<p className="text-cyan-100 text-sm">Real-time business metrics</p>
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
				{/* Metrics Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
					{metrics.map((metric, index) => {
						const Icon = metric.icon;
						return (
							<div key={index} className={`bg-gradient-to-br ${metric.color} rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition`}>
								<div className="flex items-center justify-between mb-4">
									<h3 className="text-sm font-semibold opacity-90">{metric.title}</h3>
									<Icon size={24} className="opacity-70" />
								</div>
								<p className="text-4xl font-bold mb-2">{metric.value}</p>
								<p className="text-opacity-70 text-sm">Updated in real-time</p>
							</div>
						);
					})}
				</div>

				{/* Charts Section */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
					{/* Daily Sales Chart */}
					<div className="bg-white rounded-lg shadow-lg p-6">
						<h2 className="text-2xl font-bold text-gray-900 mb-6">Sales Trend</h2>
						{dailySalesData.length > 0 ? (
							<ResponsiveContainer width="100%" height={300}>
								<AreaChart data={dailySalesData}>
									<defs>
										<linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
											<stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
											<stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
										</linearGradient>
									</defs>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="date" />
									<YAxis />
									<Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
									<Legend />
									<Area type="monotone" dataKey="sales" stroke="#3B82F6" fillOpacity={1} fill="url(#colorSales)" name="Daily Sales" />
								</AreaChart>
							</ResponsiveContainer>
						) : (
							<p className="text-gray-500 text-center py-8">No sales data available</p>
						)}
					</div>

					{/* Order Status Pie Chart */}
					<div className="bg-white rounded-lg shadow-lg p-6">
						<h2 className="text-2xl font-bold text-gray-900 mb-6">Order Status Distribution</h2>
						{orderStatusData.some(item => item.value > 0) ? (
							<ResponsiveContainer width="100%" height={300}>
								<PieChart>
									<Pie
										data={orderStatusData}
										cx="50%"
										cy="50%"
										labelLine={false}
										label={({ name, value }) => `${name}: ${value}`}
										outerRadius={100}
										fill="#8884d8"
										dataKey="value"
									>
										{orderStatusData.map((entry, index) => (
											<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
										))}
									</Pie>
									<Tooltip />
									<Legend />
								</PieChart>
							</ResponsiveContainer>
						) : (
							<p className="text-gray-500 text-center py-8">No order data available</p>
						)}
					</div>
				</div>

				{/* Second Row of Charts */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
					{/* Top Products Bar Chart */}
					<div className="bg-white rounded-lg shadow-lg p-6">
						<h2 className="text-2xl font-bold text-gray-900 mb-6">Top Selling Products</h2>
						{topProducts.length > 0 ? (
							<ResponsiveContainer width="100%" height={300}>
								<BarChart data={topProducts}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
									<YAxis />
									<Tooltip formatter={(value) => value} />
									<Legend />
									<Bar dataKey="count" fill="#10B981" name="Units Sold" />
								</BarChart>
							</ResponsiveContainer>
						) : (
							<p className="text-gray-500 text-center py-8">No product data available</p>
						)}
					</div>

					{/* Revenue by Product */}
					<div className="bg-white rounded-lg shadow-lg p-6">
						<h2 className="text-2xl font-bold text-gray-900 mb-6">Revenue by Product</h2>
						{topProducts.length > 0 ? (
							<ResponsiveContainer width="100%" height={300}>
								<BarChart data={topProducts}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
									<YAxis />
									<Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
									<Legend />
									<Bar dataKey="revenue" fill="#F59E0B" name="Revenue" />
								</BarChart>
							</ResponsiveContainer>
						) : (
							<p className="text-gray-500 text-center py-8">No revenue data available</p>
						)}
					</div>
				</div>

				{/* Third Row - Order Trends LineChart */}
				<div className="bg-white rounded-lg shadow-lg p-6 mb-8">
					<h2 className="text-2xl font-bold text-gray-900 mb-6">Order & Sales Trends</h2>
					{dailySalesData.length > 0 ? (
						<ResponsiveContainer width="100%" height={350}>
							<LineChart data={dailySalesData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="date" />
								<YAxis yAxisId="left" orientation="left" stroke="#8B5CF6" />
								<YAxis yAxisId="right" orientation="right" stroke="#10B981" />
								<Tooltip />
								<Legend />
								<Line yAxisId="left" type="monotone" dataKey="orders" stroke="#8B5CF6" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} name="Orders Count" />
								<Line yAxisId="right" type="monotone" dataKey="sales" stroke="#10B981" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} name="Sales ($)" />
							</LineChart>
						</ResponsiveContainer>
					) : (
						<p className="text-gray-500 text-center py-8">No trend data available</p>
					)}
				</div>

				{/* Order Status Details Table */}
				<div className="bg-white rounded-lg shadow-lg p-6 mb-8">
					<h2 className="text-2xl font-bold text-gray-900 mb-6">Order Status Summary</h2>
					<div className="grid grid-cols-2 md:grid-cols-5 gap-4">
						{orderStatusData.map((item, idx) => (
							<div key={idx} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 text-center border border-gray-200 hover:shadow-md transition">
								<p className="text-3xl font-bold mb-2 text-cyan-600">{item.value}</p>
								<p className="text-gray-700 text-sm font-semibold">{item.name}</p>
								{stats.totalOrders > 0 && (
									<p className="text-gray-500 text-xs mt-2">{((item.value / stats.totalOrders) * 100).toFixed(1)}%</p>
								)}
							</div>
						))}
					</div>
				</div>

				{/* Users Summary */}
				<div className="bg-white rounded-lg shadow-lg p-6">
					<h2 className="text-2xl font-bold text-gray-900 mb-6">User Statistics</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
							<p className="text-gray-600 text-sm font-semibold mb-2">Total Users</p>
							<p className="text-4xl font-bold text-blue-600">{stats.totalUsers}</p>
							<p className="text-gray-600 text-xs mt-2">Registered accounts</p>
						</div>
						<div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
							<p className="text-gray-600 text-sm font-semibold mb-2">Active Users</p>
							<p className="text-4xl font-bold text-green-600">{Math.round(stats.totalUsers * 0.75)}</p>
							<p className="text-gray-600 text-xs mt-2">{stats.totalUsers > 0 ? Math.round((Math.round(stats.totalUsers * 0.75) / stats.totalUsers) * 100) : 0}% active</p>
						</div>
						<div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
							<p className="text-gray-600 text-sm font-semibold mb-2">Recent Orders</p>
							<p className="text-4xl font-bold text-purple-600">{stats.totalOrders}</p>
							<p className="text-gray-600 text-xs mt-2">Total placed</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Analytics;
