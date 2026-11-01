import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Unlock PDF',
  description: 'Remove password protection from PDF files securely in your browser. 100% client-side.',
};

export default function UnlockPdfLayout({ children }: { children: React.ReactNode }) {
  return children;
}
