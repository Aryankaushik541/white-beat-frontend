import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/login/`, {
        username,
        password
      });

      const { role, username: user, user_id, is_staff, is_superuser } = response.data;
      
      onLogin({
        role,
        username: user,
        userId: user_id,
        isStaff: is_staff,
        isSuperuser: is_superuser
      });
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminAccess = () => {
    // Show admin instructions
    alert(
      '🔐 Admin Access Instructions:\n\n' +
      '1. Create a superuser:\n' +
      '   python manage.py createsuperuser\n\n' +
      '2. Login with superuser credentials\n\n' +
      '3. You will be redirected to Admin Dashboard\n\n' +
      'Only Django staff/superuser can access admin features!'
    );
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
              <span>{error}</span>
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
              disabled={loading}
              required
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
              disabled={loading}
              required
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? (
              <>
                <div className="spinner-small"></div>
                <span>Logging in...</span>
              </>
            ) : (
              <>
                <span>🚀</span>
                <span>Login</span>
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <div className="credentials-hint">
            <p><strong>👤 User Access:</strong></p>
            <p>Enter any username/password to create a user account</p>
          </div>

          <div className="credentials-hint">
            <p><strong>🔐 Admin Access:</strong></p>
            <p>Login with Django superuser credentials</p>
            <p className="hint-text">
              Create superuser: <code>python manage.py createsuperuser</code>
            </p>
          </div>

          <button 
            type="button" 
            className="admin-access-btn"
            onClick={handleAdminAccess}
          >
            ℹ️ How to Get Admin Access?
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;