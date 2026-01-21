import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './ChatDashboard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const ChatDashboard = ({ user }) => {
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
  }, [selectedChat]);

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
        params: { username: user.username }
      });
      setConversations(response.data.conversations || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  // Fetch groups
  const fetchGroups = async () => {
    try {
      const response = await axios.get(`${API_URL}/groups/`, {
        params: { username: user.username }
      });
      setGroups(response.data.groups || []);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  // Fetch contacts
  const fetchContacts = async () => {
    try {
      const response = await axios.get(`${API_URL}/contacts/`, {
        params: { username: user.username }
      });
      setContacts(response.data.contacts || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  // Fetch statuses
  const fetchStatuses = async () => {
    try {
      const response = await axios.get(`${API_URL}/statuses/`, {
        params: { username: user.username }
      });
      setStatuses(response.data.statuses || []);
    } catch (error) {
      console.error('Error fetching statuses:', error);
    }
  };

  // Fetch call history
  const fetchCallHistory = async () => {
    try {
      const response = await axios.get(`${API_URL}/call-history/`, {
        params: { username: user.username }
      });
      setCallHistory(response.data.calls || []);
    } catch (error) {
      console.error('Error fetching call history:', error);
    }
  };

  // Fetch messages for a conversation
  const fetchMessages = async (otherUsername, isGroup = false, silent = false) => {
    try {
      if (!silent) setLoading(true);
      const endpoint = isGroup ? '/group-messages/' : '/messages/';
      const params = isGroup 
        ? { group_id: otherUsername }
        : { username: user.username, other_username: otherUsername };
      
      const response = await axios.get(`${API_URL}${endpoint}`, { params });
      setMessages(response.data.messages || []);
      
      // Mark messages as read
      if (!isGroup) {
        markAsRead(otherUsername);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // Mark messages as read
  const markAsRead = async (otherUsername) => {
    try {
      await axios.post(`${API_URL}/mark-read/`, {
        username: user.username,
        other_username: otherUsername
      });
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  // Send message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedChat) return;

    try {
      const payload = {
        sender: user.username,
        content: messageInput,
        message_type: 'text'
      };

      if (replyingTo) {
        payload.reply_to = replyingTo.id;
      }

      if (selectedChat.isGroup) {
        payload.group_id = selectedChat.id;
      } else {
        payload.receiver = selectedChat.username;
      }

      await axios.post(`${API_URL}/send-message/`, payload);
      setMessageInput('');
      setReplyingTo(null);
      fetchMessages(selectedChat.isGroup ? selectedChat.id : selectedChat.username, selectedChat.isGroup);
      fetchConversations();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  // Edit message
  const editMessage = async (messageId, newContent) => {
    try {
      await axios.post(`${API_URL}/edit-message/`, {
        message_id: messageId,
        username: user.username,
        new_content: newContent
      });
      setEditingMessage(null);
      fetchMessages(selectedChat.isGroup ? selectedChat.id : selectedChat.username, selectedChat.isGroup);
    } catch (error) {
      console.error('Error editing message:', error);
      alert('Failed to edit message.');
    }
  };

  // React to message
  const reactToMessage = async (messageId, reactionType) => {
    try {
      await axios.post(`${API_URL}/react-message/`, {
        message_id: messageId,
        username: user.username,
        reaction_type: reactionType
      });
      fetchMessages(selectedChat.isGroup ? selectedChat.id : selectedChat.username, selectedChat.isGroup, true);
    } catch (error) {
      console.error('Error reacting to message:', error);
    }
  };

  // Delete message
  const deleteMessage = async (messageId, deleteForEveryone = false) => {
    if (!window.confirm(deleteForEveryone ? 'Delete for everyone?' : 'Delete for you?')) return;
    
    try {
      await axios.post(`${API_URL}/delete-message/`, {
        message_id: messageId,
        username: user.username,
        delete_for_everyone: deleteForEveryone
      });
      fetchMessages(selectedChat.isGroup ? selectedChat.id : selectedChat.username, selectedChat.isGroup);
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Failed to delete message.');
    }
  };

  // Forward message
  const forwardMessage = async (messageId, recipients) => {
    try {
      await axios.post(`${API_URL}/forward-message/`, {
        message_id: messageId,
        sender: user.username,
        recipients: recipients
      });
      alert('Message forwarded successfully!');
      setSelectedMessages([]);
    } catch (error) {
      console.error('Error forwarding message:', error);
      alert('Failed to forward message.');
    }
  };

  // Upload media
  const handleMediaUpload = async (file, mediaType) => {
    if (!file || !selectedChat) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('sender', user.username);
    formData.append('message_type', mediaType);
    
    if (selectedChat.isGroup) {
      formData.append('group_id', selectedChat.id);
    } else {
      formData.append('receiver', selectedChat.username);
    }

    try {
      setLoading(true);
      await axios.post(`${API_URL}/send-message/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchMessages(selectedChat.isGroup ? selectedChat.id : selectedChat.username, selectedChat.isGroup);
      setShowMediaModal(false);
    } catch (error) {
      console.error('Error uploading media:', error);
      alert('Failed to upload media. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Start new chat
  const startNewChat = async (otherUser) => {
    setSelectedChat({
      username: otherUser.username,
      full_name: otherUser.full_name,
      avatar: otherUser.avatar,
      is_online: otherUser.is_online,
      isGroup: false
    });
    fetchMessages(otherUser.username, false);
    setShowUserList(false);
  };

  // Select chat
  const selectChat = (chat) => {
    setSelectedChat({
      ...chat,
      username: chat.other_user?.username || chat.username,
      full_name: chat.other_user?.full_name || chat.name,
      avatar: chat.other_user?.avatar || chat.avatar,
      is_online: chat.other_user?.is_online,
      isGroup: !!chat.member_count
    });
    fetchMessages(
      chat.other_user?.username || chat.id,
      !!chat.member_count
    );
  };

  // Fetch all users for new chat
  const fetchAllUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/users/`, {
        params: { username: user.username }
      });
      setAllUsers(response.data.users || []);
      setShowUserList(true);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Create group
  const createGroup = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
      await axios.post(`${API_URL}/create-group/`, {
        creator: user.username,
        name: formData.get('name'),
        description: formData.get('description')
      });
      fetchGroups();
      setShowGroupModal(false);
    } catch (error) {
      console.error('Error creating group:', error);
      alert('Failed to create group.');
    }
  };

  // Add group member
  const addGroupMember = async (groupId, username) => {
    try {
      await axios.post(`${API_URL}/add-group-member/`, {
        group_id: groupId,
        username: username,
        added_by: user.username
      });
      alert('Member added successfully!');
    } catch (error) {
      console.error('Error adding member:', error);
      alert('Failed to add member.');
    }
  };

  // Remove group member
  const removeGroupMember = async (groupId, username) => {
    if (!window.confirm('Remove this member?')) return;
    
    try {
      await axios.post(`${API_URL}/remove-group-member/`, {
        group_id: groupId,
        username: username,
        removed_by: user.username
      });
      alert('Member removed successfully!');
    } catch (error) {
      console.error('Error removing member:', error);
      alert('Failed to remove member.');
    }
  };

  // Create status
  const createStatus = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
      await axios.post(`${API_URL}/create-status/`, {
        username: user.username,
        content: formData.get('content'),
        status_type: formData.get('status_type') || 'text',
        privacy: formData.get('privacy') || 'everyone'
      });
      fetchStatuses();
      setShowStatusModal(false);
    } catch (error) {
      console.error('Error creating status:', error);
      alert('Failed to create status.');
    }
  };

  // View status
  const viewStatus = async (statusId) => {
    try {
      await axios.post(`${API_URL}/view-status/`, {
        status_id: statusId,
        viewer: user.username
      });
      fetchStatuses();
    } catch (error) {
      console.error('Error viewing status:', error);
    }
  };

  // Initiate call
  const initiateCall = async (callType) => {
    if (!selectedChat) return;
    
    try {
      const payload = {
        caller: user.username,
        call_type: callType
      };

      if (selectedChat.isGroup) {
        payload.group_id = selectedChat.id;
      } else {
        payload.receiver = selectedChat.username;
      }

      const response = await axios.post(`${API_URL}/initiate-call/`, payload);
      alert(`${callType} call initiated! Call ID: ${response.data.call_id}`);
      fetchCallHistory();
    } catch (error) {
      console.error('Error initiating call:', error);
      alert('Failed to initiate call.');
    }
  };

  // Update call status
  const updateCallStatus = async (callId, status) => {
    try {
      await axios.post(`${API_URL}/update-call-status/`, {
        call_id: callId,
        status: status
      });
      fetchCallHistory();
    } catch (error) {
      console.error('Error updating call status:', error);
    }
  };

  // Add contact
  const addContact = async (contactUsername) => {
    try {
      await axios.post(`${API_URL}/add-contact/`, {
        username: user.username,
        contact_username: contactUsername
      });
      fetchContacts();
      alert('Contact added successfully!');
    } catch (error) {
      console.error('Error adding contact:', error);
      alert('Failed to add contact.');
    }
  };

  // Format time
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / 3600000);
    
    if (hours < 1) {
      const minutes = Math.floor(diff / 60000);
      return minutes < 1 ? 'Just now' : `${minutes}m ago`;
    } else if (hours < 24) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (hours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  // Render emoji reactions
  const getReactionEmoji = (type) => {
    const emojis = {
      like: '👍',
      love: '❤️',
      laugh: '😂',
      wow: '😮',
      sad: '😢',
      angry: '😠'
    };
    return emojis[type] || '👍';
  };

  // Filter conversations by search
  const filteredConversations = conversations.filter(conv =>
    conv.other_user?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.other_user?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGroups = groups.filter(group =>
    group.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredContacts = contacts.filter(contact =>
    contact.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.nickname?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="chat-dashboard">
      {/* Sidebar */}
      <div className="chat-sidebar">
        <div className="sidebar-header">
          <div className="user-profile" onClick={() => setShowProfileModal(true)}>
            <div className="avatar">
              {user.avatar ? (
                <img src={user.avatar} alt="" />
              ) : (
                user.username[0].toUpperCase()
              )}
              <span className="online-dot"></span>
            </div>
            <div className="user-info">
              <h3>{user.username}</h3>
              <span className="status-indicator online">Online</span>
            </div>
          </div>
          <button className="logout-btn" onClick={() => window.location.href = '/'} title="Logout">
            🚪
          </button>
        </div>

        {/* Tabs */}
        <div className="sidebar-tabs">
          <button 
            className={activeTab === 'chats' ? 'active' : ''} 
            onClick={() => setActiveTab('chats')}
            title="Chats"
          >
            💬
          </button>
          <button 
            className={activeTab === 'groups' ? 'active' : ''} 
            onClick={() => setActiveTab('groups')}
            title="Groups"
          >
            👥
          </button>
          <button 
            className={activeTab === 'calls' ? 'active' : ''} 
            onClick={() => setActiveTab('calls')}
            title="Calls"
          >
            📞
          </button>
          <button 
            className={activeTab === 'status' ? 'active' : ''} 
            onClick={() => setActiveTab('status')}
            title="Status"
          >
            📸
          </button>
          <button 
            className={activeTab === 'contacts' ? 'active' : ''} 
            onClick={() => setActiveTab('contacts')}
            title="Contacts"
          >
            📇
          </button>
        </div>

        {/* Search */}
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* List */}
        <div className="sidebar-list">
          {activeTab === 'chats' && (
            <>
              <button className="new-chat-btn" onClick={fetchAllUsers}>
                ➕ New Chat
              </button>
              {filteredConversations.map((conv) => (
                <div 
                  key={conv.id} 
                  className={`list-item ${selectedChat?.id === conv.id ? 'active' : ''}`}
                  onClick={() => selectChat(conv)}
                >
                  <div className="avatar">
                    {conv.other_user?.avatar ? (
                      <img src={conv.other_user.avatar} alt="" />
                    ) : (
                      conv.other_user?.username[0].toUpperCase()
                    )}
                    {conv.other_user?.is_online && <span className="online-dot"></span>}
                  </div>
                  <div className="item-info">
                    <h4>{conv.other_user?.full_name || conv.other_user?.username}</h4>
                    <p className="last-message">
                      {conv.last_message?.is_mine && '✓ '}
                      {conv.last_message?.content || 'No messages yet'}
                    </p>
                  </div>
                  <div className="item-meta">
                    <span className="time">{formatTime(conv.updated_at)}</span>
                    {conv.unread_count > 0 && (
                      <span className="unread-badge">{conv.unread_count}</span>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}

          {activeTab === 'groups' && (
            <>
              <button className="new-chat-btn" onClick={() => setShowGroupModal(true)}>
                ➕ New Group
              </button>
              {filteredGroups.map((group) => (
                <div 
                  key={group.id} 
                  className={`list-item ${selectedChat?.id === group.id ? 'active' : ''}`}
                  onClick={() => selectChat(group)}
                >
                  <div className="avatar group-avatar">
                    {group.avatar ? <img src={group.avatar} alt="" /> : '👥'}
                  </div>
                  <div className="item-info">
                    <h4>{group.name}</h4>
                    <p>{group.member_count} members</p>
                  </div>
                  <div className="item-meta">
                    <span className="time">{formatTime(group.updated_at)}</span>
                    {group.unread_count > 0 && (
                      <span className="unread-badge">{group.unread_count}</span>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}

          {activeTab === 'calls' && (
            <>
              {callHistory.map((call, idx) => (
                <div key={idx} className="list-item">
                  <div className="avatar call-avatar">
                    {call.call_type === 'video' ? '📹' : '📞'}
                  </div>
                  <div className="item-info">
                    <h4>{call.is_incoming ? call.caller : call.receiver}</h4>
                    <p className={`call-status ${call.status}`}>
                      {call.is_incoming ? '↓' : '↑'} {call.status}
                      {call.duration && ` • ${Math.floor(call.duration / 60)}:${String(call.duration % 60).padStart(2, '0')}`}
                    </p>
                  </div>
                  <div className="item-meta">
                    <span className="time">{formatTime(call.started_at)}</span>
                  </div>
                </div>
              ))}
            </>
          )}

          {activeTab === 'status' && (
            <>
              <button className="new-chat-btn" onClick={() => setShowStatusModal(true)}>
                ➕ My Status
              </button>
              {statuses.map((statusGroup, idx) => (
                <div 
                  key={idx} 
                  className="list-item"
                  onClick={() => statusGroup.statuses[0] && viewStatus(statusGroup.statuses[0].id)}
                >
                  <div className="avatar status-avatar">
                    {statusGroup.user.avatar ? (
                      <img src={statusGroup.user.avatar} alt="" />
                    ) : (
                      statusGroup.user.username[0].toUpperCase()
                    )}
                    <div className="status-ring"></div>
                  </div>
                  <div className="item-info">
                    <h4>{statusGroup.user.username}</h4>
                    <p>{formatTime(statusGroup.statuses[0]?.created_at)}</p>
                  </div>
                </div>
              ))}
            </>
          )}

          {activeTab === 'contacts' && (
            <>
              {filteredContacts.map((contact, idx) => (
                <div key={idx} className="list-item" onClick={() => startNewChat(contact)}>
                  <div className="avatar">
                    {contact.avatar ? (
                      <img src={contact.avatar} alt="" />
                    ) : (
                      contact.username[0].toUpperCase()
                    )}
                    {contact.is_online && <span className="online-dot"></span>}
                  </div>
                  <div className="item-info">
                    <h4>{contact.nickname || contact.username}</h4>
                    <p className={contact.is_online ? 'online-status' : 'offline-status'}>
                      {contact.is_online ? 'Online' : contact.last_seen ? `Last seen ${formatTime(contact.last_seen)}` : 'Offline'}
                    </p>
                  </div>
                  {contact.is_favorite && <span className="favorite-icon">⭐</span>}
                </div>
              ))}
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
              <div className="chat-user-info" onClick={() => setShowProfileModal(true)}>
                <div className="avatar">
                  {selectedChat.avatar ? (
                    <img src={selectedChat.avatar} alt="" />
                  ) : (
                    selectedChat.full_name?.[0]?.toUpperCase() || '?'
                  )}
                  {!selectedChat.isGroup && selectedChat.is_online && <span className="online-dot"></span>}
                </div>
                <div>
                  <h3>{selectedChat.full_name}</h3>
                  <p className={selectedChat.is_online ? 'online' : 'offline'}>
                    {selectedChat.isGroup 
                      ? `${selectedChat.member_count} members` 
                      : selectedChat.is_online 
                        ? (otherUserTyping ? 'typing...' : 'Online')
                        : selectedChat.last_seen 
                          ? `Last seen ${formatTime(selectedChat.last_seen)}`
                          : 'Offline'}
                  </p>
                </div>
              </div>
              <div className="chat-actions">
                <button onClick={() => initiateCall('audio')} title="Voice Call">📞</button>
                <button onClick={() => initiateCall('video')} title="Video Call">📹</button>
                <button onClick={() => setSearchQuery('')} title="Search">🔍</button>
                <button title="More">⋮</button>
              </div>
            </div>

            {/* Messages */}
            <div className="messages-container">
              {loading && messages.length === 0 ? (
                <div className="loading">
                  <div className="spinner"></div>
                  <p>Loading messages...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="empty-messages">
                  <div className="empty-icon">💬</div>
                  <h3>No messages yet</h3>
                  <p>Start the conversation by sending a message!</p>
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div 
                    key={idx} 
                    className={`message ${msg.is_mine ? 'sent' : 'received'} ${msg.deleted ? 'deleted' : ''}`}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setShowMessageMenu(msg.id);
                    }}
                  >
                    {!msg.is_mine && selectedChat.isGroup && (
                      <div className="message-sender">{msg.sender?.username}</div>
                    )}
                    <div className="message-bubble">
                      {msg.reply_to && (
                        <div className="reply-preview">
                          <div className="reply-line"></div>
                          <div>
                            <strong>{msg.reply_to.sender?.username}</strong>
                            <p>{msg.reply_to.content}</p>
                          </div>
                        </div>
                      )}
                      
                      {msg.deleted ? (
                        <p className="deleted-text">
                          <em>🚫 This message was deleted</em>
                        </p>
                      ) : (
                        <>
                          {msg.media_url && (
                            <div className="message-media">
                              {msg.message_type === 'image' && (
                                <img src={msg.media_url} alt="" onClick={() => window.open(msg.media_url)} />
                              )}
                              {msg.message_type === 'video' && (
                                <video src={msg.media_url} controls />
                              )}
                              {msg.message_type === 'audio' && (
                                <audio src={msg.media_url} controls />
                              )}
                              {msg.message_type === 'document' && (
                                <a href={msg.media_url} target="_blank" rel="noopener noreferrer" className="document-link">
                                  📄 {msg.content || 'Document'}
                                </a>
                              )}
                            </div>
                          )}
                          
                          {msg.content && msg.message_type === 'text' && (
                            <p>{msg.content}</p>
                          )}
                        </>
                      )}
                      
                      <div className="message-meta">
                        <span className="time">{formatTime(msg.created_at)}</span>
                        {msg.is_mine && !msg.deleted && (
                          <span className={`read-status ${msg.is_read ? 'read' : ''}`}>
                            {msg.is_read ? '✓✓' : '✓'}
                          </span>
                        )}
                        {msg.edited_at && <span className="edited">edited</span>}
                      </div>
                      
                      {msg.reactions && msg.reactions.length > 0 && (
                        <div className="message-reactions">
                          {msg.reactions.map((reaction, ridx) => (
                            <span key={ridx} className="reaction" title={reaction.user}>
                              {getReactionEmoji(reaction.type)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {!msg.deleted && (
                      <div className="message-actions">
                        <button onClick={() => setReplyingTo(msg)} title="Reply">↩️</button>
                        <button onClick={() => reactToMessage(msg.id, 'like')} title="Like">👍</button>
                        <button onClick={() => reactToMessage(msg.id, 'love')} title="Love">❤️</button>
                        {msg.is_mine && (
                          <>
                            <button onClick={() => setEditingMessage(msg)} title="Edit">✏️</button>
                            <button onClick={() => deleteMessage(msg.id, false)} title="Delete for me">🗑️</button>
                            <button onClick={() => deleteMessage(msg.id, true)} title="Delete for everyone">❌</button>
                          </>
                        )}
                        <button onClick={() => setSelectedMessages([msg.id])} title="Forward">➡️</button>
                      </div>
                    )}
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Reply Preview */}
            {replyingTo && (
              <div className="reply-bar">
                <div className="reply-content">
                  <strong>Replying to {replyingTo.sender?.username}</strong>
                  <p>{replyingTo.content}</p>
                </div>
                <button onClick={() => setReplyingTo(null)}>✕</button>
              </div>
            )}

            {/* Edit Preview */}
            {editingMessage && (
              <div className="edit-bar">
                <div className="edit-content">
                  <strong>Edit message</strong>
                  <input 
                    type="text" 
                    defaultValue={editingMessage.content}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        editMessage(editingMessage.id, e.target.value);
                      }
                    }}
                    autoFocus
                  />
                </div>
                <button onClick={() => setEditingMessage(null)}>✕</button>
              </div>
            )}

            {/* Message Input */}
            <form className="message-input-form" onSubmit={sendMessage}>
              <button 
                type="button" 
                className="attach-btn" 
                onClick={() => setShowMediaModal(true)}
                title="Attach"
              >
                📎
              </button>
              <input 
                type="text" 
                placeholder="Type a message..." 
                value={messageInput}
                onChange={(e) => {
                  setMessageInput(e.target.value);
                  handleTyping();
                }}
                disabled={loading}
              />
              <button type="submit" className="send-btn" disabled={loading || !messageInput.trim()}>
                {loading ? '⏳' : '📤'}
              </button>
            </form>
          </>
        ) : (
          <div className="no-chat-selected">
            <div className="welcome-icon">💬</div>
            <h2>White Beat</h2>
            <p>Select a chat to start messaging</p>
            <div className="features-list">
              <div className="feature">💬 Send messages</div>
              <div className="feature">👥 Create groups</div>
              <div className="feature">📞 Make calls</div>
              <div className="feature">📸 Share status</div>
            </div>
          </div>
        )}
      </div>

      {/* User List Modal */}
      {showUserList && (
        <div className="modal-overlay" onClick={() => setShowUserList(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Start New Chat</h2>
            <div className="user-list">
              {allUsers.map((u) => (
                <div key={u.id} className="user-item" onClick={() => startNewChat(u)}>
                  <div className="avatar">
                    {u.avatar ? <img src={u.avatar} alt="" /> : u.username[0].toUpperCase()}
                    {u.is_online && <span className="online-dot"></span>}
                  </div>
                  <div>
                    <h4>{u.full_name || u.username}</h4>
                    <p className={u.is_online ? 'online' : 'offline'}>
                      {u.is_online ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setShowUserList(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Group Modal */}
      {showGroupModal && (
        <div className="modal-overlay" onClick={() => setShowGroupModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Group</h2>
            <form onSubmit={createGroup}>
              <div className="form-group">
                <label>Group Name *</label>
                <input type="text" name="name" required placeholder="Enter group name" />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea name="description" placeholder="Enter group description" rows="3"></textarea>
              </div>
              <div className="modal-actions">
                <button type="submit" className="primary-btn">Create Group</button>
                <button type="button" onClick={() => setShowGroupModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Status Modal */}
      {showStatusModal && (
        <div className="modal-overlay" onClick={() => setShowStatusModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Add Status</h2>
            <form onSubmit={createStatus}>
              <div className="form-group">
                <label>Type</label>
                <select name="status_type">
                  <option value="text">Text</option>
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
              </div>
              <div className="form-group">
                <label>Content *</label>
                <textarea name="content" required placeholder="What's on your mind?" rows="3"></textarea>
              </div>
              <div className="form-group">
                <label>Privacy</label>
                <select name="privacy">
                  <option value="everyone">Everyone</option>
                  <option value="contacts">My Contacts</option>
                  <option value="selected">Selected Contacts</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="submit" className="primary-btn">Post Status</button>
                <button type="button" onClick={() => setShowStatusModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Media Upload Modal */}
      {showMediaModal && (
        <div className="modal-overlay" onClick={() => setShowMediaModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Send Media</h2>
            <div className="media-options">
              <button className="media-option" onClick={() => fileInputRef.current?.click()}>
                <span className="media-icon">🖼️</span>
                <span>Photo</span>
              </button>
              <button className="media-option" onClick={() => fileInputRef.current?.click()}>
                <span className="media-icon">📹</span>
                <span>Video</span>
              </button>
              <button className="media-option" onClick={() => fileInputRef.current?.click()}>
                <span className="media-icon">🎵</span>
                <span>Audio</span>
              </button>
              <button className="media-option" onClick={() => fileInputRef.current?.click()}>
                <span className="media-icon">📄</span>
                <span>Document</span>
              </button>
            </div>
            <input 
              ref={fileInputRef}
              type="file" 
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const type = file.type.startsWith('image/') ? 'image' 
                    : file.type.startsWith('video/') ? 'video'
                    : file.type.startsWith('audio/') ? 'audio'
                    : 'document';
                  handleMediaUpload(file, type);
                }
              }}
            />
            <button onClick={() => setShowMediaModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatDashboard;
