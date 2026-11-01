import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Image to PDF',
  description: 'Convert multiple images into a single PDF document. Drag to reorder, then download. 100% client-side.',
};

export default function ImageToPdfLayout({ children }: { children: React.ReactNode }) {
  return children;
}
