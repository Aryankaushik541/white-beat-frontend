# 🚀 White Beat Frontend - Complete Setup Guide

Step-by-step guide to get the White Beat frontend up and running.

---

## 📋 Prerequisites

Before you begin, ensure you have:

- ✅ **Node.js** 16.0 or higher ([Download](https://nodejs.org/))
- ✅ **npm** 7.0 or higher (comes with Node.js)
- ✅ **Git** ([Download](https://git-scm.com/))
- ✅ **Backend Server** running ([Setup Guide](https://github.com/Aryankaushik541/white-beat-backend))

### Check Your Versions

```bash
node --version   # Should be v16.0.0 or higher
npm --version    # Should be 7.0.0 or higher
git --version    # Any recent version
```

---

## 🔧 Installation Steps

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/Aryankaushik541/white-beat-frontend.git

# Navigate to the project directory
cd white-beat-frontend
```

### Step 2: Install Dependencies

```bash
# Install all required packages
npm install

# This will install:
# - react (18.2.0)
# - react-dom (18.2.0)
# - react-router-dom (6.20.0)
# - axios (1.6.2)
# - react-scripts (5.0.1)
```

### Step 3: Configure Environment

```bash
# Copy the example environment file
cp .env.example .env

# Open .env and update the API URL
# For local development:
REACT_APP_API_URL=http://localhost:8000/api

# For production:
# REACT_APP_API_URL=https://your-backend-url.com/api
```

### Step 4: Start Development Server

```bash
# Start the development server
npm start

# The app will automatically open in your browser at:
# http://localhost:3000
```

---

## 🎯 First Time Setup

### 1. Verify Backend Connection

Before using the frontend, make sure your backend is running:

```bash
# In a separate terminal, navigate to backend directory
cd ../white-beat-backend

# Start the backend server
python manage.py runserver

# Backend should be running at:
# http://localhost:8000
```

### 2. Test the Connection

Open your browser and go to:
- Frontend: http://localhost:3000
- Backend Health: http://localhost:8000/api/health/

You should see the health check response from the backend.

### 3. Create Your First Account

1. Click on the **Sign Up** tab
2. Fill in the form:
   - Username: `yourname`
   - Email: `your@email.com`
   - Phone: `+1234567890` (optional)
   - Password: `yourpassword`
3. Click **Create Account**
4. Switch to **Login** tab
5. Login with your credentials

---

## 📱 Using the Application

### Login Page

**Demo Credentials:**
- **Admin**: username=`admin`, password=`admin123`
- **User**: Any username/password combination

**Features:**
- Toggle between Login and Sign Up
- See feature preview
- Demo credentials for quick testing

### Chat Dashboard

After logging in, you'll see:

**Sidebar Tabs:**
- 💬 **Chats** - Your conversations
- 👥 **Groups** - Group chats
- 📞 **Calls** - Call history
- 📸 **Status** - Status updates
- 📇 **Contacts** - Contact list

**Starting a Chat:**
1. Click **➕ New Chat** button
2. Select a user from the list
3. Start messaging!

**Creating a Group:**
1. Go to **Groups** tab
2. Click **➕ New Group**
3. Enter group details
4. Add members
5. Create group

**Making a Call:**
1. Open a chat
2. Click the 📞 (voice) or 📹 (video) button
3. Call will be initiated

**Adding Status:**
1. Go to **Status** tab
2. Click **➕ Add Status**
3. Choose type (text/image/video)
4. Add content
5. Post status

---

## 🔍 Troubleshooting

### Issue: "Cannot connect to backend"

**Solution:**
1. Check if backend is running: `http://localhost:8000/api/health/`
2. Verify `.env` file has correct `REACT_APP_API_URL`
3. Check for CORS errors in browser console
4. Ensure backend has CORS enabled

### Issue: "npm install fails"

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: "Port 3000 already in use"

**Solution:**
```bash
# Option 1: Kill the process using port 3000
# On Mac/Linux:
lsof -ti:3000 | xargs kill -9

# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Option 2: Use a different port
PORT=3001 npm start
```

### Issue: "Login not working"

**Solution:**
1. Check browser console for errors
2. Verify backend is running
3. Check network tab for API responses
4. Ensure credentials are correct
5. Try creating a new account

### Issue: "Messages not loading"

**Solution:**
1. Check if you're logged in
2. Verify backend API is responding
3. Check browser console for errors
4. Try refreshing the page
5. Clear browser cache

---

## 🛠️ Development Tips

### Hot Reload

The development server supports hot reload. Changes to your code will automatically refresh the browser.

### Browser DevTools

Use React DevTools for debugging:
1. Install [React DevTools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
2. Open browser DevTools (F12)
3. Go to "Components" or "Profiler" tab

### API Testing

Test API endpoints using:
- Browser DevTools Network tab
- [Postman](https://www.postman.com/)
- [Insomnia](https://insomnia.rest/)
- cURL commands

### Code Formatting

```bash
# Install Prettier (optional)
npm install --save-dev prettier

# Format code
npx prettier --write src/
```

---

## 📦 Building for Production

### Create Production Build

```bash
# Build optimized production bundle
npm run build

# Output will be in the 'build' folder
# Files are minified and optimized
```

### Test Production Build Locally

```bash
# Install serve globally
npm install -g serve

# Serve the build folder
serve -s build

# Open http://localhost:3000
```

### Environment Variables for Production

Update `.env` for production:

```env
REACT_APP_API_URL=https://your-production-backend.com/api
```

---

## 🚀 Deployment

### Deploy to Netlify

1. **Via Netlify CLI:**
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=build
```

2. **Via Netlify Dashboard:**
- Connect your GitHub repository
- Set build command: `npm run build`
- Set publish directory: `build`
- Add environment variable: `REACT_APP_API_URL`

### Deploy to Vercel

1. **Via Vercel CLI:**
```bash
npm install -g vercel
vercel --prod
```

2. **Via Vercel Dashboard:**
- Import your GitHub repository
- Framework preset: Create React App
- Add environment variable: `REACT_APP_API_URL`

### Deploy to GitHub Pages

```bash
# Add to package.json
"homepage": "https://yourusername.github.io/white-beat-frontend"

# Install gh-pages
npm install --save-dev gh-pages

# Add scripts to package.json
"predeploy": "npm run build",
"deploy": "gh-pages -d build"

# Deploy
npm run deploy
```

---

## 🔐 Security Best Practices

1. **Never commit `.env` file**
   - Add to `.gitignore`
   - Use `.env.example` for reference

2. **Use HTTPS in production**
   - Ensure backend uses HTTPS
   - Update `REACT_APP_API_URL` to use `https://`

3. **Validate user input**
   - Already implemented in forms
   - Add more validation as needed

4. **Keep dependencies updated**
```bash
npm outdated
npm update
```

---

## 📊 Performance Optimization

### Code Splitting

React automatically code-splits with dynamic imports:

```javascript
const ChatDashboard = React.lazy(() => import('./components/ChatDashboard'));
```

### Image Optimization

- Use WebP format for images
- Compress images before upload
- Use lazy loading for images

### Bundle Analysis

```bash
# Install bundle analyzer
npm install --save-dev webpack-bundle-analyzer

# Analyze bundle
npm run build
npx webpack-bundle-analyzer build/static/js/*.js
```

---

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

### Write Tests

Example test file:

```javascript
import { render, screen } from '@testing-library/react';
import Login from './components/Login';

test('renders login form', () => {
  render(<Login />);
  const loginButton = screen.getByText(/login/i);
  expect(loginButton).toBeInTheDocument();
});
```

---

## 📝 Common Commands

```bash
# Development
npm start              # Start dev server
npm test               # Run tests
npm run build          # Build for production

# Maintenance
npm install            # Install dependencies
npm update             # Update dependencies
npm outdated           # Check outdated packages
npm audit              # Check for vulnerabilities
npm audit fix          # Fix vulnerabilities

# Cleanup
rm -rf node_modules    # Remove dependencies
rm package-lock.json   # Remove lock file
npm cache clean --force # Clear npm cache
```

---

## 🆘 Getting Help

### Resources

- **Documentation**: [README.md](README.md)
- **Backend Setup**: [Backend Repo](https://github.com/Aryankaushik541/white-beat-backend)
- **React Docs**: [reactjs.org](https://reactjs.org/)
- **Create React App**: [create-react-app.dev](https://create-react-app.dev/)

### Support Channels

- **GitHub Issues**: [Create an issue](https://github.com/Aryankaushik541/white-beat-frontend/issues)
- **Backend Issues**: [Backend Issues](https://github.com/Aryankaushik541/white-beat-backend/issues)

---

## ✅ Checklist

Before deploying to production:

- [ ] Backend is deployed and accessible
- [ ] `.env` has production API URL
- [ ] All tests pass
- [ ] No console errors
- [ ] Tested on multiple browsers
- [ ] Tested on mobile devices
- [ ] Images are optimized
- [ ] HTTPS is enabled
- [ ] Error handling is in place
- [ ] Loading states are implemented

---

## 🎉 You're All Set!

Your White Beat frontend is now ready to use. Start chatting, creating groups, making calls, and sharing status updates!

**Next Steps:**
1. Explore all features
2. Customize the UI
3. Add new features
4. Deploy to production
5. Share with friends!

---

**Happy Coding! 💻✨**
