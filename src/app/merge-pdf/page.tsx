'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { ToolHeader, ToolContainer } from '@/components/tools/ToolHeader';
import UploadZone from '@/components/upload/UploadZone';
import SortableFileList from '@/components/tools/SortableFileList';
import EmptyState from '@/components/tools/EmptyState';
import ProcessingLoader from '@/components/tools/ProcessingLoader';
import DownloadButton from '@/components/tools/DownloadButton';
import { useFileStore } from '@/store/useFileStore';
import { ACCEPTED_FILES, TOOLS } from '@/utils/constants';
import { mergePdfs, getPdfPageCount } from '@/lib/pdf/merge';
import { downloadBlob, formatFileSize } from '@/utils/fileHelpers';
import { FileItem } from '@/types';
import { useEffect } from 'react';

const tool = TOOLS.find((t) => t.id === 'merge-pdf')!;

export default function MergePdfPage() {
  const { files, addFiles, removeFile, reorderFiles, clearFiles } = useFileStore();
  const [processing, setProcessing] = useState(false);
  const [mergedPdf, setMergedPdf] = useState<Uint8Array | null>(null);
  const [pageCounts, setPageCounts] = useState<Record<string, number>>({});

  const handleAddFiles = useCallback(
    async (newFiles: File[]) => {
      await addFiles(newFiles);
      setMergedPdf(null);
      toast.success(`${newFiles.length} PDF(s) added`);
    },
    [addFiles]
  );

  // Get page counts for new files
  useEffect(() => {
    const fetchCounts = async () => {
      const newCounts: Record<string, number> = { ...pageCounts };
      for (const f of files) {
        if (!newCounts[f.id]) {
          try {
            newCounts[f.id] = await getPdfPageCount(f.file);
          } catch {
            newCounts[f.id] = 0;
          }
        }
      }
      setPageCounts(newCounts);
    };
    fetchCounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files.length]);

  const handleMerge = async () => {
    if (files.length < 2) {
      toast.error('Please add at least 2 PDFs to merge');
      return;
    }
    setProcessing(true);
    setMergedPdf(null);

    try {
      const pdfBytes = await mergePdfs(files.map((f) => f.file));
      setMergedPdf(pdfBytes);
      toast.success('PDFs merged successfully!');
    } catch (error) {
      toast.error('Failed to merge PDFs. Please ensure they are valid PDF files.');
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (mergedPdf) {
      downloadBlob(mergedPdf, 'merged.pdf');
    }
  };

  const handleClear = () => {
    clearFiles();
    setMergedPdf(null);
    setPageCounts({});
  };

  const renderExtra = (file: FileItem) => {
    const count = pageCounts[file.id];
    if (count === undefined) return null;
    return (
      <span className="text-xs text-primary font-medium">
        {count} {count === 1 ? 'page' : 'pages'}
      </span>
    );
  };

  return (
    <ToolContainer>
      <ToolHeader
        title={tool.title}
        description={tool.description}
        icon={tool.icon}
        gradient={tool.gradient}
      />

      <UploadZone
        accept={ACCEPTED_FILES.pdfs}
        onFilesAdded={handleAddFiles}
        label="Drop PDF files here or click to browse"
        sublabel="Add multiple PDFs to merge into one"
        disabled={processing}
      />

      <div className="mt-6">
        {files.length === 0 ? (
          <EmptyState
            title="No PDFs added"
            description="Upload at least 2 PDFs. Drag to reorder before merging."
          />
        ) : (
          <>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-text-muted">{files.length} PDF(s) — drag to reorder</p>
              <button
                onClick={handleClear}
                className="text-xs text-danger hover:text-danger/80 transition-colors cursor-pointer"
              >
                Clear all
              </button>
            </div>
            <SortableFileList
              files={files}
              onReorder={reorderFiles}
              onRemove={removeFile}
              renderExtra={renderExtra}
            />
          </>
        )}
      </div>

      {processing ? (
        <ProcessingLoader message="Merging your PDFs..." />
      ) : (
        <div className="mt-8 flex flex-wrap items-center gap-3">
          {files.length >= 2 && !mergedPdf && (
            <button
              onClick={handleMerge}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-hover text-white font-semibold text-sm shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow cursor-pointer"
            >
              Merge {files.length} PDFs
            </button>
          )}

          {mergedPdf && (
            <div className="flex items-center gap-4">
              <DownloadButton onClick={handleDownload} label="Download Merged PDF" />
              <span className="text-sm text-text-muted">
                {formatFileSize(mergedPdf.length)}
              </span>
            </div>
          )}
        </div>
      )}
    </ToolContainer>
  );
}
