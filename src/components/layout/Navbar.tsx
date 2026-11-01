'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, Menu, X, Sun, Moon } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '@/components/ThemeProvider';

const navLinks = [
  { href: '/image-to-pdf', label: 'Image to PDF' },
  { href: '/merge-pdf', label: 'Merge PDF' },
  { href: '/compress-pdf', label: 'Compress PDF' },
  { href: '/unlock-pdf', label: 'Unlock PDF' },
  { href: '/compress-image', label: 'Compress Image' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-50 glass-strong">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 15 }}
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-xs"
            >
              <Shield className="w-4 h-4 text-white" />
            </motion.div>
            <span className="text-lg font-bold font-heading text-text">
              File<span className="gradient-text">Forge</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3 py-2 text-sm rounded-lg transition-colors ${
                  pathname === link.href
                    ? 'text-primary font-medium'
                    : 'text-text-muted hover:text-text'
                }`}
              >
                {pathname === link.href && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 bg-primary/10 rounded-lg"
                    transition={{ type: 'spring', duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            ))}

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="ml-2 p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface-light transition-all cursor-pointer"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              <motion.div
                key={theme}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-warning" />
                ) : (
                  <Moon className="w-4 h-4 text-primary" />
                )}
              </motion.div>
            </button>
          </div>

          {/* Mobile: Theme Toggle + Menu Button */}
          <div className="flex items-center gap-1 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 text-text-muted hover:text-text rounded-lg transition-colors cursor-pointer"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-warning" />
              ) : (
                <Moon className="w-5 h-5 text-primary" />
              )}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-text-muted hover:text-text rounded-lg cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden glass-strong border-t border-border"
        >
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm ${
                  pathname === link.href
                    ? 'text-primary font-medium bg-primary/10'
                    : 'text-text-muted hover:text-text hover:bg-surface'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </nav>
  );
}
