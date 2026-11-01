import { Shield, Heart } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold text-text">
              File<span className="gradient-text">Forge</span>
            </span>
          </div>

          {/* Privacy Badge */}
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <Shield className="w-3.5 h-3.5 text-accent" />
            <span>100% client-side processing · Your files never leave your device</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-4 text-xs text-text-muted">
            <Link href="/" className="hover:text-text transition-colors">
              Home
            </Link>
            <span className="flex items-center gap-1">
              Built with <Heart className="w-3 h-3 text-danger fill-danger" /> for privacy
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
