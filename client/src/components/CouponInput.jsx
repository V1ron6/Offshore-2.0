/**
 * CouponInput Component - Apply discount codes
 */

import { useState } from 'react';
import { Tag, Check, X, Loader } from 'lucide-react';
import apiClient from '../utils/apiClient';

const CouponInput = ({ subtotal, onCouponApplied, appliedCoupon = null }) => {
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setError('Please enter a coupon code');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await apiClient.post('/api/coupons/validate', {
        code: couponCode.trim().toUpperCase(),
        orderTotal: subtotal
      });

      if (response.data.valid) {
        const coupon = response.data.coupon;
        setSuccess(`Coupon applied! You save $${response.data.discount.toFixed(2)}`);
        setCouponCode('');
        
        if (onCouponApplied) {
          onCouponApplied({
            code: coupon.code,
            discount: response.data.discount,
            type: coupon.discountType,
            value: coupon.discountValue
          });
        }
      } else {
        setError(response.data.message || 'Invalid coupon code');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to validate coupon');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    if (onCouponApplied) {
      onCouponApplied(null);
    }
    setSuccess('');
    setError('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleApplyCoupon();
    }
  };

  // If coupon is already applied
  if (appliedCoupon) {
    return (
      <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
              <Check className="text-green-600 dark:text-green-400" size={16} />
            </div>
            <div>
              <p className="font-medium text-green-800 dark:text-green-300">
                {appliedCoupon.code}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400">
                -${appliedCoupon.discount.toFixed(2)} discount applied
              </p>
            </div>
          </div>
          <button
            onClick={handleRemoveCoupon}
            className="p-1.5 text-green-600 dark:text-green-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition"
            title="Remove coupon"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Tag className="text-gray-400" size={18} />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Have a coupon code?
        </span>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={couponCode}
          onChange={(e) => {
            setCouponCode(e.target.value.toUpperCase());
            setError('');
          }}
          onKeyPress={handleKeyPress}
          placeholder="Enter code"
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 uppercase"
          disabled={loading}
        />
        <button
          onClick={handleApplyCoupon}
          disabled={loading || !couponCode.trim()}
          className="px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center gap-2"
        >
          {loading ? (
            <Loader className="animate-spin" size={18} />
          ) : (
            'Apply'
          )}
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
          <X size={14} />
          {error}
        </p>
      )}

      {success && (
        <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
          <Check size={14} />
          {success}
        </p>
      )}

      {/* Available Coupons Hint */}
      <div className="text-xs text-gray-500 dark:text-gray-400">
        <p>Try: SAVE10, SAVE20, WELCOME15, FLAT25</p>
      </div>
    </div>
  );
};

export default CouponInput;
