import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logoutThunk } from '../features/auth/authThunks';
import toast from 'react-hot-toast';
import { FiUser, FiPackage, FiShoppingBag, FiLogOut, FiEdit, FiArrowLeft } from 'react-icons/fi';

const ProfilePage = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { orders } = useSelector((state) => state.orders);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    mobile: user?.mobile || ''
  });

  if (!isAuthenticated || !user) {
    navigate('/login');
    return null;
  }

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    navigate('/login');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    // TODO: API call to update profile
    toast.success('Profile updated successfully!');
    setIsEditing(false);
  };

  // Get user orders count
  const orderCount = orders?.length || 0;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <Link to="/" className="text-blue-600 hover:text-blue-800 flex items-center gap-2">
          <FiArrowLeft /> Back to Home
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FiUser className="text-4xl text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg">{user?.name || 'User'}</h3>
              <p className="text-gray-500 text-sm">{user?.email || ''}</p>
              <p className="text-xs text-gray-400 mt-1">
                {user?.role === 'admin' ? '👑 Admin' : '👤 Customer'}
              </p>
            </div>

            <div className="border-t pt-4 space-y-2">
              <Link
                to="/profile"
                className="flex items-center gap-3 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg"
              >
                <FiUser /> My Profile
              </Link>
              <Link
                to="/orders"
                className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition"
              >
                <FiShoppingBag /> My Orders
              </Link>
              {user?.role === 'admin' && (
                <>
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition"
                  >
                    <FiPackage /> Admin Dashboard
                  </Link>
                  <Link
                    to="/admin/products"
                    className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition"
                  >
                    <FiEdit /> Manage Products
                  </Link>
                </>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition w-full text-left"
              >
                <FiLogOut /> Logout
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3">
          {/* Profile Info */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">My Profile</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <FiEdit /> {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mobile</label>
                  <input
                    type="text"
                    value={profileData.mobile}
                    onChange={(e) => setProfileData({ ...profileData, mobile: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Save Changes
                </button>
              </form>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="font-medium w-24 text-gray-500">Name:</span>
                  <span>{user?.name || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium w-24 text-gray-500">Email:</span>
                  <span>{user?.email || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium w-24 text-gray-500">Mobile:</span>
                  <span>{user?.mobile || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium w-24 text-gray-500">Role:</span>
                  <span className="capitalize">{user?.role || 'customer'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium w-24 text-gray-500">Orders:</span>
                  <span>{orderCount}</span>
                </div>
              </div>
            )}
          </div>

          {/* Recent Orders */}
          {orderCount > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold mb-4">Recent Orders</h3>
              <div className="space-y-2">
                {orders.slice(0, 3).map((order) => (
                  <Link
                    key={order._id}
                    to={`/orders/${order._id}`}
                    className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50 transition"
                  >
                    <div>
                      <p className="font-medium">Order #{order.orderId}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">₹{order.total}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </div>
                  </Link>
                ))}
                {orderCount > 3 && (
                  <Link to="/orders" className="text-blue-600 hover:text-blue-800 text-sm">
                    View all orders →
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;