# White Beat - Deployment Guide

## 🚀 Quick Deploy

### Frontend (Vercel)

1. **Push to GitHub** (Already done! ✅)

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import `white-beat-frontend` repository
   - Configure:
     - Framework Preset: Create React App
     - Build Command: `npm run build`
     - Output Directory: `build`
   - Add Environment Variable:
     - `REACT_APP_API_URL` = Your backend URL (e.g., `https://your-backend.herokuapp.com/api`)
   - Click "Deploy"

### Backend (Heroku)

1. **Install Heroku CLI:**
   ```bash
   # macOS
   brew tap heroku/brew && brew install heroku
   
   # Windows
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Deploy:**
   ```bash
   # Clone the backend repo
   git clone https://github.com/Aryankaushik541/white-beat-backend.git
   cd white-beat-backend
   
   # Login to Heroku
   heroku login
   
   # Create Heroku app
   heroku create white-beat-backend
   
   # Set environment variables
   heroku config:set SECRET_KEY="your-secret-key-here"
   heroku config:set OPENAI_API_KEY="your-openai-api-key"
   heroku config:set DEBUG=False
   heroku config:set ALLOWED_HOSTS="white-beat-backend.herokuapp.com"
   
   # Deploy
   git push heroku main
   
   # Run migrations
   heroku run python manage.py migrate
   heroku run python manage.py createsuperuser
   ```

3. **Update Frontend:**
   - Go to Vercel dashboard
   - Update `REACT_APP_API_URL` to your Heroku URL
   - Redeploy

---

## 🔧 Local Development

### Frontend Setup

```bash
# Clone repository
git clone https://github.com/Aryankaushik541/white-beat-frontend.git
cd white-beat-frontend

# Install dependencies
npm install

# Create .env file
echo "REACT_APP_API_URL=http://localhost:8000/api" > .env

# Start development server
npm start
```

Visit: http://localhost:3000

### Backend Setup

```bash
# Clone repository
git clone https://github.com/Aryankaushik541/white-beat-backend.git
cd white-beat-backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cat > .env << EOF
OPENAI_API_KEY=your_openai_api_key_here
SECRET_KEY=your_django_secret_key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
EOF

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start server
python manage.py runserver
```

Visit: http://localhost:8000/admin

---

## 🔑 Login Credentials

### Admin Access
- **Username:** `admin`
- **Password:** `admin123`
- **Redirects to:** Admin Dashboard

### User Access
- **Username:** Any username
- **Password:** Any password
- **Redirects to:** User Dashboard

---

## 📦 Alternative Deployment Options

### Frontend

**Netlify:**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=build
```

**GitHub Pages:**
```bash
# Add to package.json
"homepage": "https://yourusername.github.io/white-beat-frontend"

# Install gh-pages
npm install --save-dev gh-pages

# Add scripts
"predeploy": "npm run build"
"deploy": "gh-pages -d build"

# Deploy
npm run deploy
```

### Backend

**Railway:**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize
railway init

# Deploy
railway up
```

**Render:**
- Go to [render.com](https://render.com)
- New Web Service
- Connect GitHub repository
- Configure:
  - Build Command: `pip install -r requirements.txt`
  - Start Command: `gunicorn whitebeat_backend.wsgi:application`
  - Add environment variables

---

## 🔐 Environment Variables

### Frontend (.env)
```
REACT_APP_API_URL=https://your-backend-url.com/api
```

### Backend (.env)
```
OPENAI_API_KEY=sk-your-openai-api-key
SECRET_KEY=your-django-secret-key
DEBUG=False
ALLOWED_HOSTS=your-domain.com,www.your-domain.com
DATABASE_URL=your-database-url (for production)
```

---

## 🎨 Features

✅ Modern glassmorphism UI design
✅ Responsive layout
✅ User & Admin dashboards
✅ OpenAI chat integration
✅ Smart login routing
✅ Real-time chat interface
✅ Admin analytics
✅ API logs viewer
✅ Settings management

---

## 📚 Tech Stack

**Frontend:**
- React 18
- React Router v6
- Axios
- CSS3 (Glassmorphism)

**Backend:**
- Django 4.2
- Django REST Framework
- OpenAI API
- CORS Headers

---

## 🐛 Troubleshooting

**CORS Issues:**
- Update `CORS_ALLOWED_ORIGINS` in `settings.py`
- Add your frontend URL

**OpenAI Not Working:**
- Check `OPENAI_API_KEY` in backend `.env`
- Verify API key is valid
- Check OpenAI account credits

**Build Errors:**
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear cache: `npm cache clean --force`

---

## 📞 Support

- Frontend Repo: https://github.com/Aryankaushik541/white-beat-frontend
- Backend Repo: https://github.com/Aryankaushik541/white-beat-backend

Happy Deploying! 🚀