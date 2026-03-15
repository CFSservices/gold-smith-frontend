import { useCallback, useState } from 'react';

export interface UseReorderableListOptions<T> {
  items: T[];
  setItems: React.Dispatch<React.SetStateAction<T[]>>;
  getItemId: (item: T) => string;
}

export function useReorderableList<T>({
  items,
  setItems,
  getItemId,
}: UseReorderableListOptions<T>) {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const onDragStart = useCallback(
    (e: React.DragEvent, id: string) => {
      setDraggedId(id);
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', id);
    },
    []
  );

  const onDragOver = useCallback(
    (e: React.DragEvent, id: string) => {
      e.preventDefault();
      if (draggedId && draggedId !== id) setDragOverId(id);
    },
    [draggedId]
  );

  const onDragLeave = useCallback(() => {
    setDragOverId(null);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent, targetId: string) => {
      e.preventDefault();
      setDragOverId(null);
      setDraggedId(null);
      const sourceId = e.dataTransfer.getData('text/plain');
      if (!sourceId || sourceId === targetId) return;
      setItems((prev) => {
        const srcIdx = prev.findIndex((item) => getItemId(item) === sourceId);
        const tgtIdx = prev.findIndex((item) => getItemId(item) === targetId);
        if (srcIdx === -1 || tgtIdx === -1) return prev;
        const arr = [...prev];
        const [removed] = arr.splice(srcIdx, 1);
        arr.splice(tgtIdx, 0, removed);
        return arr;
      });
    },
    [getItemId, setItems]
  );

  const onDragEnd = useCallback(() => {
    setDraggedId(null);
    setDragOverId(null);
  }, []);

  return {
    draggedId,
    dragOverId,
    onDragStart,
    onDragOver,
    onDragLeave,
    onDrop,
    onDragEnd,
  };
}