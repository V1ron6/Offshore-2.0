/**
 * ========================================
 * Loading Spinner Component
 * ========================================
 * 
 * Animated loading spinner for async operations.
 * 
 * Props:
 * - size: 'sm' | 'md' | 'lg' - Spinner size
 * - color: string - Tailwind color class
 * - message: string - Optional loading message
 */

const LoadingSpinner = ({ 
	size = 'md', 
	color = 'text-blue-500',
	message = 'Loading...'
}) => {
	const sizeClasses = {
		sm: 'w-6 h-6',
		md: 'w-10 h-10',
		lg: 'w-16 h-16'
	};

	return (
		<div className="flex flex-col items-center justify-center py-8">
			<div className={`${sizeClasses[size]} ${color} animate-spin`}>
				<svg 
					className="w-full h-full" 
					xmlns="http://www.w3.org/2000/svg" 
					fill="none" 
					viewBox="0 0 24 24"
				>
					<circle 
						className="opacity-25" 
						cx="12" 
						cy="12" 
						r="10" 
						stroke="currentColor" 
						strokeWidth="4"
					/>
					<path 
						className="opacity-75" 
						fill="currentColor" 
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					/>
				</svg>
			</div>
			{message && <p className="mt-4 text-gray-600 font-medium">{message}</p>}
		</div>
	);
};

export default LoadingSpinner;
