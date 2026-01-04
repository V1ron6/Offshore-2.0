/**
 * ProductQuickView Component - Modal preview without leaving page
 */

import { useState, useEffect, useCallback } from 'react';
import { X, Star, ShoppingCart, Heart, Plus, Minus, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import WishlistButton from './WishlistButton';

const ProductQuickView = ({ product, isOpen, onClose, onAddToCart, userId }) => {
  const [quantity, setQuantity] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      setQuantity(1);
      setAddedToCart(false);
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
    setTimeout(onClose, 200);
  }, [onClose]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, handleClose]);

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  const incrementQuantity = () => setQuantity(prev => Math.min(prev + 1, product?.stock || 10));
  const decrementQuantity = () => setQuantity(prev => Math.max(prev - 1, 1));

  if (!isOpen || !product) return null;

  return (
    <div
      className={`fixed inset-0 z-100 flex items-center justify-center p-4 transition-opacity duration-200 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden transform transition-all duration-200 ${
          isAnimating ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 dark:bg-gray-700/80 rounded-full text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 transition shadow-md"
        >
          <X size={20} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Section */}
          <div className="relative bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 p-8 flex items-center justify-center min-h-[300px] md:min-h-[400px]">
            {product.image?.startsWith('http') ? (
              <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain animate-float" />
            ) : (
              <div className="text-8xl md:text-9xl animate-float">{product.image}</div>
            )}
            
            {/* Wishlist Button */}
            <div className="absolute top-4 left-4">
              <WishlistButton product={product} userId={userId} size="md" />
            </div>

            {/* Stock Badge */}
            <div className="absolute bottom-4 left-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                product.inStock !== false
                  ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400'
                  : 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400'
              }`}>
                {product.inStock !== false ? '✓ In Stock' : '✗ Out of Stock'}
              </span>
            </div>
          </div>

          {/* Details Section */}
          <div className="p-6 md:p-8 overflow-y-auto max-h-[400px] md:max-h-none">
            {/* Category */}
            <p className="text-sm text-red-500 dark:text-red-400 font-medium mb-2 uppercase tracking-wide">
              {product.category}
            </p>

            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              {product.name}
            </h2>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={`${
                      i < Math.floor(product.rating || 4)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600 dark:text-gray-400">
                {product.rating || 4.5} ({product.reviews || 0} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-red-600 dark:text-red-400">
                ${product.price?.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-gray-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3">
                {product.description}
              </p>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-gray-700 dark:text-gray-300 font-medium">Quantity:</span>
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                <button
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <Minus size={18} />
                </button>
                <span className="w-12 text-center font-semibold text-gray-900 dark:text-white">
                  {quantity}
                </span>
                <button
                  onClick={incrementQuantity}
                  disabled={quantity >= (product.stock || 10)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={product.inStock === false}
                className={`w-full py-3 rounded-xl font-bold text-white transition flex items-center justify-center gap-2 ${
                  addedToCart
                    ? 'bg-green-500'
                    : 'bg-linear-to-r from-red-500 to-orange-500 hover:shadow-lg hover:scale-[1.02]'
                } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
              >
                {addedToCart ? (
                  <>
                    <span className="animate-bounce">✓</span> Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart size={20} />
                    Add to Cart - ${(product.price * quantity).toFixed(2)}
                  </>
                )}
              </button>

              <Link
                to={`/product/${product.id}`}
                onClick={handleClose}
                className="w-full py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl font-semibold text-gray-700 dark:text-gray-300 hover:border-red-500 hover:text-red-500 dark:hover:border-red-400 dark:hover:text-red-400 transition flex items-center justify-center gap-2"
              >
                View Full Details
                <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductQuickView;
