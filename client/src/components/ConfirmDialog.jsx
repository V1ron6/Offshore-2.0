/**
 * ConfirmDialog Component - Reusable confirmation modal
 */

import { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, Trash2, LogOut, X } from 'lucide-react';

const iconMap = {
  delete: Trash2,
  logout: LogOut,
  warning: AlertTriangle,
  default: AlertTriangle
};

const colorMap = {
  delete: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    icon: 'text-red-600 dark:text-red-400',
    button: 'bg-red-600 hover:bg-red-700'
  },
  logout: {
    bg: 'bg-orange-100 dark:bg-orange-900/30',
    icon: 'text-orange-600 dark:text-orange-400',
    button: 'bg-orange-600 hover:bg-orange-700'
  },
  warning: {
    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    icon: 'text-yellow-600 dark:text-yellow-400',
    button: 'bg-yellow-600 hover:bg-yellow-700'
  },
  default: {
    bg: 'bg-gray-100 dark:bg-gray-700',
    icon: 'text-gray-600 dark:text-gray-400',
    button: 'bg-gray-600 hover:bg-gray-700'
  }
};

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning', // 'delete', 'logout', 'warning', 'default'
  loading = false
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setIsAnimating(false);
    setTimeout(onClose, 150);
  }, [onClose]);

  const handleConfirm = async () => {
    await onConfirm();
    handleClose();
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  const Icon = iconMap[type] || iconMap.default;
  const colors = colorMap[type] || colorMap.default;

  return (
    <div 
      className={`fixed inset-0 z-100 flex items-center justify-center p-4 transition-opacity duration-150 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Dialog */}
      <div
        className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-150 ${
          isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
        >
          <X size={20} />
        </button>

        <div className="p-6">
          {/* Icon */}
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${colors.bg} flex items-center justify-center`}>
            <Icon className={colors.icon} size={32} />
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-2">
            {title}
          </h3>

          {/* Message */}
          <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
            {message}
          </p>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              disabled={loading}
              className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className={`flex-1 px-4 py-3 text-white rounded-xl font-semibold transition disabled:opacity-50 ${colors.button}`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </span>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
