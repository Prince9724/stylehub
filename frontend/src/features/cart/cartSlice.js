import { createSlice } from '@reduxjs/toolkit';
import {
  getCartThunk,
  addToCartThunk,
  updateCartItemThunk,
  removeFromCartThunk,
  clearCartThunk
} from './cartThunks';

const initialState = {
  items: [],
  subtotal: 0,
  discount: 0,
  total: 0,
  count: 0,
  isLoading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetCart: (state) => {
      state.items = [];
      state.subtotal = 0;
      state.discount = 0;
      state.total = 0;
      state.count = 0;
    }
  },
  extraReducers: (builder) => {
    // ========== GET CART ==========
    builder
      .addCase(getCartThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCartThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload?.items || [];
        state.subtotal = action.payload?.subtotal || 0;
        state.discount = action.payload?.discount || 0;
        state.total = action.payload?.total || 0;
        state.count = action.payload?.items?.length || 0;
      })
      .addCase(getCartThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

    // ========== ADD TO CART ==========
      .addCase(addToCartThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToCartThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload?.items || [];
        state.subtotal = action.payload?.subtotal || 0;
        state.discount = action.payload?.discount || 0;
        state.total = action.payload?.total || 0;
        state.count = action.payload?.items?.length || 0;
      })
      .addCase(addToCartThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

    // ========== UPDATE CART ITEM ==========
      .addCase(updateCartItemThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCartItemThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload?.items || [];
        state.subtotal = action.payload?.subtotal || 0;
        state.discount = action.payload?.discount || 0;
        state.total = action.payload?.total || 0;
        state.count = action.payload?.items?.length || 0;
      })
      .addCase(updateCartItemThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

    // ========== REMOVE FROM CART ==========
      .addCase(removeFromCartThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeFromCartThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload?.items || [];
        state.subtotal = action.payload?.subtotal || 0;
        state.discount = action.payload?.discount || 0;
        state.total = action.payload?.total || 0;
        state.count = action.payload?.items?.length || 0;
      })
      .addCase(removeFromCartThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

    // ========== CLEAR CART ==========
      .addCase(clearCartThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(clearCartThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.items = [];
        state.subtotal = 0;
        state.discount = 0;
        state.total = 0;
        state.count = 0;
      })
      .addCase(clearCartThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, resetCart } = cartSlice.actions;
export default cartSlice.reducer;