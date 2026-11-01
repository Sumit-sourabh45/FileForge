'use client';

import { motion } from 'framer-motion';
import { X, GripVertical, FileText } from 'lucide-react';
import { formatFileSize } from '@/utils/fileHelpers';

interface FileCardProps {
  id: string;
  name: string;
  size: number;
  type: string;
  preview?: string;
  onRemove: (id: string) => void;
  showDragHandle?: boolean;
  dragHandleProps?: Record<string, unknown>;
  extra?: React.ReactNode; // For page count or other info
}

export default function FileCard({
  id,
  name,
  size,
  type,
  preview,
  onRemove,
  showDragHandle = false,
  dragHandleProps,
  extra,
}: FileCardProps) {
  const isImage = type.startsWith('image/');

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className="group flex items-center gap-3 p-3 bg-surface rounded-xl border border-border hover:border-primary/30 transition-all shadow-xs"
    >
      {/* Drag Handle */}
      {showDragHandle && (
        <div
          {...dragHandleProps}
          className="cursor-grab active:cursor-grabbing text-text-muted hover:text-text transition-colors touch-none"
        >
          <GripVertical className="w-4 h-4" />
        </div>
      )}

      {/* Thumbnail / Icon */}
      <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-surface-light flex items-center justify-center">
        {isImage && preview ? (
          <img
            src={preview}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <FileText className="w-5 h-5 text-text-muted" />
        )}
      </div>

      {/* File Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text truncate">{name}</p>
        <div className="flex items-center gap-2">
          <p className="text-xs text-text-muted">{formatFileSize(size)}</p>
          {extra}
        </div>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => onRemove(id)}
        className="p-1.5 rounded-lg text-text-muted hover:text-danger hover:bg-danger/10 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
        aria-label={`Remove ${name}`}
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
