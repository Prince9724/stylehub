import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProductByIdThunk } from '../features/products/productThunks';
import { addToCartThunk } from '../features/cart/cartThunks';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct: product, isLoading } = useSelector((state) => state.products);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  
  // ✅ New: Size Variant State
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    dispatch(getProductByIdThunk(id));
  }, [dispatch, id]);

  // ✅ Handle Size Variant Selection
  const handleSizeVariantSelect = (variant) => {
    setSelectedVariant(variant);
    setSelectedSize(variant.size);
    setQuantity(1);
  };

  // ✅ Check if product has size variants
  const hasSizeVariants = product?.sizeVariants && product.sizeVariants.length > 0;
  const currentPrice = selectedVariant ? selectedVariant.price : product?.price || 0;

  const handleAddToCart = async () => {
    // ✅ Use selected variant price if available
    const finalPrice = selectedVariant ? selectedVariant.price : product.price;
    const finalSize = selectedVariant ? selectedVariant.size : selectedSize;
    
    const result = await dispatch(addToCartThunk({
      productId: product._id,
      quantity,
      color: selectedColor || '',
      size: finalSize || '',
      price: finalPrice // ✅ Send selected price
    }));
    if (result.payload?.success) {
      toast.success('Added to cart!');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-600">Product not found</h2>
        <Link to="/products" className="text-blue-600 hover:underline mt-4 inline-block">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <img
            src={product.thumbnail || product.images?.[0] || 'https://via.placeholder.com/500'}
            alt={product.name}
            className="w-full rounded-lg shadow-md"
          />
          {product.images?.length > 1 && (
            <div className="flex gap-2 mt-4">
              {product.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${product.name} ${index + 1}`}
                  className="w-20 h-20 object-cover rounded cursor-pointer hover:border-2 hover:border-blue-600"
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.category?.name}</p>

          {/* ✅ Price Display - Dynamic with Size Selection */}
          <div className="flex items-center gap-4 mb-4">
            <span className="text-3xl font-bold text-blue-600">₹{currentPrice}</span>
            {product.comparePrice && product.comparePrice > currentPrice && (
              <span className="text-lg text-gray-400 line-through">₹{product.comparePrice}</span>
            )}
            {hasSizeVariants && selectedVariant && (
              <span className="text-sm text-green-600">Selected: {selectedVariant.size}</span>
            )}
          </div>

          <p className="text-gray-600 mb-4">{product.description}</p>

          {/* ✅ Size Variants - Size-wise Price */}
          {hasSizeVariants ? (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Size & Price</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {product.sizeVariants.map((variant) => (
                  <button
                    key={variant.size}
                    onClick={() => handleSizeVariantSelect(variant)}
                    className={`p-3 border rounded-lg text-center transition ${
                      selectedVariant?.size === variant.size 
                        ? 'border-blue-600 bg-blue-50 shadow-md' 
                        : 'border-gray-300 hover:border-blue-400'
                    }`}
                  >
                    <div className="font-bold">{variant.size}</div>
                    <div className="text-sm font-semibold text-blue-600">₹{variant.price}</div>
                    {variant.comparePrice > variant.price && (
                      <div className="text-xs text-gray-400 line-through">₹{variant.comparePrice}</div>
                    )}
                    <div className="text-xs text-gray-500">Stock: {variant.quantity}</div>
                  </button>
                ))}
              </div>
              {selectedVariant && (
                <p className="text-sm text-green-600 mt-2">
                  ✅ Selected: {selectedVariant.size} - ₹{selectedVariant.price}
                </p>
              )}
            </div>
          ) : (
            // ✅ Fallback: Regular sizes without price variant
            product.sizes?.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Sizes</label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-lg transition ${
                        selectedSize === size ? 'border-blue-600 bg-blue-50' : 'border-gray-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )
          )}

          {product.colors?.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Colors</label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border rounded-lg transition ${
                      selectedColor === color ? 'border-blue-600 bg-blue-50' : 'border-gray-300'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                className="w-10 h-10 bg-gray-200 rounded-full hover:bg-gray-300 transition"
              >
                -
              </button>
              <span className="w-10 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(prev => Math.min(
                  selectedVariant ? selectedVariant.quantity : product.quantity, 
                  prev + 1
                ))}
                className="w-10 h-10 bg-gray-200 rounded-full hover:bg-gray-300 transition"
              >
                +
              </button>
            </div>
            <span className="text-sm text-gray-500">
              {selectedVariant ? selectedVariant.quantity : product.quantity} available
            </span>
          </div>

          {/* ✅ Add to Cart - Check stock based on variant */}
          <button
            onClick={handleAddToCart}
            disabled={(selectedVariant ? selectedVariant.quantity : product.quantity) === 0}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {(selectedVariant ? selectedVariant.quantity : product.quantity) === 0 
              ? 'Out of Stock' 
              : 'Add to Cart'}
          </button>

          <Link
            to="/products"
            className="block text-center text-blue-600 hover:underline mt-4"
          >
            Back to Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;