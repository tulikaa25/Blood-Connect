import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import LiveQueue from './components/LiveQueue';
import './App.css';

const App = () => {
  return (
    <Router>
      <>
        <nav>
          <h1>
            <Link to="/">BloodConnect</Link>
          </h1>
          <ul>
            <li>
              <Link to="/register">Register</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <Link to="/queue">Live Status</Link>
            </li>
          </ul>
        </nav>
        <section className="container">
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/queue" element={<LiveQueue />} />
          </Routes>
        </section>
      </>
    </Router>
  );
};

export default App;
