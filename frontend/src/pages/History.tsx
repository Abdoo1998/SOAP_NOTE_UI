import React, { useState, useMemo } from 'react';
import { SearchBar } from '../components/history/SearchBar';
import { LanguageFilter } from '../components/history/LanguageFilter';
import { HistoryItem } from '../components/history/HistoryItem';
import { useHistory } from '../hooks/useHistory';
import { useAuth } from '../hooks/useAuth';

export const History = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const { user } = useAuth();
  const { getNotesByDoctor } = useHistory();

  const userNotes = getNotesByDoctor(user!);

  const filteredNotes = useMemo(() => {
    return userNotes.filter(note => {
      const searchValue = searchTerm.toLowerCase();
      const matchesSearch = 
        note.patientName.toLowerCase().includes(searchValue) ||
        note.patientId.toLowerCase().includes(searchValue);
      const matchesLanguage = selectedLanguage === 'all' || note.language === selectedLanguage;
      return matchesSearch && matchesLanguage;
    });
  }, [userNotes, searchTerm, selectedLanguage]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">SOAP Note History</h2>
        
        <div className="flex gap-4">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
          />
          
          <LanguageFilter
            value={selectedLanguage}
            onChange={setSelectedLanguage}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow divide-y">
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
          <div className="p-6 text-center text-gray-500">
            No SOAP notes found
          </div>
        )}
      </div>
    </div>
  );
};