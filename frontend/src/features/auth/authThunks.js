import { createAsyncThunk } from '@reduxjs/toolkit';
import * as authService from './authService';
import toast from 'react-hot-toast';

// ✅ Admin Login
export const adminLoginThunk = createAsyncThunk(
  'auth/adminLogin',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await authService.adminLogin(email, password);
      console.log('🔍 Admin Login Response:', response);

      if (response?.success) {
        toast.success('Admin logged in successfully!');
        return response; // ✅ { success, user, token }
      } else {
        return rejectWithValue(response?.message || 'Login failed');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// ✅ Send OTP
export const sendOTPThunk = createAsyncThunk(
  'auth/sendOTP',
  async (email, { rejectWithValue }) => {
    try {
      const response = await authService.sendOTP(email);
      toast.success('OTP sent successfully!');
      return response;  // ✅ Directly return response
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send OTP';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// ✅ Verify OTP
export const verifyOTPThunk = createAsyncThunk(
  'auth/verifyOTP',
  async ({ email, otp, name }, { rejectWithValue }) => {
    try {
      const response = await authService.verifyOTP(email, otp, name);
      toast.success('OTP verified successfully!');
      return response;  // ✅ Directly return response
    } catch (error) {
      const message = error.response?.data?.message || 'OTP verification failed';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// ✅ Get Current User
export const getCurrentUserThunk = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getCurrentUser();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);
export const getCurrentAdminThunk = createAsyncThunk(
  'auth/getCurrentAdmin',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getCurrentAdmin();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Admin session expired'
      );
    }
  }
);
// ✅ Logout
export const logoutThunk = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logoutUser();
      toast.success('Logged out successfully!');
      return;
    } catch (error) {
      const message = error.response?.data?.message || 'Logout failed';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);