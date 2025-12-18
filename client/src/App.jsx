
/**
 * ========================================
 * App Component - Main Application Root
 * ========================================
 * 
 * This is the main application component that serves as the entry point
 * for the entire Offshore application. It manages routing, layout structure,
 * and global application state.
 * 
 * Features:
 * - Routes configuration and management
 * - Global header component
 * - Layout structure
 * - Error boundary ready
 * - Responsive design
 */

import './index.css';
import Header from './components/header.jsx';


/**
 * Main App Component
 * Configures all routes and renders the application layout
 */
const App = () => {
	return (
		
			<div className="min-h-screen flex flex-col bg-gray-50">
				{/* Header - Appears on all pages */}
				<Header />

				{/* Main Content Area */}
				<main className="flex-1 w-full">
				
				</main>

				{/* Footer */}
				<footer className="bg-gray-800 text-white text-center py-6 mt-12">
					<p>&copy; 2025 Offshore. All rights reserved.</p>
					<p className="text-sm text-gray-400 mt-2">Made with ❤️ by the Offshore Team</p>
				</footer>
			</div>
		
	);
};

export default App;
