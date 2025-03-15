import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getUserTranscripts, deleteTranscript } from '../store/slices/transcriptSlice';
import {
  DocumentTextIcon,
  TrashIcon,
  PencilIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';

const TranscriptsPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { transcripts, isLoading } = useSelector((state) => state.transcript);
  const { tier } = useSelector((state) => state.subscription);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Fetch transcripts when component mounts
  useEffect(() => {
    if (user?.uid) {
      dispatch(getUserTranscripts(user.uid));
    }
  }, [dispatch, user]);

  // Filter and sort transcripts
  const filteredTranscripts = transcripts
    .filter(transcript => {
      // Search query filter
      const matchesSearch = transcript.text.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Language filter
      const matchesLanguage = !selectedLanguage || transcript.language === selectedLanguage;
      
      return matchesSearch && matchesLanguage;
    })
    .sort((a, b) => {
      // Sort by date or duration
      if (sortBy === 'date') {
        return sortDirection === 'desc'
          ? new Date(b.timestamp) - new Date(a.timestamp)
          : new Date(a.timestamp) - new Date(b.timestamp);
      } else if (sortBy === 'duration') {
        return sortDirection === 'desc'
          ? b.audioLength - a.audioLength
          : a.audioLength - b.audioLength;
      }
      return 0;
    });

  // Get unique languages for the filter dropdown
  const languages = [...new Set(transcripts.map(t => t.language))];
  
  // Format date for display
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Format time duration
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Handle delete transcript
  const handleDelete = (id) => {
    if (confirmDelete === id) {
      dispatch(deleteTranscript(id));
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
    }
  };

  // Format language code for display
  const formatLanguage = (code) => {
    const languages = {
      en: 'English',
      es: 'Spanish',
      fr: 'French',
      de: 'German',
      it: 'Italian',
      pt: 'Portuguese',
      nl: 'Dutch',
      ru: 'Russian',
      zh: 'Chinese',
      ja: 'Japanese',
      ko: 'Korean',
      ar: 'Arabic',
      hi: 'Hindi',
      // Add more as needed
    };
    return languages[code] || code;
  };

  // Export transcript (placeholder for actual export functionality)
  const handleExport = (transcript, format) => {
    const filename = `transcript-${new Date(transcript.timestamp).toISOString().slice(0, 10)}`;
    
    // In a real app, this would generate proper file content and trigger a download
    let content = transcript.text;
    
    // Create a blob and trigger download
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.${format.toLowerCase()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full mx-auto text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Transcripts</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          {filteredTranscripts.length} {filteredTranscripts.length === 1 ? 'transcript' : 'transcripts'} saved
        </p>
      </div>
      
      {/* Search and filter controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search transcripts..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative inline-block">
              <div className="flex items-center">
                <FunnelIcon className="mr-1 h-5 w-5 text-gray-400" />
                <select
                  className="block w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                >
                  <option value="">All languages</option>
                  {languages.map(lang => (
                    <option key={lang} value={lang}>{formatLanguage(lang)}</option>
                  ))}
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
            
            <div className="relative inline-block">
              <select
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                value={`${sortBy}-${sortDirection}`}
                onChange={(e) => {
                  const [newSortBy, newSortDirection] = e.target.value.split('-');
                  setSortBy(newSortBy);
                  setSortDirection(newSortDirection);
                }}
              >
                <option value="date-desc">Newest first</option>
                <option value="date-asc">Oldest first</option>
                <option value="duration-desc">Longest first</option>
                <option value="duration-asc">Shortest first</option>
              </select>
              <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Transcripts list */}
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredTranscripts.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No transcripts found</h3>
            {transcripts.length > 0 ? (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Try adjusting your search or filter criteria
              </p>
            ) : (
              <div className="mt-3">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  You don't have any saved transcripts yet
                </p>
                <Link
                  to="/dashboard"
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Create Your First Transcript
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredTranscripts.map((transcript) => (
              <div
                key={transcript.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        {formatLanguage(transcript.language)}
                        {transcript.isEdited && (
                          <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">(edited)</span>
                        )}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(transcript.timestamp)} • {formatDuration(transcript.audioLength)}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <div className="relative group">
                        <button
                          className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                          onClick={() => {
                            // Toggle a dropdown menu for export formats
                            const menu = document.getElementById(`export-menu-${transcript.id}`);
                            if (menu) {
                              menu.classList.toggle('hidden');
                            }
                          }}
                        >
                          <ArrowDownTrayIcon className="h-5 w-5" />
                        </button>
                        <div
                          id={`export-menu-${transcript.id}`}
                          className="hidden absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-md ring-1 ring-black ring-opacity-5 z-10"
                        >
                          <div className="py-1" role="menu">
                            <button
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                              role="menuitem"
                              onClick={() => handleExport(transcript, 'TXT')}
                            >
                              Export as TXT
                            </button>
                            {tier !== 'free' && (
                              <>
                                <button
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                  role="menuitem"
                                  onClick={() => handleExport(transcript, 'DOCX')}
                                >
                                  Export as DOCX
                                </button>
                                <button
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                  role="menuitem"
                                  onClick={() => handleExport(transcript, 'PDF')}
                                >
                                  Export as PDF
                                </button>
                                <button
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                  role="menuitem"
                                  onClick={() => handleExport(transcript, 'SRT')}
                                >
                                  Export as SRT
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <Link
                        to={`/transcripts/${transcript.id}`}
                        className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </Link>
                      <button
                        className={`p-2 ${
                          confirmDelete === transcript.id
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-gray-400 hover:text-gray-500 dark:hover:text-gray-300'
                        }`}
                        onClick={() => handleDelete(transcript.id)}
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm text-gray-900 dark:text-white line-clamp-3">
                      {transcript.text}
                    </p>
                  </div>
                  <div className="mt-4 flex justify-between">
                    <Link
                      to={`/transcripts/${transcript.id}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      View full transcript →
                    </Link>
                    {confirmDelete === transcript.id && (
                      <div className="flex items-center">
                        <span className="text-sm text-red-600 dark:text-red-400 mr-2">
                          Confirm delete?
                        </span>
                        <button
                          className="text-sm font-medium text-gray-600 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300 mr-2"
                          onClick={() => setConfirmDelete(null)}
                        >
                          Cancel
                        </button>
                        <button
                          className="text-sm font-medium text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300"
                          onClick={() => dispatch(deleteTranscript(transcript.id))}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TranscriptsPage;
