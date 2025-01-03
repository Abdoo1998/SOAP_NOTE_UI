import React, { useState } from 'react';
import { FileText, Download, Eye, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { exportToWord } from '../../utils/docxExport';
import { AudioPlayer } from '../audio/AudioPlayer';
import { Modal } from '../common/Modal';
import { SoapNote } from '../SoapNote';
import { useHistory } from '../../hooks/useHistory';

interface HistoryItemProps {
  id: string;
  patientName: string;
  patientId: string;
  createdAt: Date;
  content: string;
  audioUrl?: string;
}

export const HistoryItem: React.FC<HistoryItemProps> = ({
  id,
  patientName,
  patientId,
  createdAt,
  content,
  audioUrl
}) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { deleteNote } = useHistory();

  const handleExport = async () => {
    await exportToWord(content, {
      id: patientId,
      name: patientName,
      createdAt
    }, createdAt);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    deleteNote(id);
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <div className="p-6 hover:bg-gray-50 border-b last:border-b-0">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{patientName}</h3>
              <p className="text-sm text-gray-500">Patient ID: {patientId}</p>
              <p className="text-sm text-gray-500 mt-1">
                Created {formatDistanceToNow(createdAt, { addSuffix: true })}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsPreviewOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              <Eye size={20} />
              Preview
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              <Download size={20} />
              Export
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
            >
              <Trash2 size={20} />
              Delete
            </button>
          </div>
        </div>
        
        {audioUrl && (
          <div className="mt-4">
            <AudioPlayer audioUrl={audioUrl} />
          </div>
        )}
      </div>

      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title="SOAP Note Preview"
      >
        <SoapNote
          content={content}
          patientName={patientName}
          patientId={patientId}
          timestamp={createdAt}
          readOnly
        />
      </Modal>

      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Confirm Delete"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete this SOAP note? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};