/**
 * WishlistButton Component - Heart button for adding/removing from wishlist
 */

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { isInWishlist, toggleWishlist } from '../utils/wishlistService';

const WishlistButton = ({ product, userId, size = 'md', className = '' }) => {
  const [inWishlist, setInWishlist] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (userId && product?.id) {
      setInWishlist(isInWishlist(product.id));
    }
  }, [userId, product?.id]);

  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!userId) {
      alert('Please login to add items to your wishlist');
      return;
    }

    setAnimating(true);
    const result = await toggleWishlist(product);
    setInWishlist(result.added);
    
    setTimeout(() => setAnimating(false), 300);
  };

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24
  };

  return (
    <button
      onClick={handleToggle}
      className={`
        ${sizeClasses[size]}
        flex items-center justify-center rounded-full
        transition-all duration-200
        ${inWishlist 
          ? 'bg-red-50 dark:bg-red-900/30 text-red-500' 
          : 'bg-white/80 dark:bg-gray-800/80 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30'
        }
        ${animating ? 'scale-125' : 'scale-100'}
        shadow-sm backdrop-blur-sm
        ${className}
      `}
      title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart
        size={iconSizes[size]}
        fill={inWishlist ? 'currentColor' : 'none'}
        className={animating ? 'animate-pulse' : ''}
      />
    </button>
  );
};

export default WishlistButton;
