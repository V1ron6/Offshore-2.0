/**
 * Checkout Page - Payment and shipping
 */

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronRight, Truck, MapPin, CreditCard, Lock } from 'lucide-react';
import { getCart, getCartTotal, clearCart } from '../utils/cartService';
import Card from '../components/Card';
import LoadingScreen  from '../components/LoadingScreen.jsx'
import CouponInput from '../components/CouponInput.jsx';

const CheckoutPage = () => {
	const [user, setUser] = useState(null);
	const [cart, setCart] = useState([]);
	const [loading, setLoading] = useState(true);
	const [step, setStep] = useState(1); // 1: Shipping, 2: Payment
	const [appliedCoupon, setAppliedCoupon] = useState(null);
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
		address: '',
		city: '',
		state: '',
		zipCode: '',
		cardName: '',
		cardNumber: '',
		expiryDate: '',
		cvv: ''
	});
	const [errors, setErrors] = useState({});
	const [orderPlaced, setOrderPlaced] = useState(false);

	const navigate = useNavigate();

	useEffect(() => {
		const userData = JSON.parse(localStorage.getItem('user') || '{}');
		if (!userData.id) {
			navigate('/login');
			return;
		}
		setUser(userData);
		const cartData = getCart(userData.id);
		if (cartData.length === 0) {
			navigate('/cart');
			return;
		}
		setCart(cartData);
		setLoading(false);
	}, [navigate]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
		if (errors[name]) {
			setErrors(prev => ({ ...prev, [name]: '' }));
		}
	};

	const validateShipping = () => {
		const newErrors = {};
		if (!formData.firstName.trim()) newErrors.firstName = 'First name required';
		if (!formData.lastName.trim()) newErrors.lastName = 'Last name required';
		if (!formData.email.trim()) newErrors.email = 'Email required';
		if (!formData.phone.trim()) newErrors.phone = 'Phone required';
		if (!formData.address.trim()) newErrors.address = 'Address required';
		if (!formData.city.trim()) newErrors.city = 'City required';
		if (!formData.state.trim()) newErrors.state = 'State required';
		if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code required';

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const validatePayment = () => {
		const newErrors = {};
		if (!formData.cardName.trim()) newErrors.cardName = 'Cardholder name required';
		if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Card number required';
		if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
			newErrors.cardNumber = 'Card number must be 16 digits';
		}
		if (!formData.expiryDate.trim()) newErrors.expiryDate = 'Expiry date required';
		if (!formData.cvv.trim()) newErrors.cvv = 'CVV required';
		if (!/^\d{3,4}$/.test(formData.cvv)) {
			newErrors.cvv = 'CVV must be 3-4 digits';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleNextStep = () => {
		if (validateShipping()) {
			setStep(2);
		}
	};

	const handlePlaceOrder = () => {
		if (validatePayment()) {
			setOrderPlaced(true);
			clearCart(user.id);
			setTimeout(() => {
				navigate('/order-confirmation', {
					state: { orderTotal: getCartTotal(cart) }
				});
			}, 1500);
		}
	};

	if (loading) {
		return <LoadingScreen message="Processing" submessage="Completing your order..." />;
	}

	const cartTotal = getCartTotal(cart);
	const discount = appliedCoupon?.discount || 0;
	const tax = (cartTotal - discount) * 0.1;
	const shipping = 0;
	const totalAmount = cartTotal - discount + tax + shipping;

	return (
		<div className="min-h-screen bg-gray-50 py-8 sm:py-12">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Checkout</h1>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Form Section */}
					<div className="lg:col-span-2">
						{/* Step Indicator */}
						<div className="flex items-center gap-4 mb-8">
							<div
								className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-white ${
									step >= 1 ? 'bg-red-500' : 'bg-gray-300'
								}`}
							>
								1
							</div>
							<div className={`h-1 flex-1 ${step >= 2 ? 'bg-red-500' : 'bg-gray-300'}`}></div>
							<div
								className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-white ${
									step >= 2 ? 'bg-red-500' : 'bg-gray-300'
								}`}
							>
								2
							</div>
						</div>

						{step === 1 ? (
							/* Shipping Form */
							<Card className="p-6 sm:p-8">
								<h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
									<MapPin size={24} className="text-red-500" />
									Shipping Address
								</h2>

								<div className="space-y-6">
									{/* Name Fields */}
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<div>
											<label className="block text-sm font-semibold text-gray-900 mb-2">
												First Name
											</label>
											<input
												type="text"
												name="firstName"
												value={formData.firstName}
												onChange={handleInputChange}
												className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
													errors.firstName ? 'border-red-500' : 'border-gray-300'
												}`}
												placeholder="John"
											/>
											{errors.firstName && (
												<p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
											)}
										</div>
										<div>
											<label className="block text-sm font-semibold text-gray-900 mb-2">
												Last Name
											</label>
											<input
												type="text"
												name="lastName"
												value={formData.lastName}
												onChange={handleInputChange}
												className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
													errors.lastName ? 'border-red-500' : 'border-gray-300'
												}`}
												placeholder="Doe"
											/>
											{errors.lastName && (
												<p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
											)}
										</div>
									</div>

									{/* Email & Phone */}
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<div>
											<label className="block text-sm font-semibold text-gray-900 mb-2">
												Email
											</label>
											<input
												type="email"
												name="email"
												value={formData.email}
												onChange={handleInputChange}
												className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
													errors.email ? 'border-red-500' : 'border-gray-300'
												}`}
												placeholder="john@example.com"
											/>
											{errors.email && (
												<p className="text-red-500 text-sm mt-1">{errors.email}</p>
											)}
										</div>
										<div>
											<label className="block text-sm font-semibold text-gray-900 mb-2">
												Phone
											</label>
											<input
												type="tel"
												name="phone"
												value={formData.phone}
												onChange={handleInputChange}
												className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
													errors.phone ? 'border-red-500' : 'border-gray-300'
												}`}
												placeholder="+1 (555) 000-0000"
											/>
											{errors.phone && (
												<p className="text-red-500 text-sm mt-1">{errors.phone}</p>
											)}
										</div>
									</div>

									{/* Address */}
									<div>
										<label className="block text-sm font-semibold text-gray-900 mb-2">
											Street Address
										</label>
										<input
											type="text"
											name="address"
											value={formData.address}
											onChange={handleInputChange}
											className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
												errors.address ? 'border-red-500' : 'border-gray-300'
											}`}
											placeholder="123 Main St"
										/>
										{errors.address && (
											<p className="text-red-500 text-sm mt-1">{errors.address}</p>
										)}
									</div>

									{/* City, State, ZIP */}
									<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
										<div className="col-span-2">
											<label className="block text-sm font-semibold text-gray-900 mb-2">
												City
											</label>
											<input
												type="text"
												name="city"
												value={formData.city}
												onChange={handleInputChange}
												className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
													errors.city ? 'border-red-500' : 'border-gray-300'
												}`}
												placeholder="New York"
											/>
											{errors.city && (
												<p className="text-red-500 text-sm mt-1">{errors.city}</p>
											)}
										</div>
										<div>
											<label className="block text-sm font-semibold text-gray-900 mb-2">
												State
											</label>
											<input
												type="text"
												name="state"
												value={formData.state}
												onChange={handleInputChange}
												className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
													errors.state ? 'border-red-500' : 'border-gray-300'
												}`}
												placeholder="NY"
											/>
											{errors.state && (
												<p className="text-red-500 text-sm mt-1">{errors.state}</p>
											)}
										</div>
										<div>
											<label className="block text-sm font-semibold text-gray-900 mb-2">
												ZIP Code
											</label>
											<input
												type="text"
												name="zipCode"
												value={formData.zipCode}
												onChange={handleInputChange}
												className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
													errors.zipCode ? 'border-red-500' : 'border-gray-300'
												}`}
												placeholder="10001"
											/>
											{errors.zipCode && (
												<p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>
											)}
										</div>
									</div>

									{/* Next Button */}
									<button
										onClick={handleNextStep}
										className="w-full py-3 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition flex items-center justify-center gap-2"
									>
										Continue to Payment
										<ChevronRight size={20} />
									</button>
								</div>
							</Card>
						) : (
							/* Payment Form */
							<Card className="p-6 sm:p-8">
								<h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
									<CreditCard size={24} className="text-red-500" />
									Payment Information
								</h2>

								<div className="space-y-6">
									{/* Cardholder Name */}
									<div>
										<label className="block text-sm font-semibold text-gray-900 mb-2">
											Cardholder Name
										</label>
										<input
											type="text"
											name="cardName"
											value={formData.cardName}
											onChange={handleInputChange}
											className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
												errors.cardName ? 'border-red-500' : 'border-gray-300'
											}`}
											placeholder="John Doe"
										/>
										{errors.cardName && (
											<p className="text-red-500 text-sm mt-1">{errors.cardName}</p>
										)}
									</div>

									{/* Card Number */}
									<div>
										<label className="block text-sm font-semibold text-gray-900 mb-2">
											Card Number
										</label>
										<input
											type="text"
											name="cardNumber"
											value={formData.cardNumber}
											onChange={handleInputChange}
											placeholder="1234 5678 9012 3456"
											maxLength="19"
											className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
												errors.cardNumber ? 'border-red-500' : 'border-gray-300'
											}`}
										/>
										{errors.cardNumber && (
											<p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
										)}
									</div>

									{/* Expiry & CVV */}
									<div className="grid grid-cols-2 gap-4">
										<div>
											<label className="block text-sm font-semibold text-gray-900 mb-2">
												Expiry Date
											</label>
											<input
												type="text"
												name="expiryDate"
												value={formData.expiryDate}
												onChange={handleInputChange}
												placeholder="MM/YY"
												maxLength="5"
												className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
													errors.expiryDate ? 'border-red-500' : 'border-gray-300'
												}`}
											/>
											{errors.expiryDate && (
												<p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>
											)}
										</div>
										<div>
											<label className="block text-sm font-semibold text-gray-900 mb-2">
												CVV
											</label>
											<input
												type="text"
												name="cvv"
												value={formData.cvv}
												onChange={handleInputChange}
												placeholder="123"
												maxLength="3"
												className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
													errors.cvv ? 'border-red-500' : 'border-gray-300'
												}`}
											/>
											{errors.cvv && (
												<p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
											)}
										</div>
									</div>

									{/* Security Notice */}
									<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
										<Lock size={20} className="text-blue-600 shrink-0 mt-0.5" />
										<p className="text-sm text-blue-700">
											Your payment information is secure and encrypted.
										</p>
									</div>

									{/* Action Buttons */}
									<div className="flex gap-4">
										<button
											onClick={() => setStep(1)}
											className="flex-1 py-3 bg-gray-200 text-gray-900 rounded-lg font-bold hover:bg-gray-300 transition"
										>
											Back
										</button>
										<button
											onClick={handlePlaceOrder}
											disabled={orderPlaced}
											className="flex-1 py-3 bg-linear-to-r from-red-500 to-orange-500 text-white rounded-lg font-bold hover:shadow-lg transition disabled:opacity-50"
										>
											{orderPlaced ? 'Processing...' : 'Place Order'}
										</button>
									</div>
								</div>
							</Card>
						)}
					</div>

					{/* Order Summary Sidebar */}
					<div className="lg:col-span-1">
						<Card className="p-6 sticky top-20">
							<h3 className="text-lg font-bold mb-6">Order Summary</h3>

							{/* Cart Items */}
							<div className="space-y-4 mb-6 pb-6 border-b border-gray-200 max-h-64 overflow-y-auto">
								{cart.map(item => (
									<div key={item.id} className="flex justify-between text-sm">
										<span className="text-gray-600">
											{item.name} x {item.quantity}
										</span>
										<span className="font-semibold">
											${(item.price * item.quantity).toFixed(2)}
										</span>
									</div>
								))}
							</div>

							{/* Total Calculation */}
							<div className="space-y-3">
								<div className="flex justify-between text-gray-600">
									<span>Subtotal</span>
									<span>${cartTotal.toFixed(2)}</span>
								</div>
								{appliedCoupon && (
									<div className="flex justify-between text-green-600">
										<span>Discount ({appliedCoupon.code})</span>
										<span>-${discount.toFixed(2)}</span>
									</div>
								)}
								<div className="flex justify-between text-gray-600">
									<span>Shipping</span>
									<span className="text-green-600 font-semibold">Free</span>
								</div>
								<div className="flex justify-between text-gray-600">
									<span>Tax (10%)</span>
									<span>${tax.toFixed(2)}</span>
								</div>
								<div className="border-t border-gray-300 pt-3 flex justify-between">
									<span className="text-gray-900 font-bold">Total</span>
									<span className="text-red-600 font-bold text-xl">
										${totalAmount.toFixed(2)}
									</span>
								</div>
							</div>

							{/* Coupon Input */}
							<div className="mt-6 pt-6 border-t border-gray-200">
								<CouponInput 
									subtotal={cartTotal}
									appliedCoupon={appliedCoupon}
									onCouponApplied={setAppliedCoupon}
								/>
							</div>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CheckoutPage;
