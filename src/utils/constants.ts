import { ToolDefinition } from '@/types';

/** All available tools */
export const TOOLS: ToolDefinition[] = [
  {
    id: 'image-to-pdf',
    title: 'Image to PDF',
    description: 'Convert multiple images into a single PDF document with drag-to-reorder support.',
    href: '/image-to-pdf',
    icon: 'ImageIcon',
    gradient: 'from-violet-500 to-purple-600',
    color: '#8B5CF6',
  },
  {
    id: 'merge-pdf',
    title: 'Merge PDF',
    description: 'Combine multiple PDF files into one. Drag to reorder before merging.',
    href: '/merge-pdf',
    icon: 'Layers',
    gradient: 'from-blue-500 to-cyan-500',
    color: '#3B82F6',
  },
  {
    id: 'compress-pdf',
    title: 'Compress PDF',
    description: 'Reduce PDF file size with adjustable compression levels.',
    href: '/compress-pdf',
    icon: 'FileDown',
    gradient: 'from-emerald-500 to-green-500',
    color: '#10B981',
  },
  {
    id: 'unlock-pdf',
    title: 'Unlock PDF',
    description: 'Remove password protection from PDF files securely in your browser.',
    href: '/unlock-pdf',
    icon: 'Unlock',
    gradient: 'from-amber-500 to-orange-500',
    color: '#F59E0B',
  },
  {
    id: 'compress-image',
    title: 'Compress Image',
    description: 'Reduce image file sizes with quality controls and dimension limits.',
    href: '/compress-image',
    icon: 'ImageDown',
    gradient: 'from-rose-500 to-pink-500',
    color: '#F43F5E',
  },
];

/** Accepted file types for each tool */
export const ACCEPTED_FILES = {
  images: {
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/webp': ['.webp'],
  },
  pdfs: {
    'application/pdf': ['.pdf'],
  },
} as const;

/** Compression quality presets */
export const COMPRESSION_PRESETS = {
  low: { quality: 0.3, label: 'Low', description: 'Maximum compression, lower quality' },
  medium: { quality: 0.5, label: 'Medium', description: 'Balanced compression and quality' },
  high: { quality: 0.7, label: 'High', description: 'Minimal compression, best quality' },
} as const;
