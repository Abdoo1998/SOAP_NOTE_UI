import React from 'react';
import { DashboardMetrics } from '../components/dashboard/DashboardMetrics';
import { LanguageDistribution } from '../components/dashboard/LanguageDistribution';

const mockMetrics = {
  todayNotes: 15,
  totalNotes: 245,
  avgProcessingTime: 2.8,
  successRate: 99.2,
};

const mockLanguageData = [
  { language: 'English', count: 180 },
  { language: 'Arabic', count: 65 },
];

export function Analytics() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
      <DashboardMetrics metrics={mockMetrics} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LanguageDistribution data={mockLanguageData} />
      </div>
    </div>
  );
}