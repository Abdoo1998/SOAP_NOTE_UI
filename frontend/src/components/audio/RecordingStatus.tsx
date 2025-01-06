import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Mic2, HardDrive, Waves, Activity, AlertCircle, CheckCircle, Settings } from 'lucide-react';

interface StatusItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  status: 'excellent' | 'good' | 'poor' | 'standby';
  index: number;
  metrics: {
    current: number;
    target: number;
    unit?: string;
  };
}

const StatusItem: React.FC<StatusItemProps> = ({ 
  icon, 
  label, 
  value, 
  status, 
  index,
  metrics 
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const percentage = (metrics.current / metrics.target) * 100;
    setProgress(Math.min(percentage, 100));
  }, [metrics]);

  const getStatusConfig = (status: string) => ({
    excellent: {
      color: 'text-emerald-500 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      border: 'border-emerald-200 dark:border-emerald-800',
      icon: <CheckCircle className="h-4 w-4 text-emerald-500" />,
    },
    good: {
      color: 'text-blue-500 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      icon: <Activity className="h-4 w-4 text-blue-500" />,
    },
    poor: {
      color: 'text-red-500 dark:text-red-400',
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      icon: <AlertCircle className="h-4 w-4 text-red-500" />,
    },
    standby: {
      color: 'text-gray-500 dark:text-gray-400',
      bg: 'bg-gray-50 dark:bg-gray-800',
      border: 'border-gray-200 dark:border-gray-700',
      icon: <Settings className="h-4 w-4 text-gray-500" />,
    }
  })[status];

  const config = getStatusConfig(status);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`relative ${config.bg} rounded-xl border ${config.border} overflow-hidden group hover:shadow-lg transition-all duration-300`}
    >
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className={`p-2 rounded-lg ${config.bg}`}>
            {icon}
          </div>
          {config.icon}
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
            {label}
          </h3>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold ${config.color}`}>
              {value}
            </span>
            <AnimatedWave status={status} />
          </div>
          
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-500 dark:text-gray-400">Current</span>
              <span className={config.color}>{metrics.current}{metrics.unit}</span>
            </div>
            <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full rounded-full ${status === 'excellent' ? 'bg-emerald-500' : 
                  status === 'good' ? 'bg-blue-500' : 
                  status === 'poor' ? 'bg-red-500' : 
                  'bg-gray-500'}`}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const AnimatedWave = ({ status }: { status: string }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          animate={{
            scaleY: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2
          }}
          className={`w-0.5 h-2 rounded-full ${
            status === 'excellent' ? 'bg-emerald-500' :
            status === 'good' ? 'bg-blue-500' :
            status === 'poor' ? 'bg-red-500' :
            'bg-gray-500'
          }`}
        />
      ))}
    </div>
  );
};

interface RecordingStatusProps {
  noiseLevel: number;
  voiceClarity: number;
  micStatus: boolean;
  noiseSuppression: boolean;
  storageAvailable: boolean;
}

export const RecordingStatus: React.FC<RecordingStatusProps> = ({
  noiseLevel,
  voiceClarity,
  micStatus,
  noiseSuppression,
  storageAvailable,
}) => {
  const getNoiseStatus = (level: number) => level <= 5 ? 'excellent' : level <= 15 ? 'good' : 'poor';
  const getVoiceClarityStatus = (clarity: number) => clarity >= 80 ? 'excellent' : clarity >= 60 ? 'good' : 'poor';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl p-6 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Room Status
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Real-time environment monitoring
          </p>
        </div>
        <Activity className="h-5 w-5 text-gray-600 dark:text-gray-300" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatusItem
          icon={<Waves className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
          label="Noise Level"
          value={`${noiseLevel}dB`}
          status={getNoiseStatus(noiseLevel)}
          index={0}
          metrics={{ current: noiseLevel, target: 20, unit: 'dB' }}
        />
        <StatusItem
          icon={<Volume2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />}
          label="Voice Quality"
          value={`${voiceClarity}%`}
          status={getVoiceClarityStatus(voiceClarity)}
          index={1}
          metrics={{ current: voiceClarity, target: 100, unit: '%' }}
        />
        <StatusItem
          icon={<Mic2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />}
          label="Microphone"
          value={micStatus ? 'Active' : 'Inactive'}
          status={micStatus ? 'excellent' : 'poor'}
          index={2}
          metrics={{ current: micStatus ? 100 : 0, target: 100, unit: '%' }}
        />
        <StatusItem
          icon={<Waves className="h-5 w-5 text-orange-600 dark:text-orange-400" />}
          label="Noise Filter"
          value={noiseSuppression ? 'Enabled' : 'Disabled'}
          status={noiseSuppression ? 'excellent' : 'standby'}
          index={3}
          metrics={{ current: noiseSuppression ? 100 : 0, target: 100, unit: '%' }}
        />
        <StatusItem
          icon={<HardDrive className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />}
          label="Storage"
          value={storageAvailable ? 'Available' : 'Low'}
          status={storageAvailable ? 'excellent' : 'poor'}
          index={4}
          metrics={{ current: storageAvailable ? 100 : 20, target: 100, unit: '%' }}
        />
      </div>
    </motion.div>
  );
};