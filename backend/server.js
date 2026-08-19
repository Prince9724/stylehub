import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import helmet from 'helmet';

// ✅ Import routes
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { loginLimiter } from './middleware/rateLimit.js';

dotenv.config();
connectDB();

const app = express();
const PORT = Number(process.env.PORT || 5000);

// ✅ Middleware
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174','http://localhost:5175','https://mscollections.netlify.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Health Check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    environment: process.env.NODE_ENV
  });
});

// ✅ Rate Limiting - SAHI ROUTES
app.use('/api/auth/send-otp', loginLimiter);   // ✅ Customer OTP
app.use('/api/admin/login', loginLimiter);     // ✅ Admin Login

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// ✅ Error Handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// ✅ 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found - ${req.originalUrl}`
  });
});

// ✅ Server Start
const startServer = (port = PORT, attempt = 1) => {
  const server = app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      const nextPort = port + 1;
      if (attempt >= 10) {
        console.error(`❌ Could not find a free port after trying ${nextPort - 1}`);
        process.exit(1);
      }

      console.warn(`⚠️ Port ${port} is busy. Trying ${nextPort}...`);
      server.close(() => {
        startServer(nextPort, attempt + 1);
      });
    } else {
      console.error('❌ Server startup error:', error);
      process.exit(1);
    }
  });
};

startServer();