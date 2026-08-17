import mongoose from 'mongoose';

// ✅ Size Variant Schema
const sizeVariantSchema = new mongoose.Schema({
  size: {
    type: String,
    required: true,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'FREE']
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  },
  comparePrice: {
    type: Number,
    min: [0, 'Compare price cannot be negative'],
    default: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: [0, 'Quantity cannot be negative'],
    default: 0
  }
}, { _id: true });

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  shortDescription: {
    type: String,
    trim: true,
    maxlength: [300, 'Short description cannot exceed 300 characters']
  },
  // ✅ Base price (fallback if no size variants)
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  comparePrice: {
    type: Number,
    min: [0, 'Compare price cannot be negative'],
    default: 0
  },
  costPerItem: {
    type: Number,
    min: [0, 'Cost per item cannot be negative'],
    default: 0
  },
  // ✅ Base quantity (fallback if no size variants)
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative'],
    default: 0
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  images: [{
    type: String,
    required: [true, 'At least one image is required']
  }],
  thumbnail: {
    type: String,
    required: [true, 'Thumbnail is required']
  },
  colors: [{
    type: String,
    trim: true
  }],
  // ✅ Size variants with different prices
  sizeVariants: [sizeVariantSchema],
  // ✅ Legacy sizes (keep for backward compatibility)
  sizes: [{
    type: String,
    trim: true,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'FREE']
  }],
  tags: [{
    type: String,
    trim: true
  }],
  sku: {
    type: String,
    unique: true,
    trim: true,
    sparse: true
  },
  weight: {
    type: Number,
    min: [0, 'Weight cannot be negative'],
    default: 0
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isBestSeller: {
    type: Boolean,
    default: false
  },
  isNewArrival: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  averageRating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot exceed 5']
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  totalSold: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  metaTitle: {
    type: String,
    trim: true
  },
  metaDescription: {
    type: String,
    trim: true,
    maxlength: [160, 'Meta description cannot exceed 160 characters']
  }
}, {
  timestamps: true
});

// ✅ Auto-generate slug from name
productSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  next();
});

// ✅ Virtual: Get total quantity (from sizeVariants or base quantity)
productSchema.virtual('totalQuantity').get(function() {
  if (this.sizeVariants && this.sizeVariants.length > 0) {
    return this.sizeVariants.reduce((sum, v) => sum + v.quantity, 0);
  }
  return this.quantity;
});

// ✅ Virtual: Get min and max price
productSchema.virtual('priceRange').get(function() {
  if (this.sizeVariants && this.sizeVariants.length > 0) {
    const prices = this.sizeVariants.map(v => v.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }
  return { min: this.price, max: this.price };
});

// ✅ Virtual: Check if product has size variants
productSchema.virtual('hasSizeVariants').get(function() {
  return this.sizeVariants && this.sizeVariants.length > 0;
});

const Product = mongoose.model('Product', productSchema);
export default Product;