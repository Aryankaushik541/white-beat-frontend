# 🔧 Troubleshooting Guide - White Beat Frontend

## ❌ **Common Issues & Solutions**

---

## 🚨 **Issue 1: Login Not Working / Page Not Loading**

### **Symptoms:**
- Login button doesn't work
- Page stays blank
- No redirect after login
- Console shows errors

### **Solutions:**

#### **Step 1: Check Backend is Running**
```bash
# Open new terminal
cd white-beat-backend

# Start backend
python manage.py runserver

# Should show:
# Starting development server at http://127.0.0.1:8000/
```

**Verify backend is working:**
- Open browser: http://localhost:8000/admin
- Should see Django admin login page

---

#### **Step 2: Clean Install Frontend**
```bash
# Stop frontend (Ctrl+C)

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Clear npm cache
npm cache clean --force

# Fresh install
npm install

# Start again
npm start
```

---

#### **Step 3: Check Browser Console**
1. Open browser (Chrome/Firefox)
2. Press `F12` or `Ctrl+Shift+I`
3. Go to **Console** tab
4. Look for errors

**Common Errors & Fixes:**

**Error: "Cannot read property 'navigate' of undefined"**
```bash
# Fix: Update react-router-dom
npm install react-router-dom@latest
```

**Error: "Failed to fetch" or "Network Error"**
```bash
# Fix: Backend not running or CORS issue
# Check backend is running at http://localhost:8000
```

**Error: "Module not found"**
```bash
# Fix: Missing dependencies
npm install
```

---

#### **Step 4: Clear Browser Cache**
```
Chrome/Edge:
- Press Ctrl+Shift+Delete
- Select "Cached images and files"
- Click "Clear data"
- Hard refresh: Ctrl+Shift+R

Firefox:
- Press Ctrl+Shift+Delete
- Select "Cache"
- Click "Clear Now"
- Hard refresh: Ctrl+Shift+R
```

---

#### **Step 5: Check localStorage**
```javascript
// Open browser console (F12)
// Check if old data exists
console.log(localStorage.getItem('username'));
console.log(localStorage.getItem('isAdmin'));

// Clear if needed
localStorage.clear();

// Refresh page
location.reload();
```

---

#### **Step 6: Verify Backend API**

**Test Login API manually:**
```bash
# Using curl
curl -X POST http://localhost:8000/api/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Should return:
# {"success":true,"username":"admin","is_admin":true}
```

**Or use browser:**
1. Open http://localhost:8000/api/login/
2. Should see Django REST framework page

---

#### **Step 7: Create Test User in Backend**
```bash
cd white-beat-backend
python manage.py shell

# In Python shell:
from django.contrib.auth.models import User
from chat.models import UserProfile

# Create admin user
admin = User.objects.create_user('admin', 'admin@test.com', 'admin123')
admin.is_staff = True
admin.is_superuser = True
admin.save()

# Create profile
profile = UserProfile.objects.create(
    user=admin,
    role='admin',
    full_name='Admin User',
    bio='System Administrator'
)

print("Admin user created successfully!")
exit()
```

---

#### **Step 8: Check CORS Settings in Backend**

**File: `white-beat-backend/white_beat/settings.py`**

Should have:
```python
INSTALLED_APPS = [
    ...
    'corsheaders',
    ...
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Add this at top
    ...
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

CORS_ALLOW_CREDENTIALS = True
```

If missing, add and restart backend:
```bash
pip install django-cors-headers
python manage.py runserver
```

---

## 🚨 **Issue 2: CSS Not Loading / Styles Broken**

### **Symptoms:**
- Page looks plain/unstyled
- No colors or gradients
- Layout broken

### **Solutions:**

#### **Step 1: Hard Refresh**
```
Windows/Linux: Ctrl+Shift+R
Mac: Cmd+Shift+R
```

#### **Step 2: Check CSS Files Exist**
```bash
# In white-beat-frontend folder
ls -la src/components/Login.css
ls -la src/components/UserDashboard.css
ls -la src/App.css
ls -la src/index.css

# All should exist
```

#### **Step 3: Verify CSS Imports**

**Check `src/components/Login.js`:**
```javascript
import './Login.css';  // Should be present
```

**Check `src/App.js`:**
```javascript
import './App.css';  // Should be present
```

#### **Step 4: Restart Development Server**
```bash
# Stop server (Ctrl+C)
npm start
```

---

## 🚨 **Issue 3: "Cannot GET /dashboard" Error**

### **Symptoms:**
- Direct URL access shows error
- Refresh on dashboard shows blank page

### **Solution:**

This is normal for React Router. Always start from:
```
http://localhost:3000/
```

Then login to navigate to dashboard.

---

## 🚨 **Issue 4: Port Already in Use**

### **Symptoms:**
```
Something is already running on port 3000
```

### **Solutions:**

#### **Option 1: Kill Process**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

#### **Option 2: Use Different Port**
```bash
# Set port in package.json
"scripts": {
  "start": "PORT=3001 react-scripts start"
}

# Or run with:
PORT=3001 npm start
```

---

## 🚨 **Issue 5: Backend Connection Failed**

### **Symptoms:**
- "Cannot connect to server"
- "Network Error"
- Login fails with error message

### **Solutions:**

#### **Step 1: Check Backend URL**

