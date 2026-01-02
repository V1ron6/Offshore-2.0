import offShoreLogo from '../assets/offShoreLogo.jpg';

/**
 * ========================================
 * Loading Spinner Component
 * ========================================
 * 
 * Animated loading spinner with bouncing logo.
 * Smaller alternative to full LoadingScreen.
 * 
 * Props:
 * - message: string - Optional loading message
 * 
 * USAGE:
 * Show inline loading indicator while data loads or processing.
 * 
 * Example:
 * {isLoading ? (
 *   <LoadingSpinner message="Loading your orders..." />
 * ) : (
 *   <OrdersList orders={orders} />
 * )}
 * 
 * // In components with async operations:
 * <div className="space-y-4">
 *   {loadingItems.length > 0 && <LoadingSpinner message="Updating..." />}
 *   <ProductList items={items} />
 * </div>
 */

const LoadingSpinner = ({ 
	message = 'Loading...'
}) => {
	return (
		<div className="flex flex-col items-center justify-center py-8 w-full px-4">
			<style>{`
				@keyframes bounce-gentle {
					0%, 100% {
						transform: translateY(0);
					}
					50% {
						transform: translateY(-20px);
					}
				}
				.logo-bounce {
					animation: bounce-gentle 2s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
				}
				@keyframes float-glow {
					0%, 100% {
						box-shadow: 0 0 20px rgba(59, 130, 246, 0.3), 0 0 40px rgba(59, 130, 246, 0.1);
					}
					50% {
						box-shadow: 0 0 30px rgba(59, 130, 246, 0.5), 0 0 60px rgba(59, 130, 246, 0.2);
					}
				}
				.logo-glow {
					animation: float-glow 2s ease-in-out infinite;
				}
			`}</style>

			{/* Bouncing Logo */}
			<div className="logo-bounce logo-glow">
				<img 
					src={offShoreLogo} 
					alt="Loading..." 
					className="w-24 h-24 rounded-full object-cover shadow-lg"
				/>
			</div>

			{/* Loading Message */}
			{message && (
				<div className="mt-6 text-center">
					<p className="text-gray-600 dark:text-gray-300 font-medium text-sm sm:text-base">{message}</p>
					<div className="mt-3 flex justify-center gap-1">
						<span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
						<span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
						<span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
					</div>
				</div>
			)}
		</div>
	);
};

export default LoadingSpinner;
