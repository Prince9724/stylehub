import { createAsyncThunk } from '@reduxjs/toolkit';
import * as orderService from './orderService';
import toast from 'react-hot-toast';

// ============================================
// ✅ CREATE ORDER
// ============================================
export const createOrderThunk = createAsyncThunk(
  'orders/create',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await orderService.createOrder(orderData);
      toast.success('Order placed successfully!');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to place order';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// ============================================
// ✅ GET MY ORDERS (Customer Only)
// ============================================
export const getMyOrdersThunk = createAsyncThunk(
  'orders/getMyOrders',
  async ({ page = 1, limit = 20 } = {}, { rejectWithValue }) => {
    try {
      const response = await orderService.getMyOrders(page, limit);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch orders';
      return rejectWithValue(message);
    }
  }
);

// ============================================
// ✅ GET ORDER BY ID
// ============================================
export const getOrderByIdThunk = createAsyncThunk(
  'orders/getById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await orderService.getOrderById(id);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch order';
      return rejectWithValue(message);
    }
  }
);

// ============================================
// ✅ CANCEL ORDER
// ============================================
export const cancelOrderThunk = createAsyncThunk(
  'orders/cancel',
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const response = await orderService.cancelOrder(id, reason);
      toast.success('Order cancelled successfully!');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to cancel order';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// ============================================
// ✅ GET ALL ORDERS (Admin Only)
// ============================================
export const getAllOrdersThunk = createAsyncThunk(
  'orders/getAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await orderService.getAllOrders(params);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch orders';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// ============================================
// ✅ UPDATE ORDER STATUS (Admin Only)
// ============================================
export const updateOrderStatusThunk = createAsyncThunk(
  'orders/updateStatus',
  async ({ id, statusData }, { rejectWithValue }) => {
    try {
      const response = await orderService.updateOrderStatus(id, statusData);
      toast.success('Order status updated successfully!');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update order status';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);