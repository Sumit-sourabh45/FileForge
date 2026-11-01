import { PDFDocument } from 'pdf-lib';
import { readFileAsArrayBuffer } from '@/utils/fileHelpers';

/**
 * "Unlock" a PDF by loading it with ignoreEncryption and re-saving
 * as a clean document. This works for PDFs with owner-password
 * restrictions (print, copy, edit restrictions) but NOT for
 * user-password protected PDFs that require a password to open.
 *
 * For user-password PDFs, pdf-lib can bypass some simple encryption
 * via ignoreEncryption. This is a best-effort approach.
 */
export async function unlockPdf(file: File, _password: string): Promise<Uint8Array> {
  const fileBytes = await readFileAsArrayBuffer(file);

  try {
    // Load with ignoreEncryption to bypass permission restrictions
    const srcDoc = await PDFDocument.load(fileBytes, {
      ignoreEncryption: true,
    });

    // Create a clean copy without any encryption flags
    const outDoc = await PDFDocument.create();
    const pages = await outDoc.copyPages(srcDoc, srcDoc.getPageIndices());
    for (const page of pages) {
      outDoc.addPage(page);
    }

    // Copy basic metadata
    const title = srcDoc.getTitle();
    if (title) outDoc.setTitle(title);

    outDoc.setProducer('FileForge');
    outDoc.setCreator('FileForge');

    return await outDoc.save();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(
      `Failed to unlock PDF. The file may use strong encryption that requires server-side processing. Error: ${message}`
    );
  }
}

/**
 * Check if a PDF file appears to be encrypted
 */
export async function isPdfEncrypted(file: File): Promise<boolean> {
  const fileBytes = await readFileAsArrayBuffer(file);
  try {
    await PDFDocument.load(fileBytes, { ignoreEncryption: false });
    return false;
  } catch {
    return true;
  }
}
