import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    full_name: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

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
      const endpoint = isLogin ? '/login/' : '/signup/';
      const response = await fetch(`http://localhost:8000/api${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          // Store user data
          localStorage.setItem('username', data.username);
          localStorage.setItem('isAdmin', data.is_admin);
          
          setSuccess('✅ Login successful! Redirecting...');
          
          // Redirect to dashboard
          setTimeout(() => {
            navigate('/dashboard');
          }, 1000);
        } else {
          setSuccess('✅ Account created successfully! Please login.');
          setTimeout(() => {
            setIsLogin(true);
            setFormData({ username: '', password: '', email: '', full_name: '' });
          }, 2000);
        }
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('❌ Cannot connect to server. Please check if backend is running.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        {/* Left Side - Login Form */}
        <div className="login-left">
          <div className="login-logo">
            <div className="logo-icon">🤖</div>
            <h1>White Beat</h1>
            <p>Full-Featured Messaging Platform</p>
          </div>

          {/* Tab Buttons */}
          <div className="login-tabs">
            <button
              className={`tab-btn ${isLogin ? 'active' : ''}`}
              onClick={() => {
                setIsLogin(true);
                setError('');
                setSuccess('');
              }}
            >
              Login
            </button>
            <button
              className={`tab-btn ${!isLogin ? 'active' : ''}`}
              onClick={() => {
                setIsLogin(false);
                setError('');
                setSuccess('');
              }}
            >
              Sign Up
            </button>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="error-message">
              <span>⚠️</span>
              {error}
            </div>
          )}

          {success && (
            <div className="success-message">
              <span>✅</span>
              {success}
            </div>
          )}

          {/* Form */}
          <form className="login-form" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-group">
                <label>
                  <span>👤</span>
                  Full Name
                </label>
                <input
                  type="text"
                  name="full_name"
                  placeholder="Enter your full name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required={!isLogin}
                />
              </div>
            )}

            <div className="form-group">
              <label>
                <span>👤</span>
                Username
              </label>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            {!isLogin && (
              <div className="form-group">
                <label>
                  <span>📧</span>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required={!isLogin}
                />
              </div>
            )}

            <div className="form-group">
              <label>
                <span>🔒</span>
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="loading"></span>
                  {isLogin ? 'Logging in...' : 'Creating account...'}
                </>
              ) : (
                <>
                  <span>{isLogin ? '🔓' : '✨'}</span>
                  {isLogin ? 'Login' : 'Sign Up'}
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          {isLogin && (
            <div className="demo-credentials">
              <h4>
                <span>💡</span>
                Demo Credentials
              </h4>
              <p><strong>Admin:</strong> admin / admin123</p>
              <p><strong>User:</strong> Any username/password</p>
            </div>
          )}
        </div>

        {/* Right Side - Welcome Section */}
        <div className="login-right">
          <div className="welcome-content">
            <h2>Welcome to White Beat</h2>
            <p>A full-featured messaging platform with:</p>

            <div className="features-list">
              <div className="feature-item">
                <span>✅</span>
                <span>User-to-user chat</span>
              </div>
              <div className="feature-item">
                <span>✅</span>
                <span>Group messaging</span>
              </div>
              <div className="feature-item">
                <span>✅</span>
                <span>Voice & video calls</span>
              </div>
              <div className="feature-item">
                <span>✅</span>
                <span>24-hour status updates</span>
              </div>
              <div className="feature-item">
                <span>✅</span>
                <span>Media messages (images, videos, audio)</span>
              </div>
              <div className="feature-item">
                <span>✅</span>
                <span>Message reactions & replies</span>
              </div>
              <div className="feature-item">
                <span>✅</span>
                <span>Contact management</span>
              </div>
              <div className="feature-item">
                <span>✅</span>
                <span>Privacy controls</span>
              </div>
            </div>

            <div className="platform-features">
              <h3>
                <span>🎯</span>
                Platform Features
              </h3>
              <ul>
                <li>
                  <span>💬</span>
                  Direct Messaging
                </li>
                <li>
                  <span>👥</span>
                  Group Chats
                </li>
                <li>
                  <span>📞</span>
                  Voice & Video Calls
                </li>
                <li>
                  <span>📸</span>
                  Status Updates
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
