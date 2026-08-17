import { createAsyncThunk } from '@reduxjs/toolkit';
import * as categoryService from './categoryService';
import toast from 'react-hot-toast';

// ========================================
// GET ALL CATEGORIES
// ========================================
export const getCategoriesThunk = createAsyncThunk(
  'categories/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await categoryService.getCategories();
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch categories';
      return rejectWithValue(message);
    }
  }
);

// ========================================
// GET CATEGORY BY ID
// ========================================
export const getCategoryByIdThunk = createAsyncThunk(
  'categories/getById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await categoryService.getCategoryById(id);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch category';
      return rejectWithValue(message);
    }
  }
);

// ========================================
// CREATE CATEGORY
// ========================================
export const createCategoryThunk = createAsyncThunk(
  'categories/create',
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await categoryService.createCategory(categoryData);
      toast.success('Category created successfully!');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create category';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// ========================================
// UPDATE CATEGORY
// ========================================
export const updateCategoryThunk = createAsyncThunk(
  'categories/update',
  async ({ id, categoryData }, { rejectWithValue }) => {
    try {
      const response = await categoryService.updateCategory(id, categoryData);
      toast.success('Category updated successfully!');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update category';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// ========================================
// DELETE CATEGORY
// ========================================
export const deleteCategoryThunk = createAsyncThunk(
  'categories/delete',
  async (id, { rejectWithValue }) => {
    try {
      await categoryService.deleteCategory(id);
      toast.success('Category deleted successfully!');
      return id;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete category';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);