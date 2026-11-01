import imageCompression from 'browser-image-compression';
import { CompressionResult } from '@/types';

interface ImageCompressOptions {
  /** Quality from 0 to 1 (default: 0.7) */
  quality: number;
  /** Maximum width or height in pixels (default: undefined = no resize) */
  maxWidthOrHeight?: number;
}

/**
 * Compress a single image file using browser-image-compression.
 * Uses Web Workers to avoid blocking the UI thread.
 */
export async function compressImage(
  file: File,
  options: ImageCompressOptions
): Promise<CompressionResult> {
  const originalSize = file.size;

  // browser-image-compression expects maxSizeMB, but we control via quality
  const compressed = await imageCompression(file, {
    maxSizeMB: (file.size / (1024 * 1024)) * options.quality, // Target MB based on quality
    maxWidthOrHeight: options.maxWidthOrHeight,
    useWebWorker: true,
    initialQuality: options.quality,
    alwaysKeepResolution: !options.maxWidthOrHeight,
  });

  const compressedSize = compressed.size;

  return {
    originalSize,
    compressedSize,
    reductionPercent: Math.round(((originalSize - compressedSize) / originalSize) * 100),
    data: compressed,
  };
}

/**
 * Compress multiple images in sequence
 */
export async function compressImages(
  files: File[],
  options: ImageCompressOptions,
  onProgress?: (index: number) => void
): Promise<CompressionResult[]> {
  const results: CompressionResult[] = [];

  for (let i = 0; i < files.length; i++) {
    const result = await compressImage(files[i], options);
    results.push(result);
    onProgress?.(i + 1);
  }

  return results;
}
