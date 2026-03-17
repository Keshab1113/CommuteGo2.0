// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import AdminUsers from './pages/AdminDashboard/AdminUsers';
import AdminRoutes from './pages/AdminDashboard/AdminRoutes';
import AdminAlerts from './pages/AdminDashboard/AdminAlerts';
import AdminSettings from './pages/AdminDashboard/AdminSettings';
import BlogManager from './pages/AdminDashboard/BlogManager';
import BlogEditor from './pages/AdminDashboard/BlogEditor';
import FAQManager from './pages/AdminDashboard/FAQManager';
import ContactManager from './pages/AdminDashboard/ContactManager';
import JobManager from './pages/AdminDashboard/JobManager';
import PricingManager from './pages/AdminDashboard/PricingManager';
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
import Contact from './pages/Contact';
import { initializeTheme } from './lib/utils';

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
                  <Route path="/contact" element={<Contact />} />
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
                  <Route path="/route-details/:routeId" element={
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
                  <Route path="/admin/users" element={
                    <PrivateRoute adminOnly>
                      <Layout>
                        <AdminUsers />
                      </Layout>
                    </PrivateRoute>
                  } />
                  <Route path="/admin/routes" element={
                    <PrivateRoute adminOnly>
                      <Layout>
                        <AdminRoutes />
                      </Layout>
                    </PrivateRoute>
                  } />
                  <Route path="/admin/alerts" element={
                    <PrivateRoute adminOnly>
                      <Layout>
                        <AdminAlerts />
                      </Layout>
                    </PrivateRoute>
                  } />
                  <Route path="/admin/settings" element={
                    <PrivateRoute adminOnly>
                      <Layout>
                        <AdminSettings />
                      </Layout>
                    </PrivateRoute>
                  } />
                  <Route path="/admin/blogs" element={
                    <PrivateRoute adminOnly>
                      <Layout>
                        <BlogManager />
                      </Layout>
                    </PrivateRoute>
                  } />
                  <Route path="/admin/blogs/new" element={
                    <PrivateRoute adminOnly>
                      <Layout>
                        <BlogEditor />
                      </Layout>
                    </PrivateRoute>
                  } />
                  <Route path="/admin/blogs/:id" element={
                    <PrivateRoute adminOnly>
                      <Layout>
                        <BlogEditor />
                      </Layout>
                    </PrivateRoute>
                  } />
                  <Route path="/admin/faqs" element={
                    <PrivateRoute adminOnly>
                      <Layout>
                        <FAQManager />
                      </Layout>
                    </PrivateRoute>
                  } />
                  <Route path="/admin/contacts" element={
                    <PrivateRoute adminOnly>
                      <Layout>
                        <ContactManager />
                      </Layout>
                    </PrivateRoute>
                  } />
                  <Route path="/admin/jobs" element={
                    <PrivateRoute adminOnly>
                      <Layout>
                        <JobManager />
                      </Layout>
                    </PrivateRoute>
                  } />
                  <Route path="/admin/pricing" element={
                    <PrivateRoute adminOnly>
                      <Layout>
                        <PricingManager />
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
      </ErrorBoundary>
  );
}

export default App;