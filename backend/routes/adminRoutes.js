    import express from 'express';
    import { 
    adminSendOTP, 
    adminVerifyOTP,
    adminLogin
    } from '../controllers/adminController.js';
    import { protectAdmin } from '../middleware/authMiddleware.js';

    const router = express.Router();

    // ✅ Admin OTP Flow (No authentication required)
    router.post('/send-otp', adminSendOTP);
    router.post('/verify-otp', adminVerifyOTP);
    router.post('/login', adminLogin);

    // ✅ Admin Protected Routes
    router.get('/dashboard', protectAdmin, (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to Admin Dashboard',
        user: req.admin
    });
    });

    export default router;