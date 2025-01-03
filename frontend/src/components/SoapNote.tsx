import React, { useState } from 'react';
import { FileText, Calendar, User, Download, Edit, Save, X } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';
import { exportToWord } from '../utils/docxExport';
import { PatientInfo } from '../types/patient';
import { SoapSection } from './soap/SoapSection';
import { parseSoapNote } from '../utils/soapParser';

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
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-blue-500 px-6 py-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <FileText className="mr-2" />
          SOAP Note
        </h2>
        {!readOnly && (
          <div className="flex gap-2">
            {!isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1 px-3 py-1 bg-white text-blue-500 rounded hover:bg-blue-50"
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button
                  onClick={handleExport}
                  className="flex items-center gap-1 px-3 py-1 bg-white text-blue-500 rounded hover:bg-blue-50"
                >
                  <Download size={16} />
                  Export
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1 px-3 py-1 bg-white text-green-500 rounded hover:bg-blue-50"
                >
                  <Save size={16} />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-1 px-3 py-1 bg-white text-red-500 rounded hover:bg-blue-50"
                >
                  <X size={16} />
                  Cancel
                </button>
              </>
            )}
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center text-gray-600">
            <User className="h-5 w-5 mr-2" />
            <div>
              <p className="text-sm font-medium text-gray-500">Patient Name</p>
              <p className="font-semibold">{patientName}</p>
            </div>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Calendar className="h-5 w-5 mr-2" />
            <div>
              <p className="text-sm font-medium text-gray-500">Date & Time</p>
              <p className="font-semibold">{formatDate(timestamp)}</p>
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          {isEditing && !readOnly ? (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-700 mb-2">Formatting Guide</h4>
                <p className="text-sm text-blue-600">
                  Use markdown headers (##) to separate sections:
                </p>
                <pre className="mt-2 text-sm text-blue-800 bg-blue-100 p-2 rounded">
{`## Subjective
Patient's reported symptoms...

## Objective
Physical examination findings...

## Assessment
Diagnosis and analysis...

## Plan
Treatment and follow-up...`}</pre>
              </div>
              <textarea
                value={editableContent}
                onChange={(e) => setEditableContent(e.target.value)}
                className="w-full h-96 p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                placeholder="Start typing your SOAP note..."
              />
            </div>
          ) : (
            <div className="space-y-6">
              <SoapSection
                title="Subjective"
                content={sections.subjective}
                color="border-blue-500"
              />
              <SoapSection
                title="Objective"
                content={sections.objective}
                color="border-green-500"
              />
              <SoapSection
                title="Assessment"
                content={sections.assessment}
                color="border-yellow-500"
              />
              <SoapSection
                title="Plan"
                content={sections.plan}
                color="border-purple-500"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};