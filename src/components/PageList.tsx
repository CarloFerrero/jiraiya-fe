import React from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Merge, Sparkles } from 'lucide-react';
import { PageItem } from './PageItem';
import type { Page } from '@/types';

interface PageListProps {
  pages: Page[];
  onReorderPages: (startIndex: number, endIndex: number) => void;
  onRenamePage: (id: string, newName: string) => void;
  onDeletePage: (id: string) => void;
  onMergeText: () => void;
  canMerge: boolean;
}

export const PageList: React.FC<PageListProps> = ({
  pages,
  onReorderPages,
  onRenamePage,
  onDeletePage,
  onMergeText,
  canMerge
}) => {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    onReorderPages(result.source.index, result.destination.index);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">📄 Pagine caricate</h2>
        <span className="text-sm text-muted-foreground">({pages.length})</span>
      </div>

      {pages.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>Nessuna pagina caricata</p>
          <p className="text-sm mt-1">Usa il dropzone sopra per iniziare</p>
        </div>
      ) : (
        <>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="pages">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`space-y-2 transition-colors duration-200 ${
                    snapshot.isDraggingOver ? 'bg-accent/20 rounded-lg p-2' : ''
                  }`}
                >
                  {pages.map((page, index) => (
                    <PageItem
                      key={page.id}
                      page={page}
                      index={index}
                      onRename={onRenamePage}
                      onDelete={onDeletePage}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <Separator />

          <div className="space-y-2">
            <Button
              onClick={onMergeText}
              disabled={!canMerge}
              className="w-full bg-gradient-sensei hover:shadow-warm transition-all duration-300"
            >
              <Merge className="w-4 h-4 mr-2" />
              Unisci testo OCR
            </Button>
            
            {!canMerge && pages.length > 0 && (
              <p className="text-xs text-muted-foreground text-center">
                Completa l'OCR di tutte le pagine per unire il testo
              </p>
            )}
          </div>

          <div className="bg-muted/50 rounded-lg p-3">
            <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Statistiche OCR
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground">Completate:</span>
                <span className="ml-1 font-medium">
                  {pages.filter(p => p.status === 'completed').length}/{pages.length}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Caratteri:</span>
                <span className="ml-1 font-medium">
                  {pages.reduce((sum, p) => sum + p.ocrText.length, 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};