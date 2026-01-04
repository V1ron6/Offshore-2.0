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
	getAllUsers,
	deleteUser,
	updateUser,
	verifyAdminToken 
} = require('../Controllers/admin.controller.js');
const { authLimiter } = require('../middleware/rateLimit.js');

// Admin Login Route with rate limiting
router.post('/login', authLimiter, adminLogin);

// Get all admins (protected)
router.get('/admins', verifyAdminToken, getAllAdminsData);

// Get all users (protected) - for ManageUsers page
router.get('/users', verifyAdminToken, getAllUsers);

// Delete a user (protected)
router.delete('/users/:id', verifyAdminToken, deleteUser);

// Update a user (protected)
router.put('/users/:id', verifyAdminToken, updateUser);

// Get dashboard statistics (protected)
router.get('/stats', verifyAdminToken, getDashboardStats);

// Get users count (protected)
router.get('/stats/users', verifyAdminToken, getUsersCount);

// Get products count (protected)
router.get('/stats/products', verifyAdminToken, getProductsCount);

module.exports = router;
