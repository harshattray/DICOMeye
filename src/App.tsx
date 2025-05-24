import { useEffect, useState, useRef } from 'react';
import Upload from '@components/Upload';
import Viewer, { ViewerRef } from '@components/Viewer';
import MetadataPanel from '@components/MetadataPanel';
import ToolControls from '@components/ToolControls';
import SampleSelector from '@components/SampleSelector';
import FloatingTools from '@components/FloatingTools';
import { initCornerstone } from '@lib/cornerstoneSetup';
import { saveDicom, clearStorage } from '@lib/storage';
import { useDarkMode } from './hooks/useDarkMode';
import { 
  DocumentTextIcon, 
  PhotoIcon,
  WrenchScrewdriverIcon,
  InformationCircleIcon,
  XMarkIcon,
  SunIcon,
  MoonIcon,
  ArrowsPointingInIcon,
} from '@heroicons/react/24/outline';
import React from 'react';

const App = () => {
  const [imageId, setImageId] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<Record<string, string>>({});
  const [isFullscreen, setIsFullscreen] = useState(false);
  const viewerRef = useRef<ViewerRef>(null);
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  useEffect(() => {
    initCornerstone();
  }, []);

  const handleUpload = async (files: File[]) => {
    const file = files[0];
    const objectUrl = URL.createObjectURL(file);
    setImageId(`wadouri:${objectUrl}`);

    // Save the file to IndexedDB
    try {
      await saveDicom(file);
    } catch (error) {
      console.error('Failed to save file to storage:', error);
    }

    const worker = new Worker(new URL('./workers/dicomWorker.ts', import.meta.url), {
      type: 'module',
    });

    worker.postMessage(file);
    worker.onmessage = (e) => {
      setMetadata(e.data.metadata);
      worker.terminate();
    };
  };

  const handleClear = async () => {
    if (imageId) {
      URL.revokeObjectURL(imageId.replace('wadouri:', ''));
    }
    setImageId(null);
    setMetadata({});
    setIsFullscreen(false);

    // Clear the IndexedDB storage
    try {
      await clearStorage();
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`flex h-screen bg-gray-50 dark:bg-gray-900 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Sidebar - Hidden in fullscreen mode */}
      {!isFullscreen && (
        <div className="w-72 bg-white shadow-lg flex flex-col dark:bg-gray-800 dark:text-gray-200">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-800 flex items-center gap-2 dark:text-gray-200">
              <DocumentTextIcon className="h-6 w-6 text-blue-500" />
              DICOM Viewer
            </h1>
            <button
              onClick={toggleDarkMode}
              className="p-1 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-500 dark:hover:text-gray-400"
              title="Toggle Dark Mode"
            >
              {isDarkMode ? (
                <SunIcon className="h-6 w-6" />
              ) : (
                <MoonIcon className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Upload Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <PhotoIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                Upload DICOM
              </div>
              <Upload onUpload={handleUpload} />
            </div>

            {/* Sample Files Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <DocumentTextIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                Sample Files
              </div>
              <SampleSelector onSelect={handleUpload} onClear={handleClear} isActive={true} />
            </div>

            {/* Tools Section */}
            {imageId && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <WrenchScrewdriverIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  Tools
                </div>
                <ToolControls isActive={!!imageId} viewerRef={viewerRef} onToggleFullscreen={toggleFullscreen} />
              </div>
            )}

            {/* Metadata Section */}
            {Object.keys(metadata).length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <InformationCircleIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  Metadata
                </div>
                <div className="bg-gray-50 rounded-lg p-4 dark:bg-gray-700">
                  <MetadataPanel metadata={metadata} />
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {imageId && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleClear}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors dark:text-red-300 dark:bg-red-900 dark:hover:bg-red-800"
              >
                <XMarkIcon className="h-5 w-5" />
                Clear All
              </button>
            </div>
          )}
        </div>
      )}

      {/* Main Viewer */}
      <div className={`flex-1 p-4 ${isFullscreen ? 'p-0' : ''}`}>
        {imageId ? (
          <div className={`h-full bg-white rounded-lg shadow-lg overflow-hidden dark:bg-gray-800 ${isFullscreen ? 'rounded-none' : ''}`}>
            <div className="relative h-full">
              <Viewer imageId={imageId} ref={viewerRef} />
              {isFullscreen && (
                <button
                  onClick={toggleFullscreen}
                  className="absolute top-4 right-4 p-2 rounded-md bg-white/80 hover:bg-white text-gray-600 dark:bg-gray-800/80 dark:hover:bg-gray-800 dark:text-gray-400 transition-colors"
                  title="Exit Fullscreen"
                >
                  <ArrowsPointingInIcon className="h-6 w-6" />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center bg-white rounded-lg shadow-lg dark:bg-gray-800">
            <div className="text-center">
              <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4 dark:text-gray-500" />
              <div className="text-gray-500 text-lg dark:text-gray-400">
                Upload a DICOM file to begin
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Tools in Fullscreen Mode */}
      {isFullscreen && imageId && (
        <FloatingTools
          isActive={isFullscreen}
          viewerRef={viewerRef}
          onExitFullscreen={toggleFullscreen}
        />
      )}
    </div>
  );
};

export default App;
