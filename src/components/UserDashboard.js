import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserDashboard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const UserDashboard = ({ user, onLogout }) => {
  // State Management
  const [activeSection, setActiveSection] = useState('overview');
  const [loading, setLoading] = useState(false);
  
  // Profile State
  const [profile, setProfile] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    full_name: '',
    bio: '',
    status_message: '',
    avatar: ''
  });

  // Contacts State
  const [contacts, setContacts] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddContact, setShowAddContact] = useState(false);

  // Groups State
  const [groups, setGroups] = useState([]);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [groupForm, setGroupForm] = useState({
    name: '',
    description: ''
  });
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupMembers, setGroupMembers] = useState([]);

  // Calls State
  const [callHistory, setCallHistory] = useState([]);
  const [showCallModal, setShowCallModal] = useState(false);
  const [callForm, setCallForm] = useState({
    receiver: '',
    call_type: 'audio'
  });

  // Status State
  const [statuses, setStatuses] = useState([]);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusForm, setStatusForm] = useState({
    content: '',
    status_type: 'text',
    privacy: 'everyone'
  });

  // Admin State
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminStats, setAdminStats] = useState(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  // Statistics State
  const [stats, setStats] = useState({
    totalContacts: 0,
    totalGroups: 0,
    totalCalls: 0,
    totalStatuses: 0
  });

  // Load initial data
  useEffect(() => {
    if (user) {
      loadProfile();
      loadContacts();
      loadGroups();
      loadCallHistory();
      loadStatuses();
      checkAdminStatus();
    }
  }, [user]);

  // Update stats when data changes
  useEffect(() => {
    setStats({
      totalContacts: contacts.length,
      totalGroups: groups.length,
      totalCalls: callHistory.length,
      totalStatuses: statuses.length
    });
  }, [contacts, groups, callHistory, statuses]);

  // ==================== PROFILE FUNCTIONS ====================
  const loadProfile = async () => {
    try {
      const response = await axios.get(`${API_URL}/user-profile/`, {
        params: { username: user.username }
      });
      setProfile(response.data);
      setProfileForm({
        full_name: response.data.full_name || '',
        bio: response.data.bio || '',
        status_message: response.data.status_message || '',
        avatar: response.data.avatar || ''
      });
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/update-profile/`, {
        username: user.username,
        ...profileForm
      });
      alert('Profile updated successfully!');
      setEditingProfile(false);
      loadProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // ==================== CONTACTS FUNCTIONS ====================
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

  const loadAllUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/users/`, {
        params: { username: user.username, search: searchQuery }
      });
      setAllUsers(response.data.users || []);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const addContact = async (contactUsername) => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/add-contact/`, {
        username: user.username,
        contact_username: contactUsername
      });
      alert('Contact added successfully!');
      loadContacts();
      setShowAddContact(false);
    } catch (error) {
      console.error('Error adding contact:', error);
      alert('Failed to add contact');
    } finally {
      setLoading(false);
    }
  };

  // ==================== GROUPS FUNCTIONS ====================
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

  const createGroup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/create-group/`, {
        creator: user.username,
        name: groupForm.name,
        description: groupForm.description
      });
      alert('Group created successfully!');
      setShowCreateGroup(false);
      setGroupForm({ name: '', description: '' });
      loadGroups();
    } catch (error) {
      console.error('Error creating group:', error);
      alert('Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  const addGroupMember = async (groupId, memberUsername) => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/add-group-member/`, {
        group_id: groupId,
        username: memberUsername,
        added_by: user.username
      });
      alert('Member added successfully!');
      loadGroups();
    } catch (error) {
      console.error('Error adding member:', error);
      alert('Failed to add member');
    } finally {
      setLoading(false);
    }
  };

  const removeGroupMember = async (groupId, memberUsername) => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/remove-group-member/`, {
        group_id: groupId,
        username: memberUsername,
        removed_by: user.username
      });
      alert('Member removed successfully!');
      loadGroups();
    } catch (error) {
      console.error('Error removing member:', error);
      alert('Failed to remove member');
    } finally {
      setLoading(false);
    }
  };

  // ==================== CALLS FUNCTIONS ====================
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

  const initiateCall = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/initiate-call/`, {
        caller: user.username,
        receiver: callForm.receiver,
        call_type: callForm.call_type
      });
      alert(`${callForm.call_type === 'audio' ? 'Voice' : 'Video'} call initiated!`);
      setShowCallModal(false);
      setCallForm({ receiver: '', call_type: 'audio' });
      loadCallHistory();
    } catch (error) {
      console.error('Error initiating call:', error);
      alert('Failed to initiate call');
    } finally {
      setLoading(false);
    }
  };

  // ==================== STATUS FUNCTIONS ====================
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

  const createStatus = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/create-status/`, {
        username: user.username,
        content: statusForm.content,
        status_type: statusForm.status_type,
        privacy: statusForm.privacy
      });
      alert('Status created successfully!');
      setShowStatusModal(false);
      setStatusForm({ content: '', status_type: 'text', privacy: 'everyone' });
      loadStatuses();
    } catch (error) {
      console.error('Error creating status:', error);
      alert('Failed to create status');
    } finally {
      setLoading(false);
    }
  };

  const viewStatus = async (statusId) => {
    try {
      await axios.post(`${API_URL}/view-status/`, {
        status_id: statusId,
        viewer: user.username
      });
      loadStatuses();
    } catch (error) {
      console.error('Error viewing status:', error);
    }
  };

  // ==================== ADMIN FUNCTIONS ====================
  const checkAdminStatus = async () => {
    try {
      const response = await axios.post(`${API_URL}/verify-admin/`, {
        username: user.username
      });
      setIsAdmin(response.data.is_admin);
      if (response.data.is_admin) {
        loadAdminStats();
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
    }
  };

  const loadAdminStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin-stats/`, {
        params: { username: user.username }
      });
      setAdminStats(response.data);
    } catch (error) {
      console.error('Error loading admin stats:', error);
    }
  };

  const makeAdmin = async (targetUsername) => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/make-admin/`, {
        username: user.username,
        target_username: targetUsername
      });
      alert(`${targetUsername} is now an admin!`);
      loadAdminStats();
    } catch (error) {
      console.error('Error making admin:', error);
      alert('Failed to make admin');
    } finally {
      setLoading(false);
    }
  };

  const removeAdmin = async (targetUsername) => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/remove-admin/`, {
        username: user.username,
        target_username: targetUsername
      });
      alert(`${targetUsername} is no longer an admin!`);
      loadAdminStats();
    } catch (error) {
      console.error('Error removing admin:', error);
      alert('Failed to remove admin');
    } finally {
      setLoading(false);
    }
  };

  // ==================== RENDER FUNCTIONS ====================
  const renderOverview = () => (
    <div className="overview-section">
      <h2>📊 Dashboard Overview</h2>
      
      <div className="stats-grid">
        <div className="stat-card glass">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{stats.totalContacts}</h3>
            <p>Contacts</p>
          </div>
        </div>
        
        <div className="stat-card glass">
          <div className="stat-icon">👨‍👩‍👧‍👦</div>
          <div className="stat-info">
            <h3>{stats.totalGroups}</h3>
            <p>Groups</p>
          </div>
        </div>
        
        <div className="stat-card glass">
          <div className="stat-icon">📞</div>
          <div className="stat-info">
            <h3>{stats.totalCalls}</h3>
            <p>Calls</p>
          </div>
        </div>
        
        <div className="stat-card glass">
          <div className="stat-icon">📸</div>
          <div className="stat-info">
            <h3>{stats.totalStatuses}</h3>
            <p>Statuses</p>
          </div>
        </div>
      </div>

      {profile && (
        <div className="profile-summary glass">
          <h3>👤 Your Profile</h3>
          <div className="profile-info">
            <div className="profile-avatar">
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.username} />
              ) : (
                <div className="avatar-placeholder">{profile.username[0].toUpperCase()}</div>
              )}
              <span className={`status-dot ${profile.is_online ? 'online' : 'offline'}`}></span>
            </div>
            <div className="profile-details">
              <h4>{profile.full_name || profile.username}</h4>
              <p className="username">@{profile.username}</p>
              {profile.bio && <p className="bio">{profile.bio}</p>}
              {profile.status_message && <p className="status-msg">💬 {profile.status_message}</p>}
            </div>
          </div>
        </div>
      )}

      {isAdmin && (
        <div className="admin-badge glass">
          <h3>🔐 Admin Access</h3>
          <p>You have administrator privileges</p>
          <button onClick={() => setActiveSection('admin')} className="btn-primary">
            Open Admin Panel
          </button>
        </div>
      )}
    </div>
  );

  const renderProfile = () => (
    <div className="profile-section">
      <div className="section-header">
        <h2>👤 My Profile</h2>
        <button onClick={() => setEditingProfile(!editingProfile)} className="btn-secondary">
          {editingProfile ? '❌ Cancel' : '✏️ Edit Profile'}
        </button>
      </div>

      {profile && (
        <div className="profile-card glass">
          {editingProfile ? (
            <form onSubmit={updateProfile} className="profile-form">
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
                  value={profileForm.status_message}
                  onChange={(e) => setProfileForm({...profileForm, status_message: e.target.value})}
                  placeholder="What's on your mind?"
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

              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? '⏳ Saving...' : '💾 Save Changes'}
              </button>
            </form>
          ) : (
            <div className="profile-view">
              <div className="profile-header">
                <div className="profile-avatar-large">
                  {profile.avatar ? (
                    <img src={profile.avatar} alt={profile.username} />
                  ) : (
                    <div className="avatar-placeholder-large">{profile.username[0].toUpperCase()}</div>
                  )}
                </div>
                <div className="profile-info-main">
                  <h3>{profile.full_name || profile.username}</h3>
                  <p className="username">@{profile.username}</p>
                  <p className="email">📧 {profile.email}</p>
                  {profile.phone_number && <p className="phone">📱 {profile.phone_number}</p>}
                </div>
              </div>

              {profile.bio && (
                <div className="profile-bio">
                  <h4>About</h4>
                  <p>{profile.bio}</p>
                </div>
              )}

              {profile.status_message && (
                <div className="profile-status">
                  <h4>Status</h4>
                  <p>💬 {profile.status_message}</p>
                </div>
              )}

              <div className="profile-stats">
                <div className="stat">
                  <span className="stat-label">Status</span>
                  <span className={`stat-value ${profile.is_online ? 'online' : 'offline'}`}>
                    {profile.is_online ? '🟢 Online' : '⚫ Offline'}
                  </span>
                </div>
                {profile.last_seen && !profile.is_online && (
                  <div className="stat">
                    <span className="stat-label">Last Seen</span>
                    <span className="stat-value">{new Date(profile.last_seen).toLocaleString()}</span>
                  </div>
                )}
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
        <h2>👥 My Contacts ({contacts.length})</h2>
        <button onClick={() => {
          setShowAddContact(true);
          loadAllUsers();
        }} className="btn-primary">
          ➕ Add Contact
        </button>
      </div>

      <div className="contacts-grid">
        {contacts.map((contact) => (
          <div key={contact.username} className="contact-card glass">
            <div className="contact-avatar">
              {contact.avatar ? (
                <img src={contact.avatar} alt={contact.full_name} />
              ) : (
                <div className="avatar-placeholder">{contact.username[0].toUpperCase()}</div>
              )}
              <span className={`status-dot ${contact.is_online ? 'online' : 'offline'}`}></span>
            </div>
            <div className="contact-info">
              <h4>{contact.full_name || contact.username}</h4>
              <p className="username">@{contact.username}</p>
              {contact.nickname && <p className="nickname">📝 {contact.nickname}</p>}
              <p className={`status ${contact.is_online ? 'online' : 'offline'}`}>
                {contact.is_online ? '🟢 Online' : `⚫ Last seen: ${new Date(contact.last_seen).toLocaleString()}`}
              </p>
            </div>
            {contact.is_favorite && <span className="favorite-badge">⭐</span>}
          </div>
        ))}
      </div>

      {contacts.length === 0 && (
        <div className="empty-state glass">
          <div className="empty-icon">👥</div>
          <h3>No contacts yet</h3>
          <p>Add your first contact to get started!</p>
        </div>
      )}

      {/* Add Contact Modal */}
      {showAddContact && (
        <div className="modal-overlay" onClick={() => setShowAddContact(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Add New Contact</h2>
            
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  loadAllUsers();
                }}
              />
            </div>

            <div className="users-list">
              {allUsers.filter(u => u.username !== user.username && !contacts.find(c => c.username === u.username)).map((u) => (
                <div key={u.username} className="user-item">
                  <div className="user-avatar">
                    {u.avatar ? (
                      <img src={u.avatar} alt={u.full_name} />
                    ) : (
                      <div className="avatar-placeholder">{u.username[0].toUpperCase()}</div>
                    )}
                  </div>
                  <div className="user-info">
                    <h4>{u.full_name || u.username}</h4>
                    <p>@{u.username}</p>
                  </div>
                  <button onClick={() => addContact(u.username)} className="btn-primary">
                    ➕ Add
                  </button>
                </div>
              ))}
            </div>

            <button onClick={() => setShowAddContact(false)} className="btn-secondary">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderGroups = () => (
    <div className="groups-section">
      <div className="section-header">
        <h2>👨‍👩‍👧‍👦 My Groups ({groups.length})</h2>
        <button onClick={() => setShowCreateGroup(true)} className="btn-primary">
          ➕ Create Group
        </button>
      </div>

      <div className="groups-grid">
        {groups.map((group) => (
          <div key={group.id} className="group-card glass">
            <div className="group-avatar">
              {group.avatar ? (
                <img src={group.avatar} alt={group.name} />
              ) : (
                <div className="avatar-placeholder">👥</div>
              )}
            </div>
            <div className="group-info">
              <h4>{group.name}</h4>
              {group.description && <p className="description">{group.description}</p>}
              <p className="members">👥 {group.member_count} members</p>
              {group.unread_count > 0 && (
                <span className="unread-badge">{group.unread_count}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {groups.length === 0 && (
        <div className="empty-state glass">
          <div className="empty-icon">👨‍👩‍👧‍👦</div>
          <h3>No groups yet</h3>
          <p>Create your first group to get started!</p>
        </div>
      )}

      {/* Create Group Modal */}
      {showCreateGroup && (
        <div className="modal-overlay" onClick={() => setShowCreateGroup(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Group</h2>
            
            <form onSubmit={createGroup}>
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
                  placeholder="What's this group about?"
                  rows="3"
                />
              </div>

              <div className="modal-actions">
                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? '⏳ Creating...' : '✅ Create Group'}
                </button>
                <button type="button" onClick={() => setShowCreateGroup(false)} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderCalls = () => (
    <div className="calls-section">
      <div className="section-header">
        <h2>📞 Call History ({callHistory.length})</h2>
        <button onClick={() => setShowCallModal(true)} className="btn-primary">
          📞 Make Call
        </button>
      </div>

      <div className="calls-list">
        {callHistory.map((call) => (
          <div key={call.id} className="call-item glass">
            <div className={`call-icon ${call.call_type}`}>
              {call.call_type === 'video' ? '📹' : '📞'}
            </div>
            <div className="call-info">
              <h4>{call.is_incoming ? call.caller : call.receiver}</h4>
              <p className="call-type">
                {call.is_incoming ? '📥 Incoming' : '📤 Outgoing'} {call.call_type} call
              </p>
              <p className="call-time">{new Date(call.started_at).toLocaleString()}</p>
            </div>
            <div className="call-meta">
              <span className={`call-status ${call.status}`}>
                {call.status === 'completed' && '✅'}
                {call.status === 'missed' && '❌'}
                {call.status === 'rejected' && '🚫'}
                {call.status}
              </span>
              {call.duration && <span className="call-duration">⏱️ {call.duration}s</span>}
            </div>
          </div>
        ))}
      </div>

      {callHistory.length === 0 && (
        <div className="empty-state glass">
          <div className="empty-icon">📞</div>
          <h3>No call history</h3>
          <p>Make your first call to get started!</p>
        </div>
      )}

      {/* Make Call Modal */}
      {showCallModal && (
        <div className="modal-overlay" onClick={() => setShowCallModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Make a Call</h2>
            
            <form onSubmit={initiateCall}>
              <div className="form-group">
                <label>Call To *</label>
                <select
                  value={callForm.receiver}
                  onChange={(e) => setCallForm({...callForm, receiver: e.target.value})}
                  required
                >
                  <option value="">Select contact</option>
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
                  <label>
                    <input
                      type="radio"
                      value="audio"
                      checked={callForm.call_type === 'audio'}
                      onChange={(e) => setCallForm({...callForm, call_type: e.target.value})}
                    />
                    📞 Voice Call
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="video"
                      checked={callForm.call_type === 'video'}
                      onChange={(e) => setCallForm({...callForm, call_type: e.target.value})}
                    />
                    📹 Video Call
                  </label>
                </div>
              </div>

              <div className="modal-actions">
                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? '⏳ Calling...' : '📞 Call Now'}
                </button>
                <button type="button" onClick={() => setShowCallModal(false)} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderStatus = () => (
    <div className="status-section">
      <div className="section-header">
        <h2>📸 Status Updates</h2>
        <button onClick={() => setShowStatusModal(true)} className="btn-primary">
          ➕ Add Status
        </button>
      </div>

      <div className="status-grid">
        {statuses.map((statusGroup) => (
          <div key={statusGroup.user.username} className="status-group">
            <div className="status-user">
              <div className="status-avatar">
                {statusGroup.user.avatar ? (
                  <img src={statusGroup.user.avatar} alt={statusGroup.user.username} />
                ) : (
                  <div className="avatar-placeholder">{statusGroup.user.username[0].toUpperCase()}</div>
                )}
                <div className="status-ring"></div>
              </div>
              <h4>{statusGroup.user.username}</h4>
            </div>
            
            <div className="status-items">
              {statusGroup.statuses.map((status) => (
                <div key={status.id} className="status-item glass" onClick={() => viewStatus(status.id)}>
                  {status.status_type === 'text' && (
                    <div className="status-text">
                      <p>{status.content}</p>
                    </div>
                  )}
                  {status.status_type === 'image' && status.media_url && (
                    <img src={status.media_url} alt="Status" />
                  )}
                  {status.status_type === 'video' && status.media_url && (
                    <video src={status.media_url} controls />
                  )}
                  <div className="status-meta">
                    <span>👁️ {status.view_count} views</span>
                    <span>{new Date(status.created_at).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {statuses.length === 0 && (
        <div className="empty-state glass">
          <div className="empty-icon">📸</div>
          <h3>No status updates</h3>
          <p>Share your first status!</p>
        </div>
      )}

      {/* Create Status Modal */}
      {showStatusModal && (
        <div className="modal-overlay" onClick={() => setShowStatusModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Create Status</h2>
            
            <form onSubmit={createStatus}>
              <div className="form-group">
                <label>Status Type *</label>
                <select
                  value={statusForm.status_type}
                  onChange={(e) => setStatusForm({...statusForm, status_type: e.target.value})}
                  required
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
                  rows="4"
                  required
                />
              </div>

              <div className="form-group">
                <label>Privacy *</label>
                <select
                  value={statusForm.privacy}
                  onChange={(e) => setStatusForm({...statusForm, privacy: e.target.value})}
                  required
                >
                  <option value="everyone">🌍 Everyone</option>
                  <option value="contacts">👥 Contacts Only</option>
                  <option value="selected">🔒 Selected Contacts</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? '⏳ Posting...' : '✅ Post Status'}
                </button>
                <button type="button" onClick={() => setShowStatusModal(false)} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderAdmin = () => (
    <div className="admin-section">
      <h2>🔐 Admin Panel</h2>

      {adminStats && (
        <>
          <div className="admin-stats-grid">
            <div className="admin-stat-card glass">
              <div className="stat-icon">👥</div>
              <div className="stat-info">
                <h3>{adminStats.total_users}</h3>
                <p>Total Users</p>
              </div>
            </div>

            <div className="admin-stat-card glass">
              <div className="stat-icon">💬</div>
              <div className="stat-info">
                <h3>{adminStats.total_messages}</h3>
                <p>Total Messages</p>
              </div>
            </div>

            <div className="admin-stat-card glass">
              <div className="stat-icon">👨‍👩‍👧‍👦</div>
              <div className="stat-info">
                <h3>{adminStats.total_groups}</h3>
                <p>Total Groups</p>
              </div>
            </div>

            <div className="admin-stat-card glass">
              <div className="stat-icon">📞</div>
              <div className="stat-info">
                <h3>{adminStats.total_calls}</h3>
                <p>Total Calls</p>
              </div>
            </div>

            <div className="admin-stat-card glass">
              <div className="stat-icon">🟢</div>
              <div className="stat-info">
                <h3>{adminStats.active_users}</h3>
                <p>Active Users</p>
              </div>
            </div>
          </div>

          {adminStats.recent_activity && (
            <div className="recent-activity glass">
              <h3>📊 Recent Activity</h3>
              <div className="activity-list">
                {adminStats.recent_activity.map((activity, idx) => (
                  <div key={idx} className="activity-item">
                    <span className="activity-icon">{activity.icon}</span>
                    <span className="activity-text">{activity.text}</span>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <div className="admin-actions glass">
        <h3>🛠️ Admin Actions</h3>
        <p>Manage user permissions and system settings</p>
        <div className="action-buttons">
          <button className="btn-primary">👥 Manage Users</button>
          <button className="btn-primary">🔐 Manage Admins</button>
          <button className="btn-primary">📊 View Reports</button>
          <button className="btn-primary">⚙️ System Settings</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="user-dashboard">
      {/* Navigation */}
      <nav className="dashboard-nav glass">
        <div className="nav-brand">
          <div className="brand-logo">💬</div>
          <h2>White Beat</h2>
        </div>
        <div className="nav-user">
          <span className="user-name">👤 {user.username}</span>
          {isAdmin && <span className="admin-badge-small">🔐 Admin</span>}
          <button className="logout-btn" onClick={onLogout}>
            🚪 Logout
          </button>
        </div>
      </nav>

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
              {stats.totalContacts > 0 && (
                <span className="menu-badge">{stats.totalContacts}</span>
              )}
            </button>

            <button
              className={`menu-item ${activeSection === 'groups' ? 'active' : ''}`}
              onClick={() => setActiveSection('groups')}
            >
              <span className="menu-icon">👨‍👩‍👧‍👦</span>
              <span className="menu-text">Groups</span>
              {stats.totalGroups > 0 && (
                <span className="menu-badge">{stats.totalGroups}</span>
              )}
            </button>

            <button
              className={`menu-item ${activeSection === 'calls' ? 'active' : ''}`}
              onClick={() => setActiveSection('calls')}
            >
              <span className="menu-icon">📞</span>
              <span className="menu-text">Calls</span>
              {stats.totalCalls > 0 && (
                <span className="menu-badge">{stats.totalCalls}</span>
              )}
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
        <main className="dashboard-main">
          {activeSection === 'overview' && renderOverview()}
          {activeSection === 'profile' && renderProfile()}
          {activeSection === 'contacts' && renderContacts()}
          {activeSection === 'groups' && renderGroups()}
          {activeSection === 'calls' && renderCalls()}
          {activeSection === 'status' && renderStatus()}
          {activeSection === 'admin' && isAdmin && renderAdmin()}
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;