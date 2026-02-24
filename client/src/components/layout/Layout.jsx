// frontend/src/components/layout/Layout.jsx
import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  
  // Don't show footer on landing page
  const showFooter = location.pathname !== '/landing';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        {user && <Sidebar />}
        <main className={`flex-1 md:p-10 p-4 ${!user ? 'w-full' : ''}`}>
          {children}
        </main>
      </div>
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;