import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import UserDashboard from './components/UserDashboard';
import ChatDashboard from './components/ChatDashboard';
import AdminDashboard from './components/AdminDashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Login Page */}
          <Route path="/" element={<Login />} />
          
          {/* User Dashboard */}
          <Route path="/dashboard" element={<UserDashboard />} />
          
          {/* Chat Dashboard */}
          <Route path="/chat" element={<ChatDashboard />} />
          
          {/* Admin Dashboard */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          
          {/* Redirect old routes */}
          <Route path="/user-dashboard" element={<Navigate to="/dashboard" replace />} />
          
          {/* Catch all - redirect to login */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
