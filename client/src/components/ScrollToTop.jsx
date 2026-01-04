/**
 * ScrollToTop Component - Floating button to scroll back to top
 */

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const ScrollToTop = ({ threshold = 300 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > threshold);
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-50 p-3 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 hover:scale-110 active:scale-95 transition-all duration-200 animate-fade-in-up"
      aria-label="Scroll to top"
    >
      <ArrowUp size={24} />
    </button>
  );
};

export default ScrollToTop;
