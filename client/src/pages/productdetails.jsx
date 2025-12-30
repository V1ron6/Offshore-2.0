import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Star, Minus, Plus, CheckCircle } from 'lucide-react';
import { addToCart, getCart } from '../utils/cartService.js';

const ProductDetails = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [product, setProduct] = useState(null);
	const [quantity, setQuantity] = useState(1);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(null);
	const [cart, setCart] = useState([]);

	// Get user from localStorage
	const user = JSON.parse(localStorage.getItem('user')) || {};

	// Load cart from localStorage
	useEffect(() => {
		const savedCart = getCart(user.id);
		setCart(savedCart);
	}, [user.id]);

	const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
	// Fetch product details
	useEffect(() => {
		const fetchProduct = async () => {
			try {
				setLoading(true);
				const response = await fetch(`${API_URL}/products/${id}`);
				console.log('id - product',id)
				if (!response.ok) {
					throw new Error('Failed to fetch product details');
				}
				const data = await response.json();
				setProduct(data.data);
				setError(null);
				console.log('product from api',product)
			} catch (err) {
				setError(err.message || 'Error loading product');
				console.error('Error fetching product:', err);
			} finally {
				setLoading(false);
			}
		};

		if (id) {
			fetchProduct();
		}
	}, [id]);

	const addToCartHandler = () => {
		if (!product || quantity <= 0) return;

		// Use cart service to add to cart
		const updatedCart = addToCart(user.id, product, quantity);
		setCart(updatedCart);
		setSuccess(`${product.name} added to cart!`);
		setQuantity(1);
		setTimeout(() => setSuccess(null), 3000);
	};

	const handleQuantityChange = (value) => {
		const newQuantity = parseInt(value);
		if (newQuantity >= 1 && newQuantity <= (product?.stock || 10)) {
			setQuantity(newQuantity);
		}
	};


	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
			</div>
		);
	}

	if (error || !product) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
					<p className="text-gray-600 mb-6">{error || 'The product you are looking for does not exist.'}</p>
					<button
						onClick={() => navigate('/app')}
						className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold"
					>
						<ArrowLeft size={20} />
						Back to Products
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<div className="bg-white shadow-sm sticky top-0 z-40">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
					<button
						onClick={() => navigate('/app')}
						className="flex items-center gap-2 text-red-500 hover:text-red-600 transition font-semibold"
					>
						<ArrowLeft size={20} />
						Back to Products
					</button>
					<h1 className="text-xl sm:text-2xl font-bold text-gray-900">Product Details</h1>
					<div className="w-24"></div>
				</div>
			</div>

			{/* Main Content */}
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
				{success && (
					<div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded flex items-center gap-2">
						<CheckCircle size={20} />
						{success}
					</div>
				)}

				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					{/* Product Image */}
					<div className="flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-200 rounded-lg p-8 min-h-96">
						<div className="text-8xl sm:text-9xl">{product.image}</div>
					</div>

					{/* Product Info */}
					<div className="flex flex-col gap-6">
						{/* Breadcrumb */}
						<div className="text-sm text-gray-500">
							<span className="capitalize">{product.category}</span>
							{product.subcategory && (
								<>
									<span> / </span>
									<span className="capitalize">{product.subcategory}</span>
								</>
							)}
						</div>

						{/* Title and Rating */}
						<div>
							<h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">{product.name}</h1>
							<div className="flex items-center gap-4">
								<div className="flex items-center gap-2">
									<Star size={20} className="text-yellow-500 fill-yellow-500" />
									<span className="font-bold text-lg">{product.rating}</span>
									<span className="text-gray-600">({product.reviews} reviews)</span>
								</div>
								<span className={`px-3 py-1 rounded-full text-sm font-semibold ${
									product.inStock
										? 'bg-green-100 text-green-700'
										: 'bg-red-100 text-red-700'
								}`}>
									{product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
								</span>
							</div>
						</div>

						{/* Description */}
						<div className="border-t border-gray-200 pt-6">
							<h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
							<p className="text-gray-700 leading-relaxed">{product.description}</p>
						</div>

						{/* Product Details Grid */}
						<div className="grid grid-cols-2 gap-4 bg-gray-100 rounded-lg p-4">
							<div>
								<p className="text-sm text-gray-600">SKU</p>
								<p className="font-semibold text-gray-900">{product.sku}</p>
							</div>
							<div>
								<p className="text-sm text-gray-600">Stock</p>
								<p className="font-semibold text-gray-900">{product.stock} units</p>
							</div>
							<div>
								<p className="text-sm text-gray-600">Category</p>
								<p className="font-semibold text-gray-900 capitalize">{product.category}</p>
							</div>
							<div>
								<p className="text-sm text-gray-600">Availability</p>
								<p className={`font-semibold ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
									{product.inStock ? 'Available' : 'Unavailable'}
								</p>
							</div>
						</div>

						{/* Pricing */}
						<div className="border-t border-gray-200 pt-6">
							<div className="flex items-end gap-3 mb-6">
								<span className="text-5xl font-bold text-red-500">${product?.price ? product.price.toFixed(2) : '0.00'}</span>
								{product.originalPrice && (
									<span className="text-2xl text-gray-500 line-through mb-2">${product.originalPrice ? product.originalPrice.toFixed(2) : '0.00'}</span>
								)}
							</div>
							{product.originalPrice && (
								<div className="text-green-600 font-semibold mb-6">
									Save ${product.originalPrice && product.price ? (product.originalPrice - product.price).toFixed(2) : '0.00'}
								</div>
							)}
						</div>

						{/* Quantity and Add to Cart */}
						<div className="border-t border-gray-200 pt-6 space-y-4">
							<div>
								<label htmlFor="quantity" className="block text-sm font-semibold text-gray-900 mb-3">
									Quantity
								</label>
								<div className="flex items-center gap-4">
									<button
										onClick={() => setQuantity(Math.max(1, quantity - 1))}
										disabled={!product.inStock || quantity <= 1}
										className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
									>
										<Minus size={20} />
									</button>
									<select
										id="quantity"
										value={quantity}
										onChange={(e) => handleQuantityChange(e.target.value)}
										disabled={!product.inStock}
										className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-lg font-semibold text-center disabled:opacity-50 disabled:cursor-not-allowed"
									>
										{Array.from({ length: Math.min(product.stock, 10) }, (_, i) => i + 1).map((num) => (
											<option key={num} value={num}>
												{num}
											</option>
										))}
									</select>
									<button
										onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
										disabled={!product.inStock || quantity >= Math.min(product.stock, 10)}
										className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
									>
										<Plus size={20} />
									</button>
								</div>
							</div>

							<button
								onClick={addToCartHandler}
								disabled={!product.inStock}
								className={`w-full py-4 px-6 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition ${
									product.inStock
										? 'bg-red-500 text-white hover:bg-red-600'
										: 'bg-gray-300 text-gray-500 cursor-not-allowed'
								}`}
							>
								<ShoppingCart size={24} />
								{product.inStock ? 'Add to Cart' : 'Out of Stock'}
							</button>
						</div>

						{/* Additional Info */}
						<div className="border-t border-gray-200 pt-6 text-sm text-gray-600 space-y-2">
							<p>✓ Free shipping on orders over $50</p>
							<p>✓ 30-day return guarantee</p>
							<p>✓ Secure checkout with SSL encryption</p>
						</div>
					</div>
				</div>

				{/* Related Products Placeholder */}
				<div className="mt-16 pt-8 border-t border-gray-200">
					<h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">You May Also Like</h2>
					<div className="text-center py-12 bg-gray-100 rounded-lg">
						<p className="text-gray-600">More products coming soon...</p>
					</div>
				</div>
			</main>
		</div>
	);
};

export default ProductDetails;
