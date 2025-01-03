import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, FileText, History, Settings, LogOut, BarChart2, Heart } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const menuItems = [
  { icon: Home, label: 'Dashboard', path: '/' },
  { icon: FileText, label: 'New SOAP Note', path: '/soap/new' },
  { icon: History, label: 'History', path: '/history' },
  { icon: BarChart2, label: 'Analytics', path: '/analytics' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-64 bg-white dark:bg-gray-800 h-screen shadow-lg fixed left-0 top-0 transition-colors">
      <div className="p-6 border-b dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Heart className="h-8 w-8 text-hospital-600 dark:text-hospital-400" />
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">MedScribe</h2>
        </div>
      </div>

      <div className="py-6">
        <nav className="space-y-1 px-3">
          {menuItems.map((item) => (
            <a
              key={item.label}
              href={item.path}
              className={`flex items-center px-4 py-3 text-gray-700 dark:text-gray-200 rounded-lg transition-colors ${
                location.pathname === item.path 
                  ? 'bg-hospital-50 dark:bg-gray-700 text-hospital-600 dark:text-hospital-400' 
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <item.icon className={`h-5 w-5 mr-3 ${
                location.pathname === item.path
                  ? 'text-hospital-600 dark:text-hospital-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`} />
              <span className="text-sm font-medium">{item.label}</span>
            </a>
          ))}
        </nav>
      </div>

      <div className="absolute bottom-0 w-full p-6 border-t dark:border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-gray-700 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <LogOut className="h-5 w-5 mr-3" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};