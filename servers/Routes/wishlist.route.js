/**
 * Wishlist Routes
 * API endpoints for wishlist operations
 */

const express = require('express');
const router = express.Router();
const {
	getUserWishlist,
	addItemToWishlist,
	removeItemFromWishlist,
	checkWishlistItem,
	clearUserWishlist,
	getWishlistItemCount
} = require('../Controllers/wishlist.controller.js');
const { verifyToken } = require('../middleware/security.js');

// All routes require authentication
router.get('/', verifyToken, getUserWishlist);
router.post('/', verifyToken, addItemToWishlist);
router.delete('/:productId', verifyToken, removeItemFromWishlist);
router.get('/check/:productId', verifyToken, checkWishlistItem);
router.delete('/', verifyToken, clearUserWishlist);
router.get('/count', verifyToken, getWishlistItemCount);

module.exports = router;
