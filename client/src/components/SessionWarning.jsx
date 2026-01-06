import { AlertCircle, Clock, LogOut, RotateCcw } from 'lucide-react';

/**
 * SessionWarning Component
 * Displays session timeout warning modal with countdown timer
 */
const SessionWarning = ({ 
	isVisible, 
	timeRemaining, 
	onContinueSession, 
	onLogout 
}) => {
	const formatTime = (seconds) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	};

	if (!isVisible) return null;

	return (
		<>
			{/* Backdrop */}
			<div className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"></div>

			{/* Modal */}
			<div className="fixed inset-0 flex items-center justify-center z-50 p-4">
				<div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl max-w-md w-full animate-in fade-in slide-in-from-center duration-300">
					{/* Header */}
					<div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 rounded-t-lg flex items-center gap-3">
						<AlertCircle className="w-6 h-6 text-white" />
						<h2 className="text-xl font-bold text-white">Session Timeout Warning</h2>
					</div>

					{/* Content */}
					<div className="p-6 space-y-4">
						<p className="text-gray-700 dark:text-gray-300 text-base">
							Your session is about to expire due to inactivity. You will be automatically logged out in:
						</p>

						{/* Timer Display */}
						<div className="bg-amber-50 dark:bg-gray-800 border-2 border-amber-300 dark:border-amber-600 rounded-lg p-4 text-center">
							<div className="flex items-center justify-center gap-2 mb-2">
								<Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
								<span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
									Time Remaining
								</span>
							</div>
							<div className="text-4xl font-bold text-amber-600 dark:text-amber-400 font-mono">
								{formatTime(timeRemaining)}
							</div>
						</div>

						<p className="text-sm text-gray-600 dark:text-gray-400 text-center">
							Click "Continue Session" to stay logged in or you will be logged out automatically.
						</p>
					</div>

					{/* Actions */}
					<div className="flex gap-3 p-6 bg-gray-50 dark:bg-gray-800 rounded-b-lg border-t border-gray-200 dark:border-gray-700">
						<button
							onClick={onLogout}
							className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors duration-200"
						>
							<LogOut className="w-4 h-4" />
							Logout Now
						</button>
						<button
							onClick={onContinueSession}
							className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors duration-200"
						>
							<RotateCcw className="w-4 h-4" />
							Continue Session
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default SessionWarning;
