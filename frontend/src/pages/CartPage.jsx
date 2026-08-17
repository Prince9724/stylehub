import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  removeFromCartThunk,
  updateCartItemThunk,
  clearCartThunk
} from '../features/cart/cartThunks';

const CartPage = () => {
  const dispatch = useDispatch();
  const { items, subtotal, total, isLoading } = useSelector((state) => state.cart);

  const handleRemoveItem = async (itemId) => {
    await dispatch(removeFromCartThunk(itemId));
  };

  const handleUpdateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;
    await dispatch(updateCartItemThunk({ itemId, quantity }));
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      await dispatch(clearCartThunk());
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-600 mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Browse our products and add items to your cart</p>
        <Link
          to="/products"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 bg-gray-50 border-b">
              <div className="grid grid-cols-4 text-sm font-semibold text-gray-600">
                <span className="col-span-2">Product</span>
                <span className="text-center">Quantity</span>
                <span className="text-right">Total</span>
              </div>
            </div>

            {items.map((item) => (
              <div key={item._id} className="p-4 border-b hover:bg-gray-50 transition">
                <div className="grid grid-cols-4 items-center gap-4">
                  {/* Product Info */}
                  <div className="col-span-2 flex items-center gap-4">
                    <img
                      src={item.product?.thumbnail || item.product?.images?.[0] || 'https://via.placeholder.com/80'}
                      alt={item.product?.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <Link
                        to={`/product/${item.product?._id}`}
                        className="font-semibold hover:text-blue-600"
                      >
                        {item.product?.name}
                      </Link>
                      <p className="text-sm text-gray-500">
                        ₹{item.price} × {item.quantity}
                      </p>
                      {item.color && (
                        <span className="text-sm text-gray-500">Color: {item.color}</span>
                      )}
                      {item.size && (
                        <span className="text-sm text-gray-500 ml-2">Size: {item.size}</span>
                      )}
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                      className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 transition"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                      className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 transition"
                    >
                      +
                    </button>
                  </div>

                  {/* Total */}
                  <div className="text-right">
                    <p className="font-semibold">₹{item.total}</p>
                    <button
                      onClick={() => handleRemoveItem(item._id)}
                      className="text-red-500 text-sm hover:text-red-700 mt-1"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="p-4 bg-gray-50">
              <button
                onClick={handleClearCart}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-2 border-b pb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold text-green-600">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Discount</span>
                <span className="font-semibold text-red-500">-₹{0}</span>
              </div>
            </div>

            <div className="flex justify-between text-xl font-bold mt-4">
              <span>Total</span>
              <span className="text-blue-600">₹{total}</span>
            </div>

            <Link
              to="/checkout"
              className="w-full block text-center bg-blue-600 text-white py-3 rounded-lg mt-6 hover:bg-blue-700 transition"
            >
              Proceed to Checkout
            </Link>

            <Link
              to="/products"
              className="w-full block text-center text-blue-600 py-2 mt-2 hover:underline"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;