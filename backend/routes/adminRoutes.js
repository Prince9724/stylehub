import express from 'express';

import {
  adminSendOTP,
  adminVerifyOTP,
  adminLogin,
  getCurrentAdmin
} from '../controllers/adminController.js';

import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();


// ========================================
// ADMIN AUTH
// ========================================

router.post('/send-otp', adminSendOTP);

router.post('/verify-otp', adminVerifyOTP);

router.post('/login', adminLogin);

// ========================================
// CURRENT ADMIN
// ========================================

router.get(
  '/me',
  protectAdmin,
  getCurrentAdmin
);


// ========================================
// ADMIN DASHBOARD API
// ========================================

router.get(
  '/dashboard',
  protectAdmin,
  (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Welcome to Admin Dashboard',
      user: req.admin
    });
  }
);


export default router;