import { createSlice } from '@reduxjs/toolkit';
import {
  getCategoriesThunk,
  getCategoryByIdThunk,
  createCategoryThunk,
  updateCategoryThunk,
  deleteCategoryThunk
} from './categoryThunks';

const initialState = {
  categories: [],
  selectedCategory: null,
  isLoading: false,
  error: null,
};

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedCategory: (state) => {
      state.selectedCategory = null;
    },
  },
  extraReducers: (builder) => {
    // ========== GET ALL CATEGORIES ==========
    builder
      .addCase(getCategoriesThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCategoriesThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload?.data || [];
      })
      .addCase(getCategoriesThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

    // ========== GET CATEGORY BY ID ==========
      .addCase(getCategoryByIdThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCategoryByIdThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedCategory = action.payload?.data || null;
      })
      .addCase(getCategoryByIdThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

    // ========== CREATE CATEGORY ==========
      .addCase(createCategoryThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCategoryThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories.push(action.payload?.data);
      })
      .addCase(createCategoryThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

    // ========== UPDATE CATEGORY ==========
      .addCase(updateCategoryThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCategoryThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedCategory = action.payload?.data;
        const index = state.categories.findIndex(c => c._id === updatedCategory?._id);
        if (index !== -1) {
          state.categories[index] = updatedCategory;
        }
        state.selectedCategory = updatedCategory;
      })
      .addCase(updateCategoryThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

    // ========== DELETE CATEGORY ==========
      .addCase(deleteCategoryThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCategoryThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = state.categories.filter(c => c._id !== action.payload);
      })
      .addCase(deleteCategoryThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSelectedCategory } = categorySlice.actions;

// ✅ Default Export - ये जरूरी है
export default categorySlice.reducer;