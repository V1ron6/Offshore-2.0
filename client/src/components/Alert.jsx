/**
 * ========================================
 * Alert Component
 * ========================================
 * 
 * Reusable alert component for displaying
 * success, error, warning, and info messages.
 * 
 * Props:
 * - type: 'success' | 'error' | 'warning' | 'info'
 * - message: string - Alert message
 * - onClose: function - Callback when alert closes
 * - dismissible: boolean - Can user close alert
 * 
 * USAGE:
 * Use this component to display contextual feedback messages to users.
 * 
 * Example:
 * <Alert 
 *   type="success" 
 *   message="Product added to cart successfully!" 
 *   dismissible={true}
 *   onClose={() => setShowAlert(false)}
 * />
 * 
 * <Alert 
 *   type="error" 
 *   message="Failed to complete payment. Please try again."
 *   dismissible={true}
 * />
 * 
 * <Alert 
 *   type="warning" 
 *   message="This product is running low on stock"
 *   dismissible={false}
 * />
 */

import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

const Alert = ({ 
	type = 'info', 
	message, 
	onClose, 
	dismissible = true,
	className = '' 
}) => {
	const alertStyles = {
		success: {
			bg: 'bg-green-100',
			border: 'border-l-4 border-green-500',
			text: 'text-green-700',
			icon: CheckCircle
		},
		error: {
			bg: 'bg-red-100',
			border: 'border-l-4 border-red-500',
			text: 'text-red-700',
			icon: AlertCircle
		},
		warning: {
			bg: 'bg-yellow-100',
			border: 'border-l-4 border-yellow-500',
			text: 'text-yellow-700',
			icon: AlertTriangle
		},
		info: {
			bg: 'bg-blue-100',
			border: 'border-l-4 border-blue-500',
			text: 'text-blue-700',
			icon: Info
		}
	};

	const style = alertStyles[type] || alertStyles.info;
	const IconComponent = style.icon;

	return (
		<div 
			className={`
				${style.bg} ${style.border} ${style.text} 
				p-4 rounded-md mb-4 flex items-start justify-between
				${className}
			`}
			role="alert"
			aria-live="polite"
		>
			<div className="flex items-start">
				<IconComponent size={20} className="mr-3 mt-0.5 flex-shrink-0" />
				<span>{message}</span>
			</div>
			{dismissible && onClose && (
				<button
					onClick={onClose}
					className="ml-3 text-current hover:opacity-70 transition"
					aria-label="Close alert"
				>
					<X size={20} />
				</button>
			)}
		</div>
	);
};

export default Alert;
