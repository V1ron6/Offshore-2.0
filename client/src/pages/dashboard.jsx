/**
 * ========================================
 * E-Commerce Dashboard Component
 * ========================================
 * 
 * Professional e-commerce dashboard with analytics, sales metrics, and product management
 * Combines Amazon-style product browsing with business analytics
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, ShoppingCart, Star, Heart, Filter, Grid, List, TrendingUp, Users, DollarSign, Package, BarChart3 } from 'lucide-react';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import LoadingScreen from '../components/LoadingScreen.jsx';
import { DashboardSkeleton, ProductGridSkeleton } from '../components/Skeleton.jsx';
import { sanitizeInput } from '../utils/security.js';
import { addToCart } from '../utils/cartService.js';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const Dashboard = () => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [productsLoading, setProductsLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('all');
	const [viewMode, setViewMode] = useState('grid');
	const [success, setSuccess] = useState('');
	const [error, setError] = useState('');
	const [sortBy, setSortBy] = useState('featured');

	const [products, setProducts] = useState([]);
	const [categories, setCategories] = useState([
		{ id: 'all', name: 'All Products', icon: '🏪' }
	]);

	// Dashboard stats - loaded from backend
	const [stats, setStats] = useState({
		totalSales: 0,
		totalOrders: 0,
		activeProducts: 0,
		avgOrderValue: 0,
		totalCustomers: 0,
		pendingOrders: 0,
		revenue: 0,
		growth: 0,
		monthlyProfit: 0,
		conversionRate: 0
	});

	// Chart data - loaded from backend
	const [chartData, setChartData] = useState([]);

	const navigate = useNavigate();

	// Fetch products from backend
	const fetchProducts = useCallback(async () => {
		try {
			setProductsLoading(true);
			const params = new URLSearchParams();
			if (selectedCategory !== 'all') params.append('category', selectedCategory);
			if (searchQuery) params.append('search', searchQuery);
			params.append('sort', sortBy);
			params.append('limit', '200'); // Fetch all 177 products

			const response = await fetch(`${API_URL}/products?${params.toString()}`);
			const data = await response.json();

			if (data.success) {
				setProducts(data.data || []);
			}
		} catch (err) {
			console.error('Error fetching products:', err);
			setError('Failed to load products');
		} finally {
			setProductsLoading(false);
		}
	}, [selectedCategory, searchQuery, sortBy]);

	// Fetch categories from backend
	const fetchCategories = useCallback(async () => {
		try {
			const response = await fetch(`${API_URL}/products/categories`);
			const data = await response.json();

			if (data.success && data.data) {
				const categoryList = [
					{ id: 'all', name: 'All Products', icon: '🏪' },
					...data.data.map(cat => ({
						id: cat,
						name: cat.charAt(0).toUpperCase() + cat.slice(1),
						icon: getCategoryIcon(cat)
					}))
				];
				setCategories(categoryList);
			}
		} catch (err) {
			console.error('Error fetching categories:', err);
		}
	}, []);

	// Generate random stats if not available (fallback)
	const generateFallbackStats = () => {
		const totalSales = Math.floor(Math.random() * 100000) + 5000;
		const totalOrders = Math.floor(Math.random() * 500) + 50;
		return {
			totalSales,
			totalOrders,
			avgOrderValue: parseFloat((totalSales / totalOrders).toFixed(2)),
			monthlyProfit: Math.floor(totalSales * (0.15 + Math.random() * 0.20)),
			revenue: Math.floor(totalSales * (1 + Math.random() * 0.3)),
			growth: parseFloat((Math.random() * 25 - 5).toFixed(1)),
			conversionRate: parseFloat((Math.random() * 5 + 1).toFixed(1)),
			pendingOrders: Math.floor(Math.random() * 30) + 5,
			activeProducts: Math.floor(Math.random() * 100) + 20,
			totalCustomers: Math.floor(Math.random() * 3000) + 500,
			weeklyData: [
				{ name: 'Week 1', value: Math.floor(Math.random() * 15000) + 5000, profit: Math.floor(Math.random() * 4000) + 1000 },
				{ name: 'Week 2', value: Math.floor(Math.random() * 15000) + 5000, profit: Math.floor(Math.random() * 4000) + 1000 },
				{ name: 'Week 3', value: Math.floor(Math.random() * 15000) + 5000, profit: Math.floor(Math.random() * 4000) + 1000 },
				{ name: 'Week 4', value: Math.floor(Math.random() * 15000) + 5000, profit: Math.floor(Math.random() * 4000) + 1000 }
			]
		};
	};

	// Fetch dashboard stats from backend (user stats)
	const fetchStats = useCallback(async () => {
		try {
			const token = localStorage.getItem('authToken');
			const userData = JSON.parse(localStorage.getItem('user') || '{}');
			
			// First try to get stats from stored user data
			if (userData.stats) {
				setStats({
					totalSales: userData.stats.totalSales || 0,
					totalOrders: userData.stats.totalOrders || 0,
					activeProducts: userData.stats.activeProducts || 0,
					avgOrderValue: userData.stats.avgOrderValue || 0,
					totalCustomers: userData.stats.totalCustomers || 0,
					pendingOrders: userData.stats.pendingOrders || 0,
					revenue: userData.stats.revenue || 0,
					growth: userData.stats.growth || 0,
					monthlyProfit: userData.stats.monthlyProfit || 0,
					conversionRate: userData.stats.conversionRate || 0
				});
				if (userData.stats.weeklyData) {
					setChartData(userData.stats.weeklyData);
				}
				return;
			}

			// Try to fetch from API
			try {
				const response = await fetch(`${API_URL}/user/stats`, {
					headers: {
						'Authorization': `Bearer ${token}`
					}
				});
				const data = await response.json();

				if (data.success && data.stats) {
					setStats({
						totalSales: data.stats.totalSales || 0,
						totalOrders: data.stats.totalOrders || 0,
						activeProducts: data.stats.activeProducts || 0,
						avgOrderValue: data.stats.avgOrderValue || 0,
						totalCustomers: data.stats.totalCustomers || 0,
						pendingOrders: data.stats.pendingOrders || 0,
						revenue: data.stats.revenue || 0,
						growth: data.stats.growth || 0,
						monthlyProfit: data.stats.monthlyProfit || 0,
						conversionRate: data.stats.conversionRate || 0
					});

					if (data.stats.weeklyData) {
						setChartData(data.stats.weeklyData);
					}
					
					// Save to localStorage for future use
					userData.stats = data.stats;
					localStorage.setItem('user', JSON.stringify(userData));
					return;
				}
			} catch (apiErr) {
				console.warn('API stats fetch failed, using fallback');
			}

			// Fallback: generate random stats if no stats available
			const fallbackStats = generateFallbackStats();
			setStats(fallbackStats);
			setChartData(fallbackStats.weeklyData);
			
			// Save fallback stats to localStorage
			userData.stats = fallbackStats;
			localStorage.setItem('user', JSON.stringify(userData));
			
		} catch (err) {
			console.error('Error fetching stats:', err);
			// Use fallback stats on error
			const fallbackStats = generateFallbackStats();
			setStats(fallbackStats);
			setChartData(fallbackStats.weeklyData);
		}
	}, []);

	// Helper to get category icon
	const getCategoryIcon = (category) => {
		const icons = {
			electronics: '📱',
			accessories: '🎧',
			clothing: '👕',
			home: '🏡',
			sports: '⚽',
			other: '📦'
		};
		return icons[category?.toLowerCase()] || '📦';
	};

	useEffect(() => {
		const userData = JSON.parse(localStorage.getItem('user') || 'null');
		if (!userData) {
			navigate('/login');
			return;
		}
		setUser(userData);
		setLoading(false);
		fetchCategories();
		fetchStats();
	}, [navigate, fetchCategories, fetchStats]);

	// Fetch products when filters change
	useEffect(() => {
		if (user) {
			const timer = setTimeout(() => {
				fetchProducts();
			}, 300);
			return () => clearTimeout(timer);
		}
	}, [user, fetchProducts]);

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
		return <DashboardSkeleton />;
	}

	return (
		<div className="min-h-screen bg-white">
			{/* Top Search Bar */}
			<div className="bg-linear-to-b from-red-600 to-red-500 text-white shadow-md sticky top-0 z-50">
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
					<div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
						<div className="flex items-center justify-between mb-2">
							<h3 className="text-sm font-semibold opacity-90">Total Sales</h3>
							<DollarSign size={20} className="opacity-70" />
						</div>
						<p className="text-3xl font-bold">${stats.totalSales.toLocaleString()}</p>
						<p className="text-xs opacity-80 mt-2">All time sales</p>
					</div>

					{/* Monthly Revenue */}
					<div className="bg-linear-to-br from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg">
						<div className="flex items-center justify-between mb-2">
							<h3 className="text-sm font-semibold opacity-90">Monthly Revenue</h3>
							<TrendingUp size={20} className="opacity-70" />
						</div>
						<p className="text-3xl font-bold">${stats.revenue.toLocaleString()}</p>
						<p className="text-xs opacity-80 mt-2">↑ {stats.growth}% from last month</p>
					</div>

					{/* Monthly Profit */}
					<div className="bg-linear-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white shadow-lg">
						<div className="flex items-center justify-between mb-2">
							<h3 className="text-sm font-semibold opacity-90">Monthly Profit</h3>
							<BarChart3 size={20} className="opacity-70" />
						</div>
						<p className="text-3xl font-bold">${stats.monthlyProfit.toLocaleString()}</p>
						<p className="text-xs opacity-80 mt-2">This month profit</p>
					</div>

					{/* Total Orders */}
					<div className="bg-linear-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white shadow-lg">
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
				{chartData.length > 0 && (
				<Card className="mb-8 p-6">
					<h3 className="text-xl font-bold text-gray-900 mb-4">📊 Weekly Sales & Profit</h3>
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
						{chartData.map((data, idx) => (
							<div key={idx} className="bg-linear-to-b from-gray-50 to-white p-4 rounded-lg border border-gray-200">
								<p className="text-sm font-bold text-gray-900 mb-3">{data.name}</p>
								<div className="space-y-2">
									<div>
										<div className="flex justify-between text-sm mb-1">
											<span className="text-gray-600">Sales:</span>
											<span className="font-bold text-blue-600">${(data.value || 0).toLocaleString()}</span>
										</div>
										<div className="w-full bg-gray-200 rounded-full h-2">
											<div
												className="bg-blue-500 h-2 rounded-full"
												style={{ width: `${Math.min((data.value / (Math.max(...chartData.map(d => d.value)) || 1)) * 100, 100)}%` }}
											></div>
										</div>
									</div>
									<div>
										<div className="flex justify-between text-sm mb-1">
											<span className="text-gray-600">Profit:</span>
											<span className="font-bold text-green-600">${(data.profit || 0).toLocaleString()}</span>
										</div>
										<div className="w-full bg-gray-200 rounded-full h-2">
											<div
												className="bg-green-500 h-2 rounded-full"
												style={{ width: `${Math.min((data.profit / (Math.max(...chartData.map(d => d.profit)) || 1)) * 100, 100)}%` }}
											></div>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</Card>
				)}

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
						{productsLoading ? (
							<ProductGridSkeleton />
						) : filteredProducts.length === 0 ? (
							<div className="text-center py-12 bg-gray-50 rounded-lg">
								<p className="text-gray-600 text-lg">No products found</p>
								<p className="text-gray-500">Try adjusting your filters</p>
							</div>
						) : (
							<div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
								{filteredProducts.map((product) => (
									<div key={product.id} className={`bg-white border border-gray-200 rounded-lg hover:shadow-lg transition ${viewMode === 'list' ? 'flex gap-4 p-4' : 'p-4'}`}>
										{/* Product Image */}
										<div className={`shrink-0 ${viewMode === 'list' ? 'w-32 h-32' : 'w-full h-40'} bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden mb-4 sm:mb-0`}>
													{product.image?.startsWith('http') ? (
														<img src={product.image} alt={product.name} className="w-full h-full object-cover" />
													) : (
														<span className={viewMode === 'list' ? 'text-5xl' : 'text-6xl'}>{product.image}</span>
													)}
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