import { createAsyncThunk } from '@reduxjs/toolkit';
import * as productService from './productService';
import toast from 'react-hot-toast';

// ========================================
// GET ALL PRODUCTS
// ========================================
export const getProductsThunk = createAsyncThunk(
  'products/getAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await productService.getProducts(params);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch products';
      return rejectWithValue(message);
    }
  }
);

// ========================================
// GET PRODUCT BY ID
// ========================================
export const getProductByIdThunk = createAsyncThunk(
  'products/getById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await productService.getProductById(id);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch product';
      return rejectWithValue(message);
    }
  }
);

// ========================================
// GET PRODUCT BY SLUG
// ========================================
export const getProductBySlugThunk = createAsyncThunk(
  'products/getBySlug',
  async (slug, { rejectWithValue }) => {
    try {
      const response = await productService.getProductBySlug(slug);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch product';
      return rejectWithValue(message);
    }
  }
);

// ========================================
// GET PRODUCTS BY CATEGORY
// ========================================
export const getProductsByCategoryThunk = createAsyncThunk(
  'products/getByCategory',
  async ({ categoryId, params }, { rejectWithValue }) => {
    try {
      const response = await productService.getProductsByCategory(categoryId, params);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch products';
      return rejectWithValue(message);
    }
  }
);

// ========================================
// CREATE PRODUCT (Admin)
// ========================================
export const createProductThunk = createAsyncThunk(
  'products/create',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await productService.createProduct(productData);
      toast.success('Product created successfully!');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create product';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// ========================================
// UPDATE PRODUCT (Admin)
// ========================================
export const updateProductThunk = createAsyncThunk(
  'products/update',
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const response = await productService.updateProduct(id, productData);
      toast.success('Product updated successfully!');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update product';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// ========================================
// DELETE PRODUCT (Admin)
// ========================================
export const deleteProductThunk = createAsyncThunk(
  'products/delete',
  async (id, { rejectWithValue }) => {
    try {
      await productService.deleteProduct(id);
      toast.success('Product deleted successfully!');
      return id;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete product';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);