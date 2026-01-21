import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const Login = ({ setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Call Django login API
      const response = await axios.post(`${API_URL}/login/`, {
        username,
        password
      });

      const { role, username: userName, user_id, is_staff, is_superuser } = response.data;

      // Set user data
      setUser({ 
        username: userName, 
        role,
        user_id,
        is_staff,
        is_superuser
      });

      // Route based on role
      if (role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/user-dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.response?.status === 401) {
        setError('Invalid credentials. Only Django admin users can access admin dashboard.');
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="wave wave1"></div>
        <div className="wave wave2"></div>
        <div className="wave wave3"></div>
      </div>

      <div className="login-card glass">
        <div className="login-header">
          <div className="logo-container">
            <div className="logo pulse"></div>
          </div>
          <h1>White Beat</h1>
          <p>AI-Powered Intelligence Platform</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-small"></span>
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div className="login-footer">
          <div className="credentials-hint">
            <p><strong>🔐 Admin Access:</strong></p>
            <p>Use Django superuser credentials</p>
            <p className="hint-text">Create with: <code>python manage.py createsuperuser</code></p>
          </div>
          <div className="credentials-hint">
            <p><strong>👤 User Access:</strong></p>
            <p>Any username/password for user dashboard</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;