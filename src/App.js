import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import UserDashboard from './components/UserDashboard';
import ChatDashboard from './components/ChatDashboard';
import AdminDashboard from './components/AdminDashboard';
import './App.css';

function AppContent() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleLogin = (userData) => {
    setUser(userData);
    // Navigate based on role
    if (userData.role === 'admin') {
      navigate('/admin-dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login onLogin={handleLogin} />} />
        
        {/* User Dashboard - Main hub for all features */}
        <Route 
          path="/dashboard" 
          element={user?.role === 'user' ? <UserDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/" />} 
        />
        
        {/* Chat Dashboard - Messaging interface */}
        <Route 
          path="/chat" 
          element={user?.role === 'user' ? <ChatDashboard user={user} /> : <Navigate to="/" />} 
        />
        
        {/* Admin Dashboard */}
        <Route 
          path="/admin-dashboard" 
          element={user?.role === 'admin' ? <AdminDashboard user={user} /> : <Navigate to="/" />} 
        />
        
        {/* Redirect old routes */}
        <Route 
          path="/user-dashboard" 
          element={<Navigate to="/dashboard" replace />} 
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
