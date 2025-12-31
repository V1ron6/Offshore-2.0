/**
 * ========================================
 * Welcome/Landing Page Component
 * ========================================
 * 
 * Professional e-commerce landing page inspired by Amazon
 * Features hero section, product showcase, trust signals
 * Logged-in users are redirected to dashboard
 */

import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Zap, Shield, Truck, RotateCcw, Star, TrendingUp, Users, DollarSign } from 'lucide-react';
import Button from '../components/Button.jsx';
import LoadingScreen  from '../components/LoadingScreen.jsx'
const Home = () => {
	const navigate = useNavigate();

	useEffect(() => {
		// Redirect logged-in users to dashboard
		const userData = JSON.parse(localStorage.getItem('user') || 'null');
		if (userData && userData.id) {
			navigate('/app');
		}
	}, [navigate]);

	const features = [
		{
			icon: Truck,
			title: 'Fast Shipping',
			description: 'Free delivery on orders over $50'
		},
		{
			icon: RotateCcw,
			title: '30-Day Returns',
			description: 'Easy returns, no questions asked'
		},
		{
			icon: Shield,
			title: 'Secure Shopping',
			description: 'Your data is 100% protected'
		},
		{
			icon: Star,
			title: '4.8/5 Rating',
			description: 'Trusted by 100K+ customers'
		}
	];

	const stats = [
		{ label: '50K+', value: 'Products' },
		{ label: '100K+', value: 'Happy Customers' },
		{ label: '99.9%', value: 'Uptime' },
		{ label: '24/7', value: 'Support' }
	];

	const categories = [
		{ name: 'Electronics', emoji: '📱', count: '5.2K' },
		{ name: 'Accessories', emoji: '🎧', count: '3.1K' },
		{ name: 'Home & Garden', emoji: '🏡', count: '2.8K' },
		{ name: 'Sports', emoji: '⚽', count: '1.9K' }
	];

	return (
		<div className="min-h-screen bg-white">
			{/* Navigation */}
			<nav className="bg-gradient-to-r from-red-600 to-red-500 text-white sticky top-0 z-50 shadow-lg">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						<h1 className="text-3xl font-bold">OFFSHORE</h1>
						<div className="flex gap-4">
							<Link to="/login">
								<Button variant="secondary" size="sm">
									Sign In
								</Button>
							</Link>
							<Link to="/signup">
								<Button variant="danger" size="sm" className="bg-yellow-400 text-red-600 hover:bg-yellow-300">
									Get Started
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</nav>

			{/* Hero Section */}
			<section className="bg-gradient-to-r from-red-50 to-orange-50 border-b-4 border-red-500">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
						{/* Hero Content */}
						<div className="space-y-8">
							<div>
								<h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
									Shop Everything You Love
								</h2>
								<p className="text-xl text-gray-700">
									Discover millions of products from trusted sellers. Free shipping, great prices, and exceptional quality on every purchase.
								</p>
							</div>

							{/* Quick Stats */}
							<div className="grid grid-cols-2 gap-6">
								{stats.map((stat, idx) => (
									<div key={idx} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
										<p className="text-2xl font-bold text-red-600">{stat.label}</p>
										<p className="text-gray-600">{stat.value}</p>
									</div>
								))}
							</div>

							{/* CTA Buttons */}
							<div className="flex flex-col sm:flex-row gap-4">
								<Link to="/signup" className="w-full sm:w-auto">
									<Button variant="danger" fullWidth size="lg" className="py-4 text-lg">
										Create Account & Start Shopping
									</Button>
								</Link>
								<Link to="/login" className="w-full sm:w-auto">
									<Button variant="secondary" fullWidth size="lg" className="py-4 text-lg border-2 border-gray-300">
										Sign In
									</Button>
								</Link>
							</div>
						</div>

						{/* Hero Image */}
						<div className="relative">
							<div className="bg-gradient-to-br from-red-400 via-red-500 to-orange-500 rounded-2xl p-8 shadow-2xl">
								<div className="grid grid-cols-3 gap-4 opacity-90">
									<div className="text-6xl">🛍️</div>
									<div className="text-6xl">📱</div>
									<div className="text-6xl">⚡</div>
									<div className="text-6xl">🎧</div>
									<div className="text-6xl">💎</div>
									<div className="text-6xl">🎮</div>
									<div className="text-6xl">📚</div>
									<div className="text-6xl">🎨</div>
									<div className="text-6xl">🌟</div>
								</div>
							</div>
							<div className="absolute bottom-0 right-0 bg-white rounded-full p-6 shadow-lg transform translate-y-4 translate-x-4">
								<div className="text-center">
									<p className="text-2xl font-bold text-red-600">50K+</p>
									<p className="text-sm text-gray-600">Products</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Trust Features */}
			<section className="py-16 bg-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<h2 className="text-4xl font-bold text-center mb-16 text-gray-900">Why Shop With Us?</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						{features.map((feature, idx) => {
							const Icon = feature.icon;
							return (
								<div key={idx} className="text-center">
									<div className="bg-gradient-to-br from-red-100 to-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
										<Icon size={32} className="text-red-600" />
									</div>
									<h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
									<p className="text-gray-600">{feature.description}</p>
								</div>
							);
						})}
					</div>
				</div>
			</section>

			{/* Browse Categories */}
			<section className="py-16 bg-gradient-to-b from-gray-50 to-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<h2 className="text-4xl font-bold text-center mb-4 text-gray-900">Popular Categories</h2>
					<p className="text-center text-gray-600 mb-12">Browse our extensive collection</p>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						{categories.map((cat, idx) => (
							<div key={idx} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition group cursor-pointer">
								<div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center group-hover:scale-110 transition">
									<span className="text-7xl">{cat.emoji}</span>
								</div>
								<div className="p-4">
									<h3 className="font-bold text-lg text-gray-900">{cat.name}</h3>
									<p className="text-sm text-gray-600">{cat.count} products</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Call to Action Section */}
			<section className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-20">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
					<div>
						<h2 className="text-5xl font-bold mb-4">Ready to Get Started?</h2>
						<p className="text-xl text-gray-300 mb-8">
							Join millions of shoppers and find everything you need in one place
						</p>
					</div>

					{/* Newsletter Signup */}
					<div className="max-w-md mx-auto">
						<div className="flex gap-2">
							<input
								type="email"
								placeholder="Enter your email"
								className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
							/>
							<Button variant="danger" className="px-8 py-3">
								Subscribe
							</Button>
						</div>
						<p className="text-sm text-gray-400 mt-2">Get exclusive deals and offers</p>
					</div>

					<div className="flex gap-4 justify-center flex-wrap pt-4">
						<Link to="/signup">
							<Button className="px-8 py-3 bg-red-600 text-white hover:bg-red-700 rounded-lg font-bold text-lg">
								Create Free Account
							</Button>
						</Link>
						<Link to="/login">
							<Button className="px-8 py-3 bg-gray-700 text-white hover:bg-gray-600 rounded-lg font-bold text-lg">
								Sign In
							</Button>
						</Link>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="bg-gray-900 text-gray-400 border-t border-gray-800">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
						<div>
							<h4 className="text-white font-bold mb-4">About ShopHub</h4>
							<ul className="space-y-2 text-sm">
								<li><a href="#" className="hover:text-white transition">About Us</a></li>
								<li><a href="#" className="hover:text-white transition">Careers</a></li>
								<li><a href="#" className="hover:text-white transition">Blog</a></li>
							</ul>
						</div>
						<div>
							<h4 className="text-white font-bold mb-4">Customer Service</h4>
							<ul className="space-y-2 text-sm">
								<li><a href="#" className="hover:text-white transition">Contact Us</a></li>
								<li><a href="#" className="hover:text-white transition">Returns</a></li>
								<li><a href="#" className="hover:text-white transition">Shipping Info</a></li>
							</ul>
						</div>
						<div>
							<h4 className="text-white font-bold mb-4">Policies</h4>
							<ul className="space-y-2 text-sm">
								<li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
								<li><a href="#" className="hover:text-white transition">Terms & Conditions</a></li>
								<li><a href="#" className="hover:text-white transition">Security</a></li>
							</ul>
						</div>
						<div>
							<h4 className="text-white font-bold mb-4">Follow Us</h4>
							<ul className="space-y-2 text-sm">
								<li><a href="#" className="hover:text-white transition">Facebook</a></li>
								<li><a href="#" className="hover:text-white transition">Twitter</a></li>
								<li><a href="#" className="hover:text-white transition">Instagram</a></li>
							</ul>
						</div>
					</div>

					<div className="border-t border-gray-800 pt-8 text-center">
						<p>&copy; 2025 ShopHub. All rights reserved.</p>
						<p className="text-sm mt-2">Made with ❤️ for smart shoppers</p>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default Home;
