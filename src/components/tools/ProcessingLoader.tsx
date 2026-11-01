'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ProcessingLoaderProps {
  message?: string;
}

export default function ProcessingLoader({
  message = 'Processing your files...',
}: ProcessingLoaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-12 gap-4"
    >
      <div className="relative">
        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />

        {/* Spinner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="relative w-12 h-12 flex items-center justify-center"
        >
          <Loader2 className="w-8 h-8 text-primary" />
        </motion.div>
      </div>

      <p className="text-sm text-text-muted animate-pulse">{message}</p>
    </motion.div>
  );
}
