import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const userRole = localStorage.getItem('userRole');
      if (userRole === 'Admin') navigate('/overview');
      else {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });

      if (res.data.user.role !== 'Admin') {
        setError('Access denied. Only administrators can login.');
        return;
      }

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userRole', res.data.user.role);
      localStorage.setItem('userName', res.data.user.fullName); // <-- fixed

      navigate('/overview');
    } catch (err) {
      console.error(err);
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-600 to-black relative overflow-hidden">
      {/* ...rest of JSX remains the same */}
    </div>
  );
}

export default Login;
