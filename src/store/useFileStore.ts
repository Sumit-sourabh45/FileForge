import { create } from 'zustand';
import { FileItem, ProcessingStatus } from '@/types';
import { generateId } from '@/utils/fileHelpers';

interface FileStore {
  // State
  files: FileItem[];
  status: ProcessingStatus;
  error: string | null;

  // Actions
  addFiles: (newFiles: File[], generatePreviews?: boolean) => Promise<void>;
  removeFile: (id: string) => void;
  reorderFiles: (activeId: string, overId: string) => void;
  clearFiles: () => void;
  setStatus: (status: ProcessingStatus) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useFileStore = create<FileStore>((set, get) => ({
  files: [],
  status: 'idle',
  error: null,

  addFiles: async (newFiles: File[], generatePreviews = false) => {
    const fileItems: FileItem[] = await Promise.all(
      newFiles.map(async (file) => {
        let preview: string | undefined;
        if (generatePreviews && file.type.startsWith('image/')) {
          preview = URL.createObjectURL(file);
        }
        return {
          id: generateId(),
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          preview,
        };
      })
    );
    set((state) => ({ files: [...state.files, ...fileItems] }));
  },

  removeFile: (id: string) => {
    const file = get().files.find((f) => f.id === id);
    if (file?.preview) URL.revokeObjectURL(file.preview);
    set((state) => ({ files: state.files.filter((f) => f.id !== id) }));
  },

  reorderFiles: (activeId: string, overId: string) => {
    set((state) => {
      const oldIndex = state.files.findIndex((f) => f.id === activeId);
      const newIndex = state.files.findIndex((f) => f.id === overId);
      if (oldIndex === -1 || newIndex === -1) return state;

      const newFiles = [...state.files];
      const [removed] = newFiles.splice(oldIndex, 1);
      newFiles.splice(newIndex, 0, removed);
      return { files: newFiles };
    });
  },

  clearFiles: () => {
    get().files.forEach((f) => {
      if (f.preview) URL.revokeObjectURL(f.preview);
    });
    set({ files: [] });
  },

  setStatus: (status) => set({ status }),
  setError: (error) => set({ error }),

  reset: () => {
    get().files.forEach((f) => {
      if (f.preview) URL.revokeObjectURL(f.preview);
    });
    set({ files: [], status: 'idle', error: null });
  },
}));
