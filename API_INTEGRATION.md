# 🔌 White Beat - Complete API Integration Guide

This document details all backend API endpoints integrated in the frontend.

---

## 📋 Table of Contents

1. [Authentication](#authentication)
2. [Messaging](#messaging)
3. [Groups](#groups)
4. [Calls](#calls)
5. [Status](#status)
6. [Contacts](#contacts)
7. [User Management](#user-management)
8. [Admin](#admin)

---

## 🔐 Authentication

### Login
```javascript
POST /api/login/
Body: {
  username: string,
  password: string
}
Response: {
  username: string,
  role: 'user' | 'admin',
  message: string
}
```

### Signup
```javascript
POST /api/signup/
Body: {
  username: string,
  password: string,
  email: string,
  phone_number?: string
}
Response: {
  message: string,
  username: string
}
```

### Logout
```javascript
POST /api/logout/
Body: {
  username: string
}
Response: {
  message: string
}
```

---

## 💬 Messaging

### Get Conversations
```javascript
GET /api/conversations/
Params: {
  username: string
}
Response: {
  conversations: [
    {
      id: number,
      other_user: {
        username: string,
        full_name: string,
        avatar: string,
        is_online: boolean
      },
      last_message: {
        content: string,
        created_at: string,
        is_mine: boolean
      },
      unread_count: number,
      updated_at: string
    }
  ]
}
```

### Get Messages
```javascript
GET /api/messages/
Params: {
  username: string,
  other_username: string
}
Response: {
  messages: [
    {
      id: number,
      sender: { username: string },
      content: string,
      message_type: 'text' | 'image' | 'video' | 'audio' | 'document',
      media_url: string,
      is_mine: boolean,
      is_read: boolean,
      deleted: boolean,
      edited_at: string,
      created_at: string,
      reply_to: { id: number, content: string, sender: { username: string } },
      reactions: [{ type: string, user: string }]
    }
  ]
}
```

### Send Message
```javascript
POST /api/send-message/
Body: {
  sender: string,
  receiver?: string,
  group_id?: number,
  content: string,
  message_type: 'text' | 'image' | 'video' | 'audio' | 'document',
  reply_to?: number
}
// OR FormData for media upload
FormData: {
  file: File,
  sender: string,
  receiver?: string,
  group_id?: number,
  message_type: string
}
Response: {
  message: string,
  message_id: number
}
```

### Edit Message
```javascript
POST /api/edit-message/
Body: {
  message_id: number,
  username: string,
  new_content: string
}
Response: {
  message: string
}
```

### Delete Message
```javascript
POST /api/delete-message/
Body: {
  message_id: number,
  username: string,
  delete_for_everyone: boolean
}
Response: {
  message: string
}
```

### React to Message
```javascript
POST /api/react-message/
Body: {
  message_id: number,
  username: string,
  reaction_type: 'like' | 'love' | 'laugh' | 'wow' | 'sad' | 'angry'
}
Response: {
  message: string
}
```

### Forward Message
```javascript
POST /api/forward-message/
Body: {
  message_id: number,
  sender: string,
  recipients: [string]
}
Response: {
  message: string
}
```

### Mark as Read
```javascript
POST /api/mark-read/
Body: {
  username: string,
  other_username: string
}
Response: {
  message: string
}
```

---

## 👥 Groups

### Get Groups
```javascript
GET /api/groups/
Params: {
  username: string
}
Response: {
  groups: [
    {
      id: number,
      name: string,
      description: string,
      avatar: string,
      member_count: number,
      unread_count: number,
      updated_at: string
    }
  ]
}
```

### Create Group
```javascript
POST /api/create-group/
Body: {
  creator: string,
  name: string,
  description?: string
}
Response: {
  message: string,
  group_id: number
}
```

### Get Group Messages
```javascript
GET /api/group-messages/
Params: {
  group_id: number
}
Response: {
  messages: [
    {
      id: number,
      sender: { username: string },
      content: string,
      message_type: string,
      media_url: string,
      is_mine: boolean,
      created_at: string,
      reactions: [{ type: string, user: string }]
    }
  ]
}
```

### Add Group Member
```javascript
POST /api/add-group-member/
Body: {
  group_id: number,
  username: string,
  added_by: string
}
Response: {
  message: string
}
```

### Remove Group Member
```javascript
POST /api/remove-group-member/
Body: {
  group_id: number,
  username: string,
  removed_by: string
}
Response: {
  message: string
}
```

---

## 📞 Calls

### Initiate Call
```javascript
POST /api/initiate-call/
Body: {
  caller: string,
  receiver?: string,
  group_id?: number,
  call_type: 'audio' | 'video'
}
Response: {
  message: string,
  call_id: number
}
```

### Update Call Status
```javascript
POST /api/update-call-status/
Body: {
  call_id: number,
  status: 'ringing' | 'answered' | 'completed' | 'missed' | 'rejected' | 'busy' | 'failed'
}
Response: {
  message: string
}
```

### Get Call History
```javascript
GET /api/call-history/
Params: {
  username: string
}
Response: {
  calls: [
    {
      id: number,
      caller: string,
      receiver: string,
      call_type: 'audio' | 'video',
      status: string,
      duration: number,
      is_incoming: boolean,
      started_at: string
    }
  ]
}
```

---

## 📸 Status

### Get Statuses
```javascript
GET /api/statuses/
Params: {
  username: string
}
Response: {
  statuses: [
    {
      user: {
        username: string,
        avatar: string
      },
      statuses: [
        {
          id: number,
          content: string,
          status_type: 'text' | 'image' | 'video',
          media_url: string,
          view_count: number,
          created_at: string
        }
      ]
    }
  ]
}
```

### Create Status
```javascript
POST /api/create-status/
Body: {
  username: string,
  content: string,
  status_type: 'text' | 'image' | 'video',
  privacy: 'everyone' | 'contacts' | 'selected'
}
Response: {
  message: string,
  status_id: number
}
```

### View Status
```javascript
POST /api/view-status/
Body: {
  status_id: number,
  viewer: string
}
Response: {
  message: string
}
```

---

## 📇 Contacts

### Get Contacts
```javascript
GET /api/contacts/
Params: {
  username: string
}
Response: {
  contacts: [
    {
      username: string,
      full_name: string,
      avatar: string,
      nickname: string,
      is_favorite: boolean,
      is_online: boolean,
      last_seen: string
    }
  ]
}
```

### Add Contact
```javascript
POST /api/add-contact/
Body: {
  username: string,
  contact_username: string,
  nickname?: string
}
Response: {
  message: string
}
```

---

## 👤 User Management

### Get Users
```javascript
GET /api/users/
Params: {
  username: string,
  search?: string
}
Response: {
  users: [
    {
      id: number,
      username: string,
      full_name: string,
      avatar: string,
      is_online: boolean,
      status: string
    }
  ]
}
```

### Get User Profile
```javascript
GET /api/user-profile/
Params: {
  username: string
}
Response: {
  username: string,
  full_name: string,
  email: string,
  phone_number: string,
  avatar: string,
  bio: string,
  status_message: string,
  is_online: boolean,
  last_seen: string,
  privacy_settings: {
    profile_photo: string,
    status: string,
    last_seen: string
  }
}
```

### Update Profile
```javascript
POST /api/update-profile/
Body: {
  username: string,
  full_name?: string,
  bio?: string,
  status_message?: string,
  avatar?: string,
  privacy_settings?: {
    profile_photo: string,
    status: string,
    last_seen: string
  }
}
Response: {
  message: string
}
```

---

## 🔧 Admin

### Verify Admin
```javascript
POST /api/verify-admin/
Body: {
  username: string
}
Response: {
  is_admin: boolean
}
```

### Make Admin
```javascript
POST /api/make-admin/
Body: {
  username: string,
  target_username: string
}
Response: {
  message: string
}
```

### Remove Admin
```javascript
POST /api/remove-admin/
Body: {
  username: string,
  target_username: string
}
Response: {
  message: string
}
```

### Admin Stats
```javascript
GET /api/admin-stats/
Params: {
  username: string
}
Response: {
  total_users: number,
  total_messages: number,
  total_groups: number,
  total_calls: number,
  active_users: number,
  recent_activity: [...]
}
```

---

## 🔄 Real-time Updates

The frontend implements polling every 3 seconds for:
- New messages in active chat
- Updated conversation list
- Online status changes
- Typing indicators (simulated)

### Polling Implementation
```javascript
useEffect(() => {
  const interval = setInterval(() => {
    if (selectedChat) {
      fetchMessages(chatId, isGroup, true); // silent refresh
    }
    fetchConversations();
  }, 3000);

  return () => clearInterval(interval);
}, [selectedChat]);
```

---

## 📊 Usage Examples

### Complete Chat Flow
```javascript
// 1. Login
const loginResponse = await axios.post(`${API_URL}/login/`, {
  username: 'john',
  password: 'password123'
});

// 2. Get conversations
const conversations = await axios.get(`${API_URL}/conversations/`, {
  params: { username: 'john' }
});

// 3. Select a chat and get messages
const messages = await axios.get(`${API_URL}/messages/`, {
  params: { 
    username: 'john',
    other_username: 'jane'
  }
});

// 4. Send a message
await axios.post(`${API_URL}/send-message/`, {
  sender: 'john',
  receiver: 'jane',
  content: 'Hello!',
  message_type: 'text'
});

// 5. React to a message
await axios.post(`${API_URL}/react-message/`, {
  message_id: 123,
  username: 'john',
  reaction_type: 'like'
});

// 6. Mark as read
await axios.post(`${API_URL}/mark-read/`, {
  username: 'john',
  other_username: 'jane'
});
```

### Group Chat Flow
```javascript
// 1. Create group
const group = await axios.post(`${API_URL}/create-group/`, {
  creator: 'john',
  name: 'Team Chat',
  description: 'Our team discussions'
});

// 2. Add members
await axios.post(`${API_URL}/add-group-member/`, {
  group_id: group.data.group_id,
  username: 'jane',
  added_by: 'john'
});

// 3. Send group message
await axios.post(`${API_URL}/send-message/`, {
  sender: 'john',
  group_id: group.data.group_id,
  content: 'Welcome everyone!',
  message_type: 'text'
});
```

### Call Flow
```javascript
// 1. Initiate call
const call = await axios.post(`${API_URL}/initiate-call/`, {
  caller: 'john',
  receiver: 'jane',
  call_type: 'video'
});

// 2. Update call status (answered)
await axios.post(`${API_URL}/update-call-status/`, {
  call_id: call.data.call_id,
  status: 'answered'
});

// 3. Update call status (completed)
await axios.post(`${API_URL}/update-call-status/`, {
  call_id: call.data.call_id,
  status: 'completed'
});
```

### Status Flow
```javascript
// 1. Create status
await axios.post(`${API_URL}/create-status/`, {
  username: 'john',
  content: 'Having a great day!',
  status_type: 'text',
  privacy: 'everyone'
});

// 2. View someone's status
await axios.post(`${API_URL}/view-status/`, {
  status_id: 456,
  viewer: 'john'
});

// 3. Get all statuses
const statuses = await axios.get(`${API_URL}/statuses/`, {
  params: { username: 'john' }
});
```

---

## 🛠️ Error Handling

All API calls include error handling:

```javascript
try {
  const response = await axios.post(`${API_URL}/send-message/`, payload);
  // Success handling
} catch (error) {
  console.error('Error:', error);
  if (error.response) {
    // Server responded with error
    alert(error.response.data.error || 'An error occurred');
  } else if (error.request) {
    // No response received
    alert('Network error. Please check your connection.');
  } else {
    // Other errors
    alert('An unexpected error occurred.');
  }
}
```

---

## 🔐 Security Considerations

1. **HTTPS**: Always use HTTPS in production
2. **CORS**: Backend must allow frontend origin
3. **Authentication**: Store user session securely
4. **Input Validation**: Validate all user inputs
5. **File Upload**: Validate file types and sizes
6. **Rate Limiting**: Implement on backend

---

## 📱 Frontend State Management

```javascript
// User state
const [user, setUser] = useState(null);

// Chat state
const [conversations, setConversations] = useState([]);
const [messages, setMessages] = useState([]);
const [selectedChat, setSelectedChat] = useState(null);

// UI state
const [activeTab, setActiveTab] = useState('chats');
const [loading, setLoading] = useState(false);
const [searchQuery, setSearchQuery] = useState('');

// Modals
const [showUserList, setShowUserList] = useState(false);
const [showGroupModal, setShowGroupModal] = useState(false);
const [showStatusModal, setShowStatusModal] = useState(false);

// Message actions
const [editingMessage, setEditingMessage] = useState(null);
const [replyingTo, setReplyingTo] = useState(null);
const [selectedMessages, setSelectedMessages] = useState([]);
```

---

## 🎯 Best Practices

1. **Silent Refresh**: Use `silent` parameter to avoid loading states during polling
2. **Debouncing**: Debounce search and typing indicators
3. **Optimistic Updates**: Update UI immediately, sync with backend
4. **Error Recovery**: Retry failed requests automatically
5. **Caching**: Cache user profiles and avatars
6. **Pagination**: Implement for large message lists
7. **Lazy Loading**: Load media on demand

---

## 📊 Performance Tips

1. **Batch Requests**: Combine multiple API calls when possible
2. **Compression**: Enable gzip compression
3. **CDN**: Use CDN for media files
4. **Lazy Load Images**: Load images as they come into view
5. **Virtual Scrolling**: For long message lists
6. **Service Workers**: Cache static assets

---

## 🔄 Future Enhancements

- [ ] WebSocket for real-time updates
- [ ] Push notifications
- [ ] Offline mode with local storage
- [ ] Message search
- [ ] Voice messages
- [ ] Video messages
- [ ] Location sharing
- [ ] Contact sharing
- [ ] Polls in groups
- [ ] Scheduled messages

---

**All APIs are fully integrated and working! 🚀**
