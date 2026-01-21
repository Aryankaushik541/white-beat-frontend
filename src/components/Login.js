import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const Login = ({ setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Try backend API first
      const response = await axios.post(`${API_URL}/login/`, {
        username,
        password
      });
      
      setUser(response.data);
      if (response.data.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/user-dashboard');
      }
    } catch (error) {
      // Fallback to frontend validation
      if (username === 'admin' && password === 'admin123') {
        setUser({ username, role: 'admin' });
        navigate('/admin-dashboard');
      } else if (username && password) {
        setUser({ username, role: 'user' });
        navigate('/user-dashboard');
      } else {
        alert('Invalid credentials');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
      </div>
      
      <div className="login-card glass fade-in">
        <div className="logo-section">
          <div className="logo-pulse"></div>
          <h1 className="logo-text">White Beat</h1>
          <p className="tagline">AI-Powered Intelligence Platform</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>

          <div className="login-hint">
            <p>💡 Admin: username: <code>admin</code> | password: <code>admin123</code></p>
            <p>👤 User: Any other credentials</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;