import React from 'react';
import { Volume2, Mic2, HardDrive, Waves } from 'lucide-react';

interface StatusItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  status: 'excellent' | 'good' | 'poor' | 'standby';
}

const StatusItem: React.FC<StatusItemProps> = ({ icon, label, value, status }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-500';
      case 'good': return 'text-blue-500';
      case 'poor': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
      <div className="text-gray-600">{icon}</div>
      <div>
        <div className="text-sm text-gray-600">{label}</div>
        <div className={`font-semibold ${getStatusColor(status)}`}>{value}</div>
      </div>
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
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Room Status Check</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatusItem
          icon={<Waves size={20} />}
          label="Background Noise"
          value={`${noiseLevel}dB`}
          status={getNoiseStatus(noiseLevel)}
        />
        <StatusItem
          icon={<Volume2 size={20} />}
          label="Voice Clarity"
          value={`${voiceClarity}%`}
          status={getVoiceClarityStatus(voiceClarity)}
        />
        <StatusItem
          icon={<Mic2 size={20} />}
          label="Microphone"
          value={micStatus ? 'Connected' : 'Not Connected'}
          status={micStatus ? 'excellent' : 'poor'}
        />
        <StatusItem
          icon={<Waves size={20} />}
          label="Noise Suppression"
          value={noiseSuppression ? 'Active' : 'Inactive'}
          status={noiseSuppression ? 'excellent' : 'standby'}
        />
        <StatusItem
          icon={<HardDrive size={20} />}
          label="Storage Available"
          value={storageAvailable ? 'Optimal' : 'Low'}
          status={storageAvailable ? 'excellent' : 'poor'}
        />
      </div>
    </div>
  );
};