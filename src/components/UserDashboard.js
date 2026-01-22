import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UserDashboard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

function UserDashboard() {
  const navigate = useNavigate();
  
  // Get user from localStorage
  const username = localStorage.getItem('username');
  const isAdminUser = localStorage.getItem('isAdmin') === 'true';
  
  // Redirect to login if not logged in
  useEffect(() => {
    if (!username) {
      navigate('/');
    }
  }, [username, navigate]);

  const [activeSection, setActiveSection] = useState('overview');
  const [profile, setProfile] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [callHistory, setCallHistory] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [messageReactions, setMessageReactions] = useState([]);
  const [statusViews, setStatusViews] = useState([]);
  const [apiLogs, setApiLogs] = useState([]);
  const [systemStats, setSystemStats] = useState([]);
  const [isAdmin, setIsAdmin] = useState(isAdminUser);
  const [loading, setLoading] = useState(false);
  
  // Modal states
  const [showAddContact, setShowAddContact] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showMakeCall, setShowMakeCall] = useState(false);
  const [showAddStatus, setShowAddStatus] = useState(false);
  const [editMode, setEditMode] = useState(false);
  
  // Form states
  const [searchQuery, setSearchQuery] = useState('');
  const [availableUsers, setAvailableUsers] = useState([]);
  const [groupForm, setGroupForm] = useState({ name: '', description: '' });
  const [callForm, setCallForm] = useState({ contact: '', type: 'audio' });
  const [statusForm, setStatusForm] = useState({ type: 'text', content: '', privacy: 'everyone' });
  const [profileForm, setProfileForm] = useState({
    full_name: '',
    bio: '',
    status: '',
    avatar: '',
    phone_number: ''
  });

  // Statistics
  const [stats, setStats] = useState({
    totalContacts: 0,
    totalGroups: 0,
    totalCalls: 0,
    totalStatuses: 0,
    totalConversations: 0,
    totalMessages: 0,
    totalReactions: 0,
    totalApiCalls: 0
  });

  useEffect(() => {
    if (username) {
      loadAllData();
    }
  }, [username]);

  useEffect(() => {
    // Calculate stats whenever data changes
    setStats({
      totalContacts: contacts.length,
      totalGroups: groups.length,
      totalCalls: callHistory.length,
      totalStatuses: statuses.length,
      totalConversations: conversations.length,
      totalMessages: profile?.total_messages || 0,
      totalReactions: messageReactions.length,
      totalApiCalls: apiLogs.length
    });
  }, [contacts, groups, callHistory, statuses, conversations, profile, messageReactions, apiLogs]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadProfile(),
        loadContacts(),
        loadGroups(),
        loadCallHistory(),
        loadStatuses(),
        loadConversations(),
        checkAdminStatus()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProfile = async () => {
    try {
      const response = await axios.get(`${API_URL}/user-profile/`, {
        params: { username: username }
      });
      setProfile(response.data);
      setProfileForm({
        full_name: response.data.full_name || '',
        bio: response.data.bio || '',
        status: response.data.status || '',
        avatar: response.data.avatar || '',
        phone_number: response.data.phone_number || ''
      });
    } catch (error) {
      console.error('Error loading profile:', error);
      // Set default profile if API fails
      setProfile({
        username: username,
        full_name: username,
        bio: 'Welcome to White Beat!',
        status: 'online',
        avatar: '👤',
        role: isAdminUser ? 'admin' : 'user'
      });
    }
  };

  const loadContacts = async () => {
    try {
      const response = await axios.get(`${API_URL}/contacts/`, {
        params: { username: username }
      });
      setContacts(response.data.contacts || []);
    } catch (error) {
      console.error('Error loading contacts:', error);
      setContacts([]);
    }
  };

  const loadGroups = async () => {
    try {
      const response = await axios.get(`${API_URL}/groups/`, {
        params: { username: username }
      });
      setGroups(response.data.groups || []);
    } catch (error) {
      console.error('Error loading groups:', error);
      setGroups([]);
    }
  };

  const loadCallHistory = async () => {
    try {
      const response = await axios.get(`${API_URL}/call-history/`, {
        params: { username: username }
      });
      setCallHistory(response.data.calls || []);
    } catch (error) {
      console.error('Error loading call history:', error);
      setCallHistory([]);
    }
  };

  const loadStatuses = async () => {
    try {
      const response = await axios.get(`${API_URL}/statuses/`, {
        params: { username: username }
      });
      setStatuses(response.data.statuses || []);
    } catch (error) {
      console.error('Error loading statuses:', error);
      setStatuses([]);
    }
  };

  const loadConversations = async () => {
    try {
      const response = await axios.get(`${API_URL}/conversations/`, {
        params: { username: username }
      });
      setConversations(response.data.conversations || []);
    } catch (error) {
      console.error('Error loading conversations:', error);
      setConversations([]);
    }
  };

  const checkAdminStatus = async () => {
    try {
      const response = await axios.get(`${API_URL}/check-admin/`, {
        params: { username: username }
      });
      setIsAdmin(response.data.is_admin);
      if (response.data.is_admin) {
        loadAdminData();
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(isAdminUser);
    }
  };

  const loadAdminData = async () => {
    try {
      const [logsResponse, statsResponse, reactionsResponse, viewsResponse] = await Promise.all([
        axios.get(`${API_URL}/admin/api-logs/`),
        axios.get(`${API_URL}/admin/system-stats/`),
        axios.get(`${API_URL}/admin/message-reactions/`),
        axios.get(`${API_URL}/admin/status-views/`)
      ]);
      
      setApiLogs(logsResponse.data.logs || []);
      setSystemStats(statsResponse.data.stats || []);
      setMessageReactions(reactionsResponse.data.reactions || []);
      setStatusViews(viewsResponse.data.views || []);
    } catch (error) {
      console.error('Error loading admin data:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('isAdmin');
    navigate('/');
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/update-profile/`, {
        username: username,
        ...profileForm
      });
      alert('Profile updated successfully!');
      setEditMode(false);
      loadProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const handleAddContact = async (contactUsername) => {
    try {
      await axios.post(`${API_URL}/add-contact/`, {
        username: username,
        contact_username: contactUsername
      });
      alert('Contact added successfully!');
      setShowAddContact(false);
      loadContacts();
    } catch (error) {
      console.error('Error adding contact:', error);
      alert('Failed to add contact');
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/create-group/`, {
        username: username,
        ...groupForm
      });
      alert('Group created successfully!');
      setShowCreateGroup(false);
      setGroupForm({ name: '', description: '' });
      loadGroups();
    } catch (error) {
      console.error('Error creating group:', error);
      alert('Failed to create group');
    }
  };

  const handleMakeCall = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/make-call/`, {
        username: username,
        ...callForm
      });
      alert('Call initiated!');
      setShowMakeCall(false);
      setCallForm({ contact: '', type: 'audio' });
      loadCallHistory();
    } catch (error) {
      console.error('Error making call:', error);
      alert('Failed to make call');
    }
  };

  const handleAddStatus = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/add-status/`, {
        username: username,
        ...statusForm
      });
      alert('Status added successfully!');
      setShowAddStatus(false);
      setStatusForm({ type: 'text', content: '', privacy: 'everyone' });
      loadStatuses();
    } catch (error) {
      console.error('Error adding status:', error);
      alert('Failed to add status');
    }
  };

  const searchUsers = async (query) => {
    if (!query) {
      setAvailableUsers([]);
      return;
    }
    try {
      const response = await axios.get(`${API_URL}/search-users/`, {
        params: { query, username: username }
      });
      setAvailableUsers(response.data.users || []);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  // Show loading if no username
  if (!username) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="user-dashboard">
      {/* Sidebar */}
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">🤖</span>
            <h2>White Beat</h2>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeSection === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveSection('overview')}
          >
            <span className="nav-icon">📊</span>
            <span>Overview</span>
          </button>

          <button
            className={`nav-item ${activeSection === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveSection('profile')}
          >
            <span className="nav-icon">👤</span>
            <span>Profile</span>
          </button>

          <button
            className={`nav-item ${activeSection === 'contacts' ? 'active' : ''}`}
            onClick={() => setActiveSection('contacts')}
          >
            <span className="nav-icon">👥</span>
            <span>Contacts</span>
            {contacts.length > 0 && <span className="badge">{contacts.length}</span>}
          </button>

          <button
            className={`nav-item ${activeSection === 'groups' ? 'active' : ''}`}
            onClick={() => setActiveSection('groups')}
          >
            <span className="nav-icon">👨‍👩‍👧‍👦</span>
            <span>Groups</span>
            {groups.length > 0 && <span className="badge">{groups.length}</span>}
          </button>

          <button
            className={`nav-item ${activeSection === 'conversations' ? 'active' : ''}`}
            onClick={() => setActiveSection('conversations')}
          >
            <span className="nav-icon">💬</span>
            <span>Conversations</span>
            {conversations.length > 0 && <span className="badge">{conversations.length}</span>}
          </button>

          <button
            className={`nav-item ${activeSection === 'calls' ? 'active' : ''}`}
            onClick={() => setActiveSection('calls')}
          >
            <span className="nav-icon">📞</span>
            <span>Calls</span>
          </button>

          <button
            className={`nav-item ${activeSection === 'status' ? 'active' : ''}`}
            onClick={() => setActiveSection('status')}
          >
            <span className="nav-icon">📸</span>
            <span>Status</span>
          </button>

          {isAdmin && (
            <button
              className={`nav-item ${activeSection === 'admin' ? 'active' : ''}`}
              onClick={() => setActiveSection('admin')}
            >
              <span className="nav-icon">⚙️</span>
              <span>Admin Panel</span>
            </button>
          )}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {loading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
            <p>Loading...</p>
          </div>
        )}

        {/* Overview Section */}
        {activeSection === 'overview' && (
          <div className="section overview-section">
            <div className="section-header">
              <h2>📊 Dashboard Overview</h2>
              <p>Welcome back, {profile?.full_name || username}!</p>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <h3>{stats.totalContacts}</h3>
                  <p>Contacts</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">👨‍👩‍👧‍👦</div>
                <div className="stat-info">
                  <h3>{stats.totalGroups}</h3>
                  <p>Groups</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">💬</div>
                <div className="stat-info">
                  <h3>{stats.totalConversations}</h3>
                  <p>Conversations</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">📞</div>
                <div className="stat-info">
                  <h3>{stats.totalCalls}</h3>
                  <p>Calls</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">📸</div>
                <div className="stat-info">
                  <h3>{stats.totalStatuses}</h3>
                  <p>Status Updates</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">✉️</div>
                <div className="stat-info">
                  <h3>{stats.totalMessages}</h3>
                  <p>Messages</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">❤️</div>
                <div className="stat-info">
                  <h3>{stats.totalReactions}</h3>
                  <p>Reactions</p>
                </div>
              </div>

              {isAdmin && (
                <div className="stat-card">
                  <div className="stat-icon">📡</div>
                  <div className="stat-info">
                    <h3>{stats.totalApiCalls}</h3>
                    <p>API Calls</p>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Summary */}
            <div className="profile-summary">
              <div className="profile-avatar">
                {profile?.avatar || '👤'}
              </div>
              <div className="profile-details">
                <h3>{profile?.full_name || username}</h3>
                <p className="profile-bio">{profile?.bio || 'No bio yet'}</p>
                <div className="profile-meta">
                  <span className="status-indicator online"></span>
                  <span>{profile?.status || 'online'}</span>
                  {isAdmin && <span className="admin-badge">Admin</span>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Section */}
        {activeSection === 'profile' && (
          <div className="section profile-section">
            <div className="section-header">
              <h2>👤 My Profile</h2>
              <button className="btn-primary" onClick={() => setEditMode(!editMode)}>
                {editMode ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            {editMode ? (
              <form className="profile-form" onSubmit={handleUpdateProfile}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={profileForm.full_name}
                    onChange={(e) => setProfileForm({...profileForm, full_name: e.target.value})}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="form-group">
                  <label>Bio</label>
                  <textarea
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                    placeholder="Tell us about yourself"
                    rows="4"
                  />
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <input
                    type="text"
                    value={profileForm.status}
                    onChange={(e) => setProfileForm({...profileForm, status: e.target.value})}
                    placeholder="Your current status"
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={profileForm.phone_number}
                    onChange={(e) => setProfileForm({...profileForm, phone_number: e.target.value})}
                    placeholder="+1234567890"
                  />
                </div>

                <div className="form-group">
                  <label>Avatar (Emoji)</label>
                  <input
                    type="text"
                    value={profileForm.avatar}
                    onChange={(e) => setProfileForm({...profileForm, avatar: e.target.value})}
                    placeholder="👤"
                    maxLength="2"
                  />
                </div>

                <button type="submit" className="btn-primary">Save Changes</button>
              </form>
            ) : (
              <div className="profile-display">
                <div className="profile-avatar-large">
                  {profile?.avatar || '👤'}
                </div>
                <div className="profile-info">
                  <h3>{profile?.full_name || username}</h3>
                  <p className="username">@{username}</p>
                  <p className="bio">{profile?.bio || 'No bio yet'}</p>
                  <div className="profile-details-grid">
                    <div className="detail-item">
                      <span className="detail-label">Status:</span>
                      <span className="detail-value">{profile?.status || 'online'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Phone:</span>
                      <span className="detail-value">{profile?.phone_number || 'Not set'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Role:</span>
                      <span className="detail-value">{profile?.role || 'user'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Joined:</span>
                      <span className="detail-value">{profile?.created_at || 'Recently'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Contacts Section */}
        {activeSection === 'contacts' && (
          <div className="section contacts-section">
            <div className="section-header">
              <h2>👥 My Contacts</h2>
              <button className="btn-primary" onClick={() => setShowAddContact(true)}>
                + Add Contact
              </button>
            </div>

            {showAddContact && (
              <div className="modal-overlay" onClick={() => setShowAddContact(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <h3>Add New Contact</h3>
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      searchUsers(e.target.value);
                    }}
                    className="search-input"
                  />
                  <div className="user-list">
                    {availableUsers.map(user => (
                      <div key={user.username} className="user-item">
                        <span>{user.avatar || '👤'} {user.full_name || user.username}</span>
                        <button onClick={() => handleAddContact(user.username)}>Add</button>
                      </div>
                    ))}
                  </div>
                  <button className="btn-secondary" onClick={() => setShowAddContact(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="contacts-grid">
              {contacts.length === 0 ? (
                <div className="empty-state">
                  <p>No contacts yet. Add some friends!</p>
                </div>
              ) : (
                contacts.map(contact => (
                  <div key={contact.id} className="contact-card">
                    <div className="contact-avatar">
                      {contact.avatar || '👤'}
                      <span className={`status-dot ${contact.is_online ? 'online' : 'offline'}`}></span>
                    </div>
                    <div className="contact-info">
                      <h4>{contact.nickname || contact.full_name}</h4>
                      <p>@{contact.username}</p>
                      {contact.is_favorite && <span className="favorite-star">⭐</span>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Groups Section */}
        {activeSection === 'groups' && (
          <div className="section groups-section">
            <div className="section-header">
              <h2>👨‍👩‍👧‍👦 My Groups</h2>
              <button className="btn-primary" onClick={() => setShowCreateGroup(true)}>
                + Create Group
              </button>
            </div>

            {showCreateGroup && (
              <div className="modal-overlay" onClick={() => setShowCreateGroup(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <h3>Create New Group</h3>
                  <form onSubmit={handleCreateGroup}>
                    <div className="form-group">
                      <label>Group Name</label>
                      <input
                        type="text"
                        value={groupForm.name}
                        onChange={(e) => setGroupForm({...groupForm, name: e.target.value})}
                        placeholder="Enter group name"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        value={groupForm.description}
                        onChange={(e) => setGroupForm({...groupForm, description: e.target.value})}
                        placeholder="Group description"
                        rows="3"
                      />
                    </div>
                    <div className="modal-actions">
                      <button type="submit" className="btn-primary">Create</button>
                      <button type="button" className="btn-secondary" onClick={() => setShowCreateGroup(false)}>
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="groups-grid">
              {groups.length === 0 ? (
                <div className="empty-state">
                  <p>No groups yet. Create one to get started!</p>
                </div>
              ) : (
                groups.map(group => (
                  <div key={group.id} className="group-card">
                    <div className="group-icon">👨‍👩‍👧‍👦</div>
                    <div className="group-info">
                      <h4>{group.name}</h4>
                      <p>{group.description}</p>
                      <div className="group-meta">
                        <span>{group.member_count || 0} members</span>
                        {group.unread_count > 0 && (
                          <span className="unread-badge">{group.unread_count}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Conversations Section */}
        {activeSection === 'conversations' && (
          <div className="section conversations-section">
            <div className="section-header">
              <h2>💬 Conversations</h2>
            </div>

            <div className="conversations-list">
              {conversations.length === 0 ? (
                <div className="empty-state">
                  <p>No conversations yet. Start chatting with your contacts!</p>
                </div>
              ) : (
                conversations.map(conv => (
                  <div key={conv.id} className="conversation-item">
                    <div className="conv-avatar">
                      {conv.avatar || '👤'}
                      {conv.is_online && <span className="status-dot online"></span>}
                    </div>
                    <div className="conv-info">
                      <h4>{conv.name}</h4>
                      <p className="last-message">{conv.last_message}</p>
                    </div>
                    <div className="conv-meta">
                      <span className="time">{conv.timestamp}</span>
                      {conv.unread_count > 0 && (
                        <span className="unread-badge">{conv.unread_count}</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Calls Section */}
        {activeSection === 'calls' && (
          <div className="section calls-section">
            <div className="section-header">
              <h2>📞 Call History</h2>
              <button className="btn-primary" onClick={() => setShowMakeCall(true)}>
                + Make Call
              </button>
            </div>

            {showMakeCall && (
              <div className="modal-overlay" onClick={() => setShowMakeCall(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <h3>Make a Call</h3>
                  <form onSubmit={handleMakeCall}>
                    <div className="form-group">
                      <label>Contact</label>
                      <select
                        value={callForm.contact}
                        onChange={(e) => setCallForm({...callForm, contact: e.target.value})}
                        required
                      >
                        <option value="">Select contact</option>
                        {contacts.map(contact => (
                          <option key={contact.id} value={contact.username}>
                            {contact.nickname || contact.full_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Call Type</label>
                      <select
                        value={callForm.type}
                        onChange={(e) => setCallForm({...callForm, type: e.target.value})}
                      >
                        <option value="audio">Audio Call</option>
                        <option value="video">Video Call</option>
                      </select>
                    </div>
                    <div className="modal-actions">
                      <button type="submit" className="btn-primary">Call</button>
                      <button type="button" className="btn-secondary" onClick={() => setShowMakeCall(false)}>
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="calls-list">
              {callHistory.length === 0 ? (
                <div className="empty-state">
                  <p>No call history yet.</p>
                </div>
              ) : (
                callHistory.map(call => (
                  <div key={call.id} className="call-item">
                    <div className="call-icon">
                      {call.type === 'video' ? '📹' : '📞'}
                    </div>
                    <div className="call-info">
                      <h4>{call.contact_name}</h4>
                      <p>{call.type} call • {call.duration}</p>
                    </div>
                    <div className="call-meta">
                      <span className="time">{call.timestamp}</span>
                      <span className={`call-status ${call.status}`}>
                        {call.status === 'completed' ? '✓' : '✗'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Status Section */}
        {activeSection === 'status' && (
          <div className="section status-section">
            <div className="section-header">
              <h2>📸 Status Updates</h2>
              <button className="btn-primary" onClick={() => setShowAddStatus(true)}>
                + Add Status
              </button>
            </div>

            {showAddStatus && (
              <div className="modal-overlay" onClick={() => setShowAddStatus(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <h3>Add Status</h3>
                  <form onSubmit={handleAddStatus}>
                    <div className="form-group">
                      <label>Type</label>
                      <select
                        value={statusForm.type}
                        onChange={(e) => setStatusForm({...statusForm, type: e.target.value})}
                      >
                        <option value="text">Text</option>
                        <option value="image">Image</option>
                        <option value="video">Video</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Content</label>
                      <textarea
                        value={statusForm.content}
                        onChange={(e) => setStatusForm({...statusForm, content: e.target.value})}
                        placeholder="What's on your mind?"
                        rows="4"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Privacy</label>
                      <select
                        value={statusForm.privacy}
                        onChange={(e) => setStatusForm({...statusForm, privacy: e.target.value})}
                      >
                        <option value="everyone">Everyone</option>
                        <option value="contacts">Contacts Only</option>
                        <option value="selected">Selected Contacts</option>
                      </select>
                    </div>
                    <div className="modal-actions">
                      <button type="submit" className="btn-primary">Post</button>
                      <button type="button" className="btn-secondary" onClick={() => setShowAddStatus(false)}>
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="status-grid">
              {statuses.length === 0 ? (
                <div className="empty-state">
                  <p>No status updates yet. Share your first status!</p>
                </div>
              ) : (
                statuses.map(status => (
                  <div key={status.id} className="status-card">
                    <div className="status-header">
                      <div className="status-avatar">{status.avatar || '👤'}</div>
                      <div className="status-user">
                        <h4>{status.username}</h4>
                        <p>{status.timestamp}</p>
                      </div>
                    </div>
                    <div className="status-content">
                      {status.type === 'text' && <p>{status.content}</p>}
                      {status.type === 'image' && <img src={status.content} alt="Status" />}
                      {status.type === 'video' && <video src={status.content} controls />}
                    </div>
                    <div className="status-footer">
                      <span>👁️ {status.view_count || 0} views</span>
                      <span>⏰ Expires in {status.expires_in}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Admin Panel */}
        {activeSection === 'admin' && isAdmin && (
          <div className="section admin-section">
            <div className="section-header">
              <h2>⚙️ Admin Panel</h2>
              <button className="btn-primary" onClick={loadAdminData}>
                🔄 Refresh
              </button>
            </div>

            <div className="admin-stats">
              <div className="stat-card">
                <h3>📡 API Logs</h3>
                <p>{apiLogs.length} total calls</p>
              </div>
              <div className="stat-card">
                <h3>📊 System Stats</h3>
                <p>{systemStats.length} metrics</p>
              </div>
              <div className="stat-card">
                <h3>❤️ Reactions</h3>
                <p>{messageReactions.length} total</p>
              </div>
              <div className="stat-card">
                <h3>👁️ Status Views</h3>
                <p>{statusViews.length} total</p>
              </div>
            </div>

            <div className="admin-tables">
              <div className="table-container">
                <h3>📡 Recent API Logs</h3>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Endpoint</th>
                      <th>Method</th>
                      <th>Status</th>
                      <th>User</th>
                      <th>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {apiLogs.slice(0, 10).map(log => (
                      <tr key={log.id}>
                        <td>{log.endpoint}</td>
                        <td>{log.method}</td>
                        <td><span className={`status-badge ${log.status_code < 400 ? 'success' : 'error'}`}>
                          {log.status_code}
                        </span></td>
                        <td>{log.user}</td>
                        <td>{log.timestamp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="table-container">
                <h3>📊 System Statistics</h3>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Metric</th>
                      <th>Value</th>
                      <th>Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {systemStats.slice(0, 10).map(stat => (
                      <tr key={stat.id}>
                        <td>{stat.metric_name}</td>
                        <td><strong>{stat.metric_value}</strong></td>
                        <td>{stat.timestamp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;
