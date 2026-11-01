'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface ToolHeaderProps {
  title: string;
  description: string;
  icon: string;
  gradient: string;
}

export function ToolHeader({ title, description, icon, gradient }: ToolHeaderProps) {
  // Dynamically pick the icon from lucide-react
  const IconComponent = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[icon] || Icons.FileText;

  return (
    <div className="mb-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to tools
      </Link>

      <div className="flex items-center gap-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.1 }}
          className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}
        >
          <IconComponent className="w-7 h-7 text-white" />
        </motion.div>

        <div>
          <motion.h1
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="text-2xl font-bold text-text"
          >
            {title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-text-muted mt-0.5"
          >
            {description}
          </motion.p>
        </div>
      </div>
    </div>
  );
}

interface ToolContainerProps {
  children: ReactNode;
}

export function ToolContainer({ children }: ToolContainerProps) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {children}
    </div>
  );
}
