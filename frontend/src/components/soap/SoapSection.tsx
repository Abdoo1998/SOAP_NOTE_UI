import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { FileText, ChevronDown, AlertCircle } from 'lucide-react';

interface SoapSectionProps {
  title: string;
  content: string;
  color: string;
  index?: number;
  isLoading?: boolean;
  error?: string;
}

export const SoapSection: React.FC<SoapSectionProps> = ({ 
  title, 
  content, 
  color,
  index = 0,
  isLoading = false,
  error
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const darkModeColors = {
    'border-blue-500': 'dark:border-blue-400',
    'border-green-500': 'dark:border-green-400',
    'border-yellow-500': 'dark:border-yellow-400',
    'border-purple-500': 'dark:border-purple-400',
    'text-blue-500': 'dark:text-blue-400',
    'text-green-500': 'dark:text-green-400',
    'text-yellow-500': 'dark:text-yellow-400',
    'text-purple-500': 'dark:text-purple-400',
    'bg-blue-50': 'dark:bg-blue-900/20',
    'bg-green-50': 'dark:bg-green-900/20',
    'bg-yellow-50': 'dark:bg-yellow-900/20',
    'bg-purple-50': 'dark:bg-purple-900/20',
  };

  const bgColor = `bg-${color.split('-')[1]}-50`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`border-l-4 ${color} ${darkModeColors[color]} rounded-lg transition-all duration-300 hover:shadow-md`}
    >
      <div className={`${bgColor} ${darkModeColors[bgColor]} p-4 rounded-tr-lg rounded-br-lg`}>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <FileText className={`h-5 w-5 ${color.replace('border', 'text')} ${darkModeColors[color.replace('border', 'text')]}`} />
              <h3 className={`text-lg font-bold ${color.replace('border', 'text')} ${darkModeColors[color.replace('border', 'text')]}`}>
                {title}
              </h3>
            </div>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className={`h-5 w-5 ${color.replace('border', 'text')} ${darkModeColors[color.replace('border', 'text')]}`} />
            </motion.div>
          </div>
        </button>

        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {isLoading ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              ) : error ? (
                <div className="flex items-center gap-2 text-red-500 dark:text-red-400">
                  <AlertCircle className="h-5 w-5" />
                  <p>{error}</p>
                </div>
              ) : (
                <div className="prose dark:prose-invert max-w-none">
                  <ReactMarkdown>{content}</ReactMarkdown>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};