/**
 * Toast Context and Hook
 * Separated for Fast Refresh compatibility
 */

import { createContext, useContext } from 'react';

// Toast Context
export const ToastContext = createContext(null);

// Custom hook to use toast
export const useToast = () => {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error('useToast must be used within a ToastProvider');
	}
	return context;
};
