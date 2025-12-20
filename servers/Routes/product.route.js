/**
 * Product Routes
 * API endpoints for product operations
 */

const express = require('express');
const router = express.Router();
const {
	getAllProducts,
	getProductById,
	getProductsByCategory,
	getCategories,
	getFeaturedProducts
} = require('../Controllers/product.controller.js');

/**
 * GET /api/products
 * Get all products with optional filtering
 * Query params: category, search, sort, limit
 */
router.get('/', getAllProducts);

/**
 * GET /api/products/categories
 * Get all unique product categories
 */
router.get('/categories', getCategories);

/**
 * GET /api/products/featured
 * Get all featured products
 */
router.get('/featured', getFeaturedProducts);

/**
 * GET /api/products/:id
 * Get a single product by ID
 */
router.get('/:id', getProductById);

/**
 * GET /api/products/category/:category
 * Get all products in a specific category
 */
router.get('/category/:category', getProductsByCategory);

module.exports = router;