**File: `src/components/Login.js`**
```javascript
// Should be:
const response = await fetch('http://localhost:8000/api/login/', {
  ...
});

// NOT:
// http://127.0.0.1:8000
// http://localhost:8080
```

#### **Step 2: Test Backend Directly**
```bash
# Open browser
http://localhost:8000/api/login/

# Should see Django REST page
```

#### **Step 3: Check Firewall**
```bash
# Windows: Allow Python through firewall
# Mac/Linux: Check if port 8000 is blocked
```

---

## 🚨 **Issue 6: Dashboard Shows "No Data"**

### **Symptoms:**
- Dashboard loads but shows empty
- No contacts, groups, etc.

### **Solution:**

**Create sample data in backend:**
```bash
cd white-beat-backend
python manage.py shell

from django.contrib.auth.models import User
from chat.models import Contact, Group, UserProfile

# Get admin user
admin = User.objects.get(username='admin')

# Create test user
user2 = User.objects.create_user('john', 'john@test.com', 'pass123')
UserProfile.objects.create(
    user=user2,
    role='user',
    full_name='John Doe'
)

# Add as contact
Contact.objects.create(
    user=admin,
    contact=user2,
    nickname='John'
)

print("Sample data created!")
exit()
```

---

## 🚨 **Issue 7: Git Pull Conflicts**

### **Symptoms:**
```
error: Your local changes would be overwritten by merge
```

### **Solutions:**

#### **Option 1: Stash Changes**
```bash
git stash
git pull origin main
git stash pop
```

#### **Option 2: Commit First**
```bash
git add .
git commit -m "Local changes"
git pull origin main
```

#### **Option 3: Discard Local Changes**
```bash
git reset --hard HEAD
git pull origin main
```

---

## ✅ **Complete Reset (Nuclear Option)**

If nothing works, start fresh:

```bash
# 1. Delete everything
cd ..
rm -rf white-beat-frontend

# 2. Clone again
git clone https://github.com/Aryankaushik541/white-beat-frontend.git
cd white-beat-frontend

# 3. Fresh install
npm install

# 4. Start
npm start

# 5. Test login
# Username: admin
# Password: admin123
```

---

## 📋 **Pre-Flight Checklist**

Before starting, verify:

### **Backend:**
- [ ] Python 3.11+ installed
- [ ] Virtual environment activated
- [ ] Dependencies installed (`pip install -r requirements.txt`)
- [ ] Migrations run (`python manage.py migrate`)
- [ ] Admin user created
- [ ] Server running on port 8000
- [ ] CORS configured

### **Frontend:**
- [ ] Node.js 14+ installed
- [ ] npm installed
- [ ] Dependencies installed (`npm install`)
- [ ] No port conflicts
- [ ] Browser cache cleared
- [ ] Console shows no errors

---

## 🔍 **Debug Mode**

### **Enable Detailed Logging:**

**In `src/components/Login.js`, add:**
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  console.log('=== LOGIN DEBUG ===');
  console.log('Form Data:', formData);
  console.log('API URL:', 'http://localhost:8000/api/login/');
  
  try {
    const response = await fetch('http://localhost:8000/api/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    
    console.log('Response Status:', response.status);
    const data = await response.json();
    console.log('Response Data:', data);
    
    // ... rest of code
  } catch (err) {
    console.error('=== ERROR ===');
    console.error('Error Details:', err);
    console.error('Error Message:', err.message);
  }
};
```

---

## 📞 **Still Not Working?**

### **Collect Information:**

1. **Browser Console Errors:**
   - Press F12
   - Copy all red errors

2. **Network Tab:**
   - F12 → Network tab
   - Try login
   - Check failed requests
   - Copy error details

3. **Backend Logs:**
   - Check terminal running backend
   - Copy any error messages

4. **System Info:**
   - OS: Windows/Mac/Linux
   - Node version: `node --version`
   - npm version: `npm --version`
   - Python version: `python --version`

---

## 🎯 **Quick Test Commands**

```bash
# Test backend
curl http://localhost:8000/api/login/

# Test frontend build
npm run build

# Test with different browser
# Try Chrome, Firefox, Edge

# Check ports
netstat -an | grep 3000
netstat -an | grep 8000

# Check processes
ps aux | grep node
ps aux | grep python
```

---

## ✅ **Success Indicators**

You know it's working when:

1. ✅ Backend shows: `Starting development server at http://127.0.0.1:8000/`
2. ✅ Frontend shows: `Compiled successfully!`
3. ✅ Browser opens: `http://localhost:3000`
4. ✅ Login page displays with purple gradient
5. ✅ Can type in username/password
6. ✅ Login button works
7. ✅ Redirects to dashboard
8. ✅ Dashboard shows data
9. ✅ No console errors

---

## 🚀 **Final Verification**

```bash
# Terminal 1: Backend
cd white-beat-backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python manage.py runserver
# Should see: Starting development server...

# Terminal 2: Frontend
cd white-beat-frontend
npm start
# Should see: Compiled successfully!

# Browser
# Open: http://localhost:3000
# Login: admin / admin123
# Should redirect to: http://localhost:3000/dashboard
```

---

**If you've tried everything and it still doesn't work, share:**
1. Console errors (screenshot)
2. Network tab errors
3. Backend terminal output
4. Your OS and versions

**Happy Debugging! 🔧**
