/**
 * ========================================
 * E-Commerce Dashboard Component
 * ========================================
 * 
 * Professional e-commerce dashboard with analytics, sales metrics, and product management
 * Combines Amazon-style product browsing with business analytics
 */

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, ShoppingCart, Star, Heart, Filter, Grid, List, TrendingUp, Users, DollarSign, Package, BarChart3 } from 'lucide-react';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import LoadingScreen from '../components/LoadingScreen.jsx';
import { sanitizeInput } from '../utils/security.js';
import { addToCart } from '../utils/cartService.js';

const Dashboard = () => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('all');
	const [viewMode, setViewMode] = useState('grid');
	const [success, setSuccess] = useState('');
	const [error, setError] = useState('');
	const [sortBy, setSortBy] = useState('featured');

	const [products, setProducts] = useState([
		{ id: 1, name: 'Wireless Headphones', price: 79.99, category: 'electronics', stock: 45, image: '🎧', rating: 4.5, reviews: 128 },
		{ id: 2, name: 'Smart Watch', price: 199.99, category: 'electronics', stock: 28, image: '⌚', rating: 4.8, reviews: 256 },
		{ id: 3, name: 'Laptop Stand', price: 49.99, category: 'accessories', stock: 62, image: '🖥️', rating: 4.3, reviews: 89 },
		{ id: 4, name: 'USB-C Cable', price: 12.99, category: 'accessories', stock: 150, image: '🔌', rating: 4.6, reviews: 512 },
		{ id: 5, name: 'Phone Case', price: 24.99, category: 'accessories', stock: 89, image: '📱', rating: 4.2, reviews: 203 },
		{ id: 6, name: 'Portable Charger', price: 34.99, category: 'electronics', stock: 56, image: '🔋', rating: 4.7, reviews: 445 },
		{ id: 7, name: 'Keyboard', price: 129.99, category: 'electronics', stock: 34, image: '⌨️', rating: 4.9, reviews: 267 },
		{ id: 8, name: 'Mouse Pad', price: 19.99, category: 'accessories', stock: 98, image: '🖱️', rating: 4.4, reviews: 178 },
		{ id: 9, name: 'HDMI Cable', price: 9.99, category: 'accessories', stock: 200, image: '📺', rating: 4.5, reviews: 298 },
		{ id: 10, name: 'Laptop Cooling Pad', price: 59.99, category: 'electronics', stock: 34, image: '❄️', rating: 4.6, reviews: 134 },
		{ id: 11, name: 'Screen Protector', price: 14.99, category: 'accessories', stock: 145, image: '🛡️', rating: 4.3, reviews: 401 },
		{ id: 12, name: 'Webcam', price: 89.99, category: 'electronics', stock: 28, image: '📷', rating: 4.7, reviews: 228 }
	]);

	// Dashboard stats
	const [stats] = useState({
		totalSales: 45230,
		totalOrders: 1250,
		activeProducts: 45,
		avgOrderValue: 36.18,
		conversionRate: 3.2,
		revenue: 125450,
		growth: 12.5,
		totalCustomers: 5420,
		pendingOrders: 47,
		monthlyProfit: 28500,
		lastMonthSales: 42150
	});

	const [chartData] = useState([
		{ name: 'Week 1', value: 8400, profit: 2400 },
		{ name: 'Week 2', value: 12800, profit: 3200 },
		{ name: 'Week 3', value: 11200, profit: 2800 },
		{ name: 'Week 4', value: 16400, profit: 4100 }
	]);

	const navigate = useNavigate();

	const categories = [
		{ id: 'all', name: 'All Products', icon: '🏪' },
		{ id: 'electronics', name: 'Electronics', icon: '📱' },
		{ id: 'accessories', name: 'Accessories', icon: '🎧' }
	];

	useEffect(() => {
		const userData = JSON.parse(localStorage.getItem('user') || 'null');
		if (!userData) {
			navigate('/login');
			return;
		}
		setUser(userData);
		setLoading(false);
	}, [navigate]);

	const handleSearch = (e) => {
		const sanitized = sanitizeInput(e.target.value);
		setSearchQuery(sanitized);
	};

	const filteredProducts = products
		.filter(product => {
			const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
			return matchesSearch && matchesCategory;
		})
		.sort((a, b) => {
			if (sortBy === 'price-low') return a.price - b.price;
			if (sortBy === 'price-high') return b.price - a.price;
			if (sortBy === 'rating') return b.rating - a.rating;
			return 0;
		});

	const handleAddToCart = (product) => {
		if (product.stock <= 0) {
			setError('This item is out of stock!');
			setTimeout(() => setError(''), 3000);
			return;
		}

		addToCart(user.id, product, 1);
		setProducts(products.map(p => 
			p.id === product.id ? { ...p, stock: p.stock - 1 } : p
		));

		setSuccess(`${product.name} added to cart!`);
		setTimeout(() => setSuccess(''), 2000);
	};

	if (loading) {
		return <LoadingScreen message="Loading Dashboard" submessage="Preparing your products..." />;
	}

	return (
		<div className="min-h-screen bg-white">
			{/* Top Search Bar */}
			<div className="bg-gradient-to-b from-red-600 to-red-500 text-white shadow-md sticky top-0 z-50">
				<div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between gap-4">
						<h1 className="text-2xl font-bold">🌊 Offshore</h1>
						<div className="flex-1 mx-4">
							<div className="relative">
								<Search className="absolute left-3 top-3 text-gray-400" size={20} />
								<input
									type="text"
									value={searchQuery}
									onChange={handleSearch}
									placeholder="Search products..."
									className="w-full pl-10 pr-4 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
								/>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<Link to="/add-product" className="hidden sm:block">
								<Button variant="danger" size="sm" className="whitespace-nowrap">
									+ Add Product
								</Button>
							</Link>						<Link to="/app" className="hidden sm:block">
							<Button variant="danger" size="sm" className="whitespace-nowrap">
								Go to App
							</Button>
						</Link>							<Link to="/cart">
								<button className="relative p-2 hover:bg-red-700 rounded-lg transition">
									<ShoppingCart size={24} />
									<span className="absolute top-0 right-0 bg-yellow-400 text-red-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">3</span>
								</button>
							</Link>
						</div>
					</div>
				</div>
			</div>

			{/* Alerts */}
			{success && (
				<div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 max-w-7xl mx-auto mt-4">
					✓ {success}
				</div>
			)}
			{error && (
				<div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 max-w-7xl mx-auto mt-4">
					⚠️ {error}
				</div>
			)}

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Welcome Section */}
				<div className="mb-8 flex items-center justify-between">
					<div>
						<h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.username}! 👋</h2>
						<p className="text-gray-600">Browse our latest products and find what you need</p>
					</div>
					<Link to="/add-product" className="sm:hidden">
						<Button variant="danger">+ Add Product</Button>
					</Link>
				</div>

				{/* Dashboard Stats */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
					{/* Total Sales Card */}
					<div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
						<div className="flex items-center justify-between mb-2">
							<h3 className="text-sm font-semibold opacity-90">Total Sales</h3>
							<DollarSign size={20} className="opacity-70" />
						</div>
						<p className="text-3xl font-bold">${stats.totalSales.toLocaleString()}</p>
						<p className="text-xs opacity-80 mt-2">All time sales</p>
					</div>

					{/* Monthly Revenue */}
					<div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg">
						<div className="flex items-center justify-between mb-2">
							<h3 className="text-sm font-semibold opacity-90">Monthly Revenue</h3>
							<TrendingUp size={20} className="opacity-70" />
						</div>
						<p className="text-3xl font-bold">${stats.revenue.toLocaleString()}</p>
						<p className="text-xs opacity-80 mt-2">↑ {stats.growth}% from last month</p>
					</div>

					{/* Monthly Profit */}
					<div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white shadow-lg">
						<div className="flex items-center justify-between mb-2">
							<h3 className="text-sm font-semibold opacity-90">Monthly Profit</h3>
							<BarChart3 size={20} className="opacity-70" />
						</div>
						<p className="text-3xl font-bold">${stats.monthlyProfit.toLocaleString()}</p>
						<p className="text-xs opacity-80 mt-2">This month profit</p>
					</div>

					{/* Total Orders */}
					<div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white shadow-lg">
						<div className="flex items-center justify-between mb-2">
							<h3 className="text-sm font-semibold opacity-90">Total Orders</h3>
							<ShoppingCart size={20} className="opacity-70" />
						</div>
						<p className="text-3xl font-bold">{stats.totalOrders.toLocaleString()}</p>
						<p className="text-xs opacity-80 mt-2">{stats.pendingOrders} pending</p>
					</div>
				</div>

				{/* Additional Metrics Row */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
					<Card className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-gray-600 text-sm">Active Products</p>
								<p className="text-2xl font-bold text-gray-900">{stats.activeProducts}</p>
							</div>
							<Package size={32} className="text-blue-500 opacity-20" />
						</div>
					</Card>

					<Card className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-gray-600 text-sm">Avg Order Value</p>
								<p className="text-2xl font-bold text-gray-900">${stats.avgOrderValue.toFixed(2)}</p>
							</div>
							<DollarSign size={32} className="text-green-500 opacity-20" />
						</div>
					</Card>

					<Card className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-gray-600 text-sm">Total Customers</p>
								<p className="text-2xl font-bold text-gray-900">{stats.totalCustomers.toLocaleString()}</p>
							</div>
							<Users size={32} className="text-purple-500 opacity-20" />
						</div>
					</Card>

					<Card className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-gray-600 text-sm">Conversion Rate</p>
								<p className="text-2xl font-bold text-gray-900">{stats.conversionRate}%</p>
							</div>
							<TrendingUp size={32} className="text-orange-500 opacity-20" />
						</div>
					</Card>
				</div>

				{/* Sales Chart */}
				<Card className="mb-8 p-6">
					<h3 className="text-xl font-bold text-gray-900 mb-4">📊 Weekly Sales & Profit</h3>
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
						{chartData.map((data, idx) => (
							<div key={idx} className="bg-gradient-to-b from-gray-50 to-white p-4 rounded-lg border border-gray-200">
								<p className="text-sm font-bold text-gray-900 mb-3">{data.name}</p>
								<div className="space-y-2">
									<div>
										<div className="flex justify-between text-sm mb-1">
											<span className="text-gray-600">Sales:</span>
											<span className="font-bold text-blue-600">${data.value.toLocaleString()}</span>
										</div>
										<div className="w-full bg-gray-200 rounded-full h-2">
											<div
												className="bg-blue-500 h-2 rounded-full"
												style={{ width: `${(data.value / 16400) * 100}%` }}
											></div>
										</div>
									</div>
									<div>
										<div className="flex justify-between text-sm mb-1">
											<span className="text-gray-600">Profit:</span>
											<span className="font-bold text-green-600">${data.profit.toLocaleString()}</span>
										</div>
										<div className="w-full bg-gray-200 rounded-full h-2">
											<div
												className="bg-green-500 h-2 rounded-full"
												style={{ width: `${(data.profit / 4100) * 100}%` }}
											></div>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</Card>

				<div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
					{/* Sidebar - Categories & Filters */}
					<div className="lg:col-span-1">
						{/* Categories */}
						<div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 sticky top-20">
							<h3 className="font-bold text-lg mb-4 flex items-center gap-2">
								<Filter size={20} />
								Categories
							</h3>
							<div className="space-y-2">
								{categories.map((cat) => (
									<button
										key={cat.id}
										onClick={() => setSelectedCategory(cat.id)}
										className={`w-full text-left px-4 py-2 rounded-lg transition ${
											selectedCategory === cat.id
												? 'bg-red-100 text-red-600 font-bold border-l-4 border-red-600'
												: 'text-gray-700 hover:bg-gray-100'
										}`}
									>
										<span className="mr-2">{cat.icon}</span>
										{cat.name}
									</button>
								))}
							</div>

							{/* Sorting */}
							<hr className="my-6" />
							<h3 className="font-bold text-lg mb-4">Sort By</h3>
							<select
								value={sortBy}
								onChange={(e) => setSortBy(e.target.value)}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
							>
								<option value="featured">Featured</option>
								<option value="price-low">Price: Low to High</option>
								<option value="price-high">Price: High to Low</option>
								<option value="rating">Highest Rated</option>
							</select>
						</div>
					</div>

					{/* Main Content - Products Grid */}
					<div className="lg:col-span-4">
						{/* Header with view toggle */}
						<div className="flex justify-between items-center mb-6">
							<p className="text-gray-600">
								Showing <strong>{filteredProducts.length}</strong> products
							</p>
							<div className="flex gap-2">
								<button
									onClick={() => setViewMode('grid')}
									className={`p-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
								>
									<Grid size={20} />
								</button>
								<button
									onClick={() => setViewMode('list')}
									className={`p-2 rounded-lg transition ${viewMode === 'list' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
								>
									<List size={20} />
								</button>
							</div>
						</div>

						{/* Products Grid */}
						{filteredProducts.length === 0 ? (
							<div className="text-center py-12 bg-gray-50 rounded-lg">
								<p className="text-gray-600 text-lg">No products found</p>
								<p className="text-gray-500">Try adjusting your filters</p>
							</div>
						) : (
							<div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
								{filteredProducts.map((product) => (
									<div key={product.id} className={`bg-white border border-gray-200 rounded-lg hover:shadow-lg transition ${viewMode === 'list' ? 'flex gap-4 p-4' : 'p-4'}`}>
										{/* Product Image */}
										<div className={`flex-shrink-0 ${viewMode === 'list' ? 'w-32 h-32' : 'w-full h-40'} bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden mb-4 sm:mb-0`}>
											<span className={viewMode === 'list' ? 'text-5xl' : 'text-6xl'}>{product.image}</span>
										</div>

										{/* Product Info */}
										<div className={viewMode === 'list' ? 'flex-1' : ''}>
											<h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>

											{/* Rating */}
											<div className="flex items-center gap-2 mb-3">
												<div className="flex text-yellow-400">
													{[...Array(Math.floor(product.rating))].map((_, i) => (
														<Star key={i} size={16} fill="currentColor" />
													))}
												</div>
												<span className="text-sm text-gray-600">({product.reviews})</span>
											</div>

											{/* Price and Stock */}
											<div className="flex justify-between items-center mb-4">
												<div>
													<p className="text-2xl font-bold text-red-600">${product.price.toFixed(2)}</p>
													<p className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
														{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
													</p>
												</div>
												<button className="p-2 hover:bg-gray-100 rounded-lg transition">
													<Heart size={20} className="text-gray-400" />
												</button>
											</div>

											{/* Add to Cart Button */}
											<Button
												variant="danger"
												fullWidth
												size="sm"
												onClick={() => handleAddToCart(product)}
												disabled={product.stock === 0}
											>
												<ShoppingCart size={16} className="inline mr-2" />
												Add to Cart
											</Button>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;