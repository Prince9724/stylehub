import Admin from '../models/Admin.js';
import generateToken from '../utils/generateToken.js';
import { sendOTPEmail } from '../services/email.service.js';

// ✅ Send OTP to Admin Email
// ✅ Admin OTP Send - If you need separate admin OTP
export const adminSendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // ✅ Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    admin.otp = otp;
    admin.otpExpires = otpExpires;
    await admin.save();

    // ✅ Send OTP via Email
    const result = await sendOTPEmail(email, otp, admin.name);
    
    if (result.success) {
      console.log(`📧 Admin OTP: ${otp}`);
    }

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ✅ Verify OTP + Mobile + Password
export const adminVerifyOTP = async (req, res) => {
  try {
    const { email, otp, mobile, password } = req.body;

    if (!email || !otp || !mobile || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email, OTP, Mobile and Password are required'
      });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    if (admin.otp !== otp || admin.otpExpires < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    admin.mobile = mobile;
    admin.password = password;
    admin.otp = undefined;
    admin.otpExpires = undefined;
    admin.lastLogin = new Date();
    await admin.save();

    const token = generateToken(admin._id, 'admin', '7d');

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      success: true,
      message: 'Admin verified successfully',
      user: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        mobile: admin.mobile,
        role: 'admin'
      },
      token
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ✅ Admin Login (After OTP)
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    admin.lastLogin = new Date();
    await admin.save();

    const token = generateToken(admin._id, 'admin', '15d');

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      message: 'Admin logged in successfully',
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        mobile: admin.mobile,
        role: 'admin'
      },
      token
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
export const getCurrentAdmin = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: {
        id: req.admin._id,
        name: req.admin.name,
        email: req.admin.email,
        mobile: req.admin.mobile,
        role: 'admin'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};