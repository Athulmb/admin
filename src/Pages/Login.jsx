import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if already logged in
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    if (token && userRole === 'Admin') navigate('/overview');
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post(
        'https://backend-fitvantage-production.up.railway.app/api/auth/login',
        { email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      // Check if user exists and is Admin
      if (!res.data.user || res.data.user.role !== 'Admin') {
        setError('Access denied. Only administrators can login.');
        setLoading(false);
        return;
      }

      // Save token and user info
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userRole', res.data.user.role);
      localStorage.setItem('userName', res.data.user.fullName);

      navigate('/overview'); // redirect after login
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-indigo-300">
      <div className="w-full max-w-md p-8 rounded-3xl bg-white bg-opacity-20 backdrop-blur-md border border-white border-opacity-30 shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-white">Admin Login</h2>
        {error && <p className="text-red-400 mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-200 mb-2 font-medium">Email</label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 rounded-xl border border-white border-opacity-30 bg-white bg-opacity-10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
              className="w-full p-3 rounded-xl border border-white border-opacity-30 bg-white bg-opacity-10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-white bg-opacity-25 text-white font-semibold shadow-lg hover:bg-opacity-40"
          >
            {loading ? 'Logging in...' : 'Login as Admin'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
