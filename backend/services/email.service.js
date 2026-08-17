import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

console.log('📧 Email Config:');
console.log('USER:', process.env.EMAIL_USER);
console.log('HOST:', process.env.EMAIL_HOST);
console.log('PORT:', process.env.EMAIL_PORT);

// ✅ Fix: Updated transporter config with proper TLS settings
const transporter = nodemailer.createTransport({
  service: 'gmail',  // ✅ Service use karein, host/port nahi
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false,
    minVersion: 'TLSv1.2'
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000
});

// ✅ Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email Transporter Error:', error);
  } else {
    console.log('✅ Email Transporter Ready!');
  }
});

// Send OTP Email
export const sendOTPEmail = async (email, otp, name = '') => {
  try {
    console.log(`📧 Attempting to send OTP to: ${email}`);
    
    const mailOptions = {
      from: `"StyleHub" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your OTP for StyleHub Login',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #333; text-align: center;">🔐 OTP Verification</h2>
          <p style="color: #555; font-size: 16px;">Hello ${name || 'Customer'},</p>
          <p style="color: #555; font-size: 16px;">Your One-Time Password (OTP) for login is:</p>
          <div style="background: #f5f5f5; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <h1 style="color: #4CAF50; font-size: 36px; letter-spacing: 5px; margin: 0;">${otp}</h1>
          </div>
          <p style="color: #777; font-size: 14px;">This OTP is valid for 10 minutes.</p>
          <p style="color: #777; font-size: 14px;">If you didn't request this, please ignore this email.</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">© 2024 StyleHub. All rights reserved.</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully!`);
    console.log(`📧 Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email sending failed:');
    console.error('Error Code:', error.code);
    console.error('Error Message:', error.message);
    if (error.response) {
      console.error('Response:', error.response);
    }
    return { success: false, error: error.message };
  }
};