/**
 * Categories Page - Browse products by category
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
	Grid,
	List,
	ChevronDown,
	Star,
	ShoppingCart,
	Heart
} from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingScreen  from '../components/LoadingScreen.jsx'
import HeaderBeforeLogin from '../components/HeaderBeforeLogin.jsx'

const CategoriesPage = () => {
	const [viewMode, setViewMode] = useState('grid'); // grid or list
	const [sortBy, setSortBy] = useState('featured');
	const [selectedCategory, setSelectedCategory] = useState('all');

	// Mock products data
	const products = [
		{ id: 1, name: 'Wireless Headphones', price: 79.99, category: 'electronics', rating: 4.5, reviews: 324, image: '🎧' },
		{ id: 2, name: 'Smart Watch', price: 199.99, category: 'electronics', rating: 4.8, reviews: 156, image: '⌚' },
		{ id: 3, name: 'Laptop Stand', price: 49.99, category: 'accessories', rating: 4.3, reviews: 89, image: '🖥️' },
		{ id: 4, name: 'USB-C Cable', price: 12.99, category: 'accessories', rating: 4.6, reviews: 512, image: '🔌' },
		{ id: 5, name: 'Phone Case', price: 24.99, category: 'accessories', rating: 4.2, reviews: 203, image: '📱' },
		{ id: 6, name: 'Portable Charger', price: 34.99, category: 'electronics', rating: 4.7, reviews: 445, image: '🔋' },
		{ id: 7, name: 'Keyboard', price: 129.99, category: 'electronics', rating: 4.9, reviews: 267, image: '⌨️' },
		{ id: 8, name: 'Mouse Pad', price: 19.99, category: 'accessories', rating: 4.4, reviews: 178, image: '🖱️' },
		{ id: 9, name: 'HDMI Cable', price: 9.99, category: 'accessories', rating: 4.5, reviews: 298, image: '📺' },
		{ id: 10, name: 'Laptop Cooling Pad', price: 59.99, category: 'electronics', rating: 4.6, reviews: 134, image: '❄️' },
		{ id: 11, name: 'Screen Protector', price: 14.99, category: 'accessories', rating: 4.3, reviews: 401, image: '🛡️' },
		{ id: 12, name: 'Webcam', price: 89.99, category: 'electronics', rating: 4.7, reviews: 228, image: '📷' }
	];

	const categories = [
		{ id: 'all', name: 'All Products', count: 12 },
		{ id: 'electronics', name: 'Electronics', count: 6 },
		{ id: 'accessories', name: 'Accessories', count: 6 }
	];

	// Filter products
	const filteredProducts = selectedCategory === 'all'
		? products
		: products.filter(p => p.category === selectedCategory);

	// Sort products
	const sortedProducts = [...filteredProducts].sort((a, b) => {
		switch (sortBy) {
			case 'price-low':
				return a.price - b.price;
			case 'price-high':
				return b.price - a.price;
			case 'rating':
				return b.rating - a.rating;
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
						{viewMode === 'grid' ? (
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
								{sortedProducts.map(product => (
									<Card
										key={product.id}
										className="overflow-hidden hover:shadow-lg transition flex flex-col"
									>
										{/* Image */}
										<div className="w-full h-48 bg-gray-200 flex items-center justify-center text-6xl overflow-hidden relative group">
											{product.image}
											<button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-red-500 hover:text-white transition opacity-0 group-hover:opacity-100">
												<Heart size={20} />
											</button>
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
													<div className="w-full sm:w-32 h-32 bg-gray-200 flex items-center justify-center text-5xl shrink-0 rounded-lg">
											{product.image}
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
		</div>
	</>
	);
};

export default CategoriesPage;
