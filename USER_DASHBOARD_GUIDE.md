# 📊 User Dashboard - Complete Guide

The **User Dashboard** is your central hub for managing all White Beat features including profile, contacts, groups, calls, status updates, and admin functions.

---

## 🎯 Overview

After logging in, users are directed to the **Dashboard** (`/dashboard`) which provides:

- **Overview**: Quick stats and profile summary
- **Profile**: Manage your personal information
- **Contacts**: Add and manage contacts
- **Groups**: Create and manage group chats
- **Calls**: View call history and make calls
- **Status**: Share and view status updates
- **Admin**: Admin panel (for admin users only)

---

## 🚀 Features

### 1️⃣ **Overview Section**

**What you see:**
- 📊 Statistics cards showing:
  - Total Contacts
  - Total Groups
  - Total Calls
  - Total Statuses
- 👤 Profile summary with avatar and bio
- 🔐 Admin badge (if you're an admin)

**Quick Actions:**
- Click "Open Admin Panel" to access admin features

---

### 2️⃣ **Profile Section**

**View Mode:**
- Large profile avatar
- Full name and username
- Email and phone number
- Bio and status message
- Online/offline status
- Last seen timestamp

**Edit Mode:**
- ✏️ Click "Edit Profile" button
- Update:
  - Full Name
  - Bio
  - Status Message
  - Avatar URL
- 💾 Click "Save Changes" to update

**API Used:**
```javascript
GET /api/user-profile/?username={username}
POST /api/update-profile/
```

---

### 3️⃣ **Contacts Section**

**Features:**
- View all your contacts in a grid
- See online/offline status with green/gray dot
- View nicknames and last seen
- Favorite contacts marked with ⭐

**Add Contact:**
1. Click "➕ Add Contact" button
2. Search for users by name/username
3. Click "➕ Add" next to user
4. Contact added instantly!

**Contact Card Shows:**
- Avatar (or initial if no avatar)
- Full name and username
- Nickname (if set)
- Online status or last seen
- Favorite badge

**API Used:**
```javascript
GET /api/contacts/?username={username}
GET /api/users/?username={username}&search={query}
POST /api/add-contact/
```

---

### 4️⃣ **Groups Section**

**Features:**
- View all groups you're part of
- See member count
- Unread message badges
- Group descriptions

**Create Group:**
1. Click "➕ Create Group" button
2. Enter group name (required)
3. Add description (optional)
4. Click "✅ Create Group"
5. Group created instantly!

**Group Card Shows:**
- Group avatar (👥 icon or custom)
- Group name
- Description
- Member count
- Unread message count

**API Used:**
```javascript
GET /api/groups/?username={username}
POST /api/create-group/
POST /api/add-group-member/
POST /api/remove-group-member/
```

---

### 5️⃣ **Calls Section**

**Features:**
- Complete call history
- Incoming/outgoing indicators
- Call duration
- Call status (completed, missed, rejected)
- Audio and video call icons

**Make a Call:**
1. Click "📞 Make Call" button
2. Select contact from dropdown
3. Choose call type:
   - 📞 Voice Call
   - 📹 Video Call
4. Click "📞 Call Now"
5. Call initiated!

**Call Item Shows:**
- Call type icon (📞 audio / 📹 video)
- Contact name
- Incoming/outgoing direction
- Date and time
- Call status with color coding:
  - ✅ Completed (green)
  - ❌ Missed (red)
  - 🚫 Rejected (yellow)
- Call duration

**API Used:**
```javascript
GET /api/call-history/?username={username}
POST /api/initiate-call/
POST /api/update-call-status/
```

---

### 6️⃣ **Status Section**

**Features:**
- View all status updates from contacts
- Status ring animation around avatars
- View count tracking
- 24-hour expiry

**Create Status:**
1. Click "➕ Add Status" button
2. Select status type:
   - 📝 Text
   - 🖼️ Image
   - 🎥 Video
3. Enter content
4. Choose privacy:
   - 🌍 Everyone
   - 👥 Contacts Only
   - 🔒 Selected Contacts
5. Click "✅ Post Status"

**Status Display:**
- Grouped by user
- Animated status ring
- Click to view (auto-tracks views)
- Shows view count and timestamp

**API Used:**
```javascript
GET /api/statuses/?username={username}
POST /api/create-status/
POST /api/view-status/
```

---

### 7️⃣ **Admin Section** (Admin Users Only)

**Features:**
- 📊 System statistics:
  - Total Users
  - Total Messages
  - Total Groups
  - Total Calls
  - Active Users
- 📈 Recent activity feed
- 🛠️ Admin actions:
  - Manage Users
  - Manage Admins
  - View Reports
  - System Settings

**Admin Stats:**
- Real-time platform metrics
- Activity monitoring
- User management tools

**API Used:**
```javascript
POST /api/verify-admin/
GET /api/admin-stats/?username={username}
POST /api/make-admin/
POST /api/remove-admin/
```

---

## 🎨 Design Features

### **Modern UI:**
- Glass morphism effects
- Gradient backgrounds
- Smooth animations
- Responsive design

### **Color Scheme:**
- Primary: Purple gradient (#667eea → #764ba2)
- Success: Green (#25d366)
- Error: Red (#ff4757)
- Background: White with blur

### **Animations:**
- Fade in on section load
- Hover effects on cards
- Pulse animation on online status
- Smooth transitions

### **Icons:**
- 📊 Overview
- 👤 Profile
- 👥 Contacts
- 👨‍👩‍👧‍👦 Groups
- 📞 Calls
- 📸 Status
- 🔐 Admin

---

## 📱 Responsive Design

**Desktop (1024px+):**
- Sidebar on left
- Main content on right
- Grid layouts for cards

**Tablet (768px-1024px):**
- Sidebar becomes horizontal tabs
- Single column layouts
- Optimized spacing

**Mobile (< 768px):**
- Full-width components
- Stacked layouts
- Touch-friendly buttons
- Simplified navigation

---

## 🔄 Data Flow

### **On Load:**
1. Check user authentication
2. Load profile data
3. Fetch contacts
4. Fetch groups
5. Fetch call history
6. Fetch statuses
7. Check admin status
8. Calculate statistics

### **Real-time Updates:**
- Profile changes reflect immediately
- New contacts appear instantly
- Group creation updates list
- Call history refreshes
- Status updates show live

---

## 🎯 Navigation

**Sidebar Menu:**
- Click any menu item to switch sections
- Active section highlighted in purple
- Badge counts on relevant items
- Smooth section transitions

**Top Navigation:**
- Brand logo and name
- Username display
- Admin badge (if admin)
- Logout button

---

## 💡 Usage Tips

### **Profile:**
- Keep your bio updated
- Use a clear avatar URL
- Set a fun status message
- Update regularly

### **Contacts:**
- Search before adding
- Use nicknames for organization
- Mark favorites with ⭐
- Check online status

### **Groups:**
- Use descriptive names
- Add clear descriptions
- Manage members carefully
- Monitor unread counts

### **Calls:**
- Check call history regularly
- Use video for important calls
- Monitor call durations
- Review missed calls

### **Status:**
- Post daily updates
- Use privacy settings
- Keep content appropriate
- Check view counts

### **Admin:**
- Monitor system stats
- Review recent activity
- Manage users carefully
- Use admin powers responsibly

---

## 🔐 Security

**Profile Privacy:**
- Control who sees your profile
- Manage status visibility
- Set last seen privacy

**Data Protection:**
- Secure API calls
- Encrypted connections
- Session management
- Logout on exit

---

## 🚀 Quick Start

1. **Login** at `/`
2. **Redirected** to `/dashboard`
3. **Explore** sections via sidebar
4. **Update** your profile
5. **Add** contacts
6. **Create** groups
7. **Make** calls
8. **Post** status
9. **Manage** (if admin)

---

## 📊 Statistics Tracking

**Auto-calculated:**
- Total contacts count
- Total groups count
- Total calls count
- Total statuses count

**Updates when:**
- Adding/removing contacts
- Creating groups
- Making calls
- Posting status

---

## 🎨 Customization

**Themes:**
- Purple gradient (default)
- Glass morphism effects
- Smooth animations
- Modern design

**Layout:**
- Sidebar navigation
- Grid-based cards
- Responsive breakpoints
- Touch-friendly

---

## 🔧 Technical Details

**State Management:**
```javascript
- activeSection: Current view
- profile: User profile data
- contacts: Contact list
- groups: Group list
- callHistory: Call records
- statuses: Status updates
- isAdmin: Admin status
- stats: Dashboard statistics
```

**API Integration:**
- RESTful endpoints
- Axios for requests
- Error handling
- Loading states

**Performance:**
- Lazy loading
- Optimized renders
- Efficient state updates
- Minimal re-renders

---

## 🎯 Best Practices

1. **Keep profile updated** - Fresh info helps contacts
2. **Organize contacts** - Use nicknames and favorites
3. **Manage groups** - Clear names and descriptions
4. **Review calls** - Check history regularly
5. **Post status** - Stay connected with updates
6. **Use admin wisely** - Responsible management

---

## 🐛 Troubleshooting

**Profile not loading?**
- Check internet connection
- Refresh the page
- Re-login if needed

**Can't add contacts?**
- Verify username exists
- Check if already added
- Try searching again

**Groups not showing?**
- Refresh the page
- Check group membership
- Verify API connection

**Calls not working?**
- Check contact availability
- Verify permissions
- Test connection

**Status not posting?**
- Check content length
- Verify privacy settings
- Try again

---

## 📚 Related Documentation

- [README.md](README.md) - Project overview
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Installation guide
- [FEATURES_GUIDE.md](FEATURES_GUIDE.md) - All features
- [API_INTEGRATION.md](API_INTEGRATION.md) - API reference

---

## 🎉 Enjoy Your Dashboard!

The User Dashboard is your command center for all White Beat features. Explore, connect, and communicate with ease!

**Happy chatting! 💬✨**
