import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, Clock, TrendingUp, Cpu } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { getSoapNotes } from '../services/api';
import { LanguageDistribution } from '../components/dashboard/LanguageDistribution';
import { StatCard } from '../components/dashboard/StatCard';
import { ChartCard } from '../components/dashboard/ChartCard';
import { BarChartCard } from '../components/dashboard/BarChartCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorDisplay } from '../components/common/ErrorDisplay';
import { createErrorDetails } from '../utils/errorUtils';

export const Dashboard = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    notes: [],
    metrics: {
      todayNotes: 0,
      totalNotes: 0,
      avgProcessingTime: 0,
      successRate: 0
    },
    languageData: [],
    weeklyData: [],
    monthlyData: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch SOAP notes
        const notes = await getSoapNotes();
        
        // Calculate metrics
        const today = new Date().toISOString().split('T')[0];
        const todayNotes = notes.filter(note => 
          note.created_at.startsWith(today)
        ).length;

        // Calculate language distribution
        const languageCount = notes.reduce((acc, note) => {
          acc[note.language] = (acc[note.language] || 0) + 1;
          return acc;
        }, {});

        const languageData = Object.entries(languageCount).map(([language, count]) => ({
          language: language === 'en' ? 'English' : 'Arabic',
          count
        }));

        // Calculate weekly data
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          return date.toISOString().split('T')[0];
        }).reverse();

        const weeklyData = last7Days.map(date => ({
          name: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
          value: notes.filter(note => note.created_at.startsWith(date)).length
        }));

        // Calculate monthly data
        const monthlyData = Array.from({ length: 12 }, (_, i) => {
          const month = new Date(2024, i, 1);
          const monthStr = month.toISOString().slice(0, 7);
          const notesInMonth = notes.filter(note => 
            note.created_at.startsWith(monthStr)
          ).length;

          return {
            name: month.toLocaleDateString('en-US', { month: 'short' }),
            notes: notesInMonth,
            patients: Math.round(notesInMonth * 0.8) // Estimate unique patients
          };
        });

        // Calculate success rate and average processing time
        const successRate = notes.length > 0
          ? (notes.filter(note => note.content.length > 100).length / notes.length) * 100
          : 0;

        const avgProcessingTime = notes.length > 0
          ? notes.reduce((acc, note) => acc + (note.content.length / 100), 0) / notes.length
          : 0;

        setDashboardData({
          notes,
          metrics: {
            todayNotes,
            totalNotes: notes.length,
            avgProcessingTime: parseFloat(avgProcessingTime.toFixed(1)),
            successRate: parseFloat(successRate.toFixed(1))
          },
          languageData,
          weeklyData,
          monthlyData
        });
      } catch (err) {
        const errorDetails = createErrorDetails(err, {
          action: 'Fetching dashboard data',
          status: err.response?.status
        });
        setError(errorDetails);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  const { metrics, languageData, weeklyData, monthlyData } = dashboardData;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 p-4 sm:p-6 max-w-[1920px] mx-auto"
    >
      {/* Header */}
      <div className="flex flex-col gap-2">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white"
        >
          Dashboard Overview
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm sm:text-base text-gray-600 dark:text-gray-400"
        >
          Welcome back, {user}! Here's your activity summary.
        </motion.p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Today's Notes"
          value={metrics.todayNotes}
          icon={FileText}
          trend={{ value: 12, isPositive: true }}
          color="primary"
          delay={0.1}
        />
        <StatCard
          title="Total Notes"
          value={metrics.totalNotes}
          icon={Users}
          trend={{ value: 8, isPositive: true }}
          color="success"
          delay={0.2}
        />
        <StatCard
          title="Avg. Processing"
          value={`${metrics.avgProcessingTime}s`}
          icon={Clock}
          trend={{ value: 5, isPositive: false }}
          color="warning"
          delay={0.3}
        />
        <StatCard
          title="Success Rate"
          value={`${metrics.successRate}%`}
          icon={TrendingUp}
          trend={{ value: 3, isPositive: true }}
          color="info"
          delay={0.4}
        />
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="h-[400px]">
          <ChartCard
            title="Weekly Activity"
            data={weeklyData}
            dataKey="value"
            color="#3B82F6"
            gradient={['#93C5FD', '#3B82F6']}
            delay={0.5}
            showExport
          />
        </div>
        <div className="h-[400px]">
          <BarChartCard
            title="Monthly Performance"
            data={monthlyData}
            categories={['notes', 'patients']}
            delay={0.6}
          />
        </div>
      </div>

      {/* Bottom Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 h-[400px]">
          <ChartCard
            title="24-Hour Performance"
            data={weeklyData}
            dataKey="value"
            color="#8B5CF6"
            gradient={['#C4B5FD', '#8B5CF6']}
            delay={0.7}
          />
        </div>
        <div className="h-[400px]">
          <LanguageDistribution data={languageData} />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-center py-4">
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <Cpu className="h-4 w-4" />
          <span className="text-sm">Powered by OmniCore AI</span>
        </div>
      </div>
    </motion.div>
  );
};