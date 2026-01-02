/**
 * Order Controller
 * Handles all order-related operations
 */

const { mockOrders } = require('../Models/order.model.js');

/**
 * Get all orders
 * Query params: status, limit
 */
const getAllOrders = (req, res) => {
	try {
		const { status, limit = 50 } = req.query;
		
		let orders = [...mockOrders];

		// Filter by status if provided
		if (status && status !== 'all') {
			orders = orders.filter(o => o.status === status);
		}

		// Apply limit
		const maxLimit = Math.min(parseInt(limit) || 50, 50);
		orders = orders.slice(0, maxLimit);

		res.status(200).json({
			success: true,
			count: orders.length,
			data: orders
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Error fetching orders',
			error: error.message
		});
	}
};

/**
 * Get a single order by ID
 */
const getOrderById = (req, res) => {
	try {
		const { id } = req.params;
		const order = mockOrders.find(o => o.id === parseInt(id));

		if (!order) {
			return res.status(404).json({
				success: false,
				message: 'Order not found'
			});
		}

		res.status(200).json({
			success: true,
			data: order
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Error fetching order',
			error: error.message
		});
	}
};

/**
 * Get orders by status
 */
const getOrdersByStatus = (req, res) => {
	try {
		const { status } = req.params;
		const orders = mockOrders.filter(o => o.status === status);

		if (orders.length === 0) {
			return res.status(404).json({
				success: false,
				message: `No orders found with status: ${status}`
			});
		}

		res.status(200).json({
			success: true,
			count: orders.length,
			data: orders
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Error fetching orders by status',
			error: error.message
		});
	}
};

/**
 * Get total orders count
 */
const getOrdersCount = (req, res) => {
	try {
		const totalOrders = mockOrders.length;
		return res.status(200).json({
			success: true,
			count: totalOrders
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: 'Error fetching orders count',
			error: error.message
		});
	}
};

/**
 * Get recent orders (for dashboard)
 */
const getRecentOrders = (req, res) => {
	try {
		const { limit = 10 } = req.query;
		const maxLimit = Math.min(parseInt(limit) || 10, 50);
		const recentOrders = mockOrders.slice(0, maxLimit);

		res.status(200).json({
			success: true,
			count: recentOrders.length,
			data: recentOrders
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Error fetching recent orders',
			error: error.message
		});
	}
};

module.exports = {
	getAllOrders,
	getOrderById,
	getOrdersByStatus,
	getOrdersCount,
	getRecentOrders
};
