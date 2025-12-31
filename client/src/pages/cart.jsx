/**
 * Cart Page - Full shopping cart view
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Minus, Trash2, ShoppingBag, ChevronRight, AlertCircle } from 'lucide-react';
import { getCart, removeFromCart, updateQuantity, getCartTotal } from '../utils/cartService';
import Button from '../components/Button';
import Card from '../components/Card';
import LoadingScreen  from '../components/LoadingScreen.jsx'

const CartPage = () => {
	const [user, setUser] = useState(null);
	const [cart, setCart] = useState([]);
	const [loading, setLoading] = useState(true);
	const [promoCode, setPromoCode] = useState('');
	const [discount, setDiscount] = useState(0);

	const navigate = useNavigate();

	useEffect(() => {
		const userData = JSON.parse(localStorage.getItem('user') || '{}');
		if (!userData.id) {
			navigate('/login');
			return;
		}
		setUser(userData);
		loadCart(userData.id);
	}, [navigate]);

	const loadCart = (userId) => {
		try {
			const cartData = getCart(userId);
			setCart(cartData);
		} finally {
			setLoading(false);
		}
	};

	const handleRemove = (productId) => {
		removeFromCart(user.id, productId);
		loadCart(user.id);
	};

	const handleUpdateQuantity = (productId, newQuantity) => {
		if (newQuantity > 0) {
			updateQuantity(user.id, productId, newQuantity);
			loadCart(user.id);
		}
	};

	const handleApplyPromo = () => {
		// Simple promo code validation
		if (promoCode.toUpperCase() === 'SAVE10') {
			setDiscount(0.1);
		} else if (promoCode.toUpperCase() === 'SAVE20') {
			setDiscount(0.2);
		} else {
			setDiscount(0);
		}
	};

	const cartTotal = getCartTotal(cart);
	const discountAmount = cartTotal * discount;
	const finalTotal = cartTotal - discountAmount;
	const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

	if (loading) {
		return <LoadingScreen message="Loading Cart" submessage="Fetching your items..." />;
	}

	return (
		<div className="min-h-screen bg-gray-50 py-8 sm:py-12">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="mb-8 sm:mb-12">
					<h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
					<p className="text-gray-600">{cartCount} items in your cart</p>
				</div>

				{cart.length === 0 ? (
					<div className="text-center py-12 sm:py-16">
						<ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
						<h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
						<p className="text-gray-600 mb-6">Add items to get started with your shopping</p>
						<Link
							to="/dashboard"
							className="inline-block px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition"
						>
							Continue Shopping
						</Link>
					</div>
				) : (
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						{/* Cart Items */}
						<div className="lg:col-span-2">
							<Card className="p-4 sm:p-6">
								<div className="space-y-4 sm:space-y-6 divide-y divide-gray-200">
									{cart.map(item => (
										<div key={item.id} className="pt-4 sm:pt-6 first:pt-0 flex gap-4 sm:gap-6">
											{/* Product Image */}
											{item.image && (
												<div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 bg-gray-200 rounded-lg overflow-hidden">
													<img
														src={item.image}
														alt={item.name}
														className="w-full h-full object-cover"
													/>
												</div>
											)}

											{/* Product Details */}
											<div className="flex-1">
												<h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
													{item.name}
												</h3>
												<p className="text-red-600 font-bold text-lg mb-4">
													${(typeof item.price === 'string' ? parseFloat(item.price.replace('$', '')) : item.price).toFixed(2)}
												</p>
												<div className="flex items-center gap-4 mb-4">
													<div className="flex items-center gap-2 bg-gray-100 rounded-lg p-2">
														<button
															onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
															className="p-1 hover:bg-gray-200 rounded transition text-gray-600"
														>
															<Minus size={18} />
														</button>
														<span className="w-8 text-center font-bold">
															{item.quantity}
														</span>
														<button
															onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
															className="p-1 hover:bg-gray-200 rounded transition text-gray-600"
														>
															<Plus size={18} />
														</button>
													</div>
													<button
														onClick={() => handleRemove(item.id)}
														className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition"
													>
														<Trash2 size={20} />
													</button>
												</div>

												<div className="text-right font-bold text-gray-900">
													Subtotal: ${((typeof item.price === 'string' ? parseFloat(item.price.replace('$', '')) : item.price) * item.quantity).toFixed(2)}
												</div>
											</div>
										</div>
									))}
								</div>
							</Card>
						</div>

						{/* Order Summary */}
						<div className="lg:col-span-1">
							{/* Promo Code */}
							<Card className="p-4 sm:p-6 mb-6">
								<h3 className="font-bold text-lg mb-4">Apply Promo Code</h3>
								<div className="flex gap-2">
									<input
										type="text"
										placeholder="Enter code"
										value={promoCode}
										onChange={(e) => setPromoCode(e.target.value)}
										className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
									/>
									<button
										onClick={handleApplyPromo}
										className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg font-semibold hover:bg-gray-300 transition text-sm"
									>
										Apply
									</button>
								</div>
								<p className="text-xs text-gray-500 mt-2">Try: SAVE10 or SAVE20</p>
							</Card>

							{/* Order Summary Box */}
							<Card className="p-4 sm:p-6 bg-linear-to-br from-gray-50 to-gray-100 sticky top-20 shrink-0">
								<h3 className="font-bold text-lg mb-6">Order Summary</h3>

								<div className="space-y-4 mb-6 pb-6 border-b border-gray-300">
									<div className="flex justify-between">
										<span className="text-gray-600">Subtotal</span>
										<span className="font-semibold">${cartTotal.toFixed(2)}</span>
									</div>

									<div className="flex justify-between">
										<span className="text-gray-600">Shipping</span>
										<span className="font-semibold text-green-600">Free</span>
									</div>

									<div className="flex justify-between">
										<span className="text-gray-600">Tax (10%)</span>
										<span className="font-semibold">
											${(cartTotal * 0.1).toFixed(2)}
										</span>
									</div>

									{discount > 0 && (
										<div className="flex justify-between text-green-600">
											<span>Discount ({Math.round(discount * 100)}%)</span>
											<span className="font-semibold">
												-${discountAmount.toFixed(2)}
											</span>
										</div>
									)}
								</div>

								<div className="mb-6">
									<div className="flex justify-between mb-4">
										<span className="text-gray-900 font-bold text-lg">Total</span>
										<span className="text-red-600 font-bold text-2xl">
											${(finalTotal + finalTotal * 0.1).toFixed(2)}
										</span>
									</div>
									<button
										onClick={() => navigate('/checkout')}
										className="w-full py-3 bg-linear-to-r from-red-500 to-orange-500 text-white rounded-lg font-bold hover:shadow-lg transition text-base sm:text-lg"
									>
										Proceed to Checkout
									</button>
								</div>

								<Link
									to="/dashboard"
									className="block text-center text-red-600 hover:text-red-700 font-semibold transition"
								>
									Continue Shopping
								</Link>
							</Card>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default CartPage;
