// frontend/src/components/layout/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
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
  Settings,
  Shield,
  LogIn,
  UserPlus,
  ChevronDown,
  Sparkles,
  Brain,
  Zap,
  Globe
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  const navItems = user ? [
    { icon: <Home size={18} />, label: 'Dashboard', path: '/', active: location.pathname === '/' },
    { icon: <Map size={18} />, label: 'Plan Commute', path: '/plan', active: location.pathname === '/plan' },
    { icon: <History size={18} />, label: 'History', path: '/history', active: location.pathname === '/history' },
    { icon: <Bell size={18} />, label: 'Alerts', path: '/alerts', active: location.pathname === '/alerts', badge: unreadCount },
    { icon: <User size={18} />, label: 'Profile', path: '/profile', active: location.pathname === '/profile' },
    { icon: <Settings size={18} />, label: 'Settings', path: '/settings', active: location.pathname === '/settings' },
    ...(isAdmin() ? [
      { icon: <Shield size={18} />, label: 'Admin', path: '/admin', active: location.pathname === '/admin' },
      { icon: <BarChart3 size={18} />, label: 'Analytics', path: '/admin/analytics', active: location.pathname === '/admin/analytics' }
    ] : []),
  ] : [];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-lg' 
            : 'bg-transparent border-b-2 border-gray-200'
        }`}
      >
        <div className=" mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo with futuristic animation */}
            <Link 
              to={user ? "/" : "/"} 
              className="flex items-center space-x-3 group"
            >
              <motion.div
                whileHover={{ rotate: 180, scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary-600 via-secondary-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center relative overflow-hidden">
                    <motion.div
                      animate={{ 
                        rotate: [0, 360],
                      }}
                      transition={{ 
                        duration: 20, 
                        repeat: Infinity, 
                        ease: "linear" 
                      }}
                      className="absolute inset-0 bg-gradient-to-r from-primary-400 to-secondary-400 opacity-20"
                    />
                    <Globe className="w-4 h-4 text-primary-600 relative z-10" />
                  </div>
                </div>
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut" 
                  }}
                  className="absolute -inset-1 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity"
                />
              </motion.div>
              
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  CommuteGo
                </span>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-primary-500" />
                  AI-Powered Commute
                </span>
              </div>
            </Link>

            {/* Desktop Navigation - Only for authenticated users */}
            {user && (
              <div className="hidden lg:flex items-center space-x-1">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={item.path}
                      className={`relative px-4 py-2 rounded-xl flex items-center space-x-2 transition-all duration-300 group ${
                        item.active
                          ? 'text-primary-600 bg-primary-50/50'
                          : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50/50'
                      }`}
                    >
                      <span className={`transition-transform duration-300 group-hover:scale-110 ${
                        item.active ? 'text-primary-600' : 'text-gray-400'
                      }`}>
                        {item.icon}
                      </span>
                      <span className="font-medium text-sm">{item.label}</span>
                      {item.badge && item.badge > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
                        >
                          {item.badge}
                        </motion.span>
                      )}
                      {item.active && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute inset-0 bg-primary-100/50 rounded-xl -z-10"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Right side - User menu or Auth buttons */}
            <div className="flex items-center space-x-4">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-gray-50/50 transition-all duration-300 group"
                    >
                      <Avatar className="h-9 w-9 ring-2 ring-primary-100 group-hover:ring-primary-200 transition-all">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} />
                        <AvatarFallback className="bg-gradient-to-br from-primary-500 to-secondary-500 text-white">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden md:block text-left">
                        <p className="text-sm font-medium text-gray-700">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    </motion.button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 mt-2">
                    <DropdownMenuLabel>
                      <div className="flex items-center space-x-2">
                        <Brain className="w-4 h-4 text-primary-500" />
                        <span>My Account</span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="cursor-pointer">
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/alerts" className="cursor-pointer">
                        <Bell className="w-4 h-4 mr-2" />
                        Notifications
                        {unreadCount > 0 && (
                          <Badge variant="destructive" className="ml-auto">
                            {unreadCount}
                          </Badge>
                        )}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className="text-red-600 focus:text-red-600 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden md:flex items-center space-x-3">
                  <Link to="/login">
                    <Button variant="ghost" className="gap-2">
                      <LogIn className="w-4 h-4" />
                      Login
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button className="gap-2 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white border-0">
                      <UserPlus className="w-4 h-4" />
                      Sign Up
                      <Zap className="w-3 h-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile menu with animations */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden border-t border-gray-100 bg-white/95 backdrop-blur-xl overflow-hidden"
            >
              <div className="container mx-auto px-4 py-4">
                {!user ? (
                  <div className="space-y-3">
                    <Link
                      to="/login"
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LogIn className="w-5 h-5 text-primary-500" />
                      <span className="font-medium">Login</span>
                    </Link>
                    <Link
                      to="/register"
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-gradient-to-r from-primary-50 to-secondary-50 text-primary-700"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <UserPlus className="w-5 h-5" />
                      <span className="font-medium">Sign Up</span>
                      <Sparkles className="w-4 h-4 ml-auto text-primary-500" />
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {navItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                          item.active
                            ? 'bg-primary-50 text-primary-700'
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div className="flex items-center space-x-3">
                          <span className={item.active ? 'text-primary-600' : 'text-gray-400'}>
                            {item.icon}
                          </span>
                          <span className="font-medium">{item.label}</span>
                        </div>
                        {item.badge && item.badge > 0 && (
                          <Badge variant="destructive" className="ml-auto">
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    ))}
                    
                    <div className="pt-4 mt-4 border-t border-gray-100">
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-20" />
    </>
  );
};

export default Navbar;