import React from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, Clock, TrendingUp, Cpu } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useAnalytics } from '../hooks/useAnalytics';
import { LanguageDistribution } from '../components/dashboard/LanguageDistribution';
import { StatCard } from '../components/dashboard/StatCard';
import { ChartCard } from '../components/dashboard/ChartCard';
import { BarChartCard } from '../components/dashboard/BarChartCard';

export const Dashboard = () => {
  const { user } = useAuth();
  const {
    metrics,
    languageData,
    weeklyData,
    monthlyData,
  } = useAnalytics(user || '');

  // Initialize empty arrays if data is undefined
  const safeLanguageData = languageData || [];
  const safeWeeklyData = weeklyData || [];
  const safeMonthlyData = monthlyData || [];
  const safeMetrics = metrics || {
    totalPatients: 0,
    totalNotes: 0,
    avgProcessingTime: 0,
    successRate: 0
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-gray-900 dark:text-white"
          >
            Dashboard Overview
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 dark:text-gray-400 mt-2"
          >
            Welcome back, Dr. {user}! Here's your activity summary.
          </motion.p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total Patients"
          value={safeMetrics.totalPatients}
          icon={Users}
          trend={{ value: 12, isPositive: true }}
          color="primary"
          delay={0.1}
        />
        <StatCard
          title="Today's Notes"
          value={safeMetrics.totalNotes}
          icon={FileText}
          trend={{ value: 8, isPositive: true }}
          color="success"
          delay={0.2}
        />
        <StatCard
          title="Avg. Processing"
          value={`${safeMetrics.avgProcessingTime}s`}
          icon={Clock}
          trend={{ value: 5, isPositive: false }}
          color="warning"
          delay={0.3}
        />
        <StatCard
          title="Success Rate"
          value={`${safeMetrics.successRate}%`}
          icon={TrendingUp}
          trend={{ value: 3, isPositive: true }}
          color="info"
          delay={0.4}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Weekly Activity"
          data={safeWeeklyData}
          dataKey="value"
          color="#3B82F6"
          gradient={['#93C5FD', '#3B82F6']}
          delay={0.5}
          showExport
        />
        <BarChartCard
          title="Monthly Performance"
          data={safeMonthlyData}
          categories={['notes', 'patients']}
          delay={0.6}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard
            title="24-Hour Performance"
            data={safeWeeklyData}
            dataKey="value"
            color="#8B5CF6"
            gradient={['#C4B5FD', '#8B5CF6']}
            delay={0.7}
          />
        </div>
        <div className="h-[400px]">
          <LanguageDistribution data={safeLanguageData} />
        </div>
      </div>

      {/* OmniCore AI Footer */}
      <div className="flex items-center justify-center pt-8 pb-4">
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <Cpu className="h-4 w-4" />
          <span className="text-sm">Powered by OmniCore AI</span>
        </div>
      </div>
    </motion.div>
  );
};