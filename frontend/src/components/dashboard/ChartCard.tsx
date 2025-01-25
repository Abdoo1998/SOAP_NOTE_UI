import React from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

interface ChartCardProps {
  title: string;
  data: any[];
  dataKey: string;
  color?: string;
  gradient?: [string, string];
  delay?: number;
  showExport?: boolean;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  data,
  dataKey,
  color = "#3B82F6",
  gradient = ["#93C5FD", "#3B82F6"],
  delay = 0,
  showExport = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 h-full"
    >
      <div className="flex flex-col h-full p-4 sm:p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <motion.h3 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: delay + 0.2 }}
              className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white"
            >
              {title}
            </motion.h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Activity overview
            </p>
          </div>
          {showExport && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: delay + 0.2 }}
              className="flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <Download size={14} className="sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Export</span>
            </motion.button>
          )}
        </div>
        
        <div className="flex-1 min-h-0 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id={`color${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={gradient[0]} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={gradient[1]} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="rgba(107, 114, 128, 0.2)" 
                vertical={false}
              />
              <XAxis 
                dataKey="name" 
                stroke="#6B7280"
                tick={{ fill: '#6B7280', fontSize: 11 }}
                tickLine={{ stroke: '#6B7280' }}
                axisLine={{ stroke: '#E5E7EB' }}
                dy={10}
              />
              <YAxis 
                stroke="#6B7280"
                tick={{ fill: '#6B7280', fontSize: 11 }}
                tickLine={{ stroke: '#6B7280' }}
                axisLine={{ stroke: '#E5E7EB' }}
                tickFormatter={(value) => `${value}`}
                dx={-10}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--tw-bg-opacity-80)',
                  borderColor: 'var(--tw-border-opacity-20)',
                  borderRadius: '0.5rem',
                  padding: '8px 12px',
                  fontSize: '12px'
                }}
                labelStyle={{
                  color: 'var(--tw-text-opacity-90)',
                  fontWeight: 600,
                  marginBottom: '4px'
                }}
                itemStyle={{
                  color: color,
                  padding: '2px 0'
                }}
              />
              <Area
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                strokeWidth={2}
                fillOpacity={1}
                fill={`url(#color${dataKey})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};