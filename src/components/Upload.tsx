/**
 * @author: Harsha Attray
 * @description: Handles DICOM file uploads with drag-and-drop support and file selection
 * @version: 1.0.0
 * @date: 2025-05-24
 * @license: MIT
 */

import { useDropzone } from 'react-dropzone';
import React from 'react';


interface UploadProps {
  onUpload: (files: File[]) => void;
}

const Upload = ({ onUpload }: UploadProps) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: acceptedFiles => onUpload(acceptedFiles),
    accept: { 'application/dicom': ['.dcm'] },
  });

  return (
    <div {...getRootProps()} className="border p-4 bg-gray-100 text-center cursor-pointer rounded dark:bg-gray-700 dark:border-gray-600">
      <input {...getInputProps()} />
      <p className="text-gray-700 dark:text-gray-300">Drag & drop DICOM files here or click to select</p>
    </div>
  );
};

export default Upload;
