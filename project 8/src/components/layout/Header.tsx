import React from 'react';
import { Bell, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ThemeToggle } from './ThemeToggle';
import { FadeIn } from '../transitions/FadeIn';
import { SlideIn } from '../transitions/SlideIn';
import { Logo } from './Logo';

export const Header = () => {
  const { user } = useAuth();
  const username = localStorage.getItem('username') || 'Abdelrahman Omran';
  const job = localStorage.getItem('job') || 'Admin';

  return (
    <header className="h-16 bg-white dark:bg-gray-800 shadow-sm fixed top-0 right-0 left-0 lg:left-64 z-10 transition-all duration-300 ease-in-out">
      <div className="h-full px-4 lg:px-6 flex items-center justify-between">
        <SlideIn direction="right" delay={0.1}>
          <Logo />
        </SlideIn>

        <FadeIn delay={0.2}>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full relative transition-all duration-200">
              <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-primary-500 rounded-full"></span>
            </button>

            <div className="hidden sm:flex items-center space-x-3 border-l pl-4 dark:border-gray-700">
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {username}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {job}
                </span>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </header>
  );
};