import axios from 'axios';
import { formatLoginResponse } from '../utils/authUtils';

const API_URL = 'https://api-soap-note.omnicore-hub.com';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle API errors consistently
const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail;
    let message: string;

    if (Array.isArray(detail) && detail.length === 0) {
      message = 'Invalid credentials. Please check your email and password.';
    } else if (detail) {
      message = Array.isArray(detail) ? detail.join('. ') : detail;
    } else if (error.response?.status === 401) {
      message = 'Authentication failed. Please check your credentials.';
    } else if (error.response?.status === 404) {
      message = 'The requested resource was not found.';
    } else if (error.response?.status === 500) {
      message = 'An internal server error occurred. Please try again later.';
    } else {
      message = error.message || 'An unexpected error occurred';
    }

    console.error('API Error:', error.response?.data);
    throw new Error(message);
  }
  throw new Error('Network error occurred. Please check your connection.');
};

// Auth endpoints
export const register = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Registration failed');
    }

    return await response.json();
  } catch (error) {
    throw handleApiError(error);
  }
};

export const login = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }

    const data = await response.json();
    const formattedData = formatLoginResponse(data);
    
    // Store auth data
    if (formattedData.access_token) {
      localStorage.setItem('access_token', formattedData.access_token);
      localStorage.setItem('token_type', formattedData.token_type);
      localStorage.setItem('username', formattedData.username);
      localStorage.setItem('job', formattedData.job);
    }

    return formattedData;
  } catch (error) {
    throw handleApiError(error);
  }
};

// SOAP Notes endpoints
export const createSoapNote = async (note: {
  patient_id: string;
  patient_name: string;
  content: string;
}) => {
  try {
    const response = await fetch(`${API_URL}/soap-notes/`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      },
      body: JSON.stringify(note),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to create SOAP note');
    }

    return await response.json();
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getSoapNotes = async () => {
  try {
    const response = await fetch(`${API_URL}/soap-notes/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to fetch SOAP notes');
    }

    return await response.json();
  } catch (error) {
    throw handleApiError(error);
  }
};

// Transcription endpoint
export const transcribeAudio = async (audioFile: Blob, language: string = 'en') => {
  const formData = new FormData();
  formData.append('file', audioFile);
  formData.append('language', language);

  try {
    const response = await fetch(`${API_URL}/transcribe`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Transcription failed');
    }

    const data = await response.json();
    return data.soap_note;
  } catch (error) {
    throw handleApiError(error);
  }
};