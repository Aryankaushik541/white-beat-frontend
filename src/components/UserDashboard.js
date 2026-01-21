import React, { useState } from 'react';
import axios from 'axios';
import './UserDashboard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const UserDashboard = ({ user }) => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const userMessage = { role: 'user', content: prompt };
    setMessages([...messages, userMessage]);
    setPrompt('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/chat/`, { prompt });
      const aiMessage = {
        role: 'assistant',
        content: response.data.response
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      // Fallback response
      const aiMessage = {
        role: 'assistant',
        content: `This is a simulated response. Backend not connected. Your message: "${prompt}"`
      };
      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav glass">
        <div className="nav-brand">
          <div className="nav-logo"></div>
          <span>White Beat</span>
        </div>
        <div className="nav-user">
          <span>👤 {user.username}</span>
          <button className="logout-btn" onClick={() => window.location.href = '/'}>Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="chat-container glass">
          <div className="chat-header">
            <h2>AI Assistant</h2>
            <span className="status-badge">🟢 Online</span>
          </div>

          <div className="messages-area">
            {messages.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🤖</div>
                <h3>Welcome to White Beat AI</h3>
                <p>Start a conversation with our AI assistant</p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className={`message ${msg.role}`}>
                  <div className="message-content">
                    {msg.content}
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="message assistant">
                <div className="message-content loading">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSendMessage} className="chat-input-form">
            <input
              type="text"
              placeholder="Ask me anything..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="chat-input"
            />
            <button type="submit" className="send-btn" disabled={loading}>
              ➤
            </button>
          </form>
        </div>

        <div className="sidebar">
          <div className="stats-card glass">
            <h3>Usage Stats</h3>
            <div className="stat-item">
              <span>Messages Today</span>
              <strong>{messages.length}</strong>
            </div>
            <div className="stat-item">
              <span>Total Conversations</span>
              <strong>12</strong>
            </div>
          </div>

          <div className="features-card glass">
            <h3>Features</h3>
            <ul>
              <li>✨ AI Chat Assistant</li>
              <li>📊 Analytics Dashboard</li>
              <li>🔒 Secure & Private</li>
              <li>⚡ Real-time Responses</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;