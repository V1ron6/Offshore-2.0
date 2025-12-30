/**
 * CartMenu Component - Responsive shopping cart display
 */

import { useState, useEffect, useCallback } from 'react';
import { ShoppingCart, X, Plus, Minus, Trash2 } from 'lucide-react';
import { getCart, removeFromCart, updateQuantity, getCartTotal } from '../utils/cartService';

const CartMenu = ({ user = null, isDarkMode = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadCart = useCallback(() => {
    try {
      setLoading(true);
      const cartData = getCart(user?.id);
      setCart(cartData);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Load cart on mount and listen for updates
  useEffect(() => {
    if (user?.id) {
      loadCart();
      // Listen for cart updates from other pages
      const handleCartUpdate = () => {
        loadCart();
      };
      window.addEventListener('cartUpdated', handleCartUpdate);
      window.addEventListener('storage', handleCartUpdate);
      return () => {
        window.removeEventListener('cartUpdated', handleCartUpdate);
        window.removeEventListener('storage', handleCartUpdate);
      };
    }
  }, [user?.id, loadCart]);

  const handleRemove = (productId) => {
    removeFromCart(user?.id, productId);
    loadCart();
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity > 0) {
      updateQuantity(user?.id, productId, newQuantity);
      loadCart();
    }
  };

  const cartTotal = getCartTotal(cart);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="relative">
      {/* Cart Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 sm:p-2.5 transition duration-200 rounded-lg ${isDarkMode ? 'text-gray-300 hover:text-red-400 hover:bg-gray-800' : 'text-gray-600 hover:text-red-500 hover:bg-gray-100'}`}
        title="Shopping Cart"
      >
        <ShoppingCart size={20} sm:size={24} />
        {cartCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 sm:w-6 sm:h-6 bg-red-500 text-white text-xs sm:text-sm font-bold rounded-full flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </button>

      {/* Cart Dropdown */}
      {isOpen && (
        <div className={`absolute right-0 mt-2 w-full sm:w-80 md:w-96 rounded-lg shadow-2xl border z-40 max-h-96 sm:max-h-[500px] overflow-hidden flex flex-col ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          {/* Header */}
          <div className="bg-linear-to-r from-red-500 to-orange-500 text-white p-4 sm:p-5 flex justify-between items-center shrink-0">
            <h3 className="font-bold text-lg sm:text-xl">Shopping Cart</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-1 rounded transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Cart Items */}
          {loading ? (
            <div className="flex justify-center items-center py-8 sm:py-12 text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
            </div>
          ) : cart.length === 0 ? (
            <div className="flex flex-col justify-center items-center py-8 sm:py-12 px-4 text-center">
              <ShoppingCart size={40} className="text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium text-sm sm:text-base">Your cart is empty</p>
              <p className="text-gray-400 text-xs sm:text-sm mt-1">Add items to get started!</p>
            </div>
          ) : (
            <div className="overflow-y-auto flex-1">
              <div className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {cart.map(item => (
                  <div key={item.id} className={`p-3 sm:p-4 transition ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                    <div className="flex gap-3 sm:gap-4">
                      {/* Product Image */}
                      {item.image && (
                        <div className={`w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-lg overflow-hidden ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-semibold text-sm sm:text-base line-clamp-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                          {item.name}
                        </h4>
                        <p className="text-red-600 font-bold text-sm sm:text-base mt-1">
                          ${item.price.toFixed(2)}
                        </p>

                        {/* Quantity Controls */}
                        <div className={`flex items-center gap-2 mt-3 rounded-lg p-1 w-fit ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            className={`p-1 rounded transition ${isDarkMode ? 'hover:bg-gray-600 text-gray-300 hover:text-gray-100' : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'}`}
                          >
                            <Minus size={16} />
                          </button>
                          <span className={`w-8 text-center font-semibold text-sm ${isDarkMode ? 'text-gray-200' : ''}`}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            className={`p-1 rounded transition ${isDarkMode ? 'hover:bg-gray-600 text-gray-300 hover:text-gray-100' : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'}`}
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemove(item.id)}
                        className={`hover:text-red-700 p-2 rounded transition shrink-0 ${isDarkMode ? 'text-red-400 hover:bg-red-900/30' : 'text-red-500 hover:bg-red-50'}`}
                        title="Remove from cart"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    {/* Item Total */}
                    <div className={`text-right mt-2 text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                      Subtotal: ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          {cart.length > 0 && (
            <div className="bg-gray-50 border-t border-gray-200 p-4 sm:p-5 shrink-0">
              {/* Total */}
              <div className="mb-4 pb-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium text-sm sm:text-base">Total Items:</span>
                  <span className="font-bold text-sm sm:text-base">{cartCount}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-900 font-bold text-base sm:text-lg">Total Price:</span>
                  <span className="text-red-600 font-bold text-lg sm:text-xl">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 flex-col sm:flex-row">
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-900 rounded-lg font-semibold hover:bg-gray-300 transition text-sm sm:text-base"
                >
                  Continue Shopping
                </button>
                <button
                  className="flex-1 px-4 py-2.5 bg-linear-to-r from-red-500 to-orange-500 text-white rounded-lg font-semibold hover:shadow-lg transition text-sm sm:text-base"
                >
                  Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Overlay to close cart */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default CartMenu;
