import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { FiPackage, FiShoppingBag, FiUsers, FiDollarSign, FiPlusCircle, FiList } from 'react-icons/fi';
import { getProductsThunk } from '../features/products/productThunks';
import { getAllOrdersThunk } from '../features/orders/orderThunks';
import { getCategoriesThunk } from '../features/categories/categoryThunks';

const AdminDashboardPage = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { products } = useSelector((state) => state.products);
  const { orders } = useSelector((state) => state.orders);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔍 Dashboard - isAuthenticated:', isAuthenticated);
    console.log('🔍 Dashboard - user:', user);
    console.log('🔍 Dashboard - user role:', user?.role);

    // ✅ Agar user null hai toh wait karein
    if (!user) {
      console.log('⏳ Waiting for user...');
      return;
    }

    // ✅ Agar admin nahi hai toh login par redirect
    if (user?.role !== 'admin') {
      console.log('❌ Not admin, redirecting to login');
      navigate('/login', { replace: true });
      return;
    }

    // ✅ Admin verified - Load data
    setLoading(false);
    dispatch(getProductsThunk({ limit: 100 }));
    dispatch(getAllOrdersThunk({ limit: 100 }));
    dispatch(getCategoriesThunk());
  }, [user, navigate, dispatch]);

  // ✅ Loading state
  if (loading || !user || user?.role !== 'admin') {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="ml-4 text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  // ✅ Calculate stats
  const totalProducts = products?.length || 0;
  const totalOrders = orders?.filter(order => order.orderStatus !== 'cancelled').length || 0;
  const totalRevenue = orders
    ?.filter(order => order.orderStatus === 'delivered')
    .reduce((sum, order) => sum + (order.total || 0), 0) || 0;
  const totalCustomers = orders ? [...new Set(orders.map(o => o.customer?._id))].length : 0;

  const stats = [
    { title: 'Total Products', value: totalProducts, icon: FiPackage, color: 'bg-blue-500' },
    { title: 'Total Orders', value: totalOrders, icon: FiShoppingBag, color: 'bg-green-500' },
    { title: 'Total Customers', value: totalCustomers, icon: FiUsers, color: 'bg-purple-500' },
    { title: 'Total Revenue', value: `₹${totalRevenue}`, icon: FiDollarSign, color: 'bg-yellow-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome back, <span className="text-blue-600">{user?.name || 'Admin'}!</span>
        </h1>
        <p className="text-gray-500 mt-2">Manage your store from here.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="text-white text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link to="/admin/products" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition hover:border-blue-500 border-2 border-transparent">
          <FiPackage className="text-3xl text-blue-600 mb-2" />
          <h3 className="font-semibold text-lg">Products</h3>
          <p className="text-gray-500 text-sm">Manage your products</p>
        </Link>
        <Link to="/admin/categories" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition hover:border-green-500 border-2 border-transparent">
          <FiList className="text-3xl text-green-600 mb-2" />
          <h3 className="font-semibold text-lg">Categories</h3>
          <p className="text-gray-500 text-sm">Manage categories</p>
        </Link>
        <Link to="/admin/orders" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition hover:border-purple-500 border-2 border-transparent">
          <FiShoppingBag className="text-3xl text-purple-600 mb-2" />
          <h3 className="font-semibold text-lg">Orders</h3>
          <p className="text-gray-500 text-sm">View all orders</p>
        </Link>
        <Link to="/admin/products" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition hover:border-red-500 border-2 border-transparent">
          <FiPlusCircle className="text-3xl text-red-600 mb-2" />
          <h3 className="font-semibold text-lg">Add Product</h3>
          <p className="text-gray-500 text-sm">Add new product</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboardPage;