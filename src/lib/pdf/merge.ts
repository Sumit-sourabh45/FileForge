import { PDFDocument } from 'pdf-lib';
import { readFileAsArrayBuffer } from '@/utils/fileHelpers';

/**
 * Merge multiple PDF files into a single PDF document.
 * Pages are added in the order of the input files array.
 */
export async function mergePdfs(pdfFiles: File[]): Promise<Uint8Array> {
  const mergedDoc = await PDFDocument.create();

  for (const file of pdfFiles) {
    const fileBytes = await readFileAsArrayBuffer(file);
    const pdfDoc = await PDFDocument.load(fileBytes);
    const copiedPages = await mergedDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());

    for (const page of copiedPages) {
      mergedDoc.addPage(page);
    }
  }

  return mergedDoc.save();
}

/**
 * Get the page count from a PDF file (used for UI display)
 */
export async function getPdfPageCount(file: File): Promise<number> {
  const fileBytes = await readFileAsArrayBuffer(file);
  const pdfDoc = await PDFDocument.load(fileBytes, { ignoreEncryption: true });
  return pdfDoc.getPageCount();
}
