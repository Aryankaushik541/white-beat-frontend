# 🎯 White Beat - AI Platform Frontend

<div align="center">

![White Beat](https://img.shields.io/badge/White%20Beat-AI%20Platform-blueviolet?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2-61dafb?style=for-the-badge&logo=react)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Modern AI-Powered Intelligence Platform with Stunning UI**

[Live Demo](#) • [Backend Repo](https://github.com/Aryankaushik541/white-beat-backend) • [Deployment Guide](./DEPLOYMENT.md)

</div>

---

## ✨ Features

- 🔐 **Unified Smart Login** - Single login page with intelligent routing
  - Admin credentials → Admin Dashboard
  - User credentials → User Dashboard
  
- 👤 **User Dashboard**
  - AI Chat Interface with OpenAI integration
  - Real-time message streaming
  - Usage statistics
  - Modern glassmorphism design

- 👨‍💼 **Admin Dashboard**
  - Comprehensive analytics overview
  - User management system
  - API request logs viewer
  - OpenAI configuration settings
  - Beautiful data visualizations

- 🎨 **Unique Design**
  - Glassmorphism effects
  - Gradient animations
  - Responsive layout
  - Dark theme optimized
  - Smooth transitions

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Backend API running (see [backend repo](https://github.com/Aryankaushik541/white-beat-backend))

### Installation

```bash
# Clone repository
git clone https://github.com/Aryankaushik541/white-beat-frontend.git
cd white-beat-frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env and set your backend URL
# REACT_APP_API_URL=http://localhost:8000/api

# Start development server
npm start
```

Visit **http://localhost:3000**

---

## 🔑 Login Credentials

### Admin Access
```
Username: admin
Password: admin123
→ Redirects to Admin Dashboard
```

### User Access
```
Username: any username
Password: any password
→ Redirects to User Dashboard
```

---

## 📁 Project Structure

```
white-beat-frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Login.js              # Login page with smart routing
│   │   ├── Login.css
│   │   ├── UserDashboard.js      # User chat interface
│   │   ├── UserDashboard.css
│   │   ├── AdminDashboard.js     # Admin management panel
│   │   └── AdminDashboard.css
│   ├── App.js                    # Main app with routing
│   ├── App.css                   # Global styles
│   ├── index.js
│   └── index.css
├── package.json
├── .env.example
└── README.md
```

---

## 🎨 Design Highlights

### Glassmorphism UI
- Frosted glass effect with backdrop blur
- Subtle transparency and borders
- Layered depth with shadows

### Color Palette
- Primary Gradient: `#667eea → #764ba2`
- Background: `#0a0a0a → #1a1a2e`
- Glass: `rgba(255, 255, 255, 0.05)`

### Animations
- Smooth fade-in transitions
- Pulsing logo effect
- Animated wave backgrounds
- Hover state transformations

---

## 🛠️ Tech Stack

- **React 18** - UI library
- **React Router v6** - Client-side routing
- **Axios** - HTTP client for API calls
- **CSS3** - Custom styling with modern features
- **Google Fonts (Inter)** - Typography

---

## 📦 Available Scripts

```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run eject      # Eject from Create React App
```

---

## 🌐 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions for:
- Vercel (Recommended)
- Netlify
- GitHub Pages

**Quick Deploy to Vercel:**
```bash
npm install -g vercel
vercel
```

---

## 🔗 API Integration

The frontend connects to the Django backend API:

### Endpoints Used
- `POST /api/login/` - Authentication
- `POST /api/chat/` - AI chat messages
- `GET /api/admin/stats/` - Admin statistics

### Environment Variables
```env
REACT_APP_API_URL=https://your-backend-url.com/api
```

---

## 📸 Screenshots

### Login Page
Beautiful glassmorphism login with animated background

### User Dashboard
AI chat interface with real-time responses

### Admin Dashboard
Comprehensive analytics and management tools

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🔗 Related Repositories

- **Backend:** [white-beat-backend](https://github.com/Aryankaushik541/white-beat-backend)
- **Frontend:** [white-beat-frontend](https://github.com/Aryankaushik541/white-beat-frontend)

---

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check the [Deployment Guide](./DEPLOYMENT.md)

---

<div align="center">

**Built with ❤️ using React and Modern Web Technologies**

⭐ Star this repo if you find it helpful!

</div>