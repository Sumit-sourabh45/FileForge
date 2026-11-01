import type { Metadata, Viewport } from 'next';
import { Inter, Poppins } from 'next/font/google';
import { Toaster } from 'sonner';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ServiceWorkerRegistrar from '@/components/ServiceWorkerRegistrar';
import ThemeProvider from '@/components/ThemeProvider';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  weight: ['600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'FileForge — Privacy-First PDF & Image Tools',
    template: '%s | FileForge',
  },
  description:
    'Free, browser-based PDF and image processing tools. Merge, compress, convert, and unlock files without uploading them. 100% client-side and privacy-first.',
  keywords: [
    'PDF tools',
    'image to PDF',
    'merge PDF',
    'compress PDF',
    'unlock PDF',
    'compress image',
    'privacy',
    'client-side',
    'browser-based',
  ],
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/icon.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'FileForge — Privacy-First PDF & Image Tools',
    description: 'Process files entirely in your browser. No uploads, no servers.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0F172A' },
    { media: '(prefers-color-scheme: light)', color: '#F8FAFC' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} h-full`} suppressHydrationWarning>
      <head>
        {/* Inline script to prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark'){document.documentElement.classList.add(t)}else if(window.matchMedia('(prefers-color-scheme:light)').matches){document.documentElement.classList.add('light')}else{document.documentElement.classList.add('dark')}}catch(e){document.documentElement.classList.add('dark')}})()`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans antialiased">
        <ThemeProvider>
          <Navbar />
          <ServiceWorkerRegistrar />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text)',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
