import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Admin from '../models/Admin.js';
import connectDB from '../config/db.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    // ✅ Delete existing admin
    await Admin.deleteMany({});

    const admin = await Admin.create({
      name: 'Shop Admin',
      email: 'princegondrw123@gmail.com',
      mobile: '9876543210',
      password: 'Admin@123'
    });

    console.log('✅ Admin created successfully!');
    console.log(`📧 Email: ${admin.email}`);
    console.log(`📱 Mobile: ${admin.mobile}`);
    console.log(`🔑 Password: Admin@123`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

seedAdmin();