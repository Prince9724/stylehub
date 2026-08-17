import { createSlice } from '@reduxjs/toolkit';
import {
  getProductsThunk,
  getProductByIdThunk,
  createProductThunk,
  updateProductThunk,
  deleteProductThunk
} from './productThunks';

const initialState = {
  products: [],
  selectedProduct: null,
  isLoading: false,
  error: null,
  total: 0,
  page: 1,
  totalPages: 1,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    // ========== GET ALL PRODUCTS ==========
    builder
      .addCase(getProductsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProductsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload?.data || [];
        state.total = action.payload?.total || 0;
        state.page = action.payload?.page || 1;
        state.totalPages = action.payload?.totalPages || 1;
      })
      .addCase(getProductsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

    // ========== GET PRODUCT BY ID ==========
      .addCase(getProductByIdThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProductByIdThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedProduct = action.payload?.data || null;
      })
      .addCase(getProductByIdThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

    // ========== CREATE PRODUCT ==========
      .addCase(createProductThunk.fulfilled, (state, action) => {
        state.products.unshift(action.payload?.data);
      })

    // ========== UPDATE PRODUCT ==========
      .addCase(updateProductThunk.fulfilled, (state, action) => {
        const updatedProduct = action.payload?.data;
        const index = state.products.findIndex(p => p._id === updatedProduct?._id);
        if (index !== -1) {
          state.products[index] = updatedProduct;
        }
        state.selectedProduct = updatedProduct;
      })

    // ========== DELETE PRODUCT ==========
      .addCase(deleteProductThunk.fulfilled, (state, action) => {
        state.products = state.products.filter(p => p._id !== action.payload);
      });
  },
});

export const { clearError, clearSelectedProduct } = productSlice.actions;
export default productSlice.reducer;