# 🚀 White Beat - Complete Setup Guide

Your complete guide to setup and use White Beat platform with all features!

---

## 🎯 **What is White Beat?**

White Beat is an **AI-Powered Intelligence Platform** with:
- 🤖 **Local AI Chat** (No OpenAI API needed!)
- 🔍 **OSINT Intelligence** Gathering
- 👤 **User Signup** System
- 🔐 **Admin Dashboard** with full control
- 🎨 **Beautiful Glassmorphism UI**

---

## ✨ **Features**

### **For All Users:**
- ✅ AI Chat (ChatGPT-like experience)
- ✅ OSINT Lookup (Username, Email, IP, Domain)
- ✅ Message History
- ✅ Beautiful UI with animations
- ✅ Responsive design

### **For Admins:**
- ✅ All user features
- ✅ User management
- ✅ System statistics
- ✅ API logs monitoring
- ✅ Revenue tracking
- ✅ Promote users to admin

---

## 🚀 **Quick Setup (10 Minutes)**

### **Step 1: Backend Setup**

```bash
# Clone and navigate
cd white-beat-backend
git pull origin main

# Activate virtual environment
source venv/bin/activate  # Mac/Linux
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# This installs:
# - Django & DRF
# - Transformers (Local AI)
# - Torch (PyTorch)
# - Requests, BeautifulSoup (OSINT)
# - DNSPython (DNS lookups)

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser (for admin access)
python manage.py createsuperuser
# Username: admin
# Email: admin@whitebeat.com
# Password: (your secure password)

# Start server
python manage.py runserver
```

**First startup:**
- Downloads AI model (~355MB)
- Takes 5-10 minutes
- Only happens once!

### **Step 2: Frontend Setup**

```bash
# In new terminal
cd white-beat-frontend
git pull origin main

# Install dependencies (if needed)
npm install

# Start development server
npm start
```

**Opens:** http://localhost:3000

---

## 👤 **User Access**

### **Signup:**
```
1. Go to http://localhost:3000
2. Click "Sign Up" button
3. Enter:
   - Username: your_username
   - Email: your@email.com (optional)
   - Password: your_password
4. Click "Sign Up"
5. Success message appears
6. Click "Login" to switch to login mode
7. Login with your credentials
8. → Redirected to User Dashboard
```

### **Features:**
- ✅ AI Chat with local model
- ✅ OSINT intelligence lookup
- ✅ Message history
- ✅ Beautiful chat interface
- ✅ Model badges (Demo/Production)

---

## 🔐 **Admin Access**

### **Create Admin:**
```bash
# In backend directory
python manage.py createsuperuser

# Enter details:
Username: admin
Email: admin@whitebeat.com
Password: ********
```

### **Login as Admin:**
```
1. Go to http://localhost:3000
2. Enter superuser credentials
3. Click "Login"
4. → Redirected to Admin Dashboard
```

### **Admin Features:**
- ✅ All user features
- ✅ System statistics dashboard
- ✅ User management
- ✅ API logs monitoring
- ✅ Revenue tracking
- ✅ User growth charts
- ✅ API usage charts
- ✅ Promote users to admin

---

## 🤖 **AI Chat**

### **How it Works:**
```
1. Type message in chat
2. AI processes using local model
3. Response generated (1-3 seconds)
4. No API keys needed!
5. Works offline (after model download)
```

### **Available Models:**

**DialoGPT (Default):**
- Size: 355MB
- Speed: Fast
- Quality: Good
- Best for: General chat

**BlenderBot:**
- Size: 400MB
- Speed: Medium
- Quality: Excellent
- Best for: Natural conversations

**FLAN-T5:**
- Size: 250MB
- Speed: Fast
- Quality: Very Good
- Best for: Task-oriented chat

### **Change Model:**
Edit `api/ai_engine.py` line 200:
```python
ai_engine_type = "dialogpt"     # Default
ai_engine_type = "blenderbot"   # Better
ai_engine_type = "flan-t5"      # Task-oriented
```

---

## 🔍 **OSINT Features**

### **Username Search:**
```
Query: username
Searches: GitHub, Twitter, Instagram, Reddit, 
          LinkedIn, Medium, Dev.to, StackOverflow
Returns: Profile existence, URLs
```

### **Email Lookup:**
```
Query: email@example.com
Returns: Format validation, Domain check, MX records
```

### **IP Geolocation:**
```
Query: 8.8.8.8
Returns: Country, Region, City, ISP, Lat/Long, Timezone
```

### **Domain Info:**
```
Query: example.com
Returns: DNS records (A, MX, NS), Accessibility, Status
```

### **GitHub Profile:**
```
Query: username
Returns: Name, Bio, Location, Repos, Followers, Company
```

---

## 🎨 **UI Features**

### **Login/Signup Page:**
- ✅ Toggle between Login and Signup
- ✅ Animated gradient background
- ✅ Glassmorphism cards
- ✅ Pulsing logo animation
- ✅ Wave animations
- ✅ Success/Error messages
- ✅ Info cards for user/admin
- ✅ Admin info button
- ✅ Responsive design

### **User Dashboard:**
- ✅ Glass navigation bar
- ✅ Sidebar with stats
- ✅ Beautiful chat interface
- ✅ Message bubbles
- ✅ Typing indicator
- ✅ Model badges
- ✅ Smooth animations
- ✅ Custom scrollbar

