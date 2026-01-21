# 💬 White Beat Frontend - Full Featured Chat Platform

<div align="center">

![React](https://img.shields.io/badge/React-18.2-61dafb?style=for-the-badge&logo=react)
![Axios](https://img.shields.io/badge/Axios-1.6-5a29e4?style=for-the-badge)
![Router](https://img.shields.io/badge/React_Router-6.20-ca4245?style=for-the-badge&logo=react-router)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**React Frontend for Full-Featured Messaging Platform (WhatsApp + Telegram Features)**

[Backend Repo](https://github.com/Aryankaushik541/white-beat-backend) • [Live Demo](#) • [Documentation](#features)

</div>

---

## ✨ Features

### 💬 Messaging
- ✅ **Direct Messaging** - One-on-one chat with users
- ✅ **Group Chat** - Create and manage group conversations
- ✅ **Message Types** - Text, images, videos, audio, documents
- ✅ **Message Reactions** - React with 6 emoji types (👍 ❤️ 😂 😮 😢 😠)
- ✅ **Reply to Messages** - Quote and reply to specific messages
- ✅ **Edit Messages** - Edit sent messages with indicator
- ✅ **Delete Messages** - Delete for yourself or everyone
- ✅ **Read Receipts** - See when messages are read (✓✓)
- ✅ **Real-time Updates** - Live message delivery

### 👥 Groups
- ✅ **Create Groups** - Start group chats with multiple members
- ✅ **Group Management** - Add/remove members
- ✅ **Group Info** - Name, description, avatar
- ✅ **Member List** - See all group members
- ✅ **Admin Controls** - Manage group settings

### 📞 Calls
- ✅ **Voice Calls** - One-on-one audio calls
- ✅ **Video Calls** - One-on-one video calls
- ✅ **Group Calls** - Conference calls
- ✅ **Call History** - View past calls with duration
- ✅ **Call Status** - Track call states

### 📸 Status Updates
- ✅ **24-Hour Stories** - WhatsApp-like status updates
- ✅ **Text Status** - Text with custom backgrounds
- ✅ **Image Status** - Share photos as status
- ✅ **Video Status** - Share videos as status
- ✅ **View Tracking** - See who viewed your status

### 👤 User Features
- ✅ **User Profiles** - Avatar, bio, status message
- ✅ **Online Status** - Real-time online/offline indicator
- ✅ **Contact Management** - Add and manage contacts
- ✅ **Search** - Search conversations and contacts
- ✅ **Favorites** - Mark favorite contacts

### 🎨 UI/UX
- ✅ **Modern Design** - WhatsApp-inspired interface
- ✅ **Responsive** - Works on desktop and mobile
- ✅ **Smooth Animations** - Polished transitions
- ✅ **Glass Morphism** - Beautiful glassmorphic effects
- ✅ **Dark Patterns** - Elegant color schemes

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Backend server running (see [backend repo](https://github.com/Aryankaushik541/white-beat-backend))

### Installation

```bash
# Clone repository
git clone https://github.com/Aryankaushik541/white-beat-frontend.git
cd white-beat-frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your backend URL
# REACT_APP_API_URL=http://localhost:8000/api

# Start development server
npm start
```

Visit **http://localhost:3000** to see the app

---

## 📁 Project Structure

```
white-beat-frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Login.js              # Login/Signup component
│   │   ├── Login.css             # Login styles
│   │   ├── ChatDashboard.js      # Main chat interface
│   │   ├── ChatDashboard.css     # Chat styles
│   │   ├── AdminDashboard.js     # Admin panel
│   │   └── AdminDashboard.css    # Admin styles
│   ├── App.js                    # Main app component
│   ├── App.css                   # Global styles
│   ├── index.js                  # Entry point
│   └── index.css                 # Base styles
├── package.json
├── .env.example
└── README.md
```

---

## 🎯 Main Components

### ChatDashboard
The main messaging interface with:
- **Sidebar**: Tabs for chats, groups, calls, status, contacts
- **Chat Area**: Message display and input
- **User List**: Start new conversations
- **Search**: Find conversations and contacts

### Login
Authentication component with:
- **Login Form**: Username and password
- **Signup Form**: Create new account
- **Demo Credentials**: Quick access for testing
- **Feature Preview**: Showcase platform features

### AdminDashboard
Admin panel with:
- **Statistics**: User and activity metrics
- **User Management**: View and manage users
- **System Monitoring**: API logs and performance

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:8000/api
```

For production:
```env
REACT_APP_API_URL=https://your-backend-url.com/api
```

---

## 📱 Features Breakdown

### Chat Interface

**Sidebar Tabs:**
- 💬 **Chats** - All conversations
- 👥 **Groups** - Group chats
- 📞 **Calls** - Call history
- 📸 **Status** - Status updates
- 📇 **Contacts** - Contact list

**Message Features:**
- Send text messages
- React with emojis
- Reply to messages
- Delete messages
- Edit messages
- View read status
- See typing indicators

**Chat Actions:**
- Start voice call
- Start video call
- View user profile
- Search messages
- Archive chat
- Mute notifications

---

## 🎨 Design System

### Colors
- **Primary**: `#667eea` (Purple)
- **Secondary**: `#764ba2` (Dark Purple)
- **Success**: `#25d366` (Green)
- **Error**: `#ff4757` (Red)
- **Background**: `#e5ddd5` (Light Beige)

### Typography
- **Font Family**: Segoe UI, Tahoma, Geneva, Verdana, sans-serif
- **Headings**: 16-32px, Bold
- **Body**: 14px, Regular
- **Small**: 12px, Regular

### Components
- **Glass Cards**: Glassmorphism effect
- **Rounded Corners**: 8-16px border radius
- **Shadows**: Subtle elevation
- **Animations**: Smooth 0.3s transitions

---

## 📊 State Management

The app uses React hooks for state management:

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
```

---

## 🔌 API Integration

### Axios Configuration

```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Example API call
const fetchConversations = async () => {
  const response = await axios.get(`${API_URL}/conversations/`, {
    params: { username: user.username }
  });
  setConversations(response.data.conversations);
};
```

### Key Endpoints Used

- `POST /api/login/` - User authentication
- `POST /api/signup/` - User registration
- `GET /api/conversations/` - Get conversations
- `GET /api/messages/` - Get messages
- `POST /api/send-message/` - Send message
- `GET /api/groups/` - Get groups
- `GET /api/statuses/` - Get statuses
- `GET /api/call-history/` - Get call history

---

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

---

## 🏗️ Build & Deploy

### Build for Production

```bash
# Create optimized production build
npm run build

# The build folder is ready to be deployed
# You can serve it with a static server
```

### Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=build
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Deploy to GitHub Pages

```bash
# Add homepage to package.json
"homepage": "https://yourusername.github.io/white-beat-frontend"

# Install gh-pages
npm install --save-dev gh-pages

# Add deploy scripts to package.json
"predeploy": "npm run build",
"deploy": "gh-pages -d build"

# Deploy
npm run deploy
```

---

## 🔒 Security

- ✅ HTTPS in production
- ✅ Environment variables for sensitive data
- ✅ Input validation
- ✅ XSS protection
- ✅ CORS configuration
- ✅ Secure authentication

---

## 📝 Available Scripts

```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run eject      # Eject from Create React App
```

---

## 🎯 Roadmap

- [ ] WebSocket for real-time messaging
- [ ] Push notifications
- [ ] File upload with progress
- [ ] Voice message recording
- [ ] Video message recording
- [ ] Message search
- [ ] Dark mode
- [ ] Custom themes
- [ ] Multi-language support
- [ ] Offline mode
- [ ] PWA support
- [ ] Desktop app (Electron)

---

## 🐛 Known Issues

- Real-time updates require manual refresh (WebSocket coming soon)
- File upload limited to URLs (direct upload coming soon)
- Mobile responsiveness needs improvement

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

MIT License - see LICENSE file for details

---

## 👨‍💻 Author

**Aryan Kaushik**
- GitHub: [@Aryankaushik541](https://github.com/Aryankaushik541)
- Backend: [white-beat-backend](https://github.com/Aryankaushik541/white-beat-backend)

---

## 📞 Support

For issues or questions:
- GitHub Issues: [Create an issue](https://github.com/Aryankaushik541/white-beat-frontend/issues)
- Backend Repo: [white-beat-backend](https://github.com/Aryankaushik541/white-beat-backend)

---

## 🙏 Acknowledgments

- Inspired by WhatsApp and Telegram
- Built with React and Create React App
- Icons from Unicode emoji
- Design inspired by modern messaging apps

---

<div align="center">

**Made with ❤️ using React**

⭐ Star this repo if you find it helpful!

[Backend](https://github.com/Aryankaushik541/white-beat-backend) • [Frontend](https://github.com/Aryankaushik541/white-beat-frontend) • [Issues](https://github.com/Aryankaushik541/white-beat-frontend/issues)

</div>
