/**
 * Complaint Routes
 * Routes for complaint/concern submissions and management
 */

const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/security.js');
const { verifyAdminToken } = require('../Controllers/admin.controller.js');
const {
	submitComplaint,
	getUserComplaints,
	getAllComplaintsAdmin,
	getComplaintStats,
	getComplaintByIdAdmin,
	updateComplaintStatus,
	markAllComplaintsAsRead,
	deleteComplaintAdmin
} = require('../Controllers/complaint.controller.js');

// ==================== User Routes ====================

/**
 * POST /api/complaints
 * Submit a new complaint (requires user authentication)
 */
router.post('/', verifyToken, submitComplaint);

/**
 * GET /api/complaints/my-complaints
 * Get current user's complaints
 */
router.get('/my-complaints', verifyToken, getUserComplaints);

// ==================== Admin Routes ====================

/**
 * GET /api/complaints/admin/all
 * Get all complaints (admin only)
 */
router.get('/admin/all', verifyAdminToken, getAllComplaintsAdmin);

/**
 * GET /api/complaints/admin/stats
 * Get complaint statistics (admin only)
 */
router.get('/admin/stats', verifyAdminToken, getComplaintStats);

/**
 * PUT /api/complaints/admin/mark-all-read
 * Mark all complaints as read (admin only)
 */
router.put('/admin/mark-all-read', verifyAdminToken, markAllComplaintsAsRead);

/**
 * GET /api/complaints/admin/:id
 * Get single complaint by ID (admin only)
 */
router.get('/admin/:id', verifyAdminToken, getComplaintByIdAdmin);

/**
 * PUT /api/complaints/admin/:id
 * Update complaint status (admin only)
 */
router.put('/admin/:id', verifyAdminToken, updateComplaintStatus);

/**
 * DELETE /api/complaints/admin/:id
 * Delete complaint (admin only)
 */
router.delete('/admin/:id', verifyAdminToken, deleteComplaintAdmin);

module.exports = router;
