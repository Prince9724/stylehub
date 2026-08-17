import { createAsyncThunk } from '@reduxjs/toolkit';
import * as cartService from './cartService';
import toast from 'react-hot-toast';

// ========================================
// GET CART
// ========================================
export const getCartThunk = createAsyncThunk(
  'cart/getCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartService.getCart();
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch cart';
      return rejectWithValue(message);
    }
  }
);

// ========================================
// GET CART COUNT
// ========================================
export const getCartCountThunk = createAsyncThunk(
  'cart/getCartCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartService.getCartCount();
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch cart count';
      return rejectWithValue(message);
    }
  }
);

// ========================================
// ADD TO CART ✅ (ये export missing था)
// ========================================
export const addToCartThunk = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity, color, size }, { rejectWithValue }) => {
    try {
      const response = await cartService.addToCart(productId, quantity, color, size);
      toast.success('Item added to cart!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add to cart';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// ========================================
// UPDATE CART ITEM
// ========================================
export const updateCartItemThunk = createAsyncThunk(
  'cart/updateCartItem',
  async ({ itemId, quantity, color, size }, { rejectWithValue }) => {
    try {
      const response = await cartService.updateCartItem(itemId, quantity, color, size);
      toast.success('Cart updated!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update cart';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// ========================================
// REMOVE FROM CART
// ========================================
export const removeFromCartThunk = createAsyncThunk(
  'cart/removeFromCart',
  async (itemId, { rejectWithValue }) => {
    try {
      const response = await cartService.removeFromCart(itemId);
      toast.success('Item removed from cart');
      return { ...response.data, itemId };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to remove item';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// ========================================
// CLEAR CART
// ========================================
export const clearCartThunk = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartService.clearCart();
      toast.success('Cart cleared!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to clear cart';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);