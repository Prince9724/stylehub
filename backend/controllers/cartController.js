import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// ========================================
// @desc    Get Cart
// @route   GET /api/cart
// @access  Customer Only
// ========================================
export const getCart = async (req, res) => {
  try {
    const customerId = req.customer._id;

    let cart = await Cart.findOne({ customer: customerId })
      .populate('items.product', 'name price images thumbnail slug');

    if (!cart) {
      // Create empty cart if not exists
      cart = await Cart.create({
        customer: customerId,
        items: [],
        subtotal: 0,
        discount: 0,
        total: 0
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cart fetched successfully',
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// ========================================
// @desc    Add Item to Cart
// @route   POST /api/cart
// @access  Customer Only
// ========================================
export const addToCart = async (req, res) => {
  try {
    const customerId = req.customer._id;
    const { productId, quantity, color, size } = req.body;

    // Validate input
    if (!productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'Product ID and quantity are required'
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    // Check product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check product is active
    if (!product.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Product is not available'
      });
    }

    // Check stock
    if (product.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.quantity} items available in stock`
      });
    }

    // Find or create cart
    let cart = await Cart.findOne({ customer: customerId });

    if (!cart) {
      cart = await Cart.create({
        customer: customerId,
        items: [],
        subtotal: 0,
        discount: 0,
        total: 0
      });
    }

    // Check if product already in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId && 
              item.color === color && 
              item.size === size
    );

    if (existingItemIndex > -1) {
      // Update quantity if already exists
      cart.items[existingItemIndex].quantity += quantity;
      cart.items[existingItemIndex].total = 
        cart.items[existingItemIndex].quantity * cart.items[existingItemIndex].price;
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity,
        color: color || '',
        size: size || '',
        price: product.price,
        total: quantity * product.price
      });
    }

    await cart.save();

    // Populate product details
    await cart.populate('items.product', 'name price images thumbnail slug');

    res.status(200).json({
      success: true,
      message: 'Item added to cart successfully',
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// ========================================
// @desc    Update Cart Item
// @route   PUT /api/cart/:itemId
// @access  Customer Only
// ========================================
export const updateCartItem = async (req, res) => {
  try {
    const customerId = req.customer._id;
    const { itemId } = req.params;
    const { quantity, color, size } = req.body;

    // Validate quantity
    if (quantity !== undefined && quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    // Find cart
    const cart = await Cart.findOne({ customer: customerId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Find item in cart
    const itemIndex = cart.items.findIndex(
      item => item._id.toString() === itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    // Get product for price
    const product = await Product.findById(cart.items[itemIndex].product);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Update quantity
    if (quantity !== undefined) {
      // Check stock
      if (product.quantity < quantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.quantity} items available in stock`
        });
      }
      cart.items[itemIndex].quantity = quantity;
    }

    // Update color/size
    if (color !== undefined) cart.items[itemIndex].color = color;
    if (size !== undefined) cart.items[itemIndex].size = size;

    // Recalculate total
    cart.items[itemIndex].total = 
      cart.items[itemIndex].quantity * cart.items[itemIndex].price;

    await cart.save();

    // Populate product details
    await cart.populate('items.product', 'name price images thumbnail slug');

    res.status(200).json({
      success: true,
      message: 'Cart item updated successfully',
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// ========================================
// @desc    Remove Item from Cart
// @route   DELETE /api/cart/:itemId
// @access  Customer Only
// ========================================
export const removeFromCart = async (req, res) => {
  try {
    const customerId = req.customer._id;
    const { itemId } = req.params;

    const cart = await Cart.findOne({ customer: customerId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Remove item
    cart.items = cart.items.filter(
      item => item._id.toString() !== itemId
    );

    await cart.save();

    await cart.populate('items.product', 'name price images thumbnail slug');

    res.status(200).json({
      success: true,
      message: 'Item removed from cart successfully',
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// ========================================
// @desc    Clear Cart
// @route   DELETE /api/cart
// @access  Customer Only
// ========================================
export const clearCart = async (req, res) => {
  try {
    const customerId = req.customer._id;

    const cart = await Cart.findOne({ customer: customerId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items = [];
    cart.subtotal = 0;
    cart.discount = 0;
    cart.total = 0;

    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// ========================================
// @desc    Get Cart Item Count
// @route   GET /api/cart/count
// @access  Customer Only
// ========================================
export const getCartCount = async (req, res) => {
  try {
    const customerId = req.customer._id;

    const cart = await Cart.findOne({ customer: customerId });
    
    let count = 0;
    if (cart) {
      count = cart.items.reduce((total, item) => total + item.quantity, 0);
    }

    res.status(200).json({
      success: true,
      message: 'Cart count fetched successfully',
      data: { count }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};