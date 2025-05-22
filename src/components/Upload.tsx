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
    <div {...getRootProps()} className="border p-4 bg-gray-100 text-center cursor-pointer rounded">
      <input {...getInputProps()} />
      <p>Drag & drop DICOM files here or click to select</p>
    </div>
  );
};

export default Upload;
