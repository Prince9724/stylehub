// import React, { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { adminLoginThunk } from '../features/auth/authThunks';
// import toast from 'react-hot-toast';

// const AdminLoginPage = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const result = await dispatch(adminLoginThunk({ email, password })).unwrap();
//       if (result?.success) {
//         toast.success('Admin logged in!');
//         navigate('/admin/dashboard');
//       }
//     } catch (error) {
//       toast.error('Invalid credentials');
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-900">
//       <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
//         <h2 className="text-2xl font-bold text-center text-gray-800">🔐 Admin Access</h2>
//         <p className="text-gray-500 text-sm text-center mb-6">Enter your credentials</p>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="admin@shop.com"
//             className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//             required
//           />
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="Password"
//             className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//             required
//           />
//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
//           >
//             Login
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AdminLoginPage;