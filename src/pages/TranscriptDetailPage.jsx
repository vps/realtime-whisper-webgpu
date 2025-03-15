import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateTranscript, deleteTranscript, setCurrentTranscript } from '../store/slices/transcriptSlice';
import { ArrowLeftIcon, DocumentTextIcon, CheckIcon, TrashIcon, ArrowDownTrayIcon, XMarkIcon } from '@heroicons/react/24/outline';

const TranscriptDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { transcripts, currentTranscript, isLoading } = useSelector((state) => state.transcript);
  const { tier } = useSelector((state) => state.subscription);
  
  const [editMode, setEditMode] = useState(false);
  const [editedText, setEditedText] = useState('');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Load transcript data
  useEffect(() => {
    if (id) {
      const transcript = transcripts.find(t => t.id === id);
      if (transcript) {
        dispatch(setCurrentTranscript(transcript));
        setEditedText(transcript.text);
      } else {
        // Transcript not found, redirect to transcripts list
        navigate('/transcripts');
      }
    }
    
    return () => {
      // Clear current transcript when component unmounts
      dispatch(setCurrentTranscript(null));
    };
  }, [id, transcripts, dispatch, navigate]);

  if (!currentTranscript) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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

  // Handle save edited transcript
  const handleSaveEdit = () => {
    if (editedText.trim() !== currentTranscript.text) {
      dispatch(updateTranscript({
        id: currentTranscript.id,
        text: editedText.trim()
      }));
    }
    setEditMode(false);
  };

  // Handle delete transcript
  const handleDelete = () => {
    dispatch(deleteTranscript(currentTranscript.id));
    navigate('/transcripts');
  };

  // Export transcript (placeholder for actual export functionality)
  const handleExport = (format) => {
    const filename = `transcript-${new Date(currentTranscript.timestamp).toISOString().slice(0, 10)}`;
    
    // In a real app, this would generate proper file content and trigger a download
    let content = currentTranscript.text;
    
    // Create a blob and trigger download
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.${format.toLowerCase()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setShowExportMenu(false);
  };

  return (
    <div className="flex flex-col h-full mx-auto text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/transcripts')}
            className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Transcript</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {formatDate(currentTranscript.timestamp)} • {formatDuration(currentTranscript.audioLength)} • {formatLanguage(currentTranscript.language)}
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          {/* Export button */}
          <div className="relative">
            <button
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
              onClick={() => setShowExportMenu(!showExportMenu)}
            >
              <ArrowDownTrayIcon className="h-5 w-5" />
            </button>
            
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-md ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1" role="menu">
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    role="menuitem"
                    onClick={() => handleExport('TXT')}
                  >
                    Export as TXT
                  </button>
                  {tier !== 'free' && (
                    <>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        role="menuitem"
                        onClick={() => handleExport('DOCX')}
                      >
                        Export as DOCX
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        role="menuitem"
                        onClick={() => handleExport('PDF')}
                      >
                        Export as PDF
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        role="menuitem"
                        onClick={() => handleExport('SRT')}
                      >
                        Export as SRT
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Edit/Save button */}
          {editMode ? (
            <button
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-green-600 dark:text-green-400"
              onClick={handleSaveEdit}
            >
              <CheckIcon className="h-5 w-5" />
            </button>
          ) : (
            <button
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
              onClick={() => setEditMode(true)}
            >
              <DocumentTextIcon className="h-5 w-5" />
            </button>
          )}
          
          {/* Delete button */}
          <button
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {/* Transcript content */}
      <div className="flex-1 overflow-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        {editMode ? (
          <textarea
            className="w-full h-full p-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-base"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            placeholder="Transcript text..."
          />
        ) : (
          <div className="prose dark:prose-invert max-w-none">
            <p className="whitespace-pre-wrap">{currentTranscript.text}</p>
          </div>
        )}
      </div>
      
      {/* Edit mode controls */}
      {editMode && (
        <div className="mt-4 flex justify-end space-x-3">
          <button
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => {
              setEditedText(currentTranscript.text);
              setEditMode(false);
            }}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={handleSaveEdit}
          >
            Save Changes
          </button>
        </div>
      )}
      
      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Delete Transcript
              </h3>
              <button
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setShowDeleteConfirm(false)}
              >
                <XMarkIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Are you sure you want to delete this transcript? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TranscriptDetailPage;
