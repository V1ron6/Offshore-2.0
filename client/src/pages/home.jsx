/**
 * ========================================
 * Welcome/Landing Page Component
 * ========================================
 * 
 * Landing page for the Offshore application.
 * Displays hero section, features, and call-to-action buttons.
 * Users see this page when they first visit - not logged in
 * 
 * Features:
 * - Hero banner
 * - Feature highlights
 * - Call-to-action buttons
 * - Responsive design
 * - Statistics showcase
 */

import { Link } from 'react-router-dom';
import { CheckCircle2, Zap, Lock, Smartphone } from 'lucide-react';
import Header from '../components/header.jsx';
// Import ShoppingCart at the top
import { ShoppingCart } from 'lucide-react';

/**
 * Home Component
 * Main landing/welcome page of the application
 */
const Home = () => {
	// Sample features data
	const features = [
		{
			id: 1,
			icon: CheckCircle2,
			title: 'Easy to Use',
			description: 'Simple and intuitive interface for managing your business'
		},
		{
			id: 2,
			icon: Zap,
			title: 'Fast Performance',
			description: 'Lightning-fast response times and smooth interactions'
		},
		{
			id: 3,
			icon: Lock,
			title: 'Secure',
			description: 'Your data is protected with industry-standard security'
		},
		{
			id: 4,
			icon: Smartphone,
			title: 'Responsive',
			description: 'Works seamlessly on desktop, tablet, and mobile devices'
		}
	];

	return (
		<div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
			{/* Header */}
			<Header />

			{/* Hero Section */}
			<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex-1">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
					{/* Hero Content */}
					<div className="space-y-6">
						<h1 className="text-5xl md:text-6xl font-bold text-gray-900">
							Welcome to <span className="text-red-500">Offshore</span>
						</h1>
						<p className="text-xl text-gray-600">
							Manage your e-commerce business efficiently with our powerful platform.
							Increase sales, manage inventory, and boost productivity.
						</p>

						{/* CTA Buttons */}
						<div className="flex flex-col sm:flex-row gap-4 pt-4">
							<Link
								to="/signup"
								className="px-8 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition transform hover:scale-105 text-center"
							>
								Get Started
							</Link>
							<Link
								to="/login"
								className="px-8 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition text-center"
							>
								Sign In
							</Link>
						</div>

						{/* Stats */}
						<div className="grid grid-cols-3 gap-4 pt-8">
							<div>
								<p className="text-3xl font-bold text-red-500">1K+</p>
								<p className="text-gray-600">Active Users</p>
							</div>
							<div>
								<p className="text-3xl font-bold text-red-500">10K+</p>
								<p className="text-gray-600">Products Sold</p>
							</div>
							<div>
								<p className="text-3xl font-bold text-red-500">99%</p>
								<p className="text-gray-600">Uptime</p>
							</div>
						</div>
					</div>

					{/* Hero Image */}
					<div className="flex items-center justify-center">
						<div className="w-full h-96 bg-gradient-to-br from-red-400 to-red-600 rounded-lg shadow-xl flex items-center justify-center">
							<div className="text-center text-white">
								<ShoppingCart size={80} className="mx-auto mb-4" />
								<p className="text-2xl font-bold">E-Commerce Made Easy</p>
								<p className="text-sm mt-2 opacity-90">Grow Your Business</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="bg-gray-900 text-white py-20">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<h2 className="text-4xl font-bold text-center mb-16">Why Choose Offshore?</h2>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						{features.map((feature) => {
							const IconComponent = feature.icon;
							return (
								<div
									key={feature.id}
									className="bg-gray-800 p-6 rounded-lg hover:transform hover:scale-105 transition duration-300 cursor-pointer"
								>
									<IconComponent size={40} className="mb-4 text-red-400" />
									<h3 className="text-xl font-bold mb-2">{feature.title}</h3>
									<p className="text-gray-400">{feature.description}</p>
								</div>
							);
						})}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="bg-red-500 text-white py-16">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
					<h2 className="text-4xl font-bold">Ready to Get Started?</h2>
					<p className="text-xl text-red-100">
						Join thousands of sellers who are already growing their business with Offshore
					</p>
					<Link
						to="/signup"
						className="inline-block px-8 py-4 bg-white text-red-500 rounded-lg font-bold hover:bg-red-50 transition transform hover:scale-105"
					>
						Create Free err Account
					</Link>
				</div>
			</section>

			{/* Footer */}
			<footer className="bg-gray-800 text-white text-center py-6 mt-12">
				<p>&copy; 2025 Offshore. All rights reserved.</p>
				<p className="text-sm text-gray-400 mt-2">Made with ❤️ by the Offshore Team</p>
			</footer>
		</div>
	);
};



export default Home;