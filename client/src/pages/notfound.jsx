/**
 * ========================================
 * 404 Not Found Page Component
 * ========================================
 * 
 * Page displayed when user tries to access a non-existent route.
 * Provides helpful navigation back to home page.
 * 
 * Features:
 * - 404 error message
 * - Animated display
 * - Home link
 * - Helpful suggestions
 * - Responsive design
 */

import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, Home } from 'lucide-react';

/**
 * NotFound Component
 * 404 error page
 */
const NotFound = () => {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200 px-4">
			<div className="text-center max-w-lg">
				{/* 404 Graphic */}
				<div className="mb-8 flex justify-center">
					<AlertTriangle size={120} className="text-red-500 animate-bounce" />
				</div>

				{/* Error Message */}
				<h2 className="text-5xl font-bold text-gray-900 mb-4">
					Page Not Found
				</h2>

				<p className="text-xl text-gray-600 mb-8">
					Sorry, the page you're looking for doesn't exist or has been moved.
				</p>

				{/* Helpful Suggestions */}
				<div className="bg-white rounded-lg shadow-md p-6 mb-8">
					<h3 className="font-semibold text-gray-900 mb-4 flex items-center justify-center space-x-2">
						<AlertTriangle size={20} className="text-yellow-500" />
						<span>What you can do:</span>
					</h3>
					<ul className="text-left space-y-2 text-gray-700">
						<li className="flex items-center space-x-2">
							<span className="text-red-500">•</span>
							<span>Check the URL for typos</span>
						</li>
						<li className="flex items-center space-x-2">
							<span className="text-red-500">•</span>
							<span>Go back to the previous page</span>
						</li>
						<li className="flex items-center space-x-2">
							<span className="text-red-500">•</span>
							<span>Return to the home page</span>
						</li>
						<li className="flex items-center space-x-2">
							<span className="text-red-500">•</span>
							<span>Contact support if you think this is a mistake</span>
						</li>
					</ul>
				</div>

				{/* Action Buttons */}
				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<button
						onClick={() => window.history.back()}
						className="px-8 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition font-semibold flex items-center justify-center space-x-2"
					>
						<ArrowLeft size={18} />
						<span>Go Back</span>
					</button>
					<Link
						to="/"
						className="px-8 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold inline-flex items-center justify-center space-x-2"
					>
						<Home size={18} />
						<span>Home Page</span>
					</Link>
				</div>

				{/* Fun Message */}
				<p className="text-sm text-gray-500 mt-8">
					Error code: 404 | I Think You Are Lost
				</p>
			</div>
		</div>
	);
};

export default NotFound;