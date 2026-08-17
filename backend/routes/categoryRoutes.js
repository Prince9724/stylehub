import express from 'express';
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  getCategoryBySlug,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// ========================================
// PUBLIC ROUTES
// ========================================

/**
 * @route   GET /api/categories
 * @desc    Get all categories
 * @access  Public
 */
router.get('/', getAllCategories);

/**
 * @route   GET /api/categories/slug/:slug
 * @desc    Get category by slug
 * @access  Public
 */
router.get('/slug/:slug', getCategoryBySlug);

/**
 * @route   GET /api/categories/:id
 * @desc    Get category by ID
 * @access  Public
 */
router.get('/:id', getCategoryById);

// ========================================
// ADMIN ROUTES (Protected)
// ========================================

/**
 * @route   POST /api/categories
 * @desc    Create category
 * @access  Admin Only
 */
router.post('/', protectAdmin, createCategory);

/**
 * @route   PUT /api/categories/:id
 * @desc    Update category
 * @access  Admin Only
 */
router.put('/:id', protectAdmin, updateCategory);

/**
 * @route   DELETE /api/categories/:id
 * @desc    Delete category
 * @access  Admin Only
 */
router.delete('/:id', protectAdmin, deleteCategory);

export default router;