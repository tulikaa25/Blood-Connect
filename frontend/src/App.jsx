import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import LiveQueue from './pages/LiveQueue';
import AdminDashboard from './admin/AdminDashboard';
import AdminSettings from './admin/AdminSettings';
import ProtectedRoute from './components/ProtectedRoute';
import axios from './utils/axiosConfig';
import './App.css';

const App = () => {
  const [user, setUser] = useState(null);

  // Fetch logged-in user on app mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('/auth/me');
        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  return (
    <Router>
      <nav>
        <h1><Link to="/">BloodConnect</Link></h1>
        <ul>
          {!user && (
            <>
              <li><Link to="/register">Register</Link></li>
              <li><Link to="/login">Login</Link></li>
            </>
          )}

          {user && user.role === 'donor' && (
            <>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/profile">Profile</Link></li>
              <li><Link to="/queue">Live Status</Link></li>
            </>
          )}

          {user && user.role === 'admin' && (
            <>
              <li><Link to="/admin">Admin Dashboard</Link></li>
              <li><Link to="/admin/settings">Settings</Link></li>
            </>
          )}
        </ul>
      </nav>

      <section className="container">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login onLoginSuccess={setUser} />} />

          {/* Donor routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute user={user}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute user={user}>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/queue"
            element={
              <ProtectedRoute user={user}>
                <LiveQueue />
              </ProtectedRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute user={user} adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute user={user} adminOnly={true}>
                <AdminSettings />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<p>Page not found</p>} />
        </Routes>
      </section>
    </Router>
  );
};

export default App;
