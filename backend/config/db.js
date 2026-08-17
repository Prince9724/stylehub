// import mongoose from 'mongoose';

// const connectDB = async () => {
//   try {
//     const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/stylehub';
//     const conn = await mongoose.connect(mongoUri, {
//       serverSelectionTimeoutMS: 5000,
//     });
//     console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error(`❌ MongoDB Connection Error: ${error.message}`);
//     console.warn('⚠️ Continuing without MongoDB. Database-backed routes will fail until a reachable MongoDB instance is available.');
//   }
// };

// export default connectDB;
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      family: 4, // Use IPv4, skip trying IPv6
      maxPoolSize: 10,
      minPoolSize: 2,
      connectTimeoutMS: 30000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;