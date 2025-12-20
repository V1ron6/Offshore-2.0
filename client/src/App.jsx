/**
 * ========================================
 * E-Commerce Shopping Page
 * ========================================
 * 
 * Product shopping page with categories, product listings, and shopping cart
 * Fetches products from the backend API
 * Features:
 * - Browse products by category
 * - Search products
 * - Filter and sort functionality
 * - Add products to cart
 * - View shopping cart
 * - XSS and IDOR protection
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Trash2, Plus, Minus, X } from 'lucide-react';
import Header from './components/header.jsx';
import { sanitizeInput } from './utils/security.js';

/**
 * App Component - E-Commerce Shopping Page
 */
const App = () => {
	// ========================================
	// STATE MANAGEMENT
	// ========================================
	const [user, setUser] = useState(null);
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('all');
	const [sortBy, setSortBy] = useState('featured');
	const [categories, setCategories] = useState([]);
	
	const [cart, setCart] = useState(() => {
		const savedCart = localStorage.getItem('cart');
		return savedCart ? JSON.parse(savedCart) : [];
	});
	const [showCart, setShowCart] = useState(false);

	// ========================================
	// HOOKS
	// ========================================
	const navigate = useNavigate();

	// ========================================
	// API FUNCTIONS
	// ========================================

	/**
	 * Fetch products from backend
	 */
	const fetchProducts = async (category = 'all', search = '', sort = 'featured') => {
		try {
			setLoading(true);
			const params = new URLSearchParams();
			
			if (category !== 'all') params.append('category', category);
			if (search) params.append('search', search);
			params.append('sort', sort);
			
			const response = await fetch(
				`http://localhost:3000/api/products?${params.toString()}`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json'
					}
				}
			);

			if (!response.ok) throw new Error('Failed to fetch products');
			
			const data = await response.json();
			setProducts(data.data || []);
			setError('');
		} catch (err) {
			setError('Failed to load products. Please try again.');
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Fetch categories from backend
	 */
	const fetchCategories = async () => {
		try {
			const response = await fetch('http://localhost:3000/api/products/categories', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) throw new Error('Failed to fetch categories');
			
			const data = await response.json();
			setCategories(data.data || []);
		} catch (err) {
			console.error('Failed to load categories:', err);
		}
	};

	// ========================================
	// CART FUNCTIONS
	// ========================================

	/**
	 * Add product to cart
	 */
	const addToCart = (product) => {
		const existingItem = cart.find(item => item.id === product.id);
		
		if (existingItem) {
			// Increase quantity if already in cart
			const updatedCart = cart.map(item =>
				item.id === product.id
					? { ...item, quantity: item.quantity + 1 }
					: item
			);
			setCart(updatedCart);
			localStorage.setItem('cart', JSON.stringify(updatedCart));
		} else {
			// Add new item to cart
			const newCart = [...cart, { ...product, quantity: 1 }];
			setCart(newCart);
			localStorage.setItem('cart', JSON.stringify(newCart));
		}
		
		setSuccess(`${product.name} added to cart!`);
		setTimeout(() => setSuccess(''), 2000);
	};

	/**
	 * Remove product from cart
	 */
	const removeFromCart = (productId) => {
		const updatedCart = cart.filter(item => item.id !== productId);
		setCart(updatedCart);
		localStorage.setItem('cart', JSON.stringify(updatedCart));
	};

	/**
	 * Update cart item quantity
	 */
	const updateQuantity = (productId, quantity) => {
		if (quantity <= 0) {
			removeFromCart(productId);
			return;
		}
		
		const updatedCart = cart.map(item =>
			item.id === productId
				? { ...item, quantity }
				: item
		);
		setCart(updatedCart);
		localStorage.setItem('cart', JSON.stringify(updatedCart));
	};

	/**
	 * Calculate cart totals
	 */
	const cartTotals = {
		items: cart.reduce((sum, item) => sum + item.quantity, 0),
		subtotal: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
	};

	// ========================================
	// HANDLER FUNCTIONS
	// ========================================

	/**
	 * Handle search input with sanitization
	 */
	const handleSearch = (e) => {
		const sanitized = sanitizeInput(e.target.value);
		setSearchQuery(sanitized);
	};

	/**
	 * Handle category change
	 */
	const handleCategoryChange = (category) => {
		setSelectedCategory(category);
	};

	/**
	 * Handle sort change
	 */
	const handleSortChange = (sort) => {
		setSortBy(sort);
	};

	/**
	 * Clear cart
	 */
	const clearCart = () => {
		setCart([]);
		localStorage.removeItem('cart');
		setSuccess('Cart cleared!');
		setTimeout(() => setSuccess(''), 2000);
	};

	/**
	 * Checkout
	 */
	const handleCheckout = () => {
		if (cart.length === 0) {
			setError('Cart is empty!');
			setTimeout(() => setError(''), 2000);
			return;
		}
		
		setSuccess('Order placed successfully! Total: $' + cartTotals.subtotal.toFixed(2));
		setTimeout(() => {
			setCart([]);
			localStorage.removeItem('cart');
			setShowCart(false);
		}, 2000);
	};

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

	/**
	 * Load products and categories on mount
	 */
	useEffect(() => {
		if (user) {
			fetchCategories();
		}
	}, [user]);

	/**
	 * Debounced fetch when search or filters change
	 */
	useEffect(() => {
		const timer = setTimeout(() => {
			if (user) {
				fetchProducts(selectedCategory, searchQuery, sortBy);
			}
		}, 500);

		return () => clearTimeout(timer);
	}, [searchQuery, selectedCategory, sortBy, user]);

	// ========================================
	// RENDER
	// ========================================

	if (loading && products.length === 0) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<p className="text-2xl font-bold text-gray-700 mb-4">Loading products...</p>
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex flex-col bg-gray-50">
			{/* Header */}
			<Header />

			{/* Main Content */}
			<main className="flex-1 w-full">
				<div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
					{/* Welcome & Cart Button */}
					<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
						<div className="min-w-0">
							<h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 break-words">
								Welcome, <span className="text-red-500">{user?.username}</span>! 👋
							</h1>
							<p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Browse our amazing products</p>
						</div>
						<button
							onClick={() => setShowCart(!showCart)}
							className="relative px-4 sm:px-6 py-2 sm:py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold flex items-center justify-center sm:justify-start gap-2 w-full sm:w-auto"
						>
							<ShoppingCart size={20} />
							<span className="hidden sm:inline">Cart</span>
							{cart.length > 0 && (
								<span className="absolute -top-2 -right-2 bg-yellow-400 text-red-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
									{cartTotals.items}
								</span>
							)}
						</button>
					</div>

					{/* Error & Success Messages */}
					{error && (
						<div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
							⚠️ {error}
						</div>
					)}
					{success && (
						<div className="mb-4 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded">
							✓ {success}
						</div>
					)}

					<div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8">
						{/* Sidebar - Filters */}
						<aside className="md:col-span-1">
							<div className="bg-white rounded-lg shadow-md p-4 md:p-6 space-y-4 md:space-y-6 md:sticky md:top-20">
								{/* Search */}
								<div>
									<h3 className="font-bold text-gray-900 mb-2 md:mb-3 text-sm md:text-base">Search</h3>
									<div className="relative">
										<Search className="absolute left-3 top-2.5 md:top-3 text-gray-400" size={18} />
										<input
											type="text"
											value={searchQuery}
											onChange={handleSearch}
											placeholder="Search..."
											className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
										/>
									</div>
								</div>

								{/* Category Filter */}
								<div>
									<h3 className="font-bold text-gray-900 mb-2 md:mb-3 text-sm md:text-base">Categories</h3>
									<div className="space-y-2 max-h-48 md:max-h-none overflow-y-auto md:overflow-visible">
										<button
											onClick={() => handleCategoryChange('all')}
											className={`w-full text-left px-3 md:px-4 py-2 text-sm md:text-base rounded-lg transition ${
												selectedCategory === 'all'
													? 'bg-red-500 text-white font-semibold'
													: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
											}`}
										>
											All Products
										</button>
										{categories.map((category) => (
											<button
												key={category}
												onClick={() => handleCategoryChange(category)}
												className={`w-full text-left px-3 md:px-4 py-2 text-sm md:text-base rounded-lg transition capitalize ${
													selectedCategory === category
														? 'bg-red-500 text-white font-semibold'
														: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
												}`}
											>
												{category}
											</button>
										))}
									</div>
								</div>

								{/* Sort */}
								<div>
									<h3 className="font-bold text-gray-900 mb-2 md:mb-3 text-sm md:text-base">Sort By</h3>
									<select
										value={sortBy}
										onChange={(e) => handleSortChange(e.target.value)}
										className="w-full px-3 md:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
									>
										<option value="featured">Featured</option>
										<option value="price-low">Price: Low to High</option>
										<option value="price-high">Price: High to Low</option>
										<option value="rating">Highest Rated</option>
										<option value="newest">Newest</option>
									</select>
								</div>
							</div>
						</aside>

						{/* Main Content - Products */}
						<div className="md:col-span-3">
							{/* Shopping Cart Modal */}
							{showCart && (
								<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 sm:p-0">
									<div className="bg-white rounded-lg shadow-xl w-full sm:max-w-2xl max-h-[80vh] sm:max-h-96 overflow-y-auto">
										<div className="flex justify-between items-center p-4 sm:p-6 border-b">
											<h2 className="text-xl sm:text-2xl font-bold text-gray-900">Shopping Cart</h2>
											<button
												onClick={() => setShowCart(false)}
												className="text-gray-500 hover:text-gray-700"
											>
												<X size={24} />
											</button>
										</div>

										<div className="p-4 sm:p-6">
											{cart.length === 0 ? (
												<p className="text-center text-gray-600 py-8">Your cart is empty</p>
											) : (
												<div className="space-y-3 sm:space-y-4">
													{cart.map((item) => (
														<div
															key={item.id}
															className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-3 sm:p-4 border rounded-lg hover:shadow-md transition"
														>
															<div className="flex-1 min-w-0">
																<h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{item.name}</h4>
																<p className="text-red-500 font-bold text-sm sm:text-base">${item.price.toFixed(2)}</p>
															</div>
															
															<div className="flex items-center gap-2 sm:gap-3 justify-between sm:justify-start">
																<button
																	onClick={() => updateQuantity(item.id, item.quantity - 1)}
																	className="p-1 hover:bg-gray-200 rounded"
																>
																	<Minus size={16} />
																</button>
																<span className="w-8 text-center font-semibold text-sm">{item.quantity}</span>
																<button
																	onClick={() => updateQuantity(item.id, item.quantity + 1)}
																	className="p-1 hover:bg-gray-200 rounded"
																>
																	<Plus size={16} />
																</button>

																<button
																	onClick={() => removeFromCart(item.id)}
																	className="ml-2 p-1 text-red-600 hover:bg-red-100 rounded transition"
																>
																	<Trash2 size={16} />
																</button>
															</div>
														</div>
													))}

													<div className="border-t pt-3 sm:pt-4 mt-3 sm:mt-4">
														<div className="flex justify-between mb-3 sm:mb-4">
															<span className="font-semibold text-sm sm:text-base">Subtotal:</span>
															<span className="text-lg sm:text-xl font-bold text-red-500">${cartTotals.subtotal.toFixed(2)}</span>
														</div>
														<div className="flex gap-2 sm:gap-3">
															<button
																onClick={clearCart}
																className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition font-semibold"
															>
																Clear
															</button>
															<button
																onClick={handleCheckout}
																className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold"
															>
																Checkout
															</button>
														</div>
													</div>
												</div>
											)}
										</div>
									</div>
								</div>
							)}

							{/* Products Grid */}
							<div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
								<h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
									Products ({products.length})
								</h2>

								{products.length === 0 ? (
									<div className="text-center py-12">
										<p className="text-gray-600 text-base sm:text-lg">No products found</p>
									</div>
								) : (
									<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
										{products.map((product) => (
											<div
												key={product.id}
												className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition group flex flex-col cursor-pointer"
												onClick={() => navigate(`/product/${product.id}`)}
											>
												{/* Product Image */}
												<div className="bg-gradient-to-br from-gray-100 to-gray-200 p-4 text-4xl sm:text-5xl h-32 sm:h-40 flex items-center justify-center group-hover:scale-110 transition">
													{product.image}
												</div>

												{/* Product Info */}
												<div className="p-3 sm:p-4 space-y-2 sm:space-y-3 flex-grow flex flex-col">
													<div>
														<h3 className="font-bold text-gray-900 line-clamp-2 text-sm sm:text-base">{product.name}</h3>
														<p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1 capitalize">{product.category}</p>
													</div>

													{/* Rating */}
													<div className="flex items-center justify-between text-xs sm:text-sm">
														<div className="flex items-center gap-1">
															<span className="text-yellow-500">★</span>
															<span className="font-semibold">{product.rating}</span>
															<span className="text-gray-500">({product.reviews})</span>
														</div>
														<span className={`px-1.5 sm:px-2 py-0.5 rounded text-xs ${product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
															{product.inStock ? 'In Stock' : 'Out'}
														</span>
													</div>

													{/* Price */}
													<div className="flex items-center gap-2">
														<span className="text-xl sm:text-2xl font-bold text-red-500">${product.price.toFixed(2)}</span>
														{product.originalPrice && (
															<span className="text-xs sm:text-sm text-gray-500 line-through">${product.originalPrice.toFixed(2)}</span>
														)}
													</div>

													{/* Action Button */}
													<button
														onClick={(e) => {
															e.stopPropagation();
															addToCart(product);
														}}
														disabled={!product.inStock}
														className={`w-full py-2 px-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 text-sm sm:text-base mt-auto ${
															product.inStock
																? 'bg-red-500 text-white hover:bg-red-600'
																: 'bg-gray-300 text-gray-500 cursor-not-allowed'
														}`}
													>
														<ShoppingCart size={16} />
														Add
													</button>
												</div>
											</div>
										))}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
			</main>

			<footer className="bg-gray-800 text-white text-center py-6 mt-12">
				<p>&copy; 2025 Offshore. All rights reserved.</p>
				<p className="text-sm text-gray-400 mt-2">Made with ❤️ by the Offshore Team</p>
			</footer>
		</div>
	);
};

export default App;
