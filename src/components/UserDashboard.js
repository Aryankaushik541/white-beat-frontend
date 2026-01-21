import React, { useState } from 'react';
import axios from 'axios';
import './UserDashboard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const UserDashboard = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/chat/`, {
        prompt: input,
        username: user.username  // Send username to backend
      });

      const aiMessage = { 
        role: 'assistant', 
        content: response.data.response,
        model: response.data.model,
        demo: response.data.demo
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.',
        error: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav glass">
        <div className="nav-brand">
          <div className="brand-logo"></div>
          <h2>White Beat</h2>
        </div>
        <div className="nav-user">
          <span className="user-name">👤 {user.username}</span>
          <button className="logout-btn" onClick={() => window.location.href = '/'}>
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        <aside className="sidebar glass">
          <div className="sidebar-section">
            <h3>💬 Chat Statistics</h3>
            <div className="stat-item">
              <span className="stat-label">Messages Sent</span>
              <span className="stat-value">{messages.filter(m => m.role === 'user').length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">AI Responses</span>
              <span className="stat-value">{messages.filter(m => m.role === 'assistant').length}</span>
            </div>
          </div>

          <div className="sidebar-section">
            <h3>✨ Features</h3>
            <ul className="features-list">
              <li>🤖 AI-Powered Chat</li>
              <li>💾 Message History</li>
              <li>⚡ Real-time Responses</li>
              <li>🎨 Beautiful Interface</li>
            </ul>
          </div>
        </aside>

        <main className="chat-main">
          <div className="chat-header glass">
            <h1>AI Assistant</h1>
            <p>Ask me anything!</p>
          </div>

          <div className="chat-container glass">
            <div className="messages-container">
              {messages.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">💬</div>
                  <h3>Start a conversation</h3>
                  <p>Type a message below to begin chatting with AI</p>
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div key={idx} className={`message ${msg.role}`}>
                    <div className="message-avatar">
                      {msg.role === 'user' ? '👤' : '🤖'}
                    </div>
                    <div className="message-content">
                      <div className="message-text">{msg.content}</div>
                      {msg.model && (
                        <div className="message-meta">
                          <span className={`model-badge ${msg.demo ? 'demo' : 'production'}`}>
                            {msg.demo ? '🎭 Demo Mode' : '🚀 ' + msg.model}
                          </span>
                        </div>
                      )}
                      {msg.error && (
                        <div className="message-meta">
                          <span className="error-badge">⚠️ Error</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
              {loading && (
                <div className="message assistant">
                  <div className="message-avatar">🤖</div>
                  <div className="message-content">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={sendMessage} className="chat-input-form">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={loading}
                className="chat-input"
              />
              <button type="submit" disabled={loading || !input.trim()} className="send-button">
                {loading ? '⏳' : '📤'}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;