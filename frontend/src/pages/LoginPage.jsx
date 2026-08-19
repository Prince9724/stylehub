import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
  sendOTPThunk,
  verifyOTPThunk
} from '../features/auth/authThunks';

import toast from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    isLoading,
    error,
    otpSent,
    otpEmail
  } = useSelector((state) => state.auth);

  // ========================================
  // SEND OTP
  // ========================================

  const handleSendOTP = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter email');
      return;
    }

    try {
      const result = await dispatch(
        sendOTPThunk(email)
      ).unwrap();

      console.log('✅ Send OTP Result:', result);
      console.log('📧 Email saved for OTP:', email);

    } catch (error) {
      console.error(
        '❌ Send OTP Error:',
        error
      );
    }
  };

  // ========================================
  // VERIFY OTP
  // ========================================

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    // ✅ Redux wala email priority hai
    const emailToVerify = otpEmail || email;

    console.log(
      '🔍 EMAIL BEFORE VERIFY:',
      emailToVerify
    );

    console.log(
      '🔍 OTP BEFORE VERIFY:',
      otp
    );

    console.log(
      '🔍 NAME BEFORE VERIFY:',
      name
    );

    // ========================================
    // VALIDATION
    // ========================================

    if (!emailToVerify) {
      toast.error('Email is missing');
      return;
    }

    if (!otp) {
      toast.error('Please enter OTP');
      return;
    }

    if (!name) {
      toast.error('Please enter your name');
      return;
    }

    // ========================================
    // VERIFY OTP
    // ========================================

    try {
      const result = await dispatch(
        verifyOTPThunk({
          email: emailToVerify,
          otp,
          name
        })
      ).unwrap();

      console.log(
        '✅ Verify OTP Result:',
        result
      );

      if (result?.success) {
        toast.success(
          'Login Successful!'
        );

        navigate('/', {
          replace: true
        });
      }

    } catch (error) {
      console.error(
        '❌ Verify OTP Error:',
        error
      );
    }
  };

  // ========================================
  // UI
  // ========================================

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">

      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">

        <h2 className="text-3xl font-bold text-center">
          👤 Customer Login
        </h2>

        <p className="text-center text-gray-500 text-sm mt-2">
          Login with OTP
        </p>

        {/* ========================================
            OTP SENT → VERIFY FORM
        ======================================== */}

        {otpSent ? (

          <form
            onSubmit={handleVerifyOTP}
            className="mt-6 space-y-4"
          >

            <div className="bg-green-100 text-green-700 p-2 rounded text-center text-sm">
              ✅ OTP sent to{' '}
              <strong>
                {otpEmail || email}
              </strong>
            </div>

            {/* NAME */}

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Enter your name"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />

            {/* OTP */}

            <input
              type="text"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value)
              }
              placeholder="Enter 6-digit OTP"
              maxLength="6"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />

            {/* ERROR */}

            {error && (
              <p className="text-red-500 text-sm">
                {error}
              </p>
            )}

            <div className="flex gap-2">

              {/* BACK */}

              <button
                type="button"
                onClick={() => {
                  dispatch({
                    type: 'auth/setOTPSent',
                    payload: false
                  });

                  setOtp('');
                  setName('');
                }}
                className="flex-1 bg-gray-200 py-2 rounded-lg hover:bg-gray-300"
              >
                Back
              </button>

              {/* VERIFY */}

              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading
                  ? 'Verifying...'
                  : 'Verify OTP'}
              </button>

            </div>

          </form>

        ) : (

          /* ========================================
             EMAIL FORM
          ======================================== */

          <form
            onSubmit={handleSendOTP}
            className="mt-6 space-y-4"
          >

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />

            {error && (
              <p className="text-red-500 text-sm">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading
                ? 'Sending...'
                : 'Send OTP'}
            </button>

          </form>

        )}

        <p className="text-center text-xs text-gray-400 mt-4">
          ✅ Same email se login karein toh existing customer milega
        </p>

      </div>

    </div>
  );
};

export default LoginPage;