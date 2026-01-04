/**
 * Coupon Controller
 * Handles coupon validation and management
 */

const {
	getAllCoupons,
	getCouponByCode,
	validateCoupon,
	useCoupon,
	createCoupon,
	deactivateCoupon
} = require('../Models/coupon.model.js');

// Validate coupon code
const validateCouponCode = (req, res) => {
	try {
		const userId = req.user?.id;
		const { code, cartTotal } = req.body;

		if (!code) {
			return res.status(400).json({ success: false, message: 'Coupon code is required' });
		}

		if (!cartTotal || cartTotal <= 0) {
			return res.status(400).json({ success: false, message: 'Invalid cart total' });
		}

		const result = validateCoupon(code, cartTotal, userId);

		if (!result.valid) {
			return res.status(400).json({ success: false, message: result.message });
		}

		return res.status(200).json({
			success: true,
			...result
		});
	} catch (error) {
		console.error('Validate coupon error:', error);
		return res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

// Apply coupon to order
const applyCouponToOrder = (req, res) => {
	try {
		const userId = req.user?.id;
		const { code } = req.body;

		if (!code) {
			return res.status(400).json({ success: false, message: 'Coupon code is required' });
		}

		const used = useCoupon(code, userId);

		if (!used) {
			return res.status(400).json({ success: false, message: 'Failed to apply coupon' });
		}

		return res.status(200).json({
			success: true,
			message: 'Coupon applied successfully'
		});
	} catch (error) {
		console.error('Apply coupon error:', error);
		return res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

// Get all available coupons (public)
const getAvailableCoupons = (req, res) => {
	try {
		const coupons = getAllCoupons();
		
		// Return public info only
		const publicCoupons = coupons.map(c => ({
			code: c.code,
			type: c.type,
			value: c.value,
			minPurchase: c.minPurchase,
			description: c.description,
			expiresAt: c.expiresAt
		}));

		return res.status(200).json({
			success: true,
			count: publicCoupons.length,
			data: publicCoupons
		});
	} catch (error) {
		console.error('Get coupons error:', error);
		return res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

// Admin: Get all coupons with stats
const getAllCouponsAdmin = (req, res) => {
	try {
		const coupons = getAllCoupons();

		return res.status(200).json({
			success: true,
			count: coupons.length,
			data: coupons
		});
	} catch (error) {
		console.error('Get coupons admin error:', error);
		return res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

// Admin: Create new coupon
const createNewCoupon = (req, res) => {
	try {
		const { code, type, value, minPurchase, maxDiscount, usageLimit, expiresAt, description } = req.body;

		if (!code || !value) {
			return res.status(400).json({ success: false, message: 'Code and value are required' });
		}

		// Check if code exists
		if (getCouponByCode(code)) {
			return res.status(409).json({ success: false, message: 'Coupon code already exists' });
		}

		const newCoupon = createCoupon({
			code,
			type,
			value,
			minPurchase,
			maxDiscount,
			usageLimit,
			expiresAt,
			description
		});

		return res.status(201).json({
			success: true,
			message: 'Coupon created successfully',
			data: newCoupon
		});
	} catch (error) {
		console.error('Create coupon error:', error);
		return res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

// Admin: Deactivate coupon
const deactivateCouponCode = (req, res) => {
	try {
		const { code } = req.params;

		if (!code) {
			return res.status(400).json({ success: false, message: 'Coupon code is required' });
		}

		const deactivated = deactivateCoupon(code);

		if (!deactivated) {
			return res.status(404).json({ success: false, message: 'Coupon not found' });
		}

		return res.status(200).json({
			success: true,
			message: 'Coupon deactivated successfully'
		});
	} catch (error) {
		console.error('Deactivate coupon error:', error);
		return res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

module.exports = {
	validateCouponCode,
	applyCouponToOrder,
	getAvailableCoupons,
	getAllCouponsAdmin,
	createNewCoupon,
	deactivateCouponCode
};
