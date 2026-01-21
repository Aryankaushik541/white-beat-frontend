# ⚡ White Beat - Quick Start Guide

Get up and running in **10 minutes**!

---

## 🎯 What You're Building

A full-stack AI platform with:
- ✅ Beautiful login page with smart routing
- ✅ User dashboard with AI chat
- ✅ Admin dashboard with analytics
- ✅ OpenAI GPT-3.5 integration

---

## 📦 Prerequisites

Install these first:
- [Node.js 16+](https://nodejs.org/) (includes npm)
- [Python 3.11+](https://www.python.org/)
- [Git](https://git-scm.com/)
- [OpenAI API Key](https://platform.openai.com/api-keys) (optional for testing)

---

## 🚀 Setup (10 Minutes)

### Step 1: Clone Repositories (1 min)

```bash
# Create project folder
mkdir white-beat-project
cd white-beat-project

# Clone both repos
git clone https://github.com/Aryankaushik541/white-beat-frontend.git
git clone https://github.com/Aryankaushik541/white-beat-backend.git
```

### Step 2: Setup Backend (4 mins)

```bash
cd white-beat-backend

# Create virtual environment
python -m venv venv

# Activate it
source venv/bin/activate  # Mac/Linux
# OR
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env (optional - works without OpenAI key)
# Add: OPENAI_API_KEY=sk-your-key-here

# Setup database
python manage.py migrate

# Start server
python manage.py runserver
```

✅ Backend running at **http://localhost:8000**

### Step 3: Setup Frontend (3 mins)

Open a **NEW terminal window**:

```bash
cd white-beat-project/white-beat-frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm start
```

✅ Frontend running at **http://localhost:3000**

### Step 4: Test It! (2 mins)

1. **Open browser:** http://localhost:3000

2. **Login as Admin:**
   - Username: `admin`
   - Password: `admin123`
   - You'll see the Admin Dashboard! 🎉

3. **Login as User:**
   - Username: `testuser` (any username)
   - Password: `password` (any password)
   - You'll see the User Dashboard with AI chat! 💬

---

## 🎨 What You'll See

### Login Page
- Beautiful glassmorphism design
- Animated wave background
- Pulsing logo

### User Dashboard
- AI chat interface
- Real-time responses
- Usage statistics

### Admin Dashboard
- Analytics overview
- User management
- API logs
- Settings panel

---

## 🔑 Login Credentials

### Admin Access
```
Username: admin
Password: admin123
→ Admin Dashboard
```

### User Access
```
Username: anything
Password: anything
→ User Dashboard
```

---

## 🛠️ Common Issues & Fixes

### Backend won't start
```bash
# Make sure virtual environment is activated
source venv/bin/activate  # Mac/Linux
venv\Scripts\activate     # Windows

# Reinstall dependencies
pip install -r requirements.txt
```

### Frontend won't start
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### CORS errors
- Make sure backend is running on port 8000
- Check `.env` in frontend has correct API URL

### OpenAI not working
- It's optional! App works without it
- To enable: Add `OPENAI_API_KEY` to backend `.env`

---

## 📁 Project Structure

```
white-beat-project/
├── white-beat-frontend/          # React app
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.js         # Login page
│   │   │   ├── UserDashboard.js # User chat
│   │   │   └── AdminDashboard.js # Admin panel
│   │   └── App.js               # Main app
│   └── package.json
│
└── white-beat-backend/           # Django API
    ├── api/
    │   ├── views.py             # API endpoints
    │   └── urls.py              # Routes
    ├── whitebeat_backend/
    │   └── settings.py          # Config
    └── manage.py
```

---

## 🌐 Next Steps

### 1. Customize the Design
Edit these files:
- `src/components/Login.css` - Login page styles
- `src/components/UserDashboard.css` - User dashboard
- `src/components/AdminDashboard.css` - Admin dashboard

### 2. Add OpenAI Integration
1. Get API key from [OpenAI](https://platform.openai.com/api-keys)
2. Add to `white-beat-backend/.env`:
   ```
   OPENAI_API_KEY=sk-your-key-here
   ```
3. Restart backend server
4. Test chat in User Dashboard!

### 3. Deploy to Production
See [DEPLOYMENT.md](./DEPLOYMENT.md) for:
- Vercel (Frontend)
- Heroku (Backend)
- Railway (Backend)
- Render (Backend)

---

## 📚 Learn More

- [Full Documentation](./README.md)
- [Project Overview](./PROJECT_OVERVIEW.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Backend Docs](https://github.com/Aryankaushik541/white-beat-backend)

---

## 🆘 Need Help?

1. Check [Common Issues](#-common-issues--fixes) above
2. Read the [Full README](./README.md)
3. Open an [Issue on GitHub](https://github.com/Aryankaushik541/white-beat-frontend/issues)

---

## 🎉 You're All Set!

You now have a fully functional AI platform running locally!

**What to try:**
- ✅ Login as admin and explore the dashboard
- ✅ Login as user and chat with AI
- ✅ Customize the colors and design
- ✅ Add your OpenAI key for real AI responses
- ✅ Deploy to production

---

<div align="center">

**Happy Coding! 🚀**

[⭐ Star on GitHub](https://github.com/Aryankaushik541/white-beat-frontend) if this helped you!

</div>