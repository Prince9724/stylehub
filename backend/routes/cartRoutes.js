import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartCount
} from '../controllers/cartController.js';
import { protectCustomer } from '../middleware/authMiddleware.js';

const router = express.Router();

// ========================================
// ALL ROUTES ARE PROTECTED (Customer Only)
// ========================================

/**
 * @route   GET /api/cart
 * @desc    Get cart
 * @access  Customer Only
 */
router.get('/', protectCustomer, getCart);

/**
 * @route   GET /api/cart/count
 * @desc    Get cart item count
 * @access  Customer Only
 */
router.get('/count', protectCustomer, getCartCount);

/**
 * @route   POST /api/cart
 * @desc    Add item to cart
 * @access  Customer Only
 */
router.post('/', protectCustomer, addToCart);

/**
 * @route   PUT /api/cart/:itemId
 * @desc    Update cart item
 * @access  Customer Only
 */
router.put('/:itemId', protectCustomer, updateCartItem);

/**
 * @route   DELETE /api/cart/:itemId
 * @desc    Remove item from cart
 * @access  Customer Only
 */
router.delete('/:itemId', protectCustomer, removeFromCart);

/**
 * @route   DELETE /api/cart
 * @desc    Clear cart
 * @access  Customer Only
 */
router.delete('/', protectCustomer, clearCart);

export default router;