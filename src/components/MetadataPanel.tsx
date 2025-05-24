/**
 * @author: Harsha Attray
 * @description: Displays DICOM metadata in a collapsible panel with key information about the loaded image
 * @version: 1.0.0
 * @date: 2025-05-24
 * @license: MIT
 */

import React from 'react';


interface MetadataPanelProps {
  metadata: Record<string, string>;
}

const MetadataPanel = ({ metadata }: MetadataPanelProps) => {
  return (
    <div className="p-4 bg-white border rounded dark:bg-gray-700 dark:border-gray-600">
      <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">DICOM Metadata</h2>
      <ul className="text-sm text-gray-700 dark:text-gray-300">
        {Object.entries(metadata).map(([key, value]) => (
          <li key={key}><strong className="font-semibold text-gray-800 dark:text-gray-200">{key}:</strong> {value}</li>
        ))}
      </ul>
    </div>
  );
};

export default MetadataPanel;
