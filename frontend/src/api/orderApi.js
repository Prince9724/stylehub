import api from './axios';

// Create Order
export const createOrder = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

// Get My Orders
export const getMyOrders = async (page = 1, limit = 20) => {
  const response = await api.get('/orders/my-orders', { params: { page, limit } });
  return response.data;
};

// Get Order by ID
export const getOrderById = async (id) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

// Cancel Order
export const cancelOrder = async (id, reason) => {
  const response = await api.put(`/orders/${id}/cancel`, { cancellationReason: reason });
  return response.data;
};

// Admin: Get All Orders
export const getAllOrders = async (params = {}) => {
  const response = await api.get('/orders/admin/all', { params });
  return response.data;
};

// Admin: Update Order Status
export const updateOrderStatus = async (id, statusData) => {
  const response = await api.put(`/orders/${id}/status`, statusData);
  return response.data;
};