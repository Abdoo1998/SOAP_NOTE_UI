import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Clock, TrendingUp, FileText, Calendar,
  Languages, Activity, PieChart, LineChart, BarChart2
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useAnalytics } from '../hooks/useAnalytics';
import { ExportOptions } from '../components/analytics/ExportOptions';
import { LanguageDistribution } from '../components/dashboard/LanguageDistribution';
import { ChartCard } from '../components/dashboard/ChartCard';
import { BarChartCard } from '../components/dashboard/BarChartCard';
import { StatCard } from '../components/dashboard/StatCard';
import { exportToPDF, exportToCSV, exportToImage } from '../utils/exportUtils';

export function Analytics() {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [selectedChart, setSelectedChart] = useState<string | null>(null);
  
  const {
    metrics,
    languageData,
    weeklyData,
    monthlyData,
    hourlyData,
    topHours,
    milestones,
    getFilteredData
  } = useAnalytics(user!, parseInt(selectedPeriod));

  const handleExport = async (format: 'pdf' | 'csv' | 'image') => {
    const data = getFilteredData(selectedPeriod);
    
    switch (format) {
      case 'pdf':
        await exportToPDF('analytics-content');
        break;
      case 'csv':
        exportToCSV(data, 'analytics-report');
        break;
      case 'image':
        await exportToImage('analytics-content');
        break;
    }
  };

  const chartTypes = [
    { id: 'line', icon: LineChart, label: 'Line Chart' },
    { id: 'bar', icon: BarChart2, label: 'Bar Chart' },
    { id: 'pie', icon: PieChart, label: 'Pie Chart' },
  ];

  return (
    <div className="space-y-8" id="analytics-content">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Comprehensive overview of your medical documentation activities
          </p>
        </div>
        <div className="flex gap-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
          >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
            <option value="365">Last Year</option>
          </select>
          <ExportOptions onExport={handleExport} />
        </div>
      </div>

      {/* Chart Type Selection */}
      <div className="flex gap-4">
        {chartTypes.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setSelectedChart(id)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              selectedChart === id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {/* Rest of the components remain the same */}
      {/* ... */}
    </div>
  );
}