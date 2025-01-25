import React from 'react';
import { ClipboardList } from 'lucide-react';

interface PatientInfoFormProps {
  patientId: string;
  patientName: string;
  onPatientIdChange: (value: string) => void;
  onPatientNameChange: (value: string) => void;
}

export const PatientInfoForm: React.FC<PatientInfoFormProps> = ({
  patientId,
  patientName,
  onPatientIdChange,
  onPatientNameChange,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center mb-4">
        <ClipboardList className="h-6 w-6 text-blue-500 dark:text-blue-400 mr-2" />
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Patient Information</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="patientId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Patient ID
          </label>
          <input
            type="text"
            id="patientId"
            value={patientId}
            onChange={(e) => onPatientIdChange(e.target.value)}
            className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
            placeholder="Enter patient ID"
          />
        </div>
        <div>
          <label htmlFor="patientName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Patient Name
          </label>
          <input
            type="text"
            id="patientName"
            value={patientName}
            onChange={(e) => onPatientNameChange(e.target.value)}
            className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
            placeholder="Enter patient name"
          />
        </div>
      </div>
    </div>
  );
};