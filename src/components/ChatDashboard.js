import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ChatDashboard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const ChatDashboard = () => {
  const navigate = useNavigate();
  
  // Get user from localStorage
  const username = localStorage.getItem('username');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  
  // Redirect to login if not logged in
  useEffect(() => {
    if (!username) {
      navigate('/');
    }
  }, [username, navigate]);

  // User object for compatibility
  const user = {
    username: username,
    avatar: '👤',
    full_name: username,
    isAdmin: isAdmin
  };

  // State management
  const [activeTab, setActiveTab] = useState('chats');
  const [conversations, setConversations] = useState([]);
  const [groups, setGroups] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [callHistory, setCallHistory] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserList, setShowUserList] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [showMessageMenu, setShowMessageMenu] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Fetch data on mount and set up polling
  useEffect(() => {
    if (username) {
      fetchConversations();
      fetchGroups();
      fetchContacts();
      fetchStatuses();
      fetchCallHistory();

      // Poll for new messages every 3 seconds
      const interval = setInterval(() => {
        if (selectedChat) {
          fetchMessages(
            selectedChat.isGroup ? selectedChat.id : selectedChat.username,
            selectedChat.isGroup,
            true // silent refresh
          );
        }
        fetchConversations();
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [selectedChat, username]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Typing indicator
  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      // In real implementation, send typing status to backend
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  };

  // Fetch conversations
  const fetchConversations = async () => {
    try {
      const response = await axios.get(`${API_URL}/conversations/`, {
        params: { username: username }
      });
      setConversations(response.data.conversations || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setConversations([]);
    }
  };

  // Fetch groups
  const fetchGroups = async () => {
    try {
      const response = await axios.get(`${API_URL}/groups/`, {
        params: { username: username }
      });
      setGroups(response.data.groups || []);
    } catch (error) {
      console.error('Error fetching groups:', error);
      setGroups([]);
    }
  };

  // Fetch contacts
  const fetchContacts = async () => {
    try {
      const response = await axios.get(`${API_URL}/contacts/`, {
        params: { username: username }
      });
      setContacts(response.data.contacts || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setContacts([]);
    }
  };

  // Fetch statuses
  const fetchStatuses = async () => {
    try {
      const response = await axios.get(`${API_URL}/statuses/`, {
        params: { username: username }
      });
      setStatuses(response.data.statuses || []);
    } catch (error) {
      console.error('Error fetching statuses:', error);
      setStatuses([]);
    }
  };

  // Fetch call history
  const fetchCallHistory = async () => {
    try {
      const response = await axios.get(`${API_URL}/call-history/`, {
        params: { username: username }
      });
      setCallHistory(response.data.calls || []);
    } catch (error) {
      console.error('Error fetching call history:', error);
      setCallHistory([]);
    }
  };

  // Fetch messages for a conversation
  const fetchMessages = async (chatId, isGroup = false, silent = false) => {
    if (!silent) setLoading(true);
    try {
      const endpoint = isGroup ? 'group-messages' : 'messages';
      const params = isGroup 
        ? { group_id: chatId, username: username }
        : { username: username, contact_username: chatId };
      
      const response = await axios.get(`${API_URL}/${endpoint}/`, { params });
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // Send message
  const sendMessage = async () => {
    if (!messageInput.trim() && !editingMessage) return;

    try {
      if (editingMessage) {
        // Edit existing message
        await axios.post(`${API_URL}/edit-message/`, {
          message_id: editingMessage.id,
          new_content: messageInput,
          username: username
        });
        setEditingMessage(null);
      } else {
        // Send new message
        const endpoint = selectedChat.isGroup ? 'send-group-message' : 'send-message';
        const payload = selectedChat.isGroup
          ? {
              username: username,
              group_id: selectedChat.id,
              content: messageInput,
              reply_to: replyingTo?.id
            }
          : {
              username: username,
              contact_username: selectedChat.username,
              content: messageInput,
              reply_to: replyingTo?.id
            };

        await axios.post(`${API_URL}/${endpoint}/`, payload);
      }

      setMessageInput('');
      setReplyingTo(null);
      fetchMessages(
        selectedChat.isGroup ? selectedChat.id : selectedChat.username,
        selectedChat.isGroup
      );
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    }
  };

  // Delete message
  const deleteMessage = async (messageId) => {
    if (!window.confirm('Delete this message?')) return;

    try {
      await axios.post(`${API_URL}/delete-message/`, {
        message_id: messageId,
        username: username
      });
      fetchMessages(
        selectedChat.isGroup ? selectedChat.id : selectedChat.username,
        selectedChat.isGroup
      );
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Failed to delete message');
    }
  };

  // Forward messages
  const forwardMessages = async (targetUsername) => {
    try {
      await axios.post(`${API_URL}/forward-messages/`, {
        username: username,
        message_ids: selectedMessages,
        target_username: targetUsername
      });
      setSelectedMessages([]);
      alert('Messages forwarded successfully!');
    } catch (error) {
      console.error('Error forwarding messages:', error);
      alert('Failed to forward messages');
    }
  };

  // React to message
  const reactToMessage = async (messageId, emoji) => {
    try {
      await axios.post(`${API_URL}/react-message/`, {
        username: username,
        message_id: messageId,
        emoji: emoji
      });
      fetchMessages(
        selectedChat.isGroup ? selectedChat.id : selectedChat.username,
        selectedChat.isGroup,
        true
      );
    } catch (error) {
      console.error('Error reacting to message:', error);
    }
  };

  // Upload media
  const handleMediaUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('username', username);
    if (selectedChat.isGroup) {
      formData.append('group_id', selectedChat.id);
    } else {
      formData.append('contact_username', selectedChat.username);
    }

    try {
      setLoading(true);
      await axios.post(`${API_URL}/upload-media/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchMessages(
        selectedChat.isGroup ? selectedChat.id : selectedChat.username,
        selectedChat.isGroup
      );
    } catch (error) {
      console.error('Error uploading media:', error);
      alert('Failed to upload media');
    } finally {
      setLoading(false);
    }
  };

  // Start new chat
  const startNewChat = async (contactUsername) => {
    const contact = allUsers.find(u => u.username === contactUsername);
    if (!contact) return;

    setSelectedChat({
      username: contact.username,
      name: contact.full_name || contact.username,
      avatar: contact.avatar || '👤',
      isGroup: false,
      is_online: contact.is_online
    });
    setShowUserList(false);
    fetchMessages(contact.username, false);
  };

  // Create group
  const createGroup = async (groupName, groupDescription, members) => {
    try {
      await axios.post(`${API_URL}/create-group/`, {
        username: username,
        name: groupName,
        description: groupDescription,
        members: members
      });
      setShowGroupModal(false);
      fetchGroups();
      alert('Group created successfully!');
    } catch (error) {
      console.error('Error creating group:', error);
      alert('Failed to create group');
    }
  };

  // Add status
  const addStatus = async (statusData) => {
    try {
      await axios.post(`${API_URL}/add-status/`, {
        username: username,
        ...statusData
      });
      setShowStatusModal(false);
      fetchStatuses();
      alert('Status added successfully!');
    } catch (error) {
      console.error('Error adding status:', error);
      alert('Failed to add status');
    }
  };

  // Make call
  const makeCall = async (callType) => {
    if (!selectedChat || selectedChat.isGroup) return;

    try {
      await axios.post(`${API_URL}/make-call/`, {
        username: username,
        contact: selectedChat.username,
        type: callType
      });
      alert(`${callType} call initiated!`);
      fetchCallHistory();
    } catch (error) {
      console.error('Error making call:', error);
      alert('Failed to make call');
    }
  };

  // Search users
  const searchUsers = async (query) => {
    if (!query) {
      setAllUsers([]);
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/search-users/`, {
        params: { query, username: username }
      });
      setAllUsers(response.data.users || []);
    } catch (error) {
      console.error('Error searching users:', error);
      setAllUsers([]);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('isAdmin');
    navigate('/');
  };

  // Show loading if no username
  if (!username) {
    return (
      <div className="chat-loading">
        <div className="spinner"></div>
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="chat-dashboard">
      {/* Sidebar */}
      <div className="chat-sidebar">
        {/* Header */}
        <div className="sidebar-header">
          <div className="user-profile" onClick={() => setShowProfileModal(true)}>
            <div className="avatar">{user?.avatar || '👤'}</div>
            <div className="user-info">
              <h3>{user?.full_name || username}</h3>
              <span className="status online">Online</span>
            </div>
          </div>
          <div className="header-actions">
            <button className="icon-btn" onClick={() => setShowUserList(true)} title="New Chat">
              💬
            </button>
            <button className="icon-btn" onClick={() => setShowGroupModal(true)} title="New Group">
              👥
            </button>
            <button className="icon-btn" onClick={handleLogout} title="Logout">
              🚪
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search or start new chat"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Tabs */}
        <div className="sidebar-tabs">
          <button
            className={`tab ${activeTab === 'chats' ? 'active' : ''}`}
            onClick={() => setActiveTab('chats')}
          >
            💬 Chats
            {conversations.length > 0 && <span className="badge">{conversations.length}</span>}
          </button>
          <button
            className={`tab ${activeTab === 'groups' ? 'active' : ''}`}
            onClick={() => setActiveTab('groups')}
          >
            👥 Groups
            {groups.length > 0 && <span className="badge">{groups.length}</span>}
          </button>
          <button
            className={`tab ${activeTab === 'status' ? 'active' : ''}`}
            onClick={() => setActiveTab('status')}
          >
            📸 Status
          </button>
          <button
            className={`tab ${activeTab === 'calls' ? 'active' : ''}`}
            onClick={() => setActiveTab('calls')}
          >
            📞 Calls
          </button>
        </div>

        {/* Chat List */}
        <div className="chat-list">
          {activeTab === 'chats' && (
            <>
              {conversations.length === 0 ? (
                <div className="empty-state">
                  <p>No conversations yet</p>
                  <button onClick={() => setShowUserList(true)}>Start a chat</button>
                </div>
              ) : (
                conversations
                  .filter(conv => 
                    conv.name?.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map(conv => (
                    <div
                      key={conv.id}
                      className={`chat-item ${selectedChat?.id === conv.id ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedChat(conv);
                        fetchMessages(conv.username, false);
                      }}
                    >
                      <div className="chat-avatar">
                        {conv.avatar || '👤'}
                        {conv.is_online && <span className="online-dot"></span>}
                      </div>
                      <div className="chat-info">
                        <div className="chat-header">
                          <h4>{conv.name}</h4>
                          <span className="time">{conv.timestamp}</span>
                        </div>
                        <div className="chat-preview">
                          <p>{conv.last_message}</p>
                          {conv.unread_count > 0 && (
                            <span className="unread-badge">{conv.unread_count}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </>
          )}

          {activeTab === 'groups' && (
            <>
              {groups.length === 0 ? (
                <div className="empty-state">
                  <p>No groups yet</p>
                  <button onClick={() => setShowGroupModal(true)}>Create a group</button>
                </div>
              ) : (
                groups
                  .filter(group => 
                    group.name?.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map(group => (
                    <div
                      key={group.id}
                      className={`chat-item ${selectedChat?.id === group.id ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedChat({ ...group, isGroup: true });
                        fetchMessages(group.id, true);
                      }}
                    >
                      <div className="chat-avatar">👨‍👩‍👧‍👦</div>
                      <div className="chat-info">
                        <div className="chat-header">
                          <h4>{group.name}</h4>
                          <span className="time">{group.timestamp}</span>
                        </div>
                        <div className="chat-preview">
                          <p>{group.last_message || group.description}</p>
                          {group.unread_count > 0 && (
                            <span className="unread-badge">{group.unread_count}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </>
          )}

          {activeTab === 'status' && (
            <>
              <div className="status-section">
                <div className="my-status" onClick={() => setShowStatusModal(true)}>
                  <div className="status-avatar">
                    {user?.avatar || '👤'}
                    <span className="add-status">+</span>
                  </div>
                  <div className="status-info">
                    <h4>My Status</h4>
                    <p>Tap to add status update</p>
                  </div>
                </div>
              </div>

              {statuses.length > 0 && (
                <div className="status-list">
                  <h5>Recent updates</h5>
                  {statuses.map(status => (
                    <div key={status.id} className="status-item">
                      <div className="status-avatar">
                        {status.avatar || '👤'}
                        <div className="status-ring"></div>
                      </div>
                      <div className="status-info">
                        <h4>{status.username}</h4>
                        <p>{status.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'calls' && (
            <>
              {callHistory.length === 0 ? (
                <div className="empty-state">
                  <p>No call history</p>
                </div>
              ) : (
                callHistory.map(call => (
                  <div key={call.id} className="call-item">
                    <div className="call-avatar">
                      {call.type === 'video' ? '📹' : '📞'}
                    </div>
                    <div className="call-info">
                      <h4>{call.contact_name}</h4>
                      <p>
                        {call.status === 'completed' ? '✓' : '✗'} {call.type} call • {call.duration}
                      </p>
                    </div>
                    <span className="call-time">{call.timestamp}</span>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="chat-area">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="chat-header">
              <div className="chat-user">
                <div className="avatar">
                  {selectedChat.avatar || (selectedChat.isGroup ? '👨‍👩‍👧‍👦' : '👤')}
                  {!selectedChat.isGroup && selectedChat.is_online && (
                    <span className="online-dot"></span>
                  )}
                </div>
                <div className="user-details">
                  <h3>{selectedChat.name}</h3>
                  <span className="status">
                    {selectedChat.isGroup 
                      ? `${selectedChat.member_count || 0} members`
                      : selectedChat.is_online ? 'Online' : 'Offline'
                    }
                  </span>
                </div>
              </div>
              <div className="chat-actions">
                {!selectedChat.isGroup && (
                  <>
                    <button className="icon-btn" onClick={() => makeCall('audio')} title="Voice Call">
                      📞
                    </button>
                    <button className="icon-btn" onClick={() => makeCall('video')} title="Video Call">
                      📹
                    </button>
                  </>
                )}
                <button className="icon-btn" title="Search">
                  🔍
                </button>
                <button className="icon-btn" title="More">
                  ⋮
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="messages-container">
              {loading && messages.length === 0 ? (
                <div className="loading-messages">
                  <div className="spinner"></div>
                  <p>Loading messages...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="empty-messages">
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                <>
                  {messages.map((message, index) => {
                    const isOwn = message.sender === username;
                    const showAvatar = !isOwn && selectedChat.isGroup && 
                      (index === messages.length - 1 || messages[index + 1]?.sender !== message.sender);

                    return (
                      <div
                        key={message.id}
                        className={`message ${isOwn ? 'own' : 'other'} ${
                          selectedMessages.includes(message.id) ? 'selected' : ''
                        }`}
                        onClick={() => {
                          if (selectedMessages.length > 0) {
                            setSelectedMessages(prev =>
                              prev.includes(message.id)
                                ? prev.filter(id => id !== message.id)
                                : [...prev, message.id]
                            );
                          }
                        }}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          setShowMessageMenu(message.id);
                        }}
                      >
                        {showAvatar && (
                          <div className="message-avatar">
                            {message.sender_avatar || '👤'}
                          </div>
                        )}
                        <div className="message-content">
                          {!isOwn && selectedChat.isGroup && (
                            <div className="message-sender">{message.sender}</div>
                          )}
                          {message.reply_to && (
                            <div className="message-reply">
                              <div className="reply-bar"></div>
                              <div className="reply-content">
                                <span className="reply-sender">{message.reply_to.sender}</span>
                                <p>{message.reply_to.content}</p>
                              </div>
                            </div>
                          )}
                          {message.media_url && (
                            <div className="message-media">
                              {message.media_type?.startsWith('image') ? (
                                <img src={message.media_url} alt="Media" />
                              ) : message.media_type?.startsWith('video') ? (
                                <video src={message.media_url} controls />
                              ) : (
                                <a href={message.media_url} target="_blank" rel="noopener noreferrer">
                                  📎 {message.media_url.split('/').pop()}
                                </a>
                              )}
                            </div>
                          )}
                          <p className="message-text">{message.content}</p>
                          <div className="message-footer">
                            <span className="message-time">{message.timestamp}</span>
                            {isOwn && (
                              <span className="message-status">
                                {message.is_read ? '✓✓' : '✓'}
                              </span>
                            )}
                            {message.is_edited && <span className="edited-badge">edited</span>}
                          </div>
                          {message.reactions && message.reactions.length > 0 && (
                            <div className="message-reactions">
                              {message.reactions.map((reaction, idx) => (
                                <span key={idx} className="reaction">
                                  {reaction.emoji}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Message Menu */}
                        {showMessageMenu === message.id && (
                          <div className="message-menu">
                            <button onClick={() => {
                              setReplyingTo(message);
                              setShowMessageMenu(null);
                            }}>
                              ↩️ Reply
                            </button>
                            <button onClick={() => {
                              reactToMessage(message.id, '❤️');
                              setShowMessageMenu(null);
                            }}>
                              ❤️ React
                            </button>
                            {isOwn && (
                              <>
                                <button onClick={() => {
                                  setEditingMessage(message);
                                  setMessageInput(message.content);
                                  setShowMessageMenu(null);
                                }}>
                                  ✏️ Edit
                                </button>
                                <button onClick={() => {
                                  deleteMessage(message.id);
                                  setShowMessageMenu(null);
                                }}>
                                  🗑️ Delete
                                </button>
                              </>
                            )}
                            <button onClick={() => {
                              setSelectedMessages([message.id]);
                              setShowMessageMenu(null);
                            }}>
                              ➡️ Forward
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </>
              )}

              {otherUserTyping && (
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="message-input-container">
              {replyingTo && (
                <div className="replying-to">
                  <div className="reply-preview">
                    <span>Replying to {replyingTo.sender}</span>
                    <p>{replyingTo.content}</p>
                  </div>
                  <button onClick={() => setReplyingTo(null)}>✕</button>
                </div>
              )}
              {editingMessage && (
                <div className="editing-message">
                  <span>Editing message</span>
                  <button onClick={() => {
                    setEditingMessage(null);
                    setMessageInput('');
                  }}>✕</button>
                </div>
              )}
              {selectedMessages.length > 0 && (
                <div className="selected-messages-bar">
                  <span>{selectedMessages.length} selected</span>
                  <div className="selection-actions">
                    <button onClick={() => {
                      const targetUsername = prompt('Enter username to forward to:');
                      if (targetUsername) forwardMessages(targetUsername);
                    }}>
                      ➡️ Forward
                    </button>
                    <button onClick={() => setSelectedMessages([])}>✕ Cancel</button>
                  </div>
                </div>
              )}
              <div className="input-wrapper">
                <button className="icon-btn" title="Emoji">
                  😊
                </button>
                <button 
                  className="icon-btn" 
                  onClick={() => fileInputRef.current?.click()}
                  title="Attach"
                >
                  📎
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleMediaUpload}
                  accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                />
                <input
                  type="text"
                  placeholder="Type a message"
                  value={messageInput}
                  onChange={(e) => {
                    setMessageInput(e.target.value);
                    handleTyping();
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                />
                <button 
                  className="send-btn"
                  onClick={sendMessage}
                  disabled={!messageInput.trim() && !editingMessage}
                >
                  {editingMessage ? '✓' : '➤'}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="no-chat-selected">
            <div className="welcome-message">
              <h2>Welcome to White Beat Chat! 💬</h2>
              <p>Select a conversation to start messaging</p>
              <button onClick={() => setShowUserList(true)}>Start New Chat</button>
            </div>
          </div>
        )}
      </div>

      {/* User List Modal */}
      {showUserList && (
        <div className="modal-overlay" onClick={() => setShowUserList(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Start New Chat</h3>
            <input
              type="text"
              placeholder="Search users..."
              onChange={(e) => searchUsers(e.target.value)}
              className="search-input"
            />
            <div className="user-list">
              {allUsers.map(user => (
                <div
                  key={user.username}
                  className="user-item"
                  onClick={() => startNewChat(user.username)}
                >
                  <div className="avatar">{user.avatar || '👤'}</div>
                  <div className="user-info">
                    <h4>{user.full_name || user.username}</h4>
                    <p>@{user.username}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn-secondary" onClick={() => setShowUserList(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Group Modal */}
      {showGroupModal && (
        <div className="modal-overlay" onClick={() => setShowGroupModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Create New Group</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              createGroup(
                formData.get('name'),
                formData.get('description'),
                []
              );
            }}>
              <div className="form-group">
                <label>Group Name</label>
                <input type="text" name="name" required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea name="description" rows="3"></textarea>
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn-primary">Create</button>
                <button type="button" className="btn-secondary" onClick={() => setShowGroupModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Status Modal */}
      {showStatusModal && (
        <div className="modal-overlay" onClick={() => setShowStatusModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Add Status</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              addStatus({
                type: formData.get('type'),
                content: formData.get('content'),
                privacy: formData.get('privacy')
              });
            }}>
              <div className="form-group">
                <label>Type</label>
                <select name="type">
                  <option value="text">Text</option>
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
              </div>
              <div className="form-group">
                <label>Content</label>
                <textarea name="content" rows="4" required></textarea>
              </div>
              <div className="form-group">
                <label>Privacy</label>
                <select name="privacy">
                  <option value="everyone">Everyone</option>
                  <option value="contacts">Contacts Only</option>
                  <option value="selected">Selected Contacts</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn-primary">Post</button>
                <button type="button" className="btn-secondary" onClick={() => setShowStatusModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="modal-overlay" onClick={() => setShowProfileModal(false)}>
          <div className="modal-content profile-modal" onClick={(e) => e.stopPropagation()}>
            <h3>My Profile</h3>
            <div className="profile-display">
              <div className="profile-avatar-large">{user?.avatar || '👤'}</div>
              <h2>{user?.full_name || username}</h2>
              <p>@{username}</p>
              {isAdmin && <span className="admin-badge">Admin</span>}
            </div>
            <button className="btn-secondary" onClick={() => setShowProfileModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatDashboard;
