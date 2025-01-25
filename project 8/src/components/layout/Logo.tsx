import React from 'react';

export const Logo = () => {
  return (
    <div className="flex items-center gap-3">
      <img 
        src="/logo.svg" 
        alt="OmniDoc" 
        className="h-12 w-auto"
      />
      <div className="hidden md:block">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
          OmniDoc
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Medical Platform
        </p>
      </div>
    </div>
  );
};