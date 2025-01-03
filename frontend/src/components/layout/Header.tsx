import React from 'react';
import { Bell, User, Heart } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ThemeToggle } from './ThemeToggle';
import { FadeIn } from '../transitions/FadeIn';
import { SlideIn } from '../transitions/SlideIn';

export const Header = () => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white dark:bg-gray-800 shadow-sm fixed top-0 right-0 left-64 z-10 transition-all duration-300 ease-in-out">
      <div className="h-full px-6 flex items-center justify-between">
        <SlideIn direction="right" delay={0.1}>
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-hospital-600 dark:text-hospital-400" />
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
              Medical Dashboard
            </h1>
          </div>
        </SlideIn>

        <FadeIn delay={0.2}>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full relative transition-all duration-200">
              <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-hospital-500 rounded-full"></span>
            </button>

            <div className="flex items-center space-x-3 border-l pl-4 dark:border-gray-700">
              <div className="w-8 h-8 bg-hospital-500 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Dr. {user}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Physician
                </span>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </header>
  );
};