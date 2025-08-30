import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

const AUTH_BASE = `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}/api/auth`;

export default function Login({ setToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      setToken(token);
      navigate('/shorten');
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await axios.post(`${AUTH_BASE}/signin`, {
        username,
        password
      });
      const data = response.data;

      if (data.success) {
        localStorage.setItem('token', data.data.token);
        setToken(data.data.token);
        toast.success('Login successful!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,

        });
        setTimeout(() => navigate('/shorten'), 1000);
      } else {
        toast.error(data.message || 'Login failed');
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Server error';
      toast.error(errorMessage);
      setError(errorMessage);
    }
    setLoading(false);
  };

  return (
    <div className="page-wrapper">
      <div className="form-container card animate-fade-in">
        <h1 className="title">Login</h1>
        <form onSubmit={handleLogin} className="flex-col gap-4">
          <div className="form-group">
            <input
              type="username"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              className="input"
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="input"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="loading-spinner"></div>
                <span>Please wait...</span>
              </div>
            ) : (
              'Login'
            )}
          </button>
        </form>
        <div className="text-center mt-4">
          Don't have an account?{' '}
          <Link to="/signup" className="link">Sign Up</Link>
        </div>
        {error && <div className="error-text">{error}</div>}
        <ToastContainer />
      </div>
    </div>
  );
}
