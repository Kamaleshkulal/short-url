import React, { useState } from 'react';
const API_BASE = `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}/api/url`;

export default function Shorten({ token, onLogout }) {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShortUrl('');
    setCopied(false);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/shorten`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ original: originalUrl }),
      });
      const data = await res.json();
      if (res.ok && data.shortUrl) {
        setShortUrl(data.shortUrl);
      } else {
        setError(data.message || 'Failed to shorten URL');
      }
    } catch (err) {
      setError('Server error');
    }
    setLoading(false);
  };

  const handleCopy = () => {
    if (shortUrl) {
      navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-8 bg-gradient-to-br from-blue-50 to-purple-100 rounded-lg shadow-lg max-w-md mx-auto mt-8">
      <div className="flex w-full justify-between items-center mb-4">
        <h1 className="beautiful-title text-lg md:text-2xl !mb-0">Short URL Generator</h1>
        <button
          onClick={onLogout}
          className="bg-gray-200 text-gray-700 font-semibold rounded px-4 py-2 hover:bg-gray-300 transition"
        >
          Logout
        </button>
      </div>
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        <input
          type="url"
          placeholder="Enter your long URL here..."
          value={originalUrl}
          onChange={e => setOriginalUrl(e.target.value)}
          required
          className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base shadow-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed shadow-md"
        >
          {loading ? 'Shortening...' : 'Shorten'}
        </button>
      </form>
      {shortUrl && (
        <div className="flex flex-col md:flex-row items-center gap-2 mt-6 w-full">
          <input
            type="text"
            value={shortUrl}
            readOnly
            className="flex-1 px-3 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-700 focus:outline-none text-sm md:text-base shadow-sm"
          />
          <button
            onClick={handleCopy}
            className={`ml-0 md:ml-2 mt-2 md:mt-0 px-4 py-2 rounded-lg font-medium text-white transition ${copied ? 'bg-green-500' : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}
      {error && <div className="text-red-500 mt-4 text-sm">{error}</div>}
    </div>
  );
}
