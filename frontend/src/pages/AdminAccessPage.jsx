import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api';

const AdminAccessPage = () => {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/admin/verify-access`, { token });
      
      if (response.data.success) {
        localStorage.setItem('adminAccess', 'true');
        localStorage.setItem('adminAccessToken', token);
        toast.success('Access granted! Redirecting to login...');
        setTimeout(() => navigate('/login'), 1000);
      }
    } catch (error) {
      toast.error('Invalid or expired access token');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">🔐 Admin Access</h2>
          <p className="text-gray-600 text-sm mt-2">
            Enter the access token provided by the master admin
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Enter access token"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify Access'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-4">
          Contact admin@shop.com to get access token
        </p>
      </div>
    </div>
  );
};

export default AdminAccessPage;