import express from 'express';
import {
  sendOTP,
  verifyOTP,
  logout,
  getCurrentUser,
  checkAuth
} from '../controllers/authController.js';
import { protectCustomer } from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ Customer OTP Flow
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/logout', logout);
router.get('/me', protectCustomer, getCurrentUser);
router.get('/check', checkAuth);

export default router;