### **Admin Dashboard:**
- ✅ Glass sidebar navigation
- ✅ Animated stat cards
- ✅ Interactive charts
- ✅ Data tables
- ✅ Status badges
- ✅ Quick actions
- ✅ Real-time updates
- ✅ Responsive grid

---

## 📊 **API Endpoints**

### **Authentication:**
```
POST /api/signup/          - Create user account
POST /api/login/           - Login (admin or user)
POST /api/verify-admin/    - Check admin status
POST /api/make-admin/      - Promote user to admin
```

### **Features:**
```
POST /api/chat/            - AI chat
POST /api/osint/           - OSINT lookup
GET  /api/admin/stats/     - Admin statistics
GET  /api/health/          - System health
```

---

## 🧪 **Testing**

### **Test 1: Health Check**
```bash
curl http://localhost:8000/api/health/
```

### **Test 2: User Signup**
```bash
curl -X POST http://localhost:8000/api/signup/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "testpass123",
    "email": "test@example.com"
  }'
```

### **Test 3: User Login**
```bash
curl -X POST http://localhost:8000/api/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "testpass123"
  }'
```

### **Test 4: AI Chat**
```bash
curl -X POST http://localhost:8000/api/chat/ \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Hello! How are you?",
    "username": "testuser"
  }'
```

### **Test 5: OSINT Lookup**
```bash
curl -X POST http://localhost:8000/api/osint/ \
  -H "Content-Type: application/json" \
  -d '{
    "query": "torvalds",
    "type": "username"
  }'
```

---

## 🔒 **Security**

### **Password Security:**
- ✅ Automatic password hashing
- ✅ Django's built-in authentication
- ✅ Secure password validation

### **Admin Security:**
- ✅ Only superusers can make admins
- ✅ Password required for admin actions
- ✅ Role-based access control

### **API Security:**
- ✅ Input validation
- ✅ Error handling
- ✅ Request logging
- ✅ IP tracking

---

## 📈 **Performance**

### **AI Response Times:**
- **CPU:** 1-3 seconds
- **GPU:** 0.5-1 second (10x faster!)

### **OSINT Response Times:**
- **Username:** 2-5 seconds
- **Email:** 1-2 seconds
- **IP:** 1-2 seconds
- **Domain:** 2-3 seconds

### **First Startup:**
- Downloads AI model (~355MB)
- Takes 5-10 minutes
- Only happens once!

---

## 🐛 **Troubleshooting**

### **Issue 1: AI model not downloading**
```bash
# Manual download
python -c "from transformers import AutoModelForCausalLM, AutoTokenizer; AutoTokenizer.from_pretrained('microsoft/DialoGPT-medium'); AutoModelForCausalLM.from_pretrained('microsoft/DialoGPT-medium')"
```

### **Issue 2: Out of memory**
```python
# Use smaller model in api/ai_engine.py
ai_engine.initialize("distilgpt2")  # Only 82MB
```

### **Issue 3: Signup fails**
```bash
# Check database
python manage.py migrate

# Check if username exists
python manage.py shell
>>> from django.contrib.auth.models import User
>>> User.objects.filter(username='username').exists()
```

### **Issue 4: Can't create superuser**
```bash
# Make sure migrations are done
python manage.py migrate

# Try again
python manage.py createsuperuser
```

---

## 📚 **Documentation**

1. **SIGNUP_ADMIN_GUIDE.md** - Signup and admin access
2. **LOCAL_AI_OSINT_SETUP.md** - AI and OSINT setup
3. **DJANGO_ADMIN_AUTH.md** - Admin authentication
4. **BEAUTIFUL_UI_UPDATE.md** - UI design guide

---

## 🎯 **User Roles**

### **Regular User:**
```
Creation: Signup page
Dashboard: User Dashboard
Features: AI Chat, OSINT
Access: Limited
```

### **Admin User:**
```
Creation: Django createsuperuser
Dashboard: Admin Dashboard
Features: All + Management
Access: Full control
```

---

## 🎉 **Summary**

**Your White Beat platform has:**
- ✅ **Local AI** - No OpenAI API needed!
- ✅ **OSINT** - Intelligence gathering
- ✅ **User Signup** - Easy registration
- ✅ **Admin Control** - Full management
- ✅ **Beautiful UI** - Glassmorphism design
- ✅ **Free & Offline** - No API costs
- ✅ **Secure** - Password hashing, role-based access
- ✅ **Fast** - Optimized performance

---

## 🚀 **Quick Commands**

### **Backend:**
```bash
cd white-beat-backend
git pull origin main
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### **Frontend:**
```bash
cd white-beat-frontend
git pull origin main
npm start
```

### **Test:**
```bash
curl http://localhost:8000/api/health/
```

---

## 📞 **Support**

### **Common Questions:**

**Q: How to create admin?**
A: `python manage.py createsuperuser`

**Q: How to signup as user?**
A: Click "Sign Up" on login page

**Q: How to change AI model?**
A: Edit `api/ai_engine.py` line 200

**Q: How to use OSINT?**
A: POST to `/api/osint/` with query

**Q: How to promote user to admin?**
A: Use `/api/make-admin/` endpoint

---

<div align="center">

**🎉 Everything is Ready! 🎉**

**Signup → Login → Chat → OSINT → Admin**

**Local AI + OSINT + Beautiful UI = White Beat! 🚀**

</div>