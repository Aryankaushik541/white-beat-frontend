import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isSignup) {
        // Signup
        const response = await axios.post(`${API_URL}/signup/`, {
          username,
          password,
          email: email || `${username}@whitebeat.com`
        });

        setSuccess('Account created successfully! Please login.');
        setIsSignup(false);
        setPassword('');
        setEmail('');
      } else {
        // Login
        const response = await axios.post(`${API_URL}/login/`, {
          username,
          password
        });

        const { role, username: user, user_id, is_staff, is_superuser, email: userEmail } = response.data;
        
        // Set user data
        const userData = {
          role,
          username: user,
          userId: user_id,
          email: userEmail,
          isStaff: is_staff,
          isSuperuser: is_superuser
        };
        
        onLogin(userData);
        
        // Navigate based on role
        if (role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/user-dashboard');
        }
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.error || `${isSignup ? 'Signup' : 'Login'} failed. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setError('');
    setSuccess('');
    setPassword('');
    setEmail('');
  };

  const handleAdminInfo = () => {
    alert(
      '🔐 Admin Access Information:\n\n' +
      '✅ Superusers (created via Django command):\n' +
      '   → Go directly to Admin Dashboard\n' +
      '   → Full admin privileges\n\n' +
      '✅ Regular Users (created via Signup):\n' +
      '   → Go to User Dashboard\n' +
      '   → Chat and OSINT features\n\n' +
      '📝 Create Superuser:\n' +
      '   python manage.py createsuperuser\n\n' +
      '🎯 Promote User to Admin:\n' +
      '   Use /api/make-admin/ endpoint\n' +
      '   (Requires superuser credentials)'
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
            <div className="error-message shake">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="success-message">
              <span className="success-icon">✅</span>
              <span>{success}</span>
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

          {isSignup && (
            <div className="form-group">
              <label htmlFor="email">Email (Optional)</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>
          )}

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
                <span>{isSignup ? 'Creating Account...' : 'Logging in...'}</span>
              </>
            ) : (
              <>
                <span>{isSignup ? '📝' : '🚀'}</span>
                <span>{isSignup ? 'Sign Up' : 'Login'}</span>
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <div className="toggle-mode">
            <p>
              {isSignup ? 'Already have an account?' : "Don't have an account?"}
            </p>
            <button 
              type="button" 
              className="toggle-button"
              onClick={toggleMode}
              disabled={loading}
            >
              {isSignup ? 'Login' : 'Sign Up'}
            </button>
          </div>

          <div className="divider">
            <span>OR</span>
          </div>

          <div className="info-section">
            <div className="info-card">
              <div className="info-icon">👤</div>
              <div className="info-content">
                <h3>User Access</h3>
                <p>Sign up to create a user account</p>
                <p className="hint-text">Access chat and OSINT features</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">🔐</div>
              <div className="info-content">
                <h3>Admin Access</h3>
                <p>Login with superuser credentials</p>
                <p className="hint-text">
                  Create: <code>python manage.py createsuperuser</code>
                </p>
              </div>
            </div>
          </div>

          <button 
            type="button" 
            className="admin-info-btn"
            onClick={handleAdminInfo}
          >
            ℹ️ Admin Access Information
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;