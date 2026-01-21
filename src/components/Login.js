import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const Login = ({ onLogin }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    phone_number: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isSignup) {
        // Signup
        if (!formData.email) {
          setError('Email is required for signup');
          setLoading(false);
          return;
        }

        const response = await axios.post(`${API_URL}/signup/`, {
          username: formData.username,
          password: formData.password,
          email: formData.email,
          phone_number: formData.phone_number || undefined
        });

        setSuccess(response.data.message || 'Account created successfully! Please login.');
        setIsSignup(false);
        setFormData({ username: formData.username, password: '', email: '', phone_number: '' });
      } else {
        // Login
        const response = await axios.post(`${API_URL}/login/`, {
          username: formData.username,
          password: formData.password
        });

        onLogin(response.data);
      }
    } catch (error) {
      console.error('Error:', error);
      setError(
        error.response?.data?.error || 
        error.response?.data?.message ||
        'An error occurred. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="bubble bubble-1"></div>
        <div className="bubble bubble-2"></div>
        <div className="bubble bubble-3"></div>
      </div>

      <div className="login-card glass">
        <div className="login-header">
          <div className="logo">💬</div>
          <h1>White Beat</h1>
          <p>Full-Featured Messaging Platform</p>
        </div>

        <div className="login-tabs">
          <button 
            className={!isSignup ? 'active' : ''} 
            onClick={() => {
              setIsSignup(false);
              setError('');
              setSuccess('');
            }}
          >
            Login
          </button>
          <button 
            className={isSignup ? 'active' : ''} 
            onClick={() => {
              setIsSignup(true);
              setError('');
              setSuccess('');
            }}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>👤 Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
              autoComplete="username"
            />
          </div>

          {isSignup && (
            <>
              <div className="form-group">
                <label>📧 Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <label>📱 Phone Number (Optional)</label>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  placeholder="+1234567890"
                  autoComplete="tel"
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label>🔒 Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              autoComplete={isSignup ? 'new-password' : 'current-password'}
            />
          </div>

          {error && (
            <div className="alert alert-error">
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              ✅ {success}
            </div>
          )}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (
              <span className="loading-spinner">⏳ Processing...</span>
            ) : (
              <span>{isSignup ? '🚀 Create Account' : '🔓 Login'}</span>
            )}
          </button>
        </form>

        <div className="login-footer">
          <div className="features-preview">
            <div className="feature-item">
              <span className="feature-icon">💬</span>
              <span>Direct Messaging</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">👥</span>
              <span>Group Chats</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📞</span>
              <span>Voice & Video Calls</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📸</span>
              <span>Status Updates</span>
            </div>
          </div>

          {!isSignup && (
            <div className="demo-credentials">
              <p className="demo-title">🎭 Demo Credentials</p>
              <div className="demo-info">
                <div>
                  <strong>Admin:</strong> admin / admin123
                </div>
                <div>
                  <strong>User:</strong> Any username/password
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="login-info">
        <h2>Welcome to White Beat</h2>
        <p>A full-featured messaging platform with:</p>
        <ul>
          <li>✅ User-to-user chat</li>
          <li>✅ Group messaging</li>
          <li>✅ Voice & video calls</li>
          <li>✅ 24-hour status updates</li>
          <li>✅ Media messages (images, videos, audio)</li>
          <li>✅ Message reactions & replies</li>
          <li>✅ Contact management</li>
          <li>✅ Privacy controls</li>
        </ul>
      </div>
    </div>
  );
};

export default Login;
