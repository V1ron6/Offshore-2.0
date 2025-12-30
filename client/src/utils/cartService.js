/**
 * ========================================
 * Cart Service Utility
 * ========================================
 * 
 * Centralized cart management service
 * Handles cart operations with localStorage persistence
 */

/**
 * Get user's cart from localStorage
 * @param {string} userId - User ID
 * @returns {Array} Cart items
 */
export const getCart = (userId) => {
	try {
		const cart = localStorage.getItem(`cart_${userId}`);
		return cart ? JSON.parse(cart) : [];
	} catch (error) {
		console.error('Error loading cart:', error);
		return [];
	}
};

/**
 * Save cart to localStorage
 * @param {string} userId - User ID
 * @param {Array} cart - Cart items
 */
export const saveCart = (userId, cart) => {
	try {
		localStorage.setItem(`cart_${userId}`, JSON.stringify(cart));
		// Trigger storage event for syncing across tabs
		window.dispatchEvent(new StorageEvent('cartUpdated', {
			detail: { userId, cart }
		}));
	} catch (error) {
		console.error('Error saving cart:', error);
	}
};

/**
 * Add item to cart
 * @param {string} userId - User ID
 * @param {Object} product - Product to add
 * @param {number} quantity - Quantity to add
 * @returns {Array} Updated cart
 */
export const addToCart = (userId, product, quantity = 1) => {
	const cart = getCart(userId);
	const existingItem = cart.find(item => item.id === product.id);

	if (existingItem) {
		existingItem.quantity += quantity;
	} else {
		cart.push({
			id: product.id,
			name: product.name,
			price: product.price,
			image: product.image,
			quantity: quantity
		});
	}

	saveCart(userId, cart);
	return cart;
};

/**
 * Remove item from cart
 * @param {string} userId - User ID
 * @param {number} productId - Product ID to remove
 * @returns {Array} Updated cart
 */
export const removeFromCart = (userId, productId) => {
	const cart = getCart(userId);
	const updatedCart = cart.filter(item => item.id !== productId);
	saveCart(userId, updatedCart);
	return updatedCart;
};

/**
 * Update item quantity
 * @param {string} userId - User ID
 * @param {number} productId - Product ID
 * @param {number} quantity - New quantity
 * @returns {Array} Updated cart
 */
export const updateQuantity = (userId, productId, quantity) => {
	const cart = getCart(userId);
	const item = cart.find(item => item.id === productId);

	if (item) {
		if (quantity <= 0) {
			return removeFromCart(userId, productId);
		}
		item.quantity = quantity;
		saveCart(userId, cart);
	}

	return cart;
};

/**
 * Clear entire cart
 * @param {string} userId - User ID
 */
export const clearCart = (userId) => {
	localStorage.removeItem(`cart_${userId}`);
	window.dispatchEvent(new StorageEvent('cartUpdated', {
		detail: { userId, cart: [] }
	}));
};

/**
 * Get cart total
 * @param {Array} cart - Cart items
 * @returns {number} Total price
 */
export const getCartTotal = (cart) => {
	return cart.reduce((total, item) => {
		const price = parseFloat(item.price?.replace('$', '') || 0);
		return total + (price * item.quantity);
	}, 0);
};

/**
 * Get cart item count
 * @param {Array} cart - Cart items
 * @returns {number} Total items
 */
export const getCartCount = (cart) => {
	return cart.reduce((count, item) => count + item.quantity, 0);
};
