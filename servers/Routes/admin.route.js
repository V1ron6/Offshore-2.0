/**
 * Admin Routes
 * Routes for admin authentication and management
 */

const express = require('express');
const router = express.Router();
const { adminLogin, getAllAdminsData, verifyAdminToken } = require('../Controllers/admin.controller.js');

// Admin Login Route
router.post('/login', adminLogin);

// Get all admins (protected)
router.get('/users', verifyAdminToken, getAllAdminsData);

module.exports = router;
