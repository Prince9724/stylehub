import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';

// ============================================
// 🔴 INITIALIZE RAZORPAY - No changes needed
// ============================================
// Ye code automatically .env से keys लेगा
// बस .env में keys डाल दें
// ============================================

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// ============================================
// 📍 CREATE RAZORPAY ORDER
// ============================================
export const createRazorpayOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    const customerId = req.customer._id;

    const order = await Order.findOne({ _id: orderId, customer: customerId });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.paymentStatus === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Order already paid'
      });
    }

    // ============================================
    // 🔴 RAZORPAY ORDER CREATE - No changes needed
    // Ye code apne aap kaam karega .env keys se
    // ============================================
    
    const options = {
      amount: Math.round(order.total * 100),
      currency: 'INR',
      receipt: order.orderId,
      notes: {
        orderId: order._id.toString(),
        customerEmail: req.customer.email || '',
        customerName: req.customer.name || ''
      }
    };

    const razorpayOrder = await razorpay.orders.create(options);

    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Razorpay order created successfully',
      data: {
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        orderId: order._id
      }
    });
  } catch (error) {
    console.error('Razorpay Order Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create payment order'
    });
  }
};

// ============================================
// 📍 VERIFY PAYMENT
// ============================================
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    // ============================================
    // 🔴 SIGNATURE VERIFICATION - No changes needed
    // Ye code automatically kaam karega
    // ============================================

    const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');

    if (digest !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }

    const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.paymentStatus = 'paid';
    order.paymentId = razorpay_payment_id;
    order.orderStatus = 'confirmed';
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        orderId: order._id,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus
      }
    });
  } catch (error) {
    console.error('Payment Verification Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Payment verification failed'
    });
  }
};

// ============================================
// 📍 GET PAYMENT STATUS
// ============================================
export const getPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const customerId = req.customer._id;

    const order = await Order.findOne({ _id: orderId, customer: customerId });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        paymentId: order.paymentId || null
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get payment status'
    });
  }
};

//for frontend 
{/* <script src="https://checkout.razorpay.com/v1/checkout.js"></script>

<script>
async function payNow(orderId) {
  // 1. Backend से Razorpay Order Create करें
  const response = await fetch('/api/payments/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId })
  });
  const data = await response.json();
  
  if (!data.success) {
    alert(data.message);
    return;
  }

  // ============================================
  // 🔴 RAZORPAY CHECKOUT - यहाँ KEY डालनी है
  // ⚠️ .env से KEY_ID लें (Frontend में public)
  // ============================================

  const options = {
    key: 'YOUR_RAZORPAY_KEY_ID_HERE',  // ← 🔴 यहाँ डालें
    amount: data.data.amount,
    currency: data.data.currency,
    name: 'StyleHub',
    description: 'Order Payment',
    order_id: data.data.razorpayOrderId,
    prefill: {
      name: 'Customer Name',
      email: 'customer@email.com',
      contact: '9876543210'
    },
    theme: { color: '#F37254' },
    handler: function(response) {
      // Payment Success → Backend Verify
      fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert('Payment Successful!');
          window.location.href = '/orders';
        } else {
          alert('Payment Failed!');
        }
      });
    }
  };

  const rzp = new Razorpay(options);
  rzp.open();
}
</script> */}