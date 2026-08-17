import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// ========================================
// @desc    Create Order
// @route   POST /api/orders
// @access  Customer Only
// ========================================
export const createOrder = async (req, res) => {
  try {
    const customerId = req.customer._id;
    const {
      shippingAddress,
      paymentMethod,
      notes
    } = req.body;

    // Validate shipping address
    if (!shippingAddress || !shippingAddress.name || !shippingAddress.mobile || 
        !shippingAddress.pincode || !shippingAddress.address || 
        !shippingAddress.city || !shippingAddress.state) {
      return res.status(400).json({
        success: false,
        message: 'Complete shipping address is required'
      });
    }

    // Validate payment method
    if (!paymentMethod || !['cod', 'online'].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: 'Valid payment method is required (cod or online)'
      });
    }

    // Get cart
    const cart = await Cart.findOne({ customer: customerId })
      .populate('items.product', 'name price images quantity');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty. Add items to cart first.'
      });
    }

    // Check stock and prepare order items
    const orderItems = [];
    for (const item of cart.items) {
      const product = item.product;
      
      // Check stock
      if (product.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.quantity}`
        });
      }

      // Reduce stock
      product.quantity -= item.quantity;
      product.totalSold = (product.totalSold || 0) + item.quantity;
      await product.save();

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0] || product.thumbnail || '',
        quantity: item.quantity,
        color: item.color || '',
        size: item.size || '',
        price: item.price,
        total: item.total
      });
    }

    // Calculate totals
    const subtotal = cart.total;
    const discount = cart.discount || 0;
    const shippingCharges = 0; // Can be calculated based on location
    const tax = Math.round(subtotal * 0.05); // 5% tax (example)
    const total = subtotal - discount + shippingCharges + tax;

    // Create order
    const order = await Order.create({
      customer: customerId,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
      orderStatus: 'pending',
      subtotal,
      discount,
      shippingCharges,
      tax,
      total,
      notes: notes || ''
    });

    // Clear cart after order
    cart.items = [];
    cart.subtotal = 0;
    cart.discount = 0;
    cart.total = 0;
    await cart.save();

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// ========================================
// @desc    Get My Orders
// @route   GET /api/orders/my-orders
// @access  Customer Only
// ========================================
export const getMyOrders = async (req, res) => {
  try {
    const customerId = req.customer._id;
    const { limit = 20, page = 1 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const orders = await Order.find({ customer: customerId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments({ customer: customerId });

    res.status(200).json({
      success: true,
      message: 'Orders fetched successfully',
      count: orders.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// ========================================
// @desc    Get Single Order
// @route   GET /api/orders/:id
// @access  Customer Only
// ========================================
export const getOrderById = async (req, res) => {
  try {
    const customerId = req.customer._id;
    const { id } = req.params;

    const order = await Order.findOne({ _id: id, customer: customerId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order fetched successfully',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// ========================================
// @desc    Cancel Order
// @route   PUT /api/orders/:id/cancel
// @access  Customer Only
// ========================================
export const cancelOrder = async (req, res) => {
  try {
    const customerId = req.customer._id;
    const { id } = req.params;
    const { cancellationReason } = req.body;

    const order = await Order.findOne({ _id: id, customer: customerId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if order can be cancelled
    if (order.orderStatus === 'delivered') {
      return res.status(400).json({
        success: false,
        message: 'Delivered orders cannot be cancelled'
      });
    }

    if (order.orderStatus === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Order is already cancelled'
      });
    }

    // Restore product stock
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.quantity += item.quantity;
        product.totalSold = Math.max(0, (product.totalSold || 0) - item.quantity);
        await product.save();
      }
    }

    order.orderStatus = 'cancelled';
    order.cancelledAt = new Date();
    order.cancellationReason = cancellationReason || 'Cancelled by customer';

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// ========================================
// ADMIN ONLY CONTROLLERS
// ========================================

// ========================================
// @desc    Get All Orders (Admin)
// @route   GET /api/orders/admin
// @access  Admin Only
// ========================================
export const getAllOrders = async (req, res) => {
  try {
    const { 
      orderStatus, 
      paymentStatus, 
      startDate, 
      endDate,
      limit = 20,
      page = 1 
    } = req.query;

    // Build filter
    const filter = {};
    if (orderStatus) filter.orderStatus = orderStatus;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('customer', 'name email mobile');

    const total = await Order.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: 'Orders fetched successfully',
      count: orders.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// ========================================
// @desc    Update Order Status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Admin Only
// ========================================
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, adminNotes, trackingNumber, trackingUrl } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update status
    if (orderStatus) {
      // Validate status
      const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
      if (!validStatuses.includes(orderStatus)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid order status'
        });
      }

      // If delivered, set delivered date
      if (orderStatus === 'delivered' && order.orderStatus !== 'delivered') {
        order.deliveredAt = new Date();
      }

      order.orderStatus = orderStatus;
    }

    if (adminNotes) order.adminNotes = adminNotes;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (trackingUrl) order.trackingUrl = trackingUrl;

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};