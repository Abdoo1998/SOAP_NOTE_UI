import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Volume2, 
  Mic2, 
  HardDrive, 
  Waves, 
  Activity, 
  AlertCircle, 
  CheckCircle, 
  Settings,
  Wifi,
  Cpu,
  Thermometer,
  Signal
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

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
  const { isDark } = useTheme();

  useEffect(() => {
    const percentage = (metrics.current / metrics.target) * 100;
    setProgress(Math.min(percentage, 100));
  }, [metrics]);

  const getStatusConfig = (status: string) => ({
    excellent: {
      color: isDark ? 'text-emerald-400' : 'text-emerald-600',
      bg: isDark ? 'bg-emerald-900/20' : 'bg-emerald-50',
      border: isDark ? 'border-emerald-800' : 'border-emerald-200',
      icon: <CheckCircle className={`h-4 w-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />,
      progress: isDark ? 'bg-emerald-400' : 'bg-emerald-600'
    },
    good: {
      color: isDark ? 'text-blue-400' : 'text-blue-600',
      bg: isDark ? 'bg-blue-900/20' : 'bg-blue-50',
      border: isDark ? 'border-blue-800' : 'border-blue-200',
      icon: <Activity className={`h-4 w-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />,
      progress: isDark ? 'bg-blue-400' : 'bg-blue-600'
    },
    poor: {
      color: isDark ? 'text-red-400' : 'text-red-600',
      bg: isDark ? 'bg-red-900/20' : 'bg-red-50',
      border: isDark ? 'border-red-800' : 'border-red-200',
      icon: <AlertCircle className={`h-4 w-4 ${isDark ? 'text-red-400' : 'text-red-600'}`} />,
      progress: isDark ? 'bg-red-400' : 'bg-red-600'
    },
    standby: {
      color: isDark ? 'text-gray-400' : 'text-gray-600',
      bg: isDark ? 'bg-gray-800' : 'bg-gray-50',
      border: isDark ? 'border-gray-700' : 'border-gray-200',
      icon: <Settings className={`h-4 w-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />,
      progress: isDark ? 'bg-gray-400' : 'bg-gray-600'
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
          <h3 className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
            {label}
          </h3>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold ${config.color}`}>
              {value}
            </span>
            <AnimatedWave status={status} isDark={isDark} />
          </div>
          
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Current</span>
              <span className={config.color}>{metrics.current}{metrics.unit}</span>
            </div>
            <div className={`h-1.5 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full rounded-full ${config.progress}`}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const AnimatedWave = ({ status, isDark }: { status: string; isDark: boolean }) => {
  const getStatusColor = (status: string) => {
    const colors = {
      excellent: isDark ? 'bg-emerald-400' : 'bg-emerald-600',
      good: isDark ? 'bg-blue-400' : 'bg-blue-600',
      poor: isDark ? 'bg-red-400' : 'bg-red-600',
      standby: isDark ? 'bg-gray-400' : 'bg-gray-600'
    };
    return colors[status as keyof typeof colors] || colors.standby;
  };

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
          className={`w-0.5 h-2 rounded-full ${getStatusColor(status)}`}
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
  const { isDark } = useTheme();
  const [networkLatency, setNetworkLatency] = useState(25); // ms
  const [cpuUsage, setCpuUsage] = useState(45); // %
  const [roomTemp, setRoomTemp] = useState(22.5); // °C
  const [signalStrength, setSignalStrength] = useState(85); // %

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setNetworkLatency(prev => Math.max(15, Math.min(100, prev + (Math.random() - 0.5) * 10)));
      setCpuUsage(prev => Math.max(20, Math.min(90, prev + (Math.random() - 0.5) * 5)));
      setRoomTemp(prev => Math.max(20, Math.min(25, prev + (Math.random() - 0.5) * 0.5)));
      setSignalStrength(prev => Math.max(60, Math.min(100, prev + (Math.random() - 0.5) * 3)));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getNoiseStatus = (level: number) => level <= 5 ? 'excellent' : level <= 15 ? 'good' : 'poor';
  const getVoiceClarityStatus = (clarity: number) => clarity >= 80 ? 'excellent' : clarity >= 60 ? 'good' : 'poor';
  const getLatencyStatus = (latency: number) => latency <= 30 ? 'excellent' : latency <= 50 ? 'good' : 'poor';
  const getCpuStatus = (usage: number) => usage <= 50 ? 'excellent' : usage <= 75 ? 'good' : 'poor';
  const getTempStatus = (temp: number) => temp >= 20 && temp <= 24 ? 'excellent' : temp <= 26 ? 'good' : 'poor';
  const getSignalStatus = (strength: number) => strength >= 80 ? 'excellent' : strength >= 60 ? 'good' : 'poor';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${
        isDark ? 'bg-gray-800/50' : 'bg-white/50'
      } backdrop-blur-xl p-6 rounded-2xl border ${
        isDark ? 'border-gray-700/50' : 'border-gray-200/50'
      } shadow-xl`}
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className={`text-xl font-bold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Room Status
          </h3>
          <p className={`text-sm ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          } mt-1`}>
            Real-time environment monitoring
          </p>
        </div>
        <Activity className={`h-5 w-5 ${
          isDark ? 'text-gray-300' : 'text-gray-600'
        }`} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusItem
          icon={<Waves className={`h-5 w-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />}
          label="Noise Level"
          value={`${noiseLevel}dB`}
          status={getNoiseStatus(noiseLevel)}
          index={0}
          metrics={{ current: noiseLevel, target: 20, unit: 'dB' }}
        />
        <StatusItem
          icon={<Volume2 className={`h-5 w-5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />}
          label="Voice Quality"
          value={`${voiceClarity}%`}
          status={getVoiceClarityStatus(voiceClarity)}
          index={1}
          metrics={{ current: voiceClarity, target: 100, unit: '%' }}
        />
        <StatusItem
          icon={<Wifi className={`h-5 w-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />}
          label="Network Latency"
          value={`${Math.round(networkLatency)}ms`}
          status={getLatencyStatus(networkLatency)}
          index={2}
          metrics={{ current: networkLatency, target: 100, unit: 'ms' }}
        />
        <StatusItem
          icon={<Cpu className={`h-5 w-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />}
          label="CPU Usage"
          value={`${Math.round(cpuUsage)}%`}
          status={getCpuStatus(cpuUsage)}
          index={3}
          metrics={{ current: cpuUsage, target: 100, unit: '%' }}
        />
        <StatusItem
          icon={<Thermometer className={`h-5 w-5 ${isDark ? 'text-orange-400' : 'text-orange-600'}`} />}
          label="Room Temperature"
          value={`${roomTemp.toFixed(1)}°C`}
          status={getTempStatus(roomTemp)}
          index={4}
          metrics={{ current: roomTemp, target: 30, unit: '°C' }}
        />
        <StatusItem
          icon={<Signal className={`h-5 w-5 ${isDark ? 'text-green-400' : 'text-green-600'}`} />}
          label="Signal Strength"
          value={`${Math.round(signalStrength)}%`}
          status={getSignalStatus(signalStrength)}
          index={5}
          metrics={{ current: signalStrength, target: 100, unit: '%' }}
        />
        <StatusItem
          icon={<Mic2 className={`h-5 w-5 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />}
          label="Microphone"
          value={micStatus ? 'Active' : 'Inactive'}
          status={micStatus ? 'excellent' : 'poor'}
          index={6}
          metrics={{ current: micStatus ? 100 : 0, target: 100, unit: '%' }}
        />
        <StatusItem
          icon={<HardDrive className={`h-5 w-5 ${isDark ? 'text-pink-400' : 'text-pink-600'}`} />}
          label="Storage"
          value={storageAvailable ? 'Available' : 'Low'}
          status={storageAvailable ? 'excellent' : 'poor'}
          index={7}
          metrics={{ current: storageAvailable ? 100 : 20, target: 100, unit: '%' }}
        />
      </div>
    </motion.div>
  );
};