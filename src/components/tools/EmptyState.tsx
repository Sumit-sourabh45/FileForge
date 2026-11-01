'use client';

import { motion } from 'framer-motion';
import { Upload } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export default function EmptyState({
  title = 'No files added yet',
  description = 'Upload files above to get started.',
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-12 text-center"
    >
      <div className="w-16 h-16 rounded-xl bg-surface-light flex items-center justify-center mb-4">
        <Upload className="w-7 h-7 text-text-muted" />
      </div>
      <p className="text-sm font-medium text-text-muted">{title}</p>
      <p className="text-xs text-text-muted mt-1">{description}</p>
    </motion.div>
  );
}
