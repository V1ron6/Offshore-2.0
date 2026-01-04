/**
 * Toast Notification Component
 * Provides user feedback for actions throughout the app
 */

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { ToastContext } from './ToastContext.jsx';

// Toast types with their styling
const toastTypes = {
	success: {
		icon: CheckCircle,
		bgColor: 'bg-green-50',
		borderColor: 'border-green-500',
		iconColor: 'text-green-500',
		textColor: 'text-green-800'
	},
	error: {
		icon: XCircle,
		bgColor: 'bg-red-50',
		borderColor: 'border-red-500',
		iconColor: 'text-red-500',
		textColor: 'text-red-800'
	},
	warning: {
		icon: AlertCircle,
		bgColor: 'bg-yellow-50',
		borderColor: 'border-yellow-500',
		iconColor: 'text-yellow-500',
		textColor: 'text-yellow-800'
	},
	info: {
		icon: Info,
		bgColor: 'bg-blue-50',
		borderColor: 'border-blue-500',
		iconColor: 'text-blue-500',
		textColor: 'text-blue-800'
	}
};

// Individual Toast Component
const Toast = ({ id, type = 'info', message, onClose, duration = 4000 }) => {
	const config = toastTypes[type] || toastTypes.info;
	const Icon = config.icon;

	useEffect(() => {
		if (duration > 0) {
			const timer = setTimeout(() => {
				onClose(id);
			}, duration);
			return () => clearTimeout(timer);
		}
	}, [id, duration, onClose]);

	return (
		<div
			className={`flex items-center gap-3 p-4 rounded-lg border-l-4 shadow-lg ${config.bgColor} ${config.borderColor} animate-slide-in`}
			role="alert"
		>
			<Icon className={`w-5 h-5 shrink-0 ${config.iconColor}`} />
			<p className={`flex-1 text-sm font-medium ${config.textColor}`}>{message}</p>
			<button
				onClick={() => onClose(id)}
				className={`p-1 rounded-full hover:bg-black/5 transition-colors ${config.textColor}`}
				aria-label="Close notification"
			>
				<X className="w-4 h-4" />
			</button>
		</div>
	);
};

// Toast Container Component
const ToastContainer = ({ toasts, removeToast }) => {
	return (
		<div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
			{toasts.map((toast) => (
				<div key={toast.id} className="pointer-events-auto">
					<Toast {...toast} onClose={removeToast} />
				</div>
			))}
		</div>
	);
};

// Toast Provider Component
export const ToastProvider = ({ children }) => {
	const [toasts, setToasts] = useState([]);

	const addToast = (type, message, duration = 4000) => {
		const id = Date.now() + Math.random();
		setToasts((prev) => [...prev, { id, type, message, duration }]);
		return id;
	};

	const removeToast = (id) => {
		setToasts((prev) => prev.filter((toast) => toast.id !== id));
	};

	const toast = {
		success: (message, duration) => addToast('success', message, duration),
		error: (message, duration) => addToast('error', message, duration),
		warning: (message, duration) => addToast('warning', message, duration),
		info: (message, duration) => addToast('info', message, duration),
		remove: removeToast,
		clear: () => setToasts([])
	};

	return (
		<ToastContext.Provider value={toast}>
			{children}
			<ToastContainer toasts={toasts} removeToast={removeToast} />
		</ToastContext.Provider>
	);
};

export default Toast;
