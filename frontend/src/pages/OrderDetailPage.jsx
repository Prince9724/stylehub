import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { getOrderByIdThunk } from '../features/orders/orderThunks';
import { FiTruck, FiCheckCircle, FiClock, FiPackage, FiXCircle } from 'react-icons/fi';

const OrderDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedOrder: order, isLoading } = useSelector((state) => state.orders);

  useEffect(() => {
    if (id) {
      dispatch(getOrderByIdThunk(id));
    }
  }, [dispatch, id]);

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <FiClock className="text-yellow-500 text-2xl" />;
      case 'confirmed': return <FiCheckCircle className="text-blue-500 text-2xl" />;
      case 'processing': return <FiPackage className="text-purple-500 text-2xl" />;
      case 'shipped': return <FiTruck className="text-indigo-500 text-2xl" />;
      case 'delivered': return <FiCheckCircle className="text-green-500 text-2xl" />;
      case 'cancelled': return <FiXCircle className="text-red-500 text-2xl" />;
      default: return <FiClock className="text-gray-500 text-2xl" />;
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

  const getStatusTimeline = (status) => {
    const steps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    const currentIndex = steps.indexOf(status);
    return steps.map((step, index) => ({
      label: step.charAt(0).toUpperCase() + step.slice(1),
      completed: index <= currentIndex,
      active: index === currentIndex
    }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-600">Order not found</h2>
        <Link to="/orders" className="text-blue-600 hover:underline mt-4 block">
          Back to Orders
        </Link>
      </div>
    );
  }

  const timeline = getStatusTimeline(order.orderStatus);

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/orders" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
        ← Back to Orders
      </Link>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">Order #{order.orderId}</h1>
            <p className="text-gray-500 text-sm">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <div className="text-right">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${getStatusColor(order.orderStatus)}`}>
              {getStatusIcon(order.orderStatus)}
              {order.orderStatus.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* ✅ Tracking Timeline */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <FiTruck /> Order Tracking
        </h2>

        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          
          {timeline.map((step, index) => (
            <div key={step.label} className="flex items-start gap-4 mb-6 relative">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                step.completed ? 'bg-green-500' : 'bg-gray-200'
              }`}>
                {step.completed ? (
                  <FiCheckCircle className="text-white" />
                ) : (
                  <span className="text-gray-400 text-sm">{index + 1}</span>
                )}
              </div>
              <div className={`flex-1 ${step.active ? 'font-semibold' : 'text-gray-500'}`}>
                <p>{step.label}</p>
                {step.active && (
                  <p className="text-sm text-blue-600">Current Status</p>
                )}
                {step.completed && step.label === 'Delivered' && (
                  <p className="text-sm text-green-600">✓ Completed</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {order.trackingNumber && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Tracking Number:</span> {order.trackingNumber}
            </p>
          </div>
        )}
      </div>

      {/* Items */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-bold mb-4">Items</h2>
        {order.items?.map((item) => (
          <div key={item._id} className="flex items-center gap-4 border-b pb-4 last:border-0">
            <img
              src={item.image || 'https://via.placeholder.com/60'}
              alt={item.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-500">
                Qty: {item.quantity} × ₹{item.price}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold">₹{item.total}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-bold mb-4">Order Summary</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span>₹{order.subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping</span>
            <span>₹{order.shippingCharges || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tax</span>
            <span>₹{order.tax || 0}</span>
          </div>
          <div className="flex justify-between text-xl font-bold pt-2 border-t">
            <span>Total</span>
            <span className="text-blue-600">₹{order.total}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;