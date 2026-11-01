import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Merge PDF',
  description: 'Combine multiple PDF files into one document. Drag to reorder before merging. 100% client-side.',
};

export default function MergePdfLayout({ children }: { children: React.ReactNode }) {
  return children;
}
