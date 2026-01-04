/**
 * PageTransition Component - Animated route changes
 */

import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

// Fade transition wrapper
export const FadeTransition = ({ children }) => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState('fadeIn');

  useEffect(() => {
    if (location !== displayLocation) {
      setTransitionStage('fadeOut');
    }
  }, [location, displayLocation]);

  const handleAnimationEnd = () => {
    if (transitionStage === 'fadeOut') {
      setTransitionStage('fadeIn');
      setDisplayLocation(location);
    }
  };

  return (
    <div
      className={`transition-opacity duration-200 ${
        transitionStage === 'fadeIn' ? 'opacity-100' : 'opacity-0'
      }`}
      onTransitionEnd={handleAnimationEnd}
    >
      {children}
    </div>
  );
};

// Slide transition wrapper
export const SlideTransition = ({ children, direction = 'right' }) => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [isEntering, setIsEntering] = useState(true);

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setIsEntering(false);
      setTimeout(() => {
        setDisplayLocation(location);
        setIsEntering(true);
      }, 200);
    }
  }, [location, displayLocation]);

  const directionClasses = {
    right: isEntering ? 'animate-slide-in-right' : 'animate-slide-out-left',
    left: isEntering ? 'animate-slide-in-left' : 'animate-slide-out-right',
    up: isEntering ? 'animate-slide-in-up' : 'animate-slide-out-down',
    down: isEntering ? 'animate-slide-in-down' : 'animate-slide-out-up',
  };

  return (
    <div className={directionClasses[direction]}>
      {children}
    </div>
  );
};

// Scale transition wrapper  
export const ScaleTransition = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    return () => setIsVisible(false);
  }, []);

  return (
    <div
      className={`transform transition-all duration-300 ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}
    >
      {children}
    </div>
  );
};

// Page wrapper with transition
export const PageWrapper = ({ children, className = '' }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Scroll to top on page change
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <main
      id="main-content"
      className={`min-h-screen transition-all duration-300 ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      } ${className}`}
    >
      {children}
    </main>
  );
};

// Stagger children animation
export const StaggerContainer = ({ children, staggerDelay = 100 }) => {
  return (
    <div className="stagger-container">
      {Array.isArray(children)
        ? children.map((child, index) => (
            <div
              key={index}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * staggerDelay}ms` }}
            >
              {child}
            </div>
          ))
        : children}
    </div>
  );
};

export default PageWrapper;
