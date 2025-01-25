import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'primary' | 'success' | 'warning' | 'info';
  delay?: number;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  color = 'primary',
  delay = 0
}) => {
  const colors = {
    primary: {
      bg: 'bg-primary-50 dark:bg-primary-900/20',
      text: 'text-primary-600 dark:text-primary-400',
      icon: 'text-primary-500 dark:text-primary-400',
      trend: {
        positive: 'text-success-600 dark:text-success-400',
        negative: 'text-error-600 dark:text-error-400'
      }
    },
    success: {
      bg: 'bg-success-50 dark:bg-success-900/20',
      text: 'text-success-600 dark:text-success-400',
      icon: 'text-success-500 dark:text-success-400',
      trend: {
        positive: 'text-success-600 dark:text-success-400',
        negative: 'text-error-600 dark:text-error-400'
      }
    },
    warning: {
      bg: 'bg-warning-50 dark:bg-warning-900/20',
      text: 'text-warning-600 dark:text-warning-400',
      icon: 'text-warning-500 dark:text-warning-400',
      trend: {
        positive: 'text-success-600 dark:text-success-400',
        negative: 'text-error-600 dark:text-error-400'
      }
    },
    info: {
      bg: 'bg-secondary-50 dark:bg-secondary-900/20',
      text: 'text-secondary-600 dark:text-secondary-400',
      icon: 'text-secondary-500 dark:text-secondary-400',
      trend: {
        positive: 'text-success-600 dark:text-success-400',
        negative: 'text-error-600 dark:text-error-400'
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4 }}
      className="card p-6 hover:shadow-soft-lg"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{title}</p>
          <motion.h3 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: delay + 0.2 }}
            className="mt-2 text-2xl font-bold text-neutral-900 dark:text-white"
          >
            {value}
          </motion.h3>
          {trend && (
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: delay + 0.4 }}
              className={`mt-2 text-sm flex items-center gap-1 ${
                trend.isPositive 
                  ? colors[color].trend.positive
                  : colors[color].trend.negative
              }`}
            >
              {trend.isPositive ? '↑' : '↓'}
              <span>{Math.abs(trend.value)}%</span>
              <span className="text-neutral-500 dark:text-neutral-400">vs last month</span>
            </motion.p>
          )}
        </div>
        <motion.div 
          whileHover={{ scale: 1.1, rotate: 5 }}
          className={`p-3 rounded-lg ${colors[color].bg}`}
        >
          <Icon className={`h-6 w-6 ${colors[color].icon}`} />
        </motion.div>
      </div>
    </motion.div>
  );
};