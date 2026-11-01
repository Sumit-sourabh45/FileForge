import { PDFDocument } from 'pdf-lib';
import { readFileAsArrayBuffer } from '@/utils/fileHelpers';

/**
 * Convert an array of image Files into a single PDF document.
 * Each image is placed on its own page, scaled to fit A4 dimensions.
 */
export async function imagesToPdf(imageFiles: File[]): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();

  for (const file of imageFiles) {
    const imageBytes = await readFileAsArrayBuffer(file);
    const uint8 = new Uint8Array(imageBytes);

    let image;
    if (file.type === 'image/png') {
      image = await pdfDoc.embedPng(uint8);
    } else {
      // JPEG and WebP (WebP will be converted via canvas fallback)
      try {
        image = await pdfDoc.embedJpg(uint8);
      } catch {
        // Fallback: convert to JPEG via canvas for unsupported formats
        const jpgBytes = await convertToJpeg(file);
        image = await pdfDoc.embedJpg(jpgBytes);
      }
    }

    // A4 dimensions in points (72 points per inch)
    const A4_WIDTH = 595.28;
    const A4_HEIGHT = 841.89;
    const PADDING = 40;

    const maxWidth = A4_WIDTH - PADDING * 2;
    const maxHeight = A4_HEIGHT - PADDING * 2;

    // Scale image to fit within A4 while preserving aspect ratio
    const imgAspect = image.width / image.height;
    const pageAspect = maxWidth / maxHeight;

    let drawWidth: number;
    let drawHeight: number;

    if (imgAspect > pageAspect) {
      drawWidth = maxWidth;
      drawHeight = maxWidth / imgAspect;
    } else {
      drawHeight = maxHeight;
      drawWidth = maxHeight * imgAspect;
    }

    const page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
    const x = (A4_WIDTH - drawWidth) / 2;
    const y = (A4_HEIGHT - drawHeight) / 2;

    page.drawImage(image, { x, y, width: drawWidth, height: drawHeight });
  }

  return pdfDoc.save();
}

/**
 * Convert any image file to JPEG using canvas (fallback for unsupported formats)
 */
async function convertToJpeg(file: File): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url);
          if (!blob) return reject(new Error('Canvas conversion failed'));
          blob.arrayBuffer().then((buf) => resolve(new Uint8Array(buf)));
        },
        'image/jpeg',
        0.92
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    img.src = url;
  });
}
