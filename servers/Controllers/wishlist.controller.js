/**
 * Wishlist Controller
 * Handles wishlist operations
 */

const {
	getWishlist,
	addToWishlist,
	removeFromWishlist,
	isInWishlist,
	clearWishlist,
	getWishlistCount
} = require('../Models/wishlist.model.js');

// Get user's wishlist
const getUserWishlist = (req, res) => {
	try {
		const userId = req.user?.id;
		if (!userId) {
			return res.status(401).json({ success: false, message: 'Unauthorized' });
		}

		const wishlist = getWishlist(userId);
		return res.status(200).json({
			success: true,
			count: wishlist.length,
			data: wishlist
		});
	} catch (error) {
		console.error('Get wishlist error:', error);
		return res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

// Add item to wishlist
const addItemToWishlist = (req, res) => {
	try {
		const userId = req.user?.id;
		if (!userId) {
			return res.status(401).json({ success: false, message: 'Unauthorized' });
		}

		const { productId, name, price, image, category, rating } = req.body;

		if (!productId || !name) {
			return res.status(400).json({ success: false, message: 'Product ID and name are required' });
		}

		const result = addToWishlist(userId, { productId, name, price, image, category, rating });

		if (!result.success) {
			return res.status(409).json(result);
		}

		return res.status(201).json({
			success: true,
			message: 'Added to wishlist',
			item: result.item
		});
	} catch (error) {
		console.error('Add to wishlist error:', error);
		return res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

// Remove item from wishlist
const removeItemFromWishlist = (req, res) => {
	try {
		const userId = req.user?.id;
		if (!userId) {
			return res.status(401).json({ success: false, message: 'Unauthorized' });
		}

		const { productId } = req.params;

		if (!productId) {
			return res.status(400).json({ success: false, message: 'Product ID is required' });
		}

		const result = removeFromWishlist(userId, parseInt(productId));

		if (!result.success) {
			return res.status(404).json(result);
		}

		return res.status(200).json({
			success: true,
			message: 'Removed from wishlist'
		});
	} catch (error) {
		console.error('Remove from wishlist error:', error);
		return res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

// Check if item is in wishlist
const checkWishlistItem = (req, res) => {
	try {
		const userId = req.user?.id;
		if (!userId) {
			return res.status(401).json({ success: false, message: 'Unauthorized' });
		}

		const { productId } = req.params;
		const inWishlist = isInWishlist(userId, parseInt(productId));

		return res.status(200).json({
			success: true,
			inWishlist
		});
	} catch (error) {
		console.error('Check wishlist error:', error);
		return res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

// Clear wishlist
const clearUserWishlist = (req, res) => {
	try {
		const userId = req.user?.id;
		if (!userId) {
			return res.status(401).json({ success: false, message: 'Unauthorized' });
		}

		clearWishlist(userId);

		return res.status(200).json({
			success: true,
			message: 'Wishlist cleared'
		});
	} catch (error) {
		console.error('Clear wishlist error:', error);
		return res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

// Get wishlist count
const getWishlistItemCount = (req, res) => {
	try {
		const userId = req.user?.id;
		if (!userId) {
			return res.status(401).json({ success: false, message: 'Unauthorized' });
		}

		const count = getWishlistCount(userId);

		return res.status(200).json({
			success: true,
			count
		});
	} catch (error) {
		console.error('Get wishlist count error:', error);
		return res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

module.exports = {
	getUserWishlist,
	addItemToWishlist,
	removeItemFromWishlist,
	checkWishlistItem,
	clearUserWishlist,
	getWishlistItemCount
};
