import api from './axios';

// ✅ Admin Login
export const adminLogin = async (email, password) => {
  const response = await api.post('/auth/admin/login', { email, password });
  return response.data;
};

// ✅ Send OTP
export const sendOTP = async (email) => {
  const response = await api.post('/auth/send-otp', { email });
  return response.data;
};

// ✅ Verify OTP
export const verifyOTP = async (email, otp, name) => {
  const response = await api.post('/auth/verify-otp', { email, otp, name });
  return response.data;
};

// ✅ Get Current User
export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// ✅ Logout
export const logoutUser = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};