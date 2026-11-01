'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { ArrowDown, FileText } from 'lucide-react';
import { ToolHeader, ToolContainer } from '@/components/tools/ToolHeader';
import UploadZone from '@/components/upload/UploadZone';
import EmptyState from '@/components/tools/EmptyState';
import ProcessingLoader from '@/components/tools/ProcessingLoader';
import DownloadButton from '@/components/tools/DownloadButton';
import CompressionSlider from '@/components/tools/CompressionSlider';
import { ACCEPTED_FILES, TOOLS } from '@/utils/constants';
import { compressPdf } from '@/lib/pdf/compress';
import { downloadBlob, formatFileSize } from '@/utils/fileHelpers';
import { CompressionLevel, CompressionResult } from '@/types';

const tool = TOOLS.find((t) => t.id === 'compress-pdf')!;

export default function CompressPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [level, setLevel] = useState<CompressionLevel>('medium');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<CompressionResult | null>(null);

  const handleAddFile = useCallback((files: File[]) => {
    setFile(files[0]);
    setResult(null);
    toast.success('PDF loaded');
  }, []);

  const handleCompress = async () => {
    if (!file) return;
    setProcessing(true);
    setResult(null);

    try {
      const compressionResult = await compressPdf(file, level);
      setResult(compressionResult);

      if (compressionResult.reductionPercent > 0) {
        toast.success(`Compressed by ${compressionResult.reductionPercent}%!`);
      } else {
        toast.info('This PDF is already optimized — no further compression possible.');
      }
    } catch (error) {
      toast.error('Failed to compress PDF.');
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (result) {
      downloadBlob(result.data as Uint8Array, `compressed-${file?.name || 'document.pdf'}`);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
  };

  return (
    <ToolContainer>
      <ToolHeader
        title={tool.title}
        description={tool.description}
        icon={tool.icon}
        gradient={tool.gradient}
      />

      {!file ? (
        <>
          <UploadZone
            accept={ACCEPTED_FILES.pdfs}
            onFilesAdded={handleAddFile}
            multiple={false}
            label="Drop a PDF here or click to browse"
            sublabel="Select one PDF file to compress"
          />
          <EmptyState title="No PDF selected" description="Upload a PDF to start compressing." />
        </>
      ) : (
        <>
          {/* File Info */}
          <div className="flex items-center gap-3 p-4 bg-surface rounded-xl border border-border mb-6">
            <div className="w-10 h-10 rounded-lg bg-surface-light flex items-center justify-center">
              <FileText className="w-5 h-5 text-text-muted" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text truncate">{file.name}</p>
              <p className="text-xs text-text-muted">{formatFileSize(file.size)}</p>
            </div>
            <button
              onClick={handleReset}
              className="text-xs text-danger hover:text-danger/80 transition-colors cursor-pointer"
            >
              Remove
            </button>
          </div>

          {/* Compression Level */}
          <div className="mb-6">
            <CompressionSlider value={level} onChange={setLevel} />
          </div>

          {/* Actions */}
          {processing ? (
            <ProcessingLoader message="Compressing your PDF..." />
          ) : (
            <>
              {!result && (
                <button
                  onClick={handleCompress}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-hover text-white font-semibold text-sm shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow cursor-pointer"
                >
                  Compress PDF
                </button>
              )}

              {/* Results */}
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Size Comparison */}
                  <div className="flex items-center gap-4 p-6 bg-surface rounded-xl border border-border shadow-xs">
                    <div className="flex-1 text-center">
                      <p className="text-xs text-text-muted mb-1">Original</p>
                      <p className="text-lg font-bold text-text">
                        {formatFileSize(result.originalSize)}
                      </p>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                      <ArrowDown className="w-5 h-5 text-accent" />
                      <span className="text-sm font-bold text-accent">
                        {result.reductionPercent}%
                      </span>
                    </div>

                    <div className="flex-1 text-center">
                      <p className="text-xs text-text-muted mb-1">Compressed</p>
                      <p className="text-lg font-bold text-accent">
                        {formatFileSize(result.compressedSize)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <DownloadButton onClick={handleDownload} label="Download Compressed PDF" />
                    <button
                      onClick={handleReset}
                      className="px-4 py-3 rounded-xl text-sm font-medium text-text-muted hover:text-text bg-surface border border-border hover:border-surface-light transition-all cursor-pointer"
                    >
                      Compress another
                    </button>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </>
      )}
    </ToolContainer>
  );
}
