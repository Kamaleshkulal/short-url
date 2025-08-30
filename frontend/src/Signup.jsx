import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const AUTH_BASE = `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}/api/auth`;

export default function Signup({ setToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${AUTH_BASE}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password,username }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        navigate('/shorten');
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (err) {
      setError('Server error');
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-8 bg-gradient-to-br from-blue-50 to-purple-100 rounded-lg shadow-lg max-w-md mx-auto mt-8">
      <h1 className="beautiful-title">Sign Up</h1>
      <form onSubmit={handleSignup} className="w-full flex flex-col gap-4">
        <input
          type="username"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base shadow-sm"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base shadow-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed shadow-md"
        >
          {loading ? 'Please wait...' : 'Sign Up'}
        </button>
      </form>
      <div className="mt-4 text-sm text-gray-700">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 hover:underline font-medium">Login</Link>
      </div>
      {error && <div className="text-red-500 mt-4 text-sm">{error}</div>}
    </div>
  );
}
