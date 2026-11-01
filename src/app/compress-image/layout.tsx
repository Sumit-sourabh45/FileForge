import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Compress Image',
  description: 'Reduce image file sizes with quality controls and dimension limits. Batch processing supported. 100% client-side.',
};

export default function CompressImageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
