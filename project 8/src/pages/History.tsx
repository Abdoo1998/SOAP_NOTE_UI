import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SearchBar } from '../components/history/SearchBar';
import { HistoryItem } from '../components/history/HistoryItem';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorDisplay } from '../components/common/ErrorDisplay';
import { getSoapNotes } from '../services/api';
import { createErrorDetails } from '../utils/errorUtils';

export const History = () => {
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getSoapNotes();
      setNotes(data);
    } catch (err) {
      const errorDetails = createErrorDetails(err, {
        action: 'Fetching SOAP notes',
        status: err.response?.status
      });
      setError(errorDetails);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const filteredNotes = notes.filter(note => {
    const searchValue = searchTerm.toLowerCase();
    return note.patient_name.toLowerCase().includes(searchValue) ||
           note.patient_id.toLowerCase().includes(searchValue);
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorDisplay 
        error={error}
        onRetry={fetchNotes}
      />
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">SOAP Note History</h2>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <HistoryItem
              key={note.id}
              id={note.id}
              patientName={note.patient_name}
              patientId={note.patient_id}
              createdAt={new Date(note.created_at)}
              content={note.content}
            />
          ))
        ) : (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            {searchTerm ? 'No matching SOAP notes found' : 'No SOAP notes found'}
          </div>
        )}
      </div>
    </motion.div>
  );
};