import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getMyOrdersThunk, cancelOrderThunk } from '../features/orders/orderThunks';
import toast from 'react-hot-toast';

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { orders, isLoading } = useSelector((state) => state.orders);
  const [currentPage] = useState(1);

  useEffect(() => {
    dispatch(getMyOrdersThunk({ page: currentPage, limit: 10 }));
  }, [dispatch, currentPage]);

  // ✅ Cancel Order Function
  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      const result = await dispatch(cancelOrderThunk({ 
        id: orderId, 
        reason: 'Cancelled by customer' 
      }));
      if (result.payload?.success) {
        toast.success('Order cancelled successfully!');
        dispatch(getMyOrdersThunk({ page: currentPage, limit: 10 }));
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-600 mb-4">No Orders Yet</h2>
        <Link to="/products" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Order Header */}
            <div className="p-4 bg-gray-50 border-b flex flex-wrap justify-between items-center">
              <div>
                <span className="font-semibold">Order #{order.orderId}</span>
                <span className="text-sm text-gray-500 ml-4">
                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                  {order.orderStatus.toUpperCase()}
                </span>
                <span className="text-sm font-bold">₹{order.total}</span>
              </div>
            </div>

            {/* Order Items */}
            <div className="p-4">
              {order.items.map((item) => (
                <div key={item._id} className="flex items-center gap-4 py-3 border-b last:border-b-0">
                  <img
                    src={item.image || 'https://via.placeholder.com/60'}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">₹{item.total}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Footer - ✅ Cancel Button */}
            <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
              <div className="text-sm text-gray-500">
                <span>Payment: {order.paymentMethod.toUpperCase()}</span>
                <span className="ml-4">Status: {order.paymentStatus}</span>
              </div>
              <div className="flex gap-4">
                <Link to={`/orders/${order._id}`} className="text-blue-600 hover:underline text-sm">
                  View Details →
                </Link>
                {/* ✅ Cancel Button - Only for pending orders */}
                {order.orderStatus === 'pending' && (
                  <button
                    onClick={() => handleCancelOrder(order._id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;