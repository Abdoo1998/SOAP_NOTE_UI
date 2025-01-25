import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface ErrorDisplayProps {
  error: {
    message: string;
    url?: string;
    status?: number;
    timestamp?: Date;
    browser?: string;
    action?: string;
    isRecurring?: boolean;
    systemChanges?: string;
  };
  onRetry?: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onRetry }) => {
  const timestamp = error.timestamp || new Date();
  const browser = error.browser || navigator.userAgent;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg border border-red-200 dark:border-red-800 shadow-lg overflow-hidden"
    >
      {/* Header */}
      <div className="bg-red-50 dark:bg-red-900/20 px-6 py-4 border-b border-red-200 dark:border-red-800">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
          <div>
            <h3 className="text-lg font-semibold text-red-700 dark:text-red-300">
              Resource Not Found
            </h3>
            <p className="text-sm text-red-600 dark:text-red-400">
              Error Code: {error.status || 404}
            </p>
          </div>
        </div>
      </div>

      {/* Error Details */}
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Error Message
          </h4>
          <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
            {error.message}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Request URL
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 break-all">
              {error.url || window.location.href}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Timestamp
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {timestamp.toLocaleString()}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Browser
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {browser}
            </p>
          </div>

          {error.action && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Last Action
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {error.action}
              </p>
            </div>
          )}
        </div>

        {(error.isRecurring || error.systemChanges) && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
            <div className="space-y-2">
              {error.isRecurring && (
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">This is a recurring issue</span>
                </div>
              )}
              {error.systemChanges && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Recent System Changes
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {error.systemChanges}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Go to Homepage
          </button>
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Retry Request
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};