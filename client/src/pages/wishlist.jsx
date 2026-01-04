/**
 * Wishlist Page
 * Displays user's saved/favorite products
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, Star, ArrowLeft } from 'lucide-react';
import LoadingScreen from '../components/LoadingScreen.jsx';
import { useToast } from '../components/ToastContext.jsx';
import { addToCart } from '../utils/cartService.js';
import apiClient from '../utils/apiClient.js';

const WishlistPage = () => {
	const [wishlist, setWishlist] = useState([]);
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState(null);
	const navigate = useNavigate();
	const toast = useToast();

	useEffect(() => {
		const userData = JSON.parse(localStorage.getItem('user') || '{}');
		if (!userData.id) {
			navigate('/login');
			return;
		}
		setUser(userData);
		loadWishlist();
	}, [navigate]);

	const loadWishlist = async () => {
		try {
			const response = await apiClient.get('/wishlist');
			if (response.data.success) {
				setWishlist(response.data.data);
			}
		} catch (error) {
			console.error('Error loading wishlist:', error);
			// Fallback to localStorage
			const saved = JSON.parse(localStorage.getItem('wishlist') || '[]');
			setWishlist(saved);
		} finally {
			setLoading(false);
		}
	};

	const handleRemove = async (productId) => {
		try {
			await apiClient.delete(`/wishlist/${productId}`);
			setWishlist(prev => prev.filter(item => item.productId !== productId));
			toast.success('Removed from wishlist');
		} catch (error) {
			// Fallback to localStorage
			const updated = wishlist.filter(item => item.productId !== productId);
			setWishlist(updated);
			localStorage.setItem('wishlist', JSON.stringify(updated));
			toast.success('Removed from wishlist');
		}
	};

	const handleAddToCart = (item) => {
		if (user) {
			addToCart(user.id, {
				id: item.productId,
				name: item.name,
				price: item.price,
				image: item.image
			});
			toast.success('Added to cart!');
		}
	};

	const handleMoveAllToCart = () => {
		if (user && wishlist.length > 0) {
			wishlist.forEach(item => {
				addToCart(user.id, {
					id: item.productId,
					name: item.name,
					price: item.price,
					image: item.image
				});
			});
			toast.success(`Added ${wishlist.length} items to cart!`);
		}
	};

	if (loading) {
		return <LoadingScreen />;
	}

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
			{/* Header */}
			<div className="bg-white dark:bg-gray-800 shadow-sm">
				<div className="max-w-7xl mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<Link to="/dashboard" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
								<ArrowLeft className="w-6 h-6" />
							</Link>
							<div>
								<h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
									<Heart className="w-6 h-6 text-red-500 fill-red-500" />
									My Wishlist
								</h1>
								<p className="text-gray-500 dark:text-gray-400 text-sm">
									{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
								</p>
							</div>
						</div>
						{wishlist.length > 0 && (
							<button
								onClick={handleMoveAllToCart}
								className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
							>
								<ShoppingCart className="w-4 h-4" />
								Add All to Cart
							</button>
						)}
					</div>
				</div>
			</div>

			{/* Content */}
			<div className="max-w-7xl mx-auto px-4 py-8">
				{wishlist.length === 0 ? (
					<div className="text-center py-16">
						<Heart className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
						<h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
							Your wishlist is empty
						</h2>
						<p className="text-gray-500 dark:text-gray-400 mb-6">
							Save items you love by clicking the heart icon on products
						</p>
						<Link
							to="/dashboard"
							className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
						>
							Start Shopping
						</Link>
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{wishlist.map((item) => (
							<div
								key={item.id || item.productId}
								className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition group"
							>
								{/* Product Image */}
								<div className="relative h-48 bg-gray-100 dark:bg-gray-700">
									{item.image?.startsWith('http') ? (
										<img
											src={item.image}
											alt={item.name}
											className="w-full h-full object-cover"
										/>
									) : (
										<div className="w-full h-full flex items-center justify-center text-6xl">
											{item.image || '📦'}
										</div>
									)}
									{/* Remove button */}
									<button
										onClick={() => handleRemove(item.productId)}
										className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-red-50 dark:hover:bg-red-900/20 transition"
										title="Remove from wishlist"
									>
										<Trash2 className="w-4 h-4 text-red-500" />
									</button>
								</div>

								{/* Product Info */}
								<div className="p-4">
									<Link to={`/product/${item.productId}`}>
										<h3 className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition line-clamp-2">
											{item.name}
										</h3>
									</Link>
									
									{item.category && (
										<p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
											{item.category}
										</p>
									)}

									{item.rating && (
										<div className="flex items-center gap-1 mt-2">
											<Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
											<span className="text-sm text-gray-600 dark:text-gray-300">
												{item.rating}
											</span>
										</div>
									)}

									<div className="flex items-center justify-between mt-4">
										<span className="text-lg font-bold text-gray-900 dark:text-white">
											${item.price?.toFixed(2)}
										</span>
										<button
											onClick={() => handleAddToCart(item)}
											className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
											title="Add to cart"
										>
											<ShoppingCart className="w-5 h-5" />
										</button>
									</div>

									<p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
										Added {new Date(item.addedAt).toLocaleDateString()}
									</p>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default WishlistPage;
