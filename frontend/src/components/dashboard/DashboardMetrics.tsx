import React from 'react';
import { TrendingUp, TrendingDown, Clock, CheckCircle } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: {
    value: number;
    isIncrease: boolean;
    period: string;
  };
  icon: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, trend, icon }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <div className="text-blue-500">{icon}</div>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className={`text-sm ${trend.isIncrease ? 'text-green-500' : 'text-red-500'} flex items-center mt-1`}>
              {trend.isIncrease ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span className="ml-1">{trend.value}% {trend.period}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

interface DashboardMetricsProps {
  metrics: {
    todayNotes: number;
    totalNotes: number;
    avgProcessingTime: number;
    successRate: number;
  };
}

export const DashboardMetrics: React.FC<DashboardMetricsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Today's Notes"
        value={metrics.todayNotes}
        trend={{ value: 5, isIncrease: true, period: 'vs yesterday' }}
        icon={<TrendingUp size={24} />}
      />
      <MetricCard
        title="Total Notes"
        value={metrics.totalNotes}
        trend={{ value: 12, isIncrease: true, period: 'all time' }}
        icon={<CheckCircle size={24} />}
      />
      <MetricCard
        title="Avg. Processing Time"
        value={`${metrics.avgProcessingTime.toFixed(1)}s`}
        trend={{ value: 8, isIncrease: false, period: 'per note' }}
        icon={<Clock size={24} />}
      />
      <MetricCard
        title="Success Rate"
        value={`${metrics.successRate.toFixed(1)}%`}
        trend={{ value: 3, isIncrease: true, period: 'last 30 days' }}
        icon={<CheckCircle size={24} />}
      />
    </div>
  );
};