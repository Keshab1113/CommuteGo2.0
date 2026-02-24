// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
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
import ErrorBoundary from './components/ErrorBoundary';
import { motion, AnimatePresence } from 'framer-motion';
import Landing from './pages/Landing';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

const PrivateRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!token) {
    return <Navigate to="/landing" />;
  }
  
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" />;
  }
  
  return children;
};

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AuthProvider>
            <AnimatePresence mode="wait">
              <div className="min-h-screen bg-background font-sans antialiased">
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/landing" element={<Landing />} />
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
                <Toaster 
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    className: "border border-gray-200 shadow-lg",
                  }}
                />
              </div>
            </AnimatePresence>
          </AuthProvider>
        </Router>
        {import.meta.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;