import React from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

interface BarChartCardProps {
  title: string;
  data: any[];
  categories: string[];
  delay?: number;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

export const BarChartCard: React.FC<BarChartCardProps> = ({
  title,
  data,
  categories,
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 h-full"
    >
      <div className="flex flex-col h-full p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <motion.h3 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: delay + 0.2 }}
              className="text-lg font-semibold text-gray-900 dark:text-white"
            >
              {title}
            </motion.h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Monthly breakdown of activities
            </p>
          </div>
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: delay + 0.2 }}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <Download size={16} />
            Export
          </motion.button>
        </div>
        
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="rgba(107, 114, 128, 0.2)" 
                className="dark:stroke-gray-700"
                vertical={false}
              />
              <XAxis 
                dataKey="name" 
                stroke="#6B7280"
                tick={{ fill: '#6B7280', fontSize: 12 }}
                tickLine={{ stroke: '#6B7280' }}
                axisLine={{ stroke: '#E5E7EB' }}
                dy={10}
              />
              <YAxis 
                stroke="#6B7280"
                tick={{ fill: '#6B7280', fontSize: 12 }}
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
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                labelStyle={{
                  color: 'var(--tw-text-opacity-90)',
                  fontWeight: 600,
                  marginBottom: '4px'
                }}
                itemStyle={{
                  padding: '2px 0'
                }}
              />
              <Legend 
                formatter={(value) => (
                  <span className="text-gray-700 dark:text-gray-300 capitalize">{value}</span>
                )}
                wrapperStyle={{
                  paddingTop: '20px'
                }}
              />
              {categories.map((category, index) => (
                <Bar
                  key={category}
                  dataKey={category}
                  fill={COLORS[index % COLORS.length]}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};