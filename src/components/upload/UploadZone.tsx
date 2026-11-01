'use client';

import { useCallback } from 'react';
import { useDropzone, Accept } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, FileUp } from 'lucide-react';

interface UploadZoneProps {
  accept: Accept;
  multiple?: boolean;
  onFilesAdded: (files: File[]) => void;
  label?: string;
  sublabel?: string;
  maxFiles?: number;
  disabled?: boolean;
}

export default function UploadZone({
  accept,
  multiple = true,
  onFilesAdded,
  label = 'Drop files here or click to browse',
  sublabel,
  maxFiles,
  disabled = false,
}: UploadZoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFilesAdded(acceptedFiles);
      }
    },
    [onFilesAdded]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple,
    maxFiles,
    disabled,
  });

  const rootProps = getRootProps();

  return (
    <motion.div
      whileHover={{ scale: disabled ? 1 : 1.01 }}
      whileTap={{ scale: disabled ? 1 : 0.99 }}
    >
      <div
        {...rootProps}
        className={`relative cursor-pointer transition-all duration-300 ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        } ${isDragActive ? 'upload-border-active' : 'upload-border'}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
          <motion.div
            animate={isDragActive ? { scale: 1.2, y: -5 } : { scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className={`w-16 h-16 rounded-xl flex items-center justify-center mb-4 ${
              isDragActive
                ? 'bg-primary/20 text-primary'
                : 'bg-surface-light text-text-muted'
            }`}
          >
            {isDragActive ? (
              <FileUp className="w-7 h-7" />
            ) : (
              <Upload className="w-7 h-7" />
            )}
          </motion.div>

          <p className="text-sm font-medium text-text mb-1">
            {isDragActive ? 'Drop to upload' : label}
          </p>

          {sublabel && (
            <p className="text-xs text-text-muted">{sublabel}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
