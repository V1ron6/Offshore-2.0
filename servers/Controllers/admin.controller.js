/**
 * Admin Controller
 * Handles admin authentication and management
 */

const { verifyAdminCredentials, getAllAdmins } = require('../Models/admin.model.js');
const { mockProducts } = require('../Models/product.model.js');
const defaultUser = require('../Models/user.model.js');
const { mockOrders } = require('../Models/order.model.js');

// Admin Login
const adminLogin = (req, res) => {
	const { username, password } = req.body;

	if (!username || !password) {
		return res.status(400).json({
			success: false,
			message: 'Username and password are required'
		});
	}

	const admin = verifyAdminCredentials(username, password);

	if (!admin) {
		return res.status(401).json({
			success: false,
			message: 'Invalid username or password'
		});
	}

	return res.status(200).json({
		success: true,
		message: 'Login successful',
		admin: admin,
		token: `admin_${admin.id}_${Date.now()}` // Simple token for demo
	});
};

// Get all admins
const getAllAdminsData = (req, res) => {
	try {
		const adminList = getAllAdmins();
		return res.status(200).json({
			success: true,
			admins: adminList,
			count: adminList.length
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: 'Error fetching admins',
			error: error.message
		});
	}
};

// Get dashboard statistics
const getDashboardStats = (req, res) => {
	try {
		const totalUsers = defaultUser.length;
		const totalProducts = mockProducts.length;
		const totalOrders = mockOrders.length;

		return res.status(200).json({
			success: true,
			stats: {
				totalUsers,
				totalProducts,
				totalOrders
			}
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: 'Error fetching dashboard stats',
			error: error.message
		});
	}
};

// Get total users count
const getUsersCount = (req, res) => {
	try {
		const totalUsers = defaultUser.length;
		return res.status(200).json({
			success: true,
			count: totalUsers
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: 'Error fetching users count',
			error: error.message
		});
	}
};

// Get total products count
const getProductsCount = (req, res) => {
	try {
		const totalProducts = mockProducts.length;
		return res.status(200).json({
			success: true,
			count: totalProducts
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: 'Error fetching products count',
			error: error.message
		});
	}
};

// Verify admin token (middleware)
const verifyAdminToken = (req, res, next) => {
	const token = req.headers.authorization?.split(' ')[1];

	if (!token) {
		return res.status(401).json({
			success: false,
			message: 'No token provided'
		});
	}

	// Simple token verification for demo
	if (token.startsWith('admin_')) {
		req.adminId = token.split('_')[1];
		next();
	} else {
		return res.status(401).json({
			success: false,
			message: 'Invalid token'
		});
	}
};

module.exports = {
	adminLogin,
	getAllAdminsData,
	getDashboardStats,
	getUsersCount,
	getProductsCount,
	verifyAdminToken
};
