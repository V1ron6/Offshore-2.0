/**
 * Coupon/Discount Model
 * Handles coupon data storage and validation
 */

const { v4: uuidv4 } = require('uuid');

// Pre-defined coupons
const coupons = [
	{
		id: uuidv4(),
		code: 'SAVE10',
		type: 'percentage',
		value: 10,
		minPurchase: 50,
		maxDiscount: 100,
		usageLimit: 100,
		usedCount: 0,
		expiresAt: new Date('2026-12-31'),
		isActive: true,
		description: '10% off on orders above $50'
	},
	{
		id: uuidv4(),
		code: 'SAVE20',
		type: 'percentage',
		value: 20,
		minPurchase: 100,
		maxDiscount: 200,
		usageLimit: 50,
		usedCount: 0,
		expiresAt: new Date('2026-12-31'),
		isActive: true,
		description: '20% off on orders above $100'
	},
	{
		id: uuidv4(),
		code: 'FLAT25',
		type: 'fixed',
		value: 25,
		minPurchase: 75,
		maxDiscount: 25,
		usageLimit: 200,
		usedCount: 0,
		expiresAt: new Date('2026-12-31'),
		isActive: true,
		description: '$25 off on orders above $75'
	},
	{
		id: uuidv4(),
		code: 'WELCOME15',
		type: 'percentage',
		value: 15,
		minPurchase: 0,
		maxDiscount: 50,
		usageLimit: 1000,
		usedCount: 0,
		expiresAt: new Date('2026-12-31'),
		isActive: true,
		description: '15% off for new customers'
	},
	{
		id: uuidv4(),
		code: 'FREESHIP',
		type: 'shipping',
		value: 100,
		minPurchase: 30,
		maxDiscount: 15,
		usageLimit: 500,
		usedCount: 0,
		expiresAt: new Date('2026-12-31'),
		isActive: true,
		description: 'Free shipping on orders above $30'
	}
];

// User coupon usage tracking
const userCouponUsage = {};

// Get all active coupons
const getAllCoupons = () => {
	return coupons.filter(c => c.isActive);
};

// Get coupon by code
const getCouponByCode = (code) => {
	return coupons.find(c => c.code.toUpperCase() === code.toUpperCase());
};

// Validate and apply coupon
const validateCoupon = (code, cartTotal, userId) => {
	const coupon = getCouponByCode(code);
	
	if (!coupon) {
		return { valid: false, message: 'Invalid coupon code' };
	}
	
	if (!coupon.isActive) {
		return { valid: false, message: 'This coupon is no longer active' };
	}
	
	if (new Date() > new Date(coupon.expiresAt)) {
		return { valid: false, message: 'This coupon has expired' };
	}
	
	if (coupon.usedCount >= coupon.usageLimit) {
		return { valid: false, message: 'This coupon has reached its usage limit' };
	}
	
	if (cartTotal < coupon.minPurchase) {
		return { 
			valid: false, 
			message: `Minimum purchase of $${coupon.minPurchase} required for this coupon` 
		};
	}
	
	// Check if user already used this coupon
	if (userCouponUsage[userId]?.includes(coupon.code)) {
		return { valid: false, message: 'You have already used this coupon' };
	}
	
	// Calculate discount
	let discount = 0;
	if (coupon.type === 'percentage') {
		discount = (cartTotal * coupon.value) / 100;
		discount = Math.min(discount, coupon.maxDiscount);
	} else if (coupon.type === 'fixed') {
		discount = coupon.value;
	} else if (coupon.type === 'shipping') {
		discount = coupon.maxDiscount; // Free shipping amount
	}
	
	return {
		valid: true,
		coupon: {
			code: coupon.code,
			type: coupon.type,
			description: coupon.description
		},
		discount: Math.round(discount * 100) / 100,
		message: `Coupon applied! You save $${discount.toFixed(2)}`
	};
};

// Mark coupon as used
const useCoupon = (code, userId) => {
	const coupon = getCouponByCode(code);
	if (coupon) {
		coupon.usedCount++;
		if (!userCouponUsage[userId]) {
			userCouponUsage[userId] = [];
		}
		userCouponUsage[userId].push(coupon.code);
		return true;
	}
	return false;
};

// Create new coupon (admin)
const createCoupon = (couponData) => {
	const newCoupon = {
		id: uuidv4(),
		code: couponData.code.toUpperCase(),
		type: couponData.type || 'percentage',
		value: couponData.value,
		minPurchase: couponData.minPurchase || 0,
		maxDiscount: couponData.maxDiscount || 1000,
		usageLimit: couponData.usageLimit || 100,
		usedCount: 0,
		expiresAt: couponData.expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
		isActive: true,
		description: couponData.description || ''
	};
	coupons.push(newCoupon);
	return newCoupon;
};

// Deactivate coupon (admin)
const deactivateCoupon = (code) => {
	const coupon = getCouponByCode(code);
	if (coupon) {
		coupon.isActive = false;
		return true;
	}
	return false;
};

module.exports = {
	getAllCoupons,
	getCouponByCode,
	validateCoupon,
	useCoupon,
	createCoupon,
	deactivateCoupon
};
