'use client';

import { useEffect } from 'react';

/**
 * Register the service worker for PWA support.
 * Rendered in the root layout to register on app load.
 */
export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      if (process.env.NODE_ENV === 'production') {
        navigator.serviceWorker.register('/sw.js').catch((err) => {
          console.warn('SW registration failed:', err);
        });
      } else {
        // Explicitly unregister in development to prevent HMR issues
        // A previously registered SW can intercept HMR requests and cause infinite loops
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (const registration of registrations) {
            registration.unregister().then(() => {
              console.log('Service Worker unregistered in development mode.');
            });
          }
        });
      }
    }
  }, []);

  return null;
}
