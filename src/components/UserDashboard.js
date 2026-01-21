import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserDashboard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

function UserDashboard({ user, onLogout }) {
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
  const [isAdmin, setIsAdmin] = useState(false);
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
    if (user) {
      loadAllData();
    }
  }, [user]);

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
        params: { username: user.username }
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
    }
  };

  const loadContacts = async () => {
    try {
      const response = await axios.get(`${API_URL}/contacts/`, {
        params: { username: user.username }
      });
      setContacts(response.data.contacts || []);
    } catch (error) {
      console.error('Error loading contacts:', error);
    }
  };

  const loadGroups = async () => {
    try {
      const response = await axios.get(`${API_URL}/groups/`, {
        params: { username: user.username }
      });
      setGroups(response.data.groups || []);
    } catch (error) {
      console.error('Error loading groups:', error);
    }
  };

  const loadCallHistory = async () => {
    try {
      const response = await axios.get(`${API_URL}/call-history/`, {
        params: { username: user.username }
      });
      setCallHistory(response.data.calls || []);
    } catch (error) {
      console.error('Error loading call history:', error);
    }
  };

  const loadStatuses = async () => {
    try {
      const response = await axios.get(`${API_URL}/statuses/`, {
        params: { username: user.username }
      });
      setStatuses(response.data.statuses || []);
    } catch (error) {
      console.error('Error loading statuses:', error);
    }
  };

  const loadConversations = async () => {
    try {
      const response = await axios.get(`${API_URL}/conversations/`, {
        params: { username: user.username }
      });
      setConversations(response.data.conversations || []);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const loadApiLogs = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/api-logs/`, {
        params: { username: user.username }
      });
      setApiLogs(response.data.logs || []);
    } catch (error) {
      console.error('Error loading API logs:', error);
    }
  };

  const loadSystemStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/system-stats/`, {
        params: { username: user.username }
      });
      setSystemStats(response.data.stats || []);
    } catch (error) {
      console.error('Error loading system stats:', error);
    }
  };

  const checkAdminStatus = async () => {
    try {
      const response = await axios.post(`${API_URL}/verify-admin/`, {
        username: user.username
      });
      setIsAdmin(response.data.is_admin);
      if (response.data.is_admin) {
        loadApiLogs();
        loadSystemStats();
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/update-profile/`, {
        username: user.username,
        ...profileForm
      });
      alert('Profile updated successfully!');
      await loadProfile();
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async (query) => {
    if (!query) {
      setAvailableUsers([]);
      return;
    }
    try {
      const response = await axios.get(`${API_URL}/users/`, {
        params: { username: user.username, search: query }
      });
      setAvailableUsers(response.data.users || []);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const handleAddContact = async (contactUsername) => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/add-contact/`, {
        username: user.username,
        contact_username: contactUsername
      });
      alert('Contact added successfully!');
      await loadContacts();
      setShowAddContact(false);
      setSearchQuery('');
      setAvailableUsers([]);
    } catch (error) {
      console.error('Error adding contact:', error);
      alert(error.response?.data?.error || 'Failed to add contact');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!groupForm.name) {
      alert('Group name is required');
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_URL}/create-group/`, {
        username: user.username,
        name: groupForm.name,
        description: groupForm.description
      });
      alert('Group created successfully!');
      await loadGroups();
      setShowCreateGroup(false);
      setGroupForm({ name: '', description: '' });
    } catch (error) {
      console.error('Error creating group:', error);
      alert('Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  const handleMakeCall = async (e) => {
    e.preventDefault();
    if (!callForm.contact) {
      alert('Please select a contact');
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_URL}/initiate-call/`, {
        username: user.username,
        receiver_username: callForm.contact,
        call_type: callForm.type
      });
      alert('Call initiated!');
      await loadCallHistory();
      setShowMakeCall(false);
      setCallForm({ contact: '', type: 'audio' });
    } catch (error) {
      console.error('Error making call:', error);
      alert('Failed to initiate call');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStatus = async (e) => {
    e.preventDefault();
    if (!statusForm.content) {
      alert('Status content is required');
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_URL}/create-status/`, {
        username: user.username,
        status_type: statusForm.type,
        content: statusForm.content,
        privacy: statusForm.privacy
      });
      alert('Status posted successfully!');
      await loadStatuses();
      setShowAddStatus(false);
      setStatusForm({ type: 'text', content: '', privacy: 'everyone' });
    } catch (error) {
      console.error('Error creating status:', error);
      alert('Failed to post status');
    } finally {
      setLoading(false);
    }
  };

  const renderOverview = () => (
    <div className="overview-section">
      <div className="stats-grid">
        <div className="stat-card glass">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{stats.totalContacts}</h3>
            <p>Total Contacts</p>
          </div>
        </div>
        <div className="stat-card glass">
          <div className="stat-icon">👨‍👩‍👧‍👦</div>
          <div className="stat-info">
            <h3>{stats.totalGroups}</h3>
            <p>Total Groups</p>
          </div>
        </div>
        <div className="stat-card glass">
          <div className="stat-icon">📞</div>
          <div className="stat-info">
            <h3>{stats.totalCalls}</h3>
            <p>Total Calls</p>
          </div>
        </div>
        <div className="stat-card glass">
          <div className="stat-icon">📸</div>
          <div className="stat-info">
            <h3>{stats.totalStatuses}</h3>
            <p>Total Statuses</p>
          </div>
        </div>
        <div className="stat-card glass">
          <div className="stat-icon">💬</div>
          <div className="stat-info">
            <h3>{stats.totalConversations}</h3>
            <p>Conversations</p>
          </div>
        </div>
        <div className="stat-card glass">
          <div className="stat-icon">✉️</div>
          <div className="stat-info">
            <h3>{stats.totalMessages}</h3>
            <p>Messages Sent</p>
          </div>
        </div>
        <div className="stat-card glass">
          <div className="stat-icon">❤️</div>
          <div className="stat-info">
            <h3>{stats.totalReactions}</h3>
            <p>Reactions</p>
          </div>
        </div>
        {isAdmin && (
          <div className="stat-card glass">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <h3>{stats.totalApiCalls}</h3>
              <p>API Calls</p>
            </div>
          </div>
        )}
      </div>

      {profile && (
        <div className="profile-summary glass">
          <h3>Profile Summary</h3>
          <div className="profile-info">
            <div className="profile-avatar">
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.full_name} />
              ) : (
                <div className="avatar-placeholder">
                  {profile.full_name?.charAt(0) || user.username.charAt(0).toUpperCase()}
                </div>
              )}
              <div className={`status-dot ${profile.is_online ? 'online' : 'offline'}`}></div>
            </div>
            <div className="profile-details">
              <h4>{profile.full_name || user.username}</h4>
              <p className="username">@{user.username}</p>
              {profile.bio && <p className="bio">{profile.bio}</p>}
              {profile.status && <p className="status-msg">"{profile.status}"</p>}
            </div>
          </div>
        </div>
      )}

      {isAdmin && (
        <div className="admin-badge glass">
          <h3>🔐 Admin Access</h3>
          <p>You have administrative privileges</p>
          <button className="btn-primary" onClick={() => setActiveSection('admin')}>
            Open Admin Panel
          </button>
        </div>
      )}
    </div>
  );

  const renderProfile = () => (
    <div className="profile-section">
      <div className="section-header">
        <h2>My Profile</h2>
        {!editMode ? (
          <button className="btn-primary" onClick={() => setEditMode(true)}>
            ✏️ Edit Profile
          </button>
        ) : (
          <button className="btn-secondary" onClick={() => setEditMode(false)}>
            ❌ Cancel
          </button>
        )}
      </div>

      {profile && (
        <div className="profile-card glass">
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
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Status Message</label>
                <input
                  type="text"
                  value={profileForm.status}
                  onChange={(e) => setProfileForm({...profileForm, status: e.target.value})}
                  placeholder="Hey there! I am using White Beat"
                />
              </div>
              <div className="form-group">
                <label>Avatar URL</label>
                <input
                  type="url"
                  value={profileForm.avatar}
                  onChange={(e) => setProfileForm({...profileForm, avatar: e.target.value})}
                  placeholder="https://example.com/avatar.jpg"
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
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Saving...' : '💾 Save Changes'}
              </button>
            </form>
          ) : (
            <div className="profile-view">
              <div className="profile-header">
                <div className="profile-avatar-large">
                  {profile.avatar ? (
                    <img src={profile.avatar} alt={profile.full_name} />
                  ) : (
                    <div className="avatar-placeholder-large">
                      {profile.full_name?.charAt(0) || user.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="profile-info-main">
                  <h3>{profile.full_name || user.username}</h3>
                  <p className="username">@{user.username}</p>
                  <p className="email">📧 {user.email}</p>
                  {profile.phone_number && <p className="phone">📱 {profile.phone_number}</p>}
                </div>
              </div>
              
              {profile.bio && (
                <div className="profile-bio">
                  <h4>Bio</h4>
                  <p>{profile.bio}</p>
                </div>
              )}
              
              {profile.status && (
                <div className="profile-status">
                  <h4>Status</h4>
                  <p>"{profile.status}"</p>
                </div>
              )}

              <div className="profile-stats">
                <div className="stat">
                  <span className="stat-label">Status</span>
                  <span className={`stat-value ${profile.is_online ? 'online' : 'offline'}`}>
                    {profile.is_online ? '🟢 Online' : '⚫ Offline'}
                  </span>
                </div>
                <div className="stat">
                  <span className="stat-label">Last Seen</span>
                  <span className="stat-value">
                    {profile.last_seen ? new Date(profile.last_seen).toLocaleString() : 'Never'}
                  </span>
                </div>
                <div className="stat">
                  <span className="stat-label">Joined</span>
                  <span className="stat-value">
                    {new Date(profile.joined_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="stat">
                  <span className="stat-label">Messages Sent</span>
                  <span className="stat-value">{profile.total_messages}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderContacts = () => (
    <div className="contacts-section">
      <div className="section-header">
        <h2>My Contacts ({contacts.length})</h2>
        <button className="btn-primary" onClick={() => setShowAddContact(true)}>
          ➕ Add Contact
        </button>
      </div>

      {contacts.length === 0 ? (
        <div className="empty-state glass">
          <div className="empty-icon">👥</div>
          <h3>No Contacts Yet</h3>
          <p>Start adding contacts to chat with them</p>
        </div>
      ) : (
        <div className="contacts-grid">
          {contacts.map((contact) => (
            <div key={contact.id} className="contact-card glass">
              <div className="contact-avatar">
                {contact.avatar ? (
                  <img src={contact.avatar} alt={contact.full_name} />
                ) : (
                  <div className="avatar-placeholder">
                    {contact.full_name?.charAt(0) || contact.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className={`status-dot ${contact.is_online ? 'online' : 'offline'}`}></div>
              </div>
              <div className="contact-info">
                <h4>{contact.full_name || contact.username}</h4>
                <p className="username">@{contact.username}</p>
                {contact.nickname && <p className="nickname">"{contact.nickname}"</p>}
                <p className={`status ${contact.is_online ? 'online' : 'offline'}`}>
                  {contact.is_online ? '🟢 Online' : `Last seen: ${contact.last_seen ? new Date(contact.last_seen).toLocaleString() : 'Never'}`}
                </p>
              </div>
              {contact.is_favorite && <div className="favorite-badge">⭐</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderGroups = () => (
    <div className="groups-section">
      <div className="section-header">
        <h2>My Groups ({groups.length})</h2>
        <button className="btn-primary" onClick={() => setShowCreateGroup(true)}>
          ➕ Create Group
        </button>
      </div>

      {groups.length === 0 ? (
        <div className="empty-state glass">
          <div className="empty-icon">👨‍👩‍👧‍👦</div>
          <h3>No Groups Yet</h3>
          <p>Create a group to start chatting with multiple people</p>
        </div>
      ) : (
        <div className="groups-grid">
          {groups.map((group) => (
            <div key={group.id} className="group-card glass">
              <div className="group-avatar">
                {group.avatar ? (
                  <img src={group.avatar} alt={group.name} />
                ) : (
                  '👥'
                )}
              </div>
              <div className="group-info">
                <h4>{group.name}</h4>
                {group.description && <p className="description">{group.description}</p>}
                <p className="members">👥 {group.member_count} members</p>
              </div>
              {group.unread_count > 0 && (
                <div className="unread-badge">{group.unread_count}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderCalls = () => (
    <div className="calls-section">
      <div className="section-header">
        <h2>Call History ({callHistory.length})</h2>
        <button className="btn-primary" onClick={() => setShowMakeCall(true)}>
          📞 Make Call
        </button>
      </div>

      {callHistory.length === 0 ? (
        <div className="empty-state glass">
          <div className="empty-icon">📞</div>
          <h3>No Call History</h3>
          <p>Your call history will appear here</p>
        </div>
      ) : (
        <div className="calls-list">
          {callHistory.map((call) => (
            <div key={call.id} className="call-item glass">
              <div className={`call-icon ${call.call_type}`}>
                {call.call_type === 'audio' ? '📞' : '📹'}
              </div>
              <div className="call-info">
                <h4>{call.other_user}</h4>
                <p className="call-type">
                  {call.is_incoming ? '📥 Incoming' : '📤 Outgoing'} {call.call_type} call
                </p>
                <p className="call-time">{new Date(call.started_at).toLocaleString()}</p>
              </div>
              <div className="call-meta">
                <span className={`call-status ${call.status}`}>{call.status}</span>
                {call.duration > 0 && (
                  <span className="call-duration">
                    {Math.floor(call.duration / 60)}:{(call.duration % 60).toString().padStart(2, '0')}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderStatus = () => (
    <div className="status-section">
      <div className="section-header">
        <h2>Status Updates</h2>
        <button className="btn-primary" onClick={() => setShowAddStatus(true)}>
          ➕ Add Status
        </button>
      </div>

      {statuses.length === 0 ? (
        <div className="empty-state glass">
          <div className="empty-icon">📸</div>
          <h3>No Status Updates</h3>
          <p>Share your moments with status updates</p>
        </div>
      ) : (
        <div className="status-grid">
          {Object.entries(
            statuses.reduce((acc, status) => {
              if (!acc[status.username]) acc[status.username] = [];
              acc[status.username].push(status);
              return acc;
            }, {})
          ).map(([username, userStatuses]) => (
            <div key={username} className="status-group glass">
              <div className="status-user">
                <div className="status-avatar">
                  {userStatuses[0].avatar ? (
                    <img src={userStatuses[0].avatar} alt={username} />
                  ) : (
                    <div className="avatar-placeholder">
                      {username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="status-ring"></div>
                </div>
                <h4>{userStatuses[0].full_name || username}</h4>
              </div>
              <div className="status-items">
                {userStatuses.map((status) => (
                  <div key={status.id} className="status-item glass">
                    {status.status_type === 'text' ? (
                      <div className="status-text" style={{ backgroundColor: status.background_color || '#667eea' }}>
                        <p>{status.content}</p>
                      </div>
                    ) : status.status_type === 'image' ? (
                      <img src={status.media_url} alt="Status" />
                    ) : (
                      <video src={status.media_url} controls />
                    )}
                    <div className="status-meta">
                      <span>{new Date(status.created_at).toLocaleString()}</span>
                      <span>👁️ {status.view_count} views</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderConversations = () => (
    <div className="conversations-section">
      <div className="section-header">
        <h2>Conversations ({conversations.length})</h2>
      </div>

      {conversations.length === 0 ? (
        <div className="empty-state glass">
          <div className="empty-icon">💬</div>
          <h3>No Conversations</h3>
          <p>Start chatting with your contacts</p>
        </div>
      ) : (
        <div className="conversations-list">
          {conversations.map((conv) => (
            <div key={conv.id} className="conversation-item glass">
              <div className="conversation-avatar">
                {conv.other_user_avatar ? (
                  <img src={conv.other_user_avatar} alt={conv.other_user} />
                ) : (
                  <div className="avatar-placeholder">
                    {conv.other_user.charAt(0).toUpperCase()}
                  </div>
                )}
                {conv.is_online && <div className="status-dot online"></div>}
              </div>
              <div className="conversation-info">
                <h4>{conv.other_user_name || conv.other_user}</h4>
                <p className="last-message">{conv.last_message || 'No messages yet'}</p>
              </div>
              <div className="conversation-meta">
                <span className="time">{conv.updated_at ? new Date(conv.updated_at).toLocaleTimeString() : ''}</span>
                {conv.unread_count > 0 && (
                  <span className="unread-badge">{conv.unread_count}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderAdmin = () => (
    <div className="admin-section">
      <h2>Admin Panel</h2>
      
      <div className="admin-stats-grid">
        <div className="admin-stat-card glass">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{stats.totalContacts}</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div className="admin-stat-card glass">
          <div className="stat-icon">💬</div>
          <div className="stat-info">
            <h3>{stats.totalMessages}</h3>
            <p>Total Messages</p>
          </div>
        </div>
        <div className="admin-stat-card glass">
          <div className="stat-icon">👨‍👩‍👧‍👦</div>
          <div className="stat-info">
            <h3>{stats.totalGroups}</h3>
            <p>Total Groups</p>
          </div>
        </div>
        <div className="admin-stat-card glass">
          <div className="stat-icon">📞</div>
          <div className="stat-info">
            <h3>{stats.totalCalls}</h3>
            <p>Total Calls</p>
          </div>
        </div>
        <div className="admin-stat-card glass">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>{stats.totalApiCalls}</h3>
            <p>API Calls</p>
          </div>
        </div>
        <div className="admin-stat-card glass">
          <div className="stat-icon">❤️</div>
          <div className="stat-info">
            <h3>{stats.totalReactions}</h3>
            <p>Reactions</p>
          </div>
        </div>
      </div>

      {apiLogs.length > 0 && (
        <div className="recent-activity glass">
          <h3>Recent API Activity</h3>
          <div className="activity-list">
            {apiLogs.slice(0, 10).map((log, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon">📊</div>
                <div className="activity-text">
                  {log.method} {log.endpoint} - {log.status_code}
                </div>
                <div className="activity-time">
                  {new Date(log.created_at).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {systemStats.length > 0 && (
        <div className="system-stats glass">
          <h3>System Statistics</h3>
          <div className="stats-table">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Users</th>
                  <th>Messages</th>
                  <th>Groups</th>
                  <th>Calls</th>
                  <th>API Calls</th>
                </tr>
              </thead>
              <tbody>
                {systemStats.slice(0, 7).map((stat, index) => (
                  <tr key={index}>
                    <td>{new Date(stat.date).toLocaleDateString()}</td>
                    <td>{stat.total_users}</td>
                    <td>{stat.total_messages}</td>
                    <td>{stat.total_groups}</td>
                    <td>{stat.total_calls}</td>
                    <td>{stat.total_api_calls}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="admin-actions glass">
        <h3>Admin Actions</h3>
        <p>Manage users, groups, and system settings</p>
        <div className="action-buttons">
          <button className="btn-primary">Manage Users</button>
          <button className="btn-primary">Manage Admins</button>
          <button className="btn-primary">View Reports</button>
          <button className="btn-primary">System Settings</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="user-dashboard">
      {/* Navigation */}
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <span className="brand-logo">💬</span>
          <h2>White Beat</h2>
        </div>
        <div className="nav-user">
          <span className="user-name">{user.username}</span>
          {isAdmin && <span className="admin-badge-small">Admin</span>}
          <button className="logout-btn" onClick={onLogout}>
            🚪 Logout
          </button>
        </div>
      </nav>

      {/* Main Layout */}
      <div className="dashboard-layout">
        {/* Sidebar */}
        <aside className="dashboard-sidebar glass">
          <div className="sidebar-menu">
            <button
              className={`menu-item ${activeSection === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveSection('overview')}
            >
              <span className="menu-icon">📊</span>
              <span className="menu-text">Overview</span>
            </button>
            <button
              className={`menu-item ${activeSection === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveSection('profile')}
            >
              <span className="menu-icon">👤</span>
              <span className="menu-text">Profile</span>
            </button>
            <button
              className={`menu-item ${activeSection === 'contacts' ? 'active' : ''}`}
              onClick={() => setActiveSection('contacts')}
            >
              <span className="menu-icon">👥</span>
              <span className="menu-text">Contacts</span>
              {contacts.length > 0 && <span className="menu-badge">{contacts.length}</span>}
            </button>
            <button
              className={`menu-item ${activeSection === 'groups' ? 'active' : ''}`}
              onClick={() => setActiveSection('groups')}
            >
              <span className="menu-icon">👨‍👩‍👧‍👦</span>
              <span className="menu-text">Groups</span>
              {groups.length > 0 && <span className="menu-badge">{groups.length}</span>}
            </button>
            <button
              className={`menu-item ${activeSection === 'conversations' ? 'active' : ''}`}
              onClick={() => setActiveSection('conversations')}
            >
              <span className="menu-icon">💬</span>
              <span className="menu-text">Conversations</span>
              {conversations.length > 0 && <span className="menu-badge">{conversations.length}</span>}
            </button>
            <button
              className={`menu-item ${activeSection === 'calls' ? 'active' : ''}`}
              onClick={() => setActiveSection('calls')}
            >
              <span className="menu-icon">📞</span>
              <span className="menu-text">Calls</span>
              {callHistory.length > 0 && <span className="menu-badge">{callHistory.length}</span>}
            </button>
            <button
              className={`menu-item ${activeSection === 'status' ? 'active' : ''}`}
              onClick={() => setActiveSection('status')}
            >
              <span className="menu-icon">📸</span>
              <span className="menu-text">Status</span>
            </button>
            {isAdmin && (
              <button
                className={`menu-item ${activeSection === 'admin' ? 'active' : ''}`}
                onClick={() => setActiveSection('admin')}
              >
                <span className="menu-icon">🔐</span>
                <span className="menu-text">Admin</span>
              </button>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="dashboard-main glass">
          {loading && activeSection === 'overview' ? (
            <div className="loading">Loading...</div>
          ) : (
            <>
              {activeSection === 'overview' && renderOverview()}
              {activeSection === 'profile' && renderProfile()}
              {activeSection === 'contacts' && renderContacts()}
              {activeSection === 'groups' && renderGroups()}
              {activeSection === 'conversations' && renderConversations()}
              {activeSection === 'calls' && renderCalls()}
              {activeSection === 'status' && renderStatus()}
              {activeSection === 'admin' && isAdmin && renderAdmin()}
            </>
          )}
        </main>
      </div>

      {/* Modals */}
      {showAddContact && (
        <div className="modal-overlay" onClick={() => setShowAddContact(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Add Contact</h2>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  searchUsers(e.target.value);
                }}
              />
            </div>
            <div className="users-list">
              {availableUsers.map((u) => (
                <div key={u.username} className="user-item">
                  <div className="user-avatar">
                    {u.avatar ? (
                      <img src={u.avatar} alt={u.full_name} />
                    ) : (
                      <div className="avatar-placeholder">
                        {u.full_name?.charAt(0) || u.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="user-info">
                    <h4>{u.full_name || u.username}</h4>
                    <p>@{u.username}</p>
                  </div>
                  <button
                    className="btn-primary"
                    onClick={() => handleAddContact(u.username)}
                    disabled={loading}
                  >
                    ➕ Add
                  </button>
                </div>
              ))}
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowAddContact(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showCreateGroup && (
        <div className="modal-overlay" onClick={() => setShowCreateGroup(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Create Group</h2>
            <form onSubmit={handleCreateGroup}>
              <div className="form-group">
                <label>Group Name *</label>
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
                  placeholder="Enter group description"
                  rows="3"
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowCreateGroup(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Creating...' : '✅ Create Group'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showMakeCall && (
        <div className="modal-overlay" onClick={() => setShowMakeCall(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Make Call</h2>
            <form onSubmit={handleMakeCall}>
              <div className="form-group">
                <label>Select Contact *</label>
                <select
                  value={callForm.contact}
                  onChange={(e) => setCallForm({...callForm, contact: e.target.value})}
                  required
                >
                  <option value="">Choose a contact</option>
                  {contacts.map((contact) => (
                    <option key={contact.username} value={contact.username}>
                      {contact.full_name || contact.username}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Call Type *</label>
                <div className="radio-group">
                  <input
                    type="radio"
                    id="audio"
                    name="callType"
                    value="audio"
                    checked={callForm.type === 'audio'}
                    onChange={(e) => setCallForm({...callForm, type: e.target.value})}
                  />
                  <label htmlFor="audio">📞 Voice Call</label>
                  <input
                    type="radio"
                    id="video"
                    name="callType"
                    value="video"
                    checked={callForm.type === 'video'}
                    onChange={(e) => setCallForm({...callForm, type: e.target.value})}
                  />
                  <label htmlFor="video">📹 Video Call</label>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowMakeCall(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Calling...' : '📞 Call Now'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddStatus && (
        <div className="modal-overlay" onClick={() => setShowAddStatus(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Add Status</h2>
            <form onSubmit={handleCreateStatus}>
              <div className="form-group">
                <label>Status Type *</label>
                <select
                  value={statusForm.type}
                  onChange={(e) => setStatusForm({...statusForm, type: e.target.value})}
                >
                  <option value="text">📝 Text</option>
                  <option value="image">🖼️ Image</option>
                  <option value="video">🎥 Video</option>
                </select>
              </div>
              <div className="form-group">
                <label>Content *</label>
                <textarea
                  value={statusForm.content}
                  onChange={(e) => setStatusForm({...statusForm, content: e.target.value})}
                  placeholder="What's on your mind?"
                  rows="3"
                  required
                />
              </div>
              <div className="form-group">
                <label>Privacy *</label>
                <select
                  value={statusForm.privacy}
                  onChange={(e) => setStatusForm({...statusForm, privacy: e.target.value})}
                >
                  <option value="everyone">🌍 Everyone</option>
                  <option value="contacts">👥 Contacts Only</option>
                  <option value="selected">🔒 Selected Contacts</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowAddStatus(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Posting...' : '✅ Post Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDashboard;
