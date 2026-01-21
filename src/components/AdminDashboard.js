import React, { useState } from 'react';
import './AdminDashboard.css';

const AdminDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Total Users', value: '1,234', change: '+12%', icon: '👥' },
    { label: 'API Calls Today', value: '45,678', change: '+8%', icon: '📊' },
    { label: 'Active Sessions', value: '89', change: '+5%', icon: '🔥' },
    { label: 'Revenue', value: '$12,345', change: '+15%', icon: '💰' }
  ];

  const recentUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active', joined: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Active', joined: '2024-01-14' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'Inactive', joined: '2024-01-13' },
    { id: 4, name: 'Alice Williams', email: 'alice@example.com', status: 'Active', joined: '2024-01-12' }
  ];

  const apiLogs = [
    { id: 1, endpoint: '/api/chat', method: 'POST', status: 200, time: '45ms', user: 'john@example.com' },
    { id: 2, endpoint: '/api/users', method: 'GET', status: 200, time: '23ms', user: 'jane@example.com' },
    { id: 3, endpoint: '/api/chat', method: 'POST', status: 200, time: '67ms', user: 'bob@example.com' },
    { id: 4, endpoint: '/api/analytics', method: 'GET', status: 200, time: '34ms', user: 'alice@example.com' }
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
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <span className="nav-icon">⚙️</span>
            Settings
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
            <p>Welcome back, {user.username}!</p>
          </div>
          <div className="header-actions">
            <button className="action-btn glass">🔔 Notifications</button>
            <button className="action-btn glass">📥 Export Data</button>
          </div>
        </header>

        {activeTab === 'overview' && (
          <div className="admin-content">
            <div className="stats-grid">
              {stats.map((stat, idx) => (
                <div key={idx} className="stat-card glass">
                  <div className="stat-icon">{stat.icon}</div>
                  <div className="stat-details">
                    <span className="stat-label">{stat.label}</span>
                    <h3 className="stat-value">{stat.value}</h3>
                    <span className="stat-change positive">{stat.change}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="charts-grid">
              <div className="chart-card glass">
                <h3>User Growth</h3>
                <div className="chart-placeholder">
                  <div className="bar" style={{height: '60%'}}></div>
                  <div className="bar" style={{height: '75%'}}></div>
                  <div className="bar" style={{height: '85%'}}></div>
                  <div className="bar" style={{height: '70%'}}></div>
                  <div className="bar" style={{height: '90%'}}></div>
                  <div className="bar" style={{height: '95%'}}></div>
                </div>
              </div>

              <div className="chart-card glass">
                <h3>API Usage</h3>
                <div className="chart-placeholder">
                  <div className="bar" style={{height: '80%'}}></div>
                  <div className="bar" style={{height: '65%'}}></div>
                  <div className="bar" style={{height: '90%'}}></div>
                  <div className="bar" style={{height: '75%'}}></div>
                  <div className="bar" style={{height: '85%'}}></div>
                  <div className="bar" style={{height: '70%'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="admin-content">
            <div className="table-card glass">
              <div className="table-header">
                <h3>Recent Users</h3>
                <button className="action-btn">+ Add User</button>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map(user => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`status-badge ${user.status.toLowerCase()}`}>
                          {user.status}
                        </span>
                      </td>
                      <td>{user.joined}</td>
                      <td>
                        <button className="table-action">Edit</button>
                        <button className="table-action danger">Delete</button>
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
                <h3>API Request Logs</h3>
                <button className="action-btn">🔄 Refresh</button>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Endpoint</th>
                    <th>Method</th>
                    <th>Status</th>
                    <th>Response Time</th>
                    <th>User</th>
                  </tr>
                </thead>
                <tbody>
                  {apiLogs.map(log => (
                    <tr key={log.id}>
                      <td><code>{log.endpoint}</code></td>
                      <td><span className="method-badge">{log.method}</span></td>
                      <td><span className="status-code success">{log.status}</span></td>
                      <td>{log.time}</td>
                      <td>{log.user}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="admin-content">
            <div className="settings-card glass">
              <h3>OpenAI Configuration</h3>
              <div className="setting-item">
                <label>API Key</label>
                <input type="password" placeholder="sk-..." className="setting-input" />
              </div>
              <div className="setting-item">
                <label>Model</label>
                <select className="setting-input">
                  <option>gpt-4</option>
                  <option>gpt-3.5-turbo</option>
                </select>
              </div>
              <div className="setting-item">
                <label>Max Tokens</label>
                <input type="number" placeholder="2000" className="setting-input" />
              </div>
              <button className="save-btn">Save Settings</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;