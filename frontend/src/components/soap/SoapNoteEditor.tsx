import React from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';

interface SoapNoteEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export const SoapNoteEditor: React.FC<SoapNoteEditorProps> = ({
  content,
  onChange,
}) => {
  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800"
      >
        <div className="flex items-center gap-2 mb-2">
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h4 className="font-semibold text-blue-700 dark:text-blue-300">
            Formatting Guide
          </h4>
        </div>
        <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">
          Use markdown headers (##) to separate sections:
        </p>
        <pre className="text-sm bg-blue-100 dark:bg-blue-900/40 p-3 rounded-lg overflow-x-auto text-blue-800 dark:text-blue-200">
{`## Subjective
Patient's reported symptoms...

## Objective
Physical examination findings...

## Assessment
Diagnosis and analysis...

## Plan
Treatment and follow-up...`}
        </pre>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <textarea
          value={content}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-[500px] p-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-gray-900 dark:text-white resize-none"
          placeholder="Start typing your SOAP note..."
        />
      </motion.div>
    </div>
  );
};