import { createSlice } from '@reduxjs/toolkit';
import {
  createOrderThunk,
  getMyOrdersThunk,
  getOrderByIdThunk,
  cancelOrderThunk,
  getAllOrdersThunk,
  updateOrderStatusThunk
} from './orderThunks';

const initialState = {
  orders: [],
  selectedOrder: null,
  isLoading: false,
  error: null,
  total: 0,
  page: 1,
  totalPages: 1,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
    },
    resetOrders: (state) => {
      state.orders = [];
      state.selectedOrder = null;
      state.total = 0;
      state.page = 1;
      state.totalPages = 1;
    },
  },
  extraReducers: (builder) => {
    // ========== CREATE ORDER ==========
    builder
      .addCase(createOrderThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrderThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders.unshift(action.payload?.data);
        state.selectedOrder = action.payload?.data;
      })
      .addCase(createOrderThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

    // ========== GET MY ORDERS ==========
      .addCase(getMyOrdersThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMyOrdersThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload?.data || [];
        state.total = action.payload?.total || 0;
        state.page = action.payload?.page || 1;
        state.totalPages = action.payload?.totalPages || 1;
      })
      .addCase(getMyOrdersThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

    // ========== GET ORDER BY ID ==========
      .addCase(getOrderByIdThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrderByIdThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedOrder = action.payload?.data || null;
      })
      .addCase(getOrderByIdThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

    // ========== CANCEL ORDER ==========
      .addCase(cancelOrderThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(cancelOrderThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const cancelledOrder = action.payload?.data;
        const index = state.orders.findIndex(o => o._id === cancelledOrder?._id);
        if (index !== -1) {
          state.orders[index] = cancelledOrder;
        }
        if (state.selectedOrder?._id === cancelledOrder?._id) {
          state.selectedOrder = cancelledOrder;
        }
      })
      .addCase(cancelOrderThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

    // ========== GET ALL ORDERS (Admin) - NEW ==========
      .addCase(getAllOrdersThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllOrdersThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload?.data || [];
        state.total = action.payload?.total || 0;
        state.page = action.payload?.page || 1;
        state.totalPages = action.payload?.totalPages || 1;
      })
      .addCase(getAllOrdersThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

    // ========== UPDATE ORDER STATUS (Admin) - NEW ==========
      .addCase(updateOrderStatusThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateOrderStatusThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedOrder = action.payload?.data;
        const index = state.orders.findIndex(o => o._id === updatedOrder?._id);
        if (index !== -1) {
          state.orders[index] = updatedOrder;
        }
        if (state.selectedOrder?._id === updatedOrder?._id) {
          state.selectedOrder = updatedOrder;
        }
      })
      .addCase(updateOrderStatusThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSelectedOrder, resetOrders } = orderSlice.actions;
export default orderSlice.reducer;