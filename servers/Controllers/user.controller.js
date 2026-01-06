const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const defaultUser = require("../Models/user.model.js");
const { 
	findUserByUsername, 
	findUserByEmail, 
	findUserById,
	verifyPassword, 
	createUser,
	getUserStats 
} = require("../Models/user.model.js");
const { checkSessionStatus } = require("../middleware/sessionManager.js");

// Login controller with JWT and bcrypt password verification
const loginUser = async (req, res) => {
	try {
		const { username, password } = req.body;

		// Input validation
		if (!username || !password) {
			return res.status(400).json({ 
				success: false, 
				message: 'Username and password are required' 
			});
		}

		// Sanitize input
		if (typeof username !== 'string' || typeof password !== 'string') {
			return res.status(400).json({ 
				success: false, 
				message: 'Invalid input format' 
			});
		}

		// Find user
		const user = findUserByUsername(username);
		if (!user) {
			return res.status(401).json({ 
				success: false, 
				message: 'Invalid credentials' 
			});
		}

		// Verify password using bcrypt (handles both hashed and plain text)
		const isPasswordValid = await verifyPassword(password, user);
		if (!isPasswordValid) {
			return res.status(401).json({ 
				success: false, 
				message: 'Invalid credentials' 
			});
		}

		// Generate JWT token
		const token = jwt.sign(
			{ id: user.id, username: user.username },
			process.env.JWT_SECRET || 'your-secret-key',
			{ expiresIn: '24h' }
		);

		return res.status(200).json({ 
			success: true, 
			message: `Welcome ${username}`,
			token,
			user: { id: user.id, username: user.username, email: user.email, stats: user.stats }
		});

	} catch (error) {
		console.error('Login error:', error);
		return res.status(500).json({ 
			success: false, 
			message: 'Internal server error' 
		});
	}
};

// Signup controller with bcrypt password hashing
const signupUser = async (req, res) => {
	try {
		const { username, email, password } = req.body;

		// Input validation
		if (!username || !email || !password) {
			return res.status(400).json({
				success: false,
				message: 'Username, email, and password are required'
			});
		}

		// Validate username length
		if (username.length < 3 || username.length > 20) {
			return res.status(400).json({
				success: false,
				message: 'Username must be between 3 and 20 characters'
			});
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return res.status(400).json({
				success: false,
				message: 'Invalid email format'
			});
		}

		// Validate password length
		if (password.length < 6) {
			return res.status(400).json({
				success: false,
				message: 'Password must be at least 6 characters'
			});
		}

		// Check if username already exists
		const existingUser = findUserByUsername(username);
		if (existingUser) {
			return res.status(409).json({
				success: false,
				message: 'Username already taken'
			});
		}

		// Check if email already exists
		const existingEmail = findUserByEmail(email);
		if (existingEmail) {
			return res.status(409).json({
				success: false,
				message: 'Email already registered'
			});
		}

		// Create new user with hashed password
		const newUser = await createUser(username, email, password);

		// Generate JWT token for auto-login
		const token = jwt.sign(
			{ id: newUser.id, username: newUser.username },
			process.env.JWT_SECRET || 'your-secret-key',
			{ expiresIn: '24h' }
		);

		return res.status(201).json({
			success: true,
			message: 'Account created successfully',
			token,
			user: newUser
		});

	} catch (error) {
		console.error('Signup error:', error);
		return res.status(500).json({
			success: false,
			message: 'Internal server error'
		});
	}
};

// Get user profile (protected route)
const getUserProfile = async (req, res) => {
	try {
		const userId = req.user?.id;
		
		if (!userId) {
			return res.status(401).json({ 
				success: false, 
				message: 'Unauthorized' 
			});
		}

		const user = defaultUser.find((u) => u.id === userId);
		if (!user) {
			return res.status(404).json({ 
				success: false, 
				message: 'User not found' 
			});
		}

		return res.status(200).json({ 
			success: true, 
			user: { id: user.id, username: user.username } 
		});

	} catch (error) {
		console.error('Get profile error:', error);
		return res.status(500).json({ 
			success: false, 
			message: 'Internal server error' 
		});
	}
};

// Logout controller
const logoutUser = (req, res) => {
	try {
		return res.status(200).json({ 
			success: true, 
			message: 'Logged out successfully' 
		});
	} catch (error) {
		console.error('Logout error:', error);
		return res.status(500).json({ 
			success: false, 
			message: 'Internal server error' 
		});
	}
};

// Get user stats (for dashboard)
const getUserStatsController = async (req, res) => {
	try {
		const userId = req.user?.id || req.params.userId;
		
		if (!userId) {
			return res.status(401).json({ 
				success: false, 
				message: 'Unauthorized' 
			});
		}

		const user = findUserById(userId);
		if (!user) {
			return res.status(404).json({ 
				success: false, 
				message: 'User not found' 
			});
		}

		return res.status(200).json({ 
			success: true, 
			stats: user.stats
		});

	} catch (error) {
		console.error('Get user stats error:', error);
		return res.status(500).json({ 
			success: false, 
			message: 'Internal server error' 
		});
	}
};

// Check session status
const checkSessionStatusController = async (req, res) => {
	try {
		const userId = req.user?.id;
		
		if (!userId) {
			return res.status(401).json({ 
				success: false, 
				message: 'Unauthorized' 
			});
		}

		const sessionStatus = checkSessionStatus(userId);
		
		return res.status(200).json({
			success: true,
			session: sessionStatus
		});

	} catch (error) {
		console.error('Check session status error:', error);
		return res.status(500).json({
			success: false,
			message: 'Internal server error'
		});
	}
};

module.exports = {
	loginUser,
	signupUser,
	getUserProfile,
	logoutUser,
	getUserStatsController,
	checkSessionStatusController
};