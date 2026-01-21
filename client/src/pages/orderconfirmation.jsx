/**
 * Order Confirmation Page - Success page after purchase
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Package, Truck, Clock, ArrowRight } from 'lucide-react';
import Card from '../components/Card';
import LoadingScreen  from '../components/LoadingScreen.jsx'
import { Confetti, CheckmarkAnimation } from '../components/SuccessAnimation.jsx';

const OrderConfirmation = () => {
	const [orderNumber] = useState(`ORD-${Date.now().toString().slice(-8).toUpperCase()}`);
	const [showConfetti, setShowConfetti] = useState(true);
	const [estimatedDelivery] = useState(() => {
		const date = new Date();
		date.setDate(date.getDate() + 3);
		return date.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	});

	useEffect(() => {
		// Hide confetti after 4 seconds
		const timer = setTimeout(() => setShowConfetti(false), 4000);
		return () => clearTimeout(timer);
	}, []);

	return (
		<div className="min-h-screen bg-linear-to-b from-green-50 to-white py-12 sm:py-16">
			{/* Confetti Animation */}
			<Confetti show={showConfetti} duration={4000} />

			<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Success Message */}
				<div className="text-center mb-12">
					<div className="flex justify-center mb-6">
						<CheckmarkAnimation show={true} size="lg" />
					</div>
					<h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 animate-fade-in-up">
						Thank You for Your Order!
					</h1>
					<p className="text-lg text-gray-600 mb-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
						Your order has been placed successfully. We've sent a confirmation email to your address.
					</p>

					{/* Order Number */}
					<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 inline-block animate-fade-in-up" style={{ animationDelay: '200ms' }}>
						<p className="text-sm text-gray-600 mb-2">Order Number</p>
						<p className="text-2xl font-bold text-blue-600 font-mono">{orderNumber}</p>
					</div>
				</div>

				{/* Order Status Timeline */}
				<Card className="p-6 sm:p-8 mb-8">
					<h2 className="text-2xl font-bold mb-8">Order Status</h2>

					<div className="space-y-6">
						{/* Step 1: Order Confirmed */}
						<div className="flex gap-4 sm:gap-6">
							<div className="flex flex-col items-center">
								<div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold shrink-0">
									✓
								</div>
								<div className="w-1 h-20 sm:h-24 bg-green-300 mt-2"></div>
							</div>
							<div className="pb-8">
								<h3 className="font-bold text-lg text-gray-900 mb-1">Order Confirmed</h3>
								<p className="text-gray-600 text-sm mb-2">Your order has been confirmed</p>
								<p className="text-xs text-gray-500">Today, 2:30 PM</p>
							</div>
						</div>

						{/* Step 2: Processing */}
						<div className="flex gap-4 sm:gap-6">
							<div className="flex flex-col items-center">
								<div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold shrink-0 animate-pulse">
									⧗
								</div>
								<div className="w-1 h-20 sm:h-24 bg-gray-300 mt-2"></div>
							</div>
							<div className="pb-8">
								<h3 className="font-bold text-lg text-gray-900 mb-1">Processing</h3>
								<p className="text-gray-600 text-sm mb-2">We're preparing your items for shipment</p>
								<p className="text-xs text-gray-500">Est. 1-2 business days</p>
							</div>
						</div>

						{/* Step 3: Shipped */}
						<div className="flex gap-4 sm:gap-6">
							<div className="flex flex-col items-center">
								<div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold shrink-0">
									📦
								</div>
								<div className="w-1 h-20 sm:h-24 bg-gray-300 mt-2"></div>
							</div>
							<div className="pb-8">
								<h3 className="font-bold text-lg text-gray-900 mb-1">Shipped</h3>
								<p className="text-gray-600 text-sm mb-2">Your package is on its way</p>
								<p className="text-xs text-gray-500">Est. {estimatedDelivery}</p>
							</div>
						</div>

						{/* Step 4: Delivered */}
						<div className="flex gap-4 sm:gap-6">
							<div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold shrink-0">
								✓
							</div>
							<div>
								<h3 className="font-bold text-lg text-gray-900 mb-1">Delivered</h3>
								<p className="text-gray-600 text-sm">Estimated delivery date</p>
							</div>
						</div>
					</div>
				</Card>

				{/* Delivery Information */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
					{/* Shipping Address */}
					<Card className="p-6">
						<h3 className="font-bold text-lg mb-4 flex items-center gap-2">
							<Truck size={20} className="text-red-500" />
							Shipping Address
						</h3>
						<div className="space-y-2 text-sm text-gray-600">
							<p className="font-semibold text-gray-900">John Doe</p>
							<p>123 Main Street</p>
							<p>New York, NY 10001</p>
							<p>United States</p>
							<p className="text-xs text-gray-500 mt-4">
								Estimated delivery: {estimatedDelivery}
							</p>
						</div>
					</Card>

					{/* Tracking Information */}
					<Card className="p-6">
						<h3 className="font-bold text-lg mb-4 flex items-center gap-2">
							<Package size={20} className="text-red-500" />
							Track Your Order
						</h3>
						<div className="space-y-4">
							<div>
								<p className="text-sm text-gray-600 mb-2">Tracking Number</p>
								<p className="font-mono font-bold text-lg text-blue-600">1Z999AA12345</p>
							</div>
							<button className="w-full py-2 bg-blue-100 text-blue-600 rounded-lg font-semibold hover:bg-blue-200 transition text-sm">
								Track Shipment
							</button>
						</div>
					</Card>
				</div>

				{/* Next Steps */}
				<Card className="p-6 sm:p-8 bg-linear-to-r from-orange-50 to-red-50 mb-8">
					<h3 className="font-bold text-xl mb-6">What's Next?</h3>
					<div className="space-y-4">
						<div className="flex gap-4">
									<Clock size={24} className="text-red-500 shrink-0 mt-1" />
							<div>
								<h4 className="font-semibold text-gray-900 mb-1">Track Your Shipment</h4>
								<p className="text-sm text-gray-600">
									You'll receive a tracking number via email. Click the link to monitor your package.
								</p>
							</div>
						</div>
						<div className="flex gap-4">
									<Package size={24} className="text-red-500 shrink-0 mt-1" />
							<div>
								<h4 className="font-semibold text-gray-900 mb-1">Inspect Your Items</h4>
								<p className="text-sm text-gray-600">
									When you receive your order, inspect all items. If anything is damaged, contact us immediately.
								</p>
							</div>
						</div>
					</div>
				</Card>

				{/* Action Buttons */}
				<div className="flex flex-col sm:flex-row gap-4">
					<Link
						to="/app"
						className="flex-1 py-3 bg-linear-to-r from-red-500 to-orange-500 text-white rounded-lg font-bold hover:shadow-lg transition text-center flex items-center justify-center gap-2"
					>
						Continue Shopping
						<ArrowRight size={20} />
					</Link>
					<Link
						to="/orders"
						className="flex-1 py-3 bg-gray-200 text-gray-900 rounded-lg font-bold hover:bg-gray-300 transition text-center"
					>
						View All Orders
					</Link>
				</div>

				{/* Contact Support */}
				<div className="mt-12 pt-8 border-t border-gray-200 text-center">
					<p className="text-gray-600 mb-3">Need help with your order?</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<a href="mailto:support@offshore.com" className="text-red-600 hover:text-red-700 font-semibold">
							support@offshore.com
						</a>
						<span className="text-gray-400 hidden sm:block">•</span>
						<a href="tel:+233123456789" className="text-red-600 hover:text-red-700 font-semibold">
							+233123456789
						</a>
					</div>
				</div>
			</div>
		</div>
	);
};

export default OrderConfirmation;
