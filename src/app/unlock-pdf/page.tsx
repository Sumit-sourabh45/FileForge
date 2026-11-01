'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { FileText, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { ToolHeader, ToolContainer } from '@/components/tools/ToolHeader';
import UploadZone from '@/components/upload/UploadZone';
import EmptyState from '@/components/tools/EmptyState';
import ProcessingLoader from '@/components/tools/ProcessingLoader';
import DownloadButton from '@/components/tools/DownloadButton';
import { ACCEPTED_FILES, TOOLS } from '@/utils/constants';
import { unlockPdf } from '@/lib/pdf/unlock';
import { downloadBlob, formatFileSize } from '@/utils/fileHelpers';

const tool = TOOLS.find((t) => t.id === 'unlock-pdf')!;

export default function UnlockPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [unlockedPdf, setUnlockedPdf] = useState<Uint8Array | null>(null);

  const handleAddFile = useCallback((files: File[]) => {
    setFile(files[0]);
    setUnlockedPdf(null);
    setPassword('');
    toast.success('PDF loaded');
  }, []);

  const handleUnlock = async () => {
    if (!file || !password) {
      toast.error('Please enter the PDF password');
      return;
    }
    setProcessing(true);
    setUnlockedPdf(null);
    try {
      const pdfBytes = await unlockPdf(file, password);
      setUnlockedPdf(pdfBytes);
      toast.success('PDF unlocked successfully!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to unlock PDF';
      toast.error(message);
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (unlockedPdf) downloadBlob(unlockedPdf, `unlocked-${file?.name || 'document.pdf'}`);
  };

  const handleReset = () => { setFile(null); setPassword(''); setUnlockedPdf(null); };

  return (
    <ToolContainer>
      <ToolHeader title={tool.title} description={tool.description} icon={tool.icon} gradient={tool.gradient} />
      {!file ? (
        <>
          <UploadZone accept={ACCEPTED_FILES.pdfs} onFilesAdded={handleAddFile} multiple={false} label="Drop a password-protected PDF here" sublabel="Your password is never stored or transmitted" />
          <EmptyState title="No PDF selected" description="Upload a password-protected PDF to unlock it." />
        </>
      ) : unlockedPdf ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 mb-4">
            <CheckCircle2 className="w-8 h-8 text-accent" />
          </div>
          <h3 className="text-lg font-semibold text-text mb-2">PDF Unlocked!</h3>
          <p className="text-sm text-text-muted mb-6">Password protection removed. Size: {formatFileSize(unlockedPdf.length)}</p>
          <div className="flex items-center justify-center gap-3">
            <DownloadButton onClick={handleDownload} label="Download Unlocked PDF" />
            <button onClick={handleReset} className="px-4 py-3 rounded-xl text-sm font-medium text-text-muted hover:text-text bg-surface border border-border hover:border-surface-light transition-all cursor-pointer">Unlock another</button>
          </div>
        </motion.div>
      ) : (
        <>
          <div className="flex items-center gap-3 p-4 bg-surface rounded-xl border border-border mb-6 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-surface-light flex items-center justify-center"><FileText className="w-5 h-5 text-text-muted" /></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text truncate">{file.name}</p>
              <p className="text-xs text-text-muted">{formatFileSize(file.size)}</p>
            </div>
            <button onClick={handleReset} className="text-xs text-danger hover:text-danger/80 transition-colors cursor-pointer">Remove</button>
          </div>
          <div className="mb-6">
            <label className="text-sm font-medium text-text mb-2 block">PDF Password</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleUnlock()} placeholder="Enter the PDF password" className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-text placeholder:text-text-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all pr-12" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors cursor-pointer" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-text-muted mt-2">Your password is processed locally and never transmitted.</p>
          </div>
          {processing ? <ProcessingLoader message="Unlocking your PDF..." /> : (
            <button onClick={handleUnlock} disabled={!password} className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all ${password ? 'bg-gradient-to-r from-primary to-primary-hover text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 cursor-pointer' : 'bg-surface-light text-text-muted cursor-not-allowed'}`}>Unlock PDF</button>
          )}
        </>
      )}
    </ToolContainer>
  );
}
