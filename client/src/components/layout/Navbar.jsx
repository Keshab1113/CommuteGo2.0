// frontend/src/components/layout/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  LogOut,
  Menu,
  X,
  Bell,
  Settings,
  LogIn,
  UserPlus,
  ChevronDown,
  Sparkles,
  Brain,
  Zap,
  Globe,
  MapPin,
  Clock,
  TrendingUp
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
  const { user, logout } = useAuth();
  const navigate = useNavigate();
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

  // Quick action links for the user dropdown
  const quickActions = [
    { icon: <MapPin size={16} />, label: 'Plan New Route', path: '/plan' },
    { icon: <Clock size={16} />, label: 'View History', path: '/history' },
    { icon: <TrendingUp size={16} />, label: 'Analytics', path: '/admin/analytics' },
  ];

  // Mobile navigation items (shown only in mobile menu)
  const mobileNavItems = [
    { icon: <MapPin size={20} />, label: 'Plan Commute', path: '/plan' },
    { icon: <Clock size={20} />, label: 'History', path: '/history' },
    { icon: <Bell size={20} />, label: 'Alerts', path: '/alerts', badge: unreadCount },
    { icon: <User size={20} />, label: 'Profile', path: '/profile' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg' 
            : 'bg-transparent dark:bg-transparent border-b-2 border-gray-200 dark:border-gray-700'
        }`}
      >
        <div className=" mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo with futuristic animation */}
            <Link 
              to={user ? "/" : "/"} 
              className="flex items-center space-x-3 group"
            >
              
                <div className="w-12 h-12 bg-transparent rounded-xl flex items-center justify-center  transition-all duration-300">
                  <img src="/logo.png" alt="" />
                </div>
                
              
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-linear-to-br from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  CommuteGo
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-primary-500" />
                  AI-Powered Commute
                </span>
              </div>
            </Link>

            {/* Desktop Navigation - Minimal - No duplicate items from sidebar */}
            {/* Navigation is handled by Sidebar, Header only shows essential actions */}

            {/* Right side - User menu, Notifications, or Auth buttons */}
            <div className="flex items-center space-x-2 md:space-x-4">
              {user ? (
                <>
                  {/* Notification Bell */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="relative p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 group"
                    onClick={() => navigate('/alerts')}
                  >
                    <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-primary-600 transition-colors" />
                    {unreadCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold ring-2 ring-white"
                      >
                        {unreadCount}
                      </motion.span>
                    )}
                  </motion.button>

                  {/* User Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-1.5 rounded-xl hover:bg-gray-50/80 dark:hover:bg-gray-800/80 transition-all duration-300 group border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                      >
                        <Avatar className="h-8 w-8 ring-2 ring-primary-100 dark:ring-primary-900 group-hover:ring-primary-200 transition-all">
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} />
                          <AvatarFallback className="bg-gradient-to-br from-primary-500 to-secondary-500 text-white text-sm">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="hidden md:block text-left">
                          <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">{user.name}</p>
                        </div>
                        <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                      </motion.button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64 mt-2">
                      <DropdownMenuLabel className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Brain className="w-4 h-4 text-primary-500" />
                            <span className="font-semibold">My Account</span>
                          </div>
                          <Badge className="bg-linear-to-br from-primary-500 to-secondary-500 text-white text-[10px] px-2 py-0.5">
                            {user.role || 'User'}
                          </Badge>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      
                      {/* Quick Actions */}
                      <div className="px-2 py-1.5">
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider px-2 mb-2">Quick Actions</p>
                        {quickActions.map((action) => (
                          <DropdownMenuItem key={action.path} asChild className="cursor-pointer">
                            <Link to={action.path} className="flex items-center space-x-3">
                              <span className="text-gray-500">{action.icon}</span>
                              <span className="text-sm">{action.label}</span>
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </div>
                      
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
                          All Notifications
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
                </>
              ) : (
                <div className="hidden md:flex items-center space-x-3">
                  <Link to="/login">
                    <Button variant="ghost" className="gap-2">
                      <LogIn className="w-4 h-4" />
                      Login
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button className="gap-2 bg-linear-to-br from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white border-0">
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
                className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={24} className="dark:text-white" /> : <Menu size={24} className="dark:text-white" />}
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
              className="lg:hidden border-t border-gray-100 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl overflow-hidden"
            >
              <div className="container mx-auto px-4 py-4">
                {!user ? (
                  <div className="space-y-3">
                    <Link
                      to="/login"
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LogIn className="w-5 h-5 text-primary-500" />
                      <span className="font-medium dark:text-gray-200">Login</span>
                    </Link>
                    <Link
                      to="/register"
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-linear-to-br from-primary-50 to-secondary-50 dark:from-primary-900/30 dark:to-secondary-900/30 text-primary-700 dark:text-primary-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <UserPlus className="w-5 h-5" />
                      <span className="font-medium">Sign Up</span>
                      <Sparkles className="w-4 h-4 ml-auto text-primary-500" />
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {mobileNavItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="flex items-center justify-between px-4 py-3 rounded-xl transition-all hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-gray-400 dark:text-gray-500">
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
                    
                    <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-700">
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
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