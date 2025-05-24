/**
 * @author: Harsha Attray
 * @description: Provides a dropdown interface for selecting and loading sample DICOM files
 * @version: 1.0.0
 * @date: 2025-05-24
 * @license: MIT
 */

import React from 'react';
import { saveDicom } from '@lib/storage';
import { DocumentArrowDownIcon, TrashIcon } from '@heroicons/react/24/outline';

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

      // Save the sample file to IndexedDB
      try {
        await saveDicom(file);
      } catch (error) {
        console.error('Failed to save sample file to storage:', error);
      }

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
      <div className="flex gap-2">
        <select
          onChange={handleSampleSelect}
          className="flex-1 px-3 py-2 text-sm rounded-md bg-white border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          defaultValue=""
        >
          <option value="">Select a sample...</option>
          <option value="image-000001.dcm">Sample DICOM</option>
        </select>
        <button
          onClick={onClear}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
          title="Clear selection"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
      <div className="text-xs text-gray-500">
        <DocumentArrowDownIcon className="h-4 w-4 inline-block mr-1" />
        Select a sample DICOM file to view
      </div>
    </div>
  );
};

export default SampleSelector; 