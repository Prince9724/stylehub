// import api from '../../api/axios';

// // ========================================
// // ADMIN LOGIN
// // ========================================

// export const adminLogin = async (email, password) => {
//   const response = await api.post('/admin/login', {
//     email,
//     password,
//   });

//   return response.data;
// };

// // ========================================
// // ADMIN CURRENT USER
// // ========================================

// export const getCurrentAdmin = async () => {
//   const response = await api.get('/admin/dashboard');

//   return response.data;
// };

// // ========================================
// // CUSTOMER SEND OTP
// // ========================================

// export const sendOTP = async (email) => {
//   const response = await api.post('/auth/send-otp', {
//     email,
//   });

//   return response.data;
// };

// // ========================================
// // CUSTOMER VERIFY OTP
// // ========================================

// export const verifyOTP = async (email, otp, name) => {
//   const response = await api.post('/auth/verify-otp', {
//     email,
//     otp,
//     name,
//   });

//   return response.data;
// };

// // ========================================
// // CUSTOMER CURRENT USER
// // ========================================

// export const getCurrentUser = async () => {
//   const response = await api.get('/auth/me');

//   return response.data;
// };

// // ========================================
// // LOGOUT
// // ========================================

// export const logoutUser = async () => {
//   const response = await api.post('/auth/logout');

//   return response.data;
// };
import api from '../../api/axios';

// ========================================
// CUSTOMER
// ========================================

export const sendOTP = async (email) => {
  const response = await api.post('/auth/send-otp', { email });
  return response.data;
};

export const verifyOTP = async (email, otp, name) => {
  const response = await api.post('/auth/verify-otp', {
    email,
    otp,
    name
  });

  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// ========================================
// ADMIN
// ========================================

export const adminLogin = async (email, password) => {
  const response = await api.post('/admin/login', {
    email,
    password
  });

  return response.data;
};

export const getCurrentAdmin = async () => {
  const response = await api.get('/admin/me');
  return response.data;
};

// ========================================
// LOGOUT
// ========================================

export const logoutUser = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};