import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SoapNoteHeader } from './soap/SoapNoteHeader';
import { SoapNoteEditor } from './soap/SoapNoteEditor';
import { SoapSection } from './soap/SoapSection';
import { parseSoapNote } from '../utils/soapParser';
import { exportToWord } from '../utils/docxExport';
import { PatientInfo } from '../types/patient';

interface SoapNoteProps {
  content: string;
  patientName: string;
  patientId: string;
  timestamp: Date;
  onContentChange?: (content: string) => void;
  readOnly?: boolean;
}

export const SoapNote: React.FC<SoapNoteProps> = ({ 
  content, 
  patientName, 
  patientId, 
  timestamp,
  onContentChange,
  readOnly = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableContent, setEditableContent] = useState(content);

  if (!content) return null;

  const handleExport = async () => {
    const patientInfo: PatientInfo = {
      id: patientId,
      name: patientName,
      createdAt: timestamp
    };
    await exportToWord(content, patientInfo, timestamp);
  };

  const handleSave = () => {
    onContentChange?.(editableContent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditableContent(content);
    setIsEditing(false);
  };

  const sections = parseSoapNote(content);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
    >
      <SoapNoteHeader
        patientName={patientName}
        patientId={patientId}
        timestamp={timestamp}
        isEditing={isEditing}
        readOnly={readOnly}
        onEdit={() => setIsEditing(true)}
        onSave={handleSave}
        onCancel={handleCancel}
        onExport={handleExport}
      />
      
      <div className="p-6">
        <AnimatePresence mode="wait">
          {isEditing && !readOnly ? (
            <motion.div
              key="editor"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <SoapNoteEditor
                content={editableContent}
                onChange={setEditableContent}
              />
            </motion.div>
          ) : (
            <motion.div
              key="viewer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <SoapSection
                title="Subjective"
                content={sections.subjective}
                color="border-blue-500"
                index={0}
              />
              <SoapSection
                title="Objective"
                content={sections.objective}
                color="border-green-500"
                index={1}
              />
              <SoapSection
                title="Assessment"
                content={sections.assessment}
                color="border-yellow-500"
                index={2}
              />
              <SoapSection
                title="Differential Diagnosis"
                content={sections.differentialDiagnosis}
                color="border-purple-500"
                index={3}
              />
              <SoapSection
                title="Plan"
                content={sections.plan}
                color="border-indigo-500"
                index={4}
              />
              <SoapSection
                title="Conclusion"
                content={sections.conclusion}
                color="border-teal-500"
                index={5}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};