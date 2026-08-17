import api from '../../api/axios';

// ============================================
// ✅ CREATE ORDER
// ============================================
export const createOrder = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

// ============================================
// ✅ GET MY ORDERS (Customer Only)
// ============================================
export const getMyOrders = async (page = 1, limit = 20) => {
  const response = await api.get('/orders/my-orders', { params: { page, limit } });
  return response.data;
};

// ============================================
// ✅ GET ORDER BY ID
// ============================================
export const getOrderById = async (id) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

// ============================================
// ✅ CANCEL ORDER
// ============================================
export const cancelOrder = async (id, cancellationReason) => {
  const response = await api.put(`/orders/${id}/cancel`, { cancellationReason });
  return response.data;
};

// ============================================
// ✅ GET ALL ORDERS (Admin Only)
// ============================================
export const getAllOrders = async (params = {}) => {
  const response = await api.get('/orders/admin/all', { params });
  return response.data;
};

// ============================================
// ✅ UPDATE ORDER STATUS (Admin Only)
// ============================================
export const updateOrderStatus = async (id, statusData) => {
  const response = await api.put(`/orders/${id}/status`, statusData);
  return response.data;
};