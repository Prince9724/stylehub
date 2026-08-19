import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },

  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000
});

const test = async () => {
  try {

    console.log('📧 Testing email...');

    await transporter.verify();

    console.log('✅ Gmail SMTP connection successful!');

    const info = await transporter.sendMail({
      from: `"StyleHub Test" <${process.env.EMAIL_USER}>`,
      to: 'princegondrw123@gmail.com',
      subject: 'StyleHub Test Email',
      html: '<h1>Test Email Successfully Sent 🚀</h1>'
    });

    console.log('✅ Email sent:', info.messageId);

  } catch (error) {

    console.error('❌ Email Error');
    console.error('Code:', error.code);
    console.error('Message:', error.message);

  }
};

test();