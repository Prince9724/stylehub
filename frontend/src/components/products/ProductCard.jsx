import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCartThunk } from '../../features/cart/cartThunks';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = async () => {
    const result = await dispatch(addToCartThunk({
      productId: product._id,
      quantity: 1
    }));
    if (result.payload?.success) {
      toast.success('Added to cart!');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group border border-gray-100">
      <Link to={`/product/${product._id}`}>
        <div className="overflow-hidden">
          <img
            src={product.thumbnail || product.images?.[0] || 'https://via.placeholder.com/300x300?text=Product'}
            alt={product.name}
            className="w-full h-60 object-cover group-hover:scale-105 transition duration-500"
          />
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h3 className="font-semibold text-gray-800 hover:text-blue-600 transition line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-400 text-xs uppercase tracking-wider mt-0.5">
          {product.category?.name || ''}
        </p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-lg font-bold text-blue-600">₹{product.price}</span>
          {product.comparePrice && product.comparePrice > product.price && (
            <span className="text-xs text-gray-400 line-through">₹{product.comparePrice}</span>
          )}
        </div>
        <button
          onClick={handleAddToCart}
          className="w-full mt-3 bg-gray-900 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300 text-sm font-medium"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;