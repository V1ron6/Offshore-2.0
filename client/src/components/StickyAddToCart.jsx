/**
 * StickyAddToCart Component - Floating bar on product pages
 */

import { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, Check } from 'lucide-react';

const StickyAddToCart = ({ 
  product, 
  quantity, 
  onQuantityChange, 
  onAddToCart,
  show = true 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    if (!show) {
      setIsVisible(false);
      return;
    }

    const handleScroll = () => {
      // Show sticky bar after scrolling past 400px
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [show]);

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart();
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  if (!isVisible || !product) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 transform transition-transform duration-300 animate-slide-up">
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Product Info */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-2xl shrink-0 overflow-hidden">
                {product.image?.startsWith('http') ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  product.image
                )}
              </div>
              <div className="min-w-0">
                <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                  {product.name}
                </h4>
                <p className="text-red-600 dark:text-red-400 font-bold">
                  ${product.price?.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex items-center gap-3">
              {/* Quantity Selector */}
              <div className="hidden sm:flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                <button
                  onClick={() => onQuantityChange?.(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <Minus size={16} />
                </button>
                <span className="w-10 text-center font-semibold text-gray-900 dark:text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => onQuantityChange?.(Math.min(quantity + 1, product.stock || 10))}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={product.inStock === false}
                className={`px-6 py-2.5 rounded-lg font-bold text-white transition flex items-center gap-2 ${
                  addedToCart
                    ? 'bg-green-500'
                    : 'bg-linear-to-r from-red-500 to-orange-500 hover:shadow-lg'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {addedToCart ? (
                  <>
                    <Check size={20} className="animate-bounce" />
                    <span className="hidden sm:inline">Added!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart size={20} />
                    <span className="hidden sm:inline">Add to Cart</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickyAddToCart;
