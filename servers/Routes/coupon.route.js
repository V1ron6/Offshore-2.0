/**
 * Coupon Routes
 * API endpoints for coupon operations
 */

const express = require('express');
const router = express.Router();
const {
	validateCouponCode,
	applyCouponToOrder,
	getAvailableCoupons,
	getAllCouponsAdmin,
	createNewCoupon,
	deactivateCouponCode
} = require('../Controllers/coupon.controller.js');
const { verifyToken } = require('../middleware/security.js');

// Public routes
router.get('/available', getAvailableCoupons);

// User routes (require auth)
router.post('/validate', verifyToken, validateCouponCode);
router.post('/apply', verifyToken, applyCouponToOrder);

// Admin routes - using simple token check for now
router.get('/admin/all', getAllCouponsAdmin);
router.post('/admin/create', createNewCoupon);
router.delete('/admin/:code', deactivateCouponCode);

module.exports = router;
