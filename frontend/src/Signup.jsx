import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

const AUTH_BASE = `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}/api/auth`;

export default function Signup({ setToken }) {
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

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await axios.post(`${AUTH_BASE}/signup`, {
        username,
        password
      });
      const data = response.data;

      if (data.success) {
        localStorage.setItem('token', data.data.token);
        setToken(data.data.token);
        toast.success(data.message || 'Account created successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setTimeout(() => navigate('/shorten'), 1000);
      } else {
        toast.error(data.message || 'Signup failed');
        setError(data.message || 'Signup failed');
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
        <h1 className="title">Sign Up</h1>
        <form onSubmit={handleSignup} className="flex-col gap-4">
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
              'Sign Up'
            )}
          </button>
        </form>
        <div className="text-center mt-4">
          Already have an account?{' '}
          <Link to="/login" className="link">Login</Link>
        </div>
        {error && <div className="error-text">{error}</div>}
        <ToastContainer />
      </div>
    </div>
  );
}
