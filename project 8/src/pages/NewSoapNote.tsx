import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Mic } from 'lucide-react';
import { AudioRecorder } from '../components/audio/AudioRecorder';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { SoapNote } from '../components/SoapNote';
import { PatientInfoForm } from '../components/patient/PatientInfoForm';
import { transcribeAudio } from '../services/api';
import { useHistory } from '../hooks/useHistory';
import { useAuth } from '../hooks/useAuth';
import { PageHeader } from '../components/common/PageHeader';

export function NewSoapNote() {
  const { user } = useAuth();
  const { addNote } = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [soapNote, setSoapNote] = useState<string>('');
  const [patientId, setPatientId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [timestamp, setTimestamp] = useState<Date>(new Date());
  const [language, setLanguage] = useState('en');
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAudioReady = async (audioBlob: Blob, selectedLanguage: string) => {
    if (!patientId || !patientName) {
      alert('Please enter patient information before recording.');
      return;
    }

    setIsLoading(true);
    setTimestamp(new Date());
    setLanguage(selectedLanguage);
    setIsSaved(false);
    setError(null);
    
    try {
      const result = await transcribeAudio(audioBlob, selectedLanguage);
      setSoapNote(result);
    } catch (error) {
      setError('Error generating SOAP note. Please try again.');
      console.error('API Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSoapNoteChange = (newContent: string) => {
    setSoapNote(newContent);
    setIsSaved(false);
  };

  const handleSaveToHistory = () => {
    if (!soapNote) return;
    
    addNote({
      patientName,
      patientId,
      content: soapNote,
      language,
      doctor: user!,
    });
    setIsSaved(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Create SOAP Note
        </h1>
        <p className="text-base text-gray-600 dark:text-gray-300">
          Generate a detailed SOAP note from voice recording or manual input
        </p>
      </div>

      <PatientInfoForm
        patientId={patientId}
        patientName={patientName}
        onPatientIdChange={setPatientId}
        onPatientNameChange={setPatientName}
      />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-lg">
              <Mic className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Voice Recording</h2>
              <p className="text-blue-100 text-sm mt-1">Record patient consultation</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <AudioRecorder onAudioReady={handleAudioReady} />
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-lg text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {soapNote && !isLoading && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <SoapNote 
            content={soapNote}
            patientName={patientName}
            patientId={patientId}
            timestamp={timestamp}
            onContentChange={handleSoapNoteChange}
            isLoading={isLoading}
            error={error}
          />
          
          <div className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSaveToHistory}
              disabled={isSaved || !soapNote}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg text-white transition-all duration-300 ${
                isSaved 
                  ? 'bg-green-500 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 shadow-lg hover:shadow-xl'
              }`}
            >
              <Save size={20} />
              {isSaved ? 'Saved to History' : 'Save to History'}
            </motion.button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}