/**
 * Wishlist Service
 * Handles wishlist operations with localStorage fallback
 */

import apiClient from './apiClient.js';

const WISHLIST_KEY = 'wishlist';

// Get wishlist from localStorage
const getLocalWishlist = () => {
	try {
		return JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]');
	} catch {
		return [];
	}
};

// Save wishlist to localStorage
const saveLocalWishlist = (wishlist) => {
	localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
};

// Add item to wishlist
export const addToWishlist = async (product) => {
	try {
		const response = await apiClient.post('/wishlist', {
			productId: product.id,
			name: product.name,
			price: product.price,
			image: product.image,
			category: product.category,
			rating: product.rating
		});
		return { success: true, data: response.data };
	} catch (error) {
		// Fallback to localStorage
		console.error(error)
		const wishlist = getLocalWishlist();
		const exists = wishlist.find(item => item.productId === product.id);
		
		if (exists) {
			return { success: false, message: 'Item already in wishlist' };
		}
		
		wishlist.push({
			id: Date.now(),
			productId: product.id,
			name: product.name,
			price: product.price,
			image: product.image,
			category: product.category,
			rating: product.rating,
			addedAt: new Date().toISOString()
		});
		
		saveLocalWishlist(wishlist);
		return { success: true };
	}
};

// Remove item from wishlist
export const removeFromWishlist = async (productId) => {
	try {
		await apiClient.delete(`/wishlist/${productId}`);
		return { success: true };
	} catch (error) {
		// Fallback to localStorage
		console.log(error)
		const wishlist = getLocalWishlist();
		const updated = wishlist.filter(item => item.productId !== productId);
		saveLocalWishlist(updated);
		return { success: true };
	}
};

// Check if item is in wishlist
export const isInWishlist = (productId) => {
	const wishlist = getLocalWishlist();
	return wishlist.some(item => item.productId === productId);
};

// Get wishlist
export const getWishlist = async () => {
	try {
		const response = await apiClient.get('/wishlist');
		return response.data.data || [];
	} catch (error) {
		console.log(error)
		return getLocalWishlist();
	}
};

// Get wishlist count
export const getWishlistCount = () => {
	const wishlist = getLocalWishlist();
	return wishlist.length;
};

// Clear wishlist
export const clearWishlist = async () => {
	try {
		await apiClient.delete('/wishlist');
	} catch (error) {
		// Fallback
		console.log(error)
	}
	localStorage.removeItem(WISHLIST_KEY);
};

// Toggle wishlist (add if not in, remove if in)
export const toggleWishlist = async (product) => {
	const inWishlist = isInWishlist(product.id);
	
	if (inWishlist) {
		await removeFromWishlist(product.id);
		return { added: false };
	} else {
		await addToWishlist(product);
		return { added: true };
	}
};
