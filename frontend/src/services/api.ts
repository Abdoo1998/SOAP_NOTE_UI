import axios from 'axios';

interface SoapNoteResponse {
  soap_note: string;
}

const API_URL = 'https://api-soap-note.omnicore-hub.com/transcribe';

export const transcribeAudio = async (audioFile: Blob, language: string = 'en') => {
  const formData = new FormData();
  formData.append('file', audioFile);
  formData.append('language', language);

  try {
    const response = await axios.post<SoapNoteResponse>(API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // The API returns the SOAP note as a string, so we can use it directly
    return response.data.soap_note;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw error;
  }
};