import React, { useState, useEffect } from 'react';
import axios from 'axios';
const API_BASE = `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}/api/url`;

export default function Shorten({ token, onLogout }) {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [urlHistory, setUrlHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('shorten'); // 'shorten' or 'history'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShortUrl('');
    setCopied(false);
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/shorten`,
        { original: originalUrl },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      const data = response.data;
      if (data.success && data.data) {
        // Construct the full short URL
        const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
        const fullShortUrl = `${baseUrl}/${data.data.short}`;
        setShortUrl(fullShortUrl);
      } else {
        setError(data.message || 'Failed to shorten URL');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Server error';
      setError(errorMessage);
    }
    setLoading(false);
  };

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(false), 1500);
  };

  useEffect(() => {
    const fetchUrlHistory = async () => {
      try {
        const response = await axios.get(`${API_BASE}/history`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = response.data;
        if (data.success) {
          const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
          const urlsWithFullShortUrl = (data.data?.urls || []).map(url => ({
            ...url,
            shortUrl: `${baseUrl}/${url.short}`,
            original: url.original
          }));
          setUrlHistory(urlsWithFullShortUrl);
        }
      } catch (err) {
        console.error('Failed to fetch URL history:', err);
      }
      setHistoryLoading(false);
    };

    fetchUrlHistory();
  }, [token]);

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Header */}
        <div className="card">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="title">URL Shortener</h1>
              <p className="subtitle">Transform your long URLs into short, shareable links</p>
            </div>
            <button
              onClick={onLogout}
              className="btn btn-danger"
            >
              Logout
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="tabs">
            <button
              onClick={() => setActiveTab('shorten')}
              className={`tab ${activeTab === 'shorten' ? 'tab-active' : ''}`}
            >
              Shorten URL
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`tab ${activeTab === 'history' ? 'tab-active' : ''}`}
            >
              URL History
            </button>
          </div>
        </div>

        {/* URL Shortener Form */}
        {activeTab === 'shorten' && (
          <div className="card animate-fade-in">
            <form onSubmit={handleSubmit} className="shortener-form">
              <div className="form-group">
                <input
                  type="url"
                  placeholder="Enter your long URL here..."
                  value={originalUrl}
                  onChange={e => setOriginalUrl(e.target.value)}
                  required
                  className="input url-input"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="loading-spinner"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    'Shorten URL'
                  )}
                </button>
              </div>
            </form>

            {/* Shortened URL Result */}
            {shortUrl && (
              <div className="result-container success-result animate-fade-in">
                <div className="flex-responsive items-center gap-3">
                  <input
                    type="text"
                    value={shortUrl}
                    readOnly
                    className="input result-input"
                  />
                  <button
                    onClick={() => handleCopy(shortUrl)}
                    className={`btn ${copied === shortUrl ? 'btn-success' : 'btn-primary'}`}
                  >
                    {copied === shortUrl ? (
                      <span className="flex items-center gap-2">
                        <svg className="icon-sm" viewBox="0 0 24 24">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                        Copied!
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <svg className="icon-sm" viewBox="0 0 24 24">
                          <path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                        Copy URL
                      </span>
                    )}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="error-container animate-fade-in">
                <svg className="icon-sm" viewBox="0 0 24 24">
                  <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}
          </div>
        )}

        {/* URL History Section */}
        {activeTab === 'history' && (
          <div className="card">
            {historyLoading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
              </div>
            ) : urlHistory.length === 0 ? (
              <div className="empty-state">
                <svg className="icon" viewBox="0 0 24 24">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="empty-state-title">No shortened URLs yet</h3>
                <p className="empty-state-description">Start shortening URLs to see your history here.</p>
                <button
                  onClick={() => setActiveTab('shorten')}
                  className="btn btn-primary mt-4"
                >
                  Shorten a URL
                </button>
              </div>
            ) : (
              <div className="url-history">
                {urlHistory.map((url, index) => (
                  <div key={index} className="history-item animate-fade-in">
                    <div className="original-url">
                      <svg className="icon-sm" viewBox="0 0 24 24">
                        <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      <span title={url.original}>{url.original}</span>
                    </div>

                    <div className="short-url-container">
                      <a
                        href={url.shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="short-url-link"
                      >
                        {url.shortUrl}
                      </a>
                      <button
                        onClick={() => handleCopy(url.shortUrl)}
                        className={`btn ${copied === url.shortUrl ? 'btn-success' : 'btn-secondary'} btn-sm`}
                      >
                        {copied === url.shortUrl ? 'Copied!' : 'Copy'}
                      </button>
                    </div>

                    <div className="timestamp">
                      <svg className="icon-sm" viewBox="0 0 24 24">
                        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{new Date(url.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
