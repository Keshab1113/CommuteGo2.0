// frontend/src/components/layout/Sidebar.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
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
  Shield
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

const Sidebar = () => {
  const { user, isAdmin } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [unreadAlerts, setUnreadAlerts] = useState(3); // This would come from API

  const navItems = [
    { icon: <Home size={20} />, label: 'Dashboard', path: '/' },
    { icon: <Map size={20} />, label: 'Plan Commute', path: '/plan' },
    { icon: <History size={20} />, label: 'History', path: '/history' },
    { icon: <Bell size={20} />, label: 'Alerts', path: '/alerts', badge: unreadAlerts },
    { icon: <User size={20} />, label: 'Profile', path: '/profile' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
    ...(isAdmin() ? [
      { icon: <Shield size={20} />, label: 'Admin', path: '/admin' },
      { icon: <BarChart3 size={20} />, label: 'Analytics', path: '/admin/analytics' }
    ] : []),
  ];

  return (
    <aside className={`
      bg-white border-r border-gray-200 h-[calc(100vh-64px)] 
      sticky top-16 transition-all duration-300
      ${collapsed ? 'w-20' : 'w-64'}
    `}>
      <div className="p-4 h-full flex flex-col">
        <Button
          variant="ghost"
          size="sm"
          className="w-full mb-4 justify-start"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!collapsed && <span className="ml-2">Collapse</span>}
        </Button>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
                  ${isActive 
                    ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                  ${collapsed ? 'justify-center' : 'justify-between'}
                `}
              >
                <div className="flex items-center">
                  <span className={isActive ? 'text-primary-600' : 'text-gray-500'}>
                    {item.icon}
                  </span>
                  {!collapsed && <span className="ml-3">{item.label}</span>}
                </div>
                
                {!collapsed && item.badge && item.badge > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {item.badge}
                  </Badge>
                )}
                
                {collapsed && item.badge && item.badge > 0 && (
                  <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {!collapsed && (
          <div className="mt-6 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
            {isAdmin() && (
              <Badge variant="outline" className="mt-2 w-full justify-center">
                Admin
              </Badge>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;