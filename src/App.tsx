import { useEffect, useState } from 'react';
import Upload from '@components/Upload';
import Viewer from '@components/Viewer';
import MetadataPanel from '@components/MetadataPanel';
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

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      <Upload onUpload={handleUpload} />
      {imageId && <Viewer imageId={imageId} />}
      {Object.keys(metadata).length > 0 && <MetadataPanel metadata={metadata} />}
    </div>
  );
};

export default App;
