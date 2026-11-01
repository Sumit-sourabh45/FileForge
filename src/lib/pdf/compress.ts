import { PDFDocument } from 'pdf-lib';
import { readFileAsArrayBuffer } from '@/utils/fileHelpers';
import { CompressionLevel, CompressionResult } from '@/types';

/**
 * Compress a PDF by copying pages into a new document,
 * stripping metadata, and re-saving with optimized settings.
 *
 * True image-level compression would require pdfjs-dist for rendering;
 * this approach focuses on structural optimization that works reliably
 * for all PDF types.
 */
export async function compressPdf(
  file: File,
  level: CompressionLevel
): Promise<CompressionResult> {
  const originalSize = file.size;
  const fileBytes = await readFileAsArrayBuffer(file);

  // Load the source PDF
  const srcDoc = await PDFDocument.load(fileBytes, { ignoreEncryption: true });

  // Create a new clean document (strips unused objects, metadata bloat)
  const outDoc = await PDFDocument.create();

  // Copy all pages — this drops orphaned objects and unused resources
  const pages = await outDoc.copyPages(srcDoc, srcDoc.getPageIndices());
  for (const page of pages) {
    outDoc.addPage(page);
  }

  // Strip metadata to reduce size
  outDoc.setTitle('');
  outDoc.setAuthor('');
  outDoc.setSubject('');
  outDoc.setKeywords([]);
  outDoc.setProducer('FileForge');
  outDoc.setCreator('FileForge');

  // Save with options based on compression level
  const compressedBytes = await outDoc.save({
    useObjectStreams: level !== 'high', // Object streams = smaller files
    addDefaultPage: false,
  });

  const compressedSize = compressedBytes.length;

  // If "compressed" is larger or equal, return original size info
  if (compressedSize >= originalSize) {
    return {
      originalSize,
      compressedSize: originalSize,
      reductionPercent: 0,
      data: new Uint8Array(fileBytes) as unknown as Uint8Array,
    };
  }

  return {
    originalSize,
    compressedSize,
    reductionPercent: Math.round(((originalSize - compressedSize) / originalSize) * 100),
    data: compressedBytes as unknown as Uint8Array,
  };
}
