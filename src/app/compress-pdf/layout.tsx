import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Compress PDF',
  description: 'Reduce PDF file size with adjustable compression levels. See before/after comparison. 100% client-side.',
};

export default function CompressPdfLayout({ children }: { children: React.ReactNode }) {
  return children;
}
