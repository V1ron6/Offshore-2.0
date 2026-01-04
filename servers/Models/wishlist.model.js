/**
 * Wishlist Model
 * Handles wishlist data storage and operations
 */

const { v4: uuidv4 } = require('uuid');

// In-memory wishlist storage (keyed by userId)
const wishlists = {};

// Get user's wishlist
const getWishlist = (userId) => {
	return wishlists[userId] || [];
};

// Add item to wishlist
const addToWishlist = (userId, product) => {
	if (!wishlists[userId]) {
		wishlists[userId] = [];
	}
	
	// Check if already in wishlist
	const exists = wishlists[userId].find(item => item.productId === product.productId);
	if (exists) {
		return { success: false, message: 'Item already in wishlist' };
	}
	
	const wishlistItem = {
		id: uuidv4(),
		productId: product.productId,
		name: product.name,
		price: product.price,
		image: product.image,
		category: product.category,
		rating: product.rating,
		addedAt: new Date().toISOString()
	};
	
	wishlists[userId].push(wishlistItem);
	return { success: true, item: wishlistItem };
};

// Remove item from wishlist
const removeFromWishlist = (userId, productId) => {
	if (!wishlists[userId]) {
		return { success: false, message: 'Wishlist not found' };
	}
	
	const index = wishlists[userId].findIndex(item => item.productId === productId);
	if (index === -1) {
		return { success: false, message: 'Item not in wishlist' };
	}
	
	wishlists[userId].splice(index, 1);
	return { success: true };
};

// Check if item is in wishlist
const isInWishlist = (userId, productId) => {
	if (!wishlists[userId]) return false;
	return wishlists[userId].some(item => item.productId === productId);
};

// Clear entire wishlist
const clearWishlist = (userId) => {
	wishlists[userId] = [];
	return { success: true };
};

// Get wishlist count
const getWishlistCount = (userId) => {
	return wishlists[userId]?.length || 0;
};

module.exports = {
	getWishlist,
	addToWishlist,
	removeFromWishlist,
	isInWishlist,
	clearWishlist,
	getWishlistCount
};
