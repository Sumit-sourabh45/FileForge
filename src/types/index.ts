/** Represents a file that has been loaded into the app */
export interface FileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  preview?: string; // Object URL for image previews
}

/** Result of a compression operation */
export interface CompressionResult {
  originalSize: number;
  compressedSize: number;
  reductionPercent: number;
  data: Uint8Array | File;
}

/** Compression level presets */
export type CompressionLevel = 'low' | 'medium' | 'high';

/** Processing status for tool operations */
export type ProcessingStatus = 'idle' | 'processing' | 'done' | 'error';

/** Tool definition for the landing page grid */
export interface ToolDefinition {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: string; // Lucide icon name
  gradient: string; // Tailwind gradient classes
  color: string;
}
