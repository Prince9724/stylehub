import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getProductsThunk, 
  createProductThunk, 
  deleteProductThunk,
  updateProductThunk 
} from '../features/products/productThunks';
import { getCategoriesThunk } from '../features/categories/categoryThunks';
import toast from 'react-hot-toast';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';

const AdminProductsPage = () => {
  const dispatch = useDispatch();
  const { products, isLoading } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // ✅ Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    price: '',
    comparePrice: '',
    quantity: '',
    category: '',
    images: [''],
    thumbnail: '',
    colors: '',
    sizes: '',
    tags: '',
    sku: '',
    weight: '',
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: false,
    isActive: true
  });

  // ✅ Size Variants State
  const [sizeVariants, setSizeVariants] = useState([]);

  // ✅ Size Variant Functions
  const addSizeVariant = () => {
    setSizeVariants([...sizeVariants, { size: '', price: '', comparePrice: '', quantity: '' }]);
  };

  const removeSizeVariant = (index) => {
    setSizeVariants(sizeVariants.filter((_, i) => i !== index));
  };

  const handleSizeVariantChange = (index, field, value) => {
    const newVariants = [...sizeVariants];
    newVariants[index][field] = value;
    setSizeVariants(newVariants);
  };

  console.log('🔍 Categories:', categories);
  console.log('🔍 Products:', products);
  console.log('🔍 Size Variants:', sizeVariants);

  useEffect(() => {
    dispatch(getProductsThunk({ limit: 100 }));
    dispatch(getCategoriesThunk());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageChange = (e, index) => {
    const newImages = [...formData.images];
    newImages[index] = e.target.value;
    setFormData({ ...formData, images: newImages });
  };

  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
  };

  const removeImageField = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.quantity || !formData.category) {
      toast.error('Please fill all required fields');
      return;
    }

    // ✅ Clean data with sizeVariants
    const productData = {
      name: formData.name,
      description: formData.description,
      shortDescription: formData.shortDescription,
      price: parseFloat(formData.price),
      comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : undefined,
      quantity: parseInt(formData.quantity),
      category: formData.category,
      images: formData.images.filter(img => img.trim() !== ''),
      thumbnail: formData.thumbnail,
      colors: formData.colors ? formData.colors.split(',').map(c => c.trim()).filter(c => c) : [],
      sizes: formData.sizes ? formData.sizes.split(',').map(s => s.trim()).filter(s => s) : [],
      sizeVariants: sizeVariants.filter(v => v.size && v.price), // ✅ Size Variants
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : [],
      sku: formData.sku || undefined,
      weight: formData.weight ? parseFloat(formData.weight) : undefined,
      isFeatured: formData.isFeatured,
      isBestSeller: formData.isBestSeller,
      isNewArrival: formData.isNewArrival,
      isActive: formData.isActive
    };

    console.log('📦 Submitting Product:', productData);

    let result;
    if (editingProduct) {
      result = await dispatch(updateProductThunk({ 
        id: editingProduct._id, 
        productData 
      }));
    } else {
      result = await dispatch(createProductThunk(productData));
    }

    if (result.payload?.success) {
      setShowForm(false);
      setEditingProduct(null);
      resetForm();
      toast.success(editingProduct ? 'Product updated!' : 'Product created!');
      dispatch(getProductsThunk({ limit: 100 }));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      shortDescription: '',
      price: '',
      comparePrice: '',
      quantity: '',
      category: '',
      images: [''],
      thumbnail: '',
      colors: '',
      sizes: '',
      tags: '',
      sku: '',
      weight: '',
      isFeatured: false,
      isBestSeller: false,
      isNewArrival: false,
      isActive: true
    });
    setSizeVariants([]); // ✅ Clear size variants
  };

  const handleEdit = (product) => {
    console.log('✏️ Editing Product:', product);
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      shortDescription: product.shortDescription || '',
      price: product.price || '',
      comparePrice: product.comparePrice || '',
      quantity: product.quantity || '',
      category: product.category?._id || product.category || '',
      images: product.images?.length ? product.images : [''],
      thumbnail: product.thumbnail || '',
      colors: product.colors?.join(', ') || '',
      sizes: product.sizes?.join(', ') || '',
      tags: product.tags?.join(', ') || '',
      sku: product.sku || '',
      weight: product.weight || '',
      isFeatured: product.isFeatured || false,
      isBestSeller: product.isBestSeller || false,
      isNewArrival: product.isNewArrival || false,
      isActive: product.isActive !== undefined ? product.isActive : true
    });
    setSizeVariants(product.sizeVariants || []); // ✅ Populate size variants
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await dispatch(deleteProductThunk(id));
      toast.success('Product deleted!');
      dispatch(getProductsThunk({ limit: 100 }));
    }
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Manage Products</h1>
          <p className="text-gray-500 text-sm mt-1">Total Products: {products?.length || 0}</p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingProduct(null);
            resetForm();
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
        >
          <FiPlus /> {showForm ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">
            {editingProduct ? '✏️ Edit Product' : '➕ Add New Product'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* SKU */}
              <div>
                <label className="block text-sm font-medium text-gray-700">SKU</label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  placeholder="PROD-001"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Base Price (₹) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  placeholder="499"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Compare Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Compare Price</label>
                <input
                  type="number"
                  name="comparePrice"
                  value={formData.comparePrice}
                  onChange={handleInputChange}
                  step="0.01"
                  placeholder="799"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Base Quantity *</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  placeholder="100"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Weight */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  step="0.1"
                  placeholder="0.5"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">-- Select Category --</option>
                  {categories?.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
                {categories?.length === 0 && (
                  <p className="text-xs text-red-500 mt-1">
                    ⚠️ No categories found. Please add a category first.
                  </p>
                )}
              </div>

              {/* Thumbnail */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Thumbnail URL *</label>
                <input
                  type="text"
                  name="thumbnail"
                  value={formData.thumbnail}
                  onChange={handleInputChange}
                  placeholder="https://example.com/thumbnail.jpg"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Short Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Short Description</label>
                <input
                  type="text"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                  placeholder="Brief product description"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Detailed product description"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Images */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Product Images</label>
                {formData.images.map((img, index) => (
                  <div key={index} className="flex items-center gap-2 mt-2">
                    <input
                      type="text"
                      value={img}
                      onChange={(e) => handleImageChange(e, index)}
                      placeholder={`Image URL ${index + 1}`}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    {formData.images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeImageField(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addImageField}
                  className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
                >
                  + Add Image
                </button>
              </div>

              {/* Colors */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Colors</label>
                <input
                  type="text"
                  name="colors"
                  value={formData.colors}
                  onChange={handleInputChange}
                  placeholder="Red, Blue, Black"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Sizes */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Sizes</label>
                <input
                  type="text"
                  name="sizes"
                  value={formData.sizes}
                  onChange={handleInputChange}
                  placeholder="S, M, L, XL"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* ✅ SIZE VARIANTS - Size-wise Price */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Size Variants (Size-wise Price)</label>
                {sizeVariants.map((variant, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2 flex-wrap">
                    <select
                      value={variant.size}
                      onChange={(e) => handleSizeVariantChange(index, 'size', e.target.value)}
                      className="w-20 px-2 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Size</option>
                      <option value="XS">XS</option>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                      <option value="XXL">XXL</option>
                      <option value="XXXL">XXXL</option>
                      <option value="FREE">FREE</option>
                    </select>
                    <input
                      type="number"
                      value={variant.price}
                      onChange={(e) => handleSizeVariantChange(index, 'price', e.target.value)}
                      placeholder="Price"
                      className="w-28 px-2 py-2 border border-gray-300 rounded-md"
                    />
                    <input
                      type="number"
                      value={variant.comparePrice}
                      onChange={(e) => handleSizeVariantChange(index, 'comparePrice', e.target.value)}
                      placeholder="MRP"
                      className="w-28 px-2 py-2 border border-gray-300 rounded-md"
                    />
                    <input
                      type="number"
                      value={variant.quantity}
                      onChange={(e) => handleSizeVariantChange(index, 'quantity', e.target.value)}
                      placeholder="Stock"
                      className="w-20 px-2 py-2 border border-gray-300 rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeSizeVariant(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addSizeVariant}
                  className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
                >
                  + Add Size Variant
                </button>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Tags</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="summer, cotton, trendy"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Checkboxes */}
            <div className="flex flex-wrap gap-4 items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Featured</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isBestSeller"
                  checked={formData.isBestSeller}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Best Seller</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isNewArrival"
                  checked={formData.isNewArrival}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">New Arrival</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Active</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              {editingProduct ? 'Update Product' : 'Add Product'}
            </button>
          </form>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products?.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No products found. Add your first product!
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src={product.thumbnail || product.images?.[0] || 'https://via.placeholder.com/40'}
                          alt={product.name}
                          className="h-10 w-10 object-cover rounded"
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-xs text-gray-500">SKU: {product.sku || 'N/A'}</div>
                          {product.sizeVariants?.length > 0 && (
                            <div className="text-xs text-blue-500">Size Variants: {product.sizeVariants.length}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">₹{product.price}</div>
                      {product.comparePrice && (
                        <div className="text-xs text-gray-400 line-through">₹{product.comparePrice}</div>
                      )}
                      {product.sizeVariants?.length > 0 && (
                        <div className="text-xs text-gray-500">
                          From: ₹{Math.min(...product.sizeVariants.map(v => v.price))}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm ${product.quantity > 10 ? 'text-green-600' : product.quantity > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {product.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {product.category?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                      {product.isFeatured && (
                        <span className="ml-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Featured
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <FiEdit className="inline" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FiTrash2 className="inline" /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminProductsPage;