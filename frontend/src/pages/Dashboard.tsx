import React from 'react';
import { DashboardMetrics } from '../components/dashboard/DashboardMetrics';
import { LanguageDistribution } from '../components/dashboard/LanguageDistribution';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import { useDashboardMetrics } from '../hooks/useDashboardMetrics';
import { useAuth } from '../hooks/useAuth';
import { PageHeader } from '../components/common/PageHeader';

export const Dashboard = () => {
  const { user } = useAuth();
  const { metrics, languageData, recentActivity } = useDashboardMetrics(user!);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Dashboard"
        description="Overview of your SOAP notes and activity"
      />
      
      <DashboardMetrics metrics={metrics} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LanguageDistribution data={languageData} />
        <RecentActivity activities={recentActivity} />
      </div>
    </div>
  );
};