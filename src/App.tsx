import { useEffect, useState } from 'react';
import Upload from '@components/Upload';
import Viewer from '@components/Viewer';
import MetadataPanel from '@components/MetadataPanel';
import ToolControls from '@components/ToolControls';
import SampleSelector from '@components/SampleSelector';
import { initCornerstone } from '@lib/cornerstoneSetup';
import { saveDicom, clearStorage } from '@lib/storage';
import { 
  DocumentTextIcon, 
  PhotoIcon, 
  WrenchScrewdriverIcon,
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import React from 'react';

const App = () => {
  const [imageId, setImageId] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<Record<string, string>>({});

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

    // Clear the IndexedDB storage
    try {
      await clearStorage();
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-72 bg-white shadow-lg flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <DocumentTextIcon className="h-6 w-6 text-blue-500" />
            DICOM Viewer
          </h1>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Upload Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <PhotoIcon className="h-5 w-5 text-gray-400" />
              Upload DICOM
            </div>
            <Upload onUpload={handleUpload} />
          </div>

          {/* Sample Files Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <DocumentTextIcon className="h-5 w-5 text-gray-400" />
              Sample Files
            </div>
            <SampleSelector onSelect={handleUpload} onClear={handleClear} isActive={true} />
          </div>

          {/* Tools Section */}
          {imageId && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <WrenchScrewdriverIcon className="h-5 w-5 text-gray-400" />
                Tools
              </div>
              <ToolControls isActive={!!imageId} />
            </div>
          )}

          {/* Metadata Section */}
          {Object.keys(metadata).length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <InformationCircleIcon className="h-5 w-5 text-gray-400" />
                Metadata
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <MetadataPanel metadata={metadata} />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {imageId && (
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleClear}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Main Viewer */}
      <div className="flex-1 p-4">
        {imageId ? (
          <div className="h-full bg-white rounded-lg shadow-lg overflow-hidden">
            <Viewer imageId={imageId} />
          </div>
        ) : (
          <div className="h-full flex items-center justify-center bg-white rounded-lg shadow-lg">
            <div className="text-center">
              <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <div className="text-gray-500 text-lg">
                Upload a DICOM file to begin
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
