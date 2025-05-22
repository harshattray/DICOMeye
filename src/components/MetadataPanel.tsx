import React from 'react';


interface MetadataPanelProps {
  metadata: Record<string, string>;
}

const MetadataPanel = ({ metadata }: MetadataPanelProps) => {
  return (
    <div className="p-4 bg-white border rounded">
      <h2 className="text-lg font-semibold mb-2">DICOM Metadata</h2>
      <ul className="text-sm">
        {Object.entries(metadata).map(([key, value]) => (
          <li key={key}><strong>{key}:</strong> {value}</li>
        ))}
      </ul>
    </div>
  );
};

export default MetadataPanel;
