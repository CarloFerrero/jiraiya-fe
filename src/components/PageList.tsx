import React from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Merge, Sparkles } from 'lucide-react';
import { PageItem } from './PageItem';
import type { Page } from '@/types';

interface PageListProps {
  pages: Page[];
  onReorder: (startIndex: number, endIndex: number) => void;
  onRename: (id: string, newName: string) => void;
  onDelete: (id: string) => void;
  onRetry: (page: Page) => void;
}

export const PageList: React.FC<PageListProps> = ({
  pages,
  onReorder,
  onRename,
  onDelete,
  onRetry
}) => {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    onReorder(result.source.index, result.destination.index);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="pages">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`space-y-1 transition-colors duration-200 ${
              snapshot.isDraggingOver ? 'bg-accent/20 rounded-lg p-1' : ''
            }`}
          >
            {pages.map((page, index) => (
              <PageItem
                key={page.id}
                page={page}
                index={index}
                onRename={onRename}
                onDelete={onDelete}
                onRetry={onRetry}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};