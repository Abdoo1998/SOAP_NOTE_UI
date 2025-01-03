import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { AudioRecorder } from '../components/audio/AudioRecorder';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { SoapNote } from '../components/SoapNote';
import { PatientInfoForm } from '../components/patient/PatientInfoForm';
import { transcribeAudio } from '../services/api';
import { defaultSoapNote } from '../constants/defaultContent';
import { useHistory } from '../hooks/useHistory';
import { useAuth } from '../hooks/useAuth';
import { PageHeader } from '../components/common/PageHeader';
import { VoiceRecordingSection } from '../components/soap/VoiceRecordingSection';

export function NewSoapNote() {
  const { user } = useAuth();
  const { addNote } = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [soapNote, setSoapNote] = useState<string>(defaultSoapNote);
  const [patientId, setPatientId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [timestamp, setTimestamp] = useState<Date>(new Date());
  const [language, setLanguage] = useState('en');
  const [isSaved, setIsSaved] = useState(false);

  const handleAudioReady = async (audioBlob: Blob, selectedLanguage: string) => {
    if (!patientId || !patientName) {
      alert('Please enter patient information before recording.');
      return;
    }

    setIsLoading(true);
    setTimestamp(new Date());
    setLanguage(selectedLanguage);
    setIsSaved(false);
    
    try {
      const result = await transcribeAudio(audioBlob, selectedLanguage);
      setSoapNote(result);
    } catch (error) {
      alert('Error generating SOAP note. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSoapNoteChange = (newContent: string) => {
    setSoapNote(newContent);
    setIsSaved(false);
  };

  const handleSaveToHistory = () => {
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
    <div className="space-y-6">
      <PageHeader
        title="Generate SOAP Note"
        description="Record patient consultation to automatically generate a detailed SOAP note"
      />

      <PatientInfoForm
        patientId={patientId}
        patientName={patientName}
        onPatientIdChange={setPatientId}
        onPatientNameChange={setPatientName}
      />

      <VoiceRecordingSection onAudioReady={handleAudioReady} />

      {isLoading && (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      )}

      {soapNote && !isLoading && (
        <div className="space-y-4">
          <SoapNote 
            content={soapNote}
            patientName={patientName}
            patientId={patientId}
            timestamp={timestamp}
            onContentChange={handleSoapNoteChange}
          />
          
          <div className="flex justify-end">
            <button
              onClick={handleSaveToHistory}
              disabled={isSaved}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg text-white transition-colors ${
                isSaved 
                  ? 'bg-green-500 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              <Save size={20} />
              {isSaved ? 'Saved to History' : 'Save to History'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}