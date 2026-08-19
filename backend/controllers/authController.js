  import jwt from 'jsonwebtoken';
  import Admin from '../models/Admin.js';
  import Customer from '../models/Customer.js';
  import OTP from '../models/OTP.js';
  import generateToken from '../utils/generateToken.js';
  import { sendOTPEmail } from '../services/email.service.js';

  // ========================================
  // ADMIN AUTH CONTROLLERS
  // ========================================

  // @desc    Admin Login
  // @route   POST /api/auth/admin/login
  // @access  Public
  export const adminLogin = async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Please provide email and password'
        });
      }

      const admin = await Admin.findOne({ email });
      if (!admin) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      const isPasswordMatch = await admin.comparePassword(password);
      if (!isPasswordMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      if (!admin.isActive) {
        return res.status(403).json({
          success: false,
          message: 'Your account has been deactivated'
        });
      }

      admin.lastLogin = new Date();
      await admin.save();

      const token = generateToken(
        customer._id,
        'admin',
        '15d'
      );

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 15 * 24 * 60 * 60 * 1000
      });

      // ✅ Return user directly
      res.status(200).json({
        success: true,
        message: 'Admin logged in successfully',
        user: {
          _id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          profileImage: admin.profileImage || '',
          isActive: admin.isActive,
          lastLogin: admin.lastLogin,
          createdAt: admin.createdAt,
          updatedAt: admin.updatedAt
        },
        token
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Server error'
      });
    }
  };

  // ========================================
  // CUSTOMER OTP AUTH CONTROLLERS
  // ========================================

  // @desc    Send OTP to customer email
  // @route   POST /api/auth/send-otp
  // @access  Public
  export const sendOTP = async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email is required'
        });
      }

      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Please enter a valid email address'
        });
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      await OTP.deleteMany({ email });

      await OTP.create({
        email,
        otp,
        expiresAt
      });

      const emailResult = await sendOTPEmail(email, otp);

      if (!emailResult.success) {
        console.log('⚠️ Email sending failed, OTP logged in console only');
      }

      console.log(`📧 OTP for ${email}: ${otp}`);

      res.status(200).json({
        success: true,
        message: 'OTP sent successfully to your email',
        data: {
          otp: process.env.NODE_ENV === 'development' ? otp : undefined
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Server error'
      });
    }
  };

  // @desc    Verify OTP and login/register customer
  // @route   POST /api/auth/verify-otp
  // @access  Public
  export const verifyOTP = async (req, res) => {
    try {
      const { email, otp, name } = req.body;

      // ✅ Validate
      if (!email || !otp) {
        return res.status(400).json({
          success: false,
          message: 'Email and OTP are required'
        });
      }

      // ✅ Email normalize
      const normalizedEmail = email.toLowerCase().trim();

      // ✅ OTP verify
      const otpRecord = await OTP.findOne({ email: normalizedEmail, otp });
      if (!otpRecord) {
        return res.status(400).json({
          success: false,
          message: 'Invalid OTP'
        });
      }

      if (otpRecord.expiresAt < new Date()) {
        return res.status(400).json({
          success: false,
          message: 'OTP has expired'
        });
      }

      if (otpRecord.isVerified) {
        return res.status(400).json({
          success: false,
          message: 'OTP already verified'
        });
      }

      // ✅ IMPORTANT: Pehle existing customer check karo
      let customer = await Customer.findOne({ email: normalizedEmail });

      console.log('🔍 Looking for customer:', normalizedEmail);
      console.log('🔍 Customer found:', customer ? '✅ YES (Existing)' : '❌ NO (New)');

      if (!customer) {
        // ✅ Naya customer tabhi banao jab exist nahi karta
        if (!name) {
          return res.status(400).json({
            success: false,
            message: 'Name is required for new customer'
          });
        }

        customer = await Customer.create({
          name,
          email: normalizedEmail,
          isVerified: true
        });
        console.log('✅ New customer created:', customer.email);
      } else {
        // ✅ Existing customer update karo (name change ho sakta hai)
        customer.isVerified = true;
        if (name) customer.name = name;
        await customer.save();
        console.log('✅ Existing customer logged in:', customer.email);
      }

      // ✅ OTP verified mark karo
      otpRecord.isVerified = true;
      otpRecord.verifiedAt = new Date();
      await otpRecord.save();

      // ✅ Last login update
      customer.lastLogin = new Date();
      await customer.save();

      // ✅ JWT Token (30 days)
      const token = generateToken(customer._id, 'customer', '30d');

      // ✅ Cookie set
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000
      });

      res.status(200).json({
        success: true,
        message: 'OTP verified successfully',
        user: {
          _id: customer._id,
          name: customer.name,
          email: customer.email,
          role: customer.role,
          isVerified: customer.isVerified,
          isActive: customer.isActive,
          profileImage: customer.profileImage || '',
          createdAt: customer.createdAt,
          updatedAt: customer.updatedAt
        },
        token
      });

    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: 'Customer already exists'
        });
      }
      console.error('❌ Verify OTP Error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Server error'
      });
    }
  };
  // ========================================
  // COMMON AUTH CONTROLLERS
  // ========================================

  // @desc    Logout user
  // @route   POST /api/auth/logout
  // @access  Public (with token)
  export const logout = async (req, res) => {
    try {
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });

      res.status(200).json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Server error'
      });
    }
  };

  // @desc    Get current logged in user
  // @route   GET /api/auth/me
  // @access  Private
  export const getCurrentUser = async (req, res) => {
    try {
      const token = req.cookies.token;

      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized'
        });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      let user = null;
      let role = null;

      if (decoded.role === 'admin') {
        user = await Admin.findById(decoded.id).select('-password');
        role = 'admin';
      } else if (decoded.role === 'customer') {
        user = await Customer.findById(decoded.id);
        role = 'customer';
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'User fetched successfully',
        data: {
          user,
          role
        }
      });
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token'
        });
      }
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expired'
        });
      }
      res.status(500).json({
        success: false,
        message: error.message || 'Server error'
      });
    }
  };

  // @desc    Check if user is authenticated
  // @route   GET /api/auth/check
  // @access  Private
  export const checkAuth = async (req, res) => {
    try {
      const token = req.cookies.token;

      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Not authenticated'
        });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      let user = null;
      let role = null;

      if (decoded.role === 'admin') {
        user = await Admin.findById(decoded.id).select('-password');
        role = 'admin';
      } else if (decoded.role === 'customer') {
        user = await Customer.findById(decoded.id);
        role = 'customer';
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Authenticated',
        data: {
          user,
          role,
          isAuthenticated: true
        }
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }
  };