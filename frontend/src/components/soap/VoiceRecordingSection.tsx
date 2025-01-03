import React from 'react';
import { AudioRecorder } from '../audio/AudioRecorder';

interface VoiceRecordingSectionProps {
  onAudioReady: (audioBlob: Blob, language: string) => void;
}

export const VoiceRecordingSection: React.FC<VoiceRecordingSectionProps> = ({ onAudioReady }) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">
        Voice Recording
      </h2>
      <p className="text-gray-600 mb-6">
        Select your preferred language and start recording or upload an audio file.
      </p>
      <AudioRecorder onAudioReady={onAudioReady} />
    </div>
  );
};