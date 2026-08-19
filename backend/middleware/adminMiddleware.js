// import jwt from 'jsonwebtoken';
// import Admin from '../models/Admin.js';

// export const protectAdmin = async (req, res, next) => {
//   try {
//     const token = req.cookies.token;

//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: 'Not authorized, please login'
//       });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     if (decoded.role !== 'admin') {
//       return res.status(403).json({
//         success: false,
//         message: 'Access denied. Admin only.'
//       });
//     }

//     const admin = await Admin.findById(decoded.id).select('-password');
//     if (!admin) {
//       return res.status(401).json({
//         success: false,
//         message: 'Admin not found'
//       });
//     }

//     req.admin = admin;
//     next();
//   } catch (error) {
//     return res.status(401).json({
//       success: false,
//       message: 'Invalid token'
//     });
//   }
// };

import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

export const protectAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, please login'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    const admin = await Admin.findById(decoded.id).select('-password');

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Admin not found'
      });
    }

    // Check if admin is still logged in
    if (!admin.isLoggedIn) {
      return res.status(401).json({
        success: false,
        message: 'Admin session has been revoked'
      });
    }

    // Check session ID
    if (!decoded.sessionId || decoded.sessionId !== admin.sessionId) {
      return res.status(401).json({
        success: false,
        message: 'Admin session is no longer valid'
      });
    }

    req.admin = admin;

    next();

  } catch (error) {
    console.error('Admin Auth Error:', error.message);

    return res.status(401).json({
      success: false,
      message: 'Invalid or expired admin session'
    });
  }
};