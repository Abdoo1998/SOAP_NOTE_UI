import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, FileText, AlertCircle, Clock, User, ChevronDown, InboxIcon
} from 'lucide-react';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { SoapSection } from '../components/soap/SoapSection';
import { createErrorDetails, logError } from '../utils/errorUtils';

interface CaseAnalysisResponse {
  patient_identifier: string;
  search_by: string;
  number_of_notes: number;
  analysis: string;
}

interface ValidationError {
  loc: string[];
  msg: string;
  type: string;
}

interface AnalysisSections {
  history: string;
  findings: string;
  changes: string;
  concerns: string;
  recommendations: string;
}

export function CaseAnalysis() {
  const [searchParams, setSearchParams] = useState({
    identifier: '',
    searchBy: 'id'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [noNotesFound, setNoNotesFound] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<CaseAnalysisResponse | null>(null);

  const handleSearch = async () => {
    if (!searchParams.identifier.trim()) {
      setError('Please enter a patient identifier');
      return;
    }

    setIsLoading(true);
    setError(null);
    setNoNotesFound(false);
    setAnalysisResult(null);

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }

      const apiUrl = import.meta.env.VITE_API_URL || 'https://api-soap-note.omnicore-hub.com';
      const url = new URL(`${apiUrl}/analyze-patient-case`);
      
      url.searchParams.set('patient_identifier', searchParams.identifier.trim());
      url.searchParams.set('search_by', searchParams.searchBy);

      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      // Check for "No SOAP notes found" message in any error response
      if (data.detail?.includes('No SOAP notes found') || 
          data.message?.includes('No SOAP notes found')) {
        setNoNotesFound(true);
        return;
      }

      // Handle other error cases
      if (!response.ok) {
        let errorMessage: string;
        
        if (response.status === 422 && Array.isArray(data.detail)) {
          const validationErrors = data.detail as ValidationError[];
          errorMessage = validationErrors
            .map(err => `${err.msg} (${err.loc.join('.')})`)
            .join('. ');
        } else {
          errorMessage = data.detail || data.message || `HTTP Error ${response.status}`;
        }

        const errorDetails = createErrorDetails(new Error(errorMessage), {
          status: response.status,
          action: 'Analyzing patient case',
          url: url.toString()
        });

        logError(errorDetails);
        throw new Error(errorMessage);
      }

      if (!data || typeof data.analysis !== 'string') {
        throw new Error('Invalid response format from server');
      }

      setAnalysisResult(data);
    } catch (err) {
      const errorDetails = createErrorDetails(err, {
        action: 'Analyzing patient case',
        url: `${import.meta.env.VITE_API_URL || 'https://api-soap-note.omnicore-hub.com'}/analyze-patient-case`
      });
      
      logError(errorDetails);
      setError(errorDetails.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatAnalysisSection = (text: string): string => {
    return text.split('\n')
      .filter(line => !line.match(/^\d+\./))
      .map(line => line.trim())
      .filter(Boolean)
      .join('\n');
  };

  const parseAnalysis = (analysis: string): AnalysisSections => {
    const sections = {
      history: '',
      findings: '',
      changes: '',
      concerns: '',
      recommendations: ''
    };

    let currentSection = '';
    const lines = analysis.split('\n');

    for (const line of lines) {
      if (line.includes('1. Summary of the Patient\'s Medical History')) {
        currentSection = 'history';
        continue;
      } else if (line.includes('2. Key Findings and Patterns')) {
        currentSection = 'findings';
        continue;
      } else if (line.includes('3. Notable Changes')) {
        currentSection = 'changes';
        continue;
      } else if (line.includes('4. Potential Areas of Concern')) {
        currentSection = 'concerns';
        continue;
      } else if (line.includes('5. Recommendations')) {
        currentSection = 'recommendations';
        continue;
      }

      if (currentSection && line.trim()) {
        sections[currentSection as keyof AnalysisSections] += line + '\n';
      }
    }

    Object.keys(sections).forEach(key => {
      sections[key as keyof AnalysisSections] = formatAnalysisSection(sections[key as keyof AnalysisSections]);
    });

    return sections;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <Search className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Case Analysis
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Search and analyze patient case history
            </p>
          </div>
        </div>
      </motion.div>

      {/* Search Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
          <div className="sm:col-span-6">
            <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Search Patient
            </label>
            <div className="relative">
              <input
                id="identifier"
                type="text"
                value={searchParams.identifier}
                onChange={(e) => setSearchParams(prev => ({ ...prev, identifier: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder={`Enter patient ${searchParams.searchBy === 'id' ? 'ID' : 'name'}`}
              />
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="searchBy" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Search By
            </label>
            <select
              id="searchBy"
              value={searchParams.searchBy}
              onChange={(e) => setSearchParams(prev => ({ ...prev, searchBy: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="id">Patient ID</option>
              <option value="name">Patient Name</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <button
              onClick={handleSearch}
              disabled={isLoading || !searchParams.identifier.trim()}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg flex items-center gap-2"
          >
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </motion.div>
        )}
      </motion.div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      )}

      {/* No Notes Found State */}
      {noNotesFound && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-12 text-center"
        >
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
            <InboxIcon className="h-8 w-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No SOAP Notes Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md">
            No SOAP notes were found for this patient. Please verify the {searchParams.searchBy === 'id' ? 'ID' : 'name'} and try again.
          </p>
        </motion.div>
      )}

      {/* Analysis Results */}
      {analysisResult && !isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Case Analysis Summary
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Patient ID: {analysisResult.patient_identifier} • {analysisResult.number_of_notes} visits analyzed
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {(() => {
                const sections = parseAnalysis(analysisResult.analysis);
                return (
                  <>
                    <SoapSection
                      title="1. Medical History"
                      content={sections.history}
                      color="border-blue-500"
                      index={0}
                      icon="clipboard"
                    />
                    <SoapSection
                      title="2. Key Findings & Patterns"
                      content={sections.findings}
                      color="border-green-500"
                      index={1}
                      icon="activity"
                    />
                    <SoapSection
                      title="3. Notable Changes"
                      content={sections.changes}
                      color="border-yellow-500"
                      index={2}
                      icon="git-branch"
                    />
                    <SoapSection
                      title="4. Areas of Concern"
                      content={sections.concerns}
                      color="border-red-500"
                      index={3}
                      icon="alert-circle"
                    />
                    <SoapSection
                      title="5. Recommendations"
                      content={sections.recommendations}
                      color="border-purple-500"
                      index={4}
                      icon="list-checks"
                    />
                  </>
                );
              })()}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}