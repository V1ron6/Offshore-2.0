/**
 * Admin User Model
 * Stores admin user credentials
 */

const { v4: uuidv4 } = require('uuid');

let admins = [
	{
		id: uuidv4(),
		username: 'admin1',
		email: 'admin1@offshore.com',
		password: 'Admin@123', // In production, this should be hashed
		createdAt: new Date('2024-01-01'),
		role: 'super_admin'
	},
	{
		id: uuidv4(),
		username: 'admin2',
		email: 'admin2@offshore.com',
		password: 'Admin@456', // In production, this should be hashed
		createdAt: new Date('2024-01-15'),
		role: 'admin'
	}
];

// Get admin by username
const getAdminByUsername = (username) => {
	return admins.find(admin => admin.username === username);
};

// Get admin by ID
const getAdminById = (id) => {
	return admins.find(admin => admin.id === id);
};

// Verify admin credentials
const verifyAdminCredentials = (username, password) => {
	const admin = getAdminByUsername(username);
	if (!admin) return null;
	if (admin.password === password) {
		return {
			id: admin.id,
			username: admin.username,
			email: admin.email,
			role: admin.role
		};
	}
	return null;
};

// Get all admins (without passwords)
const getAllAdmins = () => {
	return admins.map(admin => ({
		id: admin.id,
		username: admin.username,
		email: admin.email,
		role: admin.role,
		createdAt: admin.createdAt
	}));
};

module.exports = {
	admins,
	getAdminByUsername,
	getAdminById,
	verifyAdminCredentials,
	getAllAdmins
};
