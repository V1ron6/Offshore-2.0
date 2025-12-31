/**
 * Orders Page - View order history
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ChevronRight, Calendar, MapPin, DollarSign, Star } from 'lucide-react';
import Card from '../components/Card';
import LoadingScreen  from '../components/LoadingScreen.jsx'
const OrdersPage = () => {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedOrder, setSelectedOrder] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const userData = JSON.parse(localStorage.getItem('user') || '{}');
		if (!userData.id) {
			navigate('/login');
			return;
		}
		// Mock orders data
		const mockOrders = [
			{
				id: 'ORD-20251230-001',
				date: '2025-12-30',
				status: 'delivered',
				total: 299.99,
				items: [
					{ name: 'Wireless Headphones', qty: 1, price: 79.99 },
					{ name: 'Smart Watch', qty: 1, price: 199.99 }
				],
				estimatedDelivery: '2025-12-28',
				trackingNumber: '1Z999AA12345'
			},
			{
				id: 'ORD-20251225-002',
				date: '2025-12-25',
				status: 'delivered',
				total: 49.99,
				items: [
					{ name: 'Laptop Stand', qty: 1, price: 49.99 }
				],
				estimatedDelivery: '2025-12-27',
				trackingNumber: '1Z999AA12346'
			},
			{
				id: 'ORD-20251220-003',
				date: '2025-12-20',
				status: 'processing',
				total: 124.97,
				items: [
					{ name: 'USB-C Cable', qty: 2, price: 12.99 },
					{ name: 'Phone Case', qty: 1, price: 24.99 }
				],
				estimatedDelivery: '2026-01-05',
				trackingNumber: 'TBD'
			},
			{
				id: 'ORD-20251215-004',
				date: '2025-12-15',
				status: 'shipped',
				total: 129.99,
				items: [
					{ name: 'Keyboard', qty: 1, price: 129.99 }
				],
				estimatedDelivery: '2026-01-02',
				trackingNumber: '1Z999AA12347'
			}
		];
		setOrders(mockOrders);
		setLoading(false);
	}, [navigate]);

	const getStatusColor = (status) => {
		switch (status) {
			case 'delivered':
				return 'bg-green-100 text-green-800';
			case 'shipped':
				return 'bg-blue-100 text-blue-800';
			case 'processing':
				return 'bg-yellow-100 text-yellow-800';
			case 'cancelled':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	const getStatusIcon = (status) => {
		switch (status) {
			case 'delivered':
				return '✓';
			case 'shipped':
				return '📦';
			case 'processing':
				return '⧗';
			case 'cancelled':
				return '✕';
			default:
				return '•';
		}
	};

	if (loading) {
		return <LoadingScreen message="Loading Orders" submessage="Fetching your order history..." />;
	}

	return (
		<div className="min-h-screen bg-gray-50 py-8 sm:py-12">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">My Orders</h1>
					<p className="text-gray-600">View and track your orders</p>
				</div>

				{orders.length === 0 ? (
					<Card className="p-12 text-center">
						<Package size={48} className="mx-auto text-gray-300 mb-4" />
						<h2 className="text-2xl font-bold text-gray-900 mb-2">No Orders Yet</h2>
						<p className="text-gray-600">You haven't placed any orders yet.</p>
					</Card>
				) : (
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						{/* Orders List */}
						<div className="lg:col-span-2 space-y-4">
							{orders.map(order => (
								<Card
									key={order.id}
									className="p-4 sm:p-6 hover:shadow-lg transition cursor-pointer"
									onClick={() => setSelectedOrder(order)}
								>
									<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
										<div className="flex-1">
											<h3 className="font-bold text-lg text-gray-900 mb-2">
												{order.id}
											</h3>
											<div className="flex flex-col sm:flex-row sm:gap-6 gap-2 text-sm text-gray-600">
												<span className="flex items-center gap-2">
													<Calendar size={16} />
													{new Date(order.date).toLocaleDateString('en-US', {
														month: 'short',
														day: 'numeric',
														year: 'numeric'
													})}
												</span>
												<span className="flex items-center gap-2">
													<Package size={16} />
													{order.items.length} {order.items.length === 1 ? 'item' : 'items'}
												</span>
											</div>
										</div>
										<div className="text-right">
											<p className="font-bold text-lg text-red-600 mb-2">
												${order.total.toFixed(2)}
											</p>
											<span
												className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
													order.status
												)}`}
											>
												{getStatusIcon(order.status)} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
											</span>
										</div>
									</div>

									{/* Items Preview */}
									<div className="border-t border-gray-200 pt-4">
										<div className="space-y-2">
											{order.items.map((item, idx) => (
												<div key={idx} className="flex justify-between text-sm text-gray-600">
													<span>
														{item.name} x {item.qty}
													</span>
													<span>${(item.price * item.qty).toFixed(2)}</span>
												</div>
											))}
										</div>
									</div>

									{/* Action */}
									<div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
										<a
											href="#"
											className="text-red-600 hover:text-red-700 font-semibold text-sm flex items-center gap-1 transition"
										>
											Track Order
											<ChevronRight size={16} />
										</a>
									</div>
								</Card>
							))}
						</div>

						{/* Sidebar - Order Details */}
						<div className="lg:col-span-1">
							{selectedOrder ? (
								<Card className="p-6 sticky top-20">
									<h3 className="text-lg font-bold mb-6">Order Details</h3>

									{/* Order Status */}
									<div className="mb-6">
										<p className="text-sm text-gray-600 mb-2">Status</p>
										<span
											className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
												selectedOrder.status
											)}`}
										>
											{getStatusIcon(selectedOrder.status)}{' '}
											{selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
										</span>
									</div>

									{/* Order Number */}
									<div className="mb-6 pb-6 border-b border-gray-200">
										<p className="text-sm text-gray-600 mb-2">Order Number</p>
										<p className="font-mono font-bold text-gray-900">{selectedOrder.id}</p>
									</div>

									{/* Order Date */}
									<div className="mb-6 pb-6 border-b border-gray-200">
										<p className="text-sm text-gray-600 mb-2">Order Date</p>
										<p className="font-semibold text-gray-900">
											{new Date(selectedOrder.date).toLocaleDateString('en-US', {
												weekday: 'short',
												month: 'long',
												day: 'numeric',
												year: 'numeric'
											})}
										</p>
									</div>

									{/* Estimated Delivery */}
									<div className="mb-6 pb-6 border-b border-gray-200">
										<p className="text-sm text-gray-600 mb-2">Estimated Delivery</p>
										<p className="font-semibold text-gray-900">
											{new Date(selectedOrder.estimatedDelivery).toLocaleDateString('en-US', {
												month: 'short',
												day: 'numeric',
												year: 'numeric'
											})}
										</p>
									</div>

									{/* Tracking Number */}
									{selectedOrder.trackingNumber !== 'TBD' && (
										<div className="mb-6 pb-6 border-b border-gray-200">
											<p className="text-sm text-gray-600 mb-2">Tracking Number</p>
											<p className="font-mono font-bold text-blue-600">
												{selectedOrder.trackingNumber}
											</p>
										</div>
									)}

									{/* Order Total */}
									<div className="mb-6 pb-6 border-b border-gray-200">
										<p className="text-sm text-gray-600 mb-2">Order Total</p>
										<p className="text-2xl font-bold text-red-600">
											${selectedOrder.total.toFixed(2)}
										</p>
									</div>

									{/* Actions */}
									<div className="space-y-3">
										<button className="w-full py-2 bg-blue-100 text-blue-600 rounded-lg font-semibold hover:bg-blue-200 transition text-sm">
											Track Shipment
										</button>
										<button className="w-full py-2 bg-gray-100 text-gray-900 rounded-lg font-semibold hover:bg-gray-200 transition text-sm">
											Reorder Items
										</button>
										<button className="w-full py-2 border border-gray-300 text-gray-900 rounded-lg font-semibold hover:bg-gray-50 transition text-sm">
											Return Items
										</button>
									</div>

									{/* Leave Review */}
									{selectedOrder.status === 'delivered' && (
										<div className="mt-6 pt-6 border-t border-gray-200">
											<div className="bg-yellow-50 rounded-lg p-3 mb-3">
												<p className="text-sm font-semibold text-yellow-900 mb-2 flex items-center gap-2">
													<Star size={16} />
													Rate This Order
												</p>
											</div>
											<button className="w-full py-2 bg-yellow-100 text-yellow-700 rounded-lg font-semibold hover:bg-yellow-200 transition text-sm">
												Write a Review
											</button>
										</div>
									)}
								</Card>
							) : (
								<Card className="p-6 text-center text-gray-500">
									<p>Select an order to view details</p>
								</Card>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default OrdersPage;
