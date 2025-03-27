// src/features/datasets/components/FileUploader.js

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Button from '../../shared/ui/Button';
import Alert from '../../shared/ui/Alert';
import Loading from '../../shared/ui/Loading';

const FileUploader = ({ onUploadSuccess, onUploadError, maxFileSize = 10 }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];

    // Check file size (convert maxFileSize from MB to bytes)
    if (file.size > maxFileSize * 1024 * 1024) {
      setError(`File is too large. Maximum size is ${maxFileSize}MB.`);
      return;
    }

    // Check file type
    const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Please upload a CSV or Excel file.');
      return;
    }

    // Prepare form data
    const formData = new FormData();
    formData.append('file', file);

    // Simulate upload (would be replaced with actual API call)
    setUploading(true);
    setError(null);

    // TODO: Replace with actual API call
    setTimeout(() => {
      setUploading(false);
      onUploadSuccess({
        id: 'ds_' + Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString()
      });
    }, 1500);

  }, [maxFileSize, onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    multiple: false
  });

  return (
    <div className="file-uploader">
      {error && (
        <Alert
          variant="error"
          className="mb-md"
          onDismiss={() => setError(null)}
          dismissible
        >
          {error}
        </Alert>
      )}

      <div
        {...getRootProps()}
        className={`upload-zone p-xl border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary-500 bg-primary-50' : 'border-border-normal hover:border-primary-500'}
          ${uploading ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        <input {...getInputProps()} disabled={uploading} />

        {uploading ? (
          <Loading text="Uploading file..." />
        ) : (
          <>
            <div className="text-center mb-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-text-tertiary mb-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <h3 className="text-lg font-semibold">Drag & drop your file here</h3>
              <p className="text-text-secondary mb-md">
                or click to browse (CSV or Excel files only)
              </p>
              <Button
                variant="primary"
                size="md"
                type="button"
              >
                Browse Files
              </Button>
            </div>
            <p className="text-sm text-text-tertiary mt-sm">
              Maximum file size: {maxFileSize}MB
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUploader;