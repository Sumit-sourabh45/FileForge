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
import { ACCEPTED_FILES } from '@/utils/constants';
import { imagesToPdf } from '@/lib/pdf/imageToPdf';
import { downloadBlob } from '@/utils/fileHelpers';
import { TOOLS } from '@/utils/constants';

const tool = TOOLS.find((t) => t.id === 'image-to-pdf')!;

export default function ImageToPdfPage() {
  const { files, addFiles, removeFile, reorderFiles, clearFiles } = useFileStore();
  const [processing, setProcessing] = useState(false);
  const [pdfReady, setPdfReady] = useState<Uint8Array | null>(null);

  const handleAddFiles = useCallback(
    async (newFiles: File[]) => {
      await addFiles(newFiles, true); // generate image previews
      setPdfReady(null);
      toast.success(`${newFiles.length} image(s) added`);
    },
    [addFiles]
  );

  const handleConvert = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    setPdfReady(null);

    try {
      const pdfBytes = await imagesToPdf(files.map((f) => f.file));
      setPdfReady(pdfBytes);
      toast.success('PDF created successfully!');
    } catch (error) {
      toast.error('Failed to create PDF. Please try again.');
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (pdfReady) {
      downloadBlob(pdfReady, 'images-to-pdf.pdf');
    }
  };

  const handleClear = () => {
    clearFiles();
    setPdfReady(null);
  };

  return (
    <ToolContainer>
      <ToolHeader
        title={tool.title}
        description={tool.description}
        icon={tool.icon}
        gradient={tool.gradient}
      />

      {/* Upload Zone */}
      <UploadZone
        accept={ACCEPTED_FILES.images}
        onFilesAdded={handleAddFiles}
        label="Drop images here or click to browse"
        sublabel="Supports JPEG, PNG, WebP"
        disabled={processing}
      />

      {/* File List */}
      <div className="mt-6">
        {files.length === 0 ? (
          <EmptyState
            title="No images added"
            description="Upload images above. Drag to reorder them before conversion."
          />
        ) : (
          <>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-text-muted">{files.length} image(s) — drag to reorder</p>
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
            />
          </>
        )}
      </div>

      {/* Actions */}
      {processing ? (
        <ProcessingLoader message="Creating your PDF..." />
      ) : (
        <div className="mt-8 flex flex-wrap items-center gap-3">
          {files.length > 0 && !pdfReady && (
            <button
              onClick={handleConvert}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-hover text-white font-semibold text-sm shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow cursor-pointer"
            >
              Convert to PDF
            </button>
          )}

          {pdfReady && (
            <DownloadButton onClick={handleDownload} label="Download PDF" />
          )}
        </div>
      )}
    </ToolContainer>
  );
}
