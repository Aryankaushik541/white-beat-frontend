import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/Login';
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
      navigate('/chat');
    }
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login onLogin={handleLogin} />} />
        <Route 
          path="/chat" 
          element={user?.role === 'user' ? <ChatDashboard user={user} /> : <Navigate to="/" />} 
        />
        <Route 
          path="/admin-dashboard" 
          element={user?.role === 'admin' ? <AdminDashboard user={user} /> : <Navigate to="/" />} 
        />
        {/* Redirect old user-dashboard to new chat route */}
        <Route 
          path="/user-dashboard" 
          element={<Navigate to="/chat" replace />} 
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
