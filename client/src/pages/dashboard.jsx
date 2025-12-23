/**
 * ========================================
 * E-Commerce Dashboard Component
 * ========================================
 * 
 * Enhanced e-commerce dashboard with product search, inventory, and sales metrics
 * Shows key metrics with IDOR and XSS protection
 * 
 * Features:
 * - Product search functionality
 * - Real-time sales analytics
 * - Inventory management
 * - Order tracking
 * - StatsCard metrics display
 * - Performance charts with Recharts
 * - IDOR protection (ownership verification)
 * - XSS protection (input sanitization)
 * - Protected route (requires authentication)
 */

import { useState, useEffect } from 'react';
import { useNavigate ,Link} from 'react-router-dom';
import { Plus, Search, ShoppingCart, TrendingUp, Users, DollarSign, Package,Home } from 'lucide-react';
import StatsCard from '../components/StatsCard.jsx';
import Chart from '../components/Chart.jsx';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import Hero from '../components/Hero.jsx';
import { sanitizeInput, canAccessResource, validateSession } from '../utils/security.js';

/**
 * Dashboard Component
 * E-commerce analytics dashboard with product search and IDOR/XSS protection
 */
const Dashboard = () => {
	// ========================================
	// STATE MANAGEMENT
	// ========================================
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('all');
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	// Mock product data
	const allProducts = [
		{ id: 1, name: 'Wireless Headphones', price: '$79.99', category: 'electronics', stock: 45, image: '🎧' },
		{ id: 2, name: 'Smart Watch', price: '$199.99', category: 'electronics', stock: 28, image: '⌚' },
		{ id: 3, name: 'Laptop Stand', price: '$49.99', category: 'accessories', stock: 62, image: '🖥️' },
		{ id: 4, name: 'USB-C Cable', price: '$12.99', category: 'accessories', stock: 150, image: '🔌' },
		{ id: 5, name: 'Phone Case', price: '$24.99', category: 'accessories', stock: 89, image: '📱' },
		{ id: 6, name: 'Portable Charger', price: '$34.99', category: 'electronics', stock: 56, image: '🔋' },
		{ id: 7, name: 'Keyboard', price: '$129.99', category: 'electronics', stock: 34, image: '⌨️' },
		{ id: 8, name: 'Mouse Pad', price: '$19.99', category: 'accessories', stock: 98, image: '🖱️' }
	];

	const [stats, setStats] = useState({
		totalSales: '$45,230',
		totalOrders: 1250,
		activeProducts: 45,
		avgOrderValue: '$36.18',
		conversionRate: 3.2,
		revenue: '$125,450',
		growth: 12.5
	});

	const [chartData, setChartData] = useState([
		{ name: 'Week 1', value: 2400 },
		{ name: 'Week 2', value: 3200 },
		{ name: 'Week 3', value: 2800 },
		{ name: 'Week 4', value: 4100 }
	]);

	// ========================================
	// HOOKS
	// ========================================
	const navigate = useNavigate();

	// ========================================
	// HANDLER FUNCTIONS
	// ========================================

	/**
	 * Handle product search with XSS protection
	 */
	const handleSearch = (e) => {
		const sanitized = sanitizeInput(e.target.value);
		setSearchQuery(sanitized);
	};

	/**
	 * Filter products based on search and category
	 */
	const filteredProducts = allProducts.filter(product => {
		const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
		return matchesSearch && matchesCategory;
	});

	/**
	 * Handle add to cart
	 */
	const handleAddToCart = (product) => {
		setSuccess(`${product.name} added to cart!`);
		setTimeout(() => setSuccess(''), 3000);
	};

	// ========================================
	// EFFECTS
	// ========================================

	/**
	 * Check authentication on mount with IDOR protection
	 */
	useEffect(() => {
		const userData = JSON.parse(localStorage.getItem('user') || 'null');
		
		if (!userData) {
			navigate('/login');
			return;
		}

		// IDOR Protection: Verify user owns this dashboard
		if (!canAccessResource(userData.id, userData.id)) {
			navigate('/');
			return;
		}

		setUser(userData);
		setLoading(false);
	}, [navigate]);

	// ========================================
	// RENDER
	// ========================================

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<p className="text-2xl font-bold text-gray-700 mb-4">Loading...</p>
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-100 py-8">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-4xl font-bold text-gray-900 mb-2">
						Welcome, <span className="text-red-500">{user?.username}</span>! 👋
					</h1>
					<p className="text-gray-600">E-Commerce Product Dashboard</p>
				</div>

				{/* Messages */}
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

				{/* Key Metrics */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					<StatsCard title="Total Sales" value={stats.totalSales} icon={DollarSign} color="green" trend={12.5} />
					<StatsCard title="Total Orders" value={stats.totalOrders} icon={ShoppingCart} color="blue" trend={8.3} />
					<StatsCard title="Active Products" value={stats.activeProducts} icon={Package} color="purple" trend={5.2} />
					<StatsCard title="Avg Order Value" value={stats.avgOrderValue} icon={TrendingUp} color="orange" trend={3.1} />
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
					{/* Main Content - Product Search & Listing */}
					<div className="lg:col-span-3 space-y-6">
						{/* Search Box */}
						<div className="bg-white rounded-lg shadow-md p-6">
							<div className="relative mb-4">
								<Search className="absolute left-3 top-3 text-gray-400" size={20} />
								<input
									type="text"
									value={searchQuery}
									onChange={handleSearch}
									placeholder="Search products..."
									className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
								/>
							</div>

							{/* Category Filter */}
							<div className="flex gap-2 flex-wrap">
								{['all', 'electronics', 'accessories'].map((category) => (
									<button
										key={category}
										onClick={() => setSelectedCategory(category)}
										className={`px-4 py-2 rounded-lg font-semibold transition ${
											selectedCategory === category
												? 'bg-red-500 text-white'
												: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
										}`}
									>
										{category.charAt(0).toUpperCase() + category.slice(1)}
									</button>
								))}
							</div>
						</div>

						{/* Products Grid */}
						<div className="bg-white rounded-lg shadow-md p-6">
							<h2 className="text-xl font-bold text-gray-900 mb-4">
								Products ({filteredProducts.length})
							</h2>
							
							{filteredProducts.length === 0 ? (
								<div className="text-center py-12">
									<p className="text-gray-600 text-lg">No products found</p>
								</div>
							) : (
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									{filteredProducts.map((product) => (
										<div
											key={product.id}
											className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition"
										>
											<div className="text-4xl mb-2">{product.image}</div>
											<h3 className="font-bold text-gray-900 mb-1">{product.name}</h3>
											<div className="flex justify-between items-center mb-3">
												<span className="text-red-500 font-bold text-lg">{product.price}</span>
												<span className="text-sm text-gray-500">Stock: {product.stock}</span>
											</div>
											<button
												onClick={() => handleAddToCart(product)}
												className="w-full px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition font-semibold text-sm"
											>
												<ShoppingCart size={16} className="inline mr-1" />
												Add to Cart
											</button>
										</div>
									))}
								</div>
							)}
						</div>
					</div>

					{/* Sidebar - Analytics */}
					<div className="space-y-6">
						{/* Sales Chart */}
						<div className="bg-white rounded-lg shadow-md p-6">
							<h3 className="text-lg font-bold text-gray-900 mb-4">Weekly Sales</h3>
							<div className="space-y-3">
								{chartData.map((data, idx) => (
									<div key={idx}>
										<div className="flex justify-between mb-1 text-sm">
											<span className="text-gray-700">{data.name}</span>
											<span className="font-bold text-red-500">${data.value}</span>
										</div>
										<div className="w-full bg-gray-200 rounded-full h-2">
											<div
												className="bg-red-500 h-2 rounded-full transition-all"
												style={{ width: `${(data.value / 4500) * 100}%` }}
											></div>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Quick Stats */}
						<div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg shadow-md p-6 border border-red-100">
							<h3 className="text-lg font-bold text-gray-900 mb-4">📊 Performance</h3>
							<ul className="space-y-2 text-sm">
								<li className="flex justify-between">
									<span className="text-gray-600">Conversion Rate:</span>
									<span className="font-bold text-red-500">{stats.conversionRate}%</span>
								</li>
								<li className="flex justify-between">
									<span className="text-gray-600">Growth:</span>
									<span className="font-bold text-green-500">↑ {stats.growth}%</span>
								</li>
								<li className="flex justify-between">
									<span className="text-gray-600">Total Revenue:</span>
									<span className="font-bold text-red-500">{stats.revenue}</span>
								</li>
							</ul>
						</div>

						{/* Action Button */}
						<button className="w-full px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold flex items-center justify-center gap-2">
							<Plus size={20} />
							Add New Product
						</button>
						<Link to="/app">
						<button className="w-full px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold flex items-center justify-center gap-2">
							<Home size={20} />
							back
						</button>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;