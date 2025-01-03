import React from 'react';
import ReactMarkdown from 'react-markdown';

interface SoapSectionProps {
  title: string;
  content: string;
  color: string;
}

export const SoapSection: React.FC<SoapSectionProps> = ({ title, content, color }) => {
  const darkModeColors = {
    'border-blue-500': 'dark:border-blue-400',
    'border-green-500': 'dark:border-green-400',
    'border-yellow-500': 'dark:border-yellow-400',
    'border-purple-500': 'dark:border-purple-400',
    'text-blue-500': 'dark:text-blue-400',
    'text-green-500': 'dark:text-green-400',
    'text-yellow-500': 'dark:text-yellow-400',
    'text-purple-500': 'dark:text-purple-400',
  };

  return (
    <div className={`border-l-4 ${color} ${darkModeColors[color]} p-4 mb-4 bg-white dark:bg-gray-800 rounded-lg transition-colors`}>
      <h3 className={`text-lg font-bold mb-2 ${color.replace('border', 'text')} ${darkModeColors[color.replace('border', 'text')]}`}>
        {title}
      </h3>
      <div className="prose dark:prose-invert max-w-none">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
};