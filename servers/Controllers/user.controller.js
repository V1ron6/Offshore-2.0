const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const defaultUser = require("../Models/user.model.js");

// Login controller with JWT
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
		const user = defaultUser.find((u) => u.username === username);
		if (!user) {
			return res.status(401).json({ 
				success: false, 
				message: 'Invalid credentials' 
			});
		}

		// Verify password (in production, use bcrypt)
		const isPasswordValid = password === user.password; // TODO: Use bcrypt.compare()
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
			user: { id: user.id, username: user.username }
		});

	} catch (error) {
		console.error('Login error:', error);
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

module.exports = {
	loginUser,
	getUserProfile,
	logoutUser
};