import { createSlice } from '@reduxjs/toolkit';

import {
  adminLoginThunk,
  sendOTPThunk,
  verifyOTPThunk,
  getCurrentUserThunk,
  logoutThunk,
  getCurrentAdminThunk
} from './authThunks';

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  otpSent: false,

  // ✅ OTP ke liye email Redux me save hoga
  otpEmail: '',
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

      // Back button dabane par OTP email bhi clear karo
      if (!action.payload) {
        state.otpEmail = '';
      }
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.otpSent = false;
      state.otpEmail = '';
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ========================================
      // ADMIN LOGIN
      // ========================================

      .addCase(adminLoginThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(adminLoginThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload?.user;
        state.token = action.payload?.token;
        state.isAuthenticated = true;
        state.error = null;

        console.log('✅ ADMIN LOGGED IN:', state.user);
      })

      .addCase(adminLoginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // ========================================
      // SEND OTP
      // ========================================

      .addCase(sendOTPThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.otpSent = false;
      })

      .addCase(sendOTPThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.otpSent = true;
        state.error = null;

        // ✅ VERY IMPORTANT
        // sendOTPThunk(email) ka email action.meta.arg me milta hai
        state.otpEmail = action.meta.arg;

        console.log('📧 OTP EMAIL SAVED:', state.otpEmail);
      })

      .addCase(sendOTPThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.otpSent = false;
        state.otpEmail = '';
      })

      // ========================================
      // VERIFY OTP
      // ========================================

      .addCase(verifyOTPThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(verifyOTPThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload?.user;
        state.token = action.payload?.token;
        state.isAuthenticated = true;

        // ✅ OTP complete
        state.otpSent = false;
        state.otpEmail = '';

        state.error = null;

        console.log('✅ USER LOGGED IN:', state.user);
      })

      .addCase(verifyOTPThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // ========================================
      // GET CURRENT USER
      // ========================================

      .addCase(getCurrentUserThunk.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(getCurrentUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;

        state.user = action.payload?.data?.user;
        state.isAuthenticated = true;

        console.log(
          '✅ Auto-login user:',
          state.user?.email
        );
      })

      .addCase(getCurrentUserThunk.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })

      // ========================================
      // LOGOUT
      // ========================================

      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.otpSent = false;
        state.otpEmail = '';
        state.error = null;

        console.log('✅ Logged out');
      })
        .addCase(getCurrentAdminThunk.pending, (state) => {
        state.isLoading = true;
      })

    .addCase(getCurrentAdminThunk.fulfilled, (state, action) => {
      state.isLoading = false;

      state.user =
        action.payload?.user ||
        action.payload?.data?.user;

      state.isAuthenticated = true;
      state.error = null;

      console.log('✅ ADMIN SESSION RESTORED:', state.user);
    })

    .addCase(getCurrentAdminThunk.rejected, (state, action) => {
      state.isLoading = false;

      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      state.error = action.payload;

      console.log('ℹ️ No active admin session');
    })

},
  });

export const {
  clearError,
  setOTPSent,
  logout
} = authSlice.actions;

export default authSlice.reducer;