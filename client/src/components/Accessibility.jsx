/**
 * Accessibility Components - Skip link, focus indicators
 */

/* eslint-disable react-refresh/only-export-components */

import { useEffect, useRef, useState } from 'react';

// Skip to main content link
export const SkipToContent = ({ targetId = 'main-content' }) => {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-200 focus:px-4 focus:py-2 focus:bg-red-500 focus:text-white focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 transition"
    >
      Skip to main content
    </a>
  );
};

// Focus trap for modals
export const FocusTrap = ({ children, isActive = true }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus first element
    firstElement?.focus();

    const handleKeyDown = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [isActive]);

  return <div ref={containerRef}>{children}</div>;
};

// Announce to screen readers
export const ScreenReaderAnnounce = ({ message, priority = 'polite' }) => {
  return (
    <div
      role="status"
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
};

// Hook for screen reader announcements
export const useAnnounce = () => {
  const [announcement, setAnnouncement] = useState('');

  const announce = (message, delay = 100) => {
    setAnnouncement('');
    setTimeout(() => setAnnouncement(message), delay);
  };

  return { announcement, announce };
};

// Visually hidden but accessible
// eslint-disable-next-line no-unused-vars
export const VisuallyHidden = ({ children, as: Tag = 'span' }) => {
  return (
    <Tag className="sr-only">
      {children}
    </Tag>
  );
};

// Focus ring styles (use as className helper)
export const focusRingStyles = {
  default: 'focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
  inset: 'focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500',
  none: 'focus:outline-none',
};

// Accessible icon button
export const IconButton = ({
  // eslint-disable-next-line no-unused-vars
  icon: IconComponent,
  label,
  onClick,
  className = '',
  size = 20,
  ...props
}) => {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${className}`}
      aria-label={label}
      title={label}
      {...props}
    >
      <IconComponent size={size} aria-hidden="true" />
    </button>
  );
};

// Loading state with announcement
export const LoadingIndicator = ({ 
  isLoading, 
  message = 'Loading...', 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  if (!isLoading) return null;

  return (
    <div role="status" aria-live="polite" className="flex items-center gap-3">
      <svg
        className={`animate-spin text-red-500 ${sizeClasses[size]}`}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
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
      <span className="sr-only">{message}</span>
    </div>
  );
};

// Progress bar with announcement
export const ProgressBar = ({ 
  value, 
  max = 100, 
  label = 'Progress',
  showLabel = true,
  className = ''
}) => {
  const percentage = Math.round((value / max) * 100);

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600 dark:text-gray-400">{label}</span>
          <span className="text-gray-900 dark:text-white font-medium">{percentage}%</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={`${label}: ${percentage}%`}
        className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
      >
        <div
          className="h-full bg-red-500 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default {
  SkipToContent,
  FocusTrap,
  ScreenReaderAnnounce,
  useAnnounce,
  VisuallyHidden,
  focusRingStyles,
  IconButton,
  LoadingIndicator,
  ProgressBar
};
