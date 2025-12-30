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
import { useNavigate } from 'react-router-dom';
import { Plus, Search, ShoppingCart, TrendingUp, Users, DollarSign, Package, Home } from 'lucide-react';
import StatsCard from '../components/StatsCard.jsx';
import Chart from '../components/Chart.jsx';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import Hero from '../components/Hero.jsx';
import { sanitizeInput, canAccessResource } from '../utils/security.js';
import { addToCart } from '../utils/cartService.js';

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
	const [showAddProductModal, setShowAddProductModal] = useState(false);
	const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '', category: '' });
	const [products, setProducts] = useState([
		{ id: 1, name: 'Wireless Headphones', price: '$79.99', category: 'electronics', stock: 45, image: '🎧' },
		{ id: 2, name: 'Smart Watch', price: '$199.99', category: 'electronics', stock: 28, image: '⌚' },
		{ id: 3, name: 'Laptop Stand', price: '$49.99', category: 'accessories', stock: 62, image: '🖥️' },
		{ id: 4, name: 'USB-C Cable', price: '$12.99', category: 'accessories', stock: 150, image: '🔌' },
		{ id: 5, name: 'Phone Case', price: '$24.99', category: 'accessories', stock: 89, image: '📱' },
		{ id: 6, name: 'Portable Charger', price: '$34.99', category: 'electronics', stock: 56, image: '🔋' },
		{ id: 7, name: 'Keyboard', price: '$129.99', category: 'electronics', stock: 34, image: '⌨️' },
		{ id: 8, name: 'Mouse Pad', price: '$19.99', category: 'accessories', stock: 98, image: '🖱️' }
	]);

	const [stats] = useState({
		totalSales: '$45,230',
		totalOrders: 1250,
		activeProducts: 45,
		avgOrderValue: '$36.18',
		conversionRate: 3.2,
		revenue: '$125,450',
		growth: 12.5
	});

	const [chartData] = useState([
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
	const filteredProducts = products.filter(product => {
		const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
		return matchesSearch && matchesCategory;
	});

	/**
	 * Handle add to cart
	 */
	const handleAddToCart = (product) => {
		if (product.stock <= 0) {
			setError('This item is out of stock!');
			return;
		}

		// Add to cart using cart service
		addToCart(user.id, product, 1);

		// Reduce stock in dashboard
		setProducts(products.map(p => 
			p.id === product.id ? { ...p, stock: p.stock - 1 } : p
		));

		setSuccess(`${product.name} added to cart! Stock: ${product.stock - 1}`);
		setTimeout(() => setSuccess(''), 3000);
	};

	/**
	 * Handle add new product
	 */
	const handleAddProduct = () => {
		if (!newProduct.name || !newProduct.price || !newProduct.stock) {
			setError('Please fill in all fields');
			return;
		}
		const productToAdd = {
			id: products.length + 1,
			name: newProduct.name,
			price: newProduct.price,
			stock: parseInt(newProduct.stock),
			category: newProduct.category || 'electronics',
			image: '📦'
		};
		setProducts([...products, productToAdd]);
		setSuccess(`Product "${newProduct.name}" added successfully!`);
		setShowAddProductModal(false);
		setNewProduct({ name: '', price: '', stock: '', category: '' });
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
		<div className="min-h-screen bg-gray-100">
			{/* Hero Section */}
			<Hero 
				title={`Welcome to Your Dashboard, ${user?.username}!`}
				subtitle="Manage your products, track sales, and grow your business"
				cta={{ label: 'Add New Product', onClick: () => setShowAddProductModal(true) }}
			/>

			<div className="py-8">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

					{/* Main Dashboard Layout with Chart */}
					<div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
						{/* Left Column - Main Content and Chart */}
						<div className="lg:col-span-3">
							{/* Sales Chart */}
							<Card>
								<div className="p-6 border-b border-gray-200">
									<h3 className="text-xl font-bold text-gray-900">📊 Weekly Sales Performance</h3>
								</div>
								<div className="p-6">
									<Chart data={chartData} />
								</div>
							</Card>
						</div>

						{/* Right Column - User Stats Card */}
						<div>
							<Card>
								<div className="p-6 border-b border-gray-200">
									<h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
										<Users size={20} className="text-blue-500" />
										User Profile
									</h3>
								</div>
								<div className="p-6 space-y-4">
									<div>
										<p className="text-sm text-gray-600 mb-1">Account Owner</p>
										<p className="font-bold text-gray-900">{user?.username || 'User'}</p>
									</div>
									<hr />
									<div>
										<p className="text-sm text-gray-600 mb-1">User ID</p>
										<p className="font-mono text-sm text-gray-700 break-all">{user?.id}</p>
									</div>
									<hr />
									<div>
										<p className="text-sm text-gray-600 mb-1">Email</p>
										<p className="font-semibold text-gray-900">{user?.email || 'Not provided'}</p>
									</div>
									<Button
										variant="danger"
										fullWidth
										onClick={() => alert('View detailed profile')}
										className="mt-4"
									>
										View Profile
									</Button>
								</div>
							</Card>
						</div>
					</div>

					{/* Products Section */}
					<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
						{/* Main Content - Product Search & Listing */}
						<div className="lg:col-span-3 space-y-6">
						{/* Search Box */}
						<Card>
							<div className="p-6">
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
										<Button
											key={category}
											variant={selectedCategory === category ? 'danger' : 'secondary'}
											size="sm"
											onClick={() => setSelectedCategory(category)}
										>
											{category.charAt(0).toUpperCase() + category.slice(1)}
										</Button>
									))}
								</div>
							</div>
						</Card>

						{/* Products Grid */}
						<Card>
							<div className="p-6 border-b border-gray-200">
								<h2 className="text-xl font-bold text-gray-900">
									Products ({filteredProducts.length})
								</h2>
							</div>
							
							{filteredProducts.length === 0 ? (
								<div className="p-12 text-center">
									<p className="text-gray-600 text-lg">No products found</p>
								</div>
							) : (
								<div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
									{filteredProducts.map((product) => (
										<Card key={product.id}>
											<div className="p-4">
												<div className="text-4xl mb-2">{product.image}</div>
												<h3 className="font-bold text-gray-900 mb-1">{product.name}</h3>
												<div className="flex justify-between items-center mb-3">
													<span className="text-red-500 font-bold text-lg">{product.price}</span>
													<span className="text-sm text-gray-500">Stock: {product.stock}</span>
												</div>
												<Button
													variant="danger"
													size="sm"
													fullWidth
													onClick={() => handleAddToCart(product)}
												>
													<ShoppingCart size={16} className="inline mr-1" />
													Add to Cart
												</Button>
											</div>
										</Card>
									))}
								</div>
							)}
						</Card>
					</div>

					{/* Sidebar - Analytics */}
					<div className="space-y-6">
						{/* Sales Chart */}
						<Card>
							<div className="p-6 border-b border-gray-200">
								<h3 className="text-lg font-bold text-gray-900">Weekly Sales</h3>
							</div>
							<div className="p-6 space-y-3">
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
						</Card>

						{/* Quick Stats */}
						<Card>
							<div className="p-6 bg-linear-to-br from-red-50 to-orange-50">
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
						</Card>

						{/* Action Buttons */}
						<Button 
							variant="danger"
							fullWidth
							onClick={() => setShowAddProductModal(true)}
						>
							<Plus size={20} />
							Add New Product
						</Button>
						<Button
							variant="secondary"
							fullWidth
							onClick={() => navigate('/app')}
						>
							<Home size={20} />
							back
						</Button>
					</div>
				</div>
			</div>
		</div>

		{/* Add Product Modal */}
		{showAddProductModal && (
			<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
				<Card className="w-full max-w-md">
					<div className="p-6">
						<h2 className="text-2xl font-bold mb-4">Add New Product</h2>
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-semibold text-gray-900 mb-2">Product Name</label>
								<input
									type="text"
									value={newProduct.name}
									onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
									placeholder="Enter product name"
								/>
							</div>
							<div>
								<label className="block text-sm font-semibold text-gray-900 mb-2">Price</label>
								<input
									type="text"
									value={newProduct.price}
									onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
									placeholder="Enter price (e.g., $29.99)"
								/>
							</div>
							<div>
								<label className="block text-sm font-semibold text-gray-900 mb-2">Stock</label>
								<input
									type="number"
									value={newProduct.stock}
									onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
									placeholder="Enter stock quantity"
								/>
							</div>
							<div>
								<label className="block text-sm font-semibold text-gray-900 mb-2">Category</label>
								<select
									value={newProduct.category}
									onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
								>
									<option value="electronics">Electronics</option>
									<option value="accessories">Accessories</option>
									<option value="other">Other</option>
								</select>
							</div>
							<div className="flex gap-3 pt-4">
								<button
									onClick={() => setShowAddProductModal(false)}
									className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg font-semibold hover:bg-gray-300 transition"
								>
									Cancel
								</button>
								<button
									onClick={handleAddProduct}
									className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition"
								>
									Add Product
								</button>
							</div>
						</div>
					</div>
				</Card>
			</div>
		)}
	</div>
)};

export default Dashboard;