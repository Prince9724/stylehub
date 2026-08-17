import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api';

const AdminAccessToggle = ({ onAccessGranted }) => {
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!token) {
      toast.error('Please enter token');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/verify-access`, { token });
      if (response.data.success) {
        localStorage.setItem('adminAccess', 'true');
        toast.success('Admin access granted!');
        onAccessGranted();
      }
    } catch (error) {
      toast.error('Invalid token');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={() => setShowTokenInput(!showTokenInput)}
        className="text-sm text-gray-500 hover:text-blue-600 transition"
      >
        {showTokenInput ? 'Cancel' : '🔐 Admin Access'}
      </button>

      {showTokenInput && (
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Enter admin token"
            className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
          />
          <button
            onClick={handleVerify}
            disabled={loading}
            className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? '...' : 'Verify'}
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminAccessToggle;