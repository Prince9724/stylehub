import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { getAllOrdersThunk, updateOrderStatusThunk } from '../features/orders/orderThunks';
import toast from 'react-hot-toast';
import { FiEye, FiPackage, FiTruck, FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi';

const AdminOrdersPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, isLoading } = useSelector((state) => state.orders);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');

  useEffect(() => {
    // ✅ Admin check
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/login');
      return;
    }
    dispatch(getAllOrdersThunk({ limit: 100 }));
  }, [dispatch, isAuthenticated, user, navigate]);

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

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <FiClock className="text-yellow-500" />;
      case 'confirmed': return <FiCheckCircle className="text-blue-500" />;
      case 'processing': return <FiPackage className="text-purple-500" />;
      case 'shipped': return <FiTruck className="text-indigo-500" />;
      case 'delivered': return <FiCheckCircle className="text-green-500" />;
      case 'cancelled': return <FiXCircle className="text-red-500" />;
      default: return <FiClock className="text-gray-500" />;
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: '⏳ Pending',
      confirmed: '✅ Confirmed',
      processing: '⚙️ Processing',
      shipped: '🚚 Shipped',
      delivered: '📦 Delivered',
      cancelled: '❌ Cancelled'
    };
    return labels[status] || status;
  };

  const handleStatusUpdate = async (orderId) => {
    if (!statusUpdate) {
      toast.error('Please select a status');
      return;
    }

    const statusData = {
      orderStatus: statusUpdate,
      adminNotes: `Order ${statusUpdate} by admin`
    };

    // ✅ If shipped, add tracking number
    if (statusUpdate === 'shipped' && trackingNumber) {
      statusData.trackingNumber = trackingNumber;
    }

    await dispatch(updateOrderStatusThunk({ 
      id: orderId, 
      statusData 
    }));
    
    toast.success(`Order ${statusUpdate}!`);
    setSelectedOrder(null);
    setStatusUpdate('');
    setTrackingNumber('');
    dispatch(getAllOrdersThunk({ limit: 100 }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">📦 Manage Orders</h1>
      <p className="text-gray-500 mb-6">Total Orders: {orders?.length || 0}</p>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders?.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    No orders yet
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-sm">{order.orderId}</td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium">{order.customer?.name || 'Unknown'}</div>
                        <div className="text-xs text-gray-500">{order.customer?.email || ''}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {order.items?.length || 0} items
                    </td>
                    <td className="px-6 py-4 font-bold">₹{order.total}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusColor(order.orderStatus)}`}>
                        {getStatusIcon(order.orderStatus)}
                        {getStatusLabel(order.orderStatus)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                        {order.paymentMethod.toUpperCase()} - {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Link
                          to={`/orders/${order._id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <FiEye className="inline" /> View
                        </Link>
                        {order.orderStatus !== 'delivered' && order.orderStatus !== 'cancelled' && (
                          <button
                            onClick={() => setSelectedOrder(order._id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Update
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ Status Update Modal - Admin Order Process */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Update Order Status</h3>
            <p className="text-sm text-gray-500 mb-4">Select new status for order</p>
            
            <select
              value={statusUpdate}
              onChange={(e) => setStatusUpdate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
            >
              <option value="">Select Status</option>
              <option value="confirmed">✅ Confirm Order</option>
              <option value="processing">⚙️ Processing</option>
              <option value="shipped">🚚 Shipped</option>
              <option value="delivered">📦 Delivered</option>
              <option value="cancelled">❌ Cancelled</option>
            </select>

            {/* ✅ Tracking Number - Show when shipped */}
            {statusUpdate === 'shipped' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Tracking Number</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => handleStatusUpdate(selectedOrder)}
                disabled={!statusUpdate}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Update
              </button>
              <button
                onClick={() => {
                  setSelectedOrder(null);
                  setStatusUpdate('');
                  setTrackingNumber('');
                }}
                className="flex-1 bg-gray-300 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;