import React, { useState, useMemo } from 'react';
import { SearchBar } from '../components/history/SearchBar';
import { HistoryItem } from '../components/history/HistoryItem';
import { useHistory } from '../hooks/useHistory';
import { useAuth } from '../hooks/useAuth';

export const History = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const { getNotesByDoctor } = useHistory();

  const userNotes = getNotesByDoctor(user!);

  const filteredNotes = useMemo(() => {
    return userNotes.filter(note => {
      const searchValue = searchTerm.toLowerCase();
      return note.patientName.toLowerCase().includes(searchValue) ||
             note.patientId.toLowerCase().includes(searchValue);
    });
  }, [userNotes, searchTerm]);

  return (
    <div className="space-y-6">
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
              patientName={note.patientName}
              patientId={note.patientId}
              createdAt={new Date(note.createdAt)}
              content={note.content}
            />
          ))
        ) : (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            No SOAP notes found
          </div>
        )}
      </div>
    </div>
  );
};