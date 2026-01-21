import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './ChatDashboard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const ChatDashboard = ({ user }) => {
  // State management
  const [activeTab, setActiveTab] = useState('chats'); // chats, groups, calls, status, contacts
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
  const messagesEndRef = useRef(null);

  // Fetch data on mount
  useEffect(() => {
    fetchConversations();
    fetchGroups();
    fetchContacts();
    fetchStatuses();
    fetchCallHistory();
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
  const fetchMessages = async (otherUsername, isGroup = false) => {
    try {
      setLoading(true);
      const endpoint = isGroup ? '/group-messages/' : '/messages/';
      const params = isGroup 
        ? { group_id: otherUsername }
        : { username: user.username, other_username: otherUsername };
      
      const response = await axios.get(`${API_URL}${endpoint}`, { params });
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
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

      if (selectedChat.isGroup) {
        payload.group_id = selectedChat.id;
      } else {
        payload.receiver = selectedChat.username;
      }

      await axios.post(`${API_URL}/send-message/`, payload);
      setMessageInput('');
      fetchMessages(selectedChat.isGroup ? selectedChat.id : selectedChat.username, selectedChat.isGroup);
      fetchConversations();
    } catch (error) {
      console.error('Error sending message:', error);
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
      fetchMessages(selectedChat.isGroup ? selectedChat.id : selectedChat.username, selectedChat.isGroup);
    } catch (error) {
      console.error('Error reacting to message:', error);
    }
  };

  // Delete message
  const deleteMessage = async (messageId, deleteForEveryone = false) => {
    try {
      await axios.post(`${API_URL}/delete-message/`, {
        message_id: messageId,
        username: user.username,
        delete_for_everyone: deleteForEveryone
      });
      fetchMessages(selectedChat.isGroup ? selectedChat.id : selectedChat.username, selectedChat.isGroup);
    } catch (error) {
      console.error('Error deleting message:', error);
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
  const createGroup = async (groupData) => {
    try {
      await axios.post(`${API_URL}/create-group/`, {
        creator: user.username,
        ...groupData
      });
      fetchGroups();
      setShowGroupModal(false);
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  // Create status
  const createStatus = async (statusData) => {
    try {
      await axios.post(`${API_URL}/create-status/`, {
        username: user.username,
        ...statusData
      });
      fetchStatuses();
      setShowStatusModal(false);
    } catch (error) {
      console.error('Error creating status:', error);
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

      await axios.post(`${API_URL}/initiate-call/`, payload);
      alert(`${callType} call initiated!`);
    } catch (error) {
      console.error('Error initiating call:', error);
    }
  };

  // Format time
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / 3600000);
    
    if (hours < 24) {
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

  return (
    <div className="chat-dashboard">
      {/* Sidebar */}
      <div className="chat-sidebar">
        <div className="sidebar-header">
          <div className="user-profile" onClick={() => setShowProfileModal(true)}>
            <div className="avatar">{user.username[0].toUpperCase()}</div>
            <div className="user-info">
              <h3>{user.username}</h3>
              <span className="status-indicator online">Online</span>
            </div>
          </div>
          <button className="logout-btn" onClick={() => window.location.href = '/'}>
            🚪
          </button>
        </div>

        {/* Tabs */}
        <div className="sidebar-tabs">
          <button 
            className={activeTab === 'chats' ? 'active' : ''} 
            onClick={() => setActiveTab('chats')}
          >
            💬 Chats
          </button>
          <button 
            className={activeTab === 'groups' ? 'active' : ''} 
            onClick={() => setActiveTab('groups')}
          >
            👥 Groups
          </button>
          <button 
            className={activeTab === 'calls' ? 'active' : ''} 
            onClick={() => setActiveTab('calls')}
          >
            📞 Calls
          </button>
          <button 
            className={activeTab === 'status' ? 'active' : ''} 
            onClick={() => setActiveTab('status')}
          >
            📸 Status
          </button>
          <button 
            className={activeTab === 'contacts' ? 'active' : ''} 
            onClick={() => setActiveTab('contacts')}
          >
            📇 Contacts
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
              {conversations.map((conv) => (
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
                  </div>
                  <div className="item-info">
                    <h4>{conv.other_user?.full_name || conv.other_user?.username}</h4>
                    <p>{conv.last_message?.content || 'No messages yet'}</p>
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
              {groups.map((group) => (
                <div 
                  key={group.id} 
                  className={`list-item ${selectedChat?.id === group.id ? 'active' : ''}`}
                  onClick={() => selectChat(group)}
                >
                  <div className="avatar group-avatar">👥</div>
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
                  <div className="avatar">
                    {call.call_type === 'video' ? '📹' : '📞'}
                  </div>
                  <div className="item-info">
                    <h4>{call.is_incoming ? call.caller : call.receiver}</h4>
                    <p>
                      {call.is_incoming ? 'Incoming' : 'Outgoing'} • {call.status}
                      {call.duration && ` • ${Math.floor(call.duration / 60)}m ${call.duration % 60}s`}
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
                ➕ Add Status
              </button>
              {statuses.map((statusGroup, idx) => (
                <div key={idx} className="list-item">
                  <div className="avatar status-avatar">
                    {statusGroup.user.avatar ? (
                      <img src={statusGroup.user.avatar} alt="" />
                    ) : (
                      statusGroup.user.username[0].toUpperCase()
                    )}
                  </div>
                  <div className="item-info">
                    <h4>{statusGroup.user.username}</h4>
                    <p>{statusGroup.statuses.length} status updates</p>
                  </div>
                </div>
              ))}
            </>
          )}

          {activeTab === 'contacts' && (
            <>
              {contacts.map((contact, idx) => (
                <div key={idx} className="list-item" onClick={() => startNewChat(contact)}>
                  <div className="avatar">
                    {contact.avatar ? (
                      <img src={contact.avatar} alt="" />
                    ) : (
                      contact.username[0].toUpperCase()
                    )}
                  </div>
                  <div className="item-info">
                    <h4>{contact.nickname || contact.username}</h4>
                    <p className={contact.is_online ? 'online-status' : 'offline-status'}>
                      {contact.is_online ? 'Online' : 'Offline'}
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
              <div className="chat-user-info">
                <div className="avatar">
                  {selectedChat.avatar ? (
                    <img src={selectedChat.avatar} alt="" />
                  ) : (
                    selectedChat.full_name?.[0]?.toUpperCase() || '?'
                  )}
                </div>
                <div>
                  <h3>{selectedChat.full_name}</h3>
                  <p className={selectedChat.is_online ? 'online' : 'offline'}>
                    {selectedChat.isGroup 
                      ? `${selectedChat.member_count} members` 
                      : selectedChat.is_online ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
              <div className="chat-actions">
                <button onClick={() => initiateCall('audio')} title="Voice Call">📞</button>
                <button onClick={() => initiateCall('video')} title="Video Call">📹</button>
                <button title="More">⋮</button>
              </div>
            </div>

            {/* Messages */}
            <div className="messages-container">
              {loading ? (
                <div className="loading">Loading messages...</div>
              ) : messages.length === 0 ? (
                <div className="empty-messages">
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div 
                    key={idx} 
                    className={`message ${msg.is_mine ? 'sent' : 'received'}`}
                  >
                    {!msg.is_mine && selectedChat.isGroup && (
                      <div className="message-sender">{msg.sender?.username}</div>
                    )}
                    <div className="message-bubble">
                      {msg.reply_to && (
                        <div className="reply-preview">
                          Replying to: {msg.reply_to.content}
                        </div>
                      )}
                      <p>{msg.content}</p>
                      {msg.media_url && (
                        <div className="message-media">
                          {msg.message_type === 'image' && <img src={msg.media_url} alt="" />}
                          {msg.message_type === 'video' && <video src={msg.media_url} controls />}
                        </div>
                      )}
                      <div className="message-meta">
                        <span className="time">{formatTime(msg.created_at)}</span>
                        {msg.is_mine && (
                          <span className="read-status">{msg.is_read ? '✓✓' : '✓'}</span>
                        )}
                        {msg.edited_at && <span className="edited">edited</span>}
                      </div>
                      {msg.reactions && msg.reactions.length > 0 && (
                        <div className="message-reactions">
                          {msg.reactions.map((reaction, ridx) => (
                            <span key={ridx} className="reaction">
                              {getReactionEmoji(reaction.type)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="message-actions">
                      <button onClick={() => reactToMessage(msg.id, 'like')}>👍</button>
                      <button onClick={() => reactToMessage(msg.id, 'love')}>❤️</button>
                      {msg.is_mine && (
                        <button onClick={() => deleteMessage(msg.id, false)}>🗑️</button>
                      )}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form className="message-input-form" onSubmit={sendMessage}>
              <button type="button" className="attach-btn">📎</button>
              <input 
                type="text" 
                placeholder="Type a message..." 
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
              />
              <button type="submit" className="send-btn">📤</button>
            </form>
          </>
        ) : (
          <div className="no-chat-selected">
            <h2>💬 White Beat</h2>
            <p>Select a chat to start messaging</p>
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
                  <div className="avatar">{u.username[0].toUpperCase()}</div>
                  <div>
                    <h4>{u.full_name || u.username}</h4>
                    <p>{u.status || 'Available'}</p>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setShowUserList(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatDashboard;
