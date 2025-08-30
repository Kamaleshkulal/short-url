import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home({ token }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate('/shorten');
      return;
    }
  }, [token, navigate]);

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="card text-center animate-fade-in">
          <h1 className="title">URL Shortener</h1>
          <p className="subtitle">
            Transform your long URLs into short, memorable links in seconds
          </p>

          <div className="flex flex-responsive justify-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="btn btn-primary"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="btn btn-secondary"
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="features-grid">
          <div className="card feature-card animate-fade-in">
            <div className="feature-icon">
              <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="feature-title">Fast & Reliable</h3>
            <p className="feature-description">Instantly create short links that never expire</p>
          </div>

          <div className="card feature-card animate-fade-in">
            <div className="feature-icon">
              <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="feature-title">Secure</h3>
            <p className="feature-description">Your links are safe and protected</p>
          </div>

          <div className="card feature-card animate-fade-in">
            <div className="feature-icon">
              <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="feature-title">Analytics</h3>
            <p className="feature-description">Track your link performance</p>
          </div>
        </div>
      </div>
    </div>
  );
}
