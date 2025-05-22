import React from 'react';

interface SampleSelectorProps {
  onSelect: (files: File[]) => void;
  onClear: () => void;
  isActive: boolean;
}

const SampleSelector: React.FC<SampleSelectorProps> = ({ onSelect, onClear, isActive }) => {
  const handleSampleSelect = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const sampleName = event.target.value;
    if (!sampleName) return;

    try {
      // Use the correct path for webpack's static assets
      const response = await fetch(`/assets/${sampleName}`);
      
      if (!response.ok) {
        console.error('Failed to load file:', response.status, response.statusText);
        throw new Error(`Failed to load sample file: ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      console.log('File loaded successfully, size:', arrayBuffer.byteLength);
      
      const file = new File([arrayBuffer], sampleName, { 
        type: 'application/dicom',
        lastModified: new Date().getTime()
      });

      console.log('File object created:', file.name, file.size, file.type);
      onSelect([file]);
    } catch (error) {
      console.error('Error loading sample file:', error);
      alert('Failed to load sample file. Please check the browser console for details.');
    }
  };

  if (!isActive) return null;

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-gray-700 mb-2">Sample Files</div>
      <div className="flex gap-2">
        <select
          onChange={handleSampleSelect}
          className="flex-1 px-3 py-2 text-sm rounded-md bg-gray-100 text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          defaultValue=""
        >
          <option value="">Select a sample...</option>
          <option value="image-000001.dcm">Sample DICOM</option>
        </select>
        <button
          onClick={onClear}
          className="px-3 py-2 text-sm rounded-md bg-red-100 text-red-700 hover:bg-red-200"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default SampleSelector; 