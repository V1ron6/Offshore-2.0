/**
 * Admin Routes
 * Routes for admin authentication and management
 */

const express = require('express');
const router = express.Router();
const { 
	adminLogin, 
	getAllAdminsData, 
	getDashboardStats,
	getUsersCount,
	getProductsCount,
	verifyAdminToken 
} = require('../Controllers/admin.controller.js');

// Admin Login Route
router.post('/login', adminLogin);

// Get all admins (protected)
router.get('/users', verifyAdminToken, getAllAdminsData);

// Get dashboard statistics (protected)
router.get('/stats', verifyAdminToken, getDashboardStats);

// Get users count (protected)
router.get('/stats/users', verifyAdminToken, getUsersCount);

// Get products count (protected)
router.get('/stats/products', verifyAdminToken, getProductsCount);

module.exports = router;
