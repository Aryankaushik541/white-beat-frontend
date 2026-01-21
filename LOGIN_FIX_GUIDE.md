# 🔧 Login Fix Guide

Quick guide to fix login issues and test the platform!

---

## ✅ **What Was Fixed**

### **Issue:**
- Login button not working
- No navigation after login
- Props mismatch between App.js and Login.js

### **Solution:**
1. ✅ Fixed prop name: `setUser` → `onLogin`
2. ✅ Added `useNavigate` hook in Login.js
3. ✅ Added navigation after successful login
4. ✅ Role-based routing (admin → Admin Dashboard, user → User Dashboard)

---

## 🚀 **Quick Test**

### **Step 1: Update Code**
```bash
# Frontend
cd white-beat-frontend
git pull origin main
npm start

# Backend (in another terminal)
cd white-beat-backend
git pull origin main
python manage.py runserver
```

### **Step 2: Create Test Users**
```bash
# In backend directory
python create_test_users.py
```

**Output:**
```
✅ Test users creation complete!

📝 Login Credentials:

Regular Users:
  Username: aryan    | Password: aryan123
  Username: john     | Password: john123

Admin User:
  Username: admin    | Password: admin123
```

### **Step 3: Test Login**

**Test 1: Regular User**
```
1. Go to http://localhost:3000
2. Username: aryan
3. Password: aryan123
4. Click "Login"
5. → Should redirect to User Dashboard ✅
```

**Test 2: Admin User**
```
1. Go to http://localhost:3000
2. Username: admin
3. Password: admin123
4. Click "Login"
5. → Should redirect to Admin Dashboard ✅
```

**Test 3: Signup**
```
1. Go to http://localhost:3000
2. Click "Sign Up"
3. Enter new username and password
4. Click "Sign Up"
5. Success message appears
6. Click "Login" to switch
7. Login with new credentials
8. → Should redirect to User Dashboard ✅
```

---

## 🔍 **Debugging**

### **If login still fails:**

**Check 1: Backend Running?**
```bash
curl http://localhost:8000/api/health/
```

**Expected:**
```json
{
  "status": "healthy",
  "service": "White Beat Backend"
}
```

**Check 2: Test Login API**
```bash
curl -X POST http://localhost:8000/api/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "aryan", "password": "aryan123"}'
```

**Expected:**
```json
{
  "role": "user",
  "username": "aryan",
  "email": "aryan@whitebeat.com",
  "user_id": 2,
  "message": "User login successful"
}
```

**Check 3: Browser Console**
```
1. Open browser DevTools (F12)
2. Go to Console tab
3. Try login
4. Check for errors
```

**Check 4: Network Tab**
```
1. Open browser DevTools (F12)
2. Go to Network tab
3. Try login
4. Check POST request to /api/login/
5. Check response status and data
```

---

## 🐛 **Common Issues**

### **Issue 1: CORS Error**

**Error:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
```python
# In white_beat/settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

### **Issue 2: Invalid Credentials**

**Error:**
```
Invalid username or password
```

**Solution:**
```bash
# Create test users
python create_test_users.py

# Or create manually
python manage.py shell
>>> from django.contrib.auth.models import User
>>> User.objects.create_user('test', 'test@test.com', 'test123')
```

### **Issue 3: User Already Exists**

**Error:**
```
Username already exists
```

**Solution:**
```bash
# Delete existing user
python manage.py shell
>>> from django.contrib.auth.models import User
>>> User.objects.filter(username='aryan').delete()

# Or use different username
```

### **Issue 4: Navigation Not Working**

**Error:**
```
Stays on login page after successful login
```

**Solution:**
```bash
# Make sure you pulled latest code
cd white-beat-frontend
git pull origin main
npm start
```

---

## 📊 **Login Flow**

### **Frontend:**
```
1. User enters credentials
2. Click "Login" button
3. POST request to /api/login/
4. Backend validates credentials
5. Backend returns role (user/admin)
6. Frontend calls onLogin(userData)
7. Frontend navigates based on role:
   - role === 'admin' → /admin-dashboard
   - role === 'user' → /user-dashboard
```

### **Backend:**
```
1. Receive POST /api/login/
2. Extract username and password
3. Authenticate with Django
4. Check if user.is_superuser:
   - True → role = 'admin'
   - False → role = 'user'
5. Return user data with role
```

---

## 🧪 **Manual Testing**

### **Test 1: Create User via Signup**
```bash
curl -X POST http://localhost:8000/api/signup/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "test123",
    "email": "test@example.com"
  }'
```

### **Test 2: Login with New User**
```bash
curl -X POST http://localhost:8000/api/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "test123"
  }'
```

### **Test 3: Verify User Role**
```bash
curl -X POST http://localhost:8000/api/verify-admin/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser"
  }'
```

---

## 🎯 **Expected Behavior**

### **Regular User Login:**
```
✅ Login successful
✅ Navigate to /user-dashboard
✅ See chat interface
✅ Can send messages
✅ Can use OSINT
```

### **Admin Login:**
```
✅ Login successful
✅ Navigate to /admin-dashboard
✅ See admin dashboard
✅ See statistics
✅ See user list
✅ See API logs
```

### **Signup:**
```
✅ Signup successful
✅ Success message shown
✅ Form switches to login mode
✅ Can login with new credentials
✅ Navigate to user dashboard
```

---

## 🔧 **Quick Commands**

### **Reset Everything:**
```bash
# Backend
cd white-beat-backend
rm db.sqlite3
python manage.py migrate
python create_test_users.py
python manage.py runserver

# Frontend
cd white-beat-frontend
git pull
npm start
```

### **Create Specific User:**
```bash
# Regular user
python manage.py shell
>>> from django.contrib.auth.models import User
>>> User.objects.create_user('username', 'email@test.com', 'password')

# Admin user
python manage.py createsuperuser
```

### **Check Users:**
```bash
python manage.py shell
>>> from django.contrib.auth.models import User
>>> for u in User.objects.all():
...     print(f"{u.username} - Admin: {u.is_superuser}")
```

---

## 📝 **Summary**

**Fixed:**
- ✅ Login navigation
- ✅ Props mismatch
- ✅ Role-based routing
- ✅ Test users script

**Test Credentials:**
```
User:  aryan / aryan123
User:  john / john123
Admin: admin / admin123
```

**Commands:**
```bash
# Backend
python create_test_users.py
python manage.py runserver

# Frontend
git pull
npm start

# Test
http://localhost:3000
```

---

<div align="center">

**Login Fixed! 🎉**

Try it now with test credentials!

</div>