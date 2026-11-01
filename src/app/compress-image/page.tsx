'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { ToolHeader, ToolContainer } from '@/components/tools/ToolHeader';
import UploadZone from '@/components/upload/UploadZone';
import EmptyState from '@/components/tools/EmptyState';
import ProcessingLoader from '@/components/tools/ProcessingLoader';
import DownloadButton from '@/components/tools/DownloadButton';
import { ACCEPTED_FILES, TOOLS } from '@/utils/constants';
import { compressImages } from '@/lib/image/compress';
import { downloadFile, formatFileSize } from '@/utils/fileHelpers';
import { CompressionResult } from '@/types';

const tool = TOOLS.find((t) => t.id === 'compress-image')!;

export default function CompressImagePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [quality, setQuality] = useState(70);
  const [maxDim, setMaxDim] = useState<number | undefined>(undefined);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<CompressionResult[]>([]);

  const handleAddFiles = useCallback((newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
    setResults([]);
    toast.success(`${newFiles.length} image(s) added`);
  }, []);

  const handleCompress = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    setProgress(0);
    setResults([]);
    try {
      const res = await compressImages(
        files,
        { quality: quality / 100, maxWidthOrHeight: maxDim },
        (i) => setProgress(i)
      );
      setResults(res);
      toast.success('Images compressed!');
    } catch (error) {
      toast.error('Compression failed.');
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = (index: number) => {
    const result = results[index];
    if (result) {
      downloadFile(result.data as File, `compressed-${files[index].name}`);
    }
  };

  const handleClear = () => { setFiles([]); setResults([]); setProgress(0); };

  return (
    <ToolContainer>
      <ToolHeader title={tool.title} description={tool.description} icon={tool.icon} gradient={tool.gradient} />
      <UploadZone accept={ACCEPTED_FILES.images} onFilesAdded={handleAddFiles} label="Drop images here or click to browse" sublabel="Supports JPEG, PNG, WebP" disabled={processing} />

      {files.length === 0 ? (
        <EmptyState title="No images added" description="Upload images to compress." />
      ) : (
        <div className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-text-muted">{files.length} image(s)</p>
            <button onClick={handleClear} className="text-xs text-danger hover:text-danger/80 transition-colors cursor-pointer">Clear all</button>
          </div>

          {/* Quality Slider */}
          <div>
            <label className="text-sm font-medium text-text mb-2 block">Quality: {quality}%</label>
            <input type="range" min={10} max={100} value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full accent-primary cursor-pointer" />
            <div className="flex justify-between text-xs text-text-muted mt-1">
              <span>Max compression</span><span>Best quality</span>
            </div>
          </div>

          {/* Max Dimension */}
          <div>
            <label className="text-sm font-medium text-text mb-2 block">Max Width/Height (optional)</label>
            <input type="number" value={maxDim || ''} onChange={(e) => setMaxDim(e.target.value ? Number(e.target.value) : undefined)} placeholder="e.g. 1920" className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-text placeholder:text-text-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all" />
          </div>

          {/* Actions */}
          {processing ? (
            <div>
              <ProcessingLoader message={`Compressing ${progress}/${files.length}...`} />
              <div className="w-full bg-surface-light rounded-full h-2 mt-4">
                <div className="bg-primary rounded-full h-2 transition-all" style={{ width: `${(progress / files.length) * 100}%` }} />
              </div>
            </div>
          ) : results.length === 0 ? (
            <button onClick={handleCompress} className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-hover text-white font-semibold text-sm shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow cursor-pointer">
              Compress {files.length} Image(s)
            </button>
          ) : null}

          {/* Results */}
          {results.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              <h3 className="text-sm font-semibold text-text">Results</h3>
              {results.map((r, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-surface rounded-xl border border-border shadow-xs">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text truncate">{files[i].name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-text-muted">{formatFileSize(r.originalSize)}</span>
                      <ArrowDown className="w-3 h-3 text-accent" />
                      <span className="text-xs text-accent font-medium">{formatFileSize(r.compressedSize)}</span>
                      <span className="text-xs text-accent">(-{r.reductionPercent}%)</span>
                    </div>
                  </div>
                  <DownloadButton onClick={() => handleDownload(i)} label="Download" />
                </div>
              ))}
            </motion.div>
          )}
        </div>
      )}
    </ToolContainer>
  );
}
