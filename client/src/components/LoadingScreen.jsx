
const LoadingScreen = ({ message = "Loading", submessage = "Please wait..." }) => {
	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
			<div className="text-center">
				{/* Minimalistic Loading Spinner */}
				<div className="mb-8">
					<div className="relative w-16 h-16 mx-auto">
						<div className="absolute inset-0 rounded-full border-2 border-gray-200"></div>
						<div className="absolute inset-0 rounded-full border-2 border-transparent border-t-red-500 border-r-red-500 animate-spin"></div>
					</div>
				</div>

				{/* Loading Text */}
				<h2 className="text-xl font-semibold text-gray-800 mb-2">{message}</h2>
				<p className="text-gray-500 text-sm">{submessage}</p>

				{/* Animated Dots */}
				<div className="mt-6 flex justify-center gap-2">
					<div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
					<div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
					<div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
				</div>
			</div>
		</div>
	);
};

export default LoadingScreen;
