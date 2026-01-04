/**
 * SuccessAnimation Component - Confetti and checkmark animations
 */

import { useEffect, useState } from 'react';
import { Check, PartyPopper } from 'lucide-react';

// Confetti particle
const ConfettiParticle = ({ delay, color, left }) => (
  <div
    className="absolute w-3 h-3 rounded-full animate-confetti"
    style={{
      backgroundColor: color,
      left: `${left}%`,
      animationDelay: `${delay}ms`,
      top: '-10px'
    }}
  />
);

// Confetti colors
const confettiColors = [
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
];

// Confetti burst effect
export const Confetti = ({ show = true, duration = 3000 }) => {
  const [particles, setParticles] = useState([]);
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    if (show) {
      // Generate random particles
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        delay: Math.random() * 500,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        left: Math.random() * 100
      }));
      setParticles(newParticles);
      setIsVisible(true);

      // Hide after duration
      const timer = setTimeout(() => setIsVisible(false), duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-200 overflow-hidden">
      {particles.map((particle) => (
        <ConfettiParticle key={particle.id} {...particle} />
      ))}
    </div>
  );
};

// Checkmark animation
export const CheckmarkAnimation = ({ show = true, size = 'lg' }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (show) {
      setIsAnimating(true);
    }
  }, [show]);

  if (!show) return null;

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-40 h-40'
  };

  const iconSizes = {
    sm: 32,
    md: 48,
    lg: 64,
    xl: 80
  };

  return (
    <div className={`${sizeClasses[size]} relative`}>
      {/* Circle */}
      <div
        className={`absolute inset-0 rounded-full bg-green-500 ${
          isAnimating ? 'animate-scale-in' : ''
        }`}
      />
      
      {/* Checkmark */}
      <div
        className={`absolute inset-0 flex items-center justify-center text-white ${
          isAnimating ? 'animate-checkmark' : 'opacity-0'
        }`}
      >
        <Check size={iconSizes[size]} strokeWidth={3} />
      </div>

      {/* Ripple effect */}
      {isAnimating && (
        <>
          <div className="absolute inset-0 rounded-full bg-green-400 animate-ripple opacity-50" />
          <div className="absolute inset-0 rounded-full bg-green-300 animate-ripple-delay opacity-30" />
        </>
      )}
    </div>
  );
};

// Success screen with animation
export const SuccessScreen = ({
  show = true,
  title = 'Success!',
  message = 'Your action was completed successfully.',
  showConfetti = true,
  onClose,
  autoClose = true,
  autoCloseDelay = 3000
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      
      if (autoClose && onClose) {
        const timer = setTimeout(() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }, autoCloseDelay);
        return () => clearTimeout(timer);
      }
    }
  }, [show, autoClose, autoCloseDelay, onClose]);

  if (!show) return null;

  return (
    <>
      {showConfetti && <Confetti show={show} />}
      
      <div
        className={`fixed inset-0 z-150 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div
          className={`bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center transform transition-all duration-300 ${
            isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
          }`}
        >
          <div className="flex justify-center mb-6">
            <CheckmarkAnimation show={show} size="lg" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {title}
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {message}
          </p>

          {onClose && !autoClose && (
            <button
              onClick={onClose}
              className="px-6 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition"
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </>
  );
};

// Celebration animation (Party popper)
export const CelebrationAnimation = ({ show = true }) => {
  if (!show) return null;

  return (
    <div className="flex items-center justify-center gap-4 animate-bounce">
      <PartyPopper className="text-yellow-500 animate-wiggle" size={32} />
      <span className="text-2xl">🎉</span>
      <PartyPopper className="text-yellow-500 animate-wiggle scale-x-[-1]" size={32} />
    </div>
  );
};

export default SuccessScreen;
