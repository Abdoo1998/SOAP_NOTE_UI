import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  FileText,
  History,
  Settings,
  LogOut,
  Heart,
  ChevronRight,
  HelpCircle,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const menuItems = [
  {
    icon: Home,
    label: 'Dashboard',
    path: '/',
    description: 'Overview and analytics'
  },
  {
    icon: FileText,
    label: 'New SOAP Note',
    path: '/soap/new',
    description: 'Create a new note'
  },
  {
    icon: History,
    label: 'History',
    path: '/history',
    description: 'View past notes'
  }
];

const bottomMenuItems = [
  {
    icon: HelpCircle,
    label: 'Help & Support',
    path: '/support',
    description: 'Get assistance and resources'
  },
  {
    icon: Settings,
    label: 'Settings',
    path: '/settings'
  }
];

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const MenuItem = ({
    icon: Icon,
    label,
    path,
    description,
    isBottom = false
  }: {
    icon: any;
    label: string;
    path: string;
    description?: string;
    isBottom?: boolean;
  }) => {
    const isActive = location.pathname === path;

    return (
      <Link
        to={path}
        className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group relative
          ${isActive
            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
          }
          ${isBottom ? 'mt-1' : ''}
        `}
      >
        <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600 dark:text-blue-400' : ''}`} />

        <AnimatePresence>
          {(!isCollapsed || isMobileOpen) && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="flex-1 whitespace-nowrap"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{label}</span>
              </div>
              {description && !isBottom && (
                <p className={`text-sm mt-0.5 ${isActive
                  ? 'text-blue-500 dark:text-blue-300'
                  : 'text-gray-500 dark:text-gray-400'
                  }`}>
                  {description}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Link>
    );
  };

  return (
    <>
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        {isMobileOpen ? (
          <X className="h-6 w-6 text-gray-600 dark:text-gray-300" />
        ) : (
          <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
        )}
      </button>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.div
        className={`fixed left-0 top-0 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-300 z-40
          ${isCollapsed && !isMobileOpen ? 'w-20' : 'w-64'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        animate={{
          width: (isCollapsed && !isMobileOpen) ? 80 : 256,
          x: isMobileOpen || window.innerWidth > 1024 ? 0 : -256
        }}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Heart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <AnimatePresence>
                {(!isCollapsed || isMobileOpen) && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                  >
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">MedGenScribe</h2>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <MenuItem key={item.path} {...item} />
              ))}
            </nav>
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <nav className="space-y-1">
              {bottomMenuItems.map((item) => (
                <MenuItem key={item.path} {...item} isBottom />
              ))}

              <motion.button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-3 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <LogOut className="h-5 w-5" />
                {(!isCollapsed || isMobileOpen) && <span className="font-medium">Logout</span>}
              </motion.button>
            </nav>
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-4 top-1/2 transform -translate-y-1/2 p-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors hidden lg:block"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronRight
              className={`h-4 w-4 text-gray-600 dark:text-gray-300 transition-transform duration-200 ${isCollapsed ? 'rotate-0' : 'rotate-180'
                }`}
            />
          </button>
        </div>
      </motion.div>
    </>
  );
};