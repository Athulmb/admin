// src/pages/Login.js
import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const userRole = localStorage.getItem('userRole');
      if (userRole === 'Admin') {
        navigate('/overview');
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });

      if (res.data.user.role !== 'Admin') {
        setError('Access denied. Only administrators can login.');
        return;
      }

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userRole', res.data.user.role);
      localStorage.setItem('userName', res.data.user.name);
      console.log(res.data.token);
      

      navigate('/overview');
    } catch (err) {
      console.error(err);
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-600 to-black relative overflow-hidden">
      {/* Decorative blurred circles */}
      <div className="absolute -top-32 -right-32 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute -bottom-32 -left-32 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>

      {/* Glassmorphism Card */}
      <div className="relative z-10 w-full max-w-md p-8 rounded-3xl bg-white bg-opacity-20 backdrop-blur-md border border-white border-opacity-30 shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-white">Admin Login</h2>
        <p className="text-gray-200 text-sm mb-6 text-center">Only administrators can access this system</p>

        {error && <p className="text-red-400 mb-4 text-center font-medium">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-200 mb-2 font-medium">Email</label>
            <input 
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 rounded-xl border border-white border-opacity-30 bg-white bg-opacity-10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-300"
            />
          </div>
          
          <div>
            <label className="block text-gray-200 mb-2 font-medium">Password</label>
            <input 
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 rounded-xl border border-white border-opacity-30 bg-white bg-opacity-10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-300"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-white bg-opacity-25 text-white font-semibold shadow-lg hover:shadow-xl hover:bg-opacity-40 transition duration-300 transform hover:-translate-y-1"
          >
            Login as Admin
          </button>
        </form>

        <p className="mt-6 text-center text-white text-xs opacity-80">© 2025 Your Company. All rights reserved.</p>
      </div>
    </div>
  );
}

export default Login;
