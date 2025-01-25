import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  isHoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  description,
  isHoverable = true,
}) => {
  return (
    <motion.div
      whileHover={isHoverable ? { y: -4 } : undefined}
      className={cn(
        'bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700',
        'shadow-soft transition-all duration-200',
        isHoverable && 'hover:shadow-soft-lg',
        className
      )}
    >
      {(title || description) && (
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
          {title && (
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
              {title}
            </h3>
          )}
          {description && (
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              {description}
            </p>
          )}
        </div>
      )}
      <div className="p-6">{children}</div>
    </motion.div>
  );
};