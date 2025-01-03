import React from 'react';
import { Globe2 } from 'lucide-react';

interface LanguageSelectorProps {
  language: string;
  onLanguageChange: (language: string) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  language,
  onLanguageChange,
}) => {
  return (
    <div className="flex items-center gap-2">
      <Globe2 className="h-5 w-5 text-gray-500" />
      <select
        value={language}
        onChange={(e) => onLanguageChange(e.target.value)}
        className="border rounded-md px-3 py-1.5 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="en">English</option>
        <option value="ar">Arabic</option>
      </select>
    </div>
  );
};