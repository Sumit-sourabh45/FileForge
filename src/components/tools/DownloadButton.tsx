'use client';

import { motion } from 'framer-motion';
import { Download } from 'lucide-react';

interface DownloadButtonProps {
  onClick: () => void;
  label?: string;
  disabled?: boolean;
}

export default function DownloadButton({
  onClick,
  label = 'Download',
  disabled = false,
}: DownloadButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm
        transition-all duration-200
        ${
          disabled
            ? 'bg-surface-light text-text-muted cursor-not-allowed'
            : 'bg-gradient-to-r from-primary to-primary-hover text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 cursor-pointer'
        }
      `}
    >
      <Download className="w-4 h-4" />
      {label}
    </motion.button>
  );
}
