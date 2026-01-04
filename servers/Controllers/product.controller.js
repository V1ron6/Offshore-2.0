/**
 * Product Controller
 * Handles all product-related operations
 */

const { mockProducts } = require('../Models/product.model.js');

/**
 * Get all products with optional filtering and pagination
 * Query params: category, search, sort, page, limit
 */
const getAllProducts = (req, res) => {
	try {
		const { 
			category, 
			search, 
			sort = 'featured', 
			page = 1, 
			limit = 12 
		} = req.query;
		
		let products = [...mockProducts];

		// Filter by category
		if (category && category !== 'all') {
			products = products.filter(p => p.category === category);
		}

		// Filter by search term
		if (search) {
			const searchTerm = search.toLowerCase();
			products = products.filter(p => 
				p.name.toLowerCase().includes(searchTerm) ||
				p.description.toLowerCase().includes(searchTerm)
			);
		}

		// Sort products
		if (sort === 'price-low') {
			products.sort((a, b) => a.price - b.price);
		} else if (sort === 'price-high') {
			products.sort((a, b) => b.price - a.price);
		} else if (sort === 'rating') {
			products.sort((a, b) => b.rating - a.rating);
		} else if (sort === 'newest') {
			products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
		} else {
			// Default: featured first
			products.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
		}

		// Pagination
		const pageNum = Math.max(1, parseInt(page) || 1);
		const limitNum = Math.min(Math.max(1, parseInt(limit) || 12), 100); // Max 100 per page
		const totalProducts = products.length;
		const totalPages = Math.ceil(totalProducts / limitNum);
		const startIndex = (pageNum - 1) * limitNum;
		const endIndex = startIndex + limitNum;
		
		const paginatedProducts = products.slice(startIndex, endIndex);

		res.status(200).json({
			success: true,
			count: paginatedProducts.length,
			total: totalProducts,
			page: pageNum,
			totalPages,
			hasNextPage: pageNum < totalPages,
			hasPrevPage: pageNum > 1,
			data: paginatedProducts
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Error fetching products',
			error: error.message
		});
	}
};

/**
 * Get a single product by ID
 */
const getProductById = (req, res) => {
	try {
		const { id } = req.params;
		const product = mockProducts.find(p => p.id === parseInt(id));

		if (!product) {
			return res.status(404).json({
				success: false,
				message: 'Product not found'
			});
		}

		res.status(200).json({
			success: true,
			data: product
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Error fetching product',
			error: error.message
		});
	}
};

/**
 * Get products by category
 */
const getProductsByCategory = (req, res) => {
	try {
		const { category } = req.params;
		const products = mockProducts.filter(p => p.category === category);

		if (products.length === 0) {
			return res.status(404).json({
				success: false,
				message: 'No products found in this category'
			});
		}

		res.status(200).json({
			success: true,
			count: products.length,
			data: products
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Error fetching products by category',
			error: error.message
		});
	}
};

/**
 * Get all unique categories
 */
const getCategories = (req, res) => {
	try {
		const categories = [...new Set(mockProducts.map(p => p.category))];
		
		res.status(200).json({
			success: true,
			count: categories.length,
			data: categories
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Error fetching categories',
			error: error.message
		});
	}
};

/**
 * Get featured products
 */
const getFeaturedProducts = (req, res) => {
	try {
		const featured = mockProducts.filter(p => p.featured);
		
		res.status(200).json({
			success: true,
			count: featured.length,
			data: featured
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Error fetching featured products',
			error: error.message
		});
	}
};

module.exports = {
	getAllProducts,
	getProductById,
	getProductsByCategory,
	getCategories,
	getFeaturedProducts
};
