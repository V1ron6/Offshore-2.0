const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

// Helper function to generate random stats for users
const generateRandomStats = () => {
	const totalSales = Math.floor(Math.random() * 100000) + 5000;
	const totalOrders = Math.floor(Math.random() * 500) + 50;
	const avgOrderValue = parseFloat((totalSales / totalOrders).toFixed(2));
	const monthlyProfit = Math.floor(totalSales * (0.15 + Math.random() * 0.20));
	const revenue = Math.floor(totalSales * (1 + Math.random() * 0.3));
	const growth = parseFloat((Math.random() * 25 - 5).toFixed(1)); // -5% to +20%
	const conversionRate = parseFloat((Math.random() * 5 + 1).toFixed(1)); // 1% to 6%
	const pendingOrders = Math.floor(Math.random() * 30) + 5;
	const activeProducts = Math.floor(Math.random() * 100) + 20;
	const totalCustomers = Math.floor(Math.random() * 3000) + 500;

	return {
		totalSales,
		totalOrders,
		avgOrderValue,
		monthlyProfit,
		revenue,
		growth,
		conversionRate,
		pendingOrders,
		activeProducts,
		totalCustomers,
		weeklyData: [
			{ name: 'Week 1', value: Math.floor(Math.random() * 15000) + 5000, profit: Math.floor(Math.random() * 4000) + 1000 },
			{ name: 'Week 2', value: Math.floor(Math.random() * 15000) + 5000, profit: Math.floor(Math.random() * 4000) + 1000 },
			{ name: 'Week 3', value: Math.floor(Math.random() * 15000) + 5000, profit: Math.floor(Math.random() * 4000) + 1000 },
			{ name: 'Week 4', value: Math.floor(Math.random() * 15000) + 5000, profit: Math.floor(Math.random() * 4000) + 1000 }
		]
	};
};

// Store for users - passwords will be hashed for new users
// Default users have plain text passwords for demo (they'll work with both plain and hash comparison)
const defaultUser = [
	{
		id: uuidv4(),
		username: "user",
		password: "password123",
		email: "user@example.com",
		isHashed: false,
		stats: generateRandomStats()
	},
	{
		id: uuidv4(),
		username: "john",
		password: "12john3",
		email: "john@example.com",
		isHashed: false,
		stats: generateRandomStats()
	},
	{
		id: uuidv4(),
		username: "david",
		password: "yoofi123",
		email: "david@example.com",
		isHashed: false,
		stats: generateRandomStats()
	},
	{
		id: uuidv4(),
		username: "alice",
		password: "alice123",
		email: "alice@example.com",
		isHashed: false,
		stats: generateRandomStats()
	},
	{
		id: uuidv4(),
		username: "bob",
		password: "bob123",
		email: "bob@example.com",
		isHashed: false,
		stats: generateRandomStats()
	},
	{
		id: uuidv4(),
		username: "sarah",
		password: "sarah123",
		email: "sarah@example.com",
		isHashed: false,
		stats: generateRandomStats()
	},
	{
		id: uuidv4(),
		username: "mike",
		password: "mike123",
		email: "mike@example.com",
		isHashed: false,
		stats: generateRandomStats()
	},
	{
		id: uuidv4(),
		username: "emma",
		password: "emma123",
		email: "emma@example.com",
		isHashed: false,
		stats: generateRandomStats()
	},
	{
		id: uuidv4(),
		username: "james",
		password: "james123",
		email: "james@example.com",
		isHashed: false,
		stats: generateRandomStats()
	},
	{
		id: uuidv4(),
		username: "lucy",
		password: "lucy123",
		email: "lucy@example.com",
		isHashed: false,
		stats: generateRandomStats()
	},
	{
		id: uuidv4(),
		username: "sophia",
		password: "sophia123",
		email: "sophia@example.com",
		isHashed: false,
		stats: generateRandomStats()
	},
	{
		id: uuidv4(),
		username: "liam",
		password: "liam123",
		email: "liam@example.com",
		isHashed: false,
		stats: generateRandomStats()
	},
	{
		id: uuidv4(),
		username: "noah",
		password: "noah123",
		email: "noah@example.com",
		isHashed: false,
		stats: generateRandomStats()
	},
	{
		id: uuidv4(),
		username: "oliver",
		password: "oliver123",
		email: "oliver@example.com",
		isHashed: false,
		stats: generateRandomStats()
	},
	{
		id: uuidv4(),
		username: "charlotte",
		password: "charlotte123",
		email: "charlotte@example.com",
		isHashed: false,
		stats: generateRandomStats()
	}
];

// Helper functions
const findUserByUsername = (username) => {
	return defaultUser.find(u => u.username === username);
};

const findUserByEmail = (email) => {
	return defaultUser.find(u => u.email === email);
};

const findUserById = (id) => {
	return defaultUser.find(u => u.id === id);
};

// Verify password (handles both hashed and plain text for backward compatibility)
const verifyPassword = async (inputPassword, user) => {
	if (user.isHashed) {
		return await bcrypt.compare(inputPassword, user.password);
	}
	// For demo users with plain text passwords
	return inputPassword === user.password;
};

// Hash password for new users
const hashPassword = async (password) => {
	const salt = await bcrypt.genSalt(10);
	return await bcrypt.hash(password, salt);
};

// Create new user with hashed password
const createUser = async (username, email, password) => {
	const hashedPassword = await hashPassword(password);
	const newUser = {
		id: uuidv4(),
		username,
		email,
		password: hashedPassword,
		isHashed: true,
		createdAt: new Date().toISOString(),
		stats: generateRandomStats()
	};
	defaultUser.push(newUser);
	return {
		id: newUser.id,
		username: newUser.username,
		email: newUser.email,
		stats: newUser.stats
	};
};

// Get all users (without passwords)
const getAllUsersData = () => {
	return defaultUser.map(u => ({
		id: u.id,
		username: u.username,
		email: u.email || `${u.username}@example.com`,
		createdAt: u.createdAt || new Date().toISOString(),
		stats: u.stats
	}));
};

// Get user stats by ID
const getUserStats = (id) => {
	const user = defaultUser.find(u => u.id === id);
	if (user) {
		return user.stats;
	}
	return null;
};

// Delete user by ID
const deleteUserById = (id) => {
	const index = defaultUser.findIndex(u => u.id === id);
	if (index !== -1) {
		defaultUser.splice(index, 1);
		return true;
	}
	return false;
};

// Update user by ID
const updateUserById = (id, updates) => {
	const user = defaultUser.find(u => u.id === id);
	if (user) {
		if (updates.username) user.username = updates.username;
		if (updates.email) user.email = updates.email;
		return { id: user.id, username: user.username, email: user.email };
	}
	return null;
};

module.exports = defaultUser;
module.exports.findUserByUsername = findUserByUsername;
module.exports.findUserByEmail = findUserByEmail;
module.exports.findUserById = findUserById;
module.exports.verifyPassword = verifyPassword;
module.exports.hashPassword = hashPassword;
module.exports.createUser = createUser;
module.exports.getAllUsersData = getAllUsersData;
module.exports.getUserStats = getUserStats;
module.exports.deleteUserById = deleteUserById;
module.exports.updateUserById = updateUserById;
module.exports.generateRandomStats = generateRandomStats;