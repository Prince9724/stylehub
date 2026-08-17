import api from '../../api/axios';

// Get Cart
export const getCart = async () => {
  const response = await api.get('/cart');
  return response.data;
};

// Get Cart Count
export const getCartCount = async () => {
  const response = await api.get('/cart/count');
  return response.data;
};

// Add to Cart ✅ (ये function missing था)
export const addToCart = async (productId, quantity, color, size) => {
  const response = await api.post('/cart', { productId, quantity, color, size });
  return response.data;
};

// Update Cart Item
export const updateCartItem = async (itemId, quantity, color, size) => {
  const response = await api.put(`/cart/${itemId}`, { quantity, color, size });
  return response.data;
};

// Remove from Cart
export const removeFromCart = async (itemId) => {
  const response = await api.delete(`/cart/${itemId}`);
  return response.data;
};

// Clear Cart
export const clearCart = async () => {
  const response = await api.delete('/cart');
  return response.data;
};