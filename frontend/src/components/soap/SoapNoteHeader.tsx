import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Calendar, User, Download, Edit, Save, X } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';

interface SoapNoteHeaderProps {
  patientName: string;
  patientId: string;
  timestamp: Date;
  isEditing: boolean;
  readOnly: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onExport: () => void;
}

export const SoapNoteHeader: React.FC<SoapNoteHeaderProps> = ({
  patientName,
  patientId,
  timestamp,
  isEditing,
  readOnly,
  onEdit,
  onSave,
  onCancel,
  onExport,
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 px-6 py-4">
      <div className="flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="p-2 bg-white/10 rounded-lg">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">SOAP Note</h2>
            <p className="text-blue-100 text-sm">Last updated {formatDate(timestamp)}</p>
          </div>
        </motion.div>

        {!readOnly && (
          <div className="flex gap-2">
            {!isEditing ? (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex gap-2"
              >
                <button
                  onClick={onEdit}
                  className="flex items-center gap-1 px-3 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button
                  onClick={onExport}
                  className="flex items-center gap-1 px-3 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                >
                  <Download size={16} />
                  Export
                </button>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex gap-2"
              >
                <button
                  onClick={onSave}
                  className="flex items-center gap-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Save size={16} />
                  Save
                </button>
                <button
                  onClick={onCancel}
                  className="flex items-center gap-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <X size={16} />
                  Cancel
                </button>
              </motion.div>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3 bg-white/10 p-3 rounded-lg"
        >
          <User className="h-5 w-5 text-blue-100" />
          <div>
            <p className="text-sm text-blue-100">Patient Name</p>
            <p className="font-semibold text-white">{patientName}</p>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-3 bg-white/10 p-3 rounded-lg"
        >
          <Calendar className="h-5 w-5 text-blue-100" />
          <div>
            <p className="text-sm text-blue-100">Patient ID</p>
            <p className="font-semibold text-white">{patientId}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};