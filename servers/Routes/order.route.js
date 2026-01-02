/**
 * Order Routes
 * API endpoints for order operations
 */

const express = require('express');
const router = express.Router();
const {
	getAllOrders,
	getOrderById,
	getOrdersByStatus,
	getOrdersCount,
	getRecentOrders
} = require('../Controllers/order.controller.js');

/**
 * GET /api/orders
 * Get all orders with optional filtering
 * Query params: status, limit
 */
router.get('/', getAllOrders);

/**
 * GET /api/orders/recent
 * Get recent orders (for dashboard)
 * Query params: limit
 */
router.get('/recent', getRecentOrders);

/**
 * GET /api/orders/count
 * Get total orders count
 */
router.get('/count', getOrdersCount);

/**
 * GET /api/orders/status/:status
 * Get all orders by status
 */
router.get('/status/:status', getOrdersByStatus);

/**
 * GET /api/orders/:id
 * Get a single order by ID
 */
router.get('/:id', getOrderById);

module.exports = router;
