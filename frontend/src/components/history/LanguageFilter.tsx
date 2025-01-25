import React from 'react';

interface LanguageFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export const LanguageFilter: React.FC<LanguageFilterProps> = ({ value, onChange }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    >
      <option value="all">All Languages</option>
      <option value="en">English</option>
      <option value="ar">Arabic</option>
    </select>
  );
};