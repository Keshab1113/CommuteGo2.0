// frontend/src/components/layout/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Home, 
  Map, 
  History, 
  BarChart3, 
  User, 
  LogOut,
  Menu,
  X,
  Bell,
  Settings
} from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Update the navItems array in Navbar.jsx to include:
const navItems = [
  { icon: <Home size={20} />, label: 'Dashboard', path: '/' },
  { icon: <Map size={20} />, label: 'Plan Commute', path: '/plan' },
  { icon: <History size={20} />, label: 'History', path: '/history' },
  { icon: <Bell size={20} />, label: 'Alerts', path: '/alerts' },
  { icon: <User size={20} />, label: 'Profile', path: '/profile' },
  { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
  ...(isAdmin() ? [
    { icon: <Shield size={20} />, label: 'Admin', path: '/admin' },
    { icon: <BarChart3 size={20} />, label: 'Analytics', path: '/admin/analytics' }
  ] : []),
];

  return (
    <nav className="border-b border-border sticky top-0 bg-background/80 backdrop-blur-sm z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-secondary-500 to-primary-500 rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded-full relative">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-primary-600 rounded-full"></div>
              </div>
            </div>
            <Link to="/" className="text-xl font-bold text-black">
              CommuteGo
            </Link>
            
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center space-x-2 hover:text-secondary-300 transition-colors"
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
            
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary-700 rounded-full flex items-center justify-center">
                    <User size={18} />
                  </div>
                  <span className="text-sm">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 hover:text-secondary-300 transition-colors"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-secondary-600 hover:bg-secondary-700 px-4 py-2 rounded-lg transition-colors"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-primary-700">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center space-x-3 px-4 py-2 hover:bg-primary-700 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
              
              {user ? (
                <>
                  <div className="px-4 py-2 flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-700 rounded-full flex items-center justify-center">
                      <User size={18} />
                    </div>
                    <span>{user.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 px-4 py-2 hover:bg-primary-700 rounded-lg transition-colors text-left"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="bg-secondary-600 hover:bg-secondary-700 px-4 py-2 rounded-lg transition-colors text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;