import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  getProductBySlug,
  updateProduct,
  deleteProduct,
  getProductsByCategory
} from '../controllers/productController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// ========================================
// PUBLIC ROUTES
// ========================================

/**
 * @route   GET /api/products
 * @desc    Get all products with filters
 * @access  Public
 */
router.get('/', getAllProducts);

/**
 * @route   GET /api/products/slug/:slug
 * @desc    Get product by slug
 * @access  Public
 */
router.get('/slug/:slug', getProductBySlug);

/**
 * @route   GET /api/products/category/:categoryId
 * @desc    Get products by category
 * @access  Public
 */
router.get('/category/:categoryId', getProductsByCategory);

/**
 * @route   GET /api/products/:id
 * @desc    Get product by ID
 * @access  Public
 */
router.get('/:id', getProductById);

// ========================================
// ADMIN ROUTES (Protected)
// ========================================

/**
 * @route   POST /api/products
 * @desc    Create product
 * @access  Admin Only
 */
router.post('/', protectAdmin, createProduct);

/**
 * @route   PUT /api/products/:id
 * @desc    Update product
 * @access  Admin Only
 */
router.put('/:id', protectAdmin, updateProduct);

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete product
 * @access  Admin Only
 */
router.delete('/:id', protectAdmin, deleteProduct);

export default router;