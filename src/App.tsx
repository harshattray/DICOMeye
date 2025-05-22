import { useEffect, useState } from 'react';
import Upload from '@components/Upload';
import Viewer from '@components/Viewer';
import MetadataPanel from '@components/MetadataPanel';
import ToolControls from '@components/ToolControls';
import SampleSelector from '@components/SampleSelector';
import { initCornerstone } from '@lib/cornerstoneSetup';
import React from 'react';

const App = () => {
  const [imageId, setImageId] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<Record<string, string>>({});

  useEffect(() => {
    initCornerstone();
  }, []);

  const handleUpload = (files: File[]) => {
    const file = files[0];
    const objectUrl = URL.createObjectURL(file);
    setImageId(`wadouri:${objectUrl}`);

    const worker = new Worker(new URL('./workers/dicomWorker.ts', import.meta.url), {
      type: 'module',
    });

    worker.postMessage(file);
    worker.onmessage = (e) => {
      setMetadata(e.data.metadata);
      worker.terminate();
    };
  };

  const handleClear = () => {
    if (imageId) {
      URL.revokeObjectURL(imageId.replace('wadouri:', ''));
    }
    setImageId(null);
    setMetadata({});
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-4 flex flex-col gap-4">
        <div className="text-xl font-semibold text-gray-800 mb-2">DICOM Viewer</div>
        <Upload onUpload={handleUpload} />
        <SampleSelector onSelect={handleUpload} onClear={handleClear} isActive={true} />
        <ToolControls isActive={!!imageId} />
        {Object.keys(metadata).length > 0 && (
          <div className="flex-1 overflow-y-auto">
            <MetadataPanel metadata={metadata} />
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
            <div className="text-gray-500 text-lg">
              Upload a DICOM file to begin
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
