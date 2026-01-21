import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const AdminDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/admin/stats/`);
      setStats(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !stats) {
    return (
      <div className="admin-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const statsCards = [
    { 
      label: 'Total Users', 
      value: stats?.total_users || 0, 
      change: '+12%', 
      icon: '👥' 
    },
    { 
      label: 'API Calls Today', 
      value: stats?.api_calls_today || 0, 
      change: '+8%', 
      icon: '📊' 
    },
    { 
      label: 'Active Sessions', 
      value: stats?.active_sessions || 0, 
      change: '+5%', 
      icon: '🔥' 
    },
    { 
      label: 'Total Messages', 
      value: stats?.total_messages || 0, 
      change: '+15%', 
      icon: '💬' 
    }
  ];

  return (
    <div className="admin-container">
      <aside className="admin-sidebar glass">
        <div className="sidebar-header">
          <div className="admin-logo"></div>
          <h2>White Beat</h2>
          <span className="admin-badge">Admin</span>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <span className="nav-icon">📊</span>
            Overview
          </button>
          <button 
            className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <span className="nav-icon">👥</span>
            Users
          </button>
          <button 
            className={`nav-item ${activeTab === 'api' ? 'active' : ''}`}
            onClick={() => setActiveTab('api')}
          >
            <span className="nav-icon">🔌</span>
            API Logs
          </button>
          <button 
            className={`nav-item ${activeTab === 'django' ? 'active' : ''}`}
            onClick={() => window.open('http://localhost:8000/admin', '_blank')}
          >
            <span className="nav-icon">⚙️</span>
            Django Admin
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="admin-profile">
            <div className="profile-avatar">👨‍💼</div>
            <div className="profile-info">
              <strong>{user.username}</strong>
              <span>Administrator</span>
            </div>
          </div>
          <button className="logout-btn" onClick={() => window.location.href = '/'}>Logout</button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Welcome back, {user.username}! {error && <span className="error-badge">⚠️ {error}</span>}</p>
          </div>
          <div className="header-actions">
            <button className="action-btn glass" onClick={fetchStats}>
              🔄 Refresh
            </button>
            <button className="action-btn glass" onClick={() => window.open('http://localhost:8000/admin', '_blank')}>
              🚀 Django Admin
            </button>
          </div>
        </header>

        {activeTab === 'overview' && (
          <div className="admin-content">
            <div className="stats-grid">
              {statsCards.map((stat, idx) => (
                <div key={idx} className="stat-card glass">
                  <div className="stat-icon">{stat.icon}</div>
                  <div className="stat-details">
                    <span className="stat-label">{stat.label}</span>
                    <h3 className="stat-value">{stat.value.toLocaleString()}</h3>
                    <span className="stat-change positive">{stat.change}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="charts-grid">
              <div className="chart-card glass">
                <h3>User Growth (Last 6 Days)</h3>
                <div className="chart-placeholder">
                  {(stats?.user_growth || [0,0,0,0,0,0]).map((value, idx) => (
                    <div 
                      key={idx} 
                      className="bar" 
                      style={{height: `${Math.max(value * 10, 20)}%`}}
                      title={`${value} users`}
                    ></div>
                  ))}
                </div>
              </div>

              <div className="chart-card glass">
                <h3>API Usage (Last 6 Hours)</h3>
                <div className="chart-placeholder">
                  {(stats?.api_usage || [0,0,0,0,0,0]).map((value, idx) => (
                    <div 
                      key={idx} 
                      className="bar" 
                      style={{height: `${Math.max(value * 2, 20)}%`}}
                      title={`${value} calls`}
                    ></div>
                  ))}
                </div>
              </div>
            </div>

            <div className="info-card glass">
              <h3>🎯 Quick Access</h3>
              <div className="quick-links">
                <button onClick={() => window.open('http://localhost:8000/admin/auth/user/', '_blank')}>
                  👥 Manage Users
                </button>
                <button onClick={() => window.open('http://localhost:8000/admin/api/chatmessage/', '_blank')}>
                  💬 View Messages
                </button>
                <button onClick={() => window.open('http://localhost:8000/admin/api/apilog/', '_blank')}>
                  📊 API Logs
                </button>
                <button onClick={() => window.open('http://localhost:8000/admin', '_blank')}>
                  ⚙️ Full Django Admin
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="admin-content">
            <div className="table-card glass">
              <div className="table-header">
                <h3>Recent Users ({stats?.recent_users?.length || 0})</h3>
                <button className="action-btn" onClick={() => window.open('http://localhost:8000/admin/auth/user/add/', '_blank')}>
                  + Add User
                </button>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Messages</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recent_users?.map(user => (
                    <tr key={user.id}>
                      <td><strong>{user.username}</strong></td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`status-badge ${user.status.toLowerCase()}`}>
                          {user.status}
                        </span>
                      </td>
                      <td>{user.total_messages}</td>
                      <td>{user.joined}</td>
                      <td>
                        <button 
                          className="table-action"
                          onClick={() => window.open(`http://localhost:8000/admin/auth/user/${user.id}/change/`, '_blank')}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'api' && (
          <div className="admin-content">
            <div className="table-card glass">
              <div className="table-header">
                <h3>API Request Logs ({stats?.recent_logs?.length || 0})</h3>
                <button className="action-btn" onClick={fetchStats}>🔄 Refresh</button>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Endpoint</th>
                    <th>Method</th>
                    <th>Status</th>
                    <th>Time</th>
                    <th>User</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recent_logs?.map(log => (
                    <tr key={log.id}>
                      <td><code>{log.endpoint}</code></td>
                      <td><span className="method-badge">{log.method}</span></td>
                      <td><span className={`status-code ${log.status < 400 ? 'success' : 'error'}`}>{log.status}</span></td>
                      <td>{log.time}</td>
                      <td>{log.user}</td>
                      <td>{log.created_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;