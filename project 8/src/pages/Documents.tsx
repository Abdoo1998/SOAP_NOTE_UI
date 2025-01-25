import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  MessageSquare, 
  Filter, 
  SortAsc, 
  Search, 
  Clock, 
  FileType, 
  Calendar,
  Upload,
  X,
  ChevronRight
} from 'lucide-react';
import { DocumentUpload } from '../components/documents/DocumentUpload';
import { DocumentChat } from '../components/documents/DocumentChat';

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: Date;
  status: 'processed' | 'processing' | 'failed';
}

export const Documents = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const handleFileUpload = (file: File) => {
    const newDoc: Document = {
      id: crypto.randomUUID(),
      name: file.name,
      type: file.type,
      size: formatFileSize(file.size),
      uploadedAt: new Date(),
      status: 'processing'
    };
    setDocuments(prev => [newDoc, ...prev]);
    
    // Simulate processing
    setTimeout(() => {
      setDocuments(prev => 
        prev.map(doc => 
          doc.id === newDoc.id ? { ...doc, status: 'processed' } : doc
        )
      );
    }, 2000);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || doc.type.includes(filterType);
    return matchesSearch && matchesType;
  }).sort((a, b) => {
    if (sortBy === 'date') {
      return b.uploadedAt.getTime() - a.uploadedAt.getTime();
    }
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <motion.div 
            initial={{ scale: 0.5, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20 
            }}
            className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-xl shadow-lg"
          >
            <FileText className="h-6 w-6 text-white" />
          </motion.div>
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-2xl font-bold text-gray-900 dark:text-white"
            >
              Document Management
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-600 dark:text-gray-400"
            >
              Upload and analyze patient documents
            </motion.p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-64 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Types</option>
            <option value="application/pdf">PDF</option>
            <option value="image/">Images</option>
            <option value="text/">Text</option>
          </select>

          <button
            onClick={() => setSortBy(prev => prev === 'date' ? 'name' : 'date')}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <SortAsc className="h-5 w-5" />
            Sort by {sortBy === 'date' ? 'Name' : 'Date'}
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <DocumentUpload onUpload={handleFileUpload} />

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Documents
              </h2>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredDocuments.map((doc) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedDocument(doc)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <motion.div 
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 rounded-lg shadow-sm"
                      >
                        <FileType className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </motion.div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                          {doc.name}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {doc.size} • {doc.type.split('/')[1].toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <motion.span 
                        whileHover={{ scale: 1.05 }}
                        className={`px-2 py-1 text-xs rounded-full font-medium ${
                          doc.status === 'processed' 
                            ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                            : doc.status === 'processing'
                            ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                            : 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                        }`}
                      >
                        {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                      </motion.span>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatDate(doc.uploadedAt)}
                      </div>
                      <motion.div
                        whileHover={{ x: 2 }}
                        className="text-gray-400 dark:text-gray-500"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
              {filteredDocuments.length === 0 && (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  No documents found
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <DocumentChat selectedDocument={selectedDocument} />
        </motion.div>
      </div>
    </div>
  );
};

const formatDate = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
};