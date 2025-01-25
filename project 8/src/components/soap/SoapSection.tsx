import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { 
  ChevronDown, 
  Clipboard, 
  Stethoscope, 
  Activity,
  GitBranch,
  ListChecks,
  CheckCircle,
  AlertCircle 
} from 'lucide-react';

interface SoapSectionProps {
  title: string;
  content: string;
  color: string;
  index?: number;
  isLoading?: boolean;
  error?: string;
  icon?: 'clipboard' | 'stethoscope' | 'activity' | 'git-branch' | 'list-checks' | 'check-circle' | 'alert-circle';
  ariaLabel?: string;
}

const icons = {
  clipboard: Clipboard,
  stethoscope: Stethoscope,
  activity: Activity,
  'git-branch': GitBranch,
  'list-checks': ListChecks,
  'check-circle': CheckCircle,
  'alert-circle': AlertCircle
};

export const SoapSection: React.FC<SoapSectionProps> = ({ 
  title, 
  content, 
  color,
  index = 0,
  isLoading = false,
  error,
  icon = 'clipboard',
  ariaLabel
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const Icon = icons[icon];

  const getColorClasses = (color: string) => {
    const classes = {
      'border-blue-500': {
        bg: 'bg-blue-50 dark:bg-blue-900/10',
        text: 'text-blue-700 dark:text-blue-300',
        hover: 'hover:bg-blue-100/50 dark:hover:bg-blue-900/20'
      },
      'border-green-500': {
        bg: 'bg-green-50 dark:bg-green-900/10',
        text: 'text-green-700 dark:text-green-300',
        hover: 'hover:bg-green-100/50 dark:hover:bg-green-900/20'
      },
      'border-yellow-500': {
        bg: 'bg-yellow-50 dark:bg-yellow-900/10',
        text: 'text-yellow-700 dark:text-yellow-300',
        hover: 'hover:bg-yellow-100/50 dark:hover:bg-yellow-900/20'
      },
      'border-red-500': {
        bg: 'bg-red-50 dark:bg-red-900/10',
        text: 'text-red-700 dark:text-red-300',
        hover: 'hover:bg-red-100/50 dark:hover:bg-red-900/20'
      },
      'border-purple-500': {
        bg: 'bg-purple-50 dark:bg-purple-900/10',
        text: 'text-purple-700 dark:text-purple-300',
        hover: 'hover:bg-purple-100/50 dark:hover:bg-purple-900/20'
      },
      'border-indigo-500': {
        bg: 'bg-indigo-50 dark:bg-indigo-900/10',
        text: 'text-indigo-700 dark:text-indigo-300',
        hover: 'hover:bg-indigo-100/50 dark:hover:bg-indigo-900/20'
      },
      'border-teal-500': {
        bg: 'bg-teal-50 dark:bg-teal-900/10',
        text: 'text-teal-700 dark:text-teal-300',
        hover: 'hover:bg-teal-100/50 dark:hover:bg-teal-900/20'
      }
    };

    return classes[color as keyof typeof classes] || classes['border-blue-500'];
  };

  const colorClasses = getColorClasses(color);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`border-l-4 ${color} rounded-lg transition-all duration-300 hover:shadow-md`}
      role="region"
      aria-label={ariaLabel}
    >
      <div className={`${colorClasses.bg} rounded-tr-lg rounded-br-lg transition-colors`}>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full text-left"
          aria-expanded={isExpanded}
          aria-controls={`section-${title.toLowerCase()}`}
        >
          <div className={`flex items-center justify-between p-4 ${colorClasses.hover} rounded-tr-lg transition-colors`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${colorClasses.bg}`}>
                <Icon className={`h-5 w-5 ${colorClasses.text}`} />
              </div>
              <h3 className={`text-lg font-bold ${colorClasses.text}`}>
                {title}
              </h3>
            </div>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className={`h-5 w-5 ${colorClasses.text}`} />
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
              id={`section-${title.toLowerCase()}`}
              className="px-6 pb-4"
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