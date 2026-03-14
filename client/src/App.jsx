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
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Register from './pages/Register';
import PlanCommute from './pages/PlanCommute';
import RouteDetails from './pages/RouteDetails';
import History from './pages/History';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import Profile from './pages/Profile';
import Alerts from './pages/Alerts';
import Settings from './pages/Settings';
import AdminAnalytics from './pages/AdminDashboard/AdminAnalytics';
import ErrorBoundary from './components/ErrorBoundary';
import { motion, AnimatePresence } from 'framer-motion';
import Landing from './pages/Landing';
import Documentation from './pages/Documentation';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Cookies from './pages/Cookies';
import Security from './pages/Security';
import Community from './pages/Community';
import AboutUs from './pages/AboutUs';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import FAQ from './pages/FAQ';
import Roadmap from './pages/Roadmap';
import Blog from './pages/Blog';
import Careers from './pages/Careers';
import PressKit from './pages/PressKit';
import SupportCenter from './pages/SupportCenter';
import { initializeTheme } from './lib/utils';

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
  // Initialize theme on app load
  React.useEffect(() => {
    initializeTheme();
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AuthProvider>
            <AnimatePresence mode="wait">
              <div className="min-h-screen bg-background font-sans antialiased">
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/landing" element={<Landing />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/docs" element={<Documentation />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<TermsOfService />} />
                  <Route path="/cookies" element={<Cookies />} />
                  <Route path="/security" element={<Security />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="/about" element={<AboutUs />} />
                  <Route path="/features" element={<Features />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/roadmap" element={<Roadmap />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/careers" element={<Careers />} />
                  <Route path="/press" element={<PressKit />} />
                  <Route path="/support" element={<SupportCenter />} />
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
                  <Route path="/route-details" element={
                    <PrivateRoute>
                      <Layout>
                        <RouteDetails />
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