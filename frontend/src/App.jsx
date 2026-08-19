import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';

import {
  getCurrentUserThunk,
  getCurrentAdminThunk
} from './features/auth/authThunks';

import Header from './components/common/Header';
import Footer from './components/common/Footer';

import Home from './pages/Home';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import LoginPage from './pages/LoginPage';
import VerifyOTPPage from './pages/VerifyOTPPage';
import ProfilePage from './pages/ProfilePage';
import AdminLoginPage from './pages/AdminLoginPage';
import OrderDetailPage from './pages/OrderDetailPage';

import AdminDashboardPage from './admin/AdminDashboardPage';
import AdminProductsPage from './admin/AdminProductsPage';
import AdminCategoriesPage from './admin/AdminCategoriesPage';
import AdminOrdersPage from './admin/AdminOrdersPage';


// ========================================
// CUSTOMER PROTECTED ROUTE
// ========================================

const ProtectedRoute = ({ children }) => {

  const {
    isAuthenticated,
    isLoading,
    user
  } = useSelector((state) => state.auth);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};


// ========================================
// ADMIN PROTECTED ROUTE
// ========================================

const AdminProtectedRoute = ({ children }) => {

  const {
    isAuthenticated,
    isLoading,
    user
  } = useSelector((state) => state.auth);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="text-2xl font-bold">
            Loading Admin Dashboard...
          </div>

          <p className="text-gray-500 mt-2">
            Checking admin session
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to="/super-secret-admin-gate-cbs"
        replace
      />
    );
  }

  if (user.role !== 'admin') {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return children;
};


// ========================================
// CUSTOMER PUBLIC ROUTE
// ========================================

const PublicRoute = ({ children }) => {

  const {
    isAuthenticated,
    isLoading,
    user
  } = useSelector((state) => state.auth);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (isAuthenticated && user) {
    return <Navigate to="/" replace />;
  }

  return children;
};


// ========================================
// ADMIN LOGIN ROUTE
// ========================================

const AdminPublicRoute = ({ children }) => {

  const {
    isAuthenticated,
    isLoading,
    user
  } = useSelector((state) => state.auth);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (isAuthenticated && user?.role === 'admin') {
    return (
      <Navigate
        to="/admin/dashboard"
        replace
      />
    );
  }

  return children;
};


// ========================================
// APP
// ========================================

function App() {

  const dispatch = useDispatch();

  const [authChecked, setAuthChecked] = useState(false);

  const {
    isAuthenticated,
    isLoading
  } = useSelector((state) => state.auth);


  // ========================================
  // RESTORE SESSION
  // ========================================

  useEffect(() => {

    let mounted = true;

    const restoreSession = async () => {

      console.log('🔍 Checking existing login session...');

      try {

        // ========================================
        // 1. FIRST TRY ADMIN SESSION
        // ========================================

        try {

          const adminResult =
            await dispatch(
              getCurrentAdminThunk()
            ).unwrap();

          console.log(
            '✅ Admin session restored:',
            adminResult?.user
          );

          if (mounted) {
            setAuthChecked(true);
          }

          return;

        } catch (adminError) {

          console.log(
            'ℹ️ No active admin session'
          );

        }


        // ========================================
        // 2. THEN TRY CUSTOMER SESSION
        // ========================================

        try {

          const customerResult =
            await dispatch(
              getCurrentUserThunk()
            ).unwrap();

          console.log(
            '✅ Customer session restored:',
            customerResult?.data?.user
          );

        } catch (customerError) {

          console.log(
            'ℹ️ No active customer session'
          );

        }

      } finally {

        if (mounted) {
          setAuthChecked(true);
        }

      }

    };


    restoreSession();


    return () => {
      mounted = false;
    };

  }, [dispatch]);


  // ========================================
  // WAIT UNTIL SESSION CHECK COMPLETE
  // ========================================

  if (!authChecked) {

    return (
      <div className="flex justify-center items-center h-screen">

        <div className="text-center">

          <div className="text-2xl font-bold">
            Loading...
          </div>

          <p className="text-gray-500 mt-2">
            Checking login session...
          </p>

        </div>

      </div>
    );

  }


  return (

    <Router>

      <div className="min-h-screen flex flex-col bg-gray-50">

        <Header />

        <main className="flex-grow container mx-auto px-4 py-8">

          <Routes>


            {/* ========================================
                CUSTOMER LOGIN
            ======================================== */}

            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />

            <Route
              path="/verify-otp"
              element={
                <PublicRoute>
                  <VerifyOTPPage />
                </PublicRoute>
              }
            />


            {/* ========================================
                SECRET ADMIN LOGIN
            ======================================== */}

            <Route
              path="/super-secret-admin-gate-cbs"
              element={
                <AdminPublicRoute>
                  <AdminLoginPage />
                </AdminPublicRoute>
              }
            />


            {/* ========================================
                CUSTOMER ROUTES
            ======================================== */}

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />

            <Route
              path="/products"
              element={
                <ProtectedRoute>
                  <ProductsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/product/:id"
              element={
                <ProtectedRoute>
                  <ProductDetailPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <CartPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <OrdersPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/orders/:id"
              element={
                <ProtectedRoute>
                  <OrderDetailPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />


            {/* ========================================
                ADMIN ROUTES
            ======================================== */}

            <Route
              path="/admin/dashboard"
              element={
                <AdminProtectedRoute>
                  <AdminDashboardPage />
                </AdminProtectedRoute>
              }
            />

            <Route
              path="/admin/products"
              element={
                <AdminProtectedRoute>
                  <AdminProductsPage />
                </AdminProtectedRoute>
              }
            />

            <Route
              path="/admin/categories"
              element={
                <AdminProtectedRoute>
                  <AdminCategoriesPage />
                </AdminProtectedRoute>
              }
            />

            <Route
              path="/admin/orders"
              element={
                <AdminProtectedRoute>
                  <AdminOrdersPage />
                </AdminProtectedRoute>
              }
            />

          </Routes>

        </main>

        <Footer />

        <Toaster
          position="top-right"
        />

      </div>

    </Router>

  );
}

export default App;