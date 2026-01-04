/**
 * Categories Page - Browse products by category
 */

import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
	Grid,
	List,
	ChevronDown,
	Star,
	ShoppingCart,
	Heart,
	Eye
} from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingScreen  from '../components/LoadingScreen.jsx'
import HeaderBeforeLogin from '../components/HeaderBeforeLogin.jsx'
import WishlistButton from '../components/WishlistButton.jsx'
import AdvancedSearch from '../components/AdvancedSearch.jsx'
import ProductQuickView from '../components/ProductQuickView.jsx'
import { ProductGridSkeleton } from '../components/Skeleton.jsx'

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const CategoriesPage = () => {
	const [viewMode, setViewMode] = useState('grid'); // grid or list
	const [sortBy, setSortBy] = useState('featured');
	const [selectedCategory, setSelectedCategory] = useState('all');
	const [searchTerm, setSearchTerm] = useState('');
	const [user, setUser] = useState(null);
	const [quickViewProduct, setQuickViewProduct] = useState(null);
	const [loading, setLoading] = useState(true);
	const [products, setProducts] = useState([]);
	const [categories, setCategories] = useState([
		{ id: 'all', name: 'All Products', count: 0 }
	]);

	// Fetch products from backend
	const fetchProducts = useCallback(async () => {
		try {
			setLoading(true);
			const params = new URLSearchParams();
			if (selectedCategory !== 'all') params.append('category', selectedCategory);
			if (searchTerm) params.append('search', searchTerm);
			params.append('sort', sortBy);
			params.append('limit', '200'); // Fetch all 177 products

			const response = await fetch(`${API_URL}/products?${params.toString()}`);
			const data = await response.json();

			if (data.success) {
				setProducts(data.data || []);
			}
		} catch (err) {
			console.error('Error fetching products:', err);
		} finally {
			setLoading(false);
		}
	}, [selectedCategory, searchTerm, sortBy]);

	// Fetch categories from backend
	const fetchCategories = useCallback(async () => {
		try {
			const response = await fetch(`${API_URL}/products/categories`);
			const data = await response.json();

			if (data.success && data.data) {
				// Fetch counts for each category
				const categoryList = [
					{ id: 'all', name: 'All Products', count: 0 }
				];

				for (const cat of data.data) {
					categoryList.push({
						id: cat,
						name: cat.charAt(0).toUpperCase() + cat.slice(1),
						count: 0
					});
				}

				// Get product counts per category
				const allResponse = await fetch(`${API_URL}/products`);
				const allData = await allResponse.json();
				if (allData.success && allData.data) {
					categoryList[0].count = allData.data.length;
					categoryList.forEach((cat, idx) => {
						if (cat.id !== 'all') {
							cat.count = allData.data.filter(p => p.category === cat.id).length;
						}
					});
				}

				setCategories(categoryList);
			}
		} catch (err) {
			console.error('Error fetching categories:', err);
		}
	}, []);

	useEffect(() => {
		const userData = JSON.parse(localStorage.getItem('user') || '{}');
		if (userData.id) {
			setUser(userData);
		}
		fetchCategories();
	}, [fetchCategories]);

	// Fetch products when filters change
	useEffect(() => {
		const timer = setTimeout(() => {
			fetchProducts();
		}, 300);
		return () => clearTimeout(timer);
	}, [fetchProducts]);

	// Filter products (already filtered from API, but apply local search if needed)
	let filteredProducts = selectedCategory === 'all'
		? products
		: products.filter(p => p.category === selectedCategory);

	// Apply search filter (in case API doesn't support search)
	if (searchTerm) {
		filteredProducts = filteredProducts.filter(p => 
			p.name.toLowerCase().includes(searchTerm.toLowerCase())
		);
	}

	// Sort products
	const sortedProducts = [...filteredProducts].sort((a, b) => {
		switch (sortBy) {
			case 'price-low':
				return a.price - b.price;
			case 'price-high':
				return b.price - a.price;
			case 'rating':
				return (b.rating || 0) - (a.rating || 0);
			default:
				return 0;
		}
	});

	return (
		<>
		{/* Header */}
				<HeaderBeforeLogin />
		<div className="min-h-screen bg-gray-50 py-8 sm:py-12 prefFont ">
				
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			
				<div className="mb-8">
					<h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Shop All Products</h1>
					<p className="text-gray-600">Discover our wide range of products</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
					{/* Sidebar - Categories */}
					<div className="lg:col-span-1">
						<Card className="p-6 sticky top-20">
							<h3 className="font-bold text-lg mb-6">Categories</h3>
							<div className="space-y-3">
								{categories.map(cat => (
									<button
										key={cat.id}
										onClick={() => setSelectedCategory(cat.id)}
										className={`w-full text-left px-4 py-3 rounded-lg transition ${
											selectedCategory === cat.id
												? 'bg-red-500 text-white font-semibold'
												: 'bg-gray-100 text-gray-900 hover:bg-gray-200'
										}`}
									>
										<div className="flex justify-between items-center">
											<span>{cat.name}</span>
											<span className="text-sm">{cat.count}</span>
										</div>
									</button>
								))}
							</div>

							{/* Price Filter */}
							<div className="mt-8 pt-8 border-t border-gray-200">
								<h4 className="font-bold mb-4">Price Range</h4>
								<input
									type="range"
									min="0"
									max="300"
									className="w-full"
								/>
								<div className="flex justify-between text-sm text-gray-600 mt-2">
									<span>$0</span>
									<span>$300</span>
								</div>
							</div>

							{/* Rating Filter */}
							<div className="mt-8 pt-8 border-t border-gray-200">
								<h4 className="font-bold mb-4">Rating</h4>
								<div className="space-y-3">
									{[5, 4, 3, 2].map(rating => (
										<label key={rating} className="flex items-center gap-3 cursor-pointer">
											<input type="checkbox" className="w-4 h-4" />
											<div className="flex items-center gap-1">
												{[...Array(rating)].map((_, i) => (
													<Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
												))}
												<span className="text-sm text-gray-600 ml-2">& up</span>
											</div>
										</label>
									))}
								</div>
							</div>
						</Card>
					</div>

					{/* Main Content */}
					<div className="lg:col-span-3">
						{/* Search Bar */}
						<div className="mb-6">
							<AdvancedSearch 
								onSearch={setSearchTerm}
								categories={['electronics', 'accessories']}
								onFilterChange={(filters) => {
									if (filters.category) {
										setSelectedCategory(filters.category);
									}
									if (filters.sortBy) {
										const sortMap = {
											'price-low': 'price-low',
											'price-high': 'price-high',
											'newest': 'featured',
											'name-asc': 'featured'
										};
										setSortBy(sortMap[filters.sortBy] || 'featured');
									}
								}}
							/>
						</div>

						{/* Toolbar */}
						<div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
							<div className="text-sm text-gray-600">
								Showing <span className="font-bold">{sortedProducts.length}</span> products
							</div>

							<div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
								{/* Sort Dropdown */}
								<div className="relative">
									<select
										value={sortBy}
										onChange={(e) => setSortBy(e.target.value)}
										className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
									>
										<option value="featured">Featured</option>
										<option value="price-low">Price: Low to High</option>
										<option value="price-high">Price: High to Low</option>
										<option value="rating">Highest Rated</option>
									</select>
								</div>

								{/* View Mode Toggle */}
								<div className="flex gap-2 bg-gray-100 p-2 rounded-lg">
									<button
										onClick={() => setViewMode('grid')}
										className={`p-2 rounded transition ${
											viewMode === 'grid'
												? 'bg-white text-red-500'
												: 'text-gray-600 hover:text-gray-900'
										}`}
									>
										<Grid size={20} />
									</button>
									<button
										onClick={() => setViewMode('list')}
										className={`p-2 rounded transition ${
											viewMode === 'list'
												? 'bg-white text-red-500'
												: 'text-gray-600 hover:text-gray-900'
										}`}
									>
										<List size={20} />
									</button>
								</div>
							</div>
						</div>

						{/* Products Grid/List */}
						{loading ? (
							<ProductGridSkeleton count={6} />
						) : viewMode === 'grid' ? (
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
								{sortedProducts.map(product => (
									<Card
										key={product.id}
										className="overflow-hidden hover:shadow-lg transition flex flex-col group animate-fade-in"
									>
										{/* Image */}
										<div className="w-full h-48 bg-gray-200 flex items-center justify-center text-6xl overflow-hidden relative">
											{product.image?.startsWith('http') ? (
												<img src={product.image} alt={product.name} className="w-full h-full object-cover" />
											) : (
												product.image
											)}
											{/* Hover Actions */}
											<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
												<button
													onClick={() => setQuickViewProduct(product)}
													className="p-3 bg-white rounded-full hover:bg-gray-100 transition transform hover:scale-110"
													title="Quick View"
												>
													<Eye size={20} className="text-gray-900" />
												</button>
												<WishlistButton 
													product={product}
													userId={user?.id}
													size="sm"
													className="bg-white rounded-full p-3 hover:bg-gray-100"
												/>
											</div>
										</div>

										{/* Details */}
										<div className="p-4 flex-1 flex flex-col">
											<h3 className="font-bold text-gray-900 mb-2 line-clamp-2 h-14">
												{product.name}
											</h3>

											{/* Rating */}
											<div className="flex items-center gap-2 mb-4">
												<div className="flex gap-1">
													{[...Array(5)].map((_, i) => (
														<Star
															key={i}
															size={14}
															className={`${
																i < Math.floor(product.rating)
																	? 'fill-yellow-400 text-yellow-400'
																	: 'text-gray-300'
															}`}
														/>
													))}
												</div>
												<span className="text-sm text-gray-600">
													{product.rating} ({product.reviews})
												</span>
											</div>

											{/* Price & Button */}
											<div className="mt-auto">
												<p className="text-2xl font-bold text-red-600 mb-4">
													${product.price.toFixed(2)}
												</p>
												<Link
													to={`/`}
													className="w-full py-2 bg-linear-to-r from-red-500 to-orange-500 text-white rounded-lg font-semibold hover:shadow-lg transition flex items-center justify-center gap-2"
												>
													<ShoppingCart size={18} />
													View Product
												</Link>
											</div>
										</div>
									</Card>
								))}
							</div>
						) : (
							<div className="space-y-4">
								{sortedProducts.map(product => (
									<Card key={product.id} className="p-6 flex flex-col sm:flex-row gap-6">
										{/* Image */}
														<div className="w-full sm:w-32 h-32 bg-gray-200 flex items-center justify-center text-5xl shrink-0 rounded-lg overflow-hidden">
											{product.image?.startsWith('http') ? (
												<img src={product.image} alt={product.name} className="w-full h-full object-cover" />
											) : (
												product.image
											)}
										</div>

										{/* Details */}
										<div className="flex-1">
											<h3 className="text-xl font-bold text-gray-900 mb-2">
												{product.name}
											</h3>

											{/* Rating */}
											<div className="flex items-center gap-2 mb-4">
												<div className="flex gap-1">
													{[...Array(5)].map((_, i) => (
														<Star
															key={i}
															size={14}
															className={`${
																i < Math.floor(product.rating)
																	? 'fill-yellow-400 text-yellow-400'
																	: 'text-gray-300'
															}`}
														/>
													))}
												</div>
												<span className="text-sm text-gray-600">
													{product.rating} ({product.reviews} reviews)
												</span>
											</div>

											<p className="text-3xl font-bold text-red-600 mb-4">
												${product.price.toFixed(2)}
											</p>

											<Link
												to={`/`}
												className="inline-flex py-2 px-6 bg-linear-to-r from-red-500 to-orange-500 text-white rounded-lg font-semibold hover:shadow-lg transition gap-2"
											>
												<ShoppingCart size={18} />
												View Product
											</Link>
										</div>
									</Card>
								))}
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Product Quick View Modal */}
			<ProductQuickView
				product={quickViewProduct}
				isOpen={!!quickViewProduct}
				onClose={() => setQuickViewProduct(null)}
				userId={user?.id}
			/>
		</div>
	</>
	);
};

export default CategoriesPage;
