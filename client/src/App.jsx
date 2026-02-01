// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PlanCommute from './pages/PlanCommute';
import History from './pages/History';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import Profile from './pages/Profile';
import Alerts from './pages/Alerts';
import Settings from './pages/Settings';
import AdminAnalytics from './pages/AdminDashboard/AdminAnalytics';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!token) {
    return <Navigate to="/login" />;
  }
  
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-background ">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={
              <PrivateRoute>
                <Layout>
                  <Home />
                </Layout>
              </PrivateRoute>
            } />
            <Route path="/plan" element={
              <PrivateRoute>
                <Layout>
                  <PlanCommute />
                </Layout>
              </PrivateRoute>
            } />
            <Route path="/history" element={
              <PrivateRoute>
                <Layout>
                  <History />
                </Layout>
              </PrivateRoute>
            } />
            <Route path="/profile" element={
              <PrivateRoute>
                <Layout>
                  <Profile />
                </Layout>
              </PrivateRoute>
            } />
            <Route path="/alerts" element={
              <PrivateRoute>
                <Layout>
                  <Alerts />
                </Layout>
              </PrivateRoute>
            } />
            <Route path="/settings" element={
              <PrivateRoute>
                <Layout>
                  <Settings />
                </Layout>
              </PrivateRoute>
            } />
            <Route path="/admin" element={
              <PrivateRoute adminOnly>
                <Layout>
                  <AdminDashboard />
                </Layout>
              </PrivateRoute>
            } />
            <Route path="/admin/analytics" element={
              <PrivateRoute adminOnly>
                <Layout>
                  <AdminAnalytics />
                </Layout>
              </PrivateRoute>
            } />
          </Routes>
          <Toaster />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;