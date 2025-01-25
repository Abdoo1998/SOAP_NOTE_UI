import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Upload, Send } from 'lucide-react';
import { AudioVisualizer } from './AudioVisualizer';
import { AudioPlayer } from './AudioPlayer';
import { LanguageSelector } from './LanguageSelector';
import { RecordingStatus } from './RecordingStatus';

interface AudioRecorderProps {
  onAudioReady: (audioBlob: Blob, language: string) => void;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({ onAudioReady }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [language, setLanguage] = useState('en');
  const [noiseLevel, setNoiseLevel] = useState(0);
  const [voiceClarity, setVoiceClarity] = useState(85);
  const [micStatus, setMicStatus] = useState(false);
  const [noiseSuppression, setNoiseSuppression] = useState(true);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check microphone availability
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => setMicStatus(true))
      .catch(() => setMicStatus(false));
  }, []);

  // Simulate noise level monitoring
  useEffect(() => {
    if (stream) {
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      
      analyser.fftSize = 256;
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      
      const updateNoiseLevel = () => {
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setNoiseLevel(Math.round(average / 10));
        if (isRecording) {
          requestAnimationFrame(updateNoiseLevel);
        }
      };
      
      updateNoiseLevel();
      
      return () => {
        source.disconnect();
        audioContext.close();
      };
    }
  }, [stream, isRecording]);

  const scrollToBottom = () => {
    if (containerRef.current) {
      window.scrollTo({
        top: containerRef.current.offsetTop + containerRef.current.offsetHeight,
        behavior: 'smooth'
      });
    }
  };

  const startRecording = async () => {
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          noiseSuppression: true,
          echoCancellation: true
        } 
      });
      setStream(audioStream);
      const mediaRecorder = new MediaRecorder(audioStream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(audioUrl);
        onAudioReady(audioBlob, language);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setNoiseSuppression(true);

      // Scroll to bottom after starting recording
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Error accessing microphone. Please ensure you have granted microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      setStream(null);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const audioUrl = URL.createObjectURL(file);
      setRecordedAudioUrl(audioUrl);
      setUploadedFile(file);
    }
  };

  const handleSubmitUpload = () => {
    if (uploadedFile) {
      onAudioReady(uploadedFile, language);
      // Scroll to bottom after submitting
      setTimeout(scrollToBottom, 100);
    }
  };

  return (
    <div ref={containerRef} className="space-y-6">
      <RecordingStatus
        noiseLevel={noiseLevel}
        voiceClarity={voiceClarity}
        micStatus={micStatus}
        noiseSuppression={noiseSuppression}
        storageAvailable={true}
      />

      <div className="flex justify-between items-center">
        <LanguageSelector 
          language={language}
          onLanguageChange={setLanguage}
        />
        
        <div className="flex gap-4">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
              disabled={!micStatus}
            >
              <Mic size={20} />
              Start Recording
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Square size={20} />
              Stop Recording
            </button>
          )}
          
          <label className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg cursor-pointer flex items-center gap-2 transition-colors">
            <Upload size={20} />
            Upload Audio
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>
      
      {stream && <AudioVisualizer stream={stream} />}
      
      {recordedAudioUrl && !isRecording && (
        <div className="space-y-4">
          <AudioPlayer audioUrl={recordedAudioUrl} />
          {uploadedFile && (
            <div className="flex justify-end">
              <button
                onClick={handleSubmitUpload}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Send size={20} />
                Send to Analysis
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};