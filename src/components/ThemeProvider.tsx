'use client';

import { createContext, useContext, useEffect, useCallback, useSyncExternalStore } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getThemeSnapshot(): Theme {
  if (typeof window === 'undefined') return 'dark';
  const stored = localStorage.getItem('theme');
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function getServerSnapshot(): Theme {
  return 'dark';
}

function subscribeTheme(callback: () => void) {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
  const handleStorage = (e: StorageEvent) => {
    if (e.key === 'theme') callback();
  };

  window.addEventListener('storage', handleStorage);
  window.addEventListener('fileforge-theme-change', callback);
  mediaQuery.addEventListener('change', callback);

  return () => {
    window.removeEventListener('storage', handleStorage);
    window.removeEventListener('fileforge-theme-change', callback);
    mediaQuery.removeEventListener('change', callback);
  };
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getServerSnapshot);

  // Sync DOM classes and theme-color meta tags
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);

    document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
      meta.setAttribute('content', theme === 'dark' ? '#0F172A' : '#F8FAFC');
    });
  }, [theme]);

  const toggleTheme = useCallback(() => {
    const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', nextTheme);
    window.dispatchEvent(new Event('fileforge-theme-change'));
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
