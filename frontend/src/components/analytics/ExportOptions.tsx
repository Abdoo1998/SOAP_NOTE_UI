import React from 'react';
import { Download, FileSpreadsheet, FileText, Image } from 'lucide-react';

interface ExportOptionsProps {
  onExport: (format: 'pdf' | 'csv' | 'image') => void;
}

export const ExportOptions: React.FC<ExportOptionsProps> = ({ onExport }) => {
  return (
    <div className="relative group">
      <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2">
        <Download size={16} />
        Export
      </button>
      
      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 hidden group-hover:block">
        <div className="p-2 space-y-1">
          <button
            onClick={() => onExport('pdf')}
            className="w-full px-3 py-2 text-left flex items-center gap-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <FileText size={16} className="text-red-500" />
            Export as PDF
          </button>
          <button
            onClick={() => onExport('csv')}
            className="w-full px-3 py-2 text-left flex items-center gap-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <FileSpreadsheet size={16} className="text-green-500" />
            Export as CSV
          </button>
          <button
            onClick={() => onExport('image')}
            className="w-full px-3 py-2 text-left flex items-center gap-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Image size={16} className="text-blue-500" />
            Export as Image
          </button>
        </div>
      </div>
    </div>
  );
};