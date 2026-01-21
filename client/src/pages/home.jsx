/**
 * ========================================
 * Welcome/Landing Page Component
 * ========================================
 * 
 * Professional e-commerce landing page with modern design
 * Features hero section, dynamic products & categories from backend
 * Logged-in users are redirected to dashboard
 */

import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
	Zap, Shield, Truck, RotateCcw, Star, TrendingUp, 
	ChevronRight, ShoppingBag, Heart, ArrowRight,
	Sparkles, Award, Clock, Percent
} from 'lucide-react';
import Button from '../components/Button.jsx';
import Footer from '../components/Footer.jsx';
import LoadingScreen from '../components/LoadingScreen.jsx';
import HeaderBeforeLogin from '../components/HeaderBeforeLogin.jsx';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Category images mapping
const categoryImages = {
	electronics: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop',
	devices: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
	foodstuffs: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop',
	accessories: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&h=300&fit=crop',
	home: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400&h=300&fit=crop',
	'personal-care': 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=300&fit=crop',
	beauty: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop',
	books: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=300&fit=crop',
	clothing: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop'
};

const Home = () => {
	const navigate = useNavigate();
	const [featuredProducts, setFeaturedProducts] = useState([]);
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		// Redirect logged-in users to dashboard
		const userData = JSON.parse(localStorage.getItem('user') || 'null');
		if (userData && userData.id) {
			navigate('/app');
		}
	}, [navigate]);

	// Fetch featured products and categories from backend
	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				
				// Fetch featured products and categories in parallel
				const [productsRes, categoriesRes] = await Promise.all([
					fetch(`${API_BASE_URL}/products/featured`),
					fetch(`${API_BASE_URL}/products/categories`)
				]);

				if (!productsRes.ok || !categoriesRes.ok) {
					throw new Error('Failed to fetch data');
				}

				const productsData = await productsRes.json();
				const categoriesData = await categoriesRes.json();

				setFeaturedProducts(productsData.data?.slice(0, 8) || []);
				setCategories(categoriesData.data || []);
			} catch (err) {
				console.error('Error fetching data:', err);
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	const features = [
		{
			icon: Truck,
			title: 'Fast Shipping',
			description: 'Free delivery on orders over $50',
			color: 'from-blue-500 to-cyan-500'
		},
		{
			icon: RotateCcw,
			title: '30-Day Returns',
			description: 'Easy returns, no questions asked',
			color: 'from-green-500 to-emerald-500'
		},
		{
			icon: Shield,
			title: 'Secure Shopping',
			description: 'Your data is 100% protected',
			color: 'from-purple-500 to-pink-500'
		},
		{
			icon: Award,
			title: 'Top Quality',
			description: 'Certified products only',
			color: 'from-orange-500 to-red-500'
		}
	];

	const stats = [
		{ label: '50K+', value: 'Products', icon: ShoppingBag },
		{ label: '100K+', value: 'Happy Customers', icon: Heart },
		{ label: '99.9%', value: 'Uptime', icon: Zap },
		{ label: '24/7', value: 'Support', icon: Clock }
	];

	if (loading) {
		return <LoadingScreen />;
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Navigation */}
			<HeaderBeforeLogin />

			{/* Hero Section - Modern Gradient Design */}
			<section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
				{/* Animated Background Elements */}
				<div className="absolute inset-0 overflow-hidden">
					<div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
					<div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
					<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-500"></div>
				</div>

				<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
						{/* Hero Content */}
						<div className="space-y-8 text-center lg:text-left">
							<div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-white/90 border border-white/20">
								<Sparkles size={16} className="text-yellow-400" />
								<span>New Year Sale - Up to 50% Off</span>
							</div>

							<h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
								Discover Your
								<span className="block bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
									Perfect Style
								</span>
							</h1>

							<p className="text-xl text-gray-300 max-w-xl">
								Explore millions of premium products from trusted sellers worldwide. 
								Enjoy free shipping, unbeatable prices, and exceptional quality.
							</p>

							{/* CTA Buttons */}
							<div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
								<Link to="/signup">
									<Button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-purple-500/30 transition-all duration-300 hover:scale-105">
										Start Shopping
										<ArrowRight className="ml-2 inline" size={20} />
									</Button>
								</Link>
								<Link to="/login">
									<Button className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-bold text-lg rounded-xl border border-white/30 transition-all duration-300">
										Sign In
									</Button>
								</Link>
							</div>

							{/* Trust Badges */}
							<div className="flex items-center gap-6 justify-center lg:justify-start text-white/70 text-sm">
								<div className="flex items-center gap-2">
									<Shield size={18} className="text-green-400" />
									<span>Secure Checkout</span>
								</div>
								<div className="flex items-center gap-2">
									<Truck size={18} className="text-blue-400" />
									<span>Free Shipping</span>
								</div>
							</div>
						</div>

						{/* Hero Image Grid */}
						<div className="relative hidden lg:block">
							<div className="grid grid-cols-2 gap-4">
								{featuredProducts.slice(0, 4).map((product, idx) => (
									<div 
										key={product.id} 
										className={`relative rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-105 ${
											idx === 0 ? 'translate-y-8' : idx === 3 ? '-translate-y-8' : ''
										}`}
									>
										<img 
											src={product.image} 
											alt={product.name}
											className="w-full h-48 object-cover"
										/>
										<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
										<div className="absolute bottom-4 left-4 right-4">
											<p className="text-white font-semibold text-sm truncate">{product.name}</p>
											<p className="text-cyan-400 font-bold">${product.price}</p>
										</div>
									</div>
								))}
							</div>

							{/* Floating Stats Card */}
							<div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-2xl">
								<div className="flex items-center gap-4">
									<div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
										<TrendingUp className="text-white" size={24} />
									</div>
									<div>
										<p className="text-2xl font-bold text-gray-900">50K+</p>
										<p className="text-gray-500 text-sm">Products Available</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Stats Section */}
			<section className="relative -mt-12 z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="bg-white rounded-2xl shadow-xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
					{stats.map((stat, idx) => {
						const Icon = stat.icon;
						return (
							<div key={idx} className="text-center">
								<div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl mb-3">
									<Icon size={24} className="text-purple-600" />
								</div>
								<p className="text-3xl font-bold text-gray-900">{stat.label}</p>
								<p className="text-gray-500">{stat.value}</p>
							</div>
						);
					})}
				</div>
			</section>

			{/* Categories Section */}
			<section className="py-20 bg-gray-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-12">
						<h2 className="text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
						<p className="text-gray-600 text-lg">Browse our extensive collection of premium products</p>
					</div>

					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
						{categories.map((category, idx) => (
							<Link 
								key={idx} 
								to="/login"
								className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
							>
								<div className="aspect-[4/3]">
									<img 
										src={categoryImages[category] || categoryImages.electronics}
										alt={category}
										className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
									/>
								</div>
								<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
								<div className="absolute bottom-0 left-0 right-0 p-6">
									<h3 className="text-white text-xl font-bold capitalize mb-1">{category.replace('-', ' ')}</h3>
									<div className="flex items-center text-white/80 text-sm group-hover:text-cyan-400 transition-colors">
										<span>Shop Now</span>
										<ChevronRight size={16} className="ml-1 transform group-hover:translate-x-1 transition-transform" />
									</div>
								</div>
							</Link>
						))}
					</div>
				</div>
			</section>

			{/* Featured Products Section */}
			<section className="py-20 bg-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between mb-12">
						<div>
							<h2 className="text-4xl font-bold text-gray-900 mb-2">Featured Products</h2>
							<p className="text-gray-600">Handpicked items just for you</p>
						</div>
						<Link 
							to="/login" 
							className="hidden md:flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold transition-colors"
						>
							View All
							<ArrowRight size={20} />
						</Link>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
						{featuredProducts.slice(0, 8).map((product) => (
							<div 
								key={product.id} 
								className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
							>
								{/* Product Image */}
								<div className="relative aspect-square overflow-hidden bg-gray-100">
									<img 
										src={product.image}
										alt={product.name}
										className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
									/>
									{product.originalPrice && product.originalPrice > product.price && (
										<div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
											<Percent size={14} />
											{Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
										</div>
									)}
									<div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
										<button className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-red-50 transition-colors">
											<Heart size={20} className="text-gray-600 hover:text-red-500" />
										</button>
									</div>
								</div>

								{/* Product Info */}
								<div className="p-5">
									<p className="text-sm text-purple-600 font-medium capitalize mb-1">{product.category}</p>
									<h3 className="font-bold text-gray-900 mb-2 truncate">{product.name}</h3>
									
									{/* Rating */}
									<div className="flex items-center gap-2 mb-3">
										<div className="flex items-center">
											{[...Array(5)].map((_, i) => (
												<Star 
													key={i} 
													size={14} 
													className={i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
												/>
											))}
										</div>
										<span className="text-sm text-gray-500">({product.reviews})</span>
									</div>

									{/* Price */}
									<div className="flex items-center gap-2">
										<span className="text-xl font-bold text-gray-900">${product.price}</span>
										{product.originalPrice && product.originalPrice > product.price && (
											<span className="text-sm text-gray-400 line-through">${product.originalPrice}</span>
										)}
									</div>
								</div>
							</div>
						))}
					</div>

					<div className="mt-12 text-center md:hidden">
						<Link to="/login">
							<Button className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold">
								View All Products
							</Button>
						</Link>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="py-20 bg-gradient-to-b from-gray-50 to-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
						<p className="text-gray-600 text-lg">Experience shopping like never before</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						{features.map((feature, idx) => {
							const Icon = feature.icon;
							return (
								<div 
									key={idx} 
									className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
								>
									<div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
										<Icon size={32} className="text-white" />
									</div>
									<h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
									<p className="text-gray-600">{feature.description}</p>
								</div>
							);
						})}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="relative py-24 overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600"></div>
				<div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557821552-17105176677c?w=1920')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
				
				<div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<h2 className="text-5xl font-bold text-white mb-6">Ready to Start Shopping?</h2>
					<p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
						Join millions of satisfied customers and discover amazing deals every day. 
						Create your free account now and get 10% off your first order!
					</p>

					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Link to="/signup">
							<Button className="px-10 py-4 bg-white text-black hover:bg-gray-100 font-bold text-lg rounded-xl shadow-lg transition-all duration-300 hover:scale-105">
								Create Free Account
								<Sparkles className="ml-2 inline" size={20} />
							</Button>
						</Link>
						<Link to="/login">
							<Button className="px-10 py-4 bg-transparent border-2 border-white text-white hover:bg-white/10 font-bold text-lg rounded-xl transition-all duration-300">
								Sign In
							</Button>
						</Link>
					</div>

					{/* Newsletter */}
					<div className="mt-16 max-w-md mx-auto">
						<p className="text-white/80 mb-4">Subscribe for exclusive deals and updates</p>
						<div className="flex gap-2">
							<input
								type="email"
								placeholder="Enter your email"
								className="flex-1 px-5 py-3 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
							/>
							<Button className="px-6 py-3 bg-white text-black hover:bg-gray-100 font-semibold rounded-xl transition-colors">
								Subscribe
							</Button>
						</div>
					</div>
				</div>
			</section>

			{/* Footer */}
			<Footer />
		</div>
	);
};

export default Home;
