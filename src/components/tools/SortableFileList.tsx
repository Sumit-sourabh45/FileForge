'use client';

import { ReactNode } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AnimatePresence } from 'framer-motion';
import { FileItem } from '@/types';
import FileCard from '@/components/upload/FileCard';

interface SortableFileListProps {
  files: FileItem[];
  onReorder: (activeId: string, overId: string) => void;
  onRemove: (id: string) => void;
  renderExtra?: (file: FileItem) => ReactNode;
}

function SortableItem({
  file,
  onRemove,
  extra,
}: {
  file: FileItem;
  onRemove: (id: string) => void;
  extra?: ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: file.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <FileCard
        id={file.id}
        name={file.name}
        size={file.size}
        type={file.type}
        preview={file.preview}
        onRemove={onRemove}
        showDragHandle
        dragHandleProps={listeners}
        extra={extra}
      />
    </div>
  );
}

export default function SortableFileList({
  files,
  onReorder,
  onRemove,
  renderExtra,
}: SortableFileListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      onReorder(active.id as string, over.id as string);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={files.map((f) => f.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {files.map((file) => (
              <SortableItem
                key={file.id}
                file={file}
                onRemove={onRemove}
                extra={renderExtra?.(file)}
              />
            ))}
          </AnimatePresence>
        </div>
      </SortableContext>
    </DndContext>
  );
}
