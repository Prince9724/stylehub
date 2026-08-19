import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  FiShoppingCart,
  FiUser,
  FiLogOut
} from 'react-icons/fi';

import { logoutThunk } from '../../features/auth/authThunks';
import toast from 'react-hot-toast';

const Header = () => {

  const {
    isAuthenticated,
    user
  } = useSelector((state) => state.auth);

  const { items } = useSelector(
    (state) => state.cart
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartCount = items?.length || 0;


  // ========================================
  // LOGOUT
  // ========================================

  const handleLogout = async () => {

    try {

      await dispatch(
        logoutThunk()
      ).unwrap();

      toast.success(
        'Logged out successfully!'
      );

      navigate('/login', {
        replace: true
      });

    } catch (error) {

      console.error(
        'Logout error:',
        error
      );

    }

  };


  return (

    <header className="bg-white shadow-lg sticky top-0 z-50">

      <div className="container mx-auto px-4 py-4">

        <div className="flex justify-between items-center">

          <Link
            to="/"
            className="text-2xl font-bold text-black-600 hover:text-blue-800 transition"
          >
            MS collection
          </Link>


          <nav className="flex items-center gap-6">

            <Link
              to="/products"
              className="text-gray-700 hover:text-blue-600 transition font-medium"
            >
              Products
            </Link>


            <Link
              to="/cart"
              className="relative text-gray-700 hover:text-blue-600 transition"
            >

              <FiShoppingCart size={24} />

              {cartCount > 0 && (

                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">

                  {cartCount}

                </span>

              )}

            </Link>


            {isAuthenticated ? (

              <div className="flex items-center gap-4">

                {user?.role === 'admin' && (

                  <Link
                    to="/admin/dashboard"
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Dashboard
                  </Link>

                )}


                <Link
                  to="/profile"
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition"
                >

                  <FiUser size={20} />

                  <span className="text-sm font-medium">
                    {user?.name || 'User'}
                  </span>

                </Link>


                <button
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-700 transition"
                  title="Logout"
                >

                  <FiLogOut size={20} />

                </button>

              </div>

            ) : (

              <Link
                to="/login"
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition font-medium"
              >

                <FiUser size={20} />

                <span>
                  Login
                </span>

              </Link>

            )}

          </nav>

        </div>

      </div>

    </header>

  );
};

export default Header;