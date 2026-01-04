/**
 * View Orders Page - Admin dashboard for order management
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Eye,ArrowLeft,Trash2, LogOut, CheckCircle, AlertCircle, Filter } from 'lucide-react';
import Button from '../../components/Button.jsx';
import LoadingScreen from '../../components/LoadingScreen.jsx';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const ViewOrders = () => {
	const [loading, setLoading] = useState(false);
	const [orders, setOrders] = useState([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [statusFilter, setStatusFilter] = useState('all');
	const [success, setSuccess] = useState('');
	const [error, setError] = useState('');
	const [selectedOrder, setSelectedOrder] = useState(null);
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

			// Fetch orders from backend
			const fetchOrders = async () => {
				try {
					const response = await fetch(`${API_BASE_URL}/orders?limit=50`, {
						method: 'GET',
						headers: {
							'Authorization': `Bearer ${adminToken}`,
							'Content-Type': 'application/json'
						}
					});

					if (response.ok) {
						const data = await response.json();
						console.log('Orders data received:', data);
						if (data.success && data.data) {
							setOrders(data.data);
						}
					}
				} catch (err) {
					console.error('Error fetching orders:', err);
					setError('Failed to load orders');
				} finally {
					setLoading(false);
				}
			};

			fetchOrders();
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

	const filteredOrders = orders.filter(order => {
		const matchesSearch = order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
							  order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
							  order.email.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
		return matchesSearch && matchesStatus;
	});

	const handleDeleteOrder = async (orderId) => {
		if (confirm('Are you sure you want to delete this order?')) {
			try {
				const adminToken = localStorage.getItem('adminToken');
				const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
					method: 'DELETE',
					headers: {
						'Authorization': `Bearer ${adminToken}`,
						'Content-Type': 'application/json'
					}
				});

				if (response.ok) {
					setOrders(orders.filter(o => o.id !== orderId && o._id !== orderId));
					setSuccess('Order deleted successfully');
				} else {
					setError('Failed to delete order');
				}
			} catch (err) {
				console.error('Error deleting order:', err);
				setError('Failed to delete order');
			}
		}
	};

	const handleUpdateStatus = async (orderId, newStatus) => {
		try {
			const adminToken = localStorage.getItem('adminToken');
			const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
				method: 'PUT',
				headers: {
					'Authorization': `Bearer ${adminToken}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ status: newStatus })
			});

			if (response.ok) {
				setOrders(orders.map(o =>
					(o.id === orderId || o._id === orderId) ? { ...o, status: newStatus } : o
				));
				setSuccess('Order status updated');
				setSelectedOrder(null);
			} else {
				setError('Failed to update order status');
			}
		} catch (err) {
			console.error('Error updating order:', err);
			setError('Failed to update order status');
		}
	};

	const getStatusColor = (status) => {
		switch (status) {
			case 'delivered':
				return 'bg-green-100 text-green-800';
			case 'shipped':
				return 'bg-blue-100 text-blue-800';
			case 'processing':
				return 'bg-yellow-100 text-yellow-800';
			case 'pending':
				return 'bg-gray-100 text-gray-800';
			case 'cancelled':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	if (loading) {
		return <LoadingScreen message="Loading Orders" submessage="Preparing order management..." />;
	}

	return (
		<div className="min-h-screen bg-gray-100">
			{/* Top Navigation */}
			<div className="bg-linear-to-r from-purple-600 to-purple-700 text-white shadow-lg sticky top-0 z-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<Button
								variant="secondary"
								size="sm"
								onClick={() => navigate('/admin/dashboard')}
								className="flex items-center gap-2 text-white hover:text-purple-100"
							>
								<ArrowLeft size={18} />
								Back
							</Button>
							<div>
								<h1 className="text-3xl font-bold">View Orders</h1>
								<p className="text-purple-100 text-sm">Total orders: {orders.length}</p>
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
				{/* Search and Filter */}
				<div className="bg-white rounded-lg shadow-lg p-6 mb-8">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="relative">
							<Search className="absolute left-3 top-3 text-gray-400" size={20} />
							<input
								type="text"
								placeholder="Search orders..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
							/>
						</div>
						<div className="relative flex items-center gap-2">
							<Filter size={20} className="text-gray-400" />
							<select
								value={statusFilter}
								onChange={(e) => setStatusFilter(e.target.value)}
								className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
							>
								<option value="all">All Status</option>
								<option value="pending">Pending</option>
								<option value="processing">Processing</option>
								<option value="shipped">Shipped</option>
								<option value="delivered">Delivered</option>
								<option value="cancelled">Cancelled</option>
							</select>
						</div>
					</div>
				</div>

				{/* Orders Table */}
				<div className="bg-white rounded-lg shadow-lg overflow-hidden">
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="bg-gray-50 border-b-2 border-gray-200">
									<th className="text-left py-4 px-6 font-semibold text-gray-600">Order ID</th>
									<th className="text-left py-4 px-6 font-semibold text-gray-600">Customer</th>
									<th className="text-left py-4 px-6 font-semibold text-gray-600">Email</th>
									<th className="text-left py-4 px-6 font-semibold text-gray-600">Amount</th>
									<th className="text-left py-4 px-6 font-semibold text-gray-600">Status</th>
									<th className="text-left py-4 px-6 font-semibold text-gray-600">Date</th>
									<th className="text-left py-4 px-6 font-semibold text-gray-600">Actions</th>
								</tr>
							</thead>
							<tbody>
								{filteredOrders.map((order) => (
									<tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
										<td className="py-4 px-6 font-mono font-semibold text-gray-900">{order.orderId}</td>
										<td className="py-4 px-6 font-semibold text-gray-900">{order.customerName}</td>
										<td className="py-4 px-6 text-gray-700 text-sm">{order.email}</td>
										<td className="py-4 px-6 font-semibold text-gray-900">${order.totalAmount.toFixed(2)}</td>
										<td className="py-4 px-6">
											<span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
												{order.status.charAt(0).toUpperCase() + order.status.slice(1)}
											</span>
										</td>
										<td className="py-4 px-6 text-gray-600 text-sm">{order.date}</td>
										<td className="py-4 px-6">
											<div className="flex gap-2">
												<button
													onClick={() => setSelectedOrder(order)}
													className="text-blue-600 hover:text-blue-700 p-2 rounded hover:bg-blue-50 transition"
													title="View details"
												>
													<Eye size={18} />
												</button>
												<button
													onClick={() => handleDeleteOrder(order.id)}
													className="text-red-600 hover:text-red-700 p-2 rounded hover:bg-red-50 transition"
													title="Delete order"
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
					{filteredOrders.length === 0 && (
						<div className="text-center py-8 text-gray-500">
							<ShoppingCart size={40} className="mx-auto mb-2 opacity-50" />
							<p>No orders found matching your criteria</p>
						</div>
					)}
				</div>

				{/* Order Details Panel */}
				{selectedOrder && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
						<div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 max-h-96 overflow-y-auto">
							<h3 className="text-2xl font-bold mb-4">Order Details - {selectedOrder.orderId}</h3>
							<div className="grid grid-cols-2 gap-4 mb-6">
								<div>
									<label className="text-sm text-gray-600">Customer</label>
									<p className="font-semibold text-gray-900">{selectedOrder.customerName}</p>
								</div>
								<div>
									<label className="text-sm text-gray-600">Email</label>
									<p className="font-semibold text-gray-900">{selectedOrder.email}</p>
								</div>
								<div>
									<label className="text-sm text-gray-600">Total Amount</label>
									<p className="font-semibold text-gray-900">${selectedOrder.totalAmount.toFixed(2)}</p>
								</div>
								<div>
									<label className="text-sm text-gray-600">Date</label>
									<p className="font-semibold text-gray-900">{selectedOrder.date}</p>
								</div>
								<div>
									<label className="text-sm text-gray-600">Status</label>
									<p className={`font-semibold ${getStatusColor(selectedOrder.status)} inline-block px-3 py-1 rounded`}>
										{selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
									</p>
								</div>
								<div>
									<label className="text-sm text-gray-600">Tracking</label>
									<p className="font-semibold text-gray-900">{selectedOrder.trackingNumber || 'N/A'}</p>
								</div>
							</div>

							<div className="border-t pt-4 mb-6">
								<label className="text-sm text-gray-600">Items</label>
								<div className="space-y-2 mt-2">
									{selectedOrder.items.map((item, idx) => (
										<div key={idx} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
											<span>{item.name} x {item.quantity}</span>
											<span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
										</div>
									))}
								</div>
							</div>

							<div className="flex gap-2">
								<select
									defaultValue={selectedOrder.status}
									onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value)}
									className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
								>
									<option value="pending">Pending</option>
									<option value="processing">Processing</option>
									<option value="shipped">Shipped</option>
									<option value="delivered">Delivered</option>
									<option value="cancelled">Cancelled</option>
								</select>
								<button
									onClick={() => setSelectedOrder(null)}
									className="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg font-semibold hover:bg-gray-400 transition"
								>
									Close
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default ViewOrders;
