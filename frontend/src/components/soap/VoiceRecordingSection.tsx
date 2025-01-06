import React from 'react';
import { AudioRecorder } from '../audio/AudioRecorder';

interface VoiceRecordingSectionProps {
  onAudioReady: (audioBlob: Blob, language: string) => void;
}

export const VoiceRecordingSection: React.FC<VoiceRecordingSectionProps> = ({ onAudioReady }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
        Voice Recording
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Select your preferred language and start recording or upload an audio file.
      </p>
      <AudioRecorder onAudioReady={onAudioReady} />
    </div>
  );
};