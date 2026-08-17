import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus
} from '../controllers/orderController.js';
import { protectCustomer, protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// ========================================
// CUSTOMER ROUTES (Protected)
// ========================================

router.post('/', protectCustomer, createOrder);
router.get('/my-orders', protectCustomer, getMyOrders);
router.get('/:id', protectCustomer, getOrderById);
router.put('/:id/cancel', protectCustomer, cancelOrder);

// ========================================
// ADMIN ROUTES (Protected)
// ========================================

router.get('/admin/all', protectAdmin, getAllOrders);
router.put('/:id/status', protectAdmin, updateOrderStatus);

console.log('✅ Order Routes Loaded');

export default router;