// frontend/src/components/layout/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Map,
  History,
  BarChart3,
  Settings,
  User,
  Bell,
  ChevronLeft,
  ChevronRight,
  Shield,
  Sparkles,
  Brain,
  Zap,
  TrendingUp,
  Leaf,
  Clock,
  DollarSign
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';

const Sidebar = () => {
  const { user, isAdmin } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [unreadAlerts, setUnreadAlerts] = useState(3);
  const [hoveredItem, setHoveredItem] = useState(null);

  // Load unread count from API
  useEffect(() => {
    // Fetch unread alerts count
    // This would be replaced with actual API call
  }, []);

  const navItems = [
    { 
      icon: <Home size={20} />, 
      label: 'Dashboard', 
      path: '/',
      color: 'from-blue-500 to-cyan-500',
      description: 'Overview & stats'
    },
    { 
      icon: <Map size={20} />, 
      label: 'Plan Commute', 
      path: '/plan',
      color: 'from-green-500 to-emerald-500',
      description: 'Find optimal routes'
    },
    { 
      icon: <History size={20} />, 
      label: 'History', 
      path: '/history',
      color: 'from-purple-500 to-pink-500',
      description: 'Past commutes'
    },
    { 
      icon: <Bell size={20} />, 
      label: 'Alerts', 
      path: '/alerts', 
      badge: unreadAlerts,
      color: 'from-orange-500 to-red-500',
      description: 'Notifications'
    },
    { 
      icon: <User size={20} />, 
      label: 'Profile', 
      path: '/profile',
      color: 'from-indigo-500 to-purple-500',
      description: 'Your account'
    },
    { 
      icon: <Settings size={20} />, 
      label: 'Settings', 
      path: '/settings',
      color: 'from-gray-500 to-slate-500',
      description: 'Preferences'
    },
    ...(isAdmin() ? [
      { 
        icon: <Shield size={20} />, 
        label: 'Admin', 
        path: '/admin',
        color: 'from-red-500 to-pink-500',
        description: 'Admin panel'
      },
      { 
        icon: <BarChart3 size={20} />, 
        label: 'Analytics', 
        path: '/admin/analytics',
        color: 'from-yellow-500 to-orange-500',
        description: 'System insights'
      }
    ] : []),
  ];

  const getActiveItem = () => {
    return navItems.find(item => location.pathname === item.path) || navItems[0];
  };

  const activeItem = getActiveItem();

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      className={`
        relative bg-white/80 backdrop-blur-xl border-r border-gray-200/50
        h-[calc(100vh-80px)] sticky top-20 shadow-lg
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-20' : 'w-72'}
      `}
    >
      {/* Gradient decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-500/5 via-transparent to-secondary-500/5 pointer-events-none" />
      
      {/* Collapse button with animation */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="absolute -right-3 top-8 z-10 bg-white border border-gray-200 rounded-full p-1.5 shadow-md hover:shadow-lg transition-shadow"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? 
          <ChevronRight size={16} className="text-primary-600" /> : 
          <ChevronLeft size={16} className="text-primary-600" />
        }
      </motion.button>

      <div className="p-4 h-full flex flex-col overflow-y-auto scrollbar-hide">
        {/* User profile section with animation */}
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 p-4 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl border border-primary-100/50"
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-lg">
                  {user?.name?.charAt(0) || 'U'}
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
                  className="absolute -inset-1 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-xl blur opacity-30"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
            
            {isAdmin() && (
              <Badge variant="outline" className="mt-3 w-full justify-center bg-white/50 border-primary-200">
                <Shield className="w-3 h-3 mr-1 text-primary-600" />
                Administrator
              </Badge>
            )}

            {/* Quick stats */}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="bg-white/50 rounded-lg p-2 text-center">
                <p className="text-xs text-gray-500">Savings</p>
                <p className="text-sm font-semibold text-green-600">$124</p>
              </div>
              <div className="bg-white/50 rounded-lg p-2 text-center">
                <p className="text-xs text-gray-500">Trips</p>
                <p className="text-sm font-semibold">47</p>
              </div>
            </div>
          </motion.div>
        )}

        {collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 flex justify-center"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-lg">
              {user?.name?.charAt(0) || 'U'}
            </div>
          </motion.div>
        )}

        {/* Navigation items */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const isHovered = hoveredItem === item.path;

            return (
              <motion.div
                key={item.path}
                whileHover={{ x: 4 }}
                onHoverStart={() => setHoveredItem(item.path)}
                onHoverEnd={() => setHoveredItem(null)}
              >
                <Link
                  to={item.path}
                  className={`
                    relative flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300
                    ${isActive 
                      ? `bg-gradient-to-r ${item.color} text-white shadow-lg` 
                      : 'text-gray-700 hover:bg-gray-100/50'
                    }
                    ${collapsed ? 'justify-center' : 'justify-between'}
                  `}
                >
                  {/* Active indicator animation */}
                  {isActive && !collapsed && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 w-1 h-6 bg-white rounded-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}

                  <div className="flex items-center">
                    <motion.span
                      animate={{ 
                        rotate: isHovered ? 10 : 0,
                        scale: isHovered ? 1.1 : 1
                      }}
                      className={isActive ? 'text-white' : 'text-gray-400'}
                    >
                      {item.icon}
                    </motion.span>
                    
                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          className="ml-3 flex-1"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>

                  <AnimatePresence>
                    {!collapsed && item.badge && item.badge > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <Badge variant={isActive ? 'secondary' : 'destructive'} className="ml-2">
                          {item.badge}
                        </Badge>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {collapsed && item.badge && item.badge > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"
                    />
                  )}
                </Link>

                {/* Tooltip for collapsed mode */}
                {collapsed && isHovered && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-50"
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold">{item.label}</span>
                      <span className="text-gray-400 text-[10px]">{item.description}</span>
                    </div>
                    <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </nav>

        {/* AI Insights Panel - Only when expanded */}
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 rounded-2xl border border-primary-200/50"
          >
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-4 h-4 text-primary-600" />
              <span className="text-xs font-semibold text-primary-700">AI INSIGHTS</span>
              <Sparkles className="w-3 h-3 text-secondary-500 ml-auto" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Best time to leave</span>
                <span className="font-medium text-primary-700">8:30 AM</span>
              </div>
              <Progress value={75} className="h-1" />
              
              <div className="flex items-center gap-2 mt-2 text-[10px] text-gray-500">
                <Zap className="w-3 h-3" />
                <span>Based on your patterns</span>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-primary-200/50">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Today's prediction</span>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  92% accurate
                </Badge>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.aside>
  );
};

export default Sidebar;