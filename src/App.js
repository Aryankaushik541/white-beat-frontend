import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import ChatDashboard from './components/ChatDashboard';
import AdminDashboard from './components/AdminDashboard';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  return (
    <Router>
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
    </Router>
  );
}

export default App;
