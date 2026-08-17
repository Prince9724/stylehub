import { createSlice } from '@reduxjs/toolkit';
import {
  adminLoginThunk,
  sendOTPThunk,
  verifyOTPThunk,
  getCurrentUserThunk,
  logoutThunk
} from './authThunks';

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  otpSent: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setOTPSent: (state, action) => {
      state.otpSent = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.otpSent = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ✅ Admin Login
    builder
      .addCase(adminLoginThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(adminLoginThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload?.user;
        state.token = action.payload?.token;
        state.isAuthenticated = true;  // ✅ Yeh true hona chahiye
        state.error = null;
        console.log('✅ ADMIN LOGGED IN:', state.user);
        console.log('✅ ROLE:', state.user?.role);
      })  
      .addCase(adminLoginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // ✅ Send OTP
      .addCase(sendOTPThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.otpSent = false;
      })
      .addCase(sendOTPThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.otpSent = true;
        state.error = null;
      })
      .addCase(sendOTPThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.otpSent = false;
      })

      // ✅ Verify OTP (Customer Login)
      .addCase(verifyOTPThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // ✅ Verify OTP (Customer Login)
      .addCase(verifyOTPThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload?.user;
        state.token = action.payload?.token;
        state.isAuthenticated = true;
        state.otpSent = false;
        state.error = null;
        console.log('✅ USER LOGGED IN:', state.user);
        console.log('✅ USER ROLE:', state.user?.role);
      })
      .addCase(verifyOTPThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        console.log('❌ Verify OTP Failed:', action.payload);
      })

      // ✅ Get Current User (Auto Login)
      .addCase(getCurrentUserThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrentUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload?.user;
        state.isAuthenticated = true;
        console.log('✅ Auto-login user:', state.user?.email);
      })
      .addCase(getCurrentUserThunk.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })

      // ✅ Logout
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.otpSent = false;
        state.error = null;
        console.log('✅ Logged out');
      });
  },
});

export const { clearError, setOTPSent, logout } = authSlice.actions;
export default authSlice.reducer